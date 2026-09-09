import { describe, expect, it } from "vitest";
import { isCompleteArgument, splitInput } from "../src/core/complete";
import { nextLocale } from "../src/i18n/locales";
import type { Locale } from "../src/i18n/locales";
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
 * Regression cover for a chip that filled the input but never ran. The
 * predicate used to ask "do any candidates match?" instead of "is this
 * already complete?", so `lang ru` sat in the input awaiting a second tap.
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

describe("locale rotation", () => {
  const cycle = (locales: Locale[]): string[] => {
    let current = locales[0] as Locale;
    const seen = [current];
    for (let i = 0; i < locales.length; i++) {
      current = nextLocale(locales, current);
      seen.push(current);
    }
    return seen;
  };

  it("alternates between two locales", () => {
    expect(cycle(["en", "ru"])).toEqual(["en", "ru", "en"]);
  });

  // The lang chip advances one step per tap, so it must reach them all.
  it("visits every locale and wraps, for three or more", () => {
    expect(cycle(["en", "ru", "de"] as Locale[])).toEqual(["en", "ru", "de", "en"]);
    expect(cycle(["en", "ru", "de", "fr"] as Locale[])).toEqual(["en", "ru", "de", "fr", "en"]);
  });

  it("starts from the beginning when the current locale is not configured", () => {
    expect(nextLocale(["ru", "de"] as Locale[], "en")).toBe("ru");
  });

  it("stays put when only one locale is configured", () => {
    expect(nextLocale(["en"], "en")).toBe("en");
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
  const base = { ...profile, commands: undefined } as ProfileConfig;
  const withOverride = (over: Record<string, Record<string, string>>): ProfileConfig =>
    ({ ...profile, commands: { descriptions: over } }) as unknown as ProfileConfig;

  it("falls back to the message catalogue when nothing overrides it", () => {
    expect(commandDescription(base, "en", "skills")).toBe("tech stack");
    expect(commandDescription(base, "ru", "skills")).toBe("технологический стек");
  });

  it("prefers a config override, per locale", () => {
    const p = withOverride({ skills: { en: "my stack", ru: "мой стек" } });
    expect(commandDescription(p, "en", "skills")).toBe("my stack");
    expect(commandDescription(p, "ru", "skills")).toBe("мой стек");
  });

  it("falls back for locales the override omits", () => {
    const p = withOverride({ skills: { en: "my stack" } });
    expect(commandDescription(p, "en", "skills")).toBe("my stack");
    expect(commandDescription(p, "ru", "skills")).toBe("технологический стек");
  });

  it("ignores a blank override rather than showing an empty description", () => {
    const p = withOverride({ skills: { en: "   ", ru: "" } });
    expect(commandDescription(p, "en", "skills")).toBe("tech stack");
    expect(commandDescription(p, "ru", "skills")).toBe("технологический стек");
  });

  it("returns empty for a command described in neither place", () => {
    expect(commandDescription(base, "en", "no-such-command")).toBe("");
  });

  it("ships the about override, since its wording carries a name", () => {
    for (const locale of profile.terminal.locales) {
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
