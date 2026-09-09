import type { MatrixController, ThemeController } from "./types";
import { PUBLIC_THEMES, SECRET_THEMES, THEME_NAMES } from "../themes";
import { StorageKey, readStored, writeStored } from "./storage";
import { pick } from "./html";

const SECRET_NAME = "sabbatical";
const FALLBACK_MATRIX_COLOR = "#3dff8a";
const FALLBACK_MATRIX_FADE = "rgba(2,4,3,0.08)";

/**
 * Reads the matrix-rain colours the active theme declares.
 *
 * The old code kept a THEME_MAP in JS purely because "canvas can't read
 * CSS custom properties" — true of the canvas API, but `getComputedStyle`
 * reads them fine. So the map is gone and each theme's CSS file is the
 * single source of truth for its own colours.
 */
function readMatrixTokens(): { color: string; fade: string } {
  const style = getComputedStyle(document.documentElement);
  const color = style.getPropertyValue("--matrix-color").trim();
  const fade = style.getPropertyValue("--matrix-fade").trim();
  return {
    color: color || FALLBACK_MATRIX_COLOR,
    fade: fade || FALLBACK_MATRIX_FADE,
  };
}

export interface ThemeOptions {
  /** A theme name, or "random" to assign one to first-time visitors. */
  defaultTheme: string;
}

export function createThemeController(
  matrix: MatrixController,
  options: ThemeOptions
): ThemeController {
  let unlocked = false;

  function apply(name: string): boolean {
    if (!THEME_NAMES.includes(name)) return false;
    document.documentElement.dataset["theme"] = name;
    const { color, fade } = readMatrixTokens();
    matrix.setColor(color);
    matrix.setFadeColor(fade);
    return true;
  }

  /**
   * First-time visitors get a random theme (secret one included) which is
   * then persisted — a one-time assignment, not a reshuffle per load.
   */
  function restore(): void {
    let stored = readStored(StorageKey.theme);
    if (!stored || !THEME_NAMES.includes(stored)) {
      stored =
        options.defaultTheme === "random" || !THEME_NAMES.includes(options.defaultTheme)
          ? pick(THEME_NAMES)
          : options.defaultTheme;
      writeStored(StorageKey.theme, stored);
    }
    // Landing on the secret theme by luck shouldn't hide it from `theme`.
    if (SECRET_THEMES.has(stored)) unlocked = true;
    apply(stored);
  }

  restore();

  return {
    matrix,
    secretName: SECRET_NAME,

    list() {
      return unlocked ? THEME_NAMES : PUBLIC_THEMES;
    },

    current() {
      return document.documentElement.dataset["theme"] ?? PUBLIC_THEMES[0] ?? "green";
    },

    set(name) {
      if (!apply(name)) return false;
      writeStored(StorageKey.theme, name);
      return true;
    },

    secretUnlocked() {
      return unlocked;
    },

    unlockSecret() {
      unlocked = true;
    },
  };
}
