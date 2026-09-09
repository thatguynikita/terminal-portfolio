import { defineCommand } from "../core/types";

/** Shortcut for `sudo ./milk-quest.sh` — same filesystem node, same exec. */
export default defineCommand({
  name: "game",
  hidden: true,
  run: (ctx) => ctx.runFile("milk-quest.sh", { sudo: true }),
});
