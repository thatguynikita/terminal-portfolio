import profile from "../../profile.config.ts";
import { skillsFor } from "../core/profile.ts";
import { defineCommand } from "../core/types.ts";

export default defineCommand({
  name: "skills",
  order: 20,
  // Nothing to list for the terminal, no command.
  enabled: skillsFor(profile, "terminal").length > 0,
  run(ctx) {
    ctx.kv(
      skillsFor(ctx.profile, "terminal").map((s) => [
        ctx.escape(s.key[ctx.lang]),
        ctx.escape(s.value),
      ]),
    );
  },
});
