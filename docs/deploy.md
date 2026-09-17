# Deployment

[← docs index](README.md)

The build is a plain static `dist/` — any host works.

```bash
npm run deploy       # GitHub Pages
npm run deploy:s3    # AWS S3 or Yandex Object Storage; see .env.example
```

Both run the test suite first, then typecheck and build. The config preflight is
part of that, **so a fork can't publish with the original author's name still in
place.**

Before either: put `SITE_URL=https://your.domain` in `.env` (copy
`.env.example`). It's the origin for every absolute URL the build emits — the
sitemap, canonicals, `og:url`, `llms.txt` — and the host of the `CNAME` file.
The build reads `.env` itself, so no wrapper is needed; a variable in the shell
or in CI's `vars.SITE_URL` wins over the file. **With no `SITE_URL` at all,
`vite build` refuses to run** rather than emit URLs that point nowhere.

The CI workflow only verifies the build compiles — nothing is deployed from
it — so it falls back to a reserved placeholder origin when the repository
variable isn't set. To have CI build against your real origin, set `SITE_URL`
under **Settings → Secrets and variables → Actions → Variables**.

To deploy past a failing test, skip the wrapper:

```bash
npm run build && npx gh-pages -d dist --dotfiles
```

## GitHub Pages

`npm run deploy` builds, then pushes `dist/` to a `gh-pages` branch. Your working
tree and `main` are untouched; the branch is replaced wholesale each time.

Set it up once:

1. Make the repo public (Pages needs it on the free plan).
2. **Settings → Pages → Deploy from a branch → `gh-pages` / `(root)`**.
3. Add a DNS `CNAME` for your subdomain pointing at `<user>.github.io`.
4. **Settings → Pages → Custom domain** — the host from your `SITE_URL`.

### Step 3 is not optional

`base` is fixed at `/`, so a project site served at `<user>.github.io/<repo>/`
loads with every asset 404ing. You need a custom domain, or a `<user>.github.io`
root site — otherwise set `base` in `vite.config.ts` to `"/<repo>/"`.

That constraint is deliberate: `404.html` is served at arbitrary URL depths, so
its asset paths must be root-absolute. Relative paths would resolve against
whatever directory the broken URL happened to be in. (Pages picks `404.html`
up automatically; with `seo.enable404: false` there is none, and GitHub
serves its own 404.)

The build emits a `CNAME` file from `SITE_URL`'s host so your custom domain
survives each deploy — replacing the branch would otherwise clear it. HTTPS takes
a few minutes to provision the first time.

### Previewing without pushing

```bash
npm run build && npx gh-pages -d dist --dotfiles -n
```

`gh-pages` keeps a clone under `node_modules/.cache`. If a run is interrupted, or
you dry-run before the remote branch exists, the next one fails with
`a branch named 'gh-pages' already exists` — clear it with `npx gh-pages-clean`.

## S3 (AWS or Yandex Object Storage)

```bash
npm run deploy:s3:dry-run   # the full upload and delete plan, nothing written
npm run deploy:s3           # tests, build, publish
```

Needs `aws-cli` (credentials in `~/.aws/credentials` or `AWS_*` variables)
and these in `.env`:

| variable | |
|---|---|
| `S3_BUCKET` | the bucket |
| `S3_ENDPOINT` | `https://storage.yandexcloud.net` for Yandex; blank for AWS — that's the only difference |
| `S3_REGION` | e.g. `ru-central1` |
| `S3_KEEP` | optional: space-separated key patterns the deploy leaves untouched (see below) |

The bucket needs static-website hosting with **`index.html` as the index
document and `404.html` as the error document**, and public read. The 404 page
is served at arbitrary URL depths, which is why `base` is `/`. With
`seo.enable404: false` the page isn't built: the error-document setting then
points at nothing and S3 answers a missing URL with its own plain 404.

### What `scripts/deploy-s3.sh` does, and why it isn't one `aws s3 sync`

`aws s3 sync` guesses each object's `Content-Type` from its extension and never
adds a charset. S3-compatible storage then serves `llms.txt` — half Cyrillic —
as `text/plain` with no encoding, and browsers render it garbled; and `sync`
doesn't know `.webmanifest` at all. So:

1. **Every object's type comes from a table** in the script (`.html` →
   `text/html; charset=utf-8`, `.js` → `text/javascript; charset=utf-8`,
   `.webmanifest` → `application/manifest+json; charset=utf-8`, images,
   fonts…), one sync pass per extension. A file whose extension isn't in the
   table **fails the deploy** naming the file — nothing ships as
   `application/octet-stream`. Add the extension to the table to allow it.
2. **Cache headers**: what Vite content-hashes (`.css`, `.js`, fonts) gets
   `max-age=31536000, immutable`; everything else `max-age=300`. Images under
   `assets/img/` come from `public/` unhashed and stay short-lived.
3. **A delete pass** removes every key `dist/` no longer has — `--delete
   --size-only`, so nothing just uploaded is re-uploaded with a guessed type.
4. `CNAME` and `.nojekyll` are GitHub Pages artefacts and are skipped.
5. Not on a dry run, the script ends by printing the `content-type` and
   `cache-control` headers of `/`, `/cv.html`, `/llms.txt` and
   `/site.webmanifest` at `SITE_URL`, so the run finishes with proof.

### `S3_KEEP`: files the deploy must not touch

Search-engine ownership proofs — Yandex Webmaster's `yandex_*.html`, Bing's
`BingSiteAuth.xml`, an IndexNow key file — live in the bucket but not in the
repo (they're yours, not the template's). List them as glob patterns:

```
S3_KEEP="yandex_*.html BingSiteAuth.xml 03ed2fb0794e438a803df3efccfc7524.txt"
```

Each becomes an `--exclude` on every pass, and the aws cli applies excludes to
both sides of a sync: the keys are neither uploaded nor deleted.

## What the build emits

Alongside the pages: `CNAME`, `.nojekyll`, a generated `site.webmanifest`, and
— each behind its own switch in `seo` (`enableSitemap`, `enableRobotsTxt`,
`enableLlmsTxt`) — `sitemap.xml`, `robots.txt` and `llms.txt`. A switched-off
file is not emitted at all, and `robots.txt` stops pointing at a sitemap that
isn't there. `robots.txt`'s `Content-Signal` line — may the content be searched,
train models, feed AI answers — is `seo.contentSignal`, three booleans. The footer under the window on every page is `terminal.footer`: the
generated copyright, the terminal's hint, the CV/404 back link, and a raw-HTML
`bottomText` line — the terminal-portfolio credit unless you set it, `""` for none. Three more switches govern what goes into every
page's `<head>`:
`enableJsonLd` (the Person JSON-LD on the terminal and CV pages),
`enableNoscript` (the terminal's no-JS fallback) and `enableSocialCards`
(`og:*` and `twitter:card`); `enable404` builds the 404 page itself (and
ships its cat). Everything in `public/` is copied verbatim.

---

**See also:** [the CV](cv.md) · [architecture](architecture.md)
