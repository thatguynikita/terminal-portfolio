import { describe, expect, it } from "vitest";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import profile, { MESSAGES } from "../profile.config";
import { cvLocales, cvUrl } from "../src/cv/url";
import { renderContentSignal, socialsFor } from "../src/core/profile";
import { escapeHtml } from "../src/core/html";

// The same resolution vite.config.ts uses; vitest.config.ts loads .env into
// process.env so a local dist/ and this suite agree on the origin.
const SITE_URL = (process.env["SITE_URL"] ?? "").replace(/\/$/, "");

/**
 * Asserts against the real `dist/`, because these files only exist after a
 * build — and because the claim being tested is about what a crawler
 * fetches, not about what a function returns.
 *
 * Skipped when dist/ is absent so `npm test` works on a clean checkout;
 * CI builds before testing.
 */
const DIST = join(process.cwd(), "dist");
const built = existsSync(join(DIST, "index.html"));
const read = (p: string): string => readFileSync(join(DIST, p), "utf8");
const suite = built ? describe : describe.skip;

const locales = cvLocales(profile);

suite("built output", () => {
  // The two shell switches remove markup at build rather than hiding it, so
  // the built page carries #boot / #chips exactly when the config says so.
  it("ships the boot screen and the chip bar only when they are switched on", () => {
    const index = read("index.html");
    expect(index.includes('id="boot"'), "#boot vs terminal.bootScreen").toBe(profile.terminal.bootScreen);
    expect(index.includes('id="chips"'), "#chips vs terminal.chips").toBe(profile.terminal.chips);
  });

  /**
   * `seo.title` is gone: the terminal page is titled from what the config
   * already says about you, so there's no fourth spelling of name + role.
   * The CV keeps its own `name — CV — hostname`, the 404 its `404 — host`.
   */
  it("titles the terminal page name — role", () => {
    const lang = profile.terminal.defaultLocale;
    const index = read("index.html");
    const expected = escapeHtml(`${profile.identity.name[lang]} — ${profile.identity.role[lang]}`);
    expect(index).toContain(`<title>${expected}</title>`);
    if (profile.seo.enableSocialCards) {
      expect(index).toContain(`<meta property="og:title" content="${expected}" />`);
    }
  });

  /**
   * The three head injections are each a switch in `seo`. Every page is
   * checked both ways: present with the right content when on, absent when
   * off — so a fork that turns one off gets a clean head, not a stub.
   */
  describe("head switches", () => {
    const lang = profile.terminal.defaultLocale;
    // Each page with the locale its content is in; index and 404 are the default's.
    const pages = (): Array<[string, typeof lang]> => [
      ["index.html", lang],
      ["404.html", lang],
      ...locales.map((l): [string, typeof lang] => [cvUrl(profile, l).replace(/^\//, ""), l]),
    ];

    it("noscript fallback: on the terminal page only, saying role and location", () => {
      const index = read("index.html");
      const noscript = /<noscript>([\s\S]*?)<\/noscript>/.exec(index)?.[1];
      if (!profile.seo.enableNoscript) {
        expect(noscript, "noscript emitted while switched off").toBeUndefined();
        expect(index, "the placeholder should be consumed either way").not.toContain("<!--NOSCRIPT-->");
        return;
      }
      expect(noscript, "no noscript block").toBeDefined();
      expect(noscript, "noscript should lead with the role").toContain(escapeHtml(profile.identity.role[lang]));
      expect(noscript, "noscript should carry the location").toContain(escapeHtml(profile.seo.location[lang]));
      if (profile.cv?.tagline) {
        expect(noscript, "the CV tagline is CV-only").not.toContain(escapeHtml(profile.cv.tagline[lang]));
      }
      for (const [page] of pages().filter(([p]) => p !== "index.html")) {
        expect(read(page), `${page} has a noscript block`).not.toContain("<noscript>");
      }
    });

    it("JSON-LD: a Person on the terminal page and every CV page, or nowhere", () => {
      const { enableJsonLd } = profile.seo;
      for (const [page, locale] of pages()) {
        const html = read(page);
        const scripts = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
        if (!enableJsonLd || page === "404.html") {
          expect(scripts.length, `${page} carries JSON-LD`).toBe(0);
          continue;
        }
        expect(scripts.length, `${page} has no JSON-LD`).toBe(1);
        const data = JSON.parse(scripts[0]![1]!) as { "@type": string; name: string };
        expect(data["@type"]).toBe("Person");
        expect(data.name).toBe(profile.identity.name[locale]);
      }
    });

    it("social cards: og:* and twitter:card on every page, or on none", () => {
      const { enableSocialCards } = profile.seo;
      for (const [page] of pages()) {
        const html = read(page);
        const og = (html.match(/<meta property="og:/g) ?? []).length;
        const twitter = (html.match(/<meta name="twitter:card"/g) ?? []).length;
        if (!enableSocialCards) {
          expect(og + twitter, `${page} has share tags while switched off`).toBe(0);
          continue;
        }
        expect(og, `${page} is missing og: tags`).toBeGreaterThanOrEqual(4);
        expect(twitter, `${page} is missing twitter:card`).toBe(1);
      }
    });
  });

  // The three discovery files are each a switch in `seo`. Off means absent —
  // not empty, not a stub — so a fork that turns one off ships nothing for it.
  it("emits each discovery file exactly when its switch is on", () => {
    const files: Array<[string, boolean]> = [
      ["robots.txt", profile.seo.enableRobotsTxt],
      ["sitemap.xml", profile.seo.enableSitemap],
      ["llms.txt", profile.seo.enableLlmsTxt],
    ];
    for (const [file, enabled] of files) {
      expect(existsSync(join(DIST, file)), `${file} vs its seo switch`).toBe(enabled);
    }
  });

  it("emits one CV page per configured locale", () => {
    // No `cv` in the config means no pages, which is a valid setup.
    for (const locale of locales) {
      const path = cvUrl(profile, locale).replace(/^\//, "");
      expect(existsSync(join(DIST, path)), `${path} was not built`).toBe(true);
    }
  });

  /**
   * public/assets/img/portraits/ holds every persona's portrait — the
   * author's and both examples'. Vite copies public/ verbatim, so this is
   * the guard that a fork with its own photo doesn't ship the other faces.
   */
  it("ships only the configured portrait, and everything else in assets/img", () => {
    const dir = join(DIST, "assets/img/portraits");
    const photo = profile.cv?.photo;
    const shipped = existsSync(dir) ? readdirSync(dir) : [];
    if (photo?.startsWith("/assets/img/portraits/")) {
      expect(shipped).toEqual([photo.split("/").pop()]);
    } else {
      expect(shipped, "no portrait configured, yet portraits shipped").toEqual([]);
    }
    // The non-portrait images are untouched by the pruning.
    const source = readdirSync(join(process.cwd(), "public/assets/img")).filter((f) =>
      /\.(png|jpe?g|webp|svg)$/.test(f)
    );
    for (const f of source) {
      expect(existsSync(join(DIST, "assets/img", f)), `${f} was dropped from dist`).toBe(true);
    }
  });

  it("leaves no llm/ mirror behind", () => {
    expect(existsSync(join(DIST, "llm"))).toBe(false);
  });

  /**
   * The point of selecting locales in profile.config.ts: a catalogue this
   * repo ships but that MESSAGES doesn't import must not reach a visitor.
   * Each locale is roughly a fifth of the JS bundle, so this is bytes, not
   * tidiness. Asserted against the built assets rather than the module
   * graph, because what ships is the only thing that settles it.
   */
  it("ships no catalogue that MESSAGES did not select", () => {
    const shipped = new Set(Object.keys(MESSAGES));
    const onDisk = readdirSync(join(process.cwd(), "src/i18n/messages"))
      .filter((f) => f.endsWith(".ts"))
      .map((f) => f.replace(/\.ts$/, ""));
    const unselected = onDisk.filter((code) => !shipped.has(code));
    if (unselected.length === 0) return; // a fork may ship every locale it has

    const bundle = readdirSync(join(DIST, "assets"))
      .filter((f) => f.endsWith(".js"))
      .map((f) => readFileSync(join(DIST, "assets", f), "utf8"))
      .join("\n");

    for (const code of unselected) {
      // A phrase unique to that catalogue and absent from every other one,
      // so this can't pass by accident on a near-empty file.
      const source = readFileSync(join(process.cwd(), `src/i18n/messages/${code}.ts`), "utf8");
      const marker = source.match(/availableCommands: "([^"]+)"/)?.[1];
      expect(marker, `${code}.ts has no availableCommands string to look for`).toBeTruthy();
      expect(bundle, `${code} was not selected but its text is in the bundle`).not.toContain(
        marker as string
      );
    }
  });

  it("ships the résumé in the raw HTML of every locale", () => {
    for (const locale of locales) {
      const html = read(cvUrl(profile, locale).replace(/^\//, ""));
      // Entities decoded, not dropped — a job title containing "&" reaches
      // the page as "&amp;" and is still the same text a crawler reads.
      const text = html
        .replace(/<script[\s\S]*?<\/script>/g, "")
        .replace(/<[^>]+>/g, " ")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#0?39;/g, "'")
        .replace(/&amp;/g, "&");
      for (const job of profile.cv?.jobs ?? []) {
        expect(text, `${locale}: missing ${job.title[locale]}`).toContain(job.title[locale]);
      }
    }
  });

  // One malformed entry makes Google discard the whole cluster.
  it("gives every CV page a complete, self-referencing hreflang cluster", () => {
    if (locales.length < 2) return;
    for (const locale of locales) {
      const html = read(cvUrl(profile, locale).replace(/^\//, ""));
      for (const alt of locales) {
        expect(html, `${locale} does not reference ${alt}`).toContain(`hreflang="${alt}"`);
      }
      expect(html, `${locale} has no x-default`).toContain('hreflang="x-default"');
      const canonical = /rel="canonical" href="([^"]+)"/.exec(html)?.[1] ?? "";
      expect(
        canonical.endsWith(cvUrl(profile, locale)),
        `${locale} canonicalises to ${canonical || "nothing"}`
      ).toBe(true);
    }
  });

  it("applies the theme before first paint on every page", () => {
    const pages = ["index.html", "404.html", ...locales.map((l) => cvUrl(profile, l).replace(/^\//, ""))];
    for (const page of pages) {
      expect(read(page), `${page} has no theme bootstrap`).toContain("terminal-portfolio:theme");
    }
  });

  (profile.seo.enableSitemap ? describe : describe.skip)("sitemap.xml", () => {
    // describe.skip still evaluates this body, so the read is gated too.
    const xml = built && profile.seo.enableSitemap ? read("sitemap.xml") : "";

    it("lists the home page and every CV page", () => {
      expect(xml).toContain("<loc>");
      for (const locale of locales) {
        expect(xml, `missing ${locale}`).toContain(`${cvUrl(profile, locale)}</loc>`);
      }
    });

    it("lists only pages that were actually built", () => {
      for (const loc of [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1] as string)) {
        const path = new URL(loc).pathname.replace(/^\//, "") || "index.html";
        expect(existsSync(join(DIST, path)), `sitemap lists ${path}, which is not built`).toBe(true);
      }
    });

    it("dates every url, and never in the future", () => {
      const urls = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => m[1] as string);
      expect(urls.length).toBeGreaterThan(0);
      const today = new Date().toISOString().slice(0, 10);
      for (const url of urls) {
        const lastmod = /<lastmod>([^<]+)<\/lastmod>/.exec(url)?.[1] ?? "";
        expect(lastmod, `a url has no lastmod: ${url.slice(0, 60)}`).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(lastmod <= today, `lastmod ${lastmod} is in the future`).toBe(true);
      }
    });

    it("lists the portrait on the CV pages, and only when one is configured", () => {
      const cvBlocks = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)]
        .map((m) => m[1] as string)
        .filter((u) => /cv\.html/.test(u));

      if (!profile.cv?.photo) {
        expect(xml, "an image block with no photo configured").not.toContain("<image:image>");
        return;
      }

      expect(xml, "the image namespace is not declared").toContain("xmlns:image=");
      for (const block of cvBlocks) {
        expect(block, "a CV page has no portrait").toContain("<image:image>");
        const loc = /<image:loc>([^<]+)<\/image:loc>/.exec(block)?.[1] ?? "";
        expect(loc).toContain(profile.cv?.photo);
        // The image must actually have shipped.
        const path = new URL(loc).pathname.replace(/^\//, "");
        expect(existsSync(join(DIST, path)), `sitemap lists ${path}, which is not built`).toBe(true);
        expect(
          /<image:title>[^<]+<\/image:title>/.test(block),
          "the portrait has no title"
        ).toBe(true);
      }
    });

    it("titles the portrait per locale", () => {
      if (!profile.cv?.photo || locales.length < 2) return;
      const titles = [...xml.matchAll(/<image:title>([^<]+)<\/image:title>/g)].map((m) => m[1]);
      expect(new Set(titles).size, "every locale got the same portrait title").toBe(titles.length);
    });

    it("cross-links the language alternates", () => {
      if (locales.length < 2) return;
      for (const locale of locales) {
        expect(xml).toContain(`hreflang="${locale}"`);
      }
    });
  });

  (profile.seo.enableLlmsTxt ? describe : describe.skip)("llms.txt", () => {
    // describe.skip still evaluates this body, so the read is gated too.
    const txt = built && profile.seo.enableLlmsTxt ? read("llms.txt") : "";

    /**
     * Structure per https://llmstxt.org: an H1 name, a blockquote summary,
     * optional free-form detail containing no headings, then H2 sections
     * whose every list item is a markdown link.
     */
    it("opens with an H1 and a blockquote summary", () => {
      const lines = txt.split("\n");
      expect(lines[0], "first line is not an H1").toMatch(/^# \S/);
      const quote = lines.slice(1).find((l) => l.trim() !== "");
      expect(quote, "no blockquote summary after the title").toMatch(/^> \S/);
      // The summary is the role, not the CV's tagline.
      const lang = profile.terminal.defaultLocale;
      expect(quote).toBe(`> ${profile.identity.role[lang]}`);
    });

    it("uses only H1 and H2 headings", () => {
      const headings = [...txt.matchAll(/^(#+)\s/gm)].map((m) => (m[1] as string).length);
      expect(headings[0]).toBe(1);
      expect(headings.filter((h) => h > 2), "headings deeper than H2").toEqual([]);
      expect(headings.filter((h) => h === 1).length, "more than one H1").toBe(1);
    });

    it("makes every list item a markdown link, as the spec requires", () => {
      const items = [...txt.matchAll(/^-\s+(.*)$/gm)].map((m) => m[1] as string);
      expect(items.length).toBeGreaterThan(2);
      for (const item of items) {
        expect(
          item,
          `not a markdown link — "Label: url" text does not conform: ${item.slice(0, 50)}`
        ).toMatch(/^\[[^\]]+\]\([^)]+\)(:\s.*)?$/);
      }
    });

    it("puts no heading inside the free-form detail", () => {
      const detail = txt.slice(txt.indexOf("\n", txt.indexOf("> ")), txt.indexOf("## "));
      expect(detail, "a heading appears before the first H2").not.toMatch(/^#/m);
    });

    it("links every CV page and nothing that is missing", () => {
      for (const locale of locales) {
        expect(txt, `missing ${locale}`).toContain(cvUrl(profile, locale));
      }
      // Only our own pages can be checked against dist/ — social profiles
      // and mailto: links point elsewhere by design.
      const origin = new URL(`${SITE_URL}/`).origin;
      for (const url of [...txt.matchAll(/\]\((https?:\/\/[^)]+)\)/g)].map((m) => m[1] as string)) {
        if (new URL(url).origin !== origin) continue;
        const path = new URL(url).pathname.replace(/^\//, "") || "index.html";
        expect(existsSync(join(DIST, path)), `llms.txt links ${path}, which is not built`).toBe(true);
      }
    });

    it("lists the CV's contact set", () => {
      for (const s of socialsFor(profile, "cv")) {
        expect(txt, `${s.label} is missing`).toContain(`[${s.label}](${s.href})`);
      }
    });
  });

  /**
   * The manifest used to be a static file in public/ with one person's name
   * and host baked in. Nothing renders it visibly, so a fork would have
   * inherited them without noticing.
   */
  describe("site.webmanifest", () => {
    const manifest = built ? JSON.parse(read("site.webmanifest")) : {};

    it("takes its identity from the config", () => {
      expect(manifest.name).toBe(profile.identity.name[profile.terminal.defaultLocale]);
      expect(manifest.short_name).toBe(profile.terminal.hostname);
    });

    /**
     * These were hardcoded #ffffff, which flashed a white splash screen and
     * tinted the status bar white on a site that is near-black in every theme
     * but the secret one. They now come from the default theme's --bg.
     */
    it("takes its colours from the default theme, not white", () => {
      const configured = profile.terminal.defaultTheme;
      const name = configured === "random" ? "green" : configured;
      const css = readFileSync(join(process.cwd(), "src/themes", `${name}.css`), "utf8");
      const bg = /--bg:\s*([^;]+);/.exec(css)?.[1]?.trim();
      expect(bg, `${name}.css defines no --bg`).toBeTruthy();
      expect(manifest.theme_color).toBe(bg);
      expect(manifest.background_color).toBe(bg);
    });

    it("points at icons that were built", () => {
      expect(manifest.icons.length).toBeGreaterThan(0);
      for (const icon of manifest.icons) {
        const path = String(icon.src).replace(/^\//, "");
        expect(existsSync(join(DIST, path)), `manifest lists ${path}, which is not built`).toBe(true);
      }
    });

    it("is referenced by the page that links it", () => {
      expect(read("index.html")).toContain('rel="manifest"');
    });
  });

  (profile.seo.enableRobotsTxt ? describe : describe.skip)("robots.txt", () => {
    // describe.skip still evaluates this body, so the read is gated too.
    const robots = built && profile.seo.enableRobotsTxt ? read("robots.txt") : "";

    it("points at the sitemap only when one is emitted", () => {
      if (!profile.seo.enableSitemap) {
        expect(robots, "robots.txt points at a sitemap that is switched off").not.toContain("Sitemap:");
        return;
      }
      expect(robots).toContain("Sitemap:");
      const sitemap = /Sitemap:\s*(\S+)/.exec(robots)?.[1] ?? "";
      expect(existsSync(join(DIST, new URL(sitemap).pathname.replace(/^\//, "")))).toBe(true);
    });

    // Named explicitly so access doesn't hinge on how each crawler reads the
    // wildcard group — these are the ones that actually matter for a CV.
    it("names the search and AI crawlers, and allows them", () => {
      for (const bot of ["GPTBot", "ClaudeBot", "Claude-User", "PerplexityBot",
        "Googlebot", "Google-Extended", "Bingbot", "Applebot", "YandexBot"]) {
        expect(robots, `${bot} is not named`).toContain(`User-agent: ${bot}`);
      }
      const namedGroup = robots.slice(0, robots.indexOf("User-agent: *"));
      expect(namedGroup, "the named group has no Allow").toContain("Allow: /");
    });

    it("declares the configured content signal on the wildcard group", () => {
      const wildcard = robots.slice(robots.indexOf("User-agent: *"));
      expect(wildcard).toContain(`Content-Signal: ${renderContentSignal(profile)}`);
      expect(wildcard).toContain("Allow: /");
    });

    it("keeps each group's directives after its user-agents", () => {
      // A blank line ends a group, so one inside the named block would
      // silently orphan the crawlers listed above it.
      const lines = robots.split("\n");
      const firstAllow = lines.indexOf("Allow: /");
      const firstBlank = lines.findIndex((l) => l.trim() === "");
      expect(firstAllow, "the named group is split by a blank line").toBeLessThan(firstBlank);
      expect(firstAllow).toBeGreaterThan(0);
    });

    it("names a real crawler on every user-agent line", () => {
      const agents = [...robots.matchAll(/^User-agent:(.*)$/gm)].map((m) => (m[1] ?? "").trim());
      expect(agents.length).toBeGreaterThan(10);
      expect(agents.filter((a) => a === ""), "empty User-agent line").toEqual([]);
      expect(new Set(agents).size, "a crawler is listed twice").toBe(agents.length);
    });
  });
});

/** The Content-Signal value is three booleans rendered yes/no in a fixed order. */
describe("renderContentSignal", () => {
  const withSignal = (contentSignal: { search: boolean; aiTrain: boolean; aiInput: boolean }) =>
    ({ ...profile, seo: { ...profile.seo, contentSignal } }) as typeof profile;

  it("renders every combination in the spec's spelling", () => {
    expect(renderContentSignal(withSignal({ search: true, aiTrain: true, aiInput: true }))).toBe(
      "search=yes, ai-train=yes, ai-input=yes"
    );
    expect(renderContentSignal(withSignal({ search: true, aiTrain: false, aiInput: true }))).toBe(
      "search=yes, ai-train=no, ai-input=yes"
    );
    expect(renderContentSignal(withSignal({ search: false, aiTrain: false, aiInput: false }))).toBe(
      "search=no, ai-train=no, ai-input=no"
    );
  });
});
