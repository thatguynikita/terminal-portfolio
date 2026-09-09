import { defineCommand } from "../core/types";

export default defineCommand({
  name: "ps",
  hidden: true,
  run(ctx) {
    const guest = ctx.escape(ctx.profile.identity.handle);
    ctx.table(
      ["USER", "PID", "%CPU", "%MEM", "COMMAND"],
      [
        [guest, "1", "0.1", "0.2", "/sbin/init"],
        ["nikita", "42", "12.4", "3.1", "coffee.service"],
        ["nikita", "88", "87.2", "41.0", "cat_herder.py"],
        ["nikita", "101", "95.0", "8.4", "on_call_anxiety"],
        ["nikita", "137", "1.2", "0.5", "condensed_milk_watch"],
        ["nikita", "256", "23.9", "18.7", "kubernetes-cluster"],
        ["nikita", "404", "0.0", "0.0", "dreams_of_vacation &lt;defunct&gt;"],
        [guest, "999", "0.0", "0.1", "ps aux"],
      ]
    );
  },
});
