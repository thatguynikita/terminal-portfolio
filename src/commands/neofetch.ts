import { defineCommand } from "../core/types";
import { applyNowPlaying, startNowPlaying } from "../core/nowplaying";

export default defineCommand({
  name: "neofetch",
  order: 40,
  run(ctx) {
    const { identity, terminal, neofetch, nowPlaying } = ctx.profile;

    const rows = neofetch.rows
      .map(
        (r) =>
          `<div><span class="nf-key">${ctx.escape(r.key[ctx.lang])}</span> ${r.value[ctx.lang]}</div>`
      )
      .join("");

    const playingRow = nowPlaying
      ? `<div class="np-row"><span class="nf-key">${ctx.escape(ctx.t("neofetch.playing"))}</span>` +
        `<span class="np-eq" aria-hidden="true"><span></span><span></span><span></span><span></span></span>` +
        `<span class="np-field"><span class="np-track">&hellip;</span></span></div>`
      : "";

    ctx.print(`<div class="neofetch">
      <div class="nf-art">${neofetch.ascii}</div>
      <div class="nf-info">
        <div><span class="nf-key accent">${ctx.escape(identity.handle)}</span>@<span class="accent">${ctx.escape(terminal.hostname)}</span></div>
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
