# Images to replace

[← docs index](README.md)

A few images ship with this repo, and two of them are **personal to the
original author** — if you fork and don't replace them, every link you share
previews someone else's terminal, and someone else's icon sits in the tab.

| File | Used for | Size | If you don't replace it |
|---|---|---|---|
| `public/assets/img/portraits/` | The CV portrait — see below | 480×480 | **Only the one you configure ships**; the rest are pruned at build |
| `public/assets/img/og-terminal.png` | Link previews on social, Slack, iMessage | 1200×630 | Someone else's terminal in every shared link |
| `public/favicon.ico` + `public/assets/icons/*` | Browser tab, home screen, PWA | see below | Someone else's icon in the tab |
| `public/assets/img/404-cat.png` | The 404 page | 821×357 | Nothing breaks — it's a joke, not an identity |

`npm run check` fails if `cv.photo` or `seo.ogImage` point at a file that
isn't there. It **cannot** tell whether the card or the icons are *yours* — a
fork that keeps them passes the preflight and ships them.

## The CV portrait

```ts
// profile.config.ts
cv: {
  photo: "/assets/img/portraits/you.png",
}
```

Drop your photo into `public/assets/img/portraits/` and point `cv.photo`
at it. **That directory is the one place the build prunes**: it holds the
author's portrait and both example personas', Vite copies `public/` verbatim,
and only the file your config names survives into `dist/`. The other faces
never ship. A test asserts exactly that.

**By default the photo is served exactly as uploaded** — colour, no filter,
no tint. Print greys it, nothing else touches it. `photoStyle` opts in to
more:

```ts
cv: {
  photo: "/assets/img/portraits/you.png",
  photoStyle: "pixel",   // or "tint", or leave it out
}
```

| `photoStyle` | On screen | Needs JavaScript |
|---|---|---|
| *(unset)* / `"plain"` | Exactly as uploaded | no |
| `"tint"` | Grayscale under the theme colour | no |
| `"pixel"` | A posterized pixel render under the theme colour | yes — degrades to `"tint"` without it |

**`"pixel"`** is the full terminal look. On the CV page, `src/cv.ts` draws
the image at 72×72, snaps it to six flat greys, and scales it back up with
crisp pixel edges. A smooth studio headshot comes out as a posterized pixel
render with no pre-processing on your side; the pipeline stretches contrast
first, so a soft or washed-out source still uses the full range. Both example
profiles use it.

**`"tint"`** is for a photo that is already styled the way you want — the
author's is a hand-made pixel render, so re-pixelating it would only coarsen
it. Pure CSS, no canvas.

The style is decided at build time as a class on the portrait's frame, which
is why the first two need no JavaScript and why `"pixel"` falls back to
`"tint"` rather than to the raw photo when scripts are off or the canvas
can't read the image.

What makes a good source: square, the face filling most of the frame, a plain
background, reasonable contrast. 480×480 is what ships and is plenty — the
render is 72 pixels across, so resolution beyond that is never seen on screen.

Two things the effect deliberately does *not* touch:

- **Print.** The pixel render is screen-only. Print discards it and shows your
  source photo in grayscale — the same treatment as every other element on
  the printed page, whichever `photoStyle` is set.
- **The raw file.** It's what ships in `dist/`, what the sitemap's
  `<image:loc>` points at, and what a reader without JavaScript sees. The
  pixel version exists only in the browser. A `photo` on another origin can't
  be processed — canvas security — and falls back to the plain image.

It also becomes an `<image:image>` entry in `sitemap.xml`, with a title
generated from `identity.name` and `identity.role` — so a broken path leaves a
dead image URL in your sitemap, not just a gap on the page.

**Omit `photo` entirely** and the CV renders without a portrait, and nothing
from `portraits/` ships at all. A photo configured anywhere *outside* that
directory is left alone — the pruning only ever touches `portraits/`.

## The link-preview card

```ts
// profile.config.ts
seo: {
  ogImage: "/assets/img/og-terminal.png",
}
```

1200×630 is the size every platform expects. The build turns it into an absolute
URL against `SITE_URL` for the `og:image` tag — when `seo.enableSocialCards` is
on; off removes every `og:` and `twitter:` tag and this field does nothing.

**The shipped one is just a screenshot of the terminal itself**, which is the
easiest possible card to make — it's your own site, already branded. Build,
serve, shoot, crop:

```bash
npm run build
npm run preview &                       # serves dist/ on :4173

# macOS; use your own Chrome/Chromium path elsewhere
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$CHROME" --headless --disable-gpu --hide-scrollbars \
  --virtual-time-budget=15000 --window-size=1280,800 \
  --screenshot=/tmp/raw.png "http://localhost:4173/"

# crop to the terminal window, then scale to the OG size
ffmpeg -i /tmp/raw.png -vf "crop=1080:567:200:62,scale=1200:630" \
  public/assets/img/og-terminal.png
```

`--virtual-time-budget` fast-forwards the boot animation so the shot lands after
the intro, with your neofetch card on screen. The crop numbers are a starting
point — adjust them to frame your own card.

> Set `terminal.defaultTheme` to a fixed theme before shooting. Leave it on
> `"random"` and you'll get a different palette every run.

## Favicons

Referenced by fixed paths from `pages/*.html`, so **replace the files in place**
rather than pointing config at new ones:

```
public/favicon.ico                              16×16
public/assets/icons/favicon-16x16.png           16×16
public/assets/icons/favicon-32x32.png           32×32
public/assets/icons/favicon-120x120.png         120×120
public/assets/icons/apple-touch-icon.png        180×180
public/assets/icons/android-chrome-192x192.png  192×192
public/assets/icons/android-chrome-512x512.png  512×512
```

The two `android-chrome-*` files are listed in the generated
`site.webmanifest`; the rest are linked from the page shells. Any favicon
generator will produce this set from a single square source.

## The 404 cat

`public/assets/img/404-cat.png` is tied to the condensed-milk running joke that
also names the author's launcher, `milk-quest.sh`. Replace it, or keep it and inherit the joke —
nothing depends on it either way. Its alt text comes from `notFound.catAlt` in
each message catalogue, so change that too if you swap the picture.

---

**See also:** [the CV](cv.md) · [deployment](deploy.md)
