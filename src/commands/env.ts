import { defineCommand } from "../core/types";

export default defineCommand({
  name: "env",
  aliases: ["printenv"],
  hidden: true,
  run(ctx) {
    const user = ctx.profile.identity.handle;
    ctx.printLines(
      [
        "SHELL=/bin/bash",
        "TERM=xterm-256color",
        `USER=${user}`,
        `HOME=/home/${user}`,
        `LANG=${ctx.lang}_US.UTF-8`,
        `PWD=/home/${user}`,
        "COFFEE_LEVEL=critical",
        "ON_CALL=true",
        "SLEEP_DEBT=considerable",
        "IMPOSTOR_SYNDROME=1",
        "PATH=/usr/local/bin:/usr/bin:/bin:/home/nikita/regrets",
      ].map(ctx.escape)
    );
  },
});
