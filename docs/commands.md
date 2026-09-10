# Adding a command

[← docs index](README.md)

Drop a file in `src/commands/`. It registers itself — `help`, Tab-completion and
the touch chip bar all read the same registry, so they can't drift apart.

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

Then add its help text to each locale in `src/i18n/messages/`:

```ts
commands: { coffee: "make a coffee", ... }
```

That's it — no registration, no list to update. `npm test` fails if you forget
the help text in any enabled locale.

> The original this was rebuilt from kept four hand-synced lists of commands,
> and they already disagreed with each other. That's the reason for the
> registry.

## The output API

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

**`print` takes HTML and `printText` escapes — pick deliberately.** Nothing
escapes for you in `print`.

## Arguments

`args` is `{ name, raw, positional, flags, normalized }`. `flags` holds both
`-lah` characters and `--long-name` words; `name` is the name actually typed, so
an alias can behave differently — that's how `ll` becomes `ls -l`.

## Sub-shells

A command can take over the input line. See `src/commands/top.ts` (a
live-refreshing view) and `src/commands/ssh.ts` (a Q&A mini-shell). Implement
`Mode` and call `ctx.enterMode(...)`.

## Animations

Animations are skipped when the tab is hidden or the visitor has reduced-motion
set — see `animationsEnabled()` in `src/core/html.ts`, and use `ctx.sleep` as the
paced variant. A hidden tab clamps timers to once a second, then once a minute;
without this the terminal strands itself mid-line.

---

**See also:** [the fake filesystem](filesystem.md) · [architecture](architecture.md)
