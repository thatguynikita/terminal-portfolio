import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * The S3 deploy script sets every object's Content-Type from an explicit
 * table, because S3-compatible storage never adds a charset and `aws s3
 * sync` only guesses. The table is parsed straight out of the script so
 * these tests see exactly what a deploy would use.
 */
const SCRIPT = join(process.cwd(), "scripts/deploy-s3.sh");
const source = readFileSync(SCRIPT, "utf8");

const table = new Map<string, { type: string; cache: string }>();
for (const m of source.matchAll(/^([a-z0-9]+)\|([^|\n]+)\|(SHORT|MEDIUM|LONG)$/gm)) {
  table.set(m[1] as string, { type: m[2] as string, cache: m[3] as string });
}

const DIST = join(process.cwd(), "dist");
const built = existsSync(join(DIST, "index.html"));

describe("scripts/deploy-s3.sh", () => {
  it("is valid POSIX shell", () => {
    expect(() => execFileSync("sh", ["-n", SCRIPT])).not.toThrow();
  });

  it("has a content-type table", () => {
    expect(table.size).toBeGreaterThan(8);
    for (const ext of ["html", "css", "js", "txt", "xml", "json", "webmanifest", "ico", "png"]) {
      expect(table.has(ext), `no entry for .${ext}`).toBe(true);
    }
  });

  // The bug the table exists for: text served without a charset is decoded
  // as the browser's default — llms.txt in Cyrillic came out garbled.
  it("declares charset=utf-8 on every text type", () => {
    for (const [ext, { type }] of table) {
      if (/^(text\/|application\/(xml|json|manifest\+json)|image\/svg)/.test(type)) {
        expect(type, `.${ext} lacks a charset`).toContain("charset=utf-8");
      }
    }
  });

  it("caches by how each file changes: hashed for a year, images a week, pages minutes", () => {
    for (const ext of ["css", "js", "woff2"]) expect(table.get(ext)?.cache).toBe("LONG");
    for (const ext of ["png", "jpg", "svg", "ico"]) expect(table.get(ext)?.cache).toBe("MEDIUM");
    for (const ext of ["html", "txt", "xml", "webmanifest"])
      expect(table.get(ext)?.cache).toBe("SHORT");
  });

  it("refuses to run without a bucket, and without a build", () => {
    const run = (env: Record<string, string>) =>
      execFileSync("sh", [SCRIPT], { env: { ...process.env, ...env }, stdio: "pipe" }).toString();
    expect(() => run({ S3_BUCKET: "" })).toThrow(/S3_BUCKET/);
    // A bucket but no dist/: the guard fires before any aws call.
    expect(() =>
      execFileSync("sh", [SCRIPT], {
        env: { ...process.env, S3_BUCKET: "x" },
        cwd: "/tmp",
        stdio: "pipe",
      }),
    ).toThrow(/npm run build/);
  });

  // Every file the build emits must have a type — the script would refuse
  // the deploy otherwise, and it's better to learn that here.
  (built ? it : it.skip)("covers every file in the current dist/", () => {
    // Read by other hosts, skipped by name here — mirrors PAGES_ONLY in the script.
    const skipped = (/^PAGES_ONLY="([^"]+)"/m.exec(source)?.[1] ?? "").split(" ");
    expect(skipped).toEqual(["CNAME", ".nojekyll", "_headers", "_redirects"]);
    const pagesOnly = new Set(skipped);
    const files = readdirSync(DIST, { recursive: true, withFileTypes: true })
      .filter((d) => d.isFile())
      .map((d) => join(d.parentPath, d.name).slice(DIST.length + 1));
    const unknown = files.filter((f) => {
      const base = f.split("/").pop() as string;
      if (pagesOnly.has(base)) return false;
      const ext = base.includes(".") ? base.split(".").pop() : "";
      return !ext || !table.has(ext);
    });
    expect(unknown, "files the deploy script has no content-type for").toEqual([]);
  });
});

/**
 * Cloudflare Pages reads cache rules from public/_headers; the bucket gets them
 * from the script's table. One policy, two spellings — this keeps them equal.
 */
describe("public/_headers", () => {
  const headers = readFileSync(join(process.cwd(), "public/_headers"), "utf8");
  // A rule is a pattern line followed by indented header lines; the last
  // Cache-Control a rule sets is the one that counts.
  const blocks = [...headers.matchAll(/^(\/\S*)\n((?:[ \t]+.*(?:\n|$))+)/gm)].map((m) => ({
    pattern: m[1] as string,
    body: m[2] as string,
  }));
  const rules = new Map(
    blocks.map((b) => [
      b.pattern,
      [...b.body.matchAll(/^[ \t]+Cache-Control: (.+)$/gm)].pop()?.[1] as string,
    ]),
  );
  const tier = (name: string) => new RegExp(`^${name}="([^"]+)"`, "m").exec(source)?.[1];

  it("spells the same three cache tiers as the S3 script", () => {
    expect(rules.get("/*"), "everything else").toBe(tier("SHORT"));
    expect(rules.get("/assets/*"), "hashed assets").toBe(tier("LONG"));
    expect(rules.get("/assets/img/*"), "images").toBe(tier("MEDIUM"));
  });

  // Cloudflare combines the headers of every matching rule, so a narrower
  // rule has to detach the wider rule's Cache-Control before setting its
  // own, and rules must run general → specific.
  it("orders rules general to specific and detaches the inherited Cache-Control", () => {
    expect(blocks.map((b) => b.pattern)).toEqual(["/*", "/assets/*", "/assets/img/*"]);
    for (const b of blocks.slice(1)) {
      expect(b.body, `${b.pattern} detaches Cache-Control`).toMatch(/^[ \t]+! Cache-Control$/m);
    }
  });
});

/**
 * Cloudflare's default HTML handling redirects /cv.html to /cv — a URL no
 * canonical, sitemap row or other host uses — so it's off, and with it off
 * only exact paths resolve: the one rewrite in _redirects is what serves /.
 */
describe("wrangler.json and public/_redirects", () => {
  const wrangler = JSON.parse(readFileSync(join(process.cwd(), "wrangler.json"), "utf8"));
  const redirects = readFileSync(join(process.cwd(), "public/_redirects"), "utf8");
  const rules = redirects.split("\n").filter((l) => l.trim() && !l.startsWith("#"));

  it("serves exact paths only, with the 404 page for the rest", () => {
    expect(wrangler.assets.html_handling).toBe("none");
    expect(wrangler.assets.not_found_handling).toBe("404-page");
    expect(wrangler.main, "the site Worker carries no code").toBeUndefined();
  });

  it("rewrites / to index.html and nothing else", () => {
    expect(rules).toEqual(["/ /index.html 200"]);
  });
});
