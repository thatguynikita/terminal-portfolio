import { defineCommand } from "../core/types";

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
        const fill = command.fill ?? (command.usage ? `${command.name} ` : command.name);
        const label = command.usage
          ? `${command.name} ${command.usage}`
          : command.name;
        const description = ctx.t(`commands.${command.name}`);
        return (
          `<tr>` +
          `<td class="glow help-cmd" data-value="${ctx.escapeAttr(fill)}">${ctx.escape(label)}</td>` +
          `<td class="dim">${ctx.escape(description)}</td>` +
          `</tr>`
        );
      })
      .join("");

    ctx.print(`<table class="tbl kv-tbl">${rows}</table>`);
  },
});
