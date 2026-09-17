# The CV

[← docs index](README.md)

`npm run build` generates a **static CV page per configured locale** —
`/cv.html` for `terminal.defaultLocale`, `/<locale>/cv.html` for the rest. The
résumé is in the initial HTML, so it needs no JavaScript to read.

That matters: as of 2026 no major AI crawler executes
JavaScript. GPTBot, ClaudeBot and PerplexityBot fetch raw HTML and move on, and
only Googlebot renders. A client-rendered CV is invisible to most of them.

## Configuration

Everything lives in `profile.config.ts` under `cv`:

```ts
cv: {
  metaLine: { en: "Saint Petersburg · hybrid, full day", ru: "…" },
  about:    { en: "DevOps/SRE with eleven years…", ru: "…" },
  jobs: [
    {
      id: "vk",
      dates: { en: "Nov 2022 – Sep 2025", ru: "Ноя 2022 – Сен 2025" },
      span:  { en: "2y 11m", ru: "2 г. 11 мес." },
      org:   { name: "VK", url: "https://vk.company",   // url optional
               location: { en: "Saint Petersburg", ru: "Санкт-Петербург" } },
      title: { en: "Site Reliability Engineer", ru: "Инженер по надёжности (SRE)" },
      tech:  "OpenStack, Kubernetes, …",               // not translated
      bullets: { en: ["Built and ran CorpCloud…"], ru: ["Построил CorpCloud…"] },
    },
  ],
  education: { university: { … }, place: { … }, year: 2012, field: { … } },
  certs:     [{ year: "2026", name: "Certified DevOps Engineer" }],
  languages: [{ name: { … }, filled: 8, sub: { … } }],  // filled: 0–10 meter
  traits:    { en: ["insatiable curiosity"], ru: ["неутолимое любопытство"] },
  signOff:   { en: "thanks for reading this far.", ru: "…" },   // rendered as $ echo "…"
},
```

The skills table isn't part of `cv` — it comes from the top-level `skills` list,
filtered by `contexts`. No `contexts` means everywhere; `["cv"]` keeps a row off
the terminal. `socials` works the same way.

TypeScript enforces that every field exists in every configured locale, so a
half-translated CV won't build.

## Everything is optional

**Delete the `cv` key** and the pages, the `cv` command, the `cv.html` filesystem
entry, the topbar link and the sitemap rows all disappear — the site is the
terminal alone.

**Omit any individual section** — `about`, `jobs`, `education`, `certs`,
`languages`, `traits`, `metaLine`, `signOff` — and it simply isn't rendered: no
empty heading, no stray horizontal rule. An empty array counts as omitted.
`cv: {}` is valid and gives you the header plus whatever skills are marked for
the CV.

## Languages and discovery

Adding a language adds a CV page, an hreflang entry, a sitemap row and an
`llms.txt` link with no other edit. Each page self-canonicalises and carries the
full hreflang cluster including `x-default`.

The cluster is generated rather than hand-written, since one malformed entry
makes Google discard all of it.

`sitemap.xml`, `robots.txt` and `llms.txt` are emitted from the same page list
that produces the pages, so they can't list a page that doesn't exist. Each is
optional — `seo.enableSitemap`, `seo.enableRobotsTxt`, `seo.enableLlmsTxt`.

`llms.txt` opens with the name in every shipped spelling, the bio as the
summary, a short key-facts list (role and primary contact — only facts the
config states, so no "core stack" or "years of experience" line unless one day
a field holds it) and the site description —
then the page list, one section per shipped language linking that language's
CV, and the contacts.

The CV pages' structured data is a `ProfilePage` whose Person carries what the
résumé does: education, certifications, job titles, employers, languages,
skills. All of it is derived from the same `cv` fields the page renders, so it
can't contradict what a visitor reads. Set `cv.description` to give the CV its
own meta/share-card description; without it the terminal's is reused.

## Getting back

Esc or `q` returns to the terminal — the same `/` the topbar link points at,
`q` being what quits a pager like `less`. Nothing fires while a field is
being typed in. `q` exists because in fullscreen Chrome takes Esc for itself
before the page sees it.

## Printing

Grayscale under every theme (see [theming](theming.md#printing)). Long jobs
flow across page breaks while individual bullets and rows stay whole, and link
targets print inline so a paper copy is still usable.

## Why there are no `llm/` mirrors

A client-rendered CV is invisible to crawlers, and the usual fix — a parallel
crawler-only copy of the page — is duplicate content that has to be kept in
sync and reads as cloaking. Prerendering makes the live page *be* the
crawler-readable page. **Don't reintroduce a mirror.**

---

**See also:** [languages](i18n.md) · [images to replace](assets.md) · [deployment](deploy.md)
