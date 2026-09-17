import type { ProfileConfig } from "../core/profile.ts";
import { skillsFor, socialsFor } from "../core/profile.ts";
import { LOCALES, type Locale } from "../i18n/locales.ts";
import { translate } from "../i18n/index.ts";
import { escapeHtml as esc } from "../core/html.ts";
import { CV_LINK_LABEL, cvUrl, photoAltFor } from "./url.ts";

/**
 * Renders the CV body as a string.
 *
 * Pure and DOM-free: it runs inside the Vite plugin at build time, which is
 * the whole point — the résumé ships in the initial HTML rather than being
 * assembled by JavaScript that no major AI crawler executes.
 */

const LANG_METER_CELLS = 10;

/**
 * Section headings, rendered as a shell command.
 *
 * Not translated, and deliberately so: a real shell doesn't translate its
 * filenames either, and the names still carry the section word — `about.txt`,
 * `experience.log` — so a crawler and the document outline get something
 * meaningful without a localized duplicate beside it.
 */
const SECTIONS = {
  about: { cmd: "cat", file: "about.txt" },
  experience: { cmd: "tail -n 200", file: "experience.log" },
  education: { cmd: "cat", file: "education.txt" },
  certifications: { cmd: "cat", file: "certifications.txt" },
  languages: { cmd: "cat", file: "languages.txt" },
  skills: { cmd: "less", file: "skills.sh" },
  notes: { cmd: "grep -A99 not_so_hard_skills", file: "notes.txt" },
} as const;

type SectionKey = keyof typeof SECTIONS;

export function renderCv(profile: ProfileConfig, locale: Locale): string {
  const t = (key: string, vars?: Record<string, string | number>): string =>
    translate(locale, `cv.${key}`, vars);
  const { terminal } = profile;
  const cv = profile.cv;
  if (!cv) return "";

  const prompt = `${esc(terminal.handle)}@${esc(terminal.hostname)}:~$`;

  /**
   * The filename is the heading text; the prompt and command are decoration,
   * so crawlers, screen readers and the outline see a section name, not
   * shell syntax.
   */
  const head = (key: SectionKey): string => {
    const { cmd, file } = SECTIONS[key];
    // Prompt and command are separate spans: print hides the prompt but
    // keeps the command, so a printed heading reads "cat about.txt".
    return (
      `<h2 id="${key}" class="section-head">` +
      `<span class="ps" aria-hidden="true">${prompt}</span>` +
      `<span class="cmd" aria-hidden="true">${cmd}</span> ` +
      `<span class="section-name">${file}</span></h2>`
    );
  };

  const out: string[] = [];

  /* ---------------- profile block ---------------- */

  const contacts = socialsFor(profile, "cv")
    .map(
      (s) =>
        `<a href="${esc(s.href)}"${s.href.startsWith("http") ? ' target="_blank" rel="noopener"' : ""}>${esc(s.label)}</a>`
    )
    .join('<span class="sep" aria-hidden="true"> · </span>');

  out.push(`<header class="profile">
  <div class="profile-text">
    <h1>${esc(profile.author[locale])}</h1>
    ${cv.tagline ? `<p class="tagline">${esc(cv.tagline[locale])}</p>` : ""}
    ${contacts ? `<p class="contact-row">${contacts}</p>` : ""}
    ${cv.metaLine ? `<p class="meta dim">${esc(cv.metaLine[locale])}</p>` : ""}
  </div>${
    cv.photo
      ? `
  <div class="avatar-frame style-${cv.photoStyle ?? "plain"}">
    <img class="avatar" src="${esc(cv.photo)}" width="150" height="150"
         alt="${esc(photoAltFor(profile, locale, (k, v) => translate(locale, k, v)))}">
  </div>`
      : ""
  }
</header>`);

  out.push(`<hr class="rule strong">`);

  /* ---------------- about ---------------- */

  if (cv.about?.[locale]) {
    out.push(`<section class="section">
  ${head("about")}
  <p>${esc(cv.about[locale])}</p>
</section>`);
  }

  /* ---------------- experience ---------------- */

  const jobs = (cv.jobs ?? [])
    .map((job) => {
      const bullets = job.bullets[locale].map((b: string) => `<li>${esc(b)}</li>`).join("");
      return `  <article class="job">
    <p class="job-meta"><span class="dates">${esc(job.dates[locale])}</span> <span class="span">(${esc(job.span[locale])})</span> <span class="sep" aria-hidden="true">&rsaquo;</span> <span class="co">${
        job.org.url
          ? `<a href="${esc(job.org.url)}" target="_blank" rel="noopener">${esc(job.org.name)}</a>`
          : esc(job.org.name)
      }</span> <span class="loc">${esc(job.org.location[locale])}</span></p>
    <h3 class="job-title">${esc(job.title[locale])}</h3>
    <ul class="bullets">${bullets}</ul>
    <p class="tech">${esc(t("techPrefix"))} ${esc(job.tech)}</p>
  </article>`;
    })
    .join("\n");

  if (jobs) {
    out.push(`<section class="section">
  ${head("experience")}
${jobs}
</section>`);
  }

  /* ---------------- education ---------------- */

  const edu = cv.education;
  if (edu) {
    out.push(`<section class="section">
  ${head("education")}
  <p><b>${esc(edu.university[locale])}</b> &mdash; ${esc(edu.place[locale])}, ${edu.year}<br>
  <span class="dim">${esc(edu.field[locale])}</span></p>
</section>`);
  }

  /* ---------------- certifications ---------------- */

  const certs = (cv.certs ?? [])
    .map(
      (c) =>
        `    <li class="cert-row"><span class="marker" aria-hidden="true">[x]</span> <span class="yr">${esc(c.year)}</span> ${esc(c.name)}</li>`
    )
    .join("\n");
  if (certs) {
    out.push(`<section class="section">
  ${head("certifications")}
  <ul class="certs">
${certs}
  </ul>
</section>`);
  }

  /* ---------------- languages ---------------- */

  // Name, meter, then level — the meter is `aria-hidden`, so assistive tech
  // and crawlers read straight from the name to the level regardless.
  const langs = (cv.languages ?? [])
    .map((l) => {
      const cells = Array.from({ length: LANG_METER_CELLS }, (_, i) =>
        i < l.filled ? `<i class="on"></i>` : `<i></i>`
      ).join("");
      return `    <li class="lang-row">
      <span class="lang-name">${esc(l.name[locale])}</span>
      <span class="lang-bar" aria-hidden="true">${cells}</span>
      <span class="lang-sub">${esc(l.sub[locale])}</span>
    </li>`;
    })
    .join("\n");
  if (langs) {
    out.push(`<section class="section">
  ${head("languages")}
  <ul class="langs">
${langs}
  </ul>
</section>`);
  }

  /* ---------------- skills ---------------- */

  const skillRows = skillsFor(profile, "cv")
    .map(
      (s) =>
        `    <tr><th scope="row">${esc(s.key[locale])}</th><td>${esc(s.value)}</td></tr>`
    )
    .join("\n");
  if (skillRows) {
    out.push(`<section class="section">
  ${head("skills")}
  <table class="skills">
${skillRows}
  </table>
</section>`);
  }

  /* ---------------- notes ---------------- */

  if (cv.traits?.[locale]?.length) {
    const traits = cv.traits[locale].map((tr: string) => `    <li>${esc(tr)}</li>`).join("\n");
    out.push(`<section class="section">
  ${head("notes")}
  <ul class="traits">
${traits}
  </ul>
</section>`);
  }

  if (cv.signOff?.[locale]) {
    // The shell dressing — `$ echo "…"` in the accent and amber colours —
    // belongs here, not in the config: the value is the sentence alone, so
    // a fork writes prose rather than markup, and it's escaped like prose.
    out.push(`<hr class="rule">`);
    out.push(
      `<p class="sign-off">$ <span class="accent">echo</span> ` +
        `<span class="amber">"${esc(cv.signOff[locale])}"</span>` +
        `<span class="fake-cursor" aria-hidden="true"></span></p>`
    );
  }

  return out.join("\n\n");
}

/** The topbar, including the language chip — real links, so JS is optional. */
export function renderCvTopbar(profile: ProfileConfig, locale: Locale): string {
  const locales = LOCALES;
  const index = locales.indexOf(locale);
  const next = locales[(index + 1) % locales.length] as Locale;

  const chip =
    locales.length > 1
      ? `<a class="chip" id="langChip" href="${cvUrl(profile, next)}" hreflang="${next}"
         data-locale="${next}" aria-label="${esc(translate(locale, "cv.switchLanguage"))}">${next.toUpperCase()}</a>`
      : "";

  return `<a href="/">&larr; ${esc(profile.terminal.hostname)}</a>
    <span class="right">
      <button id="printBtn" type="button">${esc(translate(locale, "cv.print"))}</button>
      ${chip}
      <span class="current glow" aria-current="page">${CV_LINK_LABEL}</span>
    </span>`;
}

/**
 * Byte length of the rendered CV, for the `ls` listing.
 *
 * The page is generated at build time, so the terminal can't measure it at
 * runtime — this is evaluated in the Vite/Vitest config and inlined as a
 * literal, keeping this module out of the browser bundle.
 */
export function cvByteSize(profile: ProfileConfig, locale: Locale): number {
  return new TextEncoder().encode(renderCv(profile, locale)).length;
}
