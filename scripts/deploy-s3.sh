#!/usr/bin/env sh
# Publish dist/ to an S3-compatible bucket: AWS S3, DigitalOcean Spaces or
# Yandex Object Storage — the same script, only S3_ENDPOINT differs.
#
# Not a bare `aws s3 sync`: sync guesses Content-Type from the extension,
# never adds a charset, and doesn't know .webmanifest. Every object's type
# comes from TABLE below, one pass per extension; an unknown extension fails.
#
# Environment (from .env via `dotenv -e .env`, or the shell):
#   S3_BUCKET     required
#   S3_ENDPOINT   optional; blank for AWS proper
#   S3_REGION     optional; exported as AWS_DEFAULT_REGION
#   S3_KEEP       optional; space-separated key patterns to neither upload
#                 nor delete (each becomes an --exclude)
#   SITE_URL      optional; when set, the run ends with header checks
#   DRY_RUN=1     adds --dryrun to every aws call
#
# Credentials are aws-cli's own: ~/.aws/credentials or AWS_* variables.
set -eu
set -f # no shell globbing: the patterns below are for the aws cli

DIST=dist
: "${S3_BUCKET:?S3_BUCKET is not set — copy .env.example to .env and fill it in}"
[ -f "$DIST/index.html" ] || { echo "deploy-s3: no $DIST/index.html — run \`npm run build\` first" >&2; exit 1; }

ENDPOINT=""
[ -n "${S3_ENDPOINT:-}" ] && ENDPOINT="--endpoint-url $S3_ENDPOINT"
[ -n "${S3_REGION:-}" ] && export AWS_DEFAULT_REGION="$S3_REGION"
DRY=""
[ "${DRY_RUN:-0}" = "1" ] && DRY="--dryrun"

SHORT="public, max-age=300"                 # pages and generated text files
MEDIUM="public, max-age=604800"             # images: unhashed, rarely replaced
LONG="public, max-age=31536000, immutable"  # what Vite content-hashes, and versioned fonts

# ext|content-type|cache-control — the whole list, so nothing is guessed.
# Images come from public/ with fixed names, so a week: long enough that a
# repeat visit doesn't refetch the portrait, short enough that a swapped
# one shows up without a rename.
TABLE='
html|text/html; charset=utf-8|SHORT
css|text/css; charset=utf-8|LONG
js|text/javascript; charset=utf-8|LONG
mjs|text/javascript; charset=utf-8|LONG
xml|application/xml; charset=utf-8|SHORT
txt|text/plain; charset=utf-8|SHORT
webmanifest|application/manifest+json; charset=utf-8|SHORT
json|application/json; charset=utf-8|SHORT
ico|image/x-icon|MEDIUM
png|image/png|MEDIUM
jpg|image/jpeg|MEDIUM
jpeg|image/jpeg|MEDIUM
gif|image/gif|MEDIUM
webp|image/webp|MEDIUM
svg|image/svg+xml; charset=utf-8|MEDIUM
woff2|font/woff2|LONG
woff|font/woff|LONG
'

# Files the GitHub Pages path emits; meaningless in a bucket.
PAGES_ONLY="CNAME .nojekyll"

known_ext() {
  printf '%s\n' "$TABLE" | grep -q "^$1|"
}

# ---- guard: every file in dist/ must have a type in the table -------------
unknown=""
for f in $(find "$DIST" -type f | sed "s#^$DIST/##"); do
  base="${f##*/}"
  case " $PAGES_ONLY " in *" $base "*) continue ;; esac
  ext="${base##*.}"
  if [ "$ext" = "$base" ] || ! known_ext "$ext"; then unknown="$unknown $f"; fi
done
if [ -n "$unknown" ]; then
  echo "deploy-s3: no content-type for:$unknown" >&2
  echo "deploy-s3: add the extension to TABLE in scripts/deploy-s3.sh — nothing is uploaded as octet-stream" >&2
  exit 1
fi

# ---- filters shared by every pass -----------------------------------------
skip=""
for name in $PAGES_ONLY; do skip="$skip --exclude $name"; done
keep=""
for pattern in ${S3_KEEP:-}; do keep="$keep --exclude $pattern"; done

echo "deploy-s3: ${DRY:+DRY RUN — }bucket s3://$S3_BUCKET ${S3_ENDPOINT:+via $S3_ENDPOINT}"
[ -n "$keep" ] && echo "deploy-s3: keeping untouched:${S3_KEEP:+ $S3_KEEP}"

# ---- 1. typed uploads, one pass per extension ------------------------------
# Later filters win, so the keep/skip excludes come after the include.
printf '%s\n' "$TABLE" | while IFS='|' read -r ext type cache; do
  [ -n "$ext" ] || continue
  find "$DIST" -type f -name "*.$ext" | grep -q . || continue
  case "$cache" in LONG) cc="$LONG" ;; MEDIUM) cc="$MEDIUM" ;; *) cc="$SHORT" ;; esac
  # shellcheck disable=SC2086
  aws s3 sync "$DIST" "s3://$S3_BUCKET" $ENDPOINT $DRY \
    --exclude "*" --include "*.$ext" $skip $keep \
    --content-type "$type" --cache-control "$cc"
done

# ---- 2. delete what dist/ no longer has -----------------------------------
# --size-only: everything just uploaded matches by size and is left alone
# (a re-upload here would reset its type to a guess); only stale keys go.
# shellcheck disable=SC2086
aws s3 sync "$DIST" "s3://$S3_BUCKET" $ENDPOINT $DRY --delete --size-only $skip $keep \
  | grep -v '^(dryrun) upload:\|^upload:' || true

# ---- 3. proof -------------------------------------------------------------
if [ -z "$DRY" ] && [ -n "${SITE_URL:-}" ]; then
  echo "deploy-s3: response headers at $SITE_URL"
  for path in / /cv.html /llms.txt /site.webmanifest; do
    printf '  %-18s ' "$path"
    curl -sI "$SITE_URL$path" | grep -i '^content-type\|^cache-control' | tr -d '\r' | tr '\n' ' '
    echo
  done
fi
echo "deploy-s3: done${DRY:+ (dry run — nothing written)}"
