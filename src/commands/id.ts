import { defineCommand } from "../core/types";

export default defineCommand({
  name: "id",
  hidden: true,
  run(ctx) {
    const user = ctx.escape(ctx.profile.identity.handle);
    ctx.print(`uid=1000(${user}) gid=1000(${user}) groups=1000(${user})`);
  },
});
