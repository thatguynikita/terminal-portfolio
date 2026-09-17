import { defineCommand } from "../core/types.ts";
import type { CommandContext, Mode } from "../core/types.ts";

const REFRESH_MS = 1200;

function rows(ctx: CommandContext): string[][] {
  const running = ctx.t("top.running");
  const sleeping = ctx.t("top.sleeping");
  const zombie = ctx.t("top.zombie");
  const rand = (base: number, spread: number): string => (base + Math.random() * spread).toFixed(1);
  return [
    ["1", "coffee.service", rand(10, 10), rand(2, 3), running],
    ["2", "cat_herder.py", rand(70, 20), rand(30, 15), running],
    ["3", "on_call_anxiety", rand(95, 4), rand(8, 6), running],
    ["4", "condensed_milk_watch", rand(1, 4), rand(0.5, 1), sleeping],
    ["5", "kubernetes-cluster", rand(15, 15), rand(10, 10), running],
    ["6", "dreams_of_vacation", "0.0", "0.0", zombie],
  ];
}

function tableHtml(ctx: CommandContext): string {
  const header = ctx.tList("top.header");
  const head = `<tr>${header.map((h) => `<td class="accent">${ctx.escape(h)}</td>`).join("")}</tr>`;
  const body = rows(ctx)
    .map((row) => `<tr>${row.map((v) => `<td>${ctx.escape(v)}</td>`).join("")}</tr>`)
    .join("");
  return `<table class="tbl">${head}${body}</table>`;
}

/** A live-refreshing view that owns the input line until you quit. */
function createTopMode(): Mode {
  let container: HTMLElement | null = null;
  let timer: ReturnType<typeof setInterval> | null = null;

  return {
    name: "top",

    prompt: (ctx) => `<span class="dim">${ctx.t("top.promptLabel")}</span>`,

    title: (ctx) =>
      `${ctx.profile.terminal.handle}@${ctx.profile.terminal.hostname} — top — 80×24`,

    enter(ctx) {
      container = ctx.print(tableHtml(ctx));
      ctx.print(ctx.t("top.quitHint"));
      timer = setInterval(() => {
        if (container) container.innerHTML = tableHtml(ctx);
      }, REFRESH_MS);
    },

    handle(ctx, input) {
      const cmd = input.trim().toLowerCase();
      if (cmd === "q" || cmd === "exit" || cmd === "quit") return ctx.exitMode();
      ctx.print(ctx.t("top.quitHintPlain"));
    },

    exit(ctx) {
      if (timer) clearInterval(timer);
      timer = null;
      container = null;
      ctx.print(ctx.t("top.exited"));
    },

    chips: (ctx) => [{ label: ctx.t("top.chipQuit"), value: "q" }],

    complete: () => [],

    // A bare `q` quits, without needing Enter.
    onKey: (_ctx, e) => e.key === "q" || e.key === "Q",
  };
}

export default defineCommand({
  name: "top",
  order: 90,
  run: (ctx) => ctx.enterMode(createTopMode()),
});
