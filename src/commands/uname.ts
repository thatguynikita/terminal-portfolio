import { defineCommand } from "../core/types.ts";
import { systemSince } from "../core/describe.ts";
import { unameStamp } from "./uptime.ts";

export default defineCommand({
  name: "uname",
  hidden: true,
  run(ctx, args) {
    if (!args.flags.has("a")) {
      ctx.print("Linux");
      return;
    }
    const host = ctx.escape(ctx.profile.terminal.hostname);
    const built = unameStamp(systemSince(ctx.profile));
    ctx.print(`Linux ${host} 6.6.0-sre #1 SMP PREEMPT ${built} x86_64 GNU/Linux`);
  },
});
