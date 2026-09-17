import { defineCommand } from "../core/types.ts";

export default defineCommand({
  name: "clear",
  order: 180,
  run: (ctx) => ctx.clear(),
});
