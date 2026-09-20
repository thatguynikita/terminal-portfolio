# The fake filesystem

[← docs index](README.md)

Drop a file into `src/fs/` and it's in `ls`, with its real size, and `cat`
prints it. Nothing to configure.

```
src/fs/projects.txt     →  ls, cat projects.txt
```

## Files that do something

For a file that's built from your config, translated, or runs, add a
`<filename>.ts` next to it:

```ts
// src/fs/deploy.sh.ts
import { defineFile } from "./define.ts";

export default defineFile({
  requiresSudo: true,                       // ./deploy.sh is denied; sudo ./deploy.sh runs
  exec: (ctx) => ctx.print("deploying..."),
});
```

What it can declare: `read` (the lines `cat` prints — return `null` and a
`hint` for a file that isn't text), `exec` and `requiresSudo`, `hidden`
(only in `ls -a`), `perms`, `size`, `enabled: false`, and `name` when the
filename should come from config. A `.ts` beside a plain file of the same
name layers on top of it — `.bashrc` is the text, `.bashrc.ts` dims its
comments.

Executables run the same way whether typed as `./name`, `sudo ./name` or
through a command, and Tab completes them: `.` Tab lists them, so does
`sudo ` Tab.

The game launcher is the one file named by the config —
`commands.game.script` — and disappears with the `game` command when no
game is configured.

## Two things that bite

- **A new plain file needs a dev-server restart**; `.ts` files hot-reload.
- **Dotfiles aren't picked up automatically.** The production build's file
  scan skips them, so `.bashrc` is imported by name in `src/fs/index.ts`.
  A new dotfile needs a line there too.

---

**See also:** [adding a command](commands.md) · [architecture](architecture.md)
