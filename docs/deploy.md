# Deployment

[← docs index](README.md)

The build is a folder of static files, `dist/` — any host works. Two are
one command each:

```bash
npm run deploy       # GitHub Pages
npm run deploy:cf    # Cloudflare
npm run deploy:s3    # AWS S3, DigitalOcean Spaces or Yandex Object Storage
```

All three lint, test and build first, so a half-finished rebrand never goes
out. To publish past a failing test: `npm run build && npx gh-pages -d dist --dotfiles`.

## `SITE_URL`

Put `SITE_URL=https://your.domain` in `.env` (copy `.env.example`). It's
the base of every link the build writes — sitemap, canonicals, share cards
— and the build refuses to run without it. A variable in the shell wins
over the file.

CI builds against a placeholder origin unless you set `SITE_URL` under
**Settings → Secrets and variables → Actions → Variables**; nothing is
deployed from CI either way.

## GitHub Pages

`npm run deploy` pushes `dist/` to a `gh-pages` branch, replacing it each
time; `main` is untouched. Once, in this order:

1. Make the repo public (Pages needs it on the free plan).
2. `npm run deploy` — this creates the `gh-pages` branch, which the next
   step needs to exist.
3. **Settings → Pages → Deploy from a branch → `gh-pages` / `(root)`**.
4. **Settings → Pages → Custom domain** — the host from your `SITE_URL`.
   Do this before DNS: GitHub warns that a domain pointed at Pages without
   being claimed here can be taken over.
5. At your registrar, add a `CNAME` record for your subdomain pointing at
   `<user>.github.io` — the user, not the repo.
6. Back in **Settings → Pages**, tick **Enforce HTTPS** once the
   certificate shows as issued (a few minutes).

### A custom domain is not optional

The site expects to live at the root of a domain — a project page at
`<user>.github.io/<repo>/` loads with every asset missing. Use a custom
domain or a `<user>.github.io` site, or set `base` in `vite.config.ts` to
`"/<repo>/"` and accept that the 404 page only works at the top level.

The build emits the `CNAME` file for your domain and an empty `.nojekyll`,
so nothing needs re-adding after a deploy.

### Previewing without pushing

```bash
npm run build && npx gh-pages -d dist --dotfiles -n
```

If a later run fails with `a branch named 'gh-pages' already exists`, run
`npx gh-pages-clean`.

## Cloudflare

### Connect the repo

No CLI needed. **Workers & Pages → Create application → Connect with
GitHub**, pick the repository, and on *Set up your application*:

| field | value |
|---|---|
| Project name | `terminal-portfolio` — must equal `name` in `wrangler.json` |
| Build command | `npm run build` |
| Deploy command | leave `npx wrangler deploy` |
| Builds for non-production branches | on for a preview URL per branch; off and only `main` builds |
| API token | leave *Create new token* |
| Variables | `SITE_URL` = `https://your.domain` |

### Or from your machine

```bash
npm run deploy:cf:dry-run   # validates wrangler.json and lists the files
npm run deploy:cf           # lint, test, build, publish
```

Needs two values in `.env`:

| variable | where it comes from |
|---|---|
| `CLOUDFLARE_ACCOUNT_ID` | **Workers & Pages** overview, *Account details* in the right column |
| `CLOUDFLARE_API_TOKEN` | **My Profile → API Tokens → Create Token** |

A custom token with two permissions is all the deploy uses: *Account →
Workers Scripts: Edit* and *User → User Details: Read*.

Either way the site is at `<name>.<account>.workers.dev` until you add
your domain under the Worker's **Domains & Routes** (DNS on Cloudflare).

## S3-compatible storage (AWS, DigitalOcean, Yandex)

```bash
npm run deploy:s3:dry-run   # the full upload and delete plan, nothing written
npm run deploy:s3           # lint, test, build, publish
```

Needs the `aws` CLI (credentials in `~/.aws/credentials` or `AWS_*`
variables) and these in `.env`:

| variable | |
|---|---|
| `S3_BUCKET` | the bucket |
| `S3_ENDPOINT` | AWS: blank · DigitalOcean: `https://<region>.digitaloceanspaces.com` · Yandex: `https://storage.yandexcloud.net` |
| `S3_REGION` | e.g. `eu-central-1` · `fra1` · `ru-central1` |
| `S3_KEEP` | optional — see below |

The bucket needs static-website hosting with `index.html` as the index
document and `404.html` as the error document, and public read. A
DigitalOcean Space has neither an error-document setting nor its own
custom-domain HTTPS: put the Spaces CDN or Cloudflare in front.

The script isn't a bare `aws s3 sync`: it sets every file's content type
and cache headers itself (sync guesses, and gets UTF-8 text and
`.webmanifest` wrong), refuses to upload a file type it doesn't know,
deletes what `dist/` no longer has, and ends by printing the live headers
as proof. `scripts/deploy-s3.sh` has the details.

### `S3_KEEP`

Files that live in the bucket but not in the repo — search-engine
ownership proofs like `yandex_*.html` or `BingSiteAuth.xml` — would be
deleted as stale. List them and the deploy leaves them alone:

```
S3_KEEP="yandex_*.html BingSiteAuth.xml"
```

## What the build emits

Alongside `index.html` and the CV pages:

| file | switch |
|---|---|
| `404.html` | `seo.enable404` |
| `sitemap.xml` | `seo.enableSitemap` |
| `robots.txt` — per-crawler rules and a `Content-Signal` line | `seo.enableRobotsTxt` |
| `llms.txt` | `seo.enableLlmsTxt` |
| `site.webmanifest`, `CNAME`, `.nojekyll`, `_headers` | always |

Three more switches govern the `<head>` of every page: `enableJsonLd`,
`enableStaticSummary` (the terminal page's crawler/no-JS summary) and `enableSocialCards`. Everything in `public/` is copied
as is.

---

**See also:** [configuration](configuration.md) · [the CV](cv.md)
