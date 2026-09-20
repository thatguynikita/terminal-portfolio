# Architecture

[← docs index](README.md)

Vite + TypeScript, no UI framework, no runtime dependencies. If you only
want to change what the site says, `profile.config.ts` is all of it and you
can skip this page.

## Layout

```
profile.config.ts       everything about you, including the whole CV
pages/                  the three page shells (Vite's root)
src/core/               the engine: registry, output, input, modes, theme
src/commands/           one file per command
src/cv/                 the CV renderer
src/fs/                 the fake filesystem
src/i18n/               the locale set and one catalogue per language
src/themes/             one CSS file per theme
src/styles/             shared chrome and per-page layout
public/                 copied into dist/ as is
```

## How the pieces fit

Four types in `src/core/types.ts` describe everything else:

- **`Command`** — a file in `src/commands/`. It registers itself; `help`,
  Tab-completion and the chip bar all read the same list, so they can't
  disagree. → [adding a command](commands.md)
- **`CommandContext`** — what a command is allowed to touch: printing,
  translations, the filesystem, the theme. Commands never reach into the
  page directly, which is what makes them testable without a browser.
- **`FsNode`** — an entry in the fake filesystem: a plain file dropped into
  `src/fs/`, or a `<name>.ts` descriptor for one that's dynamic or runs.
  → [the fake filesystem](filesystem.md)
- **`Mode`** — a command that takes over the input line, like `top` or `ssh`.

`src/core/terminal.ts` holds the state and runs commands; `src/core/input.ts`
owns the input row, keybindings, completion and chips. Nothing keeps a
second list of anything: `alias` reads `.bashrc` from the filesystem, the
boot intro runs the real `neofetch`.

## Pages

The three HTML shells live in `pages/`, which is Vite's root — that's what
puts them at the top of `dist/`. `vite.config.ts` fills their `<head>` from
the config (title, description, share cards, JSON-LD, the no-JS fallback)
and generates `sitemap.xml`, `robots.txt`, `llms.txt` and the manifest from
the same page list, so none of them can name a page that doesn't exist.

The CV is built once and copied per language into `/<locale>/cv.html`;
the dev server serves those copies through a small middleware.

## The config

`defineProfile(MESSAGES, { … })` in `src/core/profile.ts` takes what you
wrote and fills in every default. Only `author` is required; what each
omitted field does is in [configuration](configuration.md).

## Scripts

| | |
|---|---|
| `npm run dev` | dev server with HMR |
| `npm run build` | typecheck, then build to `dist/` |
| `npm run preview` | serve the built `dist/` |
| `npm test` / `npm run test:watch` | the full suite, once or in watch mode |
| `npm run check` | config preflight only |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` / `npm run lint:fix` | Biome — lint, formatting and import order |
| `npm run og-card` | screenshot the link-preview card from the built site (needs Chrome) |
| `npm run deploy` | lint, test, build, publish to GitHub Pages |
| `npm run deploy:s3` | lint, test, build, sync to an S3-compatible bucket |
| `npm run deploy:s3:dry-run` | build, then print the upload/delete plan without touching the bucket |

## Tests

Vitest with happy-dom, twelve suites. Three worth knowing:

- **`config.test.ts`** is `npm run check` — the guard against publishing
  with someone else's name in place.
- **`discovery.test.ts`** reads the built `dist/`, because what a crawler
  fetches is the thing being tested. It skips when there is no build.
- **`i18n.test.ts`** checks every catalogue on disk, selected or not:
  placeholders, sequence lengths, inline markup.

---

**See also:** [commands](commands.md) · [theming](theming.md) · [languages](i18n.md) · [deployment](deploy.md)
