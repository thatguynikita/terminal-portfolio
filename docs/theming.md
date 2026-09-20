# Theming

[← docs index](README.md)

A theme is one CSS file in `src/themes/`. Add one and it's in the `theme`
command, its completions and the random first-visit pool — matrix rain,
CRT glow and all, since those read their colours from the same file.

```css
/* src/themes/ocean.css */
:root[data-theme="ocean"] {
  --bg: #04121c;
  --fg: #7fdbff;
  /* ...every token green.css defines... */
  --matrix-color: #7fdbff;
  --matrix-fade: rgba(4,18,28,.08);
}
```

`green.css` is the reference: copy it and change the values. `npm test`
fails if any token is missing — nothing falls back to another theme.

## Before you ship a palette

- **Contrast.** Check `--fg` and `--fg-dim` against `--bg` for WCAG AA.
  Palettes copied from real hardware often fail; `commodore` had to be
  adjusted.
- **The CRT flicker** looks right on near-black backgrounds only. A lighter
  theme should turn it off with `animation: none` — see `solarized.css` —
  or it reads as a flash every few seconds.

## Printing

Every theme prints grayscale, including yours: `@media print` in
`src/styles/cv.css` overrides the palette tokens, and a test checks it
covers all of them. Nothing to do per theme.

## The secret theme

`secret.css` is the light theme `claude "add light theme"` unlocks on the
second ask. Visitors see it under the name in `commands.system.secretTheme`
(the shipped config says `sabbatical`); leave that field out and the theme
isn't offered at all. The name can't be `secret` or an existing theme's —
`npm run check` refuses both.

---

**See also:** [architecture](architecture.md) · [the CV](cv.md)
