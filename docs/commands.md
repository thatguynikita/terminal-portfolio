# Adding a command

[← docs index](README.md)

Drop a file in `src/commands/`. It registers itself: `help`, Tab-completion
and the chip bar all read the same list.

```ts
// src/commands/coffee.ts
import { defineCommand } from "../core/types.ts";

export default defineCommand({
  name: "coffee",
  usage: "<size>",          // shown in `help`
  complete: () => ["small", "large"],
  run(ctx, args) {
    ctx.print(`brewing a <span class="accent">${ctx.escape(args.positional[0] ?? "small")}</span>`);
  },
});
```

Then give it a help line in each language file under `src/i18n/messages/`:

```ts
commands: { coffee: "make a coffee", ... }
```

That's all. `npm test` fails if a language is missing the line.

Other things a command can declare: `aliases` (other names that run it),
`hidden` (works, but stays out of `help` and the chips), `order` (where it
sits in `help`), `enabled: false` (unregistered — for a feature the config
doesn't have).

## Printing

Commands never touch the page directly; everything goes through `ctx`.

| Call | Prints |
|---|---|
| `ctx.print(html)` | one line of **HTML** — nothing is escaped for you |
| `ctx.printText(text)` | one line of text, escaped |
| `ctx.printLines(lines)` | several lines |
| `ctx.type(text, { speed })` | with a typewriter effect |
| `ctx.sequence(steps)` | a scripted sequence of `{ text, delay?, typed? }` |
| `ctx.table(header, rows)`, `ctx.kv(pairs)` | a table, or two columns |

Every call takes an optional CSS class as its last argument. Also on
`ctx`: `t()` for translations, `profile`, `lang`, `fs`, `theme`, `history`,
`sleep()`, `escape()`.

## Arguments

`args.positional` is the words, `args.flags` the `-l` letters and
`--long` words, `args.name` the name actually typed — that's how `ll`
knows to behave like `ls -l`.

## Taking over the input

`top` and `ssh` own the input line while they run: implement `Mode`
(`src/core/types.ts`) and call `ctx.enterMode(...)`. Those two files are
the examples.

## The fake machine

`ps`, `who`, `w` and `env` show the visitor (`terminal.handle`) and the
owner (`commands.system.owner`). `uptime`, `uname -a` and `ls -l` all use
`commands.system.since` as the moment the machine came up — leave it out
and it's the last build.

## Animations

Use `ctx.sleep` for pauses, not a bare timer: it's skipped when the tab is
hidden or the visitor asked for reduced motion, so the terminal never
strands itself mid-line.

---

**See also:** [the fake filesystem](filesystem.md) · [architecture](architecture.md)
