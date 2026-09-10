# terminal-portfolio

An interactive terminal portfolio you can fork for your own name, domain and CV.
Vite + TypeScript, no UI framework.

**Adding a command is one file.** Drop `src/commands/whatever.ts` in and it
registers itself — `help`, Tab-completion and the touch chip bar all read the
same registry, so they can't drift apart.

```
npm install
npm run dev          # http://localhost:5173
```

---

## Make it yours

Edit **`profile.config.ts`**. That's the whole customisation surface: name,
bio, skills, socials, the neofetch card, ssh personas, hostname, locales,
default theme, SEO.

Then:

```bash
npm run check        # fails if the config is inconsistent or incomplete
```

Two filled-in examples ship alongside it, both fictional and both on `.example`
domains. Copy either over `profile.config.ts` to start from something complete
rather than editing real data:

| File | Persona | Languages |
|---|---|---|
| `profile.config.example.ts` | data engineer | English |
| `profile.config.multilingual.example.ts` | robotics firmware engineer | English, Spanish, German |

```bash
cp profile.config.multilingual.example.ts profile.config.ts
```

The only structural difference between them is how many catalogues `MESSAGES`
imports. The trilingual one builds `/cv.html`, `/es/cv.html` and `/de/cv.html`
with a matching hreflang cluster, and its language chip cycles all three.

`npm run check` is the preflight for a fork. It verifies every user-visible
field is translated into every enabled locale, that referenced assets exist,
that `SITE_URL` agrees with `identity.domain`, and that social links are real
URLs. **This config ships with the original author's real data**, so run it
after rebranding.

---

## Adding a command

```ts
// src/commands/coffee.ts
import { defineCommand } from "../core/types";

export default defineCommand({
  name: "coffee",
  usage: "<size>",          // optional; shown in `help`
  order: 95,                // optional; where it sits in `help`
  complete: () => ["small", "large"],
  run(ctx, args) {
    ctx.print(`brewing a <span class="accent">${ctx.escape(args.positional[0] ?? "small")}</span>`);
  },
});
```

Then add its help text to each locale in `src/i18n/`:

```ts
commands: { coffee: "make a coffee", ... }
```

That's it — no registration, no list to update. `npm test` fails if you forget
the help text in any enabled locale.

### The output API

Commands never touch the DOM. Everything goes through `ctx`:

| Call | Does |
|---|---|
| `ctx.print(html, cls?)` | one line of **HTML** |
| `ctx.printText(text, cls?)` | one line of **escaped text** |
| `ctx.printLines(lines, cls?)` | several lines |
| `ctx.type(text, {speed})` | typewriter effect (plain text only) |
| `ctx.sequence(steps)` | scripted animation — `{text, delay?, typed?, cls?}` |
| `ctx.table(header, rows)` | a table; pass `null` for no header |
| `ctx.kv(pairs)` | two-column key/value table |
| `ctx.clear()`, `ctx.sleep(ms)`, `ctx.escape()`, `ctx.escapeAttr()` | |

Also on `ctx`: `lang`, `profile`, `t(key, vars)`, `tList(key)`, `fs`, `theme`,
`history`, `runFile()`, `enterMode()`, `setLang()`, `navigate()`, `state`.

`print` takes HTML and `printText` escapes — pick deliberately. Nothing escapes
for you in `print`.

`args` is `{ name, raw, positional, flags, normalized }`. `flags` holds both
`-lah` characters and `--long-name` words; `name` is the name actually typed,
so an alias can behave differently (that's how `ll` becomes `ls -l`).

### Sub-shells

A command can take over the input line — see `src/commands/top.ts` (a
live-refreshing view) and `src/commands/ssh.ts` (a Q&A mini-shell). Implement
`Mode` and call `ctx.enterMode(...)`.

---

## Adding a file to the fake filesystem

Drop any file into `src/fs/`. It shows up in `ls` with its **real byte size**
and `cat` prints it. No configuration.

```
src/fs/projects.txt     →  ls, cat projects.txt
```

For a file that's dynamic (rendered from your config, translated) or
executable, add a `<filename>.ts` descriptor beside it:

```ts
// src/fs/deploy.sh.ts
import { defineFile } from "./define";

export default defineFile({
  requiresSudo: true,                       // ./deploy.sh is denied; sudo works
  exec: (ctx) => ctx.print("deploying..."),
});
```

A descriptor can accompany a plain file of the same name and layer on top of it
— `.bashrc` supplies the text, `.bashrc.ts` dims its comments.

A file that isn't text returns `null` from `read` and can add a `hint` telling
the reader how to open it instead:

```ts
read: () => null,
hint: (ctx) => ctx.t("cv.catHint"),   // cat: cv.html: not a text file — use `cv`
```

> Adding a *new* plain file while `npm run dev` is running needs a dev-server
> restart; Vite doesn't re-scan the raw glob on its own. `.ts` files hot-reload
> fine.

---

## Adding a theme

One CSS file in `src/themes/`. It joins the theme list, `theme`'s completions
and the random first-visit pool automatically.

```css
/* src/themes/ocean.css */
:root[data-theme="ocean"] {
  --bg: #04121c;
  --fg: #7fdbff;
  /* ...every token green.css defines — nothing falls back... */
  --matrix-color: #7fdbff;
  --matrix-fade: rgba(4,18,28,.08);
}
```

`npm test` fails if a theme is missing any token. Themes whose background
isn't near-black should also disable the CRT flicker (see `solarized.css`) —
the `multiply` blend's periodic dip reads as a flash otherwise.

## Choosing languages

The site ships the catalogues `MESSAGES` imports, at the top of
`profile.config.ts` — that map is the whole locale setup, and no source file
keeps a second copy of the list:

```ts
import en from "./src/i18n/messages/en";
import ru from "./src/i18n/messages/ru";

export const MESSAGES = { en, ru };   // English-only? delete the ru line.
```

The first entry is where the language toggle starts; `terminal.defaultLocale`
picks which one is served unprefixed. With one locale configured the toggle and
the `lang` command disappear, and `/cv.html` has no `/<locale>/` sibling.

**Dropping a language takes its translations out of the build.**
`src/i18n/messages/` ships English, Russian, Spanish and German; this site
selects two, so the other two sit in the repo and never reach `dist/`. That
matters because each catalogue is roughly a fifth of the JavaScript a visitor
downloads.

**Adding one** is a new file in `src/i18n/messages/` typed as `Messages`, plus
its import and entry here. TypeScript then names every `profile.config.ts` field
that still needs translating, one error per field, so a half-translated site
can't ship — and the same happens in reverse when you remove a language and
leave its prose behind. `npm test` covers what types can't see: placeholder
parity and scripted-sequence lengths, across every catalogue on disk rather than
only the selected ones.

---

## The CV

`npm run build` generates a **static CV page per configured locale** —
`/cv.html` for `terminal.defaultLocale`, `/<locale>/cv.html` for the rest.
The résumé is in the initial HTML, so it needs no JavaScript to read.

That matters more than it used to: as of 2026 no major AI crawler executes
JavaScript. GPTBot, ClaudeBot and PerplexityBot fetch raw HTML and move on, and
only Googlebot renders. A client-rendered CV is invisible to most of them.

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
  signOff:   { en: `$ echo "thanks for reading this far."`, ru: "…" },
},
```

The skills table isn't part of `cv` — it comes from the top-level `skills` list,
filtered by `contexts`. No `contexts` means everywhere; `["cv"]` keeps a row off
the terminal. `socials` works the same way.

TypeScript enforces that every field exists in every configured locale, so a
half-translated CV won't build.

**The CV is optional, and so is every section of it.** Delete the `cv` key and
the pages, the `cv` command, the `cv.html` filesystem entry, the topbar link and
the sitemap rows all disappear — the site is the terminal alone, exactly as
before.

Omit any individual section — `about`, `jobs`, `education`, `certs`,
`languages`, `traits`, `metaLine`, `signOff` — and it simply isn't rendered: no
empty heading, no stray horizontal rule. An empty array counts as omitted. `cv: {}`
is valid and gives you the header plus whatever skills are marked for the CV.

Adding a language adds a CV page, an hreflang entry, a sitemap row and an
`llms.txt` link with no other edit. Each page self-canonicalises and carries the
full hreflang cluster including `x-default`; the cluster is generated rather
than hand-written, since one malformed entry makes Google discard all of it.

**Printing** is grayscale under every theme: `@media print` redefines the palette
tokens and strips shadows and glows wholesale. Long jobs flow across page breaks
while individual bullets and rows stay whole, and link targets print inline.

The build also emits `sitemap.xml`, `robots.txt` and `llms.txt` from the same
page list, so they can't list a page that doesn't exist.

## Deploying

The build is a plain static `dist/` — any host works.

```bash
npm run deploy       # GitHub Pages
npm run deploy:s3    # AWS S3 or Yandex Object Storage; see .env.example
```

Both run the test suite first, then typecheck and build. The config
preflight is part of that, so a fork can't publish with the original
author's name and domain still in place.

To deploy past a failing test, skip the wrapper:

```bash
npm run build && npx gh-pages -d dist --dotfiles
```

### GitHub Pages

`npm run deploy` builds, then pushes `dist/` to a `gh-pages` branch. Your
working tree and `main` are untouched; the branch is replaced wholesale each
time. Set it up once:

1. Make the repo public (Pages needs it on the free plan).
2. **Settings → Pages → Deploy from a branch → `gh-pages` / `(root)`**.
3. Add a DNS `CNAME` for your subdomain pointing at `<user>.github.io`.
4. **Settings → Pages → Custom domain** — your domain from
   `identity.domain`.

Step 3 is not optional. `base` is fixed at `/`, so a project site served at
`<user>.github.io/<repo>/` loads with every asset 404ing. You need a custom
domain, or a `<user>.github.io` root site — otherwise set `base` in
`vite.config.ts` to `"/<repo>/"`.

That constraint is deliberate: `404.html` is served at arbitrary URL depths,
so its asset paths must be root-absolute. Relative paths would resolve
against whatever directory the broken URL happened to be in.

The build emits a `CNAME` file from `identity.domain` so your custom domain
survives each deploy — replacing the branch would otherwise clear it. HTTPS
takes a few minutes to provision the first time.

To preview the publish without pushing:

```bash
npm run build && npx gh-pages -d dist --dotfiles -n
```

`gh-pages` keeps a clone under `node_modules/.cache`. If a run is
interrupted, or you dry-run before the remote branch exists, the next one
fails with `a branch named 'gh-pages' already exists` — clear it with
`npx gh-pages-clean`.

### S3 (AWS or Yandex Object Storage)

One command covers both — they differ only by `--endpoint-url`, which is
blank for AWS. Needs `aws-cli` installed and `.env` filled in from
`.env.example`. Point the bucket's static-website error document at
`404.html`.

---

## Scripts

| | |
|---|---|
| `npm run dev` | dev server with HMR |
| `npm run build` | typecheck, then build to `dist/` |
| `npm run preview` | serve the built `dist/` |
| `npm test` | full suite |
| `npm run check` | config preflight only |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run deploy` | test, build, publish to GitHub Pages |
| `npm run deploy:s3` | test, build, sync to an S3-compatible bucket |

## Layout

```
profile.config.ts       everything about you, including the whole CV
pages/                  the three page shells — Vite's root
src/core/               engine: registry, output API, input loop, modes, theme
src/commands/           one file per command — auto-registered
src/cv/                 CV renderer, URLs, JSON-LD
src/fs/                 the fake filesystem
src/i18n/locales.ts     the locale set, derived from MESSAGES
src/i18n/messages/      one file per language — en, ru, es, de
src/themes/             one CSS file per theme — auto-registered
src/styles/             shared chrome and per-page layout
public/                 copied verbatim into dist/
```

`pages/` is Vite's `root`, which is why the shells still land at the top of
`dist/` rather than under `dist/pages/`. Their `<script>` tags point at
`../src/…` for the same reason — relative to the shell, not the repo. The two
example configs stay at the repo root next to `profile.config.ts`, since a `cp`
onto it has to work with no edits and a relative import is only right at one
depth.

## Licence

MIT.
