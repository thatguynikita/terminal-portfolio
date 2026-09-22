#!/usr/bin/env sh
# Shoot the link-preview card: public/assets/img/og-terminal.png, 1200×630,
# from the built site opened in `?card` mode (the terminal window alone,
# boot skipped, intro printed). Needs Chrome or Chromium; nothing else.
#
#   THEME=amber npm run og-card    which theme to shoot (default green)
#   CHROME=/path/to/chrome         if it isn't in one of the usual places
set -eu
. "$(dirname "$0")/shot.sh"

OUT="${OUT:-public/assets/img/og-terminal.png}"
PORT=4173

serve_dist "$PORT"
trap 'kill $PREVIEW_PID 2>/dev/null' EXIT

# A 750×394 viewport at 1.6× is 1200×630 with text large enough to read in
# a preview; --virtual-time-budget fast-forwards the intro so the shot
# lands after it.
"$CHROME" --headless --disable-gpu --hide-scrollbars \
  --window-size=750,394 --force-device-scale-factor=1.6 \
  --virtual-time-budget=20000 \
  --screenshot="$OUT" "http://localhost:$PORT/?card&theme=${THEME:-green}" 2>/dev/null

echo "og-card: wrote $OUT (theme ${THEME:-green})"
