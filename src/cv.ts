import "./styles/base.css";
import "./styles/cv.css";

import profile from "../profile.config";
import { createMatrixRain } from "./core/matrix";
import { createThemeController } from "./core/theme";
import { StorageKey, writeStored, readStored } from "./core/storage";

/**
 * The CV's only client-side JavaScript. Everything the page says is
 * already in the HTML — this adds the background, the theme the visitor
 * chose in the terminal, and the print button.
 */
const canvas = document.getElementById("matrix") as HTMLCanvasElement | null;
if (canvas) {
  const matrix = createMatrixRain(canvas);
  matrix.setEnabled(readStored(StorageKey.matrix) !== "off");
  createThemeController(matrix, { defaultTheme: profile.terminal.defaultTheme });
}

document.getElementById("printBtn")?.addEventListener("click", () => window.print());

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
