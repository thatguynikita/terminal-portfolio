import { pick } from "../core/html.ts";
import { defineCommand } from "../core/types.ts";

export default defineCommand({
  name: "fortune",
  order: 80,
  run(ctx) {
    const fortunes = ctx.tList("fortunes");
    if (fortunes.length === 0) return;
    ctx.print(`<span class="glow">${ctx.escape(pick(fortunes))}</span>`);
  },
});
