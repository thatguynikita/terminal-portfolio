import { describe, expect, it } from "vitest";
import { loadCommands } from "../src/core/registry";
import { LOCALES } from "../src/i18n/locales";
import { commandDescription } from "../src/core/describe";
import profile from "../profile.config";

const commands = loadCommands();

describe("registry", () => {
  it("discovers every command module", () => {
    expect(commands.length).toBeGreaterThan(30);
  });

  it("has no duplicate names or aliases", () => {
    const seen = new Map<string, string>();
    for (const command of commands) {
      for (const name of [command.name, ...(command.aliases ?? [])]) {
        expect(seen.has(name), `"${name}" is claimed by both ${seen.get(name)} and ${command.name}`).toBe(false);
        seen.set(name, command.name);
      }
    }
  });

  it("uses lowercase names, since dispatch lowercases input", () => {
    for (const command of commands) {
      expect(command.name).toBe(command.name.toLowerCase());
      for (const alias of command.aliases ?? []) expect(alias).toBe(alias.toLowerCase());
    }
  });

  // This is what keeps `help` from drifting away from what actually runs.
  // Either source counts: the message catalogue, or a profile.commands
  // override.
  it("has help text for every visible command in every enabled locale", () => {
    const missing: string[] = [];
    for (const command of commands.filter((c) => !c.hidden)) {
      for (const locale of LOCALES) {
        if (commandDescription(profile, locale, command.name).trim() === "") {
          missing.push(`${locale}/${command.name}`);
        }
      }
    }
    expect(missing).toEqual([]);
  });

  it("only overrides descriptions for commands that exist", () => {
    const names = new Set(commands.map((c) => c.name));
    for (const name of Object.keys(profile.commands?.descriptions ?? {})) {
      expect(names, `profile.commands describes unknown command "${name}"`).toContain(name);
    }
  });

  it("only references commands that exist in the config's enable/disable lists", () => {
    const names = new Set(commands.map((c) => c.name));
    for (const name of profile.terminal.enabledCommands ?? []) expect(names).toContain(name);
    for (const name of profile.terminal.disabledCommands ?? []) expect(names).toContain(name);
  });
});
