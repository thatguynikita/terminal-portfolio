# Architecture

[← docs index](README.md)

Vite + TypeScript, no UI framework, no runtime dependencies. Four contracts in
`src/core/types.ts` carry the design.

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

## The four contracts

- **`Command`** — `src/commands/*.ts`, auto-registered via `import.meta.glob`.
  `help`, Tab-completion and the chip bar all read the registry, so they cannot
  drift. See [adding a command](commands.md).
- **`CommandContext`** — the injected output and services API. Commands never
  touch the DOM and never close over module state, which is what makes them
  testable without a browser.
- **`FsNode`** — `src/fs/`. Plain files are picked up with real byte sizes;
  `<filename>.ts` descriptors handle dynamic and executable files. See
  [the fake filesystem](filesystem.md).
- **`Mode`** — a sub-REPL that owns the input line (`top`, `ssh`).

`src/core/terminal.ts` owns state and dispatch; `src/core/input.ts` owns the
input row, keybindings, completion and chips.

## Why auto-registration

The site this was rebuilt from was a single 1,890-line inline `<script>` whose
`runCommand()` was a 550-line `switch`, with four hand-maintained lists of
commands that had already fallen out of sync with each other.

Everything that could be a list now reads from one registry instead: `help`,
completion, the chip bar, `alias` (which reads `.bashrc` from the fake
filesystem rather than keeping a second copy), and the boot intro (which calls
the real `neofetch` command).

## pages/ is Vite's root

That's what keeps the shells emitting to the top of `dist/` rather than
`dist/pages/`, because output paths are derived relative to `root`.

Consequences worth knowing:

- `build.outDir` is `../dist` and `publicDir` is `../public`, both relative to
  `root`; `rollupOptions.input` needs resolved absolute paths.
- The shells load `/src/main.ts` through a `resolve.alias` that maps `/src` to
  the real `src/`. A relative `../src/main.ts` is correct on disk but wrong in
  the browser — `..` above `/` clamps, so the request arrives as `/src/main.ts`
  regardless, and without the alias the dev server answers with the SPA
  fallback: `index.html` served as a module. The build never showed it, since
  Vite rewrites the tag to a hashed `/assets/…` URL.
- Anything in the Vite plugin that reads a shell off disk must resolve it
  explicitly. A cwd-relative `readFileSync("cv.html")` worked only while cwd
  happened to equal the root.

The two example configs stay at the repo root next to `profile.config.ts`, since
a `cp` onto it has to work with no edits — and a relative import is only correct
at one depth.

## Page assembly

Vite requires HTML inputs to exist on disk, so the locale list can't drive
`rollupOptions.input`. One real `cv.html` entry is processed normally, then
cloned per additional locale in `writeBundle` — not `generateBundle`, where
Vite's own HTML plugin is still populating the template and plugin order would
decide whether it exists yet.

Cloning works only because `base` is `/`, making Vite's asset URLs root-absolute
and valid from `/ru/` too.

The dev server needs `configureServer` middleware to serve the non-default
locales; without it `npm run dev` 404s on `/ru/cv.html` and silently falls
through to the terminal — which is exactly what the language chip links to.

## Testing

262 tests across ten suites, run with Vitest and happy-dom. The ones worth
knowing about:

- **`config.test.ts`** is `npm run check`, the preflight a fork runs before
  deploying. It's the guard against publishing with someone else's name still in
  place.
- **`discovery.test.ts`** asserts against the real `dist/`, because the claim
  being tested is about what a crawler fetches — not what a function returns. It
  skips when `dist/` is absent so a clean checkout still has a green run.
- **`i18n.test.ts`** walks every catalogue on disk, not just the selected ones,
  covering what types can't see: placeholder parity and sequence lengths.

---

**See also:** [commands](commands.md) · [theming](theming.md) · [languages](i18n.md) · [deployment](deploy.md)
