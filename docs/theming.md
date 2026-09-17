# Theming

[← docs index](README.md)

One CSS file in `src/themes/`. It joins the theme list, `theme`'s completions and
the random first-visit pool automatically — the matrix-rain colours are
`--matrix-color` / `--matrix-fade`, read with `getComputedStyle`, so one CSS
file really is the whole theme.

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

`npm test` fails if a theme is missing any token. Nothing falls back to another
theme, deliberately: a half-defined palette should be a failure, not a subtly
wrong page.

## Two things to check before shipping a palette

**Contrast.** Palettes sourced from real hardware or published specs often fail
WCAG AA. Check `--fg` and `--fg-dim` against `--bg`; `commodore`'s literal
reference was 2.26:1 and had to be adjusted.

**The CRT flicker.** It's calibrated against near-black backgrounds. Any theme
whose `--bg` isn't near-black must disable it (`animation: none` — see
`solarized.css`), or the `multiply` blend's periodic dip reads as a flash every
few seconds. Five of the seven shipped themes need this.

## Printing

`@media print` in `src/styles/cv.css` redefines the palette tokens rather than
greying out individual classes, so **every theme prints identically grayscale —
including themes added later.** A test asserts every token `green.css` defines is
overridden. You don't need to do anything per-theme for print.

## The secret theme

`src/themes/secret.css` is the easter egg: a light theme, hidden from
completions until `claude "add light theme"` is run twice. Its CSS is
addressed as `secret`, but the name visitors see and type is
`commands.system.secretTheme` — so renaming the egg is a config edit, and the
shipped config calls it `sabbatical`. Omit the field and the secret theme
isn't offered at all (not listed, not dealt at random); the egg then stays at
won't-fix however often it's asked. The name must not be `secret` or the
name of a public theme — `npm run check` refuses both.

---

**See also:** [architecture](architecture.md) · [the CV](cv.md)
