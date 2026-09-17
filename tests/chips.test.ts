import { describe, expect, it } from "vitest";
import { firstWordCandidates, isCompleteArgument, scriptCandidates, splitInput } from "../src/core/complete";
import { LOCALES, nextLocale } from "../src/i18n/locales";
import { loadCommands } from "../src/core/registry";
import { createFakeContext } from "./helpers";
import { commandDescription } from "../src/core/describe";
import type { ProfileConfig } from "../src/core/profile";
import profile from "../profile.config";

const commands = loadCommands();

describe("splitInput", () => {
  it("treats a bare word as a command name with no argument", () => {
    expect(splitInput("theme")).toEqual({ base: null, head: "", prefix: "theme" });
  });

  it("splits a command from its argument and lowercases both", () => {
    expect(splitInput("Theme Green")).toEqual({
      base: "theme",
      head: "Theme ",
      prefix: "green",
    });
  });

  it("keeps the head verbatim so completion does not rewrite what was typed", () => {
    expect(splitInput("kubectl describe pod X").head).toBe("kubectl ");
  });
});

/**
 * "Is this already complete?", not "do any candidates match?" — the
 * difference between a chip that runs `lang ru` and one that leaves it in
 * the input awaiting a second tap.
 */
describe("isCompleteArgument", () => {
  it("submits an argument that exactly matches a candidate", () => {
    expect(isCompleteArgument(["en", "ru"], "ru")).toBe(true);
    expect(isCompleteArgument(["green", "amber"], "green")).toBe(true);
  });

  it("submits when nothing can extend the argument", () => {
    expect(isCompleteArgument([], "")).toBe(true);
    expect(isCompleteArgument(["apply", "destroy"], "destroy")).toBe(true);
  });

  it("keeps the input open when candidates would extend it", () => {
    expect(isCompleteArgument(["green", "amber"], "")).toBe(false);
    expect(isCompleteArgument(["describe pod a", "describe pod b"], "describe pod ")).toBe(false);
  });

  // en/en-GB, pt/pt-BR, zh/zh-Hans — the shape a template invites.
  it("submits an exact match even when a longer candidate also matches", () => {
    expect(isCompleteArgument(["en", "en-GB", "ru"], "en")).toBe(true);
    expect(isCompleteArgument(["green", "green-dark"], "green")).toBe(true);
  });

  it("still opens the list for a genuine prefix of those candidates", () => {
    expect(isCompleteArgument(["en", "en-GB"], "e")).toBe(false);
  });
});

describe("first-word completion", () => {
  const files = [
    { name: "about.txt" },
    { name: "milk-quest.sh", exec: () => undefined },
    { name: "deploy.sh", exec: () => undefined },
    { name: ".bashrc" },
  ];
  const scripts = scriptCandidates(files);
  const commands = ["cat", "clear", "cv", "help"];

  it("spells executables the way the terminal runs them", () => {
    expect(scripts).toEqual(["./milk-quest.sh", "./deploy.sh"]);
  });

  it("offers every executable for a bare dot", () => {
    expect(firstWordCandidates(".", commands, scripts)).toEqual(["./milk-quest.sh", "./deploy.sh"]);
  });

  it("keeps narrowing through ./ and beyond", () => {
    expect(firstWordCandidates("./", commands, scripts)).toEqual(["./milk-quest.sh", "./deploy.sh"]);
    expect(firstWordCandidates("./d", commands, scripts)).toEqual(["./deploy.sh"]);
    expect(firstWordCandidates("./x", commands, scripts)).toEqual([]);
  });

  it("never mixes scripts into command completion", () => {
    expect(firstWordCandidates("c", commands, scripts)).toEqual(["cat", "clear", "cv"]);
    expect(firstWordCandidates("", commands, scripts)).toEqual(commands);
    // A dotfile isn't executable, so `.b` finds nothing rather than .bashrc.
    expect(firstWordCandidates(".b", commands, scripts)).toEqual([]);
  });
});

describe("locale rotation", () => {
  const cycle = (locales: string[]): string[] => {
    let current = locales[0] as string;
    const seen = [current];
    for (let i = 0; i < locales.length; i++) {
      current = nextLocale(locales, current);
      seen.push(current);
    }
    return seen;
  };

  it("alternates between two locales", () => {
    expect(cycle(["a", "b"])).toEqual(["a", "b", "a"]);
  });

  // The lang chip advances one step per tap, so it must reach them all.
  it("visits every locale and wraps, for three or more", () => {
    expect(cycle(["a", "b", "c"])).toEqual(["a", "b", "c", "a"]);
    expect(cycle(["a", "b", "c", "d"])).toEqual(["a", "b", "c", "d", "a"]);
  });

  it("starts from the beginning when the current locale is not configured", () => {
    expect(nextLocale(["b", "c"], "a")).toBe("b");
  });

  it("stays put when only one locale is configured", () => {
    expect(nextLocale(["a"], "a")).toBe("a");
  });
});

/**
 * Regression cover for an invisible chip: kubectl's label helper trims the
 * "describe pod " prefix, and the bare prefix candidate trimmed to "".
 */
describe("completion labels", () => {
  it("never renders an empty label for any command's own candidates", () => {
    const ctx = createFakeContext("en");
    const empty: string[] = [];
    for (const command of commands) {
      if (!command.complete) continue;
      for (const partial of ["", "describe pod ", "g"]) {
        for (const candidate of command.complete(ctx, partial)) {
          const label = command.completeLabel?.(candidate) ?? candidate;
          if (label === "") empty.push(`${command.name}: "${candidate}"`);
        }
      }
    }
    expect(empty).toEqual([]);
  });

  it("kubectl shows the bare prefix, then bare pod names", () => {
    const kubectl = commands.find((c) => c.name === "kubectl")!;
    const ctx = createFakeContext("en");

    const top = kubectl.complete!(ctx, "").map((c) => kubectl.completeLabel!(c));
    expect(top).toContain("get pods");
    expect(top).toContain("describe pod ");

    const pods = kubectl.complete!(ctx, "describe pod ").map((c) => kubectl.completeLabel!(c));
    expect(pods).toContain("sre-sanity-canary");
    for (const label of pods) expect(label).not.toContain("describe pod");
  });
});

/**
 * `profile.commands` lets a fork reword a help description that carries a
 * name or a turn of phrase, without editing the message catalogues.
 */
describe("command descriptions", () => {
  const base = { ...profile, commands: { ...profile.commands, descriptions: undefined } } as ProfileConfig;
  const withOverride = (over: Record<string, Record<string, string>>): ProfileConfig =>
    ({ ...profile, commands: { ...profile.commands, descriptions: over } }) as unknown as ProfileConfig;

  // Driven by the configured locales rather than by hardcoded Russian, so
  // the suite still passes for a fork that ships a single language.
  const configured = LOCALES;
  const catalogue = (locale: (typeof configured)[number]): string =>
    commandDescription(base, locale, "skills");

  it("falls back to the message catalogue when nothing overrides it", () => {
    for (const locale of configured) {
      expect(catalogue(locale).trim(), `${locale} has no catalogue description`).not.toBe("");
    }
  });

  it("prefers a config override, per locale", () => {
    const over = Object.fromEntries(configured.map((l) => [l, `my stack (${l})`]));
    const p = withOverride({ skills: over });
    for (const locale of configured) {
      expect(commandDescription(p, locale, "skills")).toBe(`my stack (${locale})`);
    }
  });

  it("falls back for locales the override omits", () => {
    const first = configured[0]!;
    const p = withOverride({ skills: { [first]: "my stack" } });
    expect(commandDescription(p, first, "skills")).toBe("my stack");
    for (const locale of configured.slice(1)) {
      expect(commandDescription(p, locale, "skills")).toBe(catalogue(locale));
    }
  });

  it("ignores a blank override rather than showing an empty description", () => {
    const over = Object.fromEntries(configured.map((l) => [l, l === configured[0] ? "   " : ""]));
    const p = withOverride({ skills: over });
    for (const locale of configured) {
      expect(commandDescription(p, locale, "skills")).toBe(catalogue(locale));
    }
  });

  it("returns empty for a command described in neither place", () => {
    expect(commandDescription(base, "en", "no-such-command")).toBe("");
  });

  it("ships the about override, since its wording carries a name", () => {
    for (const locale of LOCALES) {
      const text = commandDescription(profile, locale, "about");
      expect(text.trim()).not.toBe("");
      expect(text).not.toBe(commandDescription(base, locale, "about"));
    }
  });

  it("renders the override in help output", async () => {
    const help = commands.find((c) => c.name === "help")!;
    const ctx = createFakeContext("en");
    ctx.commands = () => commands;
    await help.run(ctx, { name: "help", raw: "", positional: [], flags: new Set(), normalized: "" });
    expect(ctx.lines.join(" ")).toContain(commandDescription(profile, "en", "about"));
  });
});
