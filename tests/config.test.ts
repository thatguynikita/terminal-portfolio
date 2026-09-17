import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import profile, { MESSAGES } from "../profile.config.ts";
import { LOCALES, type Locale } from "../src/i18n/locales.ts";
import { SECRET_ID, THEME_IDS } from "../src/themes/index.ts";
import type { ProfileConfig } from "../src/core/profile.ts";

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

/**
 * `commands.system.since` must carry an offset (or Z): a naive
 * "2026-08-09T20:48:27" is parsed as the *visitor's* local time, so the
 * same config would count uptime differently in every timezone.
 */
function expectValidSince(since: unknown, label: string): void {
  if (since === undefined) return; // omitted means "the build" — fine
  expect(typeof since, `${label}: since must be a string`).toBe("string");
  expect(Number.isNaN(new Date(since as string).getTime()), `${label}: unparsable since`).toBe(false);
  expect(since as string, `${label}: since needs a UTC offset or Z`).toMatch(/(Z|[+-]\d\d:\d\d)$/);
}

/** `skills[i]` / `socials[i]` rows tagged `["cv"]` while `cv` is absent. */
function cvOnlyRowsWithoutCv(p: { cv?: unknown; skills?: Array<{ contexts?: string[] }>; socials?: Array<{ contexts?: string[] }> }): string[] {
  if (p.cv) return [];
  const out: string[] = [];
  for (const [list, rows] of [["skills", p.skills ?? []], ["socials", p.socials ?? []]] as const) {
    rows.forEach((row, i) => {
      if (row.contexts && row.contexts.length > 0 && row.contexts.every((c) => c === "cv")) {
        out.push(`${list}[${i}] is tagged for the CV, but no cv is configured`);
      }
    });
  }
  return out;
}

/**
 * Rules that hold for any config, run against the real one and both
 * examples. Everything here reads the *resolved* profile, which is what
 * every config exports, so the same code fits all three.
 */
function sharedRules(label: string, p: ProfileConfig): void {
  // The launcher is typed as a fake shell file: `./<script>` has to parse as
  // a path, and `ls` has to print it. A space or a slash would break both.
  it("names the game launcher as a bare filename", () => {
    if (!p.commands?.game) return; // no game is a valid setup
    expect(p.commands.game.script, `${label}: game block without a script`).toBeTruthy();
    expect(p.commands.game.script).toMatch(/^[\w.-]+$/);
  });

  it("dates the machine with an offset, when it dates it at all", () => {
    expectValidSince(p.commands?.system?.since, label);
  });

  // The secret theme's visible name is free-form, but it must not shadow a
  // public theme, and "secret" is the CSS id — a name would collide with it.
  it("gives the secret theme a name no other theme has", () => {
    const secret = p.commands?.system?.secretTheme;
    if (secret === undefined) return;
    expect(typeof secret, `${label}: secretTheme`).toBe("string");
    expect(secret.trim(), `${label}: secretTheme is blank`).not.toBe("");
    expect(secret).not.toBe(SECRET_ID);
    expect(THEME_IDS, `${label}: secretTheme "${secret}" shadows a public theme`).not.toContain(secret);
  });

  it("names a theme that exists", () => {
    const theme = p.terminal.defaultTheme;
    if (theme !== "random") expect(THEME_IDS, `${label}: defaultTheme`).toContain(theme);
  });

  it("has a shell user and hostname", () => {
    expect(p.terminal.handle.trim(), `${label}: handle`).not.toBe("");
    expect(p.terminal.hostname.trim(), `${label}: hostname`).not.toBe("");
  });

  it("has usable social links, when it has any", () => {
    for (const social of p.socials) {
      expect(social.label.trim()).not.toBe("");
      expect(social.display.trim()).not.toBe("");
      expect(
        /^(https?:|mailto:)/.test(social.href),
        `${label}: ${social.label}: "${social.href}" is not a URL or mailto:`
      ).toBe(true);
    }
  });

  // The portrait isn't referenced from either shell — cv.html is generated
  // — so without this a broken path ships a broken image on the CV and a
  // dead <image:loc> in sitemap.xml, and check stays green.
  it("points at assets that actually exist", () => {
    const missing = [p.seo.ogImage, p.cv?.photo].filter(
      (path): path is string => Boolean(path?.startsWith("/")) && !existsSync(join(ROOT, "public", path!.slice(1)))
    );
    expect(missing, `${label}: missing assets`).toEqual([]);
  });

  it("has neofetch rows and art when it has a card, and no empty skill list", () => {
    if (p.neofetch) {
      expect(p.neofetch.rows.length, `${label}: neofetch rows`).toBeGreaterThan(0);
      expect(p.neofetch.ascii.trim(), `${label}: neofetch art`).not.toBe("");
    }
    // `skills: []` is the resolved form of "omitted"; a written empty list is
    // the same thing, so nothing to assert beyond the shape.
    expect(Array.isArray(p.skills)).toBe(true);
  });

  // A description is the one thing search engines and share cards can't
  // invent well. Optional, but its absence is worth a line in the output.
  it("warns, without failing, when seo.description is not set", () => {
    if (p.seo.description) return;
    console.warn(
      `${label}: seo.description is not set — the terminal page ships with no meta description, no og:description, and llms.txt has no site summary; search engines will write their own snippet.`
    );
  });

  // A row tagged for the CV can never render when there is no CV. That's a
  // half-removed résumé, not a preference, so it fails rather than hides.
  it("tags no skill or social for a CV that isn't configured", () => {
    expect(cvOnlyRowsWithoutCv(p)).toEqual([]);
  });

  it("gives every ssh persona a host and at least one question", () => {
    for (const [key, persona] of Object.entries(p.commands?.ssh?.personas ?? {})) {
      expect(persona.host, `${label}: ${key} has no host`).toMatch(/\S/);
      expect(persona.qa.length, `${label}: ${key} has no questions`).toBeGreaterThan(0);
      const cmds = persona.qa.map((q) => q.cmd);
      expect(new Set(cmds).size, `${label}: ${key} has duplicate question commands`).toBe(cmds.length);
      // These would collide with the mode's own exit words.
      for (const cmd of cmds) expect(["exit", "logout", "quit", "help"]).not.toContain(cmd);
    }
  });
}

describe("the cv-context rule", () => {
  it("names the row that can never render", () => {
    const bad = { skills: [{ contexts: ["cv"] }, { contexts: ["terminal", "cv"] }], socials: [{ contexts: ["cv"] }] };
    expect(cvOnlyRowsWithoutCv(bad)).toEqual([
      "skills[0] is tagged for the CV, but no cv is configured",
      "socials[0] is tagged for the CV, but no cv is configured",
    ]);
    expect(cvOnlyRowsWithoutCv({ ...bad, cv: {} })).toEqual([]);
  });
});

/** The two shells are hand-written HTML; anything they reference by root-absolute path must be in public/. */
describe("pages/", () => {
  it("reference assets that actually exist", () => {
    // Emitted by the build rather than shipped in public/.
    const generated = new Set(["/site.webmanifest", "/sitemap.xml", "/robots.txt", "/llms.txt"]);
    const missing: string[] = [];
    for (const page of ["index.html", "404.html"]) {
      const html = readFileSync(join(ROOT, "pages", page), "utf8");
      for (const match of html.matchAll(/(?:href|src)="(\/[^"]+)"/g)) {
        const path = match[1] ?? "";
        // /src/* are Vite module entries, not files served from public/.
        if (path.startsWith("/src/") || generated.has(path)) continue;
        if (!existsSync(join(ROOT, "public", path.slice(1)))) missing.push(`${page}: ${path}`);
      }
    }
    expect(missing).toEqual([]);
  });
});

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

  // SITE_URL is the one deployment fact that isn't in the config: the
  // origin for every absolute URL and the CNAME. `vite build` refuses to
  // run without it. Here it's only checked for shape when present, since
  // CI runs the tests with no environment and that must stay green.
  it("SITE_URL, when set, is a bare origin", () => {
    const siteUrl = process.env["SITE_URL"];
    if (!siteUrl) return;
    expect(siteUrl, "SITE_URL must be https://host with no path").toMatch(/^https?:\/\/[^/]+\/?$/);
    expect(new URL(siteUrl).hostname).not.toMatch(/\.example$/);
  });

  sharedRules("profile.config.ts", profile);
});

/**
 * Both example configs, checked against the same rules — they are what a
 * fork copies first, and nothing imports them, so they could rot silently.
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
    // Uncommented only: the examples show the default as a commented line.
    const fallback = /^\s*defaultLocale:\s*"([^"]+)"/m.exec(example)?.[1] ?? locales[0];
    expect(locales, `defaultLocale "${fallback}" is not shipped`).toContain(fallback);
  });

  // The examples aren't typechecked, so the switch types `tsc` would insist
  // on for the real config are checked here instead — for the switches an
  // example sets. Each default is shown commented out, so most are absent.
  it("types every switch it sets as a boolean", () => {
    const { terminal, seo } = mod!.default as {
      terminal?: Record<string, unknown>;
      seo?: Record<string, unknown>;
    };
    const bool = (v: unknown, name: string) => {
      if (v !== undefined) expect(typeof v, name).toBe("boolean");
    };
    bool(terminal?.["bootScreen"], "terminal.bootScreen");
    bool(terminal?.["chips"], "terminal.chips");
    const footer = terminal?.["footer"] as Record<string, unknown> | undefined;
    bool(footer?.["copyright"], "terminal.footer.copyright");
    bool(footer?.["backToTerminal"], "terminal.footer.backToTerminal");
    for (const key of [
      "enableRobotsTxt", "enableSitemap", "enableLlmsTxt",
      "enableJsonLd", "enableNoscript", "enableSocialCards", "enable404",
    ]) {
      bool(seo?.[key], `seo.${key}`);
    }
    const signal = seo?.["contentSignal"] as Record<string, unknown> | undefined;
    for (const key of ["search", "aiTrain", "aiInput"]) bool(signal?.[key], `seo.contentSignal.${key}`);
  });

  it("sends nobody into src/ to change languages", () => {
    // The whole point of deriving Locale from MESSAGES: picking languages is
    // this file and nothing else. A numbered recipe pointing at src/i18n
    // means that promise has quietly broken.
    expect(example, "the header should not send anyone into src/").not.toMatch(/\d\.\s+src\/i18n/);
  });

  it("keeps its own hosts non-resolving, apart from real social platforms", () => {
    const hosts = [...example.matchAll(/https?:\/\/([^/"')\s]+)/g)].map((m) => m[1] as string);
    expect(hosts.length).toBeGreaterThan(3);
    const platforms = /(github\.com|linkedin\.com|t\.me|fosstodon\.org|twitter\.com|x\.com)$/;
    const live = hosts.filter((h) => !h.endsWith(".example") && !platforms.test(h));
    expect(live, "example points at a live host").toEqual([]);
  });

  // The rules any config must meet, on the resolved profile the example exports.
  sharedRules(file, mod!.default as ProfileConfig);
});
