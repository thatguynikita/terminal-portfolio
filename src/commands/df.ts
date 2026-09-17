import { defineCommand } from "../core/types.ts";

export default defineCommand({
  name: "df",
  hidden: true,
  run(ctx) {
    ctx.table(
      ["Filesystem", "Size", "Used", "Avail", "Use%", "Mounted on"],
      [
        ["/dev/coffee", "16G", "16G", "0", "100%", "/"],
        ["overlay", "64G", "61G", "3G", "95%", "/var/lib/regrets"],
        ["/dev/condensed-milk", "30 cans", "30 cans", "0", "100%", "/home/cat"],
        ["tmpfs", "2.0G", "1.1M", "2.0G", "1%", "/run"],
      ]
    );
  },
});
