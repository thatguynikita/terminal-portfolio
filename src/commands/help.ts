import { defineCommand } from "../core/types";
import { commandDescription } from "../core/describe";

/**
 * Reads the registry, so it can never disagree with what actually runs.
 * The original kept a separate hand-maintained HELP list, which had
 * already drifted from the dispatcher by three commands.
 */
export default defineCommand({
  name: "help",
  order: 170,
  run(ctx) {
    ctx.print(`<span class="accent">${ctx.t("ui.availableCommands")}</span>`);

    const rows = ctx
      .commands()
      .filter((c) => !c.hidden)
      .map((command) => {
        // Names only — argument hints are surfaced by tab-completion and
        // the chip bar, so repeating them here just makes the table noisy.
        // `usage` still decides whether clicking the row leaves a trailing
        // space, ready for an argument.
        const fill = command.fill ?? (command.usage ? `${command.name} ` : command.name);
        const description = commandDescription(ctx.profile, ctx.lang, command.name);
        return (
          `<tr>` +
          `<td class="glow help-cmd" data-value="${ctx.escapeAttr(fill)}">${ctx.escape(command.name)}</td>` +
          `<td class="dim">${ctx.escape(description)}</td>` +
          `</tr>`
        );
      })
      .join("");

    ctx.print(`<table class="tbl kv-tbl">${rows}</table>`);
  },
});
