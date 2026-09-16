import { defineCommand } from "../core/types";
import { systemOwner } from "../core/describe";

/**
 * The POSIX locale for a UI language — `ru_RU`, `pt_BR`, `zh_CN`. Every
 * shipped catalogue is listed; anything else gets the language doubled,
 * which is what most of them are anyway.
 */
const REGIONS: Record<string, string> = {
  en: "US", ru: "RU", es: "ES", de: "DE", pt: "BR", fr: "FR", zh: "CN",
  ja: "JP", it: "IT", pl: "PL", uk: "UA", tr: "TR", ko: "KR",
};
export function posixLocale(lang: string): string {
  return `${lang}_${REGIONS[lang] ?? lang.toUpperCase()}`;
}

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
      ].map(ctx.escape)
    );
  },
});
