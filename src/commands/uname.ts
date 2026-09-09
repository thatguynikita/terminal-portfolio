import { defineCommand } from "../core/types";

export default defineCommand({
  name: "uname",
  hidden: true,
  run(ctx, args) {
    if (!args.flags.has("a")) {
      ctx.print("Linux");
      return;
    }
    const host = ctx.escape(ctx.profile.terminal.hostname);
    ctx.print(
      `Linux ${host} 6.6.0-sre #1 SMP PREEMPT Sun Aug 9 20:48:27 UTC 2026 x86_64 GNU/Linux`
    );
  },
});
