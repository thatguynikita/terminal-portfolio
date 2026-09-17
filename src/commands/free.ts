import { defineCommand } from "../core/types.ts";

export default defineCommand({
  name: "free",
  hidden: true,
  run(ctx) {
    ctx.table(
      ["", "total", "used", "free", "shared", "buff/cache", "available"],
      [
        ["Mem:", "16Gi", "11Gi", "512Mi", "128Mi", "4.3Gi", "4.8Gi"],
        ["Swap:", "8.0Gi", "7.9Gi", "100Mi", "", "", ""],
      ],
    );
    ctx.print(ctx.t("free.swapNote"));
  },
});
