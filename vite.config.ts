import { defineConfig, loadEnv, type Plugin } from "vite";
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, unlinkSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));

/**
 * Where the page shells live. This is Vite's `root`, so the HTML files sit
 * together in one directory instead of scattered across the repo root — and
 * because it's the root, they still emit to the top of `dist/`.
 */
const PAGES = resolve(HERE, "pages");
const page = (name: string): string => resolve(PAGES, name);
import profile from "./profile.config";
import { mailtoFor, renderContentSignal, renderFooter, skillsFor, socialsFor } from "./src/core/profile";
import type { Locale } from "./src/i18n/locales";
import { StorageKey } from "./src/core/storage";
import { cvByteSize, renderCv, renderCvTopbar } from "./src/cv/render";
import { buildCvJsonLd } from "./src/cv/jsonld";
import { cvLocales, cvUrl } from "./src/cv/url";
import { translate } from "./src/i18n";

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
  process.env["SITE_URL"] ?? loadEnv("production", process.cwd(), "")["SITE_URL"] ?? ""
).replace(/\/$/, "");
const DEFAULT_LOCALE = profile.terminal.defaultLocale;

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
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
  if (!profile.terminal.bootScreen) out = out.replace(/[ \t]*<div id="boot"[^>]*>[^<]*<\/div>\n?/, "");
  if (!profile.terminal.chips) out = out.replace(/[ \t]*<div class="chips" id="chips"><\/div>\n?/, "");
  return out;
}

/**
 * Static fallback for crawlers and no-JS clients on the terminal page.
 * The CV needs no equivalent — its content is the page.
 */
function noscriptHtml(lang: Locale): string {
  const rows = (pairs: Array<[string, string]>): string =>
    `<table>${pairs.map(([k, v]) => `<tr><th>${k}</th><td>${v}</td></tr>`).join("")}</table>`;

  return `<noscript>
  <p>${escapeHtml(profile.identity.role[lang])}</p>
  <p>${escapeHtml(profile.seo.location[lang])}</p>
  <h2>About</h2>
  <p>${escapeHtml(profile.bio[lang].replace(/\s+/g, " ").trim())}</p>
  <h2>Skills</h2>
  ${rows(skillsFor(profile, "terminal").map((s) => [escapeHtml(s.key[lang]), escapeHtml(s.value)]))}
  <h2>Contact</h2>
  ${rows(
    socialsFor(profile, "terminal").map((s) => [
      escapeHtml(s.label),
      `<a href="${escapeHtml(s.href)}" rel="me noopener noreferrer">${escapeHtml(s.display)}</a>`,
    ])
  )}
</noscript>`;
}

function personJsonLd(lang: Locale): string {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.identity.name[lang],
    jobTitle: profile.identity.role[lang],
    ...(mailtoFor(profile) ? { email: mailtoFor(profile) } : {}),
    url: SITE_URL,
    sameAs: profile.socials.filter((s) => s.href.startsWith("http")).map((s) => s.href),
  };
  return `<script type="application/ld+json">${JSON.stringify(data, null, 2)}</script>`;
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
    (l) => `<link rel="alternate" hreflang="${l}" href="${SITE_URL}${cvUrl(profile, l)}" />`
  );
  links.push(
    `<link rel="alternate" hreflang="x-default" href="${SITE_URL}${cvUrl(profile, DEFAULT_LOCALE)}" />`
  );
  return links.join("\n  ");
}

/** Head tags unique to one CV locale. */
function cvHead(locale: Locale): string {
  const name = profile.identity.name[locale];
  // Not "name — role": role already contains an em dash of its own.
  const title = `${name} — CV — ${profile.terminal.hostname}`;
  const description = profile.seo.description[locale];
  const ogImage = profile.cv?.photo ? `${SITE_URL}${profile.cv?.photo}` : "";

  const { enableSocialCards, enableJsonLd } = profile.seo;
  return [
    `<title>${escapeHtml(title)}</title>`,
    `<meta name="description" content="${escapeHtml(description)}" />`,
    profile.seo.noindex ? `<meta name="robots" content="noindex" />` : "",
    `<link rel="canonical" href="${SITE_URL}${cvUrl(profile, locale)}" />`,
    hreflangCluster(cvLocales(profile)),
    ...(enableSocialCards
      ? [
          `<meta property="og:type" content="profile" />`,
          `<meta property="og:title" content="${escapeHtml(title)}" />`,
          `<meta property="og:description" content="${escapeHtml(description)}" />`,
          `<meta property="og:url" content="${SITE_URL}${cvUrl(profile, locale)}" />`,
          ogImage ? `<meta property="og:image" content="${escapeHtml(ogImage)}" />` : "",
          `<meta name="twitter:card" content="summary" />`,
        ]
      : []),
    enableJsonLd
      ? `<script type="application/ld+json">${JSON.stringify(buildCvJsonLd(profile, locale, SITE_URL), null, 2)}</script>`
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
  const required: Array<[string, unknown]> = [
    ["identity.name", profile.identity.name[locale]],
    ["identity.role", profile.identity.role[locale]],
    ["seo.location", profile.seo.location[locale]],
    ["seo.description", profile.seo.description[locale]],
  ];
  // Optional sections are only checked when the author supplied them.
  if (profile.terminal.footer.hint) required.push(["terminal.footer.hint", profile.terminal.footer.hint[locale]]);
  if (profile.cv?.tagline) required.push(["cv.tagline", profile.cv.tagline[locale]]);
  if (profile.cv?.about) required.push(["cv.about", profile.cv.about[locale]]);
  if (profile.cv?.metaLine) required.push(["cv.metaLine", profile.cv.metaLine[locale]]);
  if (profile.cv?.signOff) required.push(["cv.signOff", profile.cv.signOff[locale]]);

  for (const [field, value] of required) {
    if (typeof value !== "string" || value === "") {
      throw new Error(
        `profile.config.ts: ${field} has no "${locale}" translation. ` +
          `Every locale in MESSAGES needs one.`
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
      escapeHtml(`${profile.terminal.handle}@${profile.terminal.hostname} — open cv.html`)
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
    const title = translate(locale, "cv.photoAlt", {
      name: profile.identity.name[locale],
      role: profile.identity.role[locale],
    });
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
            `\n    <xhtml:link rel="alternate" hreflang="${l}" href="${SITE_URL}${cvUrl(profile, l)}"/>`
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
 * Generated rather than shipped in public/, which had the author's name
 * and host baked in — a fork would have inherited them silently, since
 * nothing renders the manifest where you'd notice.
 */
/**
 * The manifest's colours, taken from the palette a first-time visitor sees.
 *
 * These were hardcoded `#ffffff`, which put a white splash screen and a white
 * status bar in front of a site that is near-black in every theme but the
 * secret one. Reading `--bg` keeps them right for a fork that ships a
 * different default.
 *
 * `defaultTheme: "random"` has no single answer, so it falls back to green —
 * the reference palette every other theme is validated against.
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

function siteWebmanifest(): string {
  const background = defaultThemeBackground();
  return JSON.stringify(
    {
      name: profile.identity.name[DEFAULT_LOCALE],
      short_name: profile.terminal.hostname,
      description: profile.seo.description[DEFAULT_LOCALE],
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
    2
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
        `- [CV (${l})](${SITE_URL}${cvUrl(profile, l)}): full résumé as static HTML, no JavaScript required.`
    ),
  ];

  const contacts = socialsFor(profile, "cv").map(
    (s) => `- [${s.label}](${s.href}): ${s.display}`
  );

  const lines = [
    `# ${profile.identity.name[lang]}`,
    "",
    `> ${profile.identity.role[lang]}`,
    "",
    profile.bio[lang].replace(/\s+/g, " ").trim(),
    "",
    "## Pages",
    "",
    ...pages,
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
 * touched — the 404 cat and the link-preview card always ship.
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
        const title = isIndex
          ? `${profile.identity.name[lang]} — ${profile.identity.role[lang]}`
          : `404 — ${profile.terminal.hostname}`;
        const description = profile.seo.description[lang];
        const ogImage = profile.seo.ogImage ? `${SITE_URL}${profile.seo.ogImage}` : "";

        const { enableSocialCards, enableJsonLd, enableNoscript } = profile.seo;
        const head = [
          `<title>${escapeHtml(title)}</title>`,
          `<meta name="description" content="${escapeHtml(description)}" />`,
          profile.seo.noindex ? `<meta name="robots" content="noindex" />` : "",
          isIndex ? `<link rel="canonical" href="${SITE_URL}/" />` : "",
          ...(enableSocialCards
            ? [
                `<meta property="og:type" content="website" />`,
                `<meta property="og:title" content="${escapeHtml(title)}" />`,
                `<meta property="og:description" content="${escapeHtml(description)}" />`,
                `<meta property="og:url" content="${SITE_URL}/" />`,
                ogImage ? `<meta property="og:image" content="${escapeHtml(ogImage)}" />` : "",
                `<meta name="twitter:card" content="summary_large_image" />`,
              ]
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
        this.emitFile({ type: "asset", fileName: "CNAME", source: `${new URL(SITE_URL).hostname}\n` });

        // Each discovery file is its own switch in `seo`; off means the file
        // is simply not emitted (and robots.txt stops pointing at the sitemap).
        const { enableSitemap, enableRobotsTxt, enableLlmsTxt } = profile.seo;
        if (enableSitemap) this.emitFile({ type: "asset", fileName: "sitemap.xml", source: sitemapXml() });
        if (enableRobotsTxt) this.emitFile({ type: "asset", fileName: "robots.txt", source: robotsTxt() });
        if (enableLlmsTxt) this.emitFile({ type: "asset", fileName: "llms.txt", source: llmsTxt() });
        this.emitFile({ type: "asset", fileName: "site.webmanifest", source: siteWebmanifest() });
      },

      /**
       * One CV page per configured locale.
       *
       * Vite needs its HTML inputs to exist on disk, so the locale list can't
       * drive rollupOptions.input; instead the *processed* cv.html — the one
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
          "or export it in the shell — it is the origin for every absolute URL the build emits."
      );
    }
    if (command === "build" && !/^https?:\/\/[^/]+$/.test(SITE_URL)) {
      throw new Error(`SITE_URL must be an origin with no path, e.g. https://your.domain — got "${SITE_URL}".`);
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
      __CV_BYTES__: JSON.stringify(
        profile.cv ? cvByteSize(profile, DEFAULT_LOCALE) : 0
      ),
    },
    plugins: [profileHtmlPlugin()],
    build: {
      outDir: "../dist",
      emptyOutDir: true,
      rollupOptions: {
        // The CV is opt-in: without a `cv` key in profile.config.ts the page
        // is never built, and the site is the terminal alone.
        input: {
          index: page("index.html"),
          404: page("404.html"),
          ...(profile.cv ? { cv: page("cv.html") } : {}),
        },
      },
    },
  };
});
