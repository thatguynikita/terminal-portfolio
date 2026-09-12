import { defineCommand } from "../core/types";
import type { CommandContext, Mode } from "../core/types";
import type { Persona } from "../core/profile";

/** Accepts either the bare key (`recruiter`) or the full host. */
function resolvePersona(ctx: CommandContext, target: string): string | null {
  const wanted = target.trim().toLowerCase();
  for (const [key, persona] of Object.entries((ctx.profile.commands.ssh?.personas ?? {}))) {
    if (wanted === key.toLowerCase() || wanted === persona.host.toLowerCase()) return key;
  }
  return null;
}

function menu(ctx: CommandContext, persona: Persona): string {
  const rows = persona.qa
    .map(
      (item) =>
        `<tr><td class="accent">${ctx.escape(item.cmd)}</td><td>${ctx.escape(item.q[ctx.lang])}</td></tr>`
    )
    .join("");
  return (
    `<div>${ctx.escape(ctx.t("ssh.menuPrompt"))}</div>` +
    `<div class="dim">${ctx.escape(ctx.t("ssh.topics"))}</div>` +
    `<table class="tbl kv-tbl">${rows}</table>`
  );
}

function createPersonaMode(persona: Persona): Mode {
  return {
    name: "ssh",

    prompt: () => `${persona.host} <span class="path">~</span> $`,
    title: () => `${persona.host} — ssh — 80×24`,

    enter(ctx) {
      ctx.print(ctx.t("ssh.connected", { host: ctx.escape(persona.host) }));
      ctx.print(menu(ctx, persona));
    },

    async handle(ctx, input) {
      const lower = input.trim().toLowerCase();

      if (lower === "exit" || lower === "logout" || lower === "quit") {
        ctx.print(ctx.t("ssh.closing", { host: ctx.escape(persona.host) }));
        await ctx.exitMode();
        return;
      }

      // "ask why" and "why" are the same question.
      const normalized = lower.replace(/^ask\s+/, "").trim();
      const item = persona.qa.find((q) => q.cmd === normalized);

      if (item) {
        await ctx.sequence([
          { text: `<span class="accent">${ctx.escape(item.q[ctx.lang])}</span>` },
          { text: item.a[ctx.lang], typed: true },
          { text: ctx.t("ssh.askAnother") },
        ]);
        return;
      }

      if (lower === "help" || lower === "") {
        ctx.print(menu(ctx, persona));
        return;
      }

      ctx.print(
        ctx.t("ssh.unrecognized", { cmds: ctx.escape(persona.qa.map((q) => q.cmd).join(", ")) })
      );
    },

    chips(_ctx, input) {
      const options = [...persona.qa.map((q) => q.cmd), "exit"];
      const prefix = input.trim().toLowerCase();
      const matches = prefix ? options.filter((c) => c.startsWith(prefix)) : options;
      return matches.map((c) => ({ label: c, value: c }));
    },

    complete: () => [...persona.qa.map((q) => q.cmd), "help", "exit"],
  };
}

export default defineCommand({
  name: "ssh",
  usage: "<user@host>",
  order: 120,

  complete: (ctx) => Object.values((ctx.profile.commands.ssh?.personas ?? {})).map((p) => p.host),

  async run(ctx, args) {
    const target = args.raw.trim();
    const personas = (ctx.profile.commands.ssh?.personas ?? {});

    if (!target) {
      ctx.print(ctx.t("ssh.usage"));
      const hosts = Object.values(personas)
        .map((p) => `<span class="glow">${ctx.escape(p.host)}</span>`)
        .join(", ");
      ctx.print(ctx.t("ssh.knownHosts", { hosts }));
      return;
    }

    const key = resolvePersona(ctx, target);
    if (key) {
      const persona = personas[key] as Persona;
      // The handshake plays in shell mode, before the prompt changes.
      await ctx.sequence(
        ctx
          .tList("ssh.handshake", { host: ctx.escape(persona.host) })
          .map((line, i) => ({ text: `<span class="dim">${line}</span>`, delay: i === 0 ? 0 : 260 }))
      );
      await ctx.sleep(410);
      await ctx.enterMode(createPersonaMode(persona));
      return;
    }

    const count = ((ctx.state["sshFailCount"] as number) ?? 0) + 1;
    ctx.state["sshFailCount"] = count;

    const hint = Object.values(personas)[0]?.host ?? "";
    const key2 = count <= 2 ? "ssh.failFirst" : "ssh.failPersistent";
    const lines = ctx.tList(key2, { host: ctx.escape(target), count, hint: ctx.escape(hint) });
    const delays = count <= 2 ? [0, 380, 320, 320, 320, 380] : [0, 380, 400, 400, 450, 500];

    await ctx.sequence(lines.map((text, i) => ({ text, delay: delays[i] ?? 350 })));
  },
});
