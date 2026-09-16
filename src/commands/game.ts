import { defineCommand } from "../core/types";
import profile from "../../profile.config";

/**
 * Shortcut for `sudo ./<game.script>` — same filesystem node, same exec.
 * Registered only when a game is configured, so `game` is command-not-found
 * on a fork without one rather than a command that does nothing.
 */
export default defineCommand({
  name: "game",
  hidden: true,
  enabled: Boolean(profile.commands?.game),
  run: (ctx) => ctx.runFile(ctx.profile.commands?.game?.script ?? "", { sudo: true }),
});
