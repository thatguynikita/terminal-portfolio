import "./styles/base.css";
import "./styles/cv.css";

import profile from "../profile.config";
import { createMatrixRain, initialMatrixEnabled } from "./core/matrix";
import { createThemeController } from "./core/theme";
import { StorageKey, writeStored } from "./core/storage";
import { posterizeGray } from "./cv/portrait";
import { leaveForTerminalOnKey } from "./core/leave";

/**
 * The CV's only client-side JavaScript. Everything the page says is
 * already in the HTML — this adds the background, the theme the visitor
 * chose in the terminal, the print button, and Esc / `q` as the way back.
 */
const canvas = document.getElementById("matrix") as HTMLCanvasElement | null;
if (canvas) {
  const matrix = createMatrixRain(canvas);
  matrix.setEnabled(initialMatrixEnabled(profile.terminal.defaultMatrix));
  createThemeController(matrix, {
    defaultTheme: profile.terminal.defaultTheme,
    secretTheme: profile.commands?.system?.secretTheme,
  });
}

document.getElementById("printBtn")?.addEventListener("click", () => window.print());

leaveForTerminalOnKey();

/**
 * The language chip is a real link to the other locale's page, so it works
 * without JavaScript. This only records the choice, so returning to the
 * terminal finds it in the language you just picked.
 */
const chip = document.getElementById("langChip");
chip?.addEventListener("click", () => {
  const locale = chip.dataset["locale"];
  if (locale) writeStored(StorageKey.lang, locale);
});

/**
 * The portrait: any photo in portraits/ is drawn small, posterized, and
 * scaled back up with `image-rendering: pixelated`, so it reads as part of
 * the terminal without a fork pre-processing it.
 *
 * Progressive enhancement, deliberately. The prerendered <img> stays in the
 * DOM untouched — it is what crawlers and no-JS readers get, and it is what
 * *prints*: the print stylesheet hides the canvas and shows the source photo
 * again. Screen-vs-print is decided by CSS off the frame's class, never by
 * an inline style, so print can flip it without a fight.
 *
 * Every failure path leaves the <img> exactly as it was. The one that matters
 * is a `photo` on another origin: that taints the canvas and getImageData
 * throws.
 */
const GRID = 72; // logical pixels across — ~2.3 px blocks in the 168 px frame
const LEVELS = 6; // greys, evenly spaced from black to white

function pixelatePortrait(img: HTMLImageElement): void {
  try {
    const frame = img.parentElement;
    const canvas = document.createElement("canvas");
    canvas.width = GRID;
    canvas.height = GRID;
    const g = canvas.getContext("2d");
    if (!frame || !g) return;

    // Box-filter downscale is the pixelation; the browser does it for us.
    g.imageSmoothingEnabled = true;
    g.drawImage(img, 0, 0, GRID, GRID);
    const data = g.getImageData(0, 0, GRID, GRID);
    posterizeGray(data.data, LEVELS);
    g.putImageData(data, 0, 0);

    canvas.className = "avatar avatar-pixel";
    canvas.setAttribute("role", "img");
    canvas.setAttribute("aria-label", img.alt);
    img.after(canvas);
    frame.classList.add("is-pixelated");
  } catch {
    // Leave the <img> as it is.
  }
}

const avatar = document.querySelector<HTMLImageElement>("img.avatar");
// Opt-in: without `photoStyle: "pixel"` the <img> is served as uploaded.
if (avatar && profile.cv?.photoStyle === "pixel") {
  if (avatar.complete && avatar.naturalWidth > 0) pixelatePortrait(avatar);
  else avatar.addEventListener("load", () => pixelatePortrait(avatar), { once: true });
}
