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

const catalogues = Object.fromEntries(
  LOCALES.map((l) => [l, flatten(messages[l] as unknown as Node)])
) as Record<string, Map<string, unknown>>;

const base = catalogues["en"] as Map<string, unknown>;

describe("i18n", () => {
  // Key presence is already enforced by `tsc` (ru is typed as Messages);
  // this catches the cases types can't see.
  it("every locale has the same keys as the default", () => {
    for (const locale of LOCALES) {
      const other = catalogues[locale] as Map<string, unknown>;
      expect([...base.keys()].filter((k) => !other.has(k)), `missing in ${locale}`).toEqual([]);
      expect([...other.keys()].filter((k) => !base.has(k)), `extra in ${locale}`).toEqual([]);
    }
  });

  it("no message is left empty", () => {
    for (const locale of LOCALES) {
      for (const [key, value] of catalogues[locale] as Map<string, unknown>) {
        if (typeof value === "string") {
          expect(value.trim(), `${locale}/${key} is empty`).not.toBe("");
        }
      }
    }
  });

  // A translation that drops {host} renders a sentence with a hole in it.
  it("interpolation placeholders match across locales", () => {
    const mismatches: string[] = [];
    for (const locale of LOCALES) {
      for (const [key, value] of catalogues[locale] as Map<string, unknown>) {
        const expected = base.get(key);
        if (typeof value !== "string" || typeof expected !== "string") continue;
        const got = placeholders(value).join(",");
        const want = placeholders(expected).join(",");
        if (got !== want) mismatches.push(`${locale}/${key}: {${got}} vs en {${want}}`);
      }
    }
    expect(mismatches).toEqual([]);
  });

  it("arrays used as sequences keep the same length across locales", () => {
    for (const locale of LOCALES) {
      for (const [key, value] of catalogues[locale] as Map<string, unknown>) {
        const expected = base.get(key);
        if (!Array.isArray(value) || !Array.isArray(expected)) continue;
        // Fortunes and time quips are free-form; scripted sequences are not.
        if (key === "fortunes" || key.startsWith("timeQuips.")) continue;
        expect(value.length, `${locale}/${key} length`).toBe(expected.length);
      }
    }
  });

  it("interpolate substitutes known names and leaves unknown ones alone", () => {
    expect(interpolate("hi {name}", { name: "ada" })).toBe("hi ada");
    expect(interpolate("hi {name}", {})).toBe("hi {name}");
    expect(interpolate("no vars")).toBe("no vars");
  });
});
