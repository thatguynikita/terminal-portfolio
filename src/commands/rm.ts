import { defineCommand } from "../core/types.ts";

export default defineCommand({
  name: "rm",
  hidden: true,
  run(ctx, args) {
    const target = args.positional.at(-1);
    if (!target) {
      ctx.print(ctx.t("rm.missingOperand"));
      return;
    }
    ctx.print(ctx.t("rm.denied", { file: ctx.escape(target) }));
  },
});
