import RAW from "./.bashrc?raw";
import { defineFile } from "./define";
import { escapeHtml } from "../core/html";

/**
 * Layers on top of the plain `.bashrc` next to this file. That file is
 * still what `ls` measures; this only dims the comment lines when `cat`
 * prints them.
 */
export default defineFile({
  html: true,
  read: () =>
    RAW.replace(/\n$/, "")
      .split("\n")
      .map((line) =>
        line.trim().startsWith("#")
          ? `<span class="dim">${escapeHtml(line)}</span>`
          : escapeHtml(line)
      ),
});
