import { defineCommand } from "../core/types";

export default defineCommand({
  name: "hostname",
  hidden: true,
  run(ctx) {
    ctx.printText(ctx.profile.terminal.hostname);
  },
});
