import { defineCommand } from "../core/types";
import { isLocale, LOCALES } from "../i18n/locales";

export default defineCommand({
  name: "lang",
  usage: "<code>",
  order: 160,
  complete: () => [...LOCALES],
  run(ctx, args) {
    const choice = (args.positional[0] ?? "").toLowerCase();
    const enabled = LOCALES;

    if (isLocale(choice) && enabled.includes(choice)) {
      ctx.setLang(choice);
      ctx.print(ctx.t("lang.set"));
      return;
    }
    ctx.print(ctx.t("lang.usage", { codes: enabled.join("|") }));
  },
});
