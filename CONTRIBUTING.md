# Contributing

Thanks for looking. A new command, a theme, a language, a fix, a doc that
was wrong — all welcome, and none of it needs permission first. If you'd
rather ask before building something bigger, open an issue and we'll talk.

## Getting set up

```bash
git clone https://github.com/thatguynikita/terminal-portfolio.git
cd terminal-portfolio
npm install
npm run dev        # http://localhost:5173
```

Node 22.12 or newer. Nothing else to configure — `SITE_URL` is only needed
for a production build.

## Before you open a PR

```bash
npm run lint       # Biome; `npm run lint:fix` tidies things up for you
npm test
```

`npm install` also points git at the hooks in `.githooks/`, which run
these for you at commit and push. They're there to save you a round-trip,
not to block you — if one gets in the way, `git commit --no-verify` skips
it and CI will tell you what it would have said.

## A few things that make it easier

- **A command is one file** in `src/commands/`. It registers itself.
  → [adding a command](docs/commands.md)
- **Text lives in the catalogues**, `src/i18n/messages/`; personal data
  lives only in `profile.config.ts`. If you add a visible string, add it to
  `en.ts` and to any other language you're comfortable in — the tests will
  list what's still missing, and it's fine to leave the rest for review.
  → [languages](docs/i18n.md)
- **A theme is one CSS file** with the tokens `green.css` has. Worth a
  quick contrast check of `--fg` on `--bg`; a few published palettes are
  surprisingly faint. → [theming](docs/theming.md)
- **Tests are welcome but not a gate.** If you're not sure how to test
  something, say so in the PR and it can be added there. `tests/` has
  examples of most patterns.
- Smaller PRs are easier to review, and a line on what you changed and
  how you tried it goes a long way.

That's it. Thanks again.
