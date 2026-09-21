# CLAUDE.md

Guidance for Claude Code when working in this repository.

## What this is

A forkable interactive terminal portfolio: Vite + TypeScript, no UI framework.
`index.html` (the terminal), `404.html`, and an optional **statically
prerendered CV, one page per configured locale**. Everything a fork author
changes lives in `profile.config.ts`.

It was rebuilt from `nikita.sh`, where the whole terminal was a single
1,890-line inline `<script>` in `public/index.html` whose `runCommand()` was a
550-line `switch`. That repo is archived, and nikita.sh is now deployed from
this one (S3, `npm run deploy:s3`); this is a separate codebase, not a
migration of it.

## Commands

```bash
npm run dev            # dev server, HMR
npm run build          # tsc --noEmit, then vite build → dist/
npm run preview        # serve the built dist/
npm test               # vitest, all suites
npm run check          # config preflight only
npm run lint           # biome: lint + format + import order (lint:fix applies)
npm run og-card        # scripts/og-card.sh → public/assets/img/og-terminal.png (needs Chrome)
npm run deploy         # gh-pages
npm run deploy:s3      # scripts/deploy-s3.sh → S3-compatible bucket (see .env.example)
```

## Architecture

Four contracts in `src/core/types.ts` carry the design. Read them first.

- **`Command`** — `src/commands/*.ts`, auto-registered via `import.meta.glob`.
  `help`, Tab-completion and the chip bar all read the registry, so they cannot
  drift. The original had four hand-synced lists that already disagreed.
- **`CommandContext`** — the injected output/services API. Commands never touch
  the DOM and never close over module state.
- **`FsNode`** — `src/fs/`. Plain files are picked up with real byte sizes;
  `<filename>.ts` descriptors handle dynamic and executable files. `ctx.runFile`
  is shared by `./name`, `sudo ./name` and the `game` shortcut. **A descriptor
  can override its name** — `src/fs/game.sh.ts` is called whatever
  `commands.game.script` says, and is `enabled` only when one is configured; the
  `.bashrc` alias for it is appended from config by `.bashrc.ts`, not stored in
  the plain file.
- **`Mode`** — a sub-REPL that owns the input line (`top`, `ssh`).

`src/core/terminal.ts` owns state and dispatch; `src/core/input.ts` owns the
input row, keybindings, completion and chips.

### Things that bite

- **`print` takes HTML, `printText` escapes.** Nothing escapes for you in
  `print`. Choose deliberately at each call site.
- **Adding a command needs a matching i18n key** (`commands.<name>` in every
  locale) or `help` shows the raw key. `npm test` catches this.
- **Every catalogue is typed as `Messages` (= `typeof en`)**, so a missing
  translation is a *compile* error. The Vitest i18n suite covers what types
  can't see — placeholder parity and scripted-sequence lengths — and it walks
  **every file in `src/i18n/messages/`, not just the selected locales**, since
  an unselected catalogue is one import away from being live.
- **Adding a new plain file to `src/fs/` needs a dev-server restart.** Vite
  doesn't re-scan the `?raw` glob on its own. `.ts` files hot-reload fine.
- **Dotfiles in `src/fs/` are imported by name, not globbed.** Rolldown's
  `import.meta.glob` never matches a dotfile in a production build — not
  with `./.*`, not even named outright — while dev and Vitest do, which is
  how a deploy once shipped without `.bashrc`. `src/fs/index.ts` imports
  `.bashrc.ts` explicitly and the discovery suite asserts the bundle
  carries it. A new dotfile needs a line there, not a pattern.
- **Animations are skipped when the tab is hidden or reduced-motion is set**
  (`animationsEnabled()` in `src/core/html.ts`, and `ctx.sleep` is the paced
  variant). A hidden tab clamps timers to 1/second, then 1/minute — without
  this the terminal strands itself mid-line. **The boot doesn't start until
  the document is visible** (`untilVisible()`): Chrome prerenders a URL it
  expects you to open, and a prerendered page is hidden — so every sleep was
  skipped, the visitor's first sight was the finished intro, and the
  "booted" flag went into the prerender's throwaway sessionStorage copy,
  which is why the *next* visit booted. A background tab is the same. So an
  automated browser check in a hidden pane sees no boot at all until the
  pane is shown; a tab hidden mid-sequence still sees instant output.

## The CV

Prerendered at build time, one page per selected locale: `/cv.html`
for the default locale, `/<locale>/cv.html` for the rest.

**Why static, and why the mirrors are gone.** The predecessor rendered the CV
with client-side JS, so crawlers saw an empty div — which is why `nikita.sh`
grew parallel `llm/` mirror pages plus a `<noscript>` block, three renderings of
one résumé kept in sync by a template script. As of 2026 no major AI crawler
executes JavaScript (GPTBot, ClaudeBot, PerplexityBot read raw HTML; only
Googlebot renders), so prerendering makes the live page *be* the
crawler-readable page. The mirrors, the duplicate-content risk and the cloaking
concern went away together. **Do not reintroduce a mirror.**

- `src/cv/render.ts` is a **pure, DOM-free** function returning the body markup.
  It runs inside the Vite plugin at build time and is directly testable, which
  is how "the résumé is in the raw HTML" is asserted rather than assumed.
- **All CV content lives in `profile.config.ts` → `cv`**, bullets included. An
  earlier revision split prose into `content/cv.<locale>.md`; that was reverted
  deliberately. Keeping it in TypeScript means a missing translation is a
  compile error rather than a runtime test, and there is one file to edit.
  Don't reintroduce the markdown layer.
- **The CV is optional.** Without a `cv` key: no Vite entry, so no page; the
  `cv` command and the `cv.html` filesystem node opt out via their `enabled`
  flag; the topbar link, sitemap rows and llms.txt links all vanish. The CV test
  suites skip so a fork without a résumé still has a green run.
- **Every section of it is optional too** — every field on `CvConfig` is `?`,
  and the renderer guards each one, so an omitted or empty section produces no
  heading and no rule. Keep them optional: making one required would compile
  fine here and break a fork that hasn't filled it in. The "partial configs"
  suite in `tests/cv.test.ts` omits each section in turn.
- Note **skills come from `profile.skills`, not from `cv`** (filtered by
  `contexts`), so they still render under `cv: {}`.

### Page assembly, and its one subtlety

**The shells live in `pages/`, and that directory is Vite's `root`.** That is
what keeps them emitting to the top of `dist/` — a `root` at the repo with
inputs at `pages/*.html` would emit `dist/pages/index.html` and break both
GitHub Pages and the 404. Consequences worth knowing:

- `build.outDir` is `../dist` and `publicDir` is `../public`, both relative to
  `root`. `rolldownOptions.input` needs resolved absolute paths.
- **The shells load `/src/main.ts` via `resolve.alias`**, never `../src/`. The
  relative form is right on disk and wrong in the browser: `..` above `/`
  clamps, the request arrives as `/src/main.ts` anyway, and the dev server
  answers with the SPA fallback — `index.html` served as a module, HTTP 200.
  That 200 is why the breakage survived a status-code check; verify dev by
  reading the response body, not the code.
- Anything in the plugin that reads a shell off disk must use the `page()`
  helper. `readFileSync("cv.html")` worked only while cwd happened to be root,
  and it 500s the dev server on `/ru/cv.html` the moment that stops being true.

Vite requires HTML inputs to exist on disk, so the locale list can't drive
`rolldownOptions.input`. One real `cv.html` entry is processed normally, then
cloned per additional locale in **`writeBundle`** — not `generateBundle`, where
Vite's own HTML plugin is still populating the template and plugin order would
decide whether it exists yet. Cloning works only because `base` is `/`, making
Vite's asset URLs root-absolute and valid from `/ru/` too.

The dev server needs `configureServer` middleware to serve the non-default
locales; without it `npm run dev` 404s on `/ru/cv.html` and silently falls
through to the terminal — which is exactly what the language chip links to.

### Other things that bite

- **Headings carry real text**; the shell prompt is `aria-hidden` decoration.
  The predecessor's `<h2>` was entirely shell-speak (`guest@nikita.sh:~$ cat
  about.txt`), leaving no section names for crawlers or the document outline.
- **Esc and `q` navigate to `/`** (`src/core/leave.ts`, wired in
  `src/cv.ts`). The handler skips presses that are modified, auto-repeated,
  typed into a field, or already `defaultPrevented` — so any later consumer
  of those keys on the page (a lightbox, a menu) should `preventDefault()`
  and needs no knowledge of it. **It must `preventDefault()` itself**: Esc
  is Chrome's Stop accelerator, run after the page declines the key, and
  Stop cancels the navigation just started — without it the first press
  usually did nothing. **`q` is not decoration**: in fullscreen Chrome
  consumes Esc before the page sees it, and no page can change that.
- **The language chip is an `<a>`, not a button** — the other language is a
  different document. It also writes the locale to `localStorage` so the choice
  flows back to the terminal.
- **`@media print` redefines the palette tokens**, so every theme prints
  grayscale. The predecessor greyed out individual classes and would miss any
  token a newer theme introduced. A test asserts every token `green.css` defines
  is overridden.
- **Every page is titled `what — hostname`**, and the two pages about a
  person `name — what — hostname`: `— CV —` and `— terminal —`
  (`ui.pageTitle`, localized). The share card drops the hostname, since
  `og:site_name` carries it. `seo.role` is never in a title — it
  already carries an em dash — it goes to JSON-LD, the static summary and llms.txt;
  the visible line under the CV's `<h1>` is `cv.tagline`. There is no
  `seo.title`.
- **The portrait is served as uploaded unless `cv.photoStyle` opts in**
  — no filter, no tint, colour and all; only print greys it. `"tint"` is
  grayscale under the theme colour, pure CSS. `"pixel"` adds the canvas:
  `src/cv.ts` draws the `<img>` at 72×72, `src/cv/portrait.ts` posterizes it
  to six greys, CSS `image-rendering: pixelated` does the upscale. **The style
  is a prerendered class on the frame** (`style-tint` / `style-pixel`, from
  `src/cv/render.ts`), and the tint overlay and grayscale filter key on
  those — so tint needs no JS, and pixel degrades to tint without it rather
  than to colour. It's in the browser rather than the build so any photo a
  fork drops in gets the look with zero setup and zero dependencies. The pipeline is a pure function over
  an RGBA buffer because happy-dom has no 2D context — that's the part with
  tests; the canvas glue is verified by screenshot. The `<img>` is never
  removed or inline-styled: screen/print visibility hangs off the frame's
  `is-pixelated` class, and **print puts the source photo back**. A photo on
  another origin taints the canvas; the guard leaves the `<img>` alone.
  The opt-in is checked in `cv.ts` before anything is drawn.

## Locales

**`MESSAGES` in `profile.config.ts` is the locale set.** `Locale` is
`keyof typeof MESSAGES` and `LOCALES` is `Object.keys(MESSAGES)`, so choosing
languages is a config edit and there is no second list anywhere to drift from
it. `terminal.locales` used to be that second list; it's gone.

- **`src/i18n/locales.ts` imports from `profile.config.ts`, not the reverse.**
  That looks backwards until you check `src/core/profile.ts`: its only import is
  `import type`, erased at build, so the cycle is types-only and never exists at
  runtime. Keep it that way — giving `core/profile.ts` a value import from the
  i18n tree would close a real cycle.
- **`src/i18n/messages/` holds every catalogue the repo ships** — thirteen:
  `en ru uk es pt fr it de pl tr zh ja ko` — selected or not. `pt` is
  Brazilian Portuguese and `zh` Simplified Chinese; plain two-letter codes on
  purpose, since `pt-BR`-style keys would need quoting in every `Localized`
  config field. `zh`/`ja`/`ko` render in the system font (JetBrains Mono has
  no CJK). Every catalogue is translated from `en.ts`, never from another
  translation. This site selects two; a test asserts the
  unselected ones' text is absent from `dist/`. `tsc` still checks them
  (tsconfig includes `src`), and the i18n suite walks every file on disk rather
  than only the selected locales, since types can't see array lengths,
  `{placeholders}`, or inline markup — the suite compares `<span class="…">`
  tags and entities leaf for leaf against `en`, and insists `lang.set` names
  the language in itself, because those are what an LLM-translated file gets
  wrong.
- **Two example configs**, one per locale count: `profile.config.example.ts`
  (English) and `profile.config.multilingual.example.ts` (en/es/de). They stay
  at the repo root deliberately: a `cp` onto `profile.config.ts` has to work
  untouched, and a relative import is only correct at one depth. Neither is
  in tsconfig's `include` and neither can be — `Localized` resolves against the
  *live* config's locales, so a trilingual example can't typecheck beside a
  bilingual profile. `tests/config.test.ts` imports them at runtime instead and
  walks their locale maps, which is the substitute for the typecheck.
- **`en.ts` is the schema** — `Messages = typeof en` — and is imported for its
  type even by a fork that doesn't ship English. Type-only, so it costs no bytes.
- **No `import.meta.glob` in the registry.** `vite.config.ts` imports
  `src/i18n` at module top level, so Node loads it outside Vite's transform
  pipeline; a glob there throws `.glob is not a function`. The explicit import
  map in the config is what makes it Node-loadable *and* tree-shakeable.
- Dropping a language surfaces every config field still carrying its prose, one
  compile error each — the same guarantee as adding one, running backwards.
  That's intended: it stops dead translations lingering in the config.

## Theming

Every theme is one complete CSS file in `src/themes/`, auto-registered. There is
**no `THEME_MAP`** — the matrix-rain colours are `--matrix-color` /
`--matrix-fade` custom properties read via `getComputedStyle`. (Canvas can't
read CSS variables; `getComputedStyle` can. The predecessor kept a JS map
purely because of that confusion.)

- Adding a theme = one CSS file with the full token list. `npm test` fails if a
  token is missing — nothing falls back to another theme.
- Palettes sourced from real hardware or published specs often fail WCAG AA.
  Check `--fg`/`--fg-dim` against `--bg` before shipping; `commodore`'s literal
  reference was 2.26:1 and needed adjusting.
- **The `.crt` flicker is calibrated against near-black backgrounds.** Any
  theme whose `--bg` isn't near-black must disable it (`animation:none`), or the
  `multiply` blend's periodic dip reads as a flash every ~6s. Five of the seven
  themes need this.
- **`secret.css` is the one secret theme**, unlocked by `claude "add light
  theme"` on the second ask. Its CSS and storage id is `secret`; the name
  visitors see is `commands.system.secretTheme` (the shipped config says
  `sabbatical`). `src/core/theme.ts` maps between the two — `themeId()` /
  `themeNames()` — and nothing else may see the id. Omit the field and the
  theme isn't offered at all; the egg stays at won't-fix.

## Build and deploy

`base` is fixed at `/` and the build emits `CNAME` from the host of `SITE_URL`
(and an empty `.nojekyll`, so Pages serves `dist/` as-is).
**GitHub Pages therefore needs a custom domain or a user/org root site** — a
project site at `/repo-name/` would break. This is deliberate: `404.html` is
served at arbitrary URL depths, so relative asset paths resolve against the
wrong directory. Changing this means changing `base` and the 404 page together.

`vite.config.ts` injects `<title>`, meta, OG tags, JSON-LD and the **static
summary** from `profile.config.ts`. The summary (`staticSummaryHtml()`: the
`<h1>`, meta line, CV link, bio, skills, contact) is a real `<section>` in
the page, not `<noscript>` — Google drops `<noscript>` and the AI crawlers
never run scripts, so it's what all of them read, and it's the no-JS page:
the inline head script sets `html.js`, and without that class the boot
overlay and terminal chrome are `display: none` while the summary shows
inside the window. With JS, **CSS folds it** (`html.js .static-summary`
shares the `.sr-only` rule) — from the first paint, since the class comes
from the inline head script. Doing it from `main.ts` instead painted the
summary above the terminal and then collapsed it: a CLS of 1.0 on
PageSpeed. The `<h1>` inside it (`#pageHeading`) follows the visitor's
language, the rest stays in the default one. The last three are switches in `seo` (`enableSocialCards`,
`enableJsonLd`, `enableStaticSummary`); off means the tags are absent, not
stubbed — the summary off still leaves an `sr-only` `<h1>` — and
`tests/discovery.test.ts` asserts every page both ways. `seo.ogImage` is inert with social cards off. **The 404 page is a
switch too** (`seo.enable404`): off drops the `404` rollup input, so neither
the page nor `src/notfound.ts` is built, and `writeBundle` prunes the 404 cat
the way it prunes portraits — the host then serves its own error page.

**Structured data is derived, never hand-kept** (`src/core/jsonld.ts`). The
terminal page is a `@graph` of `WebSite` (`inLanguage` = the selected
locales) and `Person#owner`; each CV page is a `ProfilePage` whose
`mainEntity` is the same Person plus what only the CV knows. Which config
feeds what: `profile.skills[].value` → `knowsAbout` (split on commas);
`cv.languages` → `knowsLanguage`; `cv.education` → `alumniOf`; `cv.certs` →
`hasCredential`; `cv.jobs` → `hasOccupation` (titles) *and* `affiliation`
(employers, deduped) — not `hiringOrganization`, which belongs to
`JobPosting` and the validator flags on an `Occupation`. There is no
`address` (location was dropped from config) and no `seeks`: nothing in the
config states availability, so nothing may claim it. Both shapes validate
clean at validator.schema.org; keep it that way when adding a property.

`dateModified` on the `WebSite` and each `ProfilePage` is the last commit
date (`lastModified()`, also the sitemap's `lastmod`); `email` is a bare
address, not a `mailto:` URL. Share cards carry `og:image:width/height`
(read from the PNG/JPEG header at build, `imageSize()`) and an alt on both
`og:` and `twitter:` — the portrait alt on the CV, `author — terminal` on
the terminal and 404, since the card image is the terminal either way.
The CV's image is `cv.ogImage ?? cv.photo`; the alt is the portrait's only
when the image *is* the portrait, and `twitter:card` follows the shape
(`isWide()`: ≥ 3:2 → `summary_large_image`), so a banner and a square
portrait both get the right card.

**Descriptions are per page kind**: `seo.description` is the terminal's,
`cv.description` (optional, falls back) the CV's, `notFound.description` in
the catalogue the 404's. Share-card tags come from one `socialCardTags()` so
the three pages can't drift; `theme-color` is the manifest's colour.

**Two deploy paths, both kept.** `npm run deploy` is GitHub Pages
(`gh-pages` branch, needs the `CNAME` the build emits). `npm run deploy:s3` is
`scripts/deploy-s3.sh` — not a bare `aws s3 sync`, because sync guesses
content types and never adds a charset (llms.txt in Cyrillic rendered garbled
on the old site): every object's type comes from the script's table, one sync
pass per extension, an unknown extension fails the deploy, hashed assets get
immutable cache headers, a `--delete --size-only` pass removes stale keys, and `S3_KEEP` patterns (search-engine verification files that
live in the bucket, not the repo) are excluded from every pass. Nikita's own
site is the S3 one; the Pages path exists for forks.

**`?card[&theme=<name>]` on the terminal page is the link-preview layout**
(`body.card` in `terminal.css`, read in `src/main.ts`): chrome hidden, the
window filling the viewport, boot skipped, the theme from the query. The
window uses `overflow: clip`, not `hidden` — hidden is still a scroll
container and focusing the prompt scrolls the title bar out of the shot.
`scripts/og-card.sh` opens it in headless Chrome at 750×394 × 1.6 for an
exact 1200×630.

`public/` is copied verbatim into `dist/` — with one exception.
**`public/assets/img/portraits/` is pruned in `writeBundle`**: it holds every
persona's portrait (the author's and both examples'), and only the file
`cv.photo` names survives the build. Nothing else under `public/` is
touched. `dist/` is gitignored.

`sitemap.xml`, `robots.txt` and `llms.txt` are generated from the same page list
that produces the pages, so they cannot reference a page that was not built —
a test asserts exactly that. Each is behind its own `seo.enable*` switch: off
means not emitted, and `robots.txt` drops its `Sitemap:` line when the sitemap
is off. The discovery suites in `tests/discovery.test.ts` skip per switch —
and gate their file *reads* too, since `describe.skip` still evaluates the body.

## Conventions

- **Biome is the linter and formatter** (`biome.json`: 2 spaces, double
  quotes, 100 columns, recommended rules, imports organised). `npm run lint`
  gates CI and both deploys; `npm run lint:fix` applies. Three rules are
  off on purpose — `useLiteralKeys` (index-signature access stays
  bracketed), `noImportantStyles` and `noDescendingSpecificity` (the print
  CSS relies on both) — and tests may use `!` and `any`. A deliberate
  duplicate (the `vh`/`dvh` pair) carries a `biome-ignore` with its reason.
  `.githooks/` (git-native, `core.hooksPath` set by `prepare`) runs it on
  staged files at commit and typecheck + tests at push; `--no-verify`
  skips. Dependabot files a monthly grouped PR for the devDependencies and
  the actions.
- **Relative imports carry their `.ts` extension** (`from "./html.ts"`,
  `from "../i18n/index.ts"` — never a bare directory). Vite 8 warns that its
  next config loader is Node's own TS stripping, which resolves nothing
  else; `allowImportingTsExtensions` in tsconfig makes `tsc` accept it. A
  new file without the extension is what the warning on `npm run dev`
  means.
- The language toggle is load-bearing: any new visible text needs every
  enabled locale. Command *logic* lives in `src/commands/`; command *copy*
  lives in `src/i18n/messages/`; personal *data* lives in `profile.config.ts`.
- **The footer is one function, `renderFooter()` in `src/core/profile.ts`**,
  called by the terminal, the 404 and the CV build with each page's own
  localised tail. Its knobs are `terminal.footer` (`copyright`, `hint`,
  `backToTerminal`, `bottomText`). Two config fields are raw HTML on purpose
  and say so: `neofetch.ascii` and `terminal.footer.bottomText` (not
  localised — one credit line for every language; defaults to `CREDIT_LINE`,
  and `""` is the off switch, since omitting it now means the default). Everything else is plain
  text escaped by the renderer.
- **Defaults live in `defineProfile()` and nowhere else.** It takes
  `ProfileInput` (what the author writes; only `author` is required) and
  returns `ProfileConfig` (what the code reads; defaulted fields are
  required there, so readers never guard them). `MESSAGES` is its first
  argument so `defaultLocale` can default to the first catalogue without
  importing `src/i18n/locales.ts` — that import would close the runtime
  cycle. `hostname` is an enumerable getter over `SITE_URL`, read lazily
  because `vite.config.ts` imports the config before computing `SITE_URL`
  (it publishes `process.env.SITE_URL` right after). Features that can be
  absent — `neofetch`, `bio`, `skills`, `socials`, `commands`, `cv`,
  `seo.role`, `seo.description` — stay optional and are gated with
  `enabled` on their command/file and guards in the renderers; the table in
  docs/architecture.md says what each omission does.
- `profile.config.ts` ships with real personal data, so `npm run check` guards
  the rebrand. **`SITE_URL` is the one deployment fact that lives outside the
  config** — in `.env`, the shell, or CI's `vars.SITE_URL`, shell winning.
  `vite.config.ts` reads `.env` itself with `loadEnv` (Vite only exposes
  `VITE_`-prefixed vars to the app, and this file runs in Node), and
  `vitest.config.ts` does the same so a local `dist/` and the discovery suite
  agree on the origin. A build with no `SITE_URL` is refused outright; the
  tests tolerate its absence because CI runs them with no environment.
- Prefer reusing a real command over duplicating its rendering — the boot intro
  calls the `neofetch` command, and `alias` reads `.bashrc` from the filesystem
  rather than keeping a second copy of the list.
