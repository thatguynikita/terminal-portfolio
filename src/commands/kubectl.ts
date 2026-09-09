import { defineCommand } from "../core/types";
import { lookup } from "../i18n";

const POD_NAMES = [
  "cat-deployment-7f9d8c-x2m4q",
  "condensed-milk-store-0",
  "sre-sanity-canary",
  "deploy-friday-afternoon",
];

const DESCRIBE = "describe pod";

interface PodDetail {
  status: string;
  reason: string;
  events: string[];
}

export default defineCommand({
  name: "kubectl",
  usage: "<subcommand>",
  order: 100,

  complete(_ctx, partial) {
    if (partial.startsWith(DESCRIBE)) return POD_NAMES.map((n) => `${DESCRIBE} ${n}`);
    return ["get pods", `${DESCRIBE} `];
  },

  // Trims the "describe pod " prefix off pod-name candidates so the chips
  // read as bare names. The bare prefix candidate matches too and trims to
  // nothing, so fall back to it rather than emitting an empty label.
  completeLabel: (candidate) =>
    candidate.startsWith(`${DESCRIBE} `)
      ? candidate.slice(DESCRIBE.length + 1) || candidate
      : candidate,

  run(ctx, args) {
    const sub = args.normalized;

    if (sub === "get pods" || sub === "get pod") {
      ctx.table(ctx.tList("kubectl.header"), [
        ["cat-deployment-7f9d8c-x2m4q", "1/1", ctx.t("kubectl.running"), "11y"],
        ["condensed-milk-store-0", "0/1", "CrashLoopBackOff", "3m"],
        ["sre-sanity-canary", "1/1", ctx.t("kubectl.running"), ctx.t("kubectl.justBarely")],
        ["deploy-friday-afternoon", "0/1", "Evicted", "2m"],
      ]);
      return;
    }

    if (sub.startsWith(DESCRIBE)) {
      const pod = args.raw.trim().slice(sub.indexOf(DESCRIBE) + DESCRIBE.length).trim();
      if (!pod) {
        ctx.print(ctx.t("kubectl.describeUsage"));
        return;
      }
      const detail = lookup(ctx.lang, `kubectl.pods.${pod}`) as PodDetail | undefined;
      if (!detail) {
        ctx.print(ctx.t("kubectl.notFound", { pod: ctx.escape(pod) }));
        return;
      }
      ctx.print(`<div><span class="accent">Name:</span> ${ctx.escape(pod)}</div>`);
      ctx.print(`<div><span class="accent">Status:</span> ${ctx.escape(detail.status)}</div>`);
      ctx.print(
        `<div><span class="accent">${ctx.t("kubectl.reason")}:</span> ${ctx.escape(detail.reason)}</div>`
      );
      ctx.print(`<div><span class="accent">Restarts:</span> ${pod === "condensed-milk-store-0" ? "47" : "0"}</div>`);
      ctx.print(`<div class="dim">${ctx.t("kubectl.events")}:</div>`);
      for (const event of detail.events) ctx.print(`<div class="dim">  ${ctx.escape(event)}</div>`);
      return;
    }

    if (!sub) {
      ctx.print(ctx.t("kubectl.intro"));
      ctx.print(ctx.t("kubectl.subcommands"));
      return;
    }

    ctx.print(ctx.t("kubectl.unknown", { cmd: ctx.escape(args.raw.trim()) }));
  },
});
