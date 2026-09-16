/**
 * Theme registry.
 *
 * Every `src/themes/*.css` file is imported and registered automatically —
 * adding a theme is one new CSS file, nothing else. The palette, the
 * matrix-rain colours (`--matrix-color` / `--matrix-fade`) and any
 * per-theme overrides all live inside that one file.
 *
 * One file is special: `secret.css` is the easter-egg theme, unlocked by
 * `claude "add light theme"`. Its CSS is addressed as "secret", but the name
 * visitors see and type is `commands.system.secretTheme` — the controller
 * maps between the two, so renaming the egg is a config edit.
 */
const modules = import.meta.glob("./*.css", { eager: true });

/** The id the secret theme's CSS answers to; never shown to a visitor. */
export const SECRET_ID = "secret";

/** Every theme id, the secret one included — derived from the filenames. */
export const THEME_IDS: string[] = Object.keys(modules)
  .map((path) => path.replace(/^\.\//, "").replace(/\.css$/, ""))
  .sort();
