import { defineCommand } from "../core/types.ts";
import { nowDateTime } from "./uptime.ts";
import { systemOwner } from "../core/describe.ts";

export default defineCommand({
  name: "who",
  hidden: true,
  run(ctx) {
    const guest = ctx.profile.terminal.handle.padEnd(8);
    ctx.printText(`${guest} pts/0        ${nowDateTime()} (${ctx.t("who.yourBrowser")})`);
    const owner = systemOwner(ctx.profile).padEnd(8);
    ctx.printText(`${owner} pts/1        2019-03-11 03:14 (${ctx.t("who.stillFixing")})`);
  },
});
