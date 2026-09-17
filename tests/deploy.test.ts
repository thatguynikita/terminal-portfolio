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
for (const m of source.matchAll(/^([a-z0-9]+)\|([^|\n]+)\|(SHORT|LONG)$/gm)) {
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

  it("caches only what Vite content-hashes for a year", () => {
    for (const ext of ["css", "js"]) expect(table.get(ext)?.cache).toBe("LONG");
    for (const ext of ["html", "txt", "xml", "webmanifest", "png"])
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
    const pagesOnly = new Set(["CNAME", ".nojekyll"]);
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
