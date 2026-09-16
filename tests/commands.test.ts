import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { loadCommands } from "../src/core/registry";
import { LOCALES, type Localized } from "../src/i18n/locales";
import { createFakeContext, withNodes, args } from "./helpers";
import profile from "../profile.config";
import { initialMatrixEnabled } from "../src/core/matrix";
import { BOOTED_SESSION_KEY, StorageKey } from "../src/core/storage";
import { systemSince } from "../src/core/describe";
import { lsStamp, unameStamp, uptimeLine } from "../src/commands/uptime";

const profileHandle = profile.terminal.handle;
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

  /**
   * Row values are prose, escaped like prose; the amber highlight is a flag
   * on the row. The Status row used to carry its <span> in the config.
   */
  describe("neofetch rows", () => {
    const neofetch = () => commands.find((c) => c.name === "neofetch")!;
    // Built from LOCALES, never a literal {en, ru}: this suite must run for
    // a fork that ships any set of languages.
    const loc = (text: string): Localized => {
      const out = {} as Localized;
      for (const l of LOCALES) out[l] = text;
      return out;
    };
    const render = async (rows: NonNullable<typeof profile.neofetch>["rows"]): Promise<string> => {
      const ctx = createFakeContext("en", {
        neofetch: { ...profile.neofetch!, rows, nowPlaying: undefined },
      });
      await neofetch().run(ctx, args("", "neofetch"));
      return ctx.root.innerHTML;
    };

    it("wraps a highlighted row in the amber accent, and nothing else", async () => {
      const html = await render([
        { key: loc("Role"), value: loc("Plain") },
        { key: loc("Status"), value: loc("Lit"), highlight: true },
      ]);
      expect(html).toContain('<span class="nf-key">Status</span> <span class="amber">Lit</span>');
      expect(html).toContain('<span class="nf-key">Role</span> Plain<');
      expect((html.match(/class="amber"/g) ?? []).length).toBe(1);
    });

    it("escapes row values — markup in the config stays text", async () => {
      const html = await render([
        { key: loc("K"), value: loc("a <b>bold</b> & co"), highlight: true },
      ]);
      expect(html).toContain("a &lt;b&gt;bold&lt;/b&gt; &amp; co");
      expect(html).not.toContain("<b>");
    });

    it("the shipped config highlights exactly one row, and none carry markup", () => {
      const first = LOCALES[0]!;
      expect(profile.neofetch!.rows.filter((r) => r.highlight)).toHaveLength(1);
      for (const r of profile.neofetch!.rows) {
        for (const l of LOCALES) expect(r.value[l], `${r.key[first]} (${l}) carries markup`).not.toMatch(/<\w+/);
      }
    });
  });

  /**
   * terminal.defaultMatrix is the first-visit state; the visitor's own
   * `matrix on|off` is stored and wins afterwards. One helper decides it
   * for all three pages.
   */
  describe("initialMatrixEnabled", () => {
    const KEY = StorageKey.matrix;
    // happy-dom here has no global localStorage (readStored quietly returns
    // null), so a Map-backed stand-in is installed for this suite only.
    const store = new Map<string, string>();
    beforeAll(() =>
      vi.stubGlobal("localStorage", {
        getItem: (k: string) => store.get(k) ?? null,
        setItem: (k: string, v: string) => void store.set(k, v),
        removeItem: (k: string) => void store.delete(k),
      })
    );
    afterAll(() => vi.unstubAllGlobals());
    afterEach(() => localStorage.removeItem(KEY));

    it("takes the config default on a first visit", () => {
      localStorage.removeItem(KEY);
      expect(initialMatrixEnabled("on")).toBe(true);
      expect(initialMatrixEnabled("off")).toBe(false);
    });

    it("lets a stored choice win over either default", () => {
      localStorage.setItem(KEY, "off");
      expect(initialMatrixEnabled("on")).toBe(false);
      localStorage.setItem(KEY, "on");
      expect(initialMatrixEnabled("off")).toBe(true);
    });

    it("ignores a stored value that isn't on/off", () => {
      localStorage.setItem(KEY, "maybe");
      expect(initialMatrixEnabled("off")).toBe(false);
      expect(initialMatrixEnabled("on")).toBe(true);
    });

    it("all three shipped configs start with the rain on", () => {
      expect(profile.terminal.defaultMatrix).toBe("on");
    });
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

/**
 * The title bar reads `guest@host — bash — 80×24` the moment the input
 * controller exists — during the boot screen and the intro — not only once
 * the intro ends and the prompt is mounted. It used to be the latter, which
 * showed as an empty bar that filled in (and grew) after the greeting.
 */
describe("terminal title bar", () => {
  it("is filled in before the prompt is mounted", async () => {
    const { createInput } = await import("../src/core/input");
    const ctx = createFakeContext("en");
    const head = document.createElement("div");
    head.className = "term-head";
    head.innerHTML = `<span class="term-title"></span>`;
    document.body.append(head, ctx.root);
    try {
      const terminal = {
        ctx,
        registry: commands,
        prompt: () => "$",
        title: () => "guest@example — bash — 80×24",
        run: async () => {},
        pushHistory: () => {},
        historyIndex: 0,
      } as unknown as import("../src/core/terminal").Terminal;

      createInput(terminal); // deliberately no mount()

      expect(head.querySelector(".term-title")?.textContent).toBe("guest@example — bash — 80×24");
      expect(ctx.root.querySelector("input")).toBeNull(); // still not mounted
    } finally {
      head.remove();
      ctx.root.remove();
    }
  });
});

/**
 * The launch date used to be three literals in three formats (`uptime`,
 * `uname -a`, `ls -l`). Now `commands.system.since` — or the build, when
 * it's omitted — feeds all three through `systemSince`.
 */
describe("system since", () => {
  const SINCE = "2026-08-09T20:48:27+03:00";

  it("takes the configured date, and falls back to the build otherwise", () => {
    const base = createFakeContext("en").profile;
    const configured = { ...base, commands: { ...base.commands, system: { since: SINCE } } };
    expect(systemSince(configured).toISOString()).toBe(new Date(SINCE).toISOString());

    const build = new Date(__BUILD_TIME__).toISOString();
    const omitted = { ...base, commands: { ...base.commands, system: {} } };
    expect(systemSince(omitted).toISOString()).toBe(build);
    const garbage = { ...base, commands: { ...base.commands, system: { since: "yesterday-ish" } } };
    expect(systemSince(garbage).toISOString()).toBe(build);
  });

  it("stamps uname in UTC, the way uname prints it", () => {
    // 20:48:27 at +03:00 is 17:48:27 UTC — the old literal said 20:48 UTC.
    expect(unameStamp(new Date(SINCE))).toBe("Sun Aug 9 17:48:27 UTC 2026");
  });

  it("stamps ls -l with the day space-padded to two", () => {
    const ninth = lsStamp(new Date(2026, 7, 9, 20, 48));
    const nineteenth = lsStamp(new Date(2026, 7, 19, 20, 48));
    expect(ninth).toMatch(/^[A-Z][a-z]{2} [ \d]\d \d\d:\d\d$/);
    expect(ninth).toBe("Aug  9 20:48");
    expect(nineteenth).toBe("Aug 19 20:48");
  });

  it("counts uptime from the date", () => {
    vi.useFakeTimers();
    try {
      const now = new Date("2026-09-14T12:00:00Z");
      vi.setSystemTime(now);
      const twoDays = new Date(now.getTime() - ((2 * 24 + 3) * 60 + 4) * 60000);
      expect(uptimeLine(twoDays)).toContain("up 2 days, 3:04,");
      const fiveMinutes = new Date(now.getTime() - 5 * 60000);
      expect(uptimeLine(fiveMinutes)).toContain("up 0:05,");
    } finally {
      vi.useRealTimers();
    }
  });

  it("feeds uname, ls -l and uptime from the config, not the build", async () => {
    const overrides = { commands: { system: { since: SINCE } } };
    const run = async (name: string, flags: string): Promise<string> => {
      const command = commands.find((c) => c.name === name)!;
      const ctx = createFakeContext("en", overrides);
      withNodes(ctx, fixtureNodes());
      await command.run(ctx, args(flags, name));
      return ctx.lines.join("\n");
    };
    expect(await run("uname", "-a")).toContain("Sun Aug 9 17:48:27 UTC 2026");
    expect(await run("ls", "-l")).toContain(lsStamp(new Date(SINCE)));
    // A build from this very run would say "up 0:00"; the configured date is weeks back.
    expect(await run("uptime", "")).not.toContain("up 0:00,");
  });
});

/**
 * `terminal.bootScreen` and `terminal.chips` also strip their markup at
 * build time; these cover the runtime half, for a shell that keeps it.
 */
describe("terminal switches", () => {
  const stubTerminal = (ctx: ReturnType<typeof createFakeContext>) =>
    ({
      ctx,
      registry: {
        get: (name: string) => commands.find((c) => c.name === name),
        names: () => commands.map((c) => c.name),
        visible: () => commands.filter((c) => !c.hidden),
      },
      prompt: () => "$",
      title: () => "guest@example — bash — 80×24",
      run: async () => {},
      pushHistory: () => {},
      historyIndex: 0,
    }) as unknown as import("../src/core/terminal").Terminal;

  describe("chips", () => {
    const withChipsEl = async (chips: boolean): Promise<HTMLElement> => {
      const { createInput } = await import("../src/core/input");
      const ctx = createFakeContext("en", { terminal: { ...profile.terminal, chips } });
      const chipsEl = document.createElement("div");
      chipsEl.id = "chips";
      document.body.append(chipsEl, ctx.root);
      try {
        createInput(stubTerminal(ctx)).mount();
        await new Promise((r) => requestAnimationFrame(() => r(undefined)));
        return chipsEl;
      } finally {
        chipsEl.remove();
        ctx.root.remove();
      }
    };

    it("renders the bar when on", async () => {
      const el = await withChipsEl(true);
      expect(el.hidden).toBe(false);
      expect(el.querySelectorAll(".chip").length).toBeGreaterThan(0);
    });

    it("hides the bar and never fills it when off", async () => {
      const el = await withChipsEl(false);
      expect(el.hidden).toBe(true);
      expect(el.innerHTML).toBe("");
    });
  });

  describe("boot screen", () => {
    const session = new Map<string, string>();
    beforeAll(() => {
      vi.stubGlobal("sessionStorage", {
        getItem: (k: string) => session.get(k) ?? null,
        setItem: (k: string, v: string) => void session.set(k, v),
        removeItem: (k: string) => void session.delete(k),
      });
      // Reduced motion: the sequence is marked as shown without animating.
      vi.stubGlobal("matchMedia", () => ({ matches: true }));
    });
    afterAll(() => vi.unstubAllGlobals());
    afterEach(() => session.clear());

    const runBoot = async (bootScreen: boolean) => {
      const { boot } = await import("../src/core/boot");
      const ctx = createFakeContext("en", { terminal: { ...profile.terminal, bootScreen } });
      const bootEl = document.createElement("div");
      bootEl.id = "boot";
      bootEl.textContent = "> booting ...";
      document.body.append(bootEl, ctx.root);
      const mount = vi.fn();
      try {
        await boot(stubTerminal(ctx), { mount } as never);
        return { bootEl, mount, ctx };
      } finally {
        bootEl.remove();
        ctx.root.remove();
      }
    };

    it("marks the sequence as shown when on", async () => {
      const { bootEl, mount } = await runBoot(true);
      expect(session.get(BOOTED_SESSION_KEY)).toBe("1");
      expect(bootEl.classList.contains("hidden")).toBe(true);
      expect(mount).toHaveBeenCalledTimes(1);
    });

    it("skips straight to the greeting when off", async () => {
      const { bootEl, mount, ctx } = await runBoot(false);
      expect(session.has(BOOTED_SESSION_KEY)).toBe(false);
      expect(bootEl.classList.contains("hidden")).toBe(true);
      expect(bootEl.textContent).toBe("> booting ..."); // never written to
      expect(mount).toHaveBeenCalledTimes(1); // the intro still ran
      expect(ctx.lines.join("\n")).toContain(profile.terminal.hostname); // neofetch printed
    });

    // No card configured: the intro is the welcome lines and nothing else.
    // The registry does the unregistering; here the stub simply lacks it.
    it("prints only the welcome when there is no neofetch to print", async () => {
      const { boot } = await import("../src/core/boot");
      const ctx = createFakeContext("en", { terminal: { ...profile.terminal, bootScreen: false } });
      document.body.append(ctx.root);
      const mount = vi.fn();
      const terminal = { ...stubTerminal(ctx), registry: { get: () => undefined, names: () => [], visible: () => [] } };
      try {
        await boot(terminal as never, { mount } as never);
        const text = ctx.lines.join("\n");
        expect(text).toContain(ctx.t("ui.welcome"));
        expect(text, "neofetch content printed with no card").not.toContain(profile.terminal.hostname);
        expect(mount).toHaveBeenCalledTimes(1);
      } finally {
        ctx.root.remove();
      }
    });
  });
});

/**
 * The secret theme is `commands.system.secretTheme`. The `claude "add light
 * theme"` egg ships it on the second ask — and with none configured there
 * is nothing to ship, so the egg stays at won't-fix however often it's asked.
 */
describe("secret theme easter egg", () => {
  const ask = async (ctx: ReturnType<typeof createFakeContext>): Promise<string> => {
    const claude = commands.find((c) => c.name === "claude")!;
    const before = ctx.lines.length;
    await claude.run(ctx, args('"add light theme"', "claude"));
    return ctx.lines.slice(before).join("\n");
  };

  it("unlocks the configured secret on the second ask", async () => {
    const ctx = createFakeContext("en");
    const unlock = vi.fn();
    ctx.theme = { ...ctx.theme, secretName: "sabbatical", unlockSecret: unlock };
    await ask(ctx);
    expect(unlock).not.toHaveBeenCalled();
    const second = await ask(ctx);
    expect(unlock).toHaveBeenCalledTimes(1);
    expect(second).toContain("theme sabbatical");
  });

  it("never gets past won't-fix when no secret theme is configured", async () => {
    const ctx = createFakeContext("en");
    const unlock = vi.fn();
    ctx.theme = { ...ctx.theme, secretName: undefined, unlockSecret: unlock };
    const first = await ask(ctx);
    const second = await ask(ctx);
    const third = await ask(ctx);
    expect(unlock).not.toHaveBeenCalled();
    expect(second).toBe(first);
    expect(third).toBe(first);
    expect(second).not.toMatch(/theme\s*$/m); // no "type theme " with an empty name
  });
});

/** `env`'s LANG used to be `${lang}_US.UTF-8` — `ru_US` for a Russian session. */
describe("env LANG", () => {
  it("prints a real POSIX locale for the session language", async () => {
    const { posixLocale } = await import("../src/i18n/locales");
    expect(posixLocale("en")).toBe("en_US");
    expect(posixLocale("ru")).toBe("ru_RU");
    expect(posixLocale("pt")).toBe("pt_BR");
    expect(posixLocale("zh")).toBe("zh_CN");
    expect(posixLocale("uk")).toBe("uk_UA");
    expect(posixLocale("xx")).toBe("xx_XX");
    const env = commands.find((c) => c.name === "env")!;
    for (const lang of LOCALES) {
      const ctx = createFakeContext(lang);
      await env.run(ctx, args("", "env"));
      expect(ctx.lines.join("\n")).toContain(`LANG=${posixLocale(lang)}.UTF-8`);
      expect(ctx.lines.join("\n")).not.toContain(`${lang}_US.UTF-8`.replace("en_US", "never"));
    }
  });
});
