import { defineCommand } from "../core/types.ts";

export default defineCommand({
  name: "echo",
  hidden: true,
  run(ctx, args) {
    ctx.printText(args.raw);
  },
});
