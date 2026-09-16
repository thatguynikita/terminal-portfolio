import { defineCommand } from "../core/types";
import type { FsNode } from "../core/types";
import { systemSince } from "../core/describe";
import { lsStamp } from "./uptime";

function humanSize(bytes: number): string {
  if (bytes < 1024) return String(bytes);
  const units = ["K", "M", "G"];
  let value = bytes;
  let i = -1;
  do {
    value /= 1024;
    i++;
  } while (value >= 1024 && i < units.length - 1);
  return (value < 10 ? value.toFixed(1) : Math.round(value)) + (units[i] ?? "");
}

function displayName(node: FsNode, escape: (s: string) => string): string {
  const name = escape(node.name);
  return node.accent ? `<span class="accent">${name}</span>` : name;
}

export default defineCommand({
  name: "ls",
  aliases: ["ll"],
  order: 60,
  run(ctx, args) {
    // `ll` is `ls -l`; explicit flags still apply on top.
    const long = args.flags.has("l") || args.name === "ll";
    const all = args.flags.has("a");
    const human = args.flags.has("h");
    const files = ctx.fs.list({ all });
    const stamp = lsStamp(systemSince(ctx.profile));

    if (!long) {
      const names = files.map((f) => displayName(f, ctx.escape));
      if (all) names.unshift("..", ".");
      ctx.print(names.join("&nbsp;&nbsp;&nbsp;"));
      return;
    }

    let blocks = files.reduce((sum, f) => sum + Math.ceil(f.size / 512), 0);
    if (all) blocks += 2;
    ctx.print(ctx.t("ls.total", { n: blocks }));

    const owner = ctx.profile.terminal.handle;
    const row = (perms: string, links: number, size: number, name: string): void => {
      const sizeStr = (human ? humanSize(size) : String(size)).padStart(6);
      ctx.print(`${perms}  ${links} ${ctx.escape(owner)} staff ${sizeStr} ${stamp} ${name}`);
    };

    if (all) {
      row("drwxr-xr-x", 2, 160, ".");
      row("drwxr-xr-x", 3, 96, "..");
    }
    for (const file of files) {
      row(file.perms, 1, file.size, displayName(file, ctx.escape));
    }
  },
});
