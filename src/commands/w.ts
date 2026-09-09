import { defineCommand } from "../core/types";
import { nowDateTime, uptimeLine } from "./uptime";

export default defineCommand({
  name: "w",
  hidden: true,
  run(ctx) {
    ctx.printText(uptimeLine(2));
    const loginTime = nowDateTime().split(" ")[1] ?? "";
    ctx.table(
      ["USER", "TTY", "FROM", "LOGIN@", "IDLE", "WHAT"],
      [
        [
          ctx.escape(ctx.profile.identity.handle),
          "pts/0",
          ctx.escape(ctx.t("who.yourBrowser")),
          loginTime,
          "0.00s",
          "-ssh recruiter",
        ],
        ["nikita", "pts/1", ctx.escape(ctx.t("who.stillFixing")), "2019-03-11", "6y", "vim"],
      ]
    );
  },
});
