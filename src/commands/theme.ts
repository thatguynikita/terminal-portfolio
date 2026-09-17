import { defineCommand } from "../core/types.ts";

export default defineCommand({
  name: "theme",
  usage: "<name>",
  order: 140,
  complete: (ctx) => ctx.theme.list(),
  run(ctx, args) {
    const name = args.positional[0] ?? "";
    if (ctx.theme.set(name)) {
      ctx.print(ctx.t("theme.set", { name: ctx.escape(name) }));
      return;
    }
    ctx.print(ctx.t("theme.usage", { names: ctx.theme.list().join("|") }));
  },
});
