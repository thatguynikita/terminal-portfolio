import type { ProfileConfig } from "../core/profile";
import type { Locale } from "../i18n/locales";

/**
 * Minimal Person structured data.
 *
 * Deliberately not the sprawling ProfilePage/hasOccupation/hasCredential
 * graph the predecessor emitted: every field here is *derived* from config
 * that already exists for other reasons, so there is nothing extra to keep
 * in sync, and nothing that can quietly contradict the visible page.
 */
export function buildCvJsonLd(
  profile: ProfileConfig,
  locale: Locale,
  origin: string
): Record<string, unknown> {
  const { identity } = profile;

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: identity.name[locale],
    jobTitle: identity.role[locale],
    email: `mailto:${identity.email}`,
    url: `${origin}/`,
    address: {
      "@type": "PostalAddress",
      addressLocality: identity.location[locale],
    },
    sameAs: profile.socials.filter((s) => s.href.startsWith("http")).map((s) => s.href),
  };

  if (identity.photo) data["image"] = `${origin}${identity.photo}`;
  return data;
}
