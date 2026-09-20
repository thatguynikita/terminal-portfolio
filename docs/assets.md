# Images to replace

[← docs index](README.md)

Two of the shipped images are the author's, and nothing warns you if you
keep them: every link you share would preview someone else's terminal.

| File | Used for | Size |
|---|---|---|
| `public/assets/img/portraits/` | the CV portrait — only the one `cv.photo` names ships | 480×480 |
| `public/assets/img/og-terminal.png` | the preview card in shared links | 1200×630 |
| `public/favicon.ico` + `public/assets/icons/` | the tab and home-screen icon — optional | see below |
| `public/assets/img/404-cat.png` | the 404 page — a joke, keep it or swap it | 821×357 |

`npm run check` fails if `cv.photo` or `seo.ogImage` point at a missing
file. It can't tell whether the images are *yours*.

## The CV portrait

Drop your photo into `public/assets/img/portraits/` and point `cv.photo` at
it. Only that file survives the build; the others in the directory (the
author's and the two example personas') never ship. Leave `photo` out and
the CV has no portrait.

```ts
cv: {
  photo: "/assets/img/portraits/you.png",
  photoStyle: "pixel",   // or "tint", or leave it out
}
```

| `photoStyle` | What you get |
|---|---|
| *(unset)* | the photo as uploaded |
| `"tint"` | grayscale under the theme colour |
| `"pixel"` | a posterized pixel-art render under the theme colour |

`"pixel"` needs no preparation: a normal headshot comes out as pixel art,
contrast stretched first so a soft source still uses the full range. Both
examples use it. `"tint"` is for a photo that already has the look — the
author's is a hand-made pixel render.

A good source is square, face filling the frame, plain background. 480×480 is
plenty; the pixel render is 72 pixels across.

Print always shows the source photo in grayscale, whichever style is set. So
does a reader without JavaScript when the style is `"pixel"` — it falls back
to `"tint"`, never to colour.

## The link-preview card

```ts
seo: {
  ogImage: "/assets/img/og-terminal.png",
}
```

1200×630, the size every platform expects. The shipped one is a screenshot
of the terminal itself, and one command makes yours:

```bash
npm run og-card                 # needs Chrome or Chromium, nothing else
THEME=amber npm run og-card     # any theme name; green by default
```

It builds the site if needed, opens it in a card layout (the window alone,
boot skipped) and writes the file. If Chrome isn't in a usual place, set
`CHROME=/path/to/chrome`. With `seo.enableSocialCards` off the field does
nothing.

## Favicons

Referenced by fixed paths from the page shells, so replace the files in
place. Any favicon generator makes the set from one square source —
[RealFaviconGenerator](https://realfavicongenerator.net/) covers every size
here including the 120×120, [favicon.io](https://favicon.io/) can also make
one from text or an emoji:

```
public/favicon.ico                              16×16
public/assets/icons/favicon-16x16.png           16×16
public/assets/icons/favicon-32x32.png           32×32
public/assets/icons/favicon-120x120.png         120×120   # Yandex: its search results use this size
public/assets/icons/apple-touch-icon.png        180×180
public/assets/icons/android-chrome-192x192.png  192×192
public/assets/icons/android-chrome-512x512.png  512×512
```

## The 404 cat

Part of the condensed-milk joke that also names the author's launcher.
Keep it or swap it; its alt text is `notFound.catAlt` in each language
file, so change that too if you change the picture.

---

**See also:** [the CV](cv.md) · [deployment](deploy.md)
