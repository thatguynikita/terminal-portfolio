import { defineCommand } from "../core/types";

export default defineCommand({
  name: "clear",
  order: 180,
  run: (ctx) => ctx.clear(),
});
