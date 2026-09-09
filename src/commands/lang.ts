import { defineCommand } from "../core/types";
import { isLocale } from "../i18n/locales";

export default defineCommand({
  name: "lang",
  usage: "<code>",
  order: 160,
  complete: (ctx) => [...ctx.profile.terminal.locales],
  run(ctx, args) {
    const choice = (args.positional[0] ?? "").toLowerCase();
    const enabled = ctx.profile.terminal.locales;

    if (isLocale(choice) && enabled.includes(choice)) {
      ctx.setLang(choice);
      ctx.print(ctx.t("lang.set"));
      return;
    }
    ctx.print(ctx.t("lang.usage", { codes: enabled.join("|") }));
  },
});
