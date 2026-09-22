# Configuration

[← docs index](README.md)

Everything about you is one file, **`profile.config.ts`**: name, bio,
skills, links, the info card, the CV, the `ssh` personas, languages,
theme, what search engines are told. The only setting outside it is
`SITE_URL` in `.env` — where the site lives.

## Start from an example

Two complete, fictional configs ship next to the real one. Both are on
`.example` domains, so nothing in them points anywhere real.

| File | Persona | Languages |
|---|---|---|
| `profile.config.example.ts` | a data engineer | English |
| `profile.config.multilingual.example.ts` | a robotics engineer | English, Spanish, German |

```bash
cp profile.config.example.ts profile.config.ts
```

Every field has a comment saying what it does; the ones at their default
are commented out, so uncommenting is how you change one.

## Only your name is required

Everything else either has a default or is a feature that's simply absent
when you leave it out. The smallest config that builds:

```ts
// profile.config.ts
import { defineProfile } from "./src/core/profile.ts";
import en from "./src/i18n/messages/en.ts";

export const MESSAGES = { en };

export default defineProfile(MESSAGES, {
  author: { en: "Ada Example" },
});
```

That builds a green terminal with all the built-in commands and easter
eggs, and nothing about a person yet: no `about`, `skills`, `contact`, info
card or CV. `npm run check` will only mention that `seo.description` is
unset.

| Leave out… | and you get |
|---|---|
| `terminal.handle` | `guest` |
| `terminal.hostname` | the host of your `SITE_URL` |
| `terminal.defaultLocale` | the first language in `MESSAGES` |
| `terminal.defaultTheme` / `defaultMatrix` | `green` / rain on |
| `terminal.bootScreen` / `chips` | on |
| `terminal.footer` | the © line, the "back to terminal" link and the terminal-portfolio credit (`bottomText: ""` removes the credit) |
| `seo.enable*` switches, `seo.contentSignal` | all on |
| `seo.role` / `seo.description` | nothing about your role or the site in the metadata (the check warns about the description) |
| `neofetch` | no info card and no `neofetch` command |
| `bio` / `skills` / `socials` | no `about` / `skills` / `contact` command, and nothing about them on the CV |
| `commands` | default help text, owner `root`, no secret theme, no game, no `ssh` personas |
| `cv` | no CV page, command or file |

One rule: a skill or link marked for the CV only (`contexts: ["cv"]`)
while there is no `cv` fails the check — it could never be shown.

## Now playing

`neofetch.nowPlaying` adds a live "Playing" row to the info card: your
current Spotify track, polled from an endpoint that answers
`{ is_playing, track, artist, url }`.
[spotify-now-playing](https://github.com/thatguynikita/spotify-now-playing)
is that endpoint — one script, deployed the way you prefer:

| Deployed as | `endpoint` |
|---|---|
| AWS Lambda / Yandex Cloud Function | the function's URL |
| Cloudflare Worker | its `workers.dev` URL, or `/api/now-playing` once the Worker is routed under your own Cloudflare-proxied domain |

The row shows "spotify offline" while the endpoint is unreachable;
`pollMs` is how often it asks. Leave `nowPlaying` out and there is no row
and no request.

## The check

```bash
npm run check
```

Catches a half-finished rebrand: a missing translation, an image that
isn't there, a link that isn't a URL, a launch date without a timezone.
Both examples pass it, and `npm run deploy` runs it before publishing.

It checks that images *exist*, not that they're *yours* — see
[images to replace](assets.md).

---

**See also:** [languages](i18n.md) · [the CV](cv.md) · [deployment](deploy.md)
