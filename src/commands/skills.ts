import { defineCommand } from "../core/types";

export default defineCommand({
  name: "skills",
  order: 20,
  run(ctx) {
    ctx.kv(
      ctx.profile.skills.map((s) => [ctx.escape(s.key[ctx.lang]), ctx.escape(s.value)])
    );
  },
});
