import type { Args, CommandContext, FsNode, Mode } from "../src/core/types.ts";
import type { ProfileConfig } from "../src/core/profile.ts";
import profile from "../profile.config.ts";
import { translate, translateList } from "../src/i18n/index.ts";
import type { Locale } from "../src/i18n/locales.ts";
import { escapeAttr, escapeHtml } from "../src/core/html.ts";
import { parseArgs } from "../src/core/args.ts";

export interface FakeContext extends CommandContext {
  /** Everything printed so far, as plain text. */
  lines: string[];
}

/**
 * A CommandContext backed by a real (happy-dom) element but with the
 * animations and timers stubbed out, so a command's `run` can be driven
 * to completion synchronously.
 */
export function createFakeContext(lang: Locale = "en", overrides: Partial<ProfileConfig> = {}): FakeContext {
  const root = document.createElement("div");
  const lines: string[] = [];
  // No network in tests: the now-playing poller is off unless a test
  // explicitly opts in via `overrides.neofetch`.
  const config = {
    ...profile,
    neofetch: { ...profile.neofetch, nowPlaying: undefined },
    ...overrides,
  } as ProfileConfig;
  let mode: Mode | null = null;

  const print = (html: string): HTMLElement => {
    const node = document.createElement("div");
    node.innerHTML = html;
    root.appendChild(node);
    lines.push(node.textContent ?? "");
    return node;
  };

  const ctx: FakeContext = {
    lines,
    root,
    print,
    printText: (text) => print(escapeHtml(text)),
    printLines: (items) => items.forEach((l) => print(l)),
    async type(text) {
      print(escapeHtml(text));
    },
    async sequence(steps) {
      for (const step of steps) print(step.text);
    },
    table: (header, rows) =>
      print(
        `<table>${header ? `<tr>${header.map((h) => `<td>${h}</td>`).join("")}</tr>` : ""}` +
          rows.map((r) => `<tr>${r.map((v) => `<td>${v}</td>`).join("")}</tr>`).join("") +
          `</table>`
      ),
    kv: (pairs) => print(`<table>${pairs.map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join("")}</table>`),
    promptEcho: (cmd) => print(escapeHtml(cmd)),
    clear() {
      root.innerHTML = "";
      lines.length = 0;
    },

    lang,
    profile: config,
    t: (key, vars) => translate(lang, key, vars),
    tList: (key, vars) => translateList(lang, key, vars),
    escape: escapeHtml,
    escapeAttr,
    sleep: async () => undefined,

    fs: {
      list: () => [],
      get: () => undefined,
      read: () => undefined,
      run: async () => "ok",
    },

    theme: {
      list: () => ["green", "amber"],
      current: () => "green",
      set: (name) => name === "green" || name === "amber",
      secretName: "sabbatical",
      secretUnlocked: () => false,
      unlockSecret: () => undefined,
      matrix: {
        setColor: () => undefined,
        setFadeColor: () => undefined,
        setEnabled: () => undefined,
        enabled: true,
      },
    },

    history: [],
    commands: () => [],
    lookup: () => undefined,

    get mode() {
      return mode;
    },
    async enterMode(next) {
      mode = next;
      await next.enter(ctx);
    },
    async exitMode() {
      const current = mode;
      mode = null;
      await current?.exit?.(ctx);
    },
    runFile: async () => undefined,
    setLang: () => undefined,
    navigate: () => undefined,
    restart: async () => undefined,
    state: {},
  };

  return ctx;
}

/** A filesystem stub with the given nodes, for commands that read files. */
export function withNodes(ctx: FakeContext, nodes: FsNode[]): void {
  ctx.fs.list = (opts = {}) => (opts.all ? nodes : nodes.filter((n) => !n.hidden));
  ctx.fs.get = (name) => nodes.find((n) => n.name === name);
  ctx.fs.read = (name) => {
    const node = nodes.find((n) => n.name === name);
    if (!node) return undefined;
    return node.read ? node.read(ctx) : null;
  };
}

export function args(raw = "", name = ""): Args {
  return parseArgs(raw, name);
}
