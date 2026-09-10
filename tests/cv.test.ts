import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import profile from "../profile.config";
import { LOCALES } from "../src/i18n/locales";
import { renderCv, renderCvTopbar } from "../src/cv/render";
import { buildCvJsonLd } from "../src/cv/jsonld";
import { CV_LINK_LABEL, cvLocales, cvUrl } from "../src/cv/url";
import { skillsFor, socialsFor } from "../src/core/profile";

/**
 * The CV is optional, so these suites skip when it isn't configured — a
 * fork that deletes the `cv` key should still have a green suite. The
 * "when no CV is configured" block at the bottom always runs.
 */
const cv = profile.cv;
const locales = cvLocales(profile);
const withCv = cv ? describe : describe.skip;
const strip = (html: string): string =>
  html.replace(/<[^>]+>/g, " ").replace(/&[a-z]+;/g, " ").replace(/\s+/g, " ");

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
    expect(locales).toEqual(profile.terminal.locales);
    for (const locale of locales) expect(LOCALES).toContain(locale);
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
        expect(text).toContain(profile.identity.tagline[locale]);
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

withCv("cv structured data", () => {
  for (const locale of locales) {
    it(`${locale}: matches the profile config`, () => {
      const data = buildCvJsonLd(profile, locale, "https://example.com") as Record<string, any>;
      expect(data["@type"]).toBe("Person");
      expect(data["name"]).toBe(profile.identity.name[locale]);
      expect(data["jobTitle"]).toBe(profile.identity.role[locale]);
      expect(data["email"]).toBe(`mailto:${profile.identity.email}`);
      expect(data["address"].addressLocality).toBe(profile.identity.location[locale]);
      // Serialisable, since it is emitted as JSON in a script tag.
      expect(() => JSON.parse(JSON.stringify(data))).not.toThrow();
    });
  }

  it("lists only real URLs in sameAs", () => {
    const data = buildCvJsonLd(profile, "en", "https://example.com") as Record<string, any>;
    for (const url of data["sameAs"] as string[]) expect(url).toMatch(/^https?:\/\//);
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
    for (const locale of profile.terminal.locales) {
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
      expect(html).toContain(profile.identity.name[locale]);
    });
  }

  it("renders without metaLine", () => {
    const html = renderCv(omit("metaLine"), locale);
    expect(html).toContain(profile.identity.name[locale]);
    expect(html, "an empty meta paragraph was left behind").not.toContain('class="meta dim"');
  });

  it("renders without signOff, and drops its rule too", () => {
    const html = renderCv(omit("signOff"), locale);
    expect(html).toContain(profile.identity.name[locale]);
    expect(html).not.toContain("sign-off");
    expect(html).not.toContain("fake-cursor");
  });

  it("renders an empty cv — the header, plus skills if any are marked for it", () => {
    const html = renderCv({ ...profile, cv: {} } as typeof profile, locale);
    expect(html).toContain(profile.identity.name[locale]);
    expect(html).toContain(profile.identity.tagline[locale]);
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
    expect(html).toContain(profile.identity.name[locale]);
    expect(html, "a section heading survived a completely empty cv").not.toContain("section-head");
  });

  it("renders with empty arrays as well as missing keys", () => {
    const emptied = {
      ...profile,
      cv: { ...cv, jobs: [], certs: [], languages: [], traits: { en: [], ru: [] } },
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
