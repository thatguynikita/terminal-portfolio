import { systemOwner } from "../core/describe.ts";
import { defineCommand } from "../core/types.ts";
import { posixLocale } from "../i18n/locales.ts";

export default defineCommand({
  name: "env",
  aliases: ["printenv"],
  hidden: true,
  run(ctx) {
    const user = ctx.profile.terminal.handle;
    const owner = systemOwner(ctx.profile);
    ctx.printLines(
      [
        "SHELL=/bin/bash",
        "TERM=xterm-256color",
        `USER=${user}`,
        `HOME=/home/${user}`,
        `LANG=${posixLocale(ctx.lang)}.UTF-8`,
        `PWD=/home/${user}`,
        "COFFEE_LEVEL=critical",
        "ON_CALL=true",
        "SLEEP_DEBT=considerable",
        "IMPOSTOR_SYNDROME=1",
        `PATH=/usr/local/bin:/usr/bin:/bin:/home/${owner}/regrets`,
      ].map(ctx.escape),
    );
  },
});
