import { defineFile } from "./define";
import { openGame } from "../core/game";

/**
 * Executable, and gated behind sudo — `./milk-quest.sh` is denied,
 * `sudo ./milk-quest.sh` runs it. The `game` command is a shortcut that
 * runs this same node.
 */
export default defineFile({
  html: true,
  accent: true,
  read: (ctx) =>
    ctx.tList("files.milkQuest", { url: ctx.profile.game?.url ?? "" }).map(
      (line) => `<span class="dim">${line}</span>`
    ),
  requiresSudo: true,
  exec: (ctx) => {
    ctx.print(ctx.t("exec.launchingGame", { title: ctx.profile.game?.title ?? "" }));
    openGame();
  },
});
