import { afterEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import profile from "../profile.config";
import { LOCALES, type Localized } from "../src/i18n/locales";
import { renderCv, renderCvTopbar } from "../src/cv/render";
import { buildCvJsonLd, buildIndexJsonLd } from "../src/core/jsonld";
import { CV_LINK_LABEL, cvLocales, cvUrl } from "../src/cv/url";
import { mailtoFor, renderCopyright, renderFooter, skillsFor, socialsFor } from "../src/core/profile";
import { leaveForTerminalOnKey } from "../src/core/leave";

/**
 * The CV is optional, so these suites skip when it isn't configured — a
 * fork that deletes the `cv` key should still have a green suite. The
 * "when no CV is configured" block at the bottom always runs.
 */
const cv = profile.cv;
const locales = cvLocales(profile);
const withCv = cv ? describe : describe.skip;
/**
 * Tags out, entities back to the characters the config actually held.
 *
 * Decoding rather than blanking matters: the renderer escapes once, so a
 * skill key of "Build & CI" reaches the page as "Build &amp; CI". Blanking
 * entities made that unfindable and failed a config that was rendering
 * perfectly well. `&amp;` is decoded last so "&amp;lt;" round-trips to
 * "&lt;" instead of collapsing to "<".
 */
const decodeEntities = (s: string): string =>
  s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&");

const strip = (html: string): string =>
  decodeEntities(html.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ");

withCv("cv locales", () => {
  it("has content for every configured locale", () => {
    for (const locale of locales) {
      expect(cv!.about![locale]?.length, `${locale}: about is empty`).toBeGreaterThan(50);
      expect(cv!.traits![locale]?.length, `${locale}: no traits`).toBeGreaterThan(0);
      for (const job of cv!.jobs!) {
        expect(job.bullets[locale]?.length, `${locale}: ${job.id} has no bullets`).toBeGreaterThan(0);
      }
    }
  });

  it("keeps the same number of bullets across locales", () => {
    const shapes = locales.map((l) => cv!.jobs!.map((j) => j.bullets[l].length).join(","));
    expect(new Set(shapes).size, `bullet counts differ: ${shapes.join(" vs ")}`).toBe(1);
  });

  it("gives every job a unique id", () => {
    const ids = cv!.jobs!.map((j) => j.id);
    expect(new Set(ids).size, `duplicate job ids in ${ids.join(", ")}`).toBe(ids.length);
  });

  it("generates exactly the configured locales", () => {
    expect(locales).toEqual(LOCALES);
  });

  it("puts the default locale at the root and the rest under a prefix", () => {
    expect(cvUrl(profile, profile.terminal.defaultLocale)).toBe("/cv.html");
    for (const locale of locales) {
      if (locale === profile.terminal.defaultLocale) continue;
      expect(cvUrl(profile, locale)).toBe(`/${locale}/cv.html`);
    }
  });

  it("gives every locale a distinct URL", () => {
    const urls = locales.map((l) => cvUrl(profile, l));
    expect(new Set(urls).size).toBe(urls.length);
  });

  // Filenames are structural, not copy — a real shell wouldn't translate
  // them, and duplicating a localized name beside them read as redundant.
  it("keeps section headings identical across locales", () => {
    const namesFor = (locale: (typeof locales)[number]): string[] =>
      [...renderCv(profile, locale).matchAll(/<span class="section-name">([^<]+)</g)].map(
        (m) => m[1] as string
      );
    const first = namesFor(locales[0]!);
    expect(first.length).toBeGreaterThan(4);
    for (const locale of locales) {
      expect(namesFor(locale), `${locale} translated its headings`).toEqual(first);
    }
  });

  // The © line is generated — year, name, and a link to the site root —
  // and shared by all three pages. The CV used to build its own and lost
  // the link on the name.
  it("generates the copyright line from the year, the name and SITE_URL", () => {
    const year = String(new Date().getFullYear());
    for (const locale of locales) {
      const line = renderCopyright(profile, locale, "https://x.test");
      expect(line).toContain(`© ${year} `);
      expect(line).toContain(`>${profile.author[locale]}</a>`);
      const href = /href="([^"]*)"/.exec(line)?.[1];
      expect(href, "no link").toBeTruthy();
      expect(href).toBe("https://x.test");
      // No origin (dev with no .env) must never produce an empty href.
      expect(/href="([^"]*)"/.exec(renderCopyright(profile, locale, ""))?.[1]).toBe("/");
    }
  });

  it("escapes the name in the copyright line", () => {
    const p = { ...profile, author: { ...profile.author, [profile.terminal.defaultLocale]: "A <b>& B" } } as typeof profile;
    const line = renderCopyright(p, profile.terminal.defaultLocale, "https://x.test");
    expect(line).toContain("A &lt;b&gt;&amp; B");
    expect(line).not.toContain("<b>");
  });

  /**
   * `renderFooter` is what all three pages call: `[©] · [tail]` on one line,
   * `terminal.footer.bottomText` beneath. The knobs are `terminal.footer`.
   */
  describe("renderFooter", () => {
    const locale = profile.terminal.defaultLocale;
    const withFooter = (footer: Partial<typeof profile.terminal.footer>) =>
      ({ ...profile, terminal: { ...profile.terminal, footer: { copyright: true, backToTerminal: true, ...footer } } }) as typeof profile;

    it("joins the copyright and the page's tail with a separator", () => {
      const html = renderFooter(withFooter({ bottomText: "" }), locale, "https://x.test", "<i>tail</i>");
      expect(html).toContain(`>${profile.author[locale]}</a> · <i>tail</i>`);
      expect(html).not.toContain("footer-bottom");
    });

    it("drops the copyright and the separator when switched off", () => {
      const html = renderFooter(withFooter({ copyright: false, bottomText: "" }), locale, "https://x.test", "<i>tail</i>");
      expect(html).toBe("<i>tail</i>");
    });

    it("is empty when every part is off", () => {
      expect(renderFooter(withFooter({ copyright: false, bottomText: "" }), locale, "", "")).toBe("");
    });

    it("renders bottomText verbatim, on its own line, the same in every locale", () => {
      const credit = 'Made with ❤ using <a href="https://example.test">x</a>';
      for (const l of locales) {
        const html = renderFooter(withFooter({ bottomText: credit }), l, "https://x.test", "");
        expect(html).toContain(`<div class="footer-bottom">${credit}</div>`);
        expect(html, "no tail and a copyright: no stray separator").not.toContain(" · ");
      }
    });
  });

  it("labels the CV the same way on every page", () => {
    // One constant, so index/404/cv can't disagree about what to call it.
    for (const file of ["src/main.ts", "src/notfound.ts", "src/cv/render.ts"]) {
      expect(readFileSync(join(process.cwd(), file), "utf8"), `${file} hardcodes a label`).toContain(
        "CV_LINK_LABEL"
      );
    }
    expect(CV_LINK_LABEL).toBe("cv.html");
  });

  it("marks the CV as the current page in its own topbar", () => {
    for (const locale of locales) {
      const topbar = renderCvTopbar(profile, locale);
      expect(topbar).toContain('aria-current="page"');
      expect(topbar).toContain(CV_LINK_LABEL);
      // Glowing label rather than a link to the page you are already on.
      expect(topbar).toContain("current glow");
    }
  });

  it("links the topbar chip at the next locale, not the current one", () => {
    if (locales.length < 2) return;
    for (const locale of locales) {
      const topbar = renderCvTopbar(profile, locale);
      expect(topbar).toContain('id="langChip"');
      expect(topbar, `${locale} chip links to itself`).not.toContain(
        `href="${cvUrl(profile, locale)}"`
      );
    }
  });
});

/**
 * The whole point of prerendering: a crawler that never runs JavaScript
 * must still see the résumé.
 */
withCv("cv renders without JavaScript", () => {
  for (const locale of locales) {
    describe(locale, () => {
      const html = renderCv(profile, locale);
      const text = strip(html);

      it("contains every job, with its title, dates and stack", () => {
        for (const job of cv!.jobs!) {
          expect(text, `missing title: ${job.title[locale]}`).toContain(job.title[locale]);
          expect(text, `missing org: ${job.org.name}`).toContain(job.org.name);
          expect(text, `missing dates for ${job.id}`).toContain(job.dates[locale]);
        }
      });

      it("contains every bullet", () => {
        for (const job of cv!.jobs!) {
          for (const bullet of job.bullets[locale]) {
            expect(text, `missing bullet in ${job.id}`).toContain(bullet);
          }
        }
      });

      it("links each employer that has a website, and leaves the rest plain", () => {
        for (const job of cv!.jobs!) {
          if (job.org.url) {
            expect(html, `${job.id} is not linked`).toContain(`href="${job.org.url}"`);
          }
        }
        // A job with no URL must not borrow another job's link.
        const unlinked = cv!.jobs!.filter((j) => !j.org.url);
        for (const job of unlinked) {
          const block = html.slice(html.indexOf(job.org.name) - 200, html.indexOf(job.org.name) + 50);
          expect(block, `${job.id} has no url but rendered a link`).not.toMatch(
            new RegExp(`<a[^>]*>${job.org.name}`)
          );
        }
      });

      it("uses the tagline, the configured meta line and the sign-off", () => {
        expect(text).toContain(cv!.tagline![locale]);
        expect(text).toContain(cv!.metaLine![locale]);
        expect(html, "sign-off is missing").toContain("sign-off");
      });

      it("contains the about paragraph and the traits", () => {
        expect(text).toContain(cv!.about![locale].slice(0, 60));
        for (const trait of cv!.traits![locale]) expect(text).toContain(trait);
      });

      it("contains certifications, languages, education and skills", () => {
        for (const cert of cv!.certs!) expect(text).toContain(cert.name);
        for (const lang of cv!.languages!) expect(text).toContain(lang.name[locale]);
        expect(text).toContain(cv!.education!.university[locale]);
        for (const skill of skillsFor(profile, "cv")) expect(text).toContain(skill.key[locale]);
      });

      it("shows the CV's own contact set, not the terminal's", () => {
        for (const social of socialsFor(profile, "cv")) expect(html).toContain(social.href);
        const terminalOnly = profile.socials.filter(
          (s) => s.contexts?.length === 1 && s.contexts[0] === "terminal"
        );
        for (const social of terminalOnly) {
          expect(html, `${social.label} should not appear on the CV`).not.toContain(social.href);
        }
      });

      // The predecessor's headings were entirely shell-speak — prompt and
      // all — leaving no section name for a crawler or the document outline.
      // The filename is now the heading text; the prompt is decoration.
      it("uses the filename as heading text, with the prompt only as decoration", () => {
        const headings = [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/g)].map((m) => m[1] ?? "");
        expect(headings.length).toBeGreaterThan(4);
        for (const heading of headings) {
          const name = /<span class="section-name">([^<]+)<\/span>/.exec(heading)?.[1] ?? "";
          expect(name.trim(), `heading has no name: ${heading}`).not.toBe("");
          expect(name, "heading leaked the prompt or command").not.toMatch(/[$~:]|\s/);
          expect(name, "heading is not a filename").toMatch(/\.[a-z]+$/);
          expect(heading, "prompt should be hidden from assistive tech").toContain(
            'aria-hidden="true"'
          );
        }
      });

      it("states the language level in text, not only as a meter", () => {
        for (const lang of cv!.languages!) expect(text).toContain(lang.sub[locale]);
      });
    });
  }
});

/**
 * Structured data. Every property is derived from config, so each test
 * pins a property to the config field that feeds it — the same guarantee
 * the visible page has, applied to what only crawlers read.
 */
withCv("cv structured data", () => {
  const person = (locale: (typeof locales)[number]): Record<string, any> =>
    (buildCvJsonLd(profile, locale, "https://example.com") as Record<string, any>)["mainEntity"];

  for (const locale of locales) {
    it(`${locale}: is a ProfilePage about a Person that matches the config`, () => {
      const data = buildCvJsonLd(profile, locale, "https://example.com") as Record<string, any>;
      expect(data["@type"]).toBe("ProfilePage");
      const p = person(locale);
      expect(p["@type"]).toBe("Person");
      expect(p["@id"]).toBe("https://example.com/#owner");
      expect(p["name"]).toBe(profile.author[locale]);
      expect(p["jobTitle"]).toBe(profile.seo.role![locale]);
      // Derived from the socials, so the address a crawler reads is the one
      // a visitor sees; absent when there's no mailto: social at all.
      expect(p["email"]).toBe(mailtoFor(profile));
      // Location was dropped from config; nothing may resurrect it.
      expect("address" in p).toBe(false);
      expect(() => JSON.parse(JSON.stringify(data))).not.toThrow();
    });
  }

  it("lists only real URLs in sameAs", () => {
    for (const url of person("en" as never)["sameAs"] as string[]) expect(url).toMatch(/^https?:\/\//);
  });

  it("derives knowsAbout from the skills table, one technology per entry", () => {
    const about = person(locales[0]!)["knowsAbout"] as string[];
    expect(about.length).toBeGreaterThan(0);
    for (const item of about) expect(item, "a comma-joined value leaked through").not.toContain(", ");
    const firstSkill = profile.skills[0]!.value.split(",")[0]!.trim();
    expect(about).toContain(firstSkill);
    expect(new Set(about).size, "duplicates").toBe(about.length);
  });

  it("derives the CV-only sections from the CV config, in its locale", () => {
    for (const locale of locales) {
      const p = person(locale);
      if (cv!.languages) {
        expect(p["knowsLanguage"]).toEqual(cv!.languages.map((l) => l.name[locale]));
      }
      if (cv!.education) {
        expect(p["alumniOf"]).toEqual({
          "@type": "EducationalOrganization",
          name: cv!.education.university[locale],
        });
      }
      if (cv!.certs) {
        expect(p["hasCredential"]).toHaveLength(cv!.certs.length);
        expect(p["hasCredential"][0]).toMatchObject({ name: cv!.certs[0]!.name, dateCreated: cv!.certs[0]!.year });
      }
      if (cv!.jobs) {
        // Present tense: only the current (first-listed) job is an occupation the person has.
        expect(p["hasOccupation"]).toEqual({ "@type": "Occupation", name: cv!.jobs[0]!.title[locale] });
        for (const past of cv!.jobs.slice(1)) {
          if (past.title[locale] === cv!.jobs[0]!.title[locale]) continue; // same title held twice
          expect(p["hasOccupation"].name, "a past title in hasOccupation").not.toBe(past.title[locale]);
        }
        // Employers live on affiliation, deduped: Occupation has no employer
        // property, and the validator flags hiringOrganization there.
        const orgs = p["affiliation"] as Array<{ name: string }>;
        expect(orgs.map((o) => o.name)).toEqual([...new Set(cv!.jobs.map((j) => j.org.name))]);
        expect(JSON.stringify(p)).not.toContain("hiringOrganization");
      }
      if (cv!.photo) expect(p["image"]).toBe(`https://example.com${cv!.photo}`);
    }
  });

  it("omits every CV-only section for an empty cv, rather than emitting it empty", () => {
    const p = (buildCvJsonLd({ ...profile, cv: {} } as typeof profile, locales[0]!, "https://x.test") as Record<string, any>)["mainEntity"];
    for (const key of ["alumniOf", "hasCredential", "hasOccupation", "affiliation", "knowsLanguage", "image"]) {
      expect(key in p, `${key} present for an empty cv`).toBe(false);
    }
    expect(p["knowsAbout"], "skills live outside cv, so they survive").toBeTruthy();
  });
});

describe("index structured data", () => {
  const locale = profile.terminal.defaultLocale;
  const graph = () => (buildIndexJsonLd(profile, locale, "https://example.com") as Record<string, any>)["@graph"] as Array<Record<string, any>>;

  it("is a graph of the site and its owner, linked by @id", () => {
    const [site, person] = graph();
    expect(site!["@type"]).toBe("WebSite");
    expect(site!["@id"]).toBe("https://example.com/#website");
    expect(site!["name"]).toBe(profile.terminal.hostname);
    expect(site!["inLanguage"]).toEqual([...LOCALES]);
    expect(person!["@type"]).toBe("Person");
    expect(person!["@id"]).toBe("https://example.com/#owner");
  });

  it("carries the owner's image and skills but not the CV-only sections", () => {
    const [, person] = graph();
    if (profile.cv?.photo) expect(person!["image"]).toBe(`https://example.com${profile.cv.photo}`);
    expect(person!["knowsAbout"]).toBeTruthy();
    for (const key of ["alumniOf", "hasCredential", "hasOccupation", "affiliation", "address"]) {
      expect(key in person!, `${key} on the terminal page`).toBe(false);
    }
  });
});

/**
 * A printed CV must be grayscale under any theme. Redefining the palette
 * tokens covers themes added later; the predecessor patched individual
 * classes and could not.
 */
withCv("cv print styles", () => {
  const css = readFileSync(join(process.cwd(), "src/styles/cv.css"), "utf8");
  const printBlock = /@media print\s*\{([\s\S]*)\}\s*$/.exec(css)?.[1] ?? "";

  it("has a print block", () => {
    expect(printBlock.length).toBeGreaterThan(200);
  });

  /**
   * Theme CSS is injected in import order, so in dev the print block lands
   * *before* the theme blocks. At equal specificity (`:root[data-theme]` vs
   * `:root[data-theme="amber"]`) the theme then wins and accent/amber text
   * prints in colour. !important removes the ordering dependency entirely.
   */
  it("overrides the palette regardless of stylesheet order", () => {
    const rootBlock = /:root, :root\[data-theme\] \{([\s\S]*?)\n  \}/.exec(printBlock)?.[1] ?? "";
    const declarations = [...rootBlock.matchAll(/(--[a-z0-9-]+)\s*:([^;]*);/g)];
    expect(declarations.length).toBeGreaterThan(20);
    const weak = declarations.filter((m) => !/!important/.test(m[2] ?? "")).map((m) => m[1]);
    expect(weak, "these tokens would lose to a theme block").toEqual([]);
  });

  it("redefines every palette token a theme defines", () => {
    const green = readFileSync(join(process.cwd(), "src/themes/green.css"), "utf8");
    const tokens = [...green.matchAll(/(--[a-z0-9-]+)\s*:/g)].map((m) => m[1] as string);
    const overridden = new Set(
      [...printBlock.matchAll(/(--[a-z0-9-]+)\s*:/g)].map((m) => m[1] as string)
    );
    const missing = tokens.filter((t) => !overridden.has(t));
    expect(missing, "tokens that would keep their theme colour on paper").toEqual([]);
  });

  /**
   * Token redefinition alone isn't enough: base.css glows `.accent` with a
   * hardcoded cyan, and the portrait frame carries its own drop shadow.
   * Both survived a themed palette and printed in colour.
   */
  it("neutralises effects that carry colour independently of the tokens", () => {
    const blanket = /\*,\s*\*::before,\s*\*::after\s*\{([^}]*)\}/.exec(printBlock)?.[1] ?? "";
    for (const prop of ["text-shadow", "box-shadow", "background-image", "mix-blend-mode"]) {
      expect(blanket, `${prop} is not neutralised for every element`).toContain(prop);
    }
  });

  it("leaves no hardcoded colour able to reach the page", () => {
    // Both stylesheets the CV loads — the glow that started this was in
    // base.css, so scanning only cv.css would miss the very case this
    // exists to catch. Strip each file's print block *before* joining;
    // stripping after would delete everything past the first one.
    const stripPrint = (text: string): string => text.replace(/@media print[\s\S]*$/, "");
    const screenCss = [css, readFileSync(join(process.cwd(), "src/styles/base.css"), "utf8")]
      .map(stripPrint)
      .join("\n")
      .replace(/\/\*[\s\S]*?\*\//g, "");

    // By declaration, not by line: a multi-line gradient would otherwise
    // look like a bare colour with no property attached.
    const declarations = screenCss
      .split(/[;{}]/)
      .map((d) => d.replace(/\s+/g, " ").trim())
      .filter((d) => /rgba?\(\s*\d|#[0-9a-fA-F]{3,8}\b/.test(d));

    const offenders = declarations.filter((decl) => {
      const [property = "", ...rest] = decl.split(":");
      const value = rest.join(":");
      const prop = property.trim().toLowerCase();
      if (prop.startsWith("--")) return false; // token definitions are the palette
      // The print blanket nulls these outright.
      if (/^(box-shadow|text-shadow|background-image|mix-blend-mode)$/.test(prop)) return false;
      // `background: <gradient>` resolves to background-image, so it is too.
      if (prop === "background" && /gradient/.test(value)) return false;
      return true;
    });

    expect(
      offenders,
      "a hardcoded colour the print blanket cannot neutralise"
    ).toEqual([]);
  });

  it("prints the portrait in grayscale, without its frame shadow", () => {
    expect(printBlock).toMatch(/\.avatar\s*\{[^}]*grayscale/);
    expect(printBlock).toMatch(/\.avatar-frame::after[^{]*\{[^}]*display\s*:\s*none|\.avatar-frame::after/);
  });

  // The pixel render is screen-only. On paper the source photo comes back:
  // the canvas cv.ts inserts is hidden and the original <img> shown again.
  // Both carry !important like the rest of the block, since theme CSS lands
  // after it in dev and the swap must not depend on order.
  it("prints the source photo, discarding the pixel render", () => {
    expect(printBlock).toMatch(/\.avatar-pixel\s*\{[^}]*display\s*:\s*none\s*!important/);
    expect(printBlock).toMatch(/\.is-pixelated\s+img\.avatar\s*\{[^}]*display\s*:\s*block\s*!important/);
  });

  it("keeps the command visible in headings, hiding only the prompt", () => {
    expect(printBlock, "the prompt should be hidden").toContain(".section-head .ps");
    expect(printBlock, "the command must not be hidden too").not.toContain(".section-head .cmd");
  });

  it("hides the screen-only chrome and keeps list items off page breaks", () => {
    for (const selector of ["#matrix", ".crt", ".topbar", ".fake-cursor"]) {
      expect(printBlock).toContain(selector);
    }
    // Jobs may flow across pages; individual items may not split.
    expect(printBlock).toMatch(/ul\.bullets li[^{]*\{[^}]*break-inside\s*:\s*avoid/);
    expect(printBlock).toMatch(/\.section, \.job \{[^}]*break-inside\s*:\s*auto/);
  });
});

/**
 * The CV is optional. A fork with no résumé to publish deletes the `cv`
 * key and gets the terminal alone — no pages, no command, no file.
 */
describe("when no CV is configured", () => {
  const without = { ...profile, cv: undefined } as typeof profile;

  it("generates no CV pages", () => {
    expect(cvLocales(without)).toEqual([]);
  });

  it("renders nothing", () => {
    for (const locale of LOCALES) {
      expect(renderCv(without, locale)).toBe("");
    }
  });

  it("hides the 404 page's CV link", () => {
    const src = readFileSync(join(process.cwd(), "src/notfound.ts"), "utf8");
    expect(src, "the 404 link is not guarded on profile.cv").toMatch(/profile\.cv\s*\?/);
  });

  it("leaves the cv command and file unregistered", () => {
    // Both opt out via `enabled`, evaluated against the real config at
    // module load — so this asserts the wiring exists, and the build test
    // covers the behaviour end to end.
    const cvCommand = readFileSync(join(process.cwd(), "src/commands/cv.ts"), "utf8");
    const cvFile = readFileSync(join(process.cwd(), "src/fs/cv.html.ts"), "utf8");
    expect(cvCommand).toContain("enabled: Boolean(profile.cv)");
    expect(cvFile).toContain("enabled: Boolean(profile.cv)");
  });
});

/**
 * `cv.photoStyle` is decided at prerender time as a class on the frame,
 * so "tint" needs no JavaScript and "pixel" degrades to tint without it —
 * which is only true if the class is actually in the static markup.
 */
withCv("portrait style", () => {
  const locale = profile.terminal.defaultLocale;
  const styled = (photoStyle?: "pixel" | "tint" | "plain"): string =>
    renderCv(
      { ...profile, cv: { ...cv, photo: "/assets/img/portraits/x.png", photoStyle } } as typeof profile,
      locale
    );

  it("defaults to plain — served as uploaded", () => {
    expect(styled(undefined)).toContain('class="avatar-frame style-plain"');
  });

  it("carries the configured style as a class on the frame", () => {
    for (const style of ["pixel", "tint", "plain"] as const) {
      expect(styled(style)).toContain(`class="avatar-frame style-${style}"`);
    }
  });

  it("never emits the canvas — that is cv.ts's job, at load, only for pixel", () => {
    for (const style of ["pixel", "tint", "plain"] as const) {
      expect(styled(style)).not.toContain("avatar-pixel");
      expect(styled(style)).not.toContain("is-pixelated");
    }
  });

  it("keys the screen tint and grayscale on tint and pixel only", () => {
    const css = readFileSync(join(process.cwd(), "src/styles/cv.css"), "utf8");
    // Rules only: the comments name every style, which would fool the
    // selector checks below, and the header mentions "@media print" too.
    const screen = css
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/@media print\s*\{[\s\S]*\}\s*$/, "");
    expect(screen).toMatch(/\.avatar-frame\.style-tint::after,\s*\.avatar-frame\.style-pixel::after\s*\{/);
    expect(screen).toMatch(/\.style-tint \.avatar,\s*\.style-pixel \.avatar\s*\{[^}]*grayscale/);
    // and no rule selects the plain style at all — it is the absence of styling
    expect(screen).not.toMatch(/style-plain/);
  });
});

/**
 * A fork won't fill in every section. Each one is optional, and omitting it
 * must leave the page renderable — no empty heading, no stray rule, no
 * crash.
 */
withCv("partial configs", () => {
  const locale = profile.terminal.defaultLocale;
  const omit = (key: keyof NonNullable<typeof profile.cv>): typeof profile => {
    const trimmed = { ...cv } as Record<string, unknown>;
    delete trimmed[key];
    return { ...profile, cv: trimmed } as typeof profile;
  };

  const SECTIONS: Array<[keyof NonNullable<typeof profile.cv>, string]> = [
    ["about", "about.txt"],
    ["jobs", "experience.log"],
    ["education", "education.txt"],
    ["certs", "certifications.txt"],
    ["languages", "languages.txt"],
    ["traits", "notes.txt"],
  ];

  for (const [key, heading] of SECTIONS) {
    it(`renders without \`${key}\`, and drops only that heading`, () => {
      const html = renderCv(omit(key), locale);
      expect(html.length, "nothing rendered at all").toBeGreaterThan(200);
      expect(html, `${heading} should be gone`).not.toContain(heading);
      // Everything else survives.
      for (const [, other] of SECTIONS) {
        if (other === heading) continue;
        expect(html, `omitting ${key} also lost ${other}`).toContain(other);
      }
      // The header is not a section and always stays.
      expect(html).toContain(profile.author[locale]);
    });
  }

  it("renders without metaLine", () => {
    const html = renderCv(omit("metaLine"), locale);
    expect(html).toContain(profile.author[locale]);
    expect(html, "an empty meta paragraph was left behind").not.toContain('class="meta dim"');
  });

  // The config value is the sentence alone; the renderer adds `$ echo "…"`.
  // So it's escaped like prose — markup in the config must not become markup.
  it("dresses the sign-off as a shell line and escapes the text", () => {
    const html = renderCv(
      { ...profile, cv: { ...cv, signOff: { ...cv!.signOff, [locale]: 'a <b>bold</b> "claim"' } } } as typeof profile,
      locale
    );
    const line = /<p class="sign-off">(.*?)<\/p>/.exec(html)?.[1] ?? "";
    expect(line).toMatch(/^\$ <span class="accent">echo<\/span> <span class="amber">"/);
    // Text content: angle brackets escaped, quotes left as they are.
    expect(line).toContain('a &lt;b&gt;bold&lt;/b&gt; "claim"');
    expect(line).not.toContain("<b>");
    expect(line).toContain('<span class="fake-cursor"');
  });

  it("renders without signOff, and drops its rule too", () => {
    const html = renderCv(omit("signOff"), locale);
    expect(html).toContain(profile.author[locale]);
    expect(html).not.toContain("sign-off");
    expect(html).not.toContain("fake-cursor");
  });

  it("renders an empty cv — the header, plus skills if any are marked for it", () => {
    const html = renderCv({ ...profile, cv: {} } as typeof profile, locale);
    expect(html).toContain(profile.author[locale]);
    // The tagline lives in `cv` now, so an empty cv has no line under the name.
    expect(html).not.toContain('class="tagline"');
    // Skills come from profile.skills, not from `cv`, so they survive.
    for (const heading of ["about.txt", "experience.log", "education.txt",
      "certifications.txt", "languages.txt", "notes.txt"]) {
      expect(html, `${heading} rendered from an empty cv`).not.toContain(heading);
    }
  });

  it("renders nothing but the header when skills are terminal-only too", () => {
    const bare = {
      ...profile,
      cv: {},
      skills: profile.skills.map((s) => ({ ...s, contexts: ["terminal" as const] })),
    } as typeof profile;
    const html = renderCv(bare, locale);
    expect(html).toContain(profile.author[locale]);
    expect(html, "a section heading survived a completely empty cv").not.toContain("section-head");
  });

  it("renders with empty arrays as well as missing keys", () => {
    // Built from LOCALES rather than a hardcoded {en, ru}: this fixture is a
    // `Localized<string[]>`, so a fork that adds or drops a language would
    // otherwise have to come and edit the test suite.
    const emptyTraits = {} as Localized<string[]>;
    for (const l of LOCALES) emptyTraits[l] = [];

    const emptied = {
      ...profile,
      cv: { ...cv, jobs: [], certs: [], languages: [], traits: emptyTraits },
    } as typeof profile;
    const html = renderCv(emptied, locale);
    expect(html).toContain("about.txt");
    for (const heading of ["experience.log", "certifications.txt", "languages.txt", "notes.txt"]) {
      expect(html, `${heading} rendered from an empty list`).not.toContain(heading);
    }
  });

  it("drops the skills table when no skill is marked for the CV", () => {
    const noCvSkills = {
      ...profile,
      skills: profile.skills.map((s) => ({ ...s, contexts: ["terminal" as const] })),
    } as typeof profile;
    expect(renderCv(noCvSkills, locale)).not.toContain("skills.sh");
  });

  it("never emits an empty section wrapper", () => {
    for (const [key] of SECTIONS) {
      const html = renderCv(omit(key), locale);
      expect(html, `${key} left an empty list`).not.toMatch(/<ul[^>]*>\s*<\/ul>/);
      expect(html, `${key} left an empty table`).not.toMatch(/<table[^>]*>\s*<\/table>/);
    }
  });
});

/**
 * JSON-LD's `email` is derived from the socials rather than configured, so
 * the address a crawler reads is the one a visitor sees.
 */
describe("mailtoFor", () => {
  const withSocials = (socials: typeof profile.socials): typeof profile =>
    ({ ...profile, socials }) as typeof profile;

  it("returns the first mailto: href, scheme included", () => {
    const p = withSocials([
      { label: "Web", href: "https://a.example", display: "a" },
      { label: "Email", href: "mailto:one@a.example", display: "one" },
      { label: "Other", href: "mailto:two@a.example", display: "two" },
    ]);
    expect(mailtoFor(p)).toBe("mailto:one@a.example");
  });

  it("is undefined with no mailto: social, and JSON-LD then omits email", () => {
    const p = withSocials([{ label: "Web", href: "https://a.example", display: "a" }]);
    expect(mailtoFor(p)).toBeUndefined();
    const data = buildCvJsonLd(p, profile.terminal.defaultLocale, "https://example.com") as Record<string, any>;
    expect("email" in data["mainEntity"]).toBe(false);
  });

  it("the shipped config has exactly one mailto: social", () => {
    expect(profile.socials.filter((s) => s.href.startsWith("mailto:"))).toHaveLength(1);
  });
});

/**
 * Esc or `q` on the CV page navigates to the terminal. The helper takes
 * the navigation as a callback so the tests spy on it instead of fighting
 * happy-dom's `location`. Each test's listener is torn down afterwards —
 * a leftover one would claim the press and make the next test's yield.
 */
describe("esc / q return to the terminal", () => {
  const teardowns: Array<() => void> = [];
  const install = (go: () => void): void => {
    teardowns.push(leaveForTerminalOnKey(go));
  };
  afterEach(() => {
    for (const off of teardowns.splice(0)) off();
  });

  const press = (init: KeyboardEventInit, target: EventTarget = document): KeyboardEvent => {
    const event = new KeyboardEvent("keydown", { cancelable: true, bubbles: true, ...init });
    target.dispatchEvent(event);
    return event;
  };

  it("navigates on a plain Escape", () => {
    const go = vi.fn();
    install(go);
    press({ key: "Escape" });
    expect(go).toHaveBeenCalledTimes(1);
  });

  it("navigates on q — the pager's quit key", () => {
    const go = vi.fn();
    install(go);
    press({ key: "q", code: "KeyQ" });
    expect(go).toHaveBeenCalledTimes(1);
  });

  it("matches the physical Q under a non-Latin layout", () => {
    // A Russian layout types й on that key; the reflex is the same.
    const go = vi.fn();
    install(go);
    press({ key: "й", code: "KeyQ" });
    expect(go).toHaveBeenCalledTimes(1);
  });

  it("claims the press, so the browser's own Esc (Stop) can't cancel the navigation", () => {
    // Chrome runs its Esc accelerator — Stop — after a page declines the
    // key, which cancels the navigation this handler just started. Seen in
    // the wild as "you have to press Esc twice".
    install(vi.fn());
    expect(press({ key: "Escape" }).defaultPrevented).toBe(true);
    expect(press({ key: "q", code: "KeyQ" }).defaultPrevented).toBe(true);
  });

  it("ignores every other key and leaves its default action alone", () => {
    const go = vi.fn();
    install(go);
    for (const key of ["Enter", "a", "Backspace", "Tab"]) {
      expect(press({ key }).defaultPrevented, key).toBe(false);
    }
    expect(go).not.toHaveBeenCalled();
  });

  it("ignores a modifier held — including Shift, so Q is not q", () => {
    const go = vi.fn();
    install(go);
    press({ key: "Escape", metaKey: true });
    press({ key: "Escape", ctrlKey: true });
    press({ key: "q", code: "KeyQ", altKey: true });
    press({ key: "Q", code: "KeyQ", shiftKey: true });
    expect(go).not.toHaveBeenCalled();
  });

  it("fires once for a held key, not on auto-repeat", () => {
    const go = vi.fn();
    install(go);
    press({ key: "Escape", repeat: true });
    press({ key: "q", code: "KeyQ", repeat: true });
    expect(go).not.toHaveBeenCalled();
  });

  it("stays out of a field being typed in", () => {
    // The CV has no inputs today; the guard is what lets one be added.
    const go = vi.fn();
    install(go);
    const input = document.createElement("input");
    document.body.append(input);
    try {
      press({ key: "q", code: "KeyQ" }, input);
      press({ key: "Escape" }, input);
      expect(go).not.toHaveBeenCalled();
    } finally {
      input.remove();
    }
  });

  it("yields to a listener that already handled the press", () => {
    // Anything on the page that later claims Esc for itself only has to
    // preventDefault() — this is the guard that keeps the two from fighting.
    const go = vi.fn();
    const claim = (e: KeyboardEvent): void => {
      if (e.key === "Escape") e.preventDefault();
    };
    document.addEventListener("keydown", claim);
    try {
      install(go);
      press({ key: "Escape" });
      expect(go).not.toHaveBeenCalled();
    } finally {
      document.removeEventListener("keydown", claim);
    }
  });
});
