import { describe, expect, it } from "vitest";
import { messages, interpolate } from "../src/i18n";
import { LOCALES } from "../src/i18n/locales";

type Node = Record<string, unknown>;

/** Flattens a message catalogue into dotted paths -> leaf value. */
function flatten(node: Node, prefix = ""): Map<string, unknown> {
  const out = new Map<string, unknown>();
  for (const [key, value] of Object.entries(node)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      for (const [k, v] of flatten(value as Node, path)) out.set(k, v);
    } else {
      out.set(path, value);
    }
  }
  return out;
}

const placeholders = (s: string): string[] =>
  [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1] as string).sort();

/** The opening tags with their class (`span.accent`, `a`), sorted, plus the closing-tag count. */
const markup = (s: string): string => {
  const opening = [...s.matchAll(/<([a-z]+)(?:\s[^>]*?class="([^"]+)")?[^>]*>/g)]
    .filter((m) => !(m[0] as string).startsWith("</"))
    .map((m) => (m[2] ? `${m[1]}.${m[2]}` : (m[1] as string)))
    .sort();
  const closing = (s.match(/<\/[a-z]+>/g) ?? []).length;
  return `${opening.join(",")}|close=${closing}`;
};

const KNOWN_ENTITIES = /&(lt|gt|amp|nbsp|middot|rarr|larr|times|#\d+|#x[0-9a-f]+);/i;

/**
 * Every catalogue this repo ships — *including the ones profile.config.ts
 * doesn't select*. An unselected catalogue is one import away from being
 * live, and `tsc` only pins its shape: array lengths and `{placeholders}`
 * are invisible to the type system, so they're checked here or nowhere.
 */
const modules = import.meta.glob("../src/i18n/messages/*.ts", { eager: true }) as Record<
  string,
  { default: Node }
>;

const catalogues = Object.fromEntries(
  Object.entries(modules).map(([path, mod]) => [
    (path.split("/").pop() as string).replace(/\.ts$/, ""),
    flatten(mod.default),
  ])
) as Record<string, Map<string, unknown>>;

const CODES = Object.keys(catalogues).sort();

// en.ts is the schema by construction — `Messages = typeof en` — so it is
// the comparison base whether or not this fork ships English.
const base = catalogues["en"] as Map<string, unknown>;

describe("i18n", () => {
  // Key presence is already enforced by `tsc` (ru is typed as Messages);
  // this catches the cases types can't see.
  it("every catalogue has the same keys as the schema", () => {
    for (const locale of CODES) {
      const other = catalogues[locale] as Map<string, unknown>;
      expect([...base.keys()].filter((k) => !other.has(k)), `missing in ${locale}`).toEqual([]);
      expect([...other.keys()].filter((k) => !base.has(k)), `extra in ${locale}`).toEqual([]);
    }
  });

  it("no message is left empty", () => {
    for (const locale of CODES) {
      for (const [key, value] of catalogues[locale] as Map<string, unknown>) {
        if (typeof value === "string") {
          expect(value.trim(), `${locale}/${key} is empty`).not.toBe("");
        }
      }
    }
  });

  // A translation that drops {host} renders a sentence with a hole in it.
  // Arrays are checked item by item. This test used to skip them, which
  // left every placeholder inside a scripted sequence — {host} in the boot
  // lines, {script} in the launcher — unchecked in every catalogue.
  it("interpolation placeholders match across catalogues", () => {
    const mismatches: string[] = [];
    const compare = (locale: string, key: string, value: unknown, expected: unknown): void => {
      if (Array.isArray(value) && Array.isArray(expected)) {
        value.forEach((item, i) => compare(locale, `${key}[${i}]`, item, expected[i]));
        return;
      }
      if (typeof value !== "string" || typeof expected !== "string") return;
      const got = placeholders(value).join(",");
      const want = placeholders(expected).join(",");
      if (got !== want) mismatches.push(`${locale}/${key}: {${got}} vs en {${want}}`);
    };
    for (const locale of CODES) {
      for (const [key, value] of catalogues[locale] as Map<string, unknown>) {
        compare(locale, key, value, base.get(key));
      }
    }
    expect(mismatches).toEqual([]);
  });

  // Translators carry the markup by hand: a dropped or unclosed span, or a
  // span moved onto a different class, renders as visibly broken output
  // in one language only. Compared leaf by leaf, arrays item by item.
  it("inline markup matches across catalogues", () => {
    const mismatches: string[] = [];
    const compare = (locale: string, key: string, value: unknown, expected: unknown): void => {
      if (Array.isArray(value) && Array.isArray(expected)) {
        value.forEach((item, i) => compare(locale, `${key}[${i}]`, item, expected[i]));
        return;
      }
      if (typeof value !== "string" || typeof expected !== "string") return;
      const got = markup(value);
      const want = markup(expected);
      if (got !== want) mismatches.push(`${locale}/${key}: ${got} vs en ${want}`);
    };
    for (const locale of CODES) {
      for (const [key, value] of catalogues[locale] as Map<string, unknown>) {
        compare(locale, key, value, base.get(key));
      }
    }
    expect(mismatches).toEqual([]);
  });

  // `print` takes HTML, so a bare `<`, `>` or `&` in a translation is either
  // swallowed by the parser or shown as a broken entity. Anything angle- or
  // ampersand-shaped must be a tag or a known entity.
  it("uses no bare < > & outside tags and known entities", () => {
    const offenders: string[] = [];
    const check = (locale: string, key: string, value: unknown): void => {
      if (Array.isArray(value)) return value.forEach((item, i) => check(locale, `${key}[${i}]`, item));
      if (typeof value !== "string") return;
      const stripped = value.replace(/<\/?[a-z]+(?:\s[^>]*)?>/g, "").replace(KNOWN_ENTITIES, "");
      const leftover = stripped.replace(new RegExp(KNOWN_ENTITIES.source, "gi"), "");
      if (/[<>&]/.test(leftover)) offenders.push(`${locale}/${key}: ${JSON.stringify(value)}`);
    };
    for (const locale of CODES) {
      for (const [key, value] of catalogues[locale] as Map<string, unknown>) check(locale, key, value);
    }
    expect(offenders).toEqual([]);
  });

  // The two strings that name the language in itself are the easiest to
  // leave as a copy of English when a catalogue is started from en.ts.
  it("names its own language in lang.set and notFound.announce", () => {
    for (const locale of CODES) {
      if (locale === "en") continue;
      for (const key of ["lang.set", "notFound.announce"]) {
        expect(catalogues[locale]!.get(key), `${locale}/${key} is still the English string`).not.toBe(base.get(key));
      }
    }
  });

  it("arrays used as sequences keep the same length across catalogues", () => {
    for (const locale of CODES) {
      for (const [key, value] of catalogues[locale] as Map<string, unknown>) {
        const expected = base.get(key);
        if (!Array.isArray(value) || !Array.isArray(expected)) continue;
        // Fortunes and time quips are free-form; scripted sequences are not.
        if (key === "fortunes" || key.startsWith("timeQuips.")) continue;
        expect(value.length, `${locale}/${key} length`).toBe(expected.length);
      }
    }
  });

  // The selected locales are a subset of what's on disk, and `messages` is
  // exactly those — this is what makes the loops above cover the live site.
  it("serves exactly the catalogues profile.config.ts selects", () => {
    expect(Object.keys(messages).sort()).toEqual([...LOCALES].sort());
    for (const locale of LOCALES) expect(CODES).toContain(locale);
  });

  it("interpolate substitutes known names and leaves unknown ones alone", () => {
    expect(interpolate("hi {name}", { name: "ada" })).toBe("hi ada");
    expect(interpolate("hi {name}", {})).toBe("hi {name}");
    expect(interpolate("no vars")).toBe("no vars");
  });
});
