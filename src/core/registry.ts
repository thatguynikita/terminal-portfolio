import type { Command } from "./types";
import type { ProfileConfig } from "./profile";

/**
 * Command registry.
 *
 * Every module in `src/commands/` is picked up automatically — adding a
 * command is one new file, with nothing else to register. `help`, the
 * chips bar and Tab-completion all read from here, which is what keeps
 * them from drifting apart.
 */
const modules = import.meta.glob("../commands/*.ts", {
  eager: true,
  import: "default",
}) as Record<string, Command>;

export interface Registry {
  /** Every enabled command, in help order. */
  all(): Command[];
  /** Enabled and not hidden — what `help` and completion show. */
  visible(): Command[];
  /** Resolve a name or alias. */
  get(name: string): Command | undefined;
  /** Names of visible commands, for first-word completion. */
  names(): string[];
}

function sortCommands(a: Command, b: Command): number {
  const ao = a.order ?? Number.MAX_SAFE_INTEGER;
  const bo = b.order ?? Number.MAX_SAFE_INTEGER;
  if (ao !== bo) return ao - bo;
  return a.name.localeCompare(b.name);
}

export function loadCommands(): Command[] {
  return Object.values(modules).filter(Boolean).sort(sortCommands);
}

export function createRegistry(profile: ProfileConfig): Registry {
  const { enabledCommands, disabledCommands } = profile.terminal;
  const allow = enabledCommands ? new Set(enabledCommands) : null;
  const deny = new Set(disabledCommands ?? []);

  const commands = loadCommands().filter(
    (c) => c.enabled !== false && (!allow || allow.has(c.name)) && !deny.has(c.name)
  );

  const byName = new Map<string, Command>();
  for (const command of commands) {
    byName.set(command.name, command);
    for (const alias of command.aliases ?? []) byName.set(alias, command);
  }

  return {
    all: () => commands,
    visible: () => commands.filter((c) => !c.hidden),
    get: (name) => byName.get(name.toLowerCase()),
    names: () => commands.filter((c) => !c.hidden).map((c) => c.name),
  };
}
