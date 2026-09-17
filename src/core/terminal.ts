import type { CommandContext, Mode, Output } from "./types.ts";
import type { ProfileConfig } from "./profile.ts";
import { LOCALES, type Locale } from "../i18n/locales.ts";
import { translate, translateList } from "../i18n/index.ts";
import { createRegistry, type Registry } from "./registry.ts";
import { createFileSystem } from "../fs/index.ts";
import { createThemeController } from "./theme.ts";
import { createMatrixRain, initialMatrixEnabled } from "./matrix.ts";
import { createOutput } from "./output.ts";
import { parseArgs } from "./args.ts";
import { escapeAttr, escapeHtml, pace } from "./html.ts";
import { StorageKey, readStored, writeStored } from "./storage.ts";

export interface Terminal {
  ctx: CommandContext;
  registry: Registry;
  /** Echo the input, then dispatch it to the active mode or a command. */
  run(raw: string): Promise<void>;
  /** Prompt HTML for the current mode. */
  prompt(): string;
  /** Window-chrome title for the current mode. */
  title(): string;
  pushHistory(raw: string): void;
  historyIndex: number;
  onModeChange?: () => void;
  /** Set by the page entry: replays the greeting after `exit`. */
  onRestart?: () => Promise<void>;
}

export interface TerminalOptions {
  profile: ProfileConfig;
  body: HTMLElement;
  canvas: HTMLCanvasElement;
}

export function createTerminal(options: TerminalOptions): Terminal {
  const { profile, body, canvas } = options;
  const locales = LOCALES;

  let lang: Locale = resolveInitialLang();
  let mode: Mode | null = null;
  const history: string[] = [];
  const state: Record<string, unknown> = {};

  function resolveInitialLang(): Locale {
    const stored = readStored(StorageKey.lang);
    if (stored && locales.includes(stored as Locale)) return stored as Locale;
    return profile.terminal.defaultLocale;
  }

  const matrix = createMatrixRain(canvas);
  matrix.setEnabled(initialMatrixEnabled(profile.terminal.defaultMatrix));

  const theme = createThemeController(matrix, {
    defaultTheme: profile.terminal.defaultTheme,
    secretTheme: profile.commands?.system?.secretTheme,
  });

  const registry = createRegistry(profile);

  const output: Output = createOutput(body, { prompt: () => terminal.prompt() });

  // The filesystem needs a context, and the context exposes the
  // filesystem — resolved lazily rather than with a construction dance.
  const fs = createFileSystem(() => ctx);

  const ctx: CommandContext = {
    ...output,

    get lang() {
      return lang;
    },
    profile,

    t: (key, vars) => translate(lang, key, vars),
    tList: (key, vars) => translateList(lang, key, vars),
    escape: escapeHtml,
    escapeAttr,
    sleep: pace,

    fs,
    theme,
    get history() {
      return history;
    },
    commands: () => registry.all(),
    lookup: (name) => registry.get(name),

    get mode() {
      return mode;
    },

    async enterMode(next) {
      mode = next;
      await next.enter(ctx);
      terminal.onModeChange?.();
    },

    async exitMode() {
      const current = mode;
      mode = null;
      if (current?.exit) await current.exit(ctx);
      terminal.onModeChange?.();
    },

    setLang(next) {
      lang = next;
      document.documentElement.lang = next;
      writeStored(StorageKey.lang, next);
      terminal.onModeChange?.();
    },

    navigate(url) {
      window.location.href = url;
    },

    restart: async () => {
      await terminal.onRestart?.();
    },

    runFile: (name, opts = {}) => runFile(name, opts.sudo ?? false),

    state,
  };

  function pushHistory(raw: string): void {
    if (!raw.trim()) return;
    history.push(raw);
    terminal.historyIndex = history.length;
  }

  const terminal: Terminal = {
    ctx,
    registry,
    historyIndex: 0,

    prompt() {
      if (mode) return mode.prompt(ctx);
      const { handle } = profile.terminal;
      const { hostname } = profile.terminal;
      return `${escapeHtml(handle)}@${escapeHtml(hostname)} <span class="path">~</span> $`;
    },

    // The fake window's title bar at the plain prompt. Modes (`top`, `ssh`)
    // supply their own while active. Not configurable: every config ever
    // written set it to exactly this string, once per locale.
    title() {
      if (mode?.title) return mode.title(ctx);
      return `${profile.terminal.handle}@${profile.terminal.hostname} — bash — 80×24`;
    },

    pushHistory,

    async run(raw) {
      output.promptEcho(raw);

      if (mode) {
        pushHistory(raw);
        await mode.handle(ctx, raw);
        return;
      }

      pushHistory(raw);
      const trimmed = raw.trim();
      if (!trimmed) return;

      const spaceIndex = trimmed.search(/\s/);
      const name = (spaceIndex === -1 ? trimmed : trimmed.slice(0, spaceIndex)).toLowerCase();
      const rest = spaceIndex === -1 ? "" : trimmed.slice(spaceIndex + 1);

      // `./something` runs a filesystem node rather than a command.
      if (name.startsWith("./")) {
        await runFile(name.slice(2), false);
        return;
      }

      const command = registry.get(name);
      if (!command) {
        output.print(ctx.t("ui.notFound", { cmd: escapeHtml(name) }));
        output.print(ctx.t("ui.notFoundHint"));
        return;
      }

      await command.run(ctx, parseArgs(rest, name));
    },
  };

  /** Shared by `./name`, `sudo ./name` and the `game` shortcut. */
  async function runFile(name: string, sudo: boolean): Promise<void> {
    const result = await fs.run(name, { sudo });
    if (result === "ok") return;
    const key =
      result === "not-found"
        ? "exec.notFound"
        : result === "denied"
          ? "exec.denied"
          : "exec.notExecutable";
    output.print(ctx.t(key, { file: escapeHtml(name) }));
  }

  return terminal;
}
