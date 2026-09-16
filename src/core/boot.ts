import type { Terminal } from "./terminal";
import type { InputController } from "./input";
import { BOOTED_SESSION_KEY, readSession, writeSession } from "./storage";
import { parseArgs } from "./args";
import { animationsEnabled, sleep } from "./html";

const TITLE_DELAY = 380;
const BLANK_DELAY = 150;
const LINE_DELAY = 260;

/**
 * The boot sequence, then the terminal intro. The sequence is shown once
 * per session — a reload mid-session goes straight to the prompt.
 */
export async function boot(terminal: Terminal, input: InputController): Promise<void> {
  const { ctx } = terminal;
  const bootEl = document.getElementById("boot");
  const lines = ctx.tList("boot.lines", {
    host: ctx.profile.terminal.hostname,
    user: ctx.profile.terminal.handle,
  });

  const alreadyBooted = readSession(BOOTED_SESSION_KEY) === "1";

  // `terminal.bootScreen: false` also strips the #boot markup at build, so
  // this guard only matters for a shell that kept it. Same flag, both ways.
  if (bootEl && !alreadyBooted && ctx.profile.terminal.bootScreen) {
    if (animationsEnabled()) {
      let html = "";
      for (const [index, line] of lines.entries()) {
        html += `${line}\n`;
        bootEl.innerHTML = html;
        bootEl.scrollTop = bootEl.scrollHeight;
        await sleep(index === 0 ? TITLE_DELAY : line === "" ? BLANK_DELAY : LINE_DELAY);
      }
      await sleep(400);
    }
    writeSession(BOOTED_SESSION_KEY, "1");
  }

  bootEl?.classList.add("hidden");
  await intro(terminal, input);
}

/** The greeting shown after boot, and again after `exit`. */
export async function intro(terminal: Terminal, input: InputController): Promise<void> {
  const { ctx, registry } = terminal;

  // Reuse the real command rather than duplicating its rendering.
  const neofetch = registry.get("neofetch");
  if (neofetch) await neofetch.run(ctx, parseArgs(""));

  await ctx.sleep(200);
  await ctx.type(ctx.t("ui.welcome"), { cls: "dim", speed: 14 });
  await ctx.sleep(450);
  await ctx.type(ctx.t("ui.welcomeWhisper"), { cls: "dim", speed: 20 });
  ctx.print("&nbsp;");
  input.mount();
}
