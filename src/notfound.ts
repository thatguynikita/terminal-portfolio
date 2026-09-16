import "./styles/base.css";
import "./styles/notfound.css";

import profile from "../profile.config";
import { createMatrixRain, initialMatrixEnabled } from "./core/matrix";
import { createThemeController } from "./core/theme";
import { translate } from "./i18n";
import { LOCALES, nextLocale, type Locale } from "./i18n/locales";
import { StorageKey, readStored, writeStored } from "./core/storage";
import { escapeHtml } from "./core/html";
import { CV_LINK_LABEL, cvUrl } from "./cv/url";
import { renderFooter } from "./core/profile";

const canvas = document.getElementById("matrix") as HTMLCanvasElement | null;
if (canvas) {
  const matrix = createMatrixRain(canvas);
  matrix.setEnabled(initialMatrixEnabled(profile.terminal.defaultMatrix));
  // Applies the persisted theme, so a preference set on the terminal
  // carries over to this page.
  createThemeController(matrix, {
    defaultTheme: profile.terminal.defaultTheme,
    secretTheme: profile.commands.system?.secretTheme,
  });
}

const locales = LOCALES;

function initialLang(): Locale {
  const stored = readStored(StorageKey.lang);
  if (stored && locales.includes(stored as Locale)) return stored as Locale;
  return profile.terminal.defaultLocale;
}

let lang = initialLang();

/** The path the visitor actually asked for, for the fake `ls` line. */
function requestedPath(): string {
  let path: string;
  try {
    path = decodeURIComponent(location.pathname);
  } catch {
    path = location.pathname || "";
  }
  return path.replace(/^\/+/, "") || translate(lang, "notFound.unknownPage");
}

const text = (id: string, value: string): void => {
  const node = document.getElementById(id);
  if (node) node.textContent = value;
};

function render(): void {
  document.documentElement.lang = lang;
  const t = (key: string): string => translate(lang, key);
  const { handle } = profile.terminal;
  const { hostname } = profile.terminal;
  const path = requestedPath();

  text("brandLink", `← ${hostname}`);
  text("termTitle", `${handle}@${hostname} — bash — 404`);
  text("reqPath", path);
  text("reqPathEcho", path);
  text("notFoundText", t("notFound.message"));
  text("catPhoto", "");

  const ps = document.getElementById("psLabel");
  if (ps) ps.innerHTML = `${escapeHtml(handle)}@${escapeHtml(hostname)} <span class="path">~</span> $`;

  const message = document.getElementById("message");
  if (message) message.innerHTML = `<p>${escapeHtml(t("notFound.quip"))}</p>`;

  const cat = document.getElementById("catPhoto") as HTMLImageElement | null;
  if (cat) cat.alt = t("notFound.catAlt");

  // Only when a CV is configured — otherwise the link leads nowhere.
  const cvLink = document.getElementById("cvLink");
  if (cvLink) {
    cvLink.innerHTML = profile.cv
      ? `<a href="${cvUrl(profile, lang)}">${escapeHtml(CV_LINK_LABEL)} &rarr;</a>`
      : "";
  }

  const footer = document.getElementById("pageFooter");
  if (footer) {
    const back = profile.terminal.footer.backToTerminal
      ? `<a href="/">${escapeHtml(t("notFound.back"))}</a>`
      : "";
    footer.innerHTML = renderFooter(profile, lang, __SITE_URL__, back);
  }
}

render();

// The language toggle only exists when more than one locale is enabled.
const chip = document.getElementById("langChip") as HTMLButtonElement | null;
const announce = document.getElementById("langAnnounce");

if (chip && locales.length > 1) {
  chip.hidden = false;
  const updateChip = (): void => {
    const next = nextLocale(locales, lang);
    chip.textContent = next.toUpperCase();
    chip.setAttribute("aria-label", translate(lang, "notFound.switchTo"));
  };

  chip.addEventListener("click", () => {
    lang = nextLocale(locales, lang);
    writeStored(StorageKey.lang, lang);
    updateChip();
    render();
    if (announce) announce.textContent = translate(lang, "notFound.announce");
  });

  updateChip();
}
