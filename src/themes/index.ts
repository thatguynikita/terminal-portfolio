/**
 * Theme registry.
 *
 * Every `src/themes/*.css` file is imported and registered automatically —
 * adding a theme is one new CSS file, nothing else. The palette, the
 * matrix-rain colours (`--matrix-color` / `--matrix-fade`) and any
 * per-theme overrides all live inside that one file.
 *
 * The only thing declared here is which themes are hidden easter eggs.
 */
const modules = import.meta.glob("./*.css", { eager: true });

/** Hidden from `theme` completions and the `help` list until unlocked. */
export const SECRET_THEMES = new Set(["sabbatical"]);

/** Every theme name, secret ones included — derived from the filenames. */
export const THEME_NAMES: string[] = Object.keys(modules)
  .map((path) => path.replace(/^\.\//, "").replace(/\.css$/, ""))
  .sort();

export const PUBLIC_THEMES: string[] = THEME_NAMES.filter((n) => !SECRET_THEMES.has(n));
