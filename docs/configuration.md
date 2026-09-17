# Configuration

[← docs index](README.md)

Everything about you is one file, **`profile.config.ts`**: name, bio,
skills, links, the info card, the CV, the `ssh` personas, which
languages build, the theme a first-time visitor gets, what search engines
are told. The only other setting is `SITE_URL` in `.env` — where the site
lives — because it's about the deployment, not about you.

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

Every field in them has a short comment saying what it does. Fields that
are at their default are commented out — uncomment one to change it.

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

That gives you a green terminal with the boot screen, the hidden commands
and the `ssh` easter egg — and no `about`, `skills`, `contact`, info card or
CV, since there's nothing to show. `npm run check` will mention that
`seo.description` is unset (search engines then write their own snippet);
everything else is quiet.

| Leave out… | and you get |
|---|---|
| `terminal.handle` | `guest` |
| `terminal.hostname` | the host of your `SITE_URL` |
| `terminal.defaultLocale` | the first language in `MESSAGES` |
| `terminal.defaultTheme` / `defaultMatrix` | `green` / rain on |
| `terminal.bootScreen` / `chips` | on |
| `terminal.footer` | the © line, the "back to terminal" link and the terminal-portfolio credit (`bottomText: ""` removes the credit) |
| `seo.enable*` switches, `seo.contentSignal` | all on |
| `seo.role` / `seo.description` | no role / no description for machines (the check warns about the description) |
| `neofetch` | no info card and no `neofetch` command |
| `bio` / `skills` / `socials` | no `about` / `skills` / `contact` command, and nothing about them on the CV |
| `commands` | default help text, owner `root`, no secret theme, no game, no `ssh` personas |
| `cv` | no CV page, command or file |

One rule the check enforces: a skill or link marked for the CV only
(`contexts: ["cv"]`) while there is no `cv` fails by name — it could never
be shown anywhere.

## The check

```bash
npm run check
```

Runs in a second and catches a half-finished rebrand: a field missing a
translation, an image that isn't there, a link that isn't a URL, a game
script with a slash in its name, a launch date without a timezone. Both
example configs are held to the same rules, so copying one is a safe
start. `npm run deploy` runs it for you and refuses to publish if it fails.

It checks that images *exist*, not that they're *yours* — swapping the
portrait, the preview card and the icons is on you
(→ [images to replace](assets.md)).

---

**See also:** [languages](i18n.md) · [the CV](cv.md) · [deployment](deploy.md)
