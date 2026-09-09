import { defineCommand } from "../core/types";

export default defineCommand({
  name: "pwd",
  hidden: true,
  run(ctx) {
    ctx.print(`/home/${ctx.escape(ctx.profile.identity.handle)}`);
  },
});
