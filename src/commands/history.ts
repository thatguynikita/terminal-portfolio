import { defineCommand } from "../core/types.ts";

export default defineCommand({
  name: "history",
  order: 190,
  run(ctx) {
    ctx.history.forEach((entry, i) => {
      const index = String(i + 1).padStart(3);
      ctx.print(`<span class="dim">${index}</span>  ${ctx.escape(entry)}`);
    });
  },
});
