import { defineCommand } from "../core/types.ts";
import type { CommandContext, SequenceStep } from "../core/types.ts";
import { unquote } from "../core/args.ts";

const COMMIT_HASHES = ["t3u4v5w", "a1b2c3d", "e4f5g6h", "h7i8j9k", "k1l2m3n", "n4o5p6q"];

/** Tool-call lines shown between the typed replies, as Claude Code does. */
const TOOL_LINES: Record<string, string[]> = {
  lightTheme1: [" ⎿  Read index.html"],
  lightTheme2: [" ⎿  Read theme.js", " ⎿  Read theme.css", " ⎿  Edit theme.css", " ⎿  Edit theme.js"],
  fixBug: [` ⎿  Searched for "bug"`],
  addTests: [` ⎿  Searched for "test"`],
  generic: [" ⎿  Read index.html"],
};

function typed(text: string, delay: number, cls?: string): SequenceStep {
  return cls ? { text, delay, typed: true, cls } : { text, delay, typed: true };
}

function tool(text: string, delay: number): SequenceStep {
  return { text: `<span class="dim">${text}</span>`, delay };
}

async function lightTheme(ctx: CommandContext): Promise<void> {
  const theme = ctx.theme.secretName;
  // With no secret theme configured there is nothing to ship, so every
  // attempt is the first: won't-fix, forever.
  const attempts = theme ? ((ctx.state["lightThemeAttempts"] as number) ?? 0) + 1 : 1;
  ctx.state["lightThemeAttempts"] = attempts;

  if (attempts === 1) {
    const [intro, found, flag, wontFix] = ctx.tList("claude.lightTheme1");
    await ctx.sequence([
      typed(intro ?? "", 750),
      tool(TOOL_LINES["lightTheme1"]?.[0] ?? "", 200),
      typed(found ?? "", 700),
      typed(flag ?? "", 350),
      typed(wontFix ?? "", 350),
    ]);
    return;
  }

  if (attempts === 2) {
    const lines = ctx.tList("claude.lightTheme2", { theme: theme ?? "" });
    const tools = TOOL_LINES["lightTheme2"] ?? [];
    await ctx.sequence([
      typed(lines[0] ?? "", 600),
      tool(tools[0] ?? "", 250),
      tool(tools[1] ?? "", 200),
      typed(lines[1] ?? "", 650),
      tool(tools[2] ?? "", 300),
      typed(lines[2] ?? "", 500),
      tool(tools[3] ?? "", 250),
      typed(lines[3] ?? "", 450),
      typed(lines[4] ?? "", 450),
      typed(lines[5] ?? "", 450),
    ]);
    ctx.theme.unlockSecret();
    await ctx.sequence([typed(lines[6] ?? "", 350)]);
    return;
  }

  const lines = ctx.tList("claude.lightTheme3", { theme: theme ?? "" });
  await ctx.sequence([typed(lines[0] ?? "", 500), typed(lines[1] ?? "", 400)]);
}

export default defineCommand({
  name: "claude",
  usage: "<prompt>",
  order: 130,

  complete: () => [
    "log --oneline",
    "--confess",
    `"add light theme"`,
    `"fix the bug"`,
    `"add tests"`,
  ],

  async run(ctx, args) {
    const input = args.raw.trim();
    const lower = input.toLowerCase();

    if (!input) {
      ctx.print(ctx.t("claude.version"));
      ctx.print(ctx.t("claude.usage"));
      return;
    }

    if (lower === "log --oneline" || lower === "log") {
      const messages = ctx.tList("claude.logCommits");
      messages.forEach((message, i) => {
        ctx.print(`<span class="dim">${COMMIT_HASHES[i] ?? ""}</span> ${ctx.escape(message)}`);
      });
      ctx.print(`<span class="dim">...</span>`);
      ctx.print(ctx.t("claude.logFooter"));
      return;
    }

    if (lower === "--confess" || lower === "confess") {
      await ctx.sequence([typed(ctx.t("claude.confess"), 500)]);
      return;
    }

    const prompt = unquote(input).toLowerCase();

    if (prompt === "add light theme") {
      await lightTheme(ctx);
      return;
    }

    if (prompt === "fix the bug") {
      const [line] = ctx.tList("claude.fixBug");
      await ctx.sequence([
        tool(TOOL_LINES["fixBug"]?.[0] ?? "", 750),
        typed(line ?? "", 700),
      ]);
      return;
    }

    if (prompt === "add tests") {
      const lines = ctx.tList("claude.addTests");
      await ctx.sequence([
        tool(TOOL_LINES["addTests"]?.[0] ?? "", 750),
        typed(lines[0] ?? "", 700),
        typed(lines[1] ?? "", 350),
      ]);
      return;
    }

    const lines = ctx.tList("claude.generic");
    await ctx.sequence([
      tool(TOOL_LINES["generic"]?.[0] ?? "", 750),
      typed(lines[0] ?? "", 700),
      { text: "...", delay: 400 },
      typed(lines[1] ?? "", 600),
      typed(lines[2] ?? "", 350, "dim"),
    ]);
  },
});
