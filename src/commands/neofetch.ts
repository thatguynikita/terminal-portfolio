import profile from "../../profile.config.ts";
import { applyNowPlaying, startNowPlaying } from "../core/nowplaying.ts";
import { defineCommand } from "../core/types.ts";

export default defineCommand({
  name: "neofetch",
  enabled: Boolean(profile.neofetch),
  order: 40,
  run(ctx) {
    // Registered only when a card is configured; the guard is for the types.
    const { terminal, neofetch } = ctx.profile;
    if (!neofetch) return;
    const { nowPlaying } = neofetch;

    // Values are prose, escaped like prose; the amber highlight is a flag on
    // the row, not markup in the config.
    const rows = neofetch.rows
      .map((r) => {
        const value = ctx.escape(r.value[ctx.lang]);
        const shown = r.highlight ? `<span class="amber">${value}</span>` : value;
        return `<div><span class="nf-key">${ctx.escape(r.key[ctx.lang])}</span> ${shown}</div>`;
      })
      .join("");

    const playingRow = nowPlaying
      ? `<div class="np-row"><span class="nf-key">${ctx.escape(ctx.t("neofetch.playing"))}</span>` +
        `<span class="np-eq" aria-hidden="true"><span></span><span></span><span></span><span></span></span>` +
        `<span class="np-field"><span class="np-track">&hellip;</span></span></div>`
      : "";

    ctx.print(`<div class="neofetch">
      <div class="nf-art">${neofetch.ascii}</div>
      <div class="nf-info">
        <div><span class="nf-key accent">${ctx.escape(terminal.handle)}</span>@<span class="accent">${ctx.escape(terminal.hostname)}</span></div>
        <div class="dim">--------------------</div>
        ${rows}
        ${playingRow}
      </div>
    </div>`);

    if (nowPlaying) {
      startNowPlaying(ctx);
      // The row was only just inserted, so fill it on the next tick.
      setTimeout(() => applyNowPlaying(ctx), 0);
    }
  },
});
