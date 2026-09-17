import { describe, expect, it } from "vitest";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import profile, { MESSAGES } from "../profile.config.ts";
import { cvLocales, cvUrl } from "../src/cv/url.ts";
import { mailtoFor, renderContentSignal, socialsFor } from "../src/core/profile.ts";
import { languageName, posixLocale } from "../src/i18n/locales.ts";
import { translate } from "../src/i18n/index.ts";
import { escapeHtml } from "../src/core/html.ts";

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
// The 404 page is behind `seo.enable404`; page lists spread this in.
const notFoundPage = profile.seo.enable404 ? ["404.html"] : [];

suite("built output", () => {
  // The two shell switches remove markup at build rather than hiding it, so
  // the built page carries #boot / #chips exactly when the config says so.
  it("ships the boot screen and the chip bar only when they are switched on", () => {
    const index = read("index.html");
    expect(index.includes('id="boot"'), "#boot vs terminal.bootScreen").toBe(profile.terminal.bootScreen);
    expect(index.includes('id="chips"'), "#chips vs terminal.chips").toBe(profile.terminal.chips);
  });

  // Both GitHub Pages artefacts come from the build, not public/.
  it("emits CNAME from SITE_URL's host, and an empty .nojekyll", () => {
    expect(read("CNAME").trim()).toBe(new URL(process.env["SITE_URL"] ?? "http://localhost").hostname);
    expect(read(".nojekyll")).toBe("");
  });

  // The 404 page is a switch too, and its cat goes with it: nothing else
  // references the image, so an orphan would ship otherwise.
  it("ships the 404 page, and its cat, only when seo.enable404 is on", () => {
    const { enable404 } = profile.seo;
    expect(existsSync(join(DIST, "404.html")), "404.html vs seo.enable404").toBe(enable404);
    expect(existsSync(join(DIST, "assets/img/404-cat.png")), "404 cat vs seo.enable404").toBe(enable404);
  });

  // One rule for every page: `what — hostname`, and `name — what — hostname`
  // for the two pages about a person. The share card drops the hostname.
  it("titles the terminal page name — terminal — hostname, and its card without the host", () => {
    const lang = profile.terminal.defaultLocale;
    const index = read("index.html");
    const name = escapeHtml(profile.author[lang]);
    const host = escapeHtml(profile.terminal.hostname);
    const what = escapeHtml(translate(lang, "ui.pageTitle"));
    expect(index).toContain(`<title>${name} — ${what} — ${host}</title>`);
    if (profile.seo.enable404) expect(read("404.html")).toContain(`<title>404 — ${host}</title>`);
    if (profile.seo.enableSocialCards) {
      expect(index).toContain(`<meta property="og:title" content="${name} — ${what}" />`);
      expect(index).toContain(`<meta name="twitter:title" content="${name} — ${what}" />`);
    }
  });

  // The tab title carries the host; the share card must not, because
  // og:site_name already names it and the card would show it twice.
  it("titles the CV tab with the host and the CV share card without it", () => {
    if (!profile.seo.enableSocialCards) return;
    for (const l of locales) {
      const html = read(cvUrl(profile, l).replace(/^\//, ""));
      const name = escapeHtml(profile.author[l]);
      const host = escapeHtml(profile.terminal.hostname);
      expect(html).toContain(`<title>${name} — CV — ${host}</title>`);
      expect(html).toContain(`<meta property="og:title" content="${name} — CV" />`);
      expect(html).toContain(`<meta name="twitter:title" content="${name} — CV" />`);
      expect(html).toContain(`<meta property="og:site_name" content="${host}" />`);
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
      ...(profile.seo.enable404 ? [["404.html", lang] as [string, typeof lang]] : []),
      ...locales.map((l): [string, typeof lang] => [cvUrl(profile, l).replace(/^\//, ""), l]),
    ];

    it("noscript fallback: on the terminal page only, saying role, meta line and where the skills are", () => {
      const index = read("index.html");
      const noscript = /<noscript>([\s\S]*?)<\/noscript>/.exec(index)?.[1];
      if (!profile.seo.enableNoscript) {
        expect(noscript, "noscript emitted while switched off").toBeUndefined();
        expect(index, "the placeholder should be consumed either way").not.toContain("<!--NOSCRIPT-->");
        return;
      }
      expect(noscript, "no noscript block").toBeDefined();
      expect(noscript, "noscript should lead with the role").toContain(escapeHtml(profile.seo.role![lang]));
      if (profile.cv?.metaLine) {
        expect(noscript, "noscript should carry the CV meta line").toContain(escapeHtml(profile.cv.metaLine[lang]));
      }
      if (profile.cv) {
        expect(noscript, "noscript should point at the CV's skills").toContain(`href="${cvUrl(profile, lang)}#skills"`);
      }
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
        // The terminal ships a graph (WebSite + Person); a CV page a ProfilePage
        // whose mainEntity is the Person. Either way there is exactly one Person,
        // named in the page's own locale.
        const data = JSON.parse(scripts[0]![1]!) as Record<string, any>;
        const person = page === "index.html"
          ? (data["@graph"] as Array<Record<string, any>>).find((n) => n["@type"] === "Person")
          : data["mainEntity"];
        expect(person?.["@type"], `${page} has no Person node`).toBe("Person");
        expect(person?.["name"]).toBe(profile.author[locale]);
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

    /**
     * site_name, locale, explicit twitter:* — and twitter:image exactly
     * when there is an og:image, since that decides the card.
     */
    it("social cards: site name, locale, and explicit twitter tags on every page", () => {
      if (!profile.seo.enableSocialCards) return;
      for (const [page, locale] of pages()) {
        const html = read(page);
        expect(html, `${page} og:site_name`).toContain(`<meta property="og:site_name" content="${escapeHtml(profile.terminal.hostname)}" />`);
        expect(html, `${page} og:locale`).toContain(`<meta property="og:locale" content="${posixLocale(locale)}" />`);
        expect(html, `${page} twitter:title`).toMatch(/<meta name="twitter:title" content="[^"]+" \/>/);
        expect(html, `${page} twitter:description`).toMatch(/<meta name="twitter:description" content="[^"]+" \/>/);
        const hasOgImage = /<meta property="og:image"/.test(html);
        expect(/<meta name="twitter:image"/.test(html), `${page} twitter:image vs og:image`).toBe(hasOgImage);
      }
    });

    it("social cards: each CV page names its own locale and lists the others as alternates", () => {
      if (!profile.seo.enableSocialCards || locales.length < 2) return;
      for (const l of locales) {
        const html = read(cvUrl(profile, l).replace(/^\//, ""));
        expect(html).toContain(`<meta property="og:locale" content="${posixLocale(l)}" />`);
        for (const other of locales.filter((o) => o !== l)) {
          expect(html, `${l} page lacks alternate ${other}`).toContain(`<meta property="og:locale:alternate" content="${posixLocale(other)}" />`);
        }
        expect(html, `${l} page lists itself as an alternate`).not.toContain(`og:locale:alternate" content="${posixLocale(l)}"`);
      }
    });
  });

  it("gives every page the manifest's theme colour, the manifest, and the sized icons", () => {
    const manifest = JSON.parse(read("site.webmanifest")) as { theme_color: string };
    const allPages = ["index.html", ...notFoundPage, ...locales.map((l) => cvUrl(profile, l).replace(/^\//, ""))];
    for (const page of allPages) {
      const html = read(page);
      expect(html, `${page} theme-color`).toContain(`<meta name="theme-color" content="${manifest.theme_color}" />`);
      expect(html, `${page} manifest link`).toContain(`<link rel="manifest" href="/site.webmanifest" />`);
      expect(html, `${page} touch icon size`).toContain(`<link rel="apple-touch-icon" sizes="180x180"`);
      for (const size of ["16x16", "32x32", "120x120"]) {
        expect(html, `${page} favicon ${size}`).toContain(`sizes="${size}" href="/assets/icons/favicon-${size}.png"`);
        expect(existsSync(join(process.cwd(), "public/assets/icons", `favicon-${size}.png`)), `favicon-${size}.png missing from public/`).toBe(true);
      }
    }
  });

  /**
   * One description per kind of page: the terminal's from seo.description,
   * the CV's own (or the terminal's when unset), the 404's from the
   * catalogue.
   */
  it("describes each kind of page in its own words", () => {
    const lang = profile.terminal.defaultLocale;
    const meta = (html: string) => /<meta name="description" content="([^"]*)" \/>/.exec(html)?.[1];
    expect(meta(read("index.html"))).toBe(escapeHtml(profile.seo.description![lang]));
    if (profile.seo.enable404) expect(meta(read("404.html"))).toBe(escapeHtml(translate(lang, "notFound.description")));
    for (const l of locales) {
      const html = read(cvUrl(profile, l).replace(/^\//, ""));
      const expected = profile.cv?.description?.[l] ?? profile.seo.description![l];
      expect(meta(html), `${l} CV description`).toBe(escapeHtml(expected));
      if (profile.cv?.description) {
        expect(meta(html), "the CV should not describe itself as the terminal").not.toBe(escapeHtml(profile.seo.description![l]));
      }
    }
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

  // The CV footer is the build-time instance of the shared renderFooter;
  // the terminal and 404 footers are the same function at runtime.
  it("builds the CV footer from terminal.footer", () => {
    const { footer } = profile.terminal;
    for (const locale of locales) {
      const html = read(cvUrl(profile, locale).replace(/^\//, ""));
      const block = /<footer>([\s\S]*?)<\/footer>/.exec(html)?.[1] ?? "";
      expect(block.includes("©"), `${locale}: © vs footer.copyright`).toBe(footer.copyright);
      expect(block.includes('<a href="/">'), `${locale}: back link vs footer.backToTerminal`).toBe(footer.backToTerminal);
      if (footer.bottomText) expect(block).toContain(`<div class="footer-bottom">${footer.bottomText}</div>`);
      else expect(block).not.toContain("footer-bottom");
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
    // The non-portrait images are untouched by the pruning — except the 404
    // cat, which goes with its page (asserted above).
    const source = readdirSync(join(process.cwd(), "public/assets/img")).filter(
      (f) => /\.(png|jpe?g|webp|svg)$/.test(f) && (profile.seo.enable404 || f !== "404-cat.png")
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
    const pages = ["index.html", ...notFoundPage, ...locales.map((l) => cvUrl(profile, l).replace(/^\//, ""))];
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
    it("lists the key facts an agent would ask for, from config only", () => {
      const lang = profile.terminal.defaultLocale;
      expect(txt).toContain(`- Role: ${profile.seo.role![lang]}`);
      const contact = /^- Contact: (.+)$/m.exec(txt)?.[1];
      expect(contact, "no contact line").toBeTruthy();
      const known = new Set([mailtoFor(profile)?.replace(/^mailto:/, ""), ...socialsFor(profile, "cv").map((s) => s.display)]);
      expect(known.has(contact as string), `contact "${contact}" is not one of the socials`).toBe(true);
    });

    it("has one section per shipped language, named in that language, linking its CV", () => {
      for (const l of locales) {
        const section = new RegExp(`^## ${languageName(l).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "m");
        expect(txt, `no section for ${l}`).toMatch(section);
        expect(txt).toContain(`${cvUrl(profile, l)}): ${profile.seo.role![l]}`);
      }
    });

    it("opens with an H1 naming every spelling, and the site's description as the summary", () => {
      const lines = txt.split("\n");
      expect(lines[0], "first line is not an H1").toMatch(/^# \S/);
      // Every selected locale's name is on the H1, once each.
      const spellings = [...new Set(Object.keys(MESSAGES).map((l) => profile.author[l as keyof typeof MESSAGES]))];
      expect(lines[0]).toBe(`# ${spellings.join(" / ")}`);
      const quote = lines.slice(1).find((l) => l.trim() !== "");
      expect(quote, "no blockquote summary after the title").toMatch(/^> \S/);
      // The summary is the bio — who this is; what the site is follows the facts.
      const lang = profile.terminal.defaultLocale;
      expect(quote).toBe(`> ${profile.bio![lang].replace(/\s+/g, " ").trim()}`);
      const afterFacts = txt.slice(txt.indexOf("- Contact:"), txt.indexOf("## Pages"));
      expect(afterFacts).toContain(profile.seo.description![lang]);
    });

    it("uses only H1 and H2 headings", () => {
      const headings = [...txt.matchAll(/^(#+)\s/gm)].map((m) => (m[1] as string).length);
      expect(headings[0]).toBe(1);
      expect(headings.filter((h) => h > 2), "headings deeper than H2").toEqual([]);
      expect(headings.filter((h) => h === 1).length, "more than one H1").toBe(1);
    });

    it("makes every list item under an H2 a markdown link, as the spec requires", () => {
      // The spec constrains the H2 "file list" sections to links; the
      // free-form detail above them may hold any markdown, which is where
      // the key-facts list lives.
      const sections = txt.slice(txt.indexOf("\n## "));
      const items = [...sections.matchAll(/^-\s+(.*)$/gm)].map((m) => m[1] as string);
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
   * The manifest is generated: nothing renders it visibly, so a static one
   * with the wrong name and host would go unnoticed by a fork.
   */
  describe("site.webmanifest", () => {
    const manifest = built ? JSON.parse(read("site.webmanifest")) : {};

    it("takes its identity from the config", () => {
      expect(manifest.name).toBe(profile.author[profile.terminal.defaultLocale]);
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
