# CLAUDE.md

Guidance for Claude Code when working in this repository.

## What this is

A forkable interactive terminal portfolio: Vite + TypeScript, no UI framework.
`index.html` (the terminal), `404.html`, and an optional **statically
prerendered CV, one page per configured locale**. Everything a fork author
changes lives in `profile.config.ts`.

It was rebuilt from `nikita.sh`, where the whole terminal was a single
1,890-line inline `<script>` in `public/index.html` whose `runCommand()` was a
550-line `switch`. That repo is untouched and still live; this is a separate
codebase, not a migration of it.

## Commands

```bash
npm run dev            # dev server, HMR
npm run build          # tsc --noEmit, then vite build → dist/
npm run preview        # serve the built dist/
npm test               # vitest, all suites
npm run check          # config preflight only
npm run deploy         # gh-pages
npm run deploy:s3      # aws s3 sync (AWS or Yandex; see .env.example)
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
  is shared by `./name`, `sudo ./name` and the `game` shortcut.
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
- **Dotfiles need their own glob patterns** (`./.*`, `!./.*.ts`) — `*` does not
  match a leading dot. That's how `.bashrc` is picked up.
- **Animations are skipped when the tab is hidden or reduced-motion is set**
  (`animationsEnabled()` in `src/core/html.ts`, and `ctx.sleep` is the paced
  variant). A hidden tab clamps timers to 1/second, then 1/minute — without
  this the terminal strands itself mid-line. This also means an automated
  browser check in a hidden pane will see instant output, not animation.

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
  `root`. `rollupOptions.input` needs resolved absolute paths.
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
`rollupOptions.input`. One real `cv.html` entry is processed normally, then
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
- **The language chip is an `<a>`, not a button** — the other language is a
  different document. It also writes the locale to `localStorage` so the choice
  flows back to the terminal.
- **`@media print` redefines the palette tokens**, so every theme prints
  grayscale. The predecessor greyed out individual classes and would miss any
  token a newer theme introduced. A test asserts every token `green.css` defines
  is overridden.
- **`identity.role` already contains an em dash**, so the page title is
  `name — CV — hostname`, not `name — role`.
- **The portrait is served as uploaded unless `identity.photoStyle` opts in**
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
- **`src/i18n/messages/` holds every catalogue the repo ships** — `en`, `ru`,
  `es`, `de` — selected or not. This site selects two; a test asserts the
  unselected ones' text is absent from `dist/`. `tsc` still checks them
  (tsconfig includes `src`), and the i18n suite walks every file on disk rather
  than only the selected locales, since types can't see array lengths or
  `{placeholders}`.
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
- `sabbatical` is a secret theme, hidden from completions until unlocked by
  `claude "add light theme"` (twice). Declared in `src/themes/index.ts`.

## Build and deploy

`base` is fixed at `/` and the build emits `CNAME` from `identity.domain`.
**GitHub Pages therefore needs a custom domain or a user/org root site** — a
project site at `/repo-name/` would break. This is deliberate: `404.html` is
served at arbitrary URL depths, so relative asset paths resolve against the
wrong directory. Changing this means changing `base` and the 404 page together.

`vite.config.ts` injects `<title>`, meta, OG tags, JSON-LD and the `<noscript>`
fallback from `profile.config.ts`. The noscript block matters: the terminal
renders nothing without JavaScript.

`public/` is copied verbatim into `dist/` — with one exception.
**`public/assets/img/portraits/` is pruned in `writeBundle`**: it holds every
persona's portrait (the author's and both examples'), and only the file
`identity.photo` names survives the build. Nothing else under `public/` is
touched. `dist/` is gitignored.

`sitemap.xml`, `robots.txt` and `llms.txt` are generated from the same page list
that produces the pages, so they cannot reference a page that was not built —
a test asserts exactly that.

## Conventions

- The language toggle is load-bearing: any new visible text needs every
  enabled locale. Command *logic* lives in `src/commands/`; command *copy*
  lives in `src/i18n/messages/`; personal *data* lives in `profile.config.ts`.
- `profile.config.ts` ships with real personal data, so `npm run check` guards
  the rebrand: it fails when `SITE_URL` and `identity.domain` disagree.
- Prefer reusing a real command over duplicating its rendering — the boot intro
  calls the `neofetch` command, and `alias` reads `.bashrc` from the filesystem
  rather than keeping a second copy of the list.
