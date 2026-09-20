import { execFileSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, loadEnv, type Plugin } from "vite";

const HERE = dirname(fileURLToPath(import.meta.url));

/**
 * Where the page shells live. This is Vite's `root`, so the HTML files sit
 * together in one directory instead of scattered across the repo root — and
 * because it's the root, they still emit to the top of `dist/`.
 */
const PAGES = resolve(HERE, "pages");
const page = (name: string): string => resolve(PAGES, name);

import profile from "./profile.config.ts";
import { buildCvJsonLd, buildIndexJsonLd } from "./src/core/jsonld.ts";
import {
  mailtoFor,
  renderContentSignal,
  renderFooter,
  skillsFor,
  socialsFor,
} from "./src/core/profile.ts";
import { StorageKey } from "./src/core/storage.ts";
import { cvByteSize, renderCv, renderCvTopbar } from "./src/cv/render.ts";
import { cvLocales, cvUrl, photoAltFor } from "./src/cv/url.ts";
import { translate } from "./src/i18n/index.ts";
import { LOCALES, type Locale, languageName, posixLocale } from "./src/i18n/locales.ts";

/**
 * Where the site is published — the origin for every absolute URL the build
 * emits (canonicals, the hreflang cluster, og:url, the sitemap, llms.txt)
 * and the source of the CNAME file. It lives in the environment, not the
 * config: `SITE_URL` in `.env` (see .env.example), or the shell, or CI's
 * `vars.SITE_URL`. The shell wins over the file.
 *
 * Vite only exposes VITE_-prefixed variables to the app; this file runs in
 * Node and reads `.env` itself with loadEnv, so `npm run build` and
 * `npm run deploy` see it without a dotenv wrapper.
 *
 * Empty is allowed in dev — URLs come out root-relative, which is fine on
 * localhost — and refused for a build, below.
 */
const SITE_URL = (
  process.env["SITE_URL"] ??
  loadEnv("production", process.cwd(), "")["SITE_URL"] ??
  ""
).replace(/\/$/, "");
// profile.config.ts is imported above, before this line ran; its default
// hostname is a getter reading process.env.SITE_URL, so publish it here.
if (SITE_URL && !process.env["SITE_URL"]) process.env["SITE_URL"] = SITE_URL;
const DEFAULT_LOCALE = profile.terminal.defaultLocale;

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Applies the stored theme before first paint.
 *
 * The page entries are `<script type="module">`, which is deferred, so
 * without this the browser paints under the default palette and the
 * visitor's theme arrives a frame later — a visible flash, and most
 * visitors have a non-default theme since first-timers are assigned one at
 * random. The storage key is imported rather than retyped so it cannot
 * drift from src/core/storage.ts.
 */
function themeBootstrap(): string {
  return (
    `<script>try{var t=localStorage.getItem(${JSON.stringify(StorageKey.theme)});` +
    `if(t)document.documentElement.dataset.theme=t}catch(e){}</script>`
  );
}

/**
 * Two optional pieces of the terminal shell, switched off in config by
 * removing their markup rather than hiding it: `terminal.bootScreen` is the
 * `#boot` overlay (its `> booting ...` placeholder would otherwise flash
 * before JS runs), `terminal.chips` is the `#chips` bar (and its border).
 * The runtime checks the same flags, so a shell that keeps the markup still
 * behaves. The patterns match the exact lines in pages/index.html.
 */
function stripDisabledChrome(html: string, isIndex: boolean): string {
  if (!isIndex) return html;
  let out = html;
  if (!profile.terminal.bootScreen)
    out = out.replace(/[ \t]*<div id="boot"[^>]*>[^<]*<\/div>\n?/, "");
  if (!profile.terminal.chips)
    out = out.replace(/[ \t]*<div class="chips" id="chips"><\/div>\n?/, "");
  return out;
}

/**
 * Static fallback for crawlers and no-JS clients on the terminal page.
 * The CV needs no equivalent — its content is the page.
 */
function noscriptHtml(lang: Locale): string {
  const rows = (pairs: Array<[string, string]>): string =>
    `<table>${pairs.map(([k, v]) => `<tr><th>${k}</th><td>${v}</td></tr>`).join("")}</table>`;

  const metaLine = profile.cv?.metaLine?.[lang];
  const skillsLink = profile.cv
    ? `\n  <p>Full skill breakdown: <a href="${cvUrl(profile, lang)}#skills">${escapeHtml(cvUrl(profile, lang))}#skills</a></p>`
    : "";
  // Every part is optional; a missing one leaves no heading behind.
  const role = profile.seo.role?.[lang];
  const bio = profile.bio?.[lang];
  const skills = skillsFor(profile, "terminal");
  const socials = socialsFor(profile, "terminal");
  const parts = [
    role ? `<p>${escapeHtml(role)}</p>` : "",
    metaLine ? `<p>${escapeHtml(metaLine)}</p>` : "",
    bio ? `<h2>About</h2>\n  <p>${escapeHtml(bio.replace(/\s+/g, " ").trim())}</p>` : "",
    skills.length
      ? `<h2>Skills</h2>\n  ${rows(skills.map((s) => [escapeHtml(s.key[lang]), escapeHtml(s.value)]))}${skillsLink}`
      : "",
    socials.length
      ? `<h2>Contact</h2>\n  ${rows(
          socials.map((s) => [
            escapeHtml(s.label),
            `<a href="${escapeHtml(s.href)}" rel="me noopener noreferrer">${escapeHtml(s.display)}</a>`,
          ]),
        )}`
      : "",
  ].filter(Boolean);
  // Nothing to say without JS either: no empty block.
  if (parts.length === 0) return "";
  return `<noscript>\n  ${parts.join("\n  ")}\n</noscript>`;
}

function personJsonLd(lang: Locale): string {
  return `<script type="application/ld+json">${JSON.stringify(buildIndexJsonLd(profile, lang, SITE_URL, lastModified()), null, 2)}</script>`;
}

/**
 * The share-card tags every page carries, in one place so the terminal,
 * the 404 and the CV can't drift. Twitter gets explicit tags rather than
 * relying on its og:* fallback — twitter:image in particular is what
 * decides whether a card shows a picture.
 */
function socialCardTags(opts: {
  type: "website" | "profile";
  title: string;
  description: string | undefined;
  url: string;
  /** Root-relative path under public/, or "" for no image. */
  image: string;
  imageAlt?: string;
  locale: Locale;
  alternates?: readonly Locale[];
  twitterCard: "summary" | "summary_large_image";
}): string[] {
  const t = escapeHtml(opts.title);
  const d = opts.description ? escapeHtml(opts.description) : "";
  const img = opts.image ? escapeHtml(`${SITE_URL}${opts.image}`) : "";
  const alt = img && opts.imageAlt ? escapeHtml(opts.imageAlt) : "";
  // Width and height let a platform draw the card before fetching the
  // image; alt is what a screen reader gets for the preview.
  const size = img ? imageSize(join(HERE, "public", opts.image)) : null;
  return [
    `<meta property="og:type" content="${opts.type}" />`,
    `<meta property="og:site_name" content="${escapeHtml(profile.terminal.hostname)}" />`,
    `<meta property="og:locale" content="${posixLocale(opts.locale)}" />`,
    ...(opts.alternates ?? [])
      .filter((l) => l !== opts.locale)
      .map((l) => `<meta property="og:locale:alternate" content="${posixLocale(l)}" />`),
    `<meta property="og:title" content="${t}" />`,
    d ? `<meta property="og:description" content="${d}" />` : "",
    `<meta property="og:url" content="${opts.url}" />`,
    img ? `<meta property="og:image" content="${img}" />` : "",
    size ? `<meta property="og:image:width" content="${size.width}" />` : "",
    size ? `<meta property="og:image:height" content="${size.height}" />` : "",
    alt ? `<meta property="og:image:alt" content="${alt}" />` : "",
    `<meta name="twitter:card" content="${opts.twitterCard}" />`,
    `<meta name="twitter:title" content="${t}" />`,
    d ? `<meta name="twitter:description" content="${d}" />` : "",
    img ? `<meta name="twitter:image" content="${img}" />` : "",
    alt ? `<meta name="twitter:image:alt" content="${alt}" />` : "",
  ];
}

/** Wider than 3:2 — the shape a `summary_large_image` card is drawn for. */
function isWide(image: string): boolean {
  const size = image ? imageSize(join(HERE, "public", image)) : null;
  return size !== null && size.width >= size.height * 1.5;
}

/** PNG or JPEG pixel size from the file header; null for anything else or a missing file. */
function imageSize(file: string): { width: number; height: number } | null {
  if (!existsSync(file)) return null;
  const b = readFileSync(file);
  if (b.length > 24 && b.toString("latin1", 1, 4) === "PNG") {
    return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
  }
  if (b.length > 4 && b[0] === 0xff && b[1] === 0xd8) {
    // Walk JPEG segments to the first SOF marker, which carries the size.
    let i = 2;
    while (i + 9 < b.length && b[i] === 0xff) {
      const marker = b[i + 1] as number;
      const len = b.readUInt16BE(i + 2);
      if (
        marker >= 0xc0 &&
        marker <= 0xcf &&
        marker !== 0xc4 &&
        marker !== 0xc8 &&
        marker !== 0xcc
      ) {
        return { height: b.readUInt16BE(i + 5), width: b.readUInt16BE(i + 7) };
      }
      i += 2 + len;
    }
  }
  return null;
}

/** `<meta name="theme-color">` — the same colour the manifest declares. */
function themeColorTag(): string {
  return `<meta name="theme-color" content="${defaultThemeBackground()}" />`;
}

/**
 * The full hreflang cluster for the CV pages.
 *
 * Generated rather than hand-written: every page must reference every
 * alternate *including itself*, plus x-default, and a single wrong entry
 * makes Google discard the whole cluster.
 */
function hreflangCluster(locales: Locale[]): string {
  if (locales.length < 2) return "";
  const links = locales.map(
    (l) => `<link rel="alternate" hreflang="${l}" href="${SITE_URL}${cvUrl(profile, l)}" />`,
  );
  links.push(
    `<link rel="alternate" hreflang="x-default" href="${SITE_URL}${cvUrl(profile, DEFAULT_LOCALE)}" />`,
  );
  return links.join("\n  ");
}

/** Head tags unique to one CV locale. */
function cvHead(locale: Locale): string {
  const name = profile.author[locale];
  // Not "name — role": role already contains an em dash of its own. The
  // tab title carries the host; the share card doesn't, since og:site_name
  // already says it and a card would show the host twice.
  const title = `${name} — CV — ${profile.terminal.hostname}`;
  const cardTitle = `${name} — CV`;
  // The CV's own description when it has one; the terminal's otherwise; none if neither.
  const description = profile.cv?.description?.[locale] ?? profile.seo.description?.[locale];
  // The card image: `cv.ogImage` when set, else the portrait. The alt and the
  // twitter card type follow the image — the portrait's alt and a square
  // `summary` for the portrait, the page title and a wide card for a banner.
  const ogImage = profile.cv?.ogImage ?? profile.cv?.photo ?? "";
  const isPortrait = ogImage !== "" && ogImage === profile.cv?.photo;
  const imageAlt = isPortrait
    ? photoAltFor(profile, locale, (k, v) => translate(locale, k, v))
    : cardTitle;

  const { enableSocialCards, enableJsonLd } = profile.seo;
  return [
    `<title>${escapeHtml(title)}</title>`,
    description ? `<meta name="description" content="${escapeHtml(description)}" />` : "",
    profile.seo.noindex ? `<meta name="robots" content="noindex" />` : "",
    themeColorTag(),
    `<link rel="canonical" href="${SITE_URL}${cvUrl(profile, locale)}" />`,
    hreflangCluster(cvLocales(profile)),
    ...(enableSocialCards
      ? socialCardTags({
          type: "profile",
          title: cardTitle,
          description,
          url: `${SITE_URL}${cvUrl(profile, locale)}`,
          image: ogImage,
          imageAlt,
          locale,
          alternates: cvLocales(profile),
          twitterCard: isWide(ogImage) ? "summary_large_image" : "summary",
        })
      : []),
    enableJsonLd
      ? `<script type="application/ld+json">${JSON.stringify(buildCvJsonLd(profile, locale, SITE_URL, lastModified()), null, 2)}</script>`
      : "",
  ]
    .filter(Boolean)
    .join("\n  ");
}

/** `/ru/cv.html` -> "ru", for the dev server. Null for the default page. */
function localeFromUrl(url: string | undefined): Locale | null {
  const path = (url ?? "").split("?")[0] ?? "";
  const match = /^\/([^/]+)\/cv\.html$/.exec(path);
  const locale = match?.[1] as Locale | undefined;
  return locale && cvLocales(profile).includes(locale) ? locale : null;
}

/**
 * Fails loudly, and early, when a locale is half-added.
 *
 * `npm run build` typechecks first, so this is really a guard for anyone
 * running `vite build` directly — without it a missing translation
 * surfaces as "Cannot read properties of undefined" from deep inside the
 * renderer, naming neither the locale nor the field.
 */
function assertLocaleReady(locale: Locale): void {
  // A skills/socials row tagged only for the CV, with no CV, can never
  // render: a half-removed résumé. Loud, like a missing translation.
  if (!profile.cv) {
    for (const [list, rows] of [
      ["skills", profile.skills],
      ["socials", profile.socials],
    ] as const) {
      rows.forEach((row, i) => {
        if (row.contexts?.length && row.contexts.every((c) => c === "cv")) {
          throw new Error(
            `profile.config.ts: ${list}[${i}] is tagged for the CV, but no cv is configured.`,
          );
        }
      });
    }
  }
  const required: Array<[string, unknown]> = [["author", profile.author[locale]]];
  if (profile.seo.role) required.push(["seo.role", profile.seo.role[locale]]);
  if (profile.seo.description) required.push(["seo.description", profile.seo.description[locale]]);
  if (profile.bio) required.push(["bio", profile.bio[locale]]);
  if (profile.cv?.description) required.push(["cv.description", profile.cv.description[locale]]);
  if (profile.commands?.game)
    required.push(["commands.game.title", profile.commands.game.title[locale]]);
  // Optional sections are only checked when the author supplied them.
  if (profile.terminal.footer.hint)
    required.push(["terminal.footer.hint", profile.terminal.footer.hint[locale]]);
  if (profile.cv?.tagline) required.push(["cv.tagline", profile.cv.tagline[locale]]);
  if (profile.cv?.about) required.push(["cv.about", profile.cv.about[locale]]);
  if (profile.cv?.metaLine) required.push(["cv.metaLine", profile.cv.metaLine[locale]]);
  if (profile.cv?.signOff) required.push(["cv.signOff", profile.cv.signOff[locale]]);

  for (const [field, value] of required) {
    if (typeof value !== "string" || value === "") {
      throw new Error(
        `profile.config.ts: ${field} has no "${locale}" translation. ` +
          `Every locale in MESSAGES needs one.`,
      );
    }
  }
  for (const job of profile.cv?.jobs ?? []) {
    if (!job.bullets[locale]?.length) {
      throw new Error(`profile.config.ts: cv job "${job.id}" has no "${locale}" bullets.`);
    }
  }
}

/** Fills a processed cv.html shell with one locale's content. */
function fillCv(html: string, locale: Locale): string {
  assertLocaleReady(locale);
  const back = profile.terminal.footer.backToTerminal
    ? `<a href="/">${escapeHtml(translate(locale, "cv.backToTerminal"))}</a>`
    : "";
  const footer = renderFooter(profile, locale, SITE_URL, back);

  return html
    .replace(/<html lang="[^"]*"/, `<html lang="${locale}"`)
    .replace("</head>", `  ${cvHead(locale)}\n</head>`)
    .replace("<!--CV_TOPBAR-->", renderCvTopbar(profile, locale))
    .replace(
      "<!--CV_TITLE-->",
      escapeHtml(`${profile.terminal.handle}@${profile.terminal.hostname} — open cv.html`),
    )
    .replace("<!--CV-->", renderCv(profile, locale))
    .replace("<!--CV_FOOTER-->", footer);
}

/* ---------------- discovery files ---------------- */

/**
 * When the content last changed, as YYYY-MM-DD.
 *
 * The last commit date, not the build date: a deploy that changes nothing
 * shouldn't claim every page is new. Falls back to today when git isn't
 * available (a tarball install, say) — mtimes are no use here, since a
 * fresh clone stamps every file with the clone time.
 */
function lastModified(): string {
  try {
    return execFileSync("git", ["log", "-1", "--format=%cs"], { encoding: "utf8" }).trim();
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
}

function sitemapXml(): string {
  const locales = cvLocales(profile);
  const lastmod = lastModified();
  const photo = profile.cv?.photo;

  const imageBlock = (locale: Locale): string => {
    if (!photo) return "";
    // Same description as the portrait's alt text — one string, one image.
    const title = photoAltFor(profile, locale, (k, v) => translate(locale, k, v));
    return (
      `\n    <image:image>` +
      `\n      <image:loc>${SITE_URL}${photo}</image:loc>` +
      `\n      <image:title>${escapeHtml(title)}</image:title>` +
      `\n    </image:image>`
    );
  };

  const entries: string[] = [
    `  <url>\n    <loc>${SITE_URL}/</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`,
    ...locales.map((locale) => {
      const alternates = locales
        .map(
          (l) =>
            `\n    <xhtml:link rel="alternate" hreflang="${l}" href="${SITE_URL}${cvUrl(profile, l)}"/>`,
        )
        .join("");
      return (
        `  <url>\n    <loc>${SITE_URL}${cvUrl(profile, locale)}</loc>` +
        `\n    <lastmod>${lastmod}</lastmod>` +
        alternates +
        imageBlock(locale) +
        `\n  </url>`
      );
    }),
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${entries.join("\n")}
</urlset>
`;
}

/**
 * Search and AI crawlers named explicitly, so their access doesn't depend on
 * how each one interprets the wildcard group. Grouped user-agents share the
 * one `Allow` that follows them.
 */
const NAMED_CRAWLERS = [
  "OAI-SearchBot",
  "ChatGPT-User",
  "GPTBot",
  "Claude-SearchBot",
  "Claude-User",
  "ClaudeBot",
  "PerplexityBot",
  "Perplexity-User",
  "Googlebot",
  "Google-Extended",
  "Bingbot",
  "Applebot",
  "YandexBot",
  "Amazonbot",
  "DuckDuckBot",
];

/**
 * The manifest's colours: the `--bg` of the theme a first-time visitor
 * sees, so the splash screen and status bar match the page rather than
 * defaulting to white. `defaultTheme: "random"` has no single answer and
 * falls back to green, the reference palette.
 *
 * Read with node:fs rather than a glob: this file is loaded by Node outside
 * Vite's transform pipeline, where `import.meta.glob` is not a function.
 */
function defaultThemeBackground(): string {
  const configured = profile.terminal.defaultTheme;
  const name = configured === "random" ? "green" : configured;
  const file = resolve(HERE, "src/themes", `${name}.css`);
  const css = existsSync(file) ? readFileSync(file, "utf8") : "";
  return /--bg:\s*([^;]+);/.exec(css)?.[1]?.trim() ?? "#050806";
}

/**
 * Generated rather than shipped in public/: a static manifest carries one
 * person's name and host, and nothing renders it where a fork would notice.
 */
function siteWebmanifest(): string {
  const background = defaultThemeBackground();
  return JSON.stringify(
    {
      name: profile.author[DEFAULT_LOCALE],
      short_name: profile.terminal.hostname,
      ...(profile.seo.description ? { description: profile.seo.description[DEFAULT_LOCALE] } : {}),
      start_url: "/",
      display: "standalone",
      icons: [
        { src: "/assets/icons/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
        { src: "/assets/icons/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
      ],
      theme_color: background,
      background_color: background,
    },
    null,
    2,
  );
}

function robotsTxt(): string {
  const named = NAMED_CRAWLERS.map((bot) => `User-agent: ${bot}`).join("\n");
  return [
    named,
    "Allow: /",
    "",
    "User-agent: *",
    // What the content may be used for, not merely whether it may be fetched.
    `Content-Signal: ${renderContentSignal(profile)}`,
    "Allow: /",
    "",
    // Only point at a sitemap that is actually emitted.
    ...(profile.seo.enableSitemap ? [`Sitemap: ${SITE_URL}/sitemap.xml`, ""] : []),
  ].join("\n");
}

/**
 * A short index for AI agents, following the llms.txt spec
 * (https://llmstxt.org): an H1 name, a blockquote summary, optional
 * free-form detail, then H2 sections whose list items are *markdown
 * links* — `[name](url)` with optional `: notes`. Plain "Label: url" text
 * doesn't conform, so every entry here is a real link.
 *
 * Anthropic and Perplexity retrieve it; Google does not. Cheap, and a CV's
 * readers are unusually likely to be agents.
 */
function llmsTxt(): string {
  const lang = DEFAULT_LOCALE;
  const locales = cvLocales(profile);

  const pages = [
    `- [Terminal portfolio](${SITE_URL}/): interactive terminal; the same facts are in its noscript fallback.`,
    ...locales.map(
      (l) =>
        `- [CV (${l})](${SITE_URL}${cvUrl(profile, l)}): full résumé as static HTML, no JavaScript required.`,
    ),
  ];

  const contacts = socialsFor(profile, "cv").map((s) => `- [${s.label}](${s.href}): ${s.display}`);

  // Key facts, one line each — only what the config actually states.
  const primary =
    mailtoFor(profile)?.replace(/^mailto:/, "") ?? socialsFor(profile, "cv")[0]?.display;
  const role = profile.seo.role?.[lang];
  const facts = [role ? `- Role: ${role}` : "", primary ? `- Contact: ${primary}` : ""].filter(
    Boolean,
  );

  // One section per shipped language, named in itself, pointing at that
  // language's CV — an agent reading in Russian finds the Russian résumé.
  const perLanguage = locales.flatMap((l) => [
    "",
    `## ${languageName(l)}`,
    "",
    `- [CV](${SITE_URL}${cvUrl(profile, l)})${profile.seo.role ? `: ${profile.seo.role[l]}` : ""}`,
  ]);

  // The H1 carries every spelling of the name the site ships, deduped —
  // an agent searching in Russian finds Никита on the first line. The
  // summary is the bio: who this is, in the owner's words. What the site
  // is comes after the key facts.
  const names = [...new Set(LOCALES.map((l) => profile.author[l]))].join(" / ");
  // The summary is the bio when there is one, else the description, else
  // the role — the spec wants a blockquote, and the name alone isn't one.
  const summary =
    profile.bio?.[lang].replace(/\s+/g, " ").trim() ??
    profile.seo.description?.[lang] ??
    role ??
    "";
  const description = profile.bio && profile.seo.description ? profile.seo.description[lang] : "";
  const lines = [
    `# ${names}`,
    "",
    ...(summary ? [`> ${summary}`, ""] : []),
    ...facts,
    ...(facts.length ? [""] : []),
    ...(description ? [description, ""] : []),
    "## Pages",
    "",
    ...pages,
    ...perLanguage,
  ];

  if (contacts.length > 0) {
    lines.push("", "## Contact", "", ...contacts);
  }

  lines.push("");
  return lines.join("\n");
}

/**
 * Every portrait the repo ships lives here — the author's and the example
 * personas'. Vite copies public/ verbatim, so without pruning a fork that
 * configured its own photo would still ship the other two faces.
 *
 * Only the file `cv.photo` names survives the build; with no photo
 * configured, none do. A photo configured *outside* this directory is left
 * alone and the directory is emptied. Nothing else under assets/img/ is
 * touched — the link-preview card always ships, and the 404 cat ships with
 * the 404 page (`pruneNotFound`, below).
 */
const PORTRAITS_DIR = "assets/img/portraits";

function prunePortraits(outDir: string): void {
  const dir = join(outDir, PORTRAITS_DIR);
  if (!existsSync(dir)) return;
  const photo = profile.cv?.photo;
  const keep = photo && dirname(photo) === `/${PORTRAITS_DIR}` ? basename(photo) : null;
  for (const name of readdirSync(dir)) {
    if (name !== keep) unlinkSync(join(dir, name));
  }
  if (readdirSync(dir).length === 0) rmSync(dir, { recursive: true });
}

/**
 * The 404 cat is referenced only by 404.html and its stylesheet, so with
 * `seo.enable404` off it would ship as an orphan. Same treatment as the
 * portraits: not built, not shipped.
 */
const NOT_FOUND_CAT = "assets/img/404-cat.png";

function pruneNotFound(outDir: string): void {
  if (profile.seo.enable404) return;
  const file = join(outDir, NOT_FOUND_CAT);
  if (existsSync(file)) unlinkSync(file);
}

function profileHtmlPlugin(): Plugin {
  const lang = DEFAULT_LOCALE;
  // Filled during transformIndexHtml, consumed in generateBundle to clone
  // the CV for every non-default locale.
  let cvTemplate: string | null = null;

  return {
    name: "profile-html",

    transformIndexHtml(html, ctx) {
      const withBootstrap = html.replace("</head>", `  ${themeBootstrap()}\n</head>`);

      if (ctx.filename.endsWith("cv.html")) {
        // Keep the shell (placeholders intact) so other locales can reuse
        // it with Vite's hashed asset tags already injected.
        cvTemplate = withBootstrap;
        // In dev the locale comes from the URL the middleware below asked
        // for — `path` when the call is ours, `originalUrl` when it came
        // through Vite's own HTML middleware. At build time there is no URL
        // at all, and this is the default page.
        const requested = localeFromUrl(ctx.originalUrl) ?? localeFromUrl(ctx.path);
        return fillCv(withBootstrap, requested ?? lang);
      }

      const isIndex = ctx.filename.endsWith("index.html");
      // Every page is titled `what — hostname`, the two pages about a person
      // `name — what — hostname`: the CV is "— CV —", the terminal is
      // "— terminal —" (ui.pageTitle, localized). The share card drops the
      // hostname: og:site_name already carries it.
      const what = isIndex ? translate(lang, "ui.pageTitle") : "404";
      const cardTitle = isIndex
        ? `${profile.author[lang]} — ${what}`
        : `${what} — ${profile.terminal.hostname}`;
      const title = isIndex ? `${cardTitle} — ${profile.terminal.hostname}` : cardTitle;
      // The 404 describes itself; the terminal's description is about the terminal.
      const description = isIndex
        ? profile.seo.description?.[lang]
        : translate(lang, "notFound.description");
      const ogImage = profile.seo.ogImage ?? "";

      const { enableSocialCards, enableJsonLd, enableNoscript } = profile.seo;
      const head = [
        `<title>${escapeHtml(title)}</title>`,
        description ? `<meta name="description" content="${escapeHtml(description)}" />` : "",
        profile.seo.noindex ? `<meta name="robots" content="noindex" />` : "",
        themeColorTag(),
        isIndex ? `<link rel="canonical" href="${SITE_URL}/" />` : "",
        ...(enableSocialCards
          ? socialCardTags({
              type: "website",
              title: cardTitle,
              description,
              url: `${SITE_URL}/`,
              image: ogImage,
              // The card is a screenshot of the terminal on both pages, so the
              // alt describes that — not the 404.
              imageAlt: `${profile.author[lang]} — ${translate(lang, "ui.pageTitle")}`,
              locale: lang,
              twitterCard: "summary_large_image",
            })
          : []),
        isIndex && enableJsonLd ? personJsonLd(lang) : "",
      ]
        .filter(Boolean)
        .join("\n  ");

      return stripDisabledChrome(withBootstrap, isIndex)
        .replace("</head>", `  ${head}\n</head>`)
        .replace("<!--NOSCRIPT-->", isIndex && enableNoscript ? noscriptHtml(lang) : "");
    },

    /**
     * Serve the non-default CV locales in dev.
     *
     * They only exist as files after `writeBundle`, so without this
     * `npm run dev` would 404 on /ru/cv.html and fall through to the
     * terminal — which is exactly what the language chip links to.
     */
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const locale = localeFromUrl(req.url);
        if (!locale || locale === DEFAULT_LOCALE) return next();

        void server
          .transformIndexHtml(req.url as string, readFileSync(page("cv.html"), "utf8"))
          .then((html) => {
            res.setHeader("Content-Type", "text/html; charset=utf-8");
            res.end(html);
          })
          .catch(next);
      });
    },

    generateBundle() {
      // Custom domain, so `base: "/"` is correct and 404.html's
      // root-absolute paths resolve at any URL depth.
      this.emitFile({
        type: "asset",
        fileName: "CNAME",
        source: `${new URL(SITE_URL).hostname}\n`,
      });
      // Pages would otherwise run Jekyll over dist/ and drop its dotfiles.
      this.emitFile({ type: "asset", fileName: ".nojekyll", source: "" });

      // Each discovery file is its own switch in `seo`; off means the file
      // is simply not emitted (and robots.txt stops pointing at the sitemap).
      const { enableSitemap, enableRobotsTxt, enableLlmsTxt } = profile.seo;
      if (enableSitemap)
        this.emitFile({ type: "asset", fileName: "sitemap.xml", source: sitemapXml() });
      if (enableRobotsTxt)
        this.emitFile({ type: "asset", fileName: "robots.txt", source: robotsTxt() });
      if (enableLlmsTxt) this.emitFile({ type: "asset", fileName: "llms.txt", source: llmsTxt() });
      this.emitFile({ type: "asset", fileName: "site.webmanifest", source: siteWebmanifest() });
    },

    /**
     * One CV page per configured locale.
     *
     * Vite needs its HTML inputs to exist on disk, so the locale list can't
     * drive rolldownOptions.input; instead the *processed* cv.html — the one
     * with Vite's hashed asset tags already injected — is cloned per
     * locale. That works because `base` is "/", so those asset URLs are
     * root-absolute and resolve just as well from /ru/.
     *
     * Written here rather than in generateBundle because Vite's own HTML
     * plugin populates the template during that same phase, and plugin
     * order would decide whether it exists yet.
     */
    writeBundle(options) {
      const outDir = options.dir ?? "dist";
      // Runs for every config, CV or not — public/ is already in outDir here.
      prunePortraits(outDir);
      pruneNotFound(outDir);

      if (!cvTemplate) return;
      for (const locale of cvLocales(profile)) {
        if (locale === DEFAULT_LOCALE) continue;
        const file = join(outDir, locale, "cv.html");
        mkdirSync(dirname(file), { recursive: true });
        writeFileSync(file, fillCv(cvTemplate, locale));
      }
    },
  };
}

export default defineConfig(({ command }) => {
  // Absolute URLs with no origin would ship a sitemap and canonicals that
  // point nowhere. Refuse to build rather than publish that.
  if (command === "build" && !SITE_URL) {
    throw new Error(
      "SITE_URL is not set. Put `SITE_URL=https://your.domain` in .env (see .env.example) " +
        "or export it in the shell — it is the origin for every absolute URL the build emits.",
    );
  }
  if (command === "build" && !/^https?:\/\/[^/]+$/.test(SITE_URL)) {
    throw new Error(
      `SITE_URL must be an origin with no path, e.g. https://your.domain — got "${SITE_URL}".`,
    );
  }
  return {
    root: PAGES,
    publicDir: "../public",
    base: "/",
    resolve: {
      // With `root` at pages/, a root-absolute `/src/main.ts` in a shell would
      // resolve to pages/src/. A relative `../src/main.ts` is right on disk
      // but wrong in the browser: `..` above `/` clamps, the request comes in
      // as /src/main.ts anyway, and the dev server answers with the SPA
      // fallback — index.html served as a module. This alias makes /src/ mean
      // the real src/ in both dev and build, so the shells can use the same
      // root-absolute paths they use for everything else.
      alias: { "/src": resolve(HERE, "src") },
    },
    define: {
      __SITE_URL__: JSON.stringify(SITE_URL),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
      __CV_BYTES__: JSON.stringify(profile.cv ? cvByteSize(profile, DEFAULT_LOCALE) : 0),
    },
    plugins: [profileHtmlPlugin()],
    build: {
      outDir: "../dist",
      emptyOutDir: true,
      rolldownOptions: {
        // The CV is opt-in: without a `cv` key in profile.config.ts the page
        // is never built, and the site is the terminal alone.
        input: {
          index: page("index.html"),
          // So is the 404 page, behind `seo.enable404`: no entry, no page,
          // and src/notfound.ts is never bundled.
          ...(profile.seo.enable404 ? { 404: page("404.html") } : {}),
          ...(profile.cv ? { cv: page("cv.html") } : {}),
        },
      },
    },
  };
});
