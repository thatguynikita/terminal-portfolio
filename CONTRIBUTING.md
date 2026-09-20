# Contributing

Thanks for looking. A new command, a theme, a language, a fix, a doc that
was wrong — all welcome, and none of it needs permission first. If you'd
rather ask before building something bigger, open an issue and we'll talk.

Setup is the README's [Quick start](README.md#quick-start); the
[docs](docs/README.md) cover how commands, themes, languages and the
filesystem are put together.

## Before you open a PR

```bash
npm run lint       # Biome; `npm run lint:fix` tidies things up for you
npm test
```

## Good to know

- **New text needs translating**, but not by you alone: add it to `en.ts`
  and any language you're comfortable in — the tests list what's missing,
  and the rest can be filled in during review.
- **Tests are welcome but not a gate.** If you're not sure how to test
  something, say so in the PR and it can be added there.
- Smaller PRs are easier to review, and a line on what you changed and
  how you tried it goes a long way.

That's it. Thanks again.
