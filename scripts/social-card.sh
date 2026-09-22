#!/usr/bin/env sh
# Shoot the repo's social preview: docs/img/social-preview.png, 1280×640,
# which GitHub shows when the repo is shared. Upload it at
# Settings → General → Social preview.
#
# The two live pages sit in iframes — the terminal in `?card` mode, the CV
# with its page chrome stripped — beside the pitch. Everything is inside
# the middle 1120×470, because the sites that unfurl a link crop this
# image to their own aspect; that way a crop takes background only.
#
#   THEME=amber npm run social-card   which theme to shoot (default green)
#   CHROME=/path/to/chrome            if it isn't in one of the usual places
set -eu
. "$(dirname "$0")/shot.sh"

OUT="${OUT:-docs/img/social-preview.png}"
PORT=4174
THEME="${THEME:-green}"
# Written into dist/ so it is same-origin with the iframes and can style
# them; removed on exit, and dist/ is gitignored.
PAGE=dist/_social-card.html

serve_dist "$PORT"
trap 'kill $PREVIEW_PID 2>/dev/null; rm -f "$PAGE"' EXIT

# The repo's name, dimmed after the first hyphen if it has one.
NAME=$(node -p "require('./package.json').name")
case "$NAME" in
  *-*) TITLE="${NAME%%-*}-<span>${NAME#*-}</span>" ;;
  *) TITLE="$NAME" ;;
esac
COMMANDS=$(ls src/commands/*.ts | wc -l | tr -d ' ')
THEMES=$(ls src/themes/*.css | wc -l | tr -d ' ')
LOCALES=$(ls src/i18n/messages/*.ts | wc -l | tr -d ' ')
# The built stylesheet with every theme's tokens (and the @font-face
# blocks). Hashed, so read the name rather than spell it.
THEME_CSS=$(basename "$(ls dist/assets/theme-*.css)")

cat > "$PAGE" <<HTML
<!doctype html>
<html data-theme="$THEME">
<meta charset="utf-8">
<title>social preview</title>
<!-- Every colour below is a theme token, so THEME reaches the card and
     not just the frames. The stylesheet carries the font too. -->
<link rel="stylesheet" href="/assets/$THEME_CSS">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: 1280px; height: 640px; overflow: hidden; }
  /* Overrides the site's own body rule, which this stylesheet brings. */
  body {
    margin: 0;
    padding: 0;
    min-height: 0;
    background:
      radial-gradient(ellipse 900px 520px at 68% 50%, rgba(var(--tint-rgb), 0.1), transparent 70%),
      var(--bg);
    color: var(--fg);
    font-family: "JetBrains Mono", ui-monospace, monospace;
    display: grid;
    place-items: center;
  }
  /* The safe area. Nothing outside it but background. */
  .safe {
    width: 1120px;
    height: 470px;
    display: grid;
    grid-template-columns: 430px 1fr;
    align-items: center;
    gap: 36px;
  }
  .name { font-size: 38px; font-weight: 700; white-space: nowrap; text-shadow: 0 0 14px rgba(var(--tint-rgb), 0.5); }
  .name span { color: var(--fg-dim); }
  .tag { margin-top: 18px; font-size: 20px; line-height: 1.5; }
  .tag b { color: var(--accent); }
  .meta { margin-top: 22px; font-size: 16px; line-height: 1.9; color: var(--fg-dim); }
  .meta span { color: var(--fg-dim2); }
  .prompt { margin-top: 26px; font-size: 16px; color: var(--fg-dim2); }
  .prompt b { color: var(--fg); font-weight: 400; }
  .prompt i { display: inline-block; width: 9px; height: 17px; background: var(--fg); vertical-align: -3px; }
  .shots { position: relative; height: 470px; }
  .shot {
    position: absolute;
    width: 560px;
    height: 350px;
    overflow: hidden;
    border-radius: 12px;
    border: 1px solid var(--border);
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(var(--tint-rgb), 0.12);
  }
  /* A real 1100×688 viewport, scaled into the frame — a small iframe would
     lay the page out for a phone instead. */
  .shot iframe { width: 900px; height: 563px; border: 0; transform: scale(0.622); transform-origin: 0 0; }
  .cv { right: 0; top: 10px; }
  .term { left: 0; bottom: 10px; z-index: 2; }
</style>
<script>
  // The CV page takes its theme from storage, not the query — and the
  // composite is served from the site's own origin, so this is that
  // storage. Set before the frames load.
  localStorage.setItem("terminal-portfolio:theme", "$THEME");
</script>
<div class="safe">
  <div>
    <div class="name">$TITLE</div>
    <div class="tag">Your site as a terminal — <b>one config file</b>, <b>one command</b> to deploy.</div>
    <div class="meta">
      <span>&#9656;</span> portfolio + CV page, prerendered<br>
      <span>&#9656;</span> $COMMANDS commands, $THEMES themes, $LOCALES languages<br>
      <span>&#9656;</span> Vite + TypeScript, no framework
    </div>
    <div class="prompt">$ <b>cp profile.config.example.ts</b><i></i></div>
  </div>
  <div class="shots">
    <div class="shot cv"><iframe src="/cv.html" onload="bare(this)"></iframe></div>
    <div class="shot term"><iframe src="/?card&theme=$THEME" onload="bare(this)"></iframe></div>
  </div>
</div>
<script>
  // Same origin, so the frames can be stripped down to the window itself:
  // no topbar, no footer, no page padding.
  function bare(frame) {
    var doc = frame.contentDocument;
    var css = doc.createElement("style");
    css.textContent =
      "body{padding:0!important}" +
      ".topbar,footer{display:none!important}" +
      ".wrap{max-width:none!important}" +
      ".term{height:100vh!important;margin:0!important;border-radius:0!important}";
    doc.head.appendChild(css);
  }
</script>
HTML

# The card is laid out at its final size, so no scaling: 1280×640 out.
"$CHROME" --headless --disable-gpu --hide-scrollbars \
  --window-size=1280,640 --force-device-scale-factor=1 \
  --virtual-time-budget=20000 \
  --screenshot="$OUT" "http://localhost:$PORT/_social-card.html" 2>/dev/null

echo "social-card: wrote $OUT (theme $THEME)"
