import { defineConfig, type Plugin } from "vite";
import profile from "./profile.config";
import type { Locale } from "./src/i18n/locales";

const SITE_URL = (process.env["SITE_URL"] ?? `https://${profile.identity.domain}`).replace(/\/$/, "");

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/**
 * Static fallback for crawlers and no-JS clients. The terminal renders
 * nothing without JavaScript, so this carries the same facts in plain
 * markup. Always the default locale, as the page's own toggle is JS-only.
 */
function noscriptHtml(lang: Locale): string {
  const rows = (pairs: Array<[string, string]>): string =>
    `<table>${pairs.map(([k, v]) => `<tr><th>${k}</th><td>${v}</td></tr>`).join("")}</table>`;

  return `<noscript>
  <p>${escapeHtml(profile.identity.tagline[lang])}</p>
  <p>${escapeHtml(profile.identity.location[lang])}</p>
  <h2>About</h2>
  <p>${escapeHtml(profile.bio[lang].replace(/\s+/g, " ").trim())}</p>
  <h2>Skills</h2>
  ${rows(profile.skills.map((s) => [escapeHtml(s.key[lang]), escapeHtml(s.value)]))}
  <h2>Contact</h2>
  ${rows(
    profile.socials.map((s) => [
      escapeHtml(s.label),
      `<a href="${escapeHtml(s.href)}" rel="me noopener noreferrer">${escapeHtml(s.display)}</a>`,
    ])
  )}
</noscript>`;
}

function jsonLd(lang: Locale): string {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.identity.name[lang],
    jobTitle: profile.identity.role[lang],
    email: `mailto:${profile.identity.email}`,
    url: SITE_URL,
    sameAs: profile.socials.filter((s) => s.href.startsWith("http")).map((s) => s.href),
  };
  return `<script type="application/ld+json">${JSON.stringify(data, null, 2)}</script>`;
}

/** Injects head metadata and the noscript fallback from profile.config.ts. */
function profileHtmlPlugin(): Plugin {
  const lang = profile.terminal.defaultLocale;

  return {
    name: "profile-html",

    transformIndexHtml(html, ctx) {
      const isIndex = ctx.filename.endsWith("index.html");
      const title = isIndex
        ? profile.seo.title[lang]
        : `404 — ${profile.terminal.hostname}`;
      const description = profile.seo.description[lang];
      const ogImage = profile.seo.ogImage ? `${SITE_URL}${profile.seo.ogImage}` : "";

      const head = [
        `<title>${escapeHtml(title)}</title>`,
        `<meta name="description" content="${escapeHtml(description)}" />`,
        `<meta property="og:type" content="website" />`,
        `<meta property="og:title" content="${escapeHtml(title)}" />`,
        `<meta property="og:description" content="${escapeHtml(description)}" />`,
        `<meta property="og:url" content="${SITE_URL}/" />`,
        ogImage ? `<meta property="og:image" content="${escapeHtml(ogImage)}" />` : "",
        `<meta name="twitter:card" content="summary_large_image" />`,
        isIndex ? jsonLd(lang) : "",
      ]
        .filter(Boolean)
        .join("\n  ");

      return html
        .replace("</head>", `  ${head}\n</head>`)
        .replace("<!--NOSCRIPT-->", isIndex ? noscriptHtml(lang) : "");
    },

    /**
     * GitHub Pages serves a project site under /repo-name/, which would
     * break the root-absolute paths the 404 page needs. A CNAME keeps the
     * site at a domain root, where `base: "/"` is correct.
     */
    generateBundle() {
      this.emitFile({ type: "asset", fileName: "CNAME", source: `${profile.identity.domain}\n` });
    },
  };
}

export default defineConfig({
  base: "/",
  plugins: [profileHtmlPlugin()],
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        index: "index.html",
        404: "404.html",
      },
    },
  },
});
