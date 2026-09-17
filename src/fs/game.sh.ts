import profile from "../../profile.config.ts";
import { openGame } from "../core/game.ts";
import { defineFile } from "./define.ts";

/**
 * The game's launcher. Its filename is `game.script` from profile.config.ts
 * — this module's own name decides nothing, which is why it isn't called
 * after any particular game.
 *
 * Executable, and gated behind sudo — `./<script>` is denied,
 * `sudo ./<script>` runs it. The `game` command is a shortcut that runs
 * this same node. Absent entirely when no `game` is configured.
 */
export default defineFile({
  enabled: Boolean(profile.commands?.game),
  name: profile.commands?.game?.script ?? "game.sh",
  html: true,
  accent: true,
  read: (ctx) =>
    ctx
      .tList("files.game", {
        url: ctx.profile.commands?.game?.url ?? "",
        script: ctx.profile.commands?.game?.script ?? "",
      })
      .map((line) => `<span class="dim">${line}</span>`),
  requiresSudo: true,
  exec: (ctx) => {
    ctx.print(
      ctx.t("exec.launchingGame", { title: ctx.profile.commands?.game?.title[ctx.lang] ?? "" }),
    );
    openGame();
  },
});
