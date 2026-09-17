<div align="center">

# terminal-portfolio

**Your own terminal-style website — with a CV page, hidden commands and easter eggs — built from one config file.**

[![CI](https://github.com/thatguynikita/terminal-portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/thatguynikita/terminal-portfolio/actions/workflows/ci.yml)
[![Tests](https://img.shields.io/badge/tests-394-brightgreen)](tests/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D22.12-brightgreen)](package.json)
[![TypeScript](https://img.shields.io/badge/TypeScript-7-3178c6?logo=typescript&logoColor=white)](tsconfig.json)
[![Vite](https://img.shields.io/badge/Vite-8-646cff?logo=vite&logoColor=white)](vite.config.ts)
[![Live Demo](https://img.shields.io/badge/demo-nikita.sh-0a7)](https://nikita.sh)

<img src="docs/demo.gif" width="800" alt="A recorded session: the boot sequence and neofetch card, help, a fake top, switching to the ubuntu theme, then ls -lah revealing milk-quest.sh and running it with sudo">

**[Try it live →](https://nikita.sh)**

</div>

---

## ✨ Features

- 🖥️ **A terminal that feels real** — a boot sequence, Tab-completion, history, Ctrl shortcuts, matrix rain
- 🕵️ **38 built-in commands** — `sudo`, `terraform`, a fake `top`, an `ssh` that answers recruiter questions and many more
- 🎮 **A hidden game** — poke around the filesystem, find the launcher, `sudo` it; the demo hides [condensed-milk-quest](https://github.com/thatguynikita/condensed-milk-quest), yours can hide anything
- 🎨 **7 themes** — pick one, or deal a random one to every first visit; a secret one if you ask nicely
- 📄 **A CV that looks like the terminal** — every section is a shell command, your photo can go pixel-art, and it follows whatever theme the visitor picked
- 🖨️ **The CV prints cleanly** — grayscale on paper whatever theme is on screen
- 📱 **Works on a phone** — tappable command chips, minimal keyboard interaction
- 🌍 **13 languages ready** — pick the ones you want, or add your own in one file
- 🎵 **"Now playing" from Spotify** in the info card, via [spotify-now-playing](https://github.com/thatguynikita/spotify-now-playing)
- 🔍 **Found by search engines and AI** — sitemap, robots, `llms.txt`, structured data, all generated
- ⚙️ **Everything about you in one file** — name, bio, skills, links, CV, jokes
- 🚀 **One command to deploy** — GitHub Pages or any S3-compatible bucket

## 📸 Screenshots

| The terminal | The CV |
|---|---|
| <img src="docs/img/terminal.png" alt="The terminal running neofetch"> | <img src="docs/img/cv.png" alt="The prerendered CV page"> |

| Four of the seven themes | The 404 |
|---|---|
| <img src="docs/img/themes.png" alt="The same terminal rendered in the green, amber, solarized and commodore themes"> | <img src="docs/img/404.png" alt="The 404 page"> |

---

## 🚀 Get started

```bash
git clone https://github.com/thatguynikita/terminal-portfolio.git
cd terminal-portfolio
npm install
npm run dev                 # open http://localhost:5173
```

Make it yours, then put it online:

```bash
cp profile.config.example.ts profile.config.ts   # start from a filled-in example
$EDITOR profile.config.ts                        # your name, bio, CV, links
cp .env.example .env                             # set SITE_URL to your domain
npm run check                                    # makes sure nothing of the example is left
npm run deploy                                   # GitHub Pages…
npm run deploy:s3                                # …or an S3 bucket (AWS, Yandex)
```

## ✏️ Make it yours

**Edit `profile.config.ts`.** That's the whole site: name, bio, skills, links,
the info card, the CV, the `ssh` personas, which languages build. Only
your name is required — everything else has a sensible default or simply
disappears when you leave it out. Two complete, fictional examples ship
alongside it: `profile.config.example.ts` (English) and
`profile.config.multilingual.example.ts` (English, Spanish, German). Copy
either and edit. → [configuration guide](docs/configuration.md)

**Replace two images.** They're the author's, and nothing warns you:

| File | What it is |
|---|---|
| `public/assets/img/portraits/` | your CV photo — point `cv.photo` at it |
| `public/assets/img/og-terminal.png` | the preview card in shared links |

Swapping the icons (`public/favicon.ico`, `public/assets/icons/`) is optional.
→ [sizes and how to make them](docs/assets.md)

**Pick your languages.** One line at the top of the config:

```ts
import en from "./src/i18n/messages/en.ts";
import es from "./src/i18n/messages/es.ts";

export const MESSAGES = { en, es };   // this line is the whole language setup
```

Thirteen are ready to import; the rest never reach the site. Adding one
tells you exactly which lines of your config still need translating.
→ [languages](docs/i18n.md)

**Run `npm run check`.** It catches a half-finished rebrand — a missing
translation, an image that isn't there, a link that isn't a link.

## 🧩 Add your own

Each of these is one file, and nothing needs registering.

<details>
<summary><b>A command</b></summary>

```ts
// src/commands/coffee.ts
import { defineCommand } from "../core/types.ts";

export default defineCommand({
  name: "coffee",
  complete: () => ["small", "large"],
  run: (ctx, args) => ctx.printText(`brewing a ${args.positional[0] ?? "small"}`),
});
```

Add `commands: { coffee: "make a coffee" }` to each language and it shows up in `help`.
→ [guide](docs/commands.md)

</details>

<details>
<summary><b>A file in the fake filesystem</b></summary>

Drop anything into `src/fs/` and it appears in `ls`, with `cat` printing it:

```
src/fs/projects.txt     →  ls, cat projects.txt
```

→ [guide](docs/filesystem.md) — including files that run

</details>

<details>
<summary><b>A theme</b></summary>

```css
/* src/themes/ocean.css */
:root[data-theme="ocean"] {
  --bg: #04121c;
  --fg: #7fdbff;
  /* ...every colour green.css defines... */
}
```

It joins the theme list (and the random pool, if that's what you configured) on its own.
→ [guide](docs/theming.md)

</details>

<details>
<summary><b>A language that isn't among the thirteen</b></summary>

One file in `src/i18n/messages/`, translated from `en.ts`, plus its line in
`MESSAGES`. TypeScript and the tests point out anything missing or mistranslated.
→ [guide](docs/i18n.md#adding-a-language)

</details>

## 📦 Deploy

```bash
npm run deploy       # GitHub Pages
npm run deploy:s3    # AWS S3 or Yandex Object Storage
```

Both check, test and build first. → [deployment guide](docs/deploy.md)

---

## 🤝 Contributing

Issues and pull requests are welcome — see [CONTRIBUTING.md](CONTRIBUTING.md).
More on how it's built: [docs](docs/README.md).

## 🙏 Credits

Rebuilt from [nikita.sh](https://github.com/thatguynikita/nikita.sh), which now
deploys from here. Shaped by three terminal portfolios worth a look:
[iamdhakrey/terminal-portfolio](https://github.com/iamdhakrey/terminal-portfolio),
[micahkepe/term-website](https://github.com/micahkepe/term-website/) and
[satnaing/terminal-portfolio](https://github.com/satnaing/terminal-portfolio).

## 📄 Licence

MIT — see [LICENSE](LICENSE). Fork it, rename it, make it yours.
