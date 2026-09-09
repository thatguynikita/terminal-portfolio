import { defineCommand } from "../core/types";
import { StorageKey, writeStored } from "../core/storage";

export default defineCommand({
  name: "matrix",
  usage: "<on|off>",
  order: 150,
  complete: () => ["on", "off"],
  run(ctx, args) {
    const choice = args.positional[0];
    if (choice !== "on" && choice !== "off") {
      ctx.print(ctx.t("matrix.usage"));
      return;
    }
    ctx.theme.matrix.setEnabled(choice === "on");
    writeStored(StorageKey.matrix, choice);
    ctx.print(ctx.t(choice === "on" ? "matrix.on" : "matrix.off"));
  },
});
