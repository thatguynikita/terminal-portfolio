import { describe, expect, it } from "vitest";
import { loadCommands } from "../src/core/registry";
import { LOCALES } from "../src/i18n/locales";
import { createFakeContext, withNodes, args } from "./helpers";
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

  it("cat reports a missing file rather than throwing", async () => {
    const cat = commands.find((c) => c.name === "cat")!;
    const ctx = createFakeContext("en");
    withNodes(ctx, fixtureNodes());
    await cat.run(ctx, args("ghost.txt", "cat"));
    expect(ctx.lines.join(" ")).toContain("ghost.txt");
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
