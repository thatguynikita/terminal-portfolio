import { defineCommand } from "../core/types";
import type { CommandContext } from "../core/types";
import { scriptCandidates } from "../core/complete";

const DANGEROUS = new Set(["/", "/*", "~", "/home", "."]);

const WIPE_PATHS = [
  "/bin", "/boot", "/dev", "/etc", "/home/guest", "/lib", "/opt", "/proc",
  "/root", "/sbin", "/srv", "/sys", "/usr", "/var", "/home/guest/.bashrc",
  "/home/guest/dreams",
];

/**
 * `rm -rf /` and its many spellings: recursive AND force AND exactly one
 * root-ish target. Anything less doesn't earn the panic animation.
 */
function isCatastrophicRm(normalized: string): boolean {
  if (!normalized.startsWith("rm ")) return false;
  let recursive = false;
  let force = false;
  const targets: string[] = [];

  for (const token of normalized.slice(3).trim().split(/\s+/).filter(Boolean)) {
    if (token === "--recursive") recursive = true;
    else if (token === "--force") force = true;
    else if (token === "--no-preserve-root") continue;
    else if (/^-[rf]+$/.test(token)) {
      if (token.includes("r")) recursive = true;
      if (token.includes("f")) force = true;
    } else targets.push(token);
  }

  return recursive && force && targets.length === 1 && DANGEROUS.has(targets[0] as string);
}

async function panic(ctx: CommandContext): Promise<void> {
  document.body.classList.add("panic");
  await ctx.sequence(
    WIPE_PATHS.map((path, i) => ({
      text: ctx.t("sudo.removing", { path }),
      delay: i === 0 ? 0 : 300,
    }))
  );
  await ctx.sleep(1000);
  ctx.clear();
  await ctx.sleep(1500);
  document.body.classList.remove("panic");
  ctx.print(ctx.t("sudo.justKidding"));
  ctx.print(ctx.t("sudo.noHarm"));
  ctx.print(ctx.t("sudo.reported"));
}

export default defineCommand({
  name: "sudo",
  hidden: true,

  complete: (ctx) => scriptCandidates(ctx.fs.list({ all: true })),

  async run(ctx, args) {
    if (isCatastrophicRm(args.normalized)) {
      await panic(ctx);
      return;
    }

    // `sudo ./thing` runs an executable filesystem node with privileges.
    const target = args.positional[0];
    if (target?.startsWith("./")) {
      await ctx.runFile(target.slice(2), { sudo: true });
      return;
    }

    ctx.print(ctx.t("sudo.reported"));
  },
});
