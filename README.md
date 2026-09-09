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

## Adding a language

1. add the code to `LOCALES` in `src/i18n/locales.ts`
2. create `src/i18n/<code>.ts` and register it in `src/i18n/index.ts`
3. list it in `terminal.locales` in `profile.config.ts`

Step 1 alone makes TypeScript point at every config field still needing a
translation — you can't half-add a language. With a single locale configured,
the language toggle and the `lang` command disappear.

---

## Deploying

The build is a plain static `dist/` — any host works.

```bash
npm run deploy       # GitHub Pages (gh-pages branch)
npm run deploy:s3    # AWS S3 or Yandex Object Storage; see .env.example
```

`base` is fixed at `/`, and the build emits a `CNAME` from
`identity.domain`, so **GitHub Pages needs a custom domain** (or a
`user.github.io` root site). A project site served at `/repo-name/` would load
with broken assets — set `base` in `vite.config.ts` if you want that instead.
This is deliberate: `404.html` is served at arbitrary URL depths, so its asset
paths have to be root-absolute rather than relative.

`deploy:s3` covers AWS and Yandex from one command — they differ only by
`--endpoint-url`. It needs `aws-cli` installed.

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

## Layout

```
profile.config.ts       everything about you
src/core/               engine: registry, output API, input loop, modes, theme
src/commands/           one file per command — auto-registered
src/fs/                 the fake filesystem
src/i18n/               one file per locale
src/themes/             one CSS file per theme — auto-registered
src/styles/             shared chrome and per-page layout
public/                 copied verbatim into dist/
```

## Licence

MIT.
