import "./styles/base.css";
import "./styles/terminal.css";

import profile from "../profile.config";
import { createTerminal } from "./core/terminal";
import { createInput } from "./core/input";
import { boot, intro } from "./core/boot";
import { initGameOverlay } from "./core/game";
import { CV_LINK_LABEL, cvUrl } from "./cv/url";
import { renderCopyright } from "./core/profile";

const body = document.getElementById("termBody");
const canvas = document.getElementById("matrix") as HTMLCanvasElement | null;

if (!body || !canvas) {
  throw new Error("terminal markup is missing #termBody or #matrix");
}

const terminal = createTerminal({ profile, body, canvas });
const input = createInput(terminal);

initGameOverlay(profile);
renderChrome();
terminal.onRestart = () => intro(terminal, input);

// The chrome carries language-dependent text and the CV link, so it has to
// re-render when `lang` changes — not just the terminal body.
const onModeChange = terminal.onModeChange;
terminal.onModeChange = () => {
  onModeChange?.();
  renderChrome();
};

void boot(terminal, input);

/** Page furniture that reads from the config rather than being hardcoded. */
function renderChrome(): void {
  const { ctx } = terminal;
  const lang = ctx.lang;
  document.documentElement.lang = lang;

  const brand = document.getElementById("topbarBrand");
  if (brand) brand.textContent = profile.terminal.hostname;

  const heading = document.getElementById("pageHeading");
  if (heading) heading.textContent = `${profile.identity.name[lang]} — ${profile.identity.role[lang]}`;

  const links = document.getElementById("topbarLinks");
  if (links) {
    // The CV link follows the session's language, so a Russian session
    // lands on /ru/cv.html rather than the English page.
    // Configured links first, the built-in CV link last and furthest right.
    // The arrow marks only the CV link — the same `cv.html →` affordance the
    // 404 page shows; configured links render as plain text.
    const cvLink = profile.cv
      ? [`<a href="${ctx.escapeAttr(cvUrl(profile, lang))}">${ctx.escape(CV_LINK_LABEL)} &rarr;</a>`]
      : [];
    const extra = (profile.links?.topbar ?? []).map(
      (l) => `<a href="${ctx.escapeAttr(l.href)}">${ctx.escape(l.label)}</a>`
    );
    links.innerHTML = [...extra, ...cvLink].join("");
  }

  const footer = document.getElementById("siteFooter");
  if (footer) {
    footer.innerHTML = `${renderCopyright(profile, lang)} · ${ctx.t("ui.footerHint")}`;
  }

  const gameTitle = document.getElementById("gameTitle");
  if (gameTitle && profile.game) {
    gameTitle.textContent = `${profile.identity.handle}@${profile.terminal.hostname} — ${profile.game.title}`;
  }

  const gameHint = document.getElementById("gameHint");
  if (gameHint && profile.game) {
    gameHint.innerHTML =
      `press <span class="accent">ESC</span> or click <span class="accent">&times;</span> to exit &middot; ` +
      `<a href="${ctx.escapeAttr(profile.game.url)}" target="_blank" rel="noopener">open directly &#8599;</a>`;
  }
}
