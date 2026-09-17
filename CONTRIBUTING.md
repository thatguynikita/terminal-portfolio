# Contributing

Issues and pull requests are welcome — a new command, theme or language, a
fix, a doc that was wrong. This page is the short version of what a PR needs;
the [docs](docs/README.md) cover the how.

## Setup

```bash
git clone https://github.com/thatguynikita/terminal-portfolio.git
cd terminal-portfolio
npm install        # also installs the git hooks (lefthook)
npm run dev        # http://localhost:5173
```

Node ≥ 22.12. No `SITE_URL` is needed for dev or tests; only `npm run build`
insists on one (see [deployment](docs/deploy.md)).

## The gate

```bash
npm run lint       # Biome: lint, formatting, import order — `lint:fix` applies
npm run typecheck  # tsc, strict
npm test           # the full suite
```

CI runs all three plus a build on every PR, and the git hooks run them for
you first: **pre-commit** checks the staged files with Biome, **pre-push**
typechecks and runs the tests. Skip a hook once with `LEFTHOOK=0 git commit`;
please don't push what the hook rejected.

## Conventions

- **One command per file** in `src/commands/`. It registers itself; nothing
  else needs editing. → [adding a command](docs/commands.md)
- **Logic, copy and data live apart.** Command *logic* in `src/commands/`,
  command *copy* in `src/i18n/messages/`, personal *data* only in
  `profile.config.ts`. A PR that puts a name or a URL in `src/` is wrong.
- **Any new visible string needs every catalogue** — all thirteen in
  `src/i18n/messages/`, not just the two this site ships. `en.ts` is the
  schema; `tsc` fails on a missing key and `npm test` on a placeholder or
  markup mismatch. Translate from `en.ts`, never from another translation.
  → [languages](docs/i18n.md)
- **A theme is one CSS file** with every token `green.css` defines; nothing
  falls back. Check `--fg` and `--fg-dim` against `--bg` for WCAG AA before
  opening the PR — several published palettes don't pass — and disable the
  CRT flicker if `--bg` isn't near-black. → [theming](docs/theming.md)
- **Relative imports carry `.ts`** (`from "./html.ts"`, `../i18n/index.ts`).
- **Comments say what the code does**, not what it used to do.
- **The two example configs are tested, not typechecked** — they can't be,
  since `Localized` resolves against the live config's locales. If you add a
  config field, add it to both examples (with its default commented out) or
  `npm run check` fails on the missing key.

## Pull requests

- One topic per PR; keep formatting-only changes out of PRs that change
  behaviour (Biome makes them noisy).
- Say what a reviewer should look at and how you verified it — the test
  that covers it, or what you saw in the browser.
- New behaviour comes with a test. The suites in `tests/` show the
  patterns: mock the config with `vi.doMock` for optional-feature paths,
  assert against `dist/` in `discovery.test.ts` for anything a crawler
  fetches.
- Docs change in the same PR as the code they describe.

## Reporting a problem

Open an issue with the browser, the locale you were in and the command or
page. For anything you'd rather not post publicly, use GitHub's private
vulnerability reporting on the repo's Security tab.
