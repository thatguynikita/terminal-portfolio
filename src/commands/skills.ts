import { defineCommand } from "../core/types";
import { skillsFor } from "../core/profile";

export default defineCommand({
  name: "skills",
  order: 20,
  run(ctx) {
    ctx.kv(
      skillsFor(ctx.profile, "terminal").map((s) => [
        ctx.escape(s.key[ctx.lang]),
        ctx.escape(s.value),
      ])
    );
  },
});
