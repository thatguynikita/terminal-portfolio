import RAW from "./.bashrc?raw";
import { defineFile } from "./define";
import { escapeHtml } from "../core/html";
import profile from "../../profile.config";

/**
 * Layers on top of the plain `.bashrc` next to this file, which supplies
 * every alias except one: the `game` alias names `game.script` from
 * profile.config.ts, so it's added here from config — and left out entirely
 * when no game is configured, rather than aliasing a file that doesn't
 * exist. The `alias` command reads through this descriptor, so it sees the
 * same lines `cat` does.
 *
 * `size` is set explicitly: the registry would otherwise measure the raw
 * file, which no longer contains the alias line.
 */
const lines = RAW.replace(/\n$/, "").split("\n");
if (profile.commands.game) lines.push(`alias game='sudo ./${profile.commands.game.script}'`);

const text = lines.join("\n");

export default defineFile({
  html: true,
  size: new TextEncoder().encode(text).length,
  read: () =>
    lines.map((line) =>
      line.trim().startsWith("#") ? `<span class="dim">${escapeHtml(line)}</span>` : escapeHtml(line)
    ),
});
