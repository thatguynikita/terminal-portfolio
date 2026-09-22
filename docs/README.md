# Documentation

[← back to the README](../README.md)

The README covers getting a site of your own running. These pages cover
everything past that.

| Page | What's in it |
|---|---|
| [Configuration](configuration.md) | The one file that is your site, the two examples, what's required and what's optional, the now-playing row, the check |
| [Deployment](deploy.md) | GitHub Pages or an S3 bucket, DNS, what the build produces |
| [Images to replace](assets.md) | The CV photo, the link-preview card, the icons — sizes and how to make them |
| [Languages](i18n.md) | Choosing which languages build, adding one |
| [The CV](cv.md) | The CV page: its sections, one page per language, printing |
| [Theming](theming.md) | Adding a theme, checking contrast, the secret theme |
| [Adding a command](commands.md) | What a command looks like, how it prints, taking over the input |
| [The fake filesystem](filesystem.md) | Files that show up in `ls` and `cat`, including ones that run |
| [Architecture](architecture.md) | How the pieces fit — for changing the engine, not the content |

## The short version

- **Everything about you** is `profile.config.ts`.
- **Adding a command** is one file in `src/commands/`.
- **Adding a file** to the fake filesystem is one file in `src/fs/`.
- **Adding a theme** is one CSS file in `src/themes/`.
- **Adding a language** is one catalogue in `src/i18n/messages/` plus a line in
  `MESSAGES`.
- **Replacing the images** is dropping files into `public/assets/`.

Nothing needs registering. `npm test` catches what's missing.
