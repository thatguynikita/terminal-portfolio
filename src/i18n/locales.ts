import { MESSAGES } from "../../profile.config";

/**
 * The locale set, derived from the catalogues profile.config.ts imports.
 *
 * There is no list to keep in sync here: choosing languages is editing
 * `MESSAGES` in profile.config.ts, and nothing else. A catalogue this repo
 * ships but that config doesn't import is never referenced, so it never
 * reaches the bundle.
 *
 * Because `Localized<T>` is `Record<Locale, T>`, adding a language to
 * `MESSAGES` makes TypeScript point at every profile.config.ts field that
 * still needs a translation — you can't half-add a language and ship it.
 */
export type Locale = keyof typeof MESSAGES;

/** Selected locales in rotation order — object keys keep insertion order. */
export const LOCALES = Object.keys(MESSAGES) as Locale[];

/** Any user-visible string that has to exist in every locale. */
export type Localized<T = string> = Record<Locale, T>;

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

/**
 * The next locale in the configured rotation, wrapping at the end — so a
 * site with three or more languages cycles through all of them one step
 * at a time. An unknown `current` starts the rotation from the beginning.
 */
export function nextLocale<T extends string>(locales: readonly T[], current: T): T {
  return locales[(locales.indexOf(current) + 1) % locales.length] as T;
}
