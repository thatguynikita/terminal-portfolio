import { defineCommand } from "../core/types.ts";

export default defineCommand({
  name: "exit",
  aliases: ["logout"],
  hidden: true,
  async run(ctx) {
    ctx.print(ctx.t("ui.loggingOut"));
    await ctx.sleep(500);
    ctx.clear();
    ctx.print(ctx.t("ui.connClosed", { host: ctx.profile.terminal.hostname }));
    await ctx.sleep(1400);
    ctx.clear();
    // Re-runs the greeting; the input row is remounted by the caller.
    await ctx.restart();
  },
});
