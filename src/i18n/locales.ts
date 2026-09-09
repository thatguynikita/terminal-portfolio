/**
 * The canonical locale list.
 *
 * Adding a language is two steps:
 *   1. add its code here
 *   2. create `src/i18n/<code>.ts` and register it in `src/i18n/index.ts`
 *
 * Because `Localized<T>` is `Record<Locale, T>`, step 1 alone makes
 * TypeScript point at every profile.config.ts field that still needs a
 * translation — you can't half-add a language and ship it.
 */
export const LOCALES = ["en", "ru"] as const;

export type Locale = (typeof LOCALES)[number];

/** Any user-visible string that has to exist in every locale. */
export type Localized<T = string> = Record<Locale, T>;

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}
