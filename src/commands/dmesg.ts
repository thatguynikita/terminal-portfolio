import { defineCommand } from "../core/types.ts";

export default defineCommand({
  name: "dmesg",
  hidden: true,
  run(ctx) {
    ctx.printLines(
      ctx.tList("boot.lines", {
        host: ctx.profile.terminal.hostname,
        user: ctx.profile.terminal.handle,
      })
    );
  },
});
