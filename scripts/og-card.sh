#!/usr/bin/env sh
# Shoot the link-preview card: public/assets/img/og-terminal.png, 1200×630,
# from the built site opened in `?card` mode (the terminal window alone,
# boot skipped, intro printed). Needs Chrome or Chromium; nothing else.
#
#   THEME=amber npm run og-card    which theme to shoot (default green)
#   CHROME=/path/to/chrome         if it isn't in one of the usual places
set -eu

OUT=public/assets/img/og-terminal.png
PORT=4173

find_chrome() {
  for c in \
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
    "/Applications/Chromium.app/Contents/MacOS/Chromium" \
    google-chrome google-chrome-stable chromium chromium-browser \
    "/c/Program Files/Google/Chrome/Application/chrome.exe" \
    "/c/Program Files (x86)/Google/Chrome/Application/chrome.exe"; do
    if [ -x "$c" ] || command -v "$c" >/dev/null 2>&1; then echo "$c"; return; fi
  done
  echo "og-card: no Chrome found — set CHROME=/path/to/chrome" >&2
  exit 1
}
CHROME="${CHROME:-$(find_chrome)}"

[ -f dist/index.html ] || npx vite build

npx vite preview --port "$PORT" --strictPort >/dev/null 2>&1 &
trap 'kill $! 2>/dev/null' EXIT
sleep 1

# A 750×394 viewport at 1.6× is 1200×630 with text large enough to read in
# a preview; --virtual-time-budget fast-forwards the intro so the shot
# lands after it.
"$CHROME" --headless --disable-gpu --hide-scrollbars \
  --window-size=750,394 --force-device-scale-factor=1.6 \
  --virtual-time-budget=20000 \
  --screenshot="$OUT" "http://localhost:$PORT/?card&theme=${THEME:-green}" 2>/dev/null

echo "og-card: wrote $OUT (theme ${THEME:-green})"
