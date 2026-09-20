# The CV

[← docs index](README.md)

The build writes a static CV page per language — `/cv.html` for the default
language, `/<locale>/cv.html` for the rest. It's plain HTML, so it reads
without JavaScript, which is how AI crawlers read it: none of the major ones
run scripts.

## Configuration

It all lives in `profile.config.ts` under `cv`. Every field is optional;
leave one out and its section isn't there.

```ts
cv: {
  tagline:   { en: "DevOps / SRE · 11y experience", ru: "…" },   // under your name
  description: { en: "…" },                                      // meta/share-card text; falls back to seo.description
  photo:     "/assets/img/portraits/you.png",
  photoStyle: "pixel",                                            // or "tint", or leave it out
  metaLine:  { en: "Saint Petersburg · hybrid, full day", ru: "…" },
  about:     { en: "DevOps/SRE with eleven years…", ru: "…" },
  jobs: [
    {
      id: "vk",
      dates: { en: "Nov 2022 – Sep 2025", ru: "Ноя 2022 – Сен 2025" },
      span:  { en: "2y 11m", ru: "2 г. 11 мес." },
      org:   { name: "VK", url: "https://vk.company", location: { en: "Saint Petersburg", ru: "…" } },
      title: { en: "Site Reliability Engineer", ru: "…" },
      tech:  "OpenStack, Kubernetes, …",                          // not translated
      bullets: { en: ["Built and ran CorpCloud…"], ru: ["…"] },
    },
  ],
  education: { university: { … }, place: { … }, year: 2012, field: { … } },
  certs:     [{ year: "2026", name: "Certified DevOps Engineer" }],
  languages: [{ name: { … }, filled: 8, sub: { … } }],           // filled: 0–10 meter
  traits:    { en: ["insatiable curiosity"], ru: ["…"] },
  signOff:   { en: "thanks for reading this far.", ru: "…" },    // rendered as $ echo "…"
},
```

The skills table and the contact links come from the top-level `skills`
and `socials` lists. Mark a row `contexts: ["cv"]` to keep it off the
terminal, or `["terminal"]` to keep it off the CV.

Delete the whole `cv` key and the pages, the `cv` command, the `cv.html`
file and the topbar link all go away.

## Languages

Every language in `MESSAGES` gets its own CV page, with the hreflang links,
sitemap row and `llms.txt` entry filled in — nothing to add by hand. The
language chip on the page switches between them.

## Printing

Grayscale under every theme, jobs flow across pages but bullets stay whole,
link targets print inline. → [theming](theming.md#printing)

---

**See also:** [languages](i18n.md) · [images to replace](assets.md) · [configuration](configuration.md)
