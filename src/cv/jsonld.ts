import { mailtoFor, type ProfileConfig } from "../core/profile";
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
    ...(mailtoFor(profile) ? { email: mailtoFor(profile) } : {}),
    url: `${origin}/`,
    address: {
      "@type": "PostalAddress",
      addressLocality: profile.seo.location[locale],
    },
    sameAs: profile.socials.filter((s) => s.href.startsWith("http")).map((s) => s.href),
  };

  if (profile.cv?.photo) data["image"] = `${origin}${profile.cv?.photo}`;
  return data;
}
