import type { CommandContext } from "./types.ts";
import { escapeHtml } from "./html.ts";

/**
 * The "Playing" row inside the neofetch card.
 *
 * `undefined` = backend unreachable, `null` = nothing playing,
 * a string = "track — artist".
 */
let latest: string | null | undefined;
let trackUrl: string | null = null;
let started = false;

export function applyNowPlaying(ctx: CommandContext): void {
  document.querySelectorAll<HTMLElement>(".np-track").forEach((trackEl) => {
    const wrap = trackEl.parentElement;
    const row = trackEl.closest(".np-row");
    const playing = typeof latest === "string";

    const text =
      latest === undefined
        ? ctx.t("neofetch.offline")
        : latest === null
          ? ctx.t("neofetch.idle")
          : latest;

    if (playing && trackUrl) {
      trackEl.innerHTML = `<a href="${ctx.escapeAttr(trackUrl)}" target="_blank" rel="noopener">${escapeHtml(text)}</a>`;
    } else {
      trackEl.textContent = text;
    }

    row?.classList.toggle("playing", playing);

    // Marquee only when the title actually overflows its box.
    wrap?.classList.remove("scrolling");
    requestAnimationFrame(() => {
      if (wrap && trackEl.scrollWidth > wrap.clientWidth) wrap.classList.add("scrolling");
    });
  });
}

interface NowPlayingResponse {
  is_playing?: boolean;
  track?: string;
  artist?: string;
  url?: string;
}

/** Starts polling. Safe to call repeatedly; only the first call takes. */
export function startNowPlaying(ctx: CommandContext): void {
  const config = ctx.profile.neofetch?.nowPlaying;
  if (started || !config?.endpoint) return;
  started = true;

  const poll = async (): Promise<void> => {
    try {
      const res = await fetch(config.endpoint, { cache: "no-store" });
      const data = (await res.json()) as NowPlayingResponse;
      if (data.is_playing && data.track) {
        latest = `${data.track} — ${data.artist ?? ""}`.trim();
        trackUrl =
          data.url ??
          `https://open.spotify.com/search/${encodeURIComponent(`${data.track} ${data.artist ?? ""}`)}`;
      } else {
        latest = null;
        trackUrl = null;
      }
    } catch {
      latest = undefined;
      trackUrl = null;
    }
    applyNowPlaying(ctx);
  };

  void poll();
  setInterval(() => void poll(), config.pollMs);
}
