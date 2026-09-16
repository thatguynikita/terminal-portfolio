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
whatever directory the broken URL happened to be in.

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

One command covers both — they differ only by `--endpoint-url`, which is blank
for AWS. Needs `aws-cli` installed and `.env` filled in from `.env.example`.

Point the bucket's static-website **error document at `404.html`**.

## What the build emits

Alongside the pages: `CNAME`, `.nojekyll`, a generated `site.webmanifest`, and
— each behind its own switch in `seo` (`enableSitemap`, `enableRobotsTxt`,
`enableLlmsTxt`) — `sitemap.xml`, `robots.txt` and `llms.txt`. A switched-off
file is not emitted at all, and `robots.txt` stops pointing at a sitemap that
isn't there. `robots.txt`'s `Content-Signal` line — may the content be searched,
train models, feed AI answers — is `seo.contentSignal`, three booleans. Three more switches govern what goes into every page's `<head>`:
`enableJsonLd` (the Person JSON-LD on the terminal and CV pages),
`enableNoscript` (the terminal's no-JS fallback) and `enableSocialCards`
(`og:*` and `twitter:card`). Everything in `public/` is copied
verbatim.

---

**See also:** [the CV](cv.md) · [architecture](architecture.md)
