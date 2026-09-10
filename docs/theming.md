# Theming

[← docs index](README.md)

One CSS file in `src/themes/`. It joins the theme list, `theme`'s completions and
the random first-visit pool automatically.

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

## There is no THEME_MAP

The matrix-rain colours are `--matrix-color` / `--matrix-fade`, read via
`getComputedStyle`. Canvas can't read CSS variables directly, which is why the
predecessor kept a parallel JS colour map — `getComputedStyle` closes that gap,
so one CSS file really is the whole theme.

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

## Secret themes

A theme can be hidden from completions until unlocked. `sabbatical` is declared
secret in `src/themes/index.ts` and appears only after `claude "add light theme"`
is run twice.

---

**See also:** [architecture](architecture.md) · [the CV](cv.md)
