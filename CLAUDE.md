# CLAUDE.md

Guidance for Claude Code when working in this repository.

## What this is

A forkable interactive terminal portfolio: Vite + TypeScript, no UI framework.
Two pages — `index.html` (the terminal) and `404.html`. Everything a fork
author changes lives in `profile.config.ts`.

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
- **`ru.ts` is typed as `typeof en`**, so a missing translation is a *compile*
  error. The Vitest i18n suite covers what types can't see: placeholder parity
  and scripted-sequence lengths.
- **Adding a new plain file to `src/fs/` needs a dev-server restart.** Vite
  doesn't re-scan the `?raw` glob on its own. `.ts` files hot-reload fine.
- **Dotfiles need their own glob patterns** (`./.*`, `!./.*.ts`) — `*` does not
  match a leading dot. That's how `.bashrc` is picked up.
- **Animations are skipped when the tab is hidden or reduced-motion is set**
  (`animationsEnabled()` in `src/core/html.ts`, and `ctx.sleep` is the paced
  variant). A hidden tab clamps timers to 1/second, then 1/minute — without
  this the terminal strands itself mid-line. This also means an automated
  browser check in a hidden pane will see instant output, not animation.

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

`public/` is copied verbatim into `dist/`. `dist/` is gitignored.

## Conventions

- The bilingual toggle is load-bearing: any new visible text needs every
  enabled locale. Command *logic* lives in `src/commands/`; command *copy*
  lives in `src/i18n/`; personal *data* lives in `profile.config.ts`.
- `profile.config.ts` ships with real personal data, so `npm run check` guards
  the rebrand: it fails when `SITE_URL` and `identity.domain` disagree.
- Prefer reusing a real command over duplicating its rendering — the boot intro
  calls the `neofetch` command, and `alias` reads `.bashrc` from the filesystem
  rather than keeping a second copy of the list.
