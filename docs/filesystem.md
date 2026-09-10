# The fake filesystem

[← docs index](README.md)

Drop any file into `src/fs/`. It shows up in `ls` with its **real byte size** and
`cat` prints it. No configuration.

```
src/fs/projects.txt     →  ls, cat projects.txt
```

## Dynamic and executable files

For a file that's rendered from your config, translated, or executable, add a
`<filename>.ts` descriptor beside it:

```ts
// src/fs/deploy.sh.ts
import { defineFile } from "./define";

export default defineFile({
  requiresSudo: true,                       // ./deploy.sh is denied; sudo works
  exec: (ctx) => ctx.print("deploying..."),
});
```

A descriptor can accompany a plain file of the same name and layer on top of it —
`.bashrc` supplies the text, `.bashrc.ts` dims its comments.

## Files that aren't text

Return `null` from `read` and add a `hint` telling the reader how to open it
instead:

```ts
read: () => null,
hint: (ctx) => ctx.t("cv.catHint"),   // cat: cv.html: not a text file — use `cv`
```

`ctx.runFile` is shared by `./name`, `sudo ./name` and the `game` shortcut, so
an executable behaves the same however it's reached.

## Two things that bite

- **Adding a *new* plain file while `npm run dev` is running needs a restart.**
  Vite doesn't re-scan the raw glob on its own. `.ts` files hot-reload fine.
- **Dotfiles need their own glob patterns** (`./.*`, `!./.*.ts`) — `*` does not
  match a leading dot. That's how `.bashrc` is picked up.

---

**See also:** [adding a command](commands.md) · [architecture](architecture.md)
