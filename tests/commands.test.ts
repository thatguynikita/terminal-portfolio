import { describe, expect, it } from "vitest";
import { loadCommands } from "../src/core/registry";
import { LOCALES } from "../src/i18n/locales";
import { createFakeContext, withNodes, args } from "./helpers";
import profile from "../profile.config";

const profileHandle = profile.identity.handle;
import type { FsNode } from "../src/core/types";

const commands = loadCommands();

/** Enough of a filesystem for `cat`, `alias` and `ls` to have something to do. */
function fixtureNodes(): FsNode[] {
  return [
    {
      name: ".bashrc",
      perms: "-rw-r--r--",
      hidden: true,
      accent: false,
      size: 20,
      read: () => ["# ~/.bashrc", "alias ll='ls -l'"],
    },
    {
      name: "notes.txt",
      perms: "-rw-r--r--",
      hidden: false,
      accent: false,
      size: 12,
      read: () => ["hello"],
    },
    {
      name: "run.sh",
      perms: "-rwxr--r--",
      hidden: false,
      accent: true,
      size: 8,
      read: () => null,
      exec: () => undefined,
      requiresSudo: true,
    },
  ];
}

describe("commands", () => {
  for (const locale of LOCALES) {
    describe(`locale ${locale}`, () => {
      for (const command of commands) {
        it(`${command.name} runs without throwing`, async () => {
          const ctx = createFakeContext(locale);
          withNodes(ctx, fixtureNodes());
          await command.run(ctx, args("", command.name));
          // A mode-entering command leaves a mode active; close it so the
          // fake context isn't left with a live interval.
          if (ctx.mode) await ctx.exitMode();
        });
      }
    });
  }

  it("produces output for the commands that should always say something", async () => {
    const always = ["about", "skills", "contact", "neofetch", "whoami", "fortune", "help", "ls"];
    for (const name of always) {
      const command = commands.find((c) => c.name === name);
      expect(command, `${name} is missing`).toBeDefined();
      const ctx = createFakeContext("en");
      withNodes(ctx, fixtureNodes());
      ctx.commands = () => commands;
      await command!.run(ctx, args("", name));
      expect(ctx.lines.join("").trim(), `${name} printed nothing`).not.toBe("");
    }
  });

  it("completion candidates are strings and never empty", async () => {
    for (const command of commands) {
      if (!command.complete) continue;
      const ctx = createFakeContext("en");
      withNodes(ctx, fixtureNodes());
      for (const candidate of command.complete(ctx, "")) {
        expect(typeof candidate).toBe("string");
        expect(candidate.length).toBeGreaterThan(0);
      }
    }
  });

  it("help lists bare command names, with click-to-fill still argument-aware", async () => {
    const help = commands.find((c) => c.name === "help")!;
    const ctx = createFakeContext("en");
    ctx.commands = () => commands;
    await help.run(ctx, args("", "help"));

    const cells = [...ctx.root.querySelectorAll<HTMLElement>(".help-cmd")];
    expect(cells.length).toBeGreaterThan(0);

    for (const cell of cells) {
      const name = cell.textContent ?? "";
      // No "<file>" / "<subcommand>" hints in the visible label.
      expect(name, `"${name}" should be a bare command name`).not.toContain("<");
      expect(name.trim()).toBe(name);

      const command = commands.find((c) => c.name === name)!;
      expect(command, `help listed an unknown command "${name}"`).toBeDefined();
      // A command taking an argument still fills with a trailing space.
      const fill = cell.dataset["value"] ?? "";
      expect(fill).toBe(command.usage ? `${name} ` : name);
    }
  });

  it("cat reports a missing file rather than throwing", async () => {
    const cat = commands.find((c) => c.name === "cat")!;
    const ctx = createFakeContext("en");
    withNodes(ctx, fixtureNodes());
    await cat.run(ctx, args("ghost.txt", "cat"));
    expect(ctx.lines.join(" ")).toContain("ghost.txt");
  });

  it("cat tells you how to open a file it cannot print", async () => {
    const cat = commands.find((c) => c.name === "cat")!;
    const ctx = createFakeContext("en");
    withNodes(ctx, [
      {
        name: "thing.bin",
        perms: "-rwxr--r--",
        hidden: false,
        accent: true,
        size: 10,
        read: () => null,
        hint: () => "— use <b>open</b> instead",
      },
    ]);
    await cat.run(ctx, args("thing.bin", "cat"));
    const out = ctx.lines.join(" ");
    expect(out).toContain("thing.bin");
    expect(out, "the hint was not shown").toContain("use open instead");
  });

  it("says nothing extra for a non-text file with no hint", async () => {
    const cat = commands.find((c) => c.name === "cat")!;
    const ctx = createFakeContext("en");
    withNodes(ctx, [
      { name: "x.bin", perms: "-rw-r--r--", hidden: false, accent: false, size: 1, read: () => null },
    ]);
    await cat.run(ctx, args("x.bin", "cat"));
    expect(ctx.lines.join(" ").trim()).toBe("cat: x.bin: not a text file");
  });

  it("ll behaves as ls -l", async () => {
    const ls = commands.find((c) => c.name === "ls")!;
    expect(ls.aliases).toContain("ll");
    const ctx = createFakeContext("en");
    withNodes(ctx, fixtureNodes());
    await ls.run(ctx, args("", "ll"));
    // The long format prints a "total" header; the short one does not.
    expect(ctx.lines[0]).toMatch(/total/i);
  });
});

/**
 * `ps`, `who`, `w` and `env` all show a second account — the machine's
 * owner — which used to be hardcoded as one person's name.
 */
describe("system owner", () => {
  const OWNERED = ["ps", "who", "w", "env"];

  const render = async (name: string, overrides = {}): Promise<string> => {
    const command = commands.find((c) => c.name === name)!;
    const ctx = createFakeContext("en", overrides);
    withNodes(ctx, fixtureNodes());
    await command.run(ctx, args("", name));
    return ctx.lines.join("\n");
  };

  it("uses the configured owner, and never a hardcoded name", async () => {
    const config = { commands: { system: { owner: "ada" } } };
    for (const name of OWNERED) {
      const out = await render(name, config);
      expect(out, `${name} does not show the configured owner`).toContain("ada");
      expect(out.toLowerCase(), `${name} still hardcodes a name`).not.toContain("nikita");
    }
  });

  it("still shows the visitor alongside the owner", async () => {
    const config = { commands: { system: { owner: "ada" } } };
    for (const name of ["ps", "who", "w"]) {
      const out = await render(name, config);
      expect(out, `${name} lost the visitor account`).toContain(profileHandle);
    }
  });

  it("falls back to root when no owner is configured", async () => {
    for (const name of OWNERED) {
      const out = await render(name, { commands: {} });
      expect(out, `${name} has no owner fallback`).toContain("root");
    }
  });

  it("puts the owner in env's PATH rather than a fixed home directory", async () => {
    const out = await render("env", { commands: { system: { owner: "ada" } } });
    expect(out).toContain("/home/ada/regrets");
  });
});
