import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import profile, { MESSAGES } from "../profile.config";
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
const enabled = LOCALES;

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
  // `defaultLocale` being one of the shipped locales is a *compile* error
  // now that Locale is `keyof typeof MESSAGES`, so what's left to assert at
  // runtime is that the derived list really is the config's map, in order —
  // rotation order is MESSAGES' declaration order.
  it("derives its locales from MESSAGES, in declaration order", () => {
    expect(enabled.length).toBeGreaterThan(0);
    expect(enabled).toEqual(Object.keys(MESSAGES));
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
    // The CV portrait. It isn't referenced from either shell — cv.html is
    // generated — so without this line a broken path ships a broken image
    // on the CV and a dead <image:loc> in sitemap.xml, and check stays green.
    check(profile.identity.photo);

    // Anything the two pages reference by root-absolute path.
    for (const page of ["index.html", "404.html"]) {
      const html = readFileSync(join(ROOT, "pages", page), "utf8");
      // Emitted by the build rather than shipped in public/, so they are
      // only on disk after `vite build`.
      const generated = new Set([
        "/site.webmanifest",
        "/sitemap.xml",
        "/robots.txt",
        "/llms.txt",
      ]);
      for (const match of html.matchAll(/(?:href|src)="(\/[^"]+)"/g)) {
        // /src/* are Vite module entries, not files served from public/.
        if (match[1]?.startsWith("/src/")) continue;
        if (generated.has(match[1] ?? "")) continue;
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
 * The example config is what a fork copies first, and nothing imports it —
 * tsc never sees it, so it can rot silently. These checks are structural
 * rather than semantic: it must parse, cover the same keys, and stay
 * single-language.
 */
/**
 * Both example configs, checked against the same rules.
 *
 * Neither is in tsconfig's `include`, and they can't be: `Localized` is
 * `Record<Locale, T>` where `Locale` comes from the *live* config's
 * MESSAGES, so a three-language example can't typecheck alongside a
 * two-language profile.config.ts. This suite is the substitute — it
 * imports each example at runtime, where types don't exist, and walks it.
 */
const exampleModules = import.meta.glob("../profile.config.*.ts", { eager: true }) as Record<
  string,
  { default: unknown; MESSAGES: Record<string, unknown> }
>;

/**
 * Paths of objects that look like locale maps but don't carry exactly the
 * locales that example ships — a missing translation, or a stray one left
 * behind from a language that was dropped.
 */
function localeMismatches(node: unknown, expected: string[], path = ""): string[] {
  if (!node || typeof node !== "object") return [];
  if (Array.isArray(node)) {
    return node.flatMap((item, i) => localeMismatches(item, expected, `${path}[${i}]`));
  }
  const record = node as Record<string, unknown>;
  const keys = Object.keys(record);
  // A locale map is anything carrying at least one of this example's codes.
  if (keys.some((k) => expected.includes(k))) {
    const sorted = [...keys].sort();
    return sorted.join(",") === [...expected].sort().join(",")
      ? []
      : [`${path}: {${sorted.join(",")}}`];
  }
  return Object.entries(record).flatMap(([key, value]) =>
    localeMismatches(value, expected, path ? `${path}.${key}` : key)
  );
}

describe.each([
  { file: "profile.config.example.ts", locales: ["en"] },
  { file: "profile.config.multilingual.example.ts", locales: ["en", "es", "de"] },
])("$file", ({ file, locales }) => {
  const example = readFileSync(join(ROOT, file), "utf8");
  const mod = exampleModules[`../${file}`];

  it("is importable, and declares the locales it claims", () => {
    expect(mod, `${file} was not picked up by the glob`).toBeTruthy();
    expect(Object.keys(mod!.MESSAGES)).toEqual(locales);
    expect(example).toContain(`export const MESSAGES = { ${locales.join(", ")} };`);
  });

  it("covers every top-level key the real config has", () => {
    const keys = Object.keys(profile);
    const missing = keys.filter((k) => !new RegExp(`^  ${k}:`, "m").test(example));
    expect(missing, "keys missing from the example").toEqual([]);
  });

  it("covers every cv section the real config has", () => {
    const keys = Object.keys(profile.cv ?? {});
    const missing = keys.filter((k) => !new RegExp(`^    ${k}:`, "m").test(example));
    expect(missing, "cv sections missing from the example").toEqual([]);
  });

  // The check that earns its keep on a three-language example, and the one
  // `tsc` would do if these files could be typechecked in place.
  it("translates every localized field into exactly its own locales", () => {
    expect(localeMismatches(mod!.default, locales)).toEqual([]);
  });

  it("serves an unprefixed default that is one of its own locales", () => {
    const fallback = /defaultLocale:\s*"([^"]+)"/.exec(example)?.[1] ?? "";
    expect(locales, `defaultLocale "${fallback}" is not shipped`).toContain(fallback);
  });

  it("sends nobody into src/ to change languages", () => {
    // The whole point of deriving Locale from MESSAGES: picking languages is
    // this file and nothing else. A numbered recipe pointing at src/i18n
    // means that promise has quietly broken.
    expect(example, "the header should not send anyone into src/").not.toMatch(/\d\.\s+src\/i18n/);
  });

  it("publishes to a reserved domain, so it can't be deployed by accident", () => {
    // identity.domain drives the CNAME the build emits.
    const domain = /^\s*domain:\s*"([^"]+)"/m.exec(example)?.[1] ?? "";
    expect(domain, `example domain "${domain}" is not reserved`).toMatch(/\.example$/);
  });

  it("keeps its own hosts non-resolving, apart from real social platforms", () => {
    const hosts = [...example.matchAll(/https?:\/\/([^/"')\s]+)/g)].map((m) => m[1] as string);
    expect(hosts.length).toBeGreaterThan(3);
    const platforms = /(github\.com|linkedin\.com|t\.me|fosstodon\.org|twitter\.com|x\.com)$/;
    const live = hosts.filter((h) => !h.endsWith(".example") && !platforms.test(h));
    expect(live, "example points at a live host").toEqual([]);
  });
});
