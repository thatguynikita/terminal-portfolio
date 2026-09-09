import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { PUBLIC_THEMES, SECRET_THEMES, THEME_NAMES } from "../src/themes";

const DIR = join(process.cwd(), "src/themes");
const files = readdirSync(DIR).filter((f) => f.endsWith(".css"));

const tokensIn = (css: string): Set<string> =>
  new Set([...css.matchAll(/(--[a-z0-9-]+)\s*:/g)].map((m) => m[1] as string));

// green is the default theme, so its token list is the contract every
// other theme has to meet — nothing may fall back to another theme.
const reference = tokensIn(readFileSync(join(DIR, "green.css"), "utf8"));

describe("themes", () => {
  it("registers one theme per CSS file", () => {
    expect(THEME_NAMES.sort()).toEqual(files.map((f) => f.replace(/\.css$/, "")).sort());
    expect(THEME_NAMES.length).toBeGreaterThan(1);
  });

  it("keeps secret themes out of the public list but in the full list", () => {
    for (const secret of SECRET_THEMES) {
      expect(THEME_NAMES).toContain(secret);
      expect(PUBLIC_THEMES).not.toContain(secret);
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
