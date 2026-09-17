import { defineCommand } from "../core/types.ts";

export default defineCommand({
  name: "pwd",
  hidden: true,
  run(ctx) {
    ctx.print(`/home/${ctx.escape(ctx.profile.terminal.handle)}`);
  },
});
