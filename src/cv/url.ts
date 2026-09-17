import type { ProfileConfig } from "../core/profile.ts";
import { LOCALES, type Locale } from "../i18n/locales.ts";

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

/**
 * The portrait's alt text (and the sitemap's image title): name and role,
 * or just the name when no `seo.role` is configured.
 */
export function photoAltFor(
  profile: ProfileConfig,
  locale: Locale,
  t: (key: string, vars: Record<string, string>) => string,
): string {
  const name = profile.author[locale];
  const role = profile.seo.role?.[locale];
  return role ? t("cv.photoAlt", { name, role }) : t("cv.photoAltNoRole", { name });
}
