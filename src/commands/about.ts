import { defineCommand } from "../core/types";
import profile from "../../profile.config";

export default defineCommand({
  name: "about",
  order: 10,
  // No bio, no `about` — the command and about.txt go together.
  enabled: Boolean(profile.bio),
  async run(ctx) {
    // The first line is typed out; the rest print at once, which is what
    // makes the bio's own line breaks load-bearing.
    const lines = (ctx.profile.bio?.[ctx.lang] ?? "").split("\n");
    const [first, ...rest] = lines;
    if (first !== undefined) await ctx.type(first);
    ctx.printLines(rest.map(ctx.escape));
  },
});
