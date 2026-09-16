import type { MatrixController, ThemeController } from "./types";
import { SECRET_ID, THEME_IDS } from "../themes";
import { StorageKey, readStored, writeStored } from "./storage";
import { pick } from "./html";

/**
 * Themes have an id (the CSS filename, what `data-theme` and storage hold)
 * and a name (what `theme` lists and the visitor types). They're the same
 * word for every theme but one: `secret.css` is shown under
 * `commands.system.secretTheme`, and not at all when that's unset.
 */
export function themeNames(secret: string | undefined): string[] {
  return THEME_IDS.flatMap((id) => (id === SECRET_ID ? (secret ? [secret] : []) : [id]));
}

/** The names on offer before the secret is unlocked. */
export function publicThemes(secret: string | undefined): string[] {
  return themeNames(secret).filter((n) => n !== secret);
}

/** A visible name → its id; undefined for anything not on offer. */
export function themeId(name: string, secret: string | undefined): string | undefined {
  if (secret && name === secret) return SECRET_ID;
  if (name === SECRET_ID) return undefined; // the id is not a name
  return THEME_IDS.includes(name) ? name : undefined;
}

function themeName(id: string, secret: string | undefined): string {
  return id === SECRET_ID ? (secret ?? id) : id;
}
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
  /**
   * `commands.system.secretTheme` — the visible name of `secret.css`, hidden
   * until unlocked. Undefined means the secret theme isn't offered at all.
   */
  secretTheme?: string | undefined;
}

export function createThemeController(
  matrix: MatrixController,
  options: ThemeOptions
): ThemeController {
  // A blank name is no name: the secret theme is then simply not on offer.
  const secret = options.secretTheme?.trim() || undefined;
  const NAMES = themeNames(secret);
  const PUBLIC = publicThemes(secret);
  // Ids that may be dealt to a first-time visitor or restored from storage.
  const IDS = THEME_IDS.filter((id) => id !== SECRET_ID || secret);
  let unlocked = false;

  /** Takes a visible name; the id is what reaches the DOM. */
  function apply(name: string): boolean {
    const id = themeId(name, secret);
    if (!id) return false;
    document.documentElement.dataset["theme"] = id;
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
    // Storage holds ids, so a renamed secret still restores.
    let stored = readStored(StorageKey.theme);
    if (!stored || !IDS.includes(stored)) {
      const preset = themeId(options.defaultTheme, secret);
      stored = options.defaultTheme === "random" || !preset ? pick(IDS) : preset;
      writeStored(StorageKey.theme, stored);
    }
    // Landing on the secret theme by luck shouldn't hide it from `theme`.
    if (stored === SECRET_ID) unlocked = true;
    apply(themeName(stored, secret));
  }

  restore();

  return {
    matrix,
    secretName: secret,

    list() {
      return unlocked ? NAMES : PUBLIC;
    },

    current() {
      const id = document.documentElement.dataset["theme"];
      return id ? themeName(id, secret) : (PUBLIC[0] ?? "green");
    },

    set(name) {
      if (!apply(name)) return false;
      writeStored(StorageKey.theme, themeId(name, secret) as string);
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
