import { afterEach, describe, expect, it, vi } from "vitest";
import { MESSAGES } from "../profile.config";
import {
  CREDIT_LINE,
  defineProfile,
  renderContentSignal,
  renderFooter,
  skillsFor,
  socialsFor,
  type ProfileInput,
} from "../src/core/profile";
import { systemOwner } from "../src/core/describe";
import { buildCvJsonLd, buildIndexJsonLd } from "../src/core/jsonld";
import { renderCv } from "../src/cv/render";
import { LOCALES, type Locale } from "../src/i18n/locales";

/**
 * `defineProfile` is the one place defaults live. These pin every default
 * to the value the docs promise, and prove the smallest config — `MESSAGES`
 * and `author` — resolves to something the whole site can render.
 */
const author = Object.fromEntries(LOCALES.map((l) => [l, "Ada Example"])) as Record<Locale, string>;
const minimal: ProfileInput = { author };

describe("defineProfile defaults", () => {
  const resolved = defineProfile(MESSAGES, minimal);

  it("fills every terminal default", () => {
    const t = resolved.terminal;
    expect(t.handle).toBe("guest");
    expect(t.defaultLocale).toBe(Object.keys(MESSAGES)[0]);
    expect(t.defaultTheme).toBe("green");
    expect(t.defaultMatrix).toBe("on");
    expect(t.bootScreen).toBe(true);
    expect(t.chips).toBe(true);
    expect(t.footer).toEqual({ copyright: true, backToTerminal: true, bottomText: CREDIT_LINE });
    expect("links" in t).toBe(false);
    expect("disabledCommands" in t).toBe(false);
  });

  it("fills every seo default and leaves the optional texts out", () => {
    const s = resolved.seo;
    expect(s.enableRobotsTxt).toBe(true);
    expect(s.enableSitemap).toBe(true);
    expect(s.enableLlmsTxt).toBe(true);
    expect(s.enableJsonLd).toBe(true);
    expect(s.enableNoscript).toBe(true);
    expect(s.enableSocialCards).toBe(true);
    expect(s.enable404).toBe(true);
    expect(s.contentSignal).toEqual({ search: true, aiTrain: true, aiInput: true });
    expect(renderContentSignal(resolved)).toBe("search=yes, ai-train=yes, ai-input=yes");
    for (const key of ["role", "description", "noindex", "ogImage"]) expect(key in s, key).toBe(false);
  });

  it("resolves omitted lists to [] and leaves absent features absent", () => {
    expect(resolved.skills).toEqual([]);
    expect(resolved.socials).toEqual([]);
    for (const key of ["neofetch", "bio", "commands", "cv"]) expect(key in resolved, key).toBe(false);
  });

  it("lets an explicit value win over every default", () => {
    const custom = defineProfile(MESSAGES, {
      author,
      terminal: { handle: "visitor", defaultTheme: "amber", chips: false, footer: { copyright: false, bottomText: "" } },
      seo: { enableSitemap: false, enable404: false, contentSignal: { search: true, aiTrain: false, aiInput: true } },
    });
    expect(custom.terminal.handle).toBe("visitor");
    expect(custom.terminal.defaultTheme).toBe("amber");
    expect(custom.terminal.chips).toBe(false);
    expect(custom.terminal.bootScreen).toBe(true); // untouched default beside an override
    // "" is the off switch for the credit line, and must survive as "".
    expect(custom.terminal.footer).toEqual({ copyright: false, backToTerminal: true, bottomText: "" });
    expect(custom.seo.enableSitemap).toBe(false);
    expect(custom.seo.enable404).toBe(false);
    expect(renderContentSignal(custom)).toBe("search=yes, ai-train=no, ai-input=yes");
  });

  describe("hostname", () => {
    const saved = process.env["SITE_URL"];
    afterEach(() => {
      if (saved === undefined) delete process.env["SITE_URL"];
      else process.env["SITE_URL"] = saved;
    });

    it("is the host of SITE_URL, read when asked rather than at import", () => {
      // The vitest define inlines __SITE_URL__; when that's empty the getter
      // falls through to the environment, which vite.config.ts also sets.
      const p = defineProfile(MESSAGES, minimal);
      const expected = (() => {
        const url = (typeof __SITE_URL__ !== "undefined" && __SITE_URL__) || process.env["SITE_URL"] || "";
        return url ? new URL(url).hostname : "localhost";
      })();
      expect(p.terminal.hostname).toBe(expected);
      // Serialises and spreads as a plain string — no getter leaks out.
      expect(JSON.parse(JSON.stringify(p)).terminal.hostname).toBe(expected);
      expect({ ...p.terminal }.hostname).toBe(expected);
    });

    it("is whatever the config says when the config says", () => {
      expect(defineProfile(MESSAGES, { author, terminal: { hostname: "example.test" } }).terminal.hostname).toBe(
        "example.test"
      );
    });
  });
});

describe("the smallest config", () => {
  const p = defineProfile(MESSAGES, minimal);
  const locale = p.terminal.defaultLocale;

  it("renders a footer with the © line and the back link", () => {
    const html = renderFooter(p, locale, "https://x.test", '<a href="/">back</a>');
    expect(html).toContain("© ");
    expect(html).toContain("Ada Example");
    expect(html).toContain('<a href="/">back</a>');
  });

  it("has nothing to list for skills or contact, on either page", () => {
    expect(skillsFor(p, "terminal")).toEqual([]);
    expect(socialsFor(p, "cv")).toEqual([]);
  });

  it("names the machine's owner root", () => {
    expect(systemOwner(p)).toBe("root");
  });

  it("builds valid JSON-LD with a name and nothing invented", () => {
    const index = buildIndexJsonLd(p, locale, "https://x.test") as Record<string, any>;
    const person = (index["@graph"] as Array<Record<string, any>>).find((n) => n["@type"] === "Person")!;
    expect(person["name"]).toBe("Ada Example");
    for (const key of ["jobTitle", "email", "sameAs", "knowsAbout", "image"]) expect(key in person, key).toBe(false);
    expect(() => JSON.parse(JSON.stringify(index))).not.toThrow();
  });

  it("renders a CV header from author alone when a cv block is added", () => {
    const withCv = defineProfile(MESSAGES, { author, cv: {} });
    const html = renderCv(withCv, locale);
    expect(html).toContain("<h1>Ada Example</h1>");
    expect(html).not.toContain('class="tagline"');
    expect(html).not.toContain("contact-row");
    const ld = buildCvJsonLd(withCv, locale, "https://x.test") as Record<string, any>;
    expect(ld["mainEntity"]["name"]).toBe("Ada Example");
  });

  it("is not something vi.spyOn(console.warn) has to see: the preflight owns the description warning", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    defineProfile(MESSAGES, minimal);
    expect(warn).not.toHaveBeenCalled();
    warn.mockRestore();
  });
});

/**
 * `seo.role` and `seo.description` are optional; each reader leaves its
 * bit out rather than printing "undefined". Fixtures rather than the real
 * config, which sets both.
 */
describe("with no seo.role", () => {
  const p = defineProfile(MESSAGES, { author, cv: { photo: "/assets/img/portraits/x.png" } });
  const locale = p.terminal.defaultLocale;

  it("omits jobTitle from both JSON-LD shapes", () => {
    const index = buildIndexJsonLd(p, locale, "https://x.test") as Record<string, any>;
    const person = (index["@graph"] as Array<Record<string, any>>).find((n) => n["@type"] === "Person")!;
    expect("jobTitle" in person).toBe(false);
    const cv = buildCvJsonLd(p, locale, "https://x.test") as Record<string, any>;
    expect("jobTitle" in cv["mainEntity"]).toBe(false);
  });

  it("captions the portrait with the name alone", () => {
    const html = renderCv(p, locale);
    const alt = /alt="([^"]*)"/.exec(html)?.[1] ?? "";
    expect(alt).toContain("Ada Example");
    expect(alt).not.toContain("undefined");
    expect(alt).not.toMatch(/,\s*—/); // no dangling ", —" where the role was
  });
});
