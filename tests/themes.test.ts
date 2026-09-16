import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { SECRET_ID, THEME_IDS } from "../src/themes";
import { publicThemes, themeId, themeNames } from "../src/core/theme";

const DIR = join(process.cwd(), "src/themes");
const files = readdirSync(DIR).filter((f) => f.endsWith(".css"));

const tokensIn = (css: string): Set<string> =>
  new Set([...css.matchAll(/(--[a-z0-9-]+)\s*:/g)].map((m) => m[1] as string));

// green is the default theme, so its token list is the contract every
// other theme has to meet — nothing may fall back to another theme.
const reference = tokensIn(readFileSync(join(DIR, "green.css"), "utf8"));

describe("themes", () => {
  it("registers one theme per CSS file", () => {
    expect(THEME_IDS.sort()).toEqual(files.map((f) => f.replace(/\.css$/, "")).sort());
    expect(THEME_IDS.length).toBeGreaterThan(1);
    expect(THEME_IDS, "the secret theme file is missing").toContain(SECRET_ID);
  });

  /**
   * `secret.css` is addressed by id but shown under the configured name.
   * The mapping is what lets a fork rename the egg without touching CSS.
   */
  it("shows the secret theme under its configured name, hidden until unlocked", () => {
    const names = themeNames("sabbatical");
    expect(names).toContain("sabbatical");
    expect(names, "the id leaked into the visible list").not.toContain(SECRET_ID);
    expect(names.length).toBe(THEME_IDS.length);
    expect(publicThemes("sabbatical")).not.toContain("sabbatical");
    expect(publicThemes("sabbatical").length).toBe(THEME_IDS.length - 1);
  });

  it("maps the visible name to the id, and never accepts the id as a name", () => {
    expect(themeId("sabbatical", "sabbatical")).toBe(SECRET_ID);
    expect(themeId("green", "sabbatical")).toBe("green");
    expect(themeId(SECRET_ID, "sabbatical")).toBeUndefined();
    expect(themeId("sabbatical", undefined)).toBeUndefined();
    expect(themeId("no-such-theme", "sabbatical")).toBeUndefined();
  });

  it("does not offer the secret theme at all when it has no name", () => {
    expect(themeNames(undefined)).toEqual(THEME_IDS.filter((id) => id !== SECRET_ID));
    expect(publicThemes(undefined)).toEqual(themeNames(undefined));
  });

  // A theme's per-theme overrides (the CRT flicker, most often) live in the
  // same file under a second `[data-theme=…]` selector. If that selector
  // names anything but the file, the override silently stops applying —
  // which is how the secret theme's flicker came back after a rename.
  it("keys every selector in a theme file to that file's own name", () => {
    for (const file of files) {
      const id = file.replace(/\.css$/, "");
      const css = readFileSync(join(DIR, file), "utf8");
      const named = [...css.matchAll(/data-theme="([^"]+)"/g)].map((m) => m[1]);
      expect(named.length, `${file} has no [data-theme] selector`).toBeGreaterThan(0);
      expect(new Set(named), `${file} addresses a theme other than itself`).toEqual(new Set([id]));
    }
  });

  it("declares matrix-rain colours, replacing the old THEME_MAP", () => {
    for (const file of files) {
      const css = readFileSync(join(DIR, file), "utf8");
      expect(css, `${file} is missing --matrix-color`).toContain("--matrix-color");
      expect(css, `${file} is missing --matrix-fade`).toContain("--matrix-fade");
    }
  });

  it("defines the complete token list in every theme", () => {
    const missing: string[] = [];
    for (const file of files) {
      const tokens = tokensIn(readFileSync(join(DIR, file), "utf8"));
      for (const token of reference) {
        if (!tokens.has(token)) missing.push(`${file}: ${token}`);
      }
    }
    expect(missing).toEqual([]);
  });

  it("scopes each file to its own data-theme selector", () => {
    for (const file of files) {
      const name = file.replace(/\.css$/, "");
      const css = readFileSync(join(DIR, file), "utf8");
      expect(css, `${file} does not scope itself`).toContain(`[data-theme="${name}"]`);
    }
  });
});
