# Sourced by the two screenshot scripts: find Chrome, serve the built site.
# Not executable on its own.

find_chrome() {
  for c in \
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
    "/Applications/Chromium.app/Contents/MacOS/Chromium" \
    google-chrome google-chrome-stable chromium chromium-browser \
    "/c/Program Files/Google/Chrome/Application/chrome.exe" \
    "/c/Program Files (x86)/Google/Chrome/Application/chrome.exe"; do
    if [ -x "$c" ] || command -v "$c" >/dev/null 2>&1; then echo "$c"; return; fi
  done
  echo "no Chrome found — set CHROME=/path/to/chrome" >&2
  exit 1
}
CHROME="${CHROME:-$(find_chrome)}"

# Builds, then serves dist/ on $1. Always builds: both callers shoot the
# site as configured now, and a screenshot of a stale dist/ is wrong
# without looking wrong. The caller traps EXIT to kill $PREVIEW_PID.
serve_dist() {
  npx vite build
  npx vite preview --port "$1" --strictPort >/dev/null 2>&1 &
  PREVIEW_PID=$!
  sleep 1
}
