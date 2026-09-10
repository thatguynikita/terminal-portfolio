import type { ProfileConfig } from "../core/profile";
import { LOCALES, type Locale } from "../i18n/locales";

/**
 * Where the CV lives for a given locale.
 *
 * The default locale is unprefixed (`/cv.html`); every other configured
 * locale sits under its own directory (`/ru/cv.html`). Shared by the `cv`
 * command, the terminal's topbar link, the language chip, the hreflang
 * cluster and the sitemap — so a change of scheme is a change in one place.
 */
export function cvUrl(profile: ProfileConfig, locale: Locale): string {
  return locale === profile.terminal.defaultLocale ? "/cv.html" : `/${locale}/cv.html`;
}

/** Every CV page that should be generated, in configured order. */
export function cvLocales(profile: ProfileConfig): Locale[] {
  return profile.cv ? [...LOCALES] : [];
}

/** How the CV is labelled in every page's topbar. */
export const CV_LINK_LABEL = "cv.html";
