# Images to replace

[← docs index](README.md)

Four images ship with this repo. Three of them are **personal to the original
author** — if you fork and don't replace them, your CV shows someone else's face
and every link you share previews someone else's terminal.

| File | Used for | Size | If you don't replace it |
|---|---|---|---|
| `public/assets/img/nikita-photo.png` | The CV portrait | 480×480 | Someone else's face on your résumé |
| `public/assets/img/og-terminal.png` | Link previews on social, Slack, iMessage | 1200×630 | Someone else's terminal in every shared link |
| `public/favicon.ico` + `public/assets/icons/*` | Browser tab, home screen, PWA | see below | Someone else's icon in the tab |
| `public/assets/img/404-cat.png` | The 404 page | 821×357 | Nothing breaks — it's a joke, not an identity |

`npm run check` fails if `identity.photo` or `seo.ogImage` point at a file that
isn't there. It **cannot** tell whether the file is *yours* — a fork that keeps
the shipped images passes the preflight and ships them.

## The CV portrait

```ts
// profile.config.ts
identity: {
  photo: "/assets/img/you.png",
}
```

Square, 480×480 is what ships. The CSS does the work: `src/styles/cv.css`
applies `grayscale(1)` plus a theme-coloured overlay, so almost any photo lands
in the site's palette without editing. It prints grayscale too.

It also becomes an `<image:image>` entry in `sitemap.xml`, with a title
generated from `identity.name` and `identity.role` — so a broken path leaves a
dead image URL in your sitemap, not just a gap on the page.

**Omit `photo` entirely** and the CV renders without a portrait. That's a valid
setup, and it's what both example configs do.

## The link-preview card

```ts
// profile.config.ts
seo: {
  ogImage: "/assets/img/og-terminal.png",
}
```

1200×630 is the size every platform expects. The build turns it into an absolute
URL against `SITE_URL` for the `og:image` and `twitter:image` tags.

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
also names `milk-quest.sh`. Replace it, or keep it and inherit the joke —
nothing depends on it either way. Its alt text comes from `notFound.catAlt` in
each message catalogue, so change that too if you swap the picture.

---

**See also:** [the CV](cv.md) · [deployment](deploy.md)
