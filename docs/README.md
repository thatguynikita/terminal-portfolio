# Documentation

[← back to the README](../README.md)

The README covers getting a site of your own running. These pages cover
everything past that.

| Page | What's in it |
|---|---|
| [Architecture](architecture.md) | The four contracts, auto-registration, `pages/` as Vite's root, how the CV pages are assembled |
| [Adding a command](commands.md) | The command shape, the output API, arguments, sub-shells |
| [The fake filesystem](filesystem.md) | Plain files, `.ts` descriptors, executables, non-text files |
| [Theming](theming.md) | The token list, contrast, the CRT flicker, print, secret themes |
| [Languages](i18n.md) | `MESSAGES`, adding and dropping a language, why unselected catalogues don't ship |
| [The CV](cv.md) | Config shape, optional sections, hreflang, printing, why there are no mirrors |
| [Deployment](deploy.md) | GitHub Pages, S3-compatible hosts, DNS, what the build emits |

## The short version

- **Adding a command** is one file in `src/commands/`.
- **Adding a file** to the fake filesystem is one file in `src/fs/`.
- **Adding a theme** is one CSS file in `src/themes/`.
- **Adding a language** is one catalogue in `src/i18n/messages/` plus a line in
  `MESSAGES`.

Nothing needs registering. `npm test` catches what's missing.
