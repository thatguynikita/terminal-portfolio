import { mailtoFor, type ProfileConfig } from "./profile";
import { LOCALES, type Locale } from "../i18n/locales";

/**
 * Structured data for the two page kinds. Every property is *derived* from
 * config that exists for other reasons (skills, the CV's jobs, certs,
 * education, languages), so nothing can quietly contradict the visible
 * page; a section the config doesn't have is omitted, never emitted empty.
 *
 *   terminal page  → `@graph` of a WebSite and the Person, linked by `@id`
 *   CV pages       → a ProfilePage whose mainEntity is the same Person plus
 *                    alumniOf, hasCredential, hasOccupation, affiliation
 */

/** `AWS (primarily), GCP` → `["AWS (primarily)", "GCP"]`, deduped, order kept. */
function knowsAbout(profile: ProfileConfig): string[] {
  const seen = new Set<string>();
  for (const skill of profile.skills) {
    for (const part of skill.value.split(",")) {
      const item = part.trim();
      if (item) seen.add(item);
    }
  }
  return [...seen];
}

function personNode(
  profile: ProfileConfig,
  locale: Locale,
  origin: string,
  withCv: boolean
): Record<string, unknown> {
  const { cv } = profile;
  const person: Record<string, unknown> = {
    "@type": "Person",
    "@id": `${origin}/#owner`,
    name: profile.author[locale],
    ...(profile.seo.role ? { jobTitle: profile.seo.role[locale] } : {}),
    ...(mailtoFor(profile) ? { email: mailtoFor(profile) } : {}),
    url: `${origin}/`,
  };
  if (cv?.photo) person["image"] = `${origin}${cv.photo}`;

  const sameAs = profile.socials.filter((s) => s.href.startsWith("http")).map((s) => s.href);
  if (sameAs.length) person["sameAs"] = sameAs;

  const about = knowsAbout(profile);
  if (about.length) person["knowsAbout"] = about;

  const languages = cv?.languages?.map((l) => l.name[locale]) ?? [];
  if (languages.length) person["knowsLanguage"] = languages;

  if (withCv && cv) {
    if (cv.education) {
      person["alumniOf"] = {
        "@type": "EducationalOrganization",
        name: cv.education.university[locale],
      };
    }
    if (cv.certs?.length) {
      person["hasCredential"] = cv.certs.map((c) => ({
        "@type": "EducationalOccupationalCredential",
        name: c.name,
        dateCreated: c.year,
      }));
    }
    if (cv.jobs?.length) {
      // hasOccupation is present tense — the current role, which is the
      // first job listed. Past titles are not occupations the person *has*.
      // Occupation has no employer property (hiringOrganization belongs to
      // JobPosting — the validator flags it), so every employer, past and
      // present, goes on affiliation instead, deduped.
      person["hasOccupation"] = {
        "@type": "Occupation",
        name: cv.jobs[0]!.title[locale],
      };
      const orgs = new Map<string, Record<string, unknown>>();
      for (const job of cv.jobs) {
        if (!orgs.has(job.org.name)) {
          orgs.set(job.org.name, {
            "@type": "Organization",
            name: job.org.name,
            ...(job.org.url ? { url: job.org.url } : {}),
          });
        }
      }
      person["affiliation"] = [...orgs.values()];
    }
  }
  return person;
}

/** The terminal page: the site and its owner, as one graph. */
export function buildIndexJsonLd(
  profile: ProfileConfig,
  locale: Locale,
  origin: string
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${origin}/#website`,
        name: profile.terminal.hostname,
        url: `${origin}/`,
        inLanguage: [...LOCALES],
      },
      personNode(profile, locale, origin, false),
    ],
  };
}

/** A CV page: a profile page about the owner, with the résumé's facts. */
export function buildCvJsonLd(
  profile: ProfileConfig,
  locale: Locale,
  origin: string
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: personNode(profile, locale, origin, true),
  };
}
