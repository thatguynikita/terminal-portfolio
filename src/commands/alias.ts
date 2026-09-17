import { defineCommand } from "../core/types.ts";

/**
 * Reads the aliases straight out of `.bashrc` rather than keeping a
 * second copy of the list — edit that file and both stay in step.
 */
export default defineCommand({
  name: "alias",
  hidden: true,
  run(ctx) {
    const lines = ctx.fs.read(".bashrc") ?? [];
    const aliases = lines.filter((line) => line.includes("alias "));
    ctx.printLines(aliases.length > 0 ? aliases : lines);
  },
});
