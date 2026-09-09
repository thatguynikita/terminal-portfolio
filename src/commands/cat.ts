import { defineCommand } from "../core/types";

export default defineCommand({
  name: "cat",
  usage: "<file>",
  order: 70,

  complete(ctx, partial) {
    // Dotfiles only offer themselves once you've typed the leading dot.
    const all = ctx.fs.list({ all: true }).map((f) => f.name);
    return partial.startsWith(".") ? all : all.filter((n) => !n.startsWith("."));
  },

  run(ctx, args) {
    const target = args.positional[0];
    if (!target) {
      ctx.print(ctx.t("cat.usage"));
      return;
    }

    // `cat ./thing` and `cat thing` are the same file.
    const name = target.replace(/^\.\//, "");
    const lines = ctx.fs.read(name);

    if (lines === undefined) {
      ctx.print(ctx.t("cat.noFile", { file: ctx.escape(target) }));
      return;
    }
    if (lines === null) {
      ctx.print(ctx.t("cat.notText", { file: ctx.escape(target) }));
      return;
    }
    ctx.printLines(lines);
  },
});
