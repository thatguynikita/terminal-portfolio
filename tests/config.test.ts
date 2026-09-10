import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import profile from "../profile.config";
import { LOCALES, type Locale } from "../src/i18n/locales";
import { THEME_NAMES } from "../src/themes";

/**
 * `npm run check` — the preflight a fork runs before deploying.
 *
 * This config ships with the original author's real data, so the guard
 * against "deployed with someone else's name still in it" can't be a
 * placeholder match. Instead it checks that everything agrees with
 * itself: rebrand the domain and forget SITE_URL (or vice versa) and
 * this fails.
 */
const ROOT = process.cwd();
const enabled = profile.terminal.locales;

/** Walks the config for `{en: ..., ru: ...}`-shaped objects. */
function localizedFields(node: unknown, path = ""): Array<[string, Record<string, unknown>]> {
  if (!node || typeof node !== "object") return [];
  const record = node as Record<string, unknown>;
  const keys = Object.keys(record);
  const isLocalized = keys.length > 0 && keys.every((k) => (LOCALES as readonly string[]).includes(k));
  if (isLocalized) return [[path, record]];

  return Object.entries(record).flatMap(([key, value]) =>
    localizedFields(value, path ? `${path}.${key}` : key)
  );
}

describe("profile.config.ts", () => {
  it("declares at least one locale, and a default among them", () => {
    expect(enabled.length).toBeGreaterThan(0);
    expect(enabled).toContain(profile.terminal.defaultLocale);
    for (const locale of enabled) expect(LOCALES).toContain(locale);
  });

  it("translates every user-visible field into every enabled locale", () => {
    // A Localized value is normally a string, but `Localized<string[]>` is
    // used for list content (CV bullets, traits) — both must be present and
    // non-empty in every enabled locale.
    const filled = (value: unknown): boolean =>
      Array.isArray(value)
        ? value.length > 0 && value.every((v) => typeof v === "string" && v.trim() !== "")
        : typeof value === "string" && value.trim() !== "";

    const gaps: string[] = [];
    for (const [path, field] of localizedFields(profile)) {
      for (const locale of enabled) {
        if (!filled(field[locale as Locale])) gaps.push(`${path}.${locale}`);
      }
    }
    expect(gaps).toEqual([]);
  });

  it("names a theme that exists", () => {
    const theme = profile.terminal.defaultTheme;
    if (theme !== "random") expect(THEME_NAMES).toContain(theme);
  });

  // The rebrand tripwire: change one and forget the other and this fails.
  it("agrees with SITE_URL about which domain this is", () => {
    const siteUrl = process.env["SITE_URL"];
    if (!siteUrl) return; // unset locally is fine; CI and deploy set it
    expect(new URL(siteUrl).hostname.replace(/^www\./, "")).toBe(profile.identity.domain);
  });

  it("has usable social links", () => {
    expect(profile.socials.length).toBeGreaterThan(0);
    for (const social of profile.socials) {
      expect(social.label.trim()).not.toBe("");
      expect(social.display.trim()).not.toBe("");
      expect(
        /^(https?:|mailto:)/.test(social.href),
        `${social.label}: "${social.href}" is not a URL or mailto:`
      ).toBe(true);
    }
  });

  it("uses the configured domain in its own email and links", () => {
    expect(profile.identity.email).toMatch(/@/);
    expect(profile.identity.handle.trim()).not.toBe("");
    expect(profile.terminal.hostname.trim()).not.toBe("");
  });

  it("points at assets that actually exist", () => {
    const missing: string[] = [];
    const check = (path: string | undefined): void => {
      if (!path?.startsWith("/")) return;
      if (!existsSync(join(ROOT, "public", path.slice(1)))) missing.push(path);
    };
    check(profile.seo.ogImage);

    // Anything the two pages reference by root-absolute path.
    for (const page of ["index.html", "404.html"]) {
      const html = readFileSync(join(ROOT, page), "utf8");
      for (const match of html.matchAll(/(?:href|src)="(\/[^"]+)"/g)) {
        // /src/* are Vite module entries, not files served from public/.
        if (match[1]?.startsWith("/src/")) continue;
        check(match[1]);
      }
    }
    expect(missing).toEqual([]);
  });

  it("has neofetch rows and at least one skill", () => {
    expect(profile.neofetch.rows.length).toBeGreaterThan(0);
    expect(profile.neofetch.ascii.trim()).not.toBe("");
    expect(profile.skills.length).toBeGreaterThan(0);
  });

  it("gives every ssh persona a host and at least one question", () => {
    for (const [key, persona] of Object.entries(profile.ssh.personas)) {
      expect(persona.host, `${key} has no host`).toMatch(/\S/);
      expect(persona.qa.length, `${key} has no questions`).toBeGreaterThan(0);
      const cmds = persona.qa.map((q) => q.cmd);
      expect(new Set(cmds).size, `${key} has duplicate question commands`).toBe(cmds.length);
      // These would collide with the mode's own exit words.
      for (const cmd of cmds) expect(["exit", "logout", "quit", "help"]).not.toContain(cmd);
    }
  });
});

/**
 * The README is the first thing a fork reads, and its `cv` example is the
 * only place the shape is spelled out in full. Drift there is silent.
 */
describe("README", () => {
  const readme = readFileSync(join(ROOT, "README.md"), "utf8");
  const example = /## The CV[\s\S]*?```ts\n([\s\S]*?)```/.exec(readme)?.[1] ?? "";

  it("documents the CV example", () => {
    expect(example.length, "no ts example under ## The CV").toBeGreaterThan(200);
  });

  it("shows every field the cv config actually has", () => {
    const configured = Object.keys(profile.cv ?? {});
    expect(configured.length).toBeGreaterThan(4);
    const undocumented = configured.filter((key) => !new RegExp(`\\b${key}\\s*:`).test(example));
    expect(undocumented, "cv fields missing from the README example").toEqual([]);
  });

  it("shows every field a job actually has", () => {
    const job = profile.cv?.jobs?.[0];
    if (!job) return;
    const keys = [...Object.keys(job), ...Object.keys(job.org).map((k) => k)];
    const undocumented = keys.filter((key) => !new RegExp(`\\b${key}\\s*:`).test(example));
    expect(undocumented, "job fields missing from the README example").toEqual([]);
  });

  it("does not document fields that no longer exist", () => {
    // Catches the reverse drift: an example that outlived its config.
    const documented = [...example.matchAll(/^\s{2}([a-zA-Z]+):/gm)].map((m) => m[1] as string);
    const configured = new Set(Object.keys(profile.cv ?? {}));
    const stale = documented.filter((k) => !configured.has(k));
    expect(stale, "README documents cv fields the config doesn't have").toEqual([]);
  });
});
