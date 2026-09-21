import "./styles/base.css";
import "./styles/terminal.css";

import profile from "../profile.config.ts";
import { boot, intro } from "./core/boot.ts";
import { initGameOverlay } from "./core/game.ts";
import { createInput } from "./core/input.ts";
import { renderFooter } from "./core/profile.ts";
import { BOOTED_SESSION_KEY, StorageKey, writeSession, writeStored } from "./core/storage.ts";
import { createTerminal } from "./core/terminal.ts";
import { CV_LINK_LABEL, cvUrl } from "./cv/url.ts";

// `?card[&theme=<name>]` frames the page for the link-preview screenshot
// (scripts/og-card.sh): chrome hidden, boot skipped, theme as asked. Written
// to storage before the terminal exists, since that is where both are read.
const params = new URLSearchParams(location.search);
if (params.has("card")) {
  document.body.classList.add("card");
  writeSession(BOOTED_SESSION_KEY, "1");
  const theme = params.get("theme");
  if (theme) writeStored(StorageKey.theme, theme);
}

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

  // Prerendered in the default language; follows the visitor's choice, and
  // says so, since the summary around it stays in the default language.
  const heading = document.getElementById("pageHeading");
  if (heading) {
    const role = profile.seo.role?.[lang];
    heading.textContent = role ? `${profile.author[lang]} — ${role}` : profile.author[lang];
    heading.lang = lang;
  }

  const links = document.getElementById("topbarLinks");
  if (links) {
    // The CV link follows the session's language, so a Russian session
    // lands on /ru/cv.html rather than the English page.
    // Configured links first, the built-in CV link last and furthest right.
    // The arrow marks only the CV link — the same `cv.html →` affordance the
    // 404 page shows; configured links render as plain text.
    const cvLink = profile.cv
      ? [
          `<a href="${ctx.escapeAttr(cvUrl(profile, lang))}">${ctx.escape(CV_LINK_LABEL)} &rarr;</a>`,
        ]
      : [];
    const extra = (profile.terminal.links ?? []).map(
      (l) => `<a href="${ctx.escapeAttr(l.href)}">${ctx.escape(l.label)}</a>`,
    );
    links.innerHTML = [...extra, ...cvLink].join("");
  }

  const footer = document.getElementById("siteFooter");
  if (footer) {
    const hint = profile.terminal.footer.hint?.[lang];
    footer.innerHTML = renderFooter(
      profile,
      lang,
      __SITE_URL__,
      hint ? ctx.escape(hint) : ctx.t("ui.footerHint"),
    );
  }

  const gameTitle = document.getElementById("gameTitle");
  if (gameTitle && profile.commands?.game) {
    gameTitle.textContent = `${profile.terminal.handle}@${profile.terminal.hostname} — ${profile.commands?.game.title[lang]}`;
  }

  const gameHint = document.getElementById("gameHint");
  if (gameHint && profile.commands?.game) {
    gameHint.innerHTML =
      `press <span class="accent">ESC</span> or click ` +
      `<span class="dot r" aria-hidden="true"></span><span class="sr-only">the red light</span> to exit &middot; ` +
      `<a href="${ctx.escapeAttr(profile.commands?.game.url)}" target="_blank" rel="noopener">open directly &#8599;</a>`;
  }
}
