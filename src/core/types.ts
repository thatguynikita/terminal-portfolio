import type { Locale } from "../i18n/locales";
import type { ProfileConfig } from "./profile";

/* ---------------- output ---------------- */

/** One beat of a scripted animation. */
export interface SequenceStep {
  text: string;
  /** ms to wait *before* this step. */
  delay?: number;
  /** Stream character-by-character instead of printing at once. */
  typed?: boolean;
  cls?: string;
}

/**
 * The shared print/present API. Every command writes through this and
 * nothing else — no command touches the DOM directly.
 *
 * Note the deliberate split: `print` takes HTML, `printText` escapes for
 * you. The original code had one function taking HTML and another taking
 * text, which made escaping easy to get wrong.
 */
export interface Output {
  /** Append a line of raw HTML. Returns the node, for live-updating views. */
  print(html: string, cls?: string): HTMLElement;
  /** Append a line of plain text, escaped. */
  printText(text: string, cls?: string): HTMLElement;
  /** Append several raw-HTML lines; empty strings become blank lines. */
  printLines(lines: string[], cls?: string): void;
  /** Stream plain text character-by-character. HTML is NOT interpreted. */
  type(text: string, opts?: { cls?: string; speed?: number }): Promise<void>;
  /** Play scripted steps in order. */
  sequence(steps: SequenceStep[]): Promise<void>;
  /** Header row + data rows. Pass null for no header. */
  table(header: string[] | null, rows: string[][]): HTMLElement;
  /** Two-column key/value table, accent-styled keys, no header. */
  kv(pairs: Array<[string, string]>): HTMLElement;
  /** Echo the entered command behind the current prompt. */
  promptEcho(cmd: string, suffix?: string): void;
  clear(): void;
  /** The scroll container — for the rare view that mutates itself (`top`). */
  root: HTMLElement;
}

/* ---------------- arguments ---------------- */

/**
 * Parsed command arguments. Replaces the ad-hoc re-parsing each command
 * used to do (`ls` and `ll` duplicated the same flag loop verbatim).
 */
export interface Args {
  /** The name actually typed — lets aliases behave differently (`ll`). */
  name: string;
  /** Everything after the command name, untouched. */
  raw: string;
  /** Non-flag tokens, in order. */
  positional: string[];
  /** Chars from `-lah`, plus whole words from `--human-readable`. */
  flags: Set<string>;
  /** `raw` lowercased and whitespace-collapsed — the common comparison. */
  normalized: string;
}

/* ---------------- filesystem ---------------- */

export type FsRunResult = "ok" | "not-found" | "not-executable" | "denied";

export interface FsNode {
  name: string;
  /** ls-style permission string. Defaults to "-rw-r--r--". */
  perms: string;
  /** Dotfiles are hidden unless `ls -a`. */
  hidden: boolean;
  /** Rendered in the accent colour by `ls` — defaults to executable. */
  accent: boolean;
  /** Byte length. Real, for plain files. */
  size: number;
  /** Lines for `cat`. `null` means "not a text file". */
  read?: (ctx: CommandContext) => string[] | null;
  /** Makes the node runnable via `./name`, `sudo ./name`, or a command. */
  exec?: (ctx: CommandContext) => void | Promise<void>;
  /** `./name` alone is denied; `sudo ./name` works. */
  requiresSudo?: boolean;
}

export interface FileSystem {
  /** Visible nodes, or everything when `all`. */
  list(opts?: { all?: boolean }): FsNode[];
  get(name: string): FsNode | undefined;
  /** Lines to print, `null` if not text, `undefined` if no such file. */
  read(name: string): string[] | null | undefined;
  run(name: string, opts?: { sudo?: boolean }): Promise<FsRunResult>;
}

/* ---------------- theme ---------------- */

export interface MatrixController {
  setColor(c: string): void;
  setFadeColor(c: string): void;
  setEnabled(v: boolean): void;
  readonly enabled: boolean;
}

export interface ThemeController {
  /** Selectable theme names — secret ones only once unlocked. */
  list(): string[];
  current(): string;
  /** False when the name isn't a known theme. Persists on success. */
  set(name: string): boolean;
  readonly secretName: string;
  secretUnlocked(): boolean;
  unlockSecret(): void;
  matrix: MatrixController;
}

/* ---------------- modes ---------------- */

/**
 * A sub-REPL that takes over input (`ssh` persona chat, `top`).
 * Lifts what used to be hardcoded branches at the top of the dispatcher.
 */
export interface Mode {
  name: string;
  /** Prompt HTML while this mode is active. */
  prompt(ctx: CommandContext): string;
  /** Window-chrome title while active. */
  title?(ctx: CommandContext): string;
  enter(ctx: CommandContext): void | Promise<void>;
  handle(ctx: CommandContext, input: string): void | Promise<void>;
  exit?(ctx: CommandContext): void | Promise<void>;
  /** Touch chips shown while active. */
  chips?(ctx: CommandContext, input: string): Array<{ label: string; value: string }>;
  /** Tab-completion candidates while active. */
  complete?(ctx: CommandContext, input: string): string[];
  /** Return true if the key was handled. Used for `top`'s bare `q`. */
  onKey?(ctx: CommandContext, e: KeyboardEvent): boolean;
}

/* ---------------- commands ---------------- */

export interface CommandContext extends Output {
  readonly lang: Locale;
  readonly profile: ProfileConfig;
  /** Look up a message. Supports `{name}` interpolation. */
  t(key: string, vars?: Record<string, string | number>): string;
  /** Same, but for keys holding a string array (fortunes, boot lines). */
  tList(key: string, vars?: Record<string, string | number>): string[];
  escape(s: string): string;
  escapeAttr(s: string): string;
  sleep(ms: number): Promise<void>;

  fs: FileSystem;
  theme: ThemeController;
  readonly history: readonly string[];
  /** Every registered command, for `help` and completion. */
  commands(): Command[];
  lookup(name: string): Command | undefined;

  enterMode(mode: Mode): Promise<void>;
  exitMode(): Promise<void>;
  readonly mode: Mode | null;

  /**
   * Run a filesystem node by name, printing the shell-style error when it
   * is missing, not executable, or needs sudo. Shared by `./name`,
   * `sudo ./name` and shortcut commands like `game`.
   */
  runFile(name: string, opts?: { sudo?: boolean }): Promise<void>;

  setLang(l: Locale): void;
  navigate(url: string): void;
  /** Replay the greeting — used by `exit`. */
  restart(): Promise<void>;
  /** Shared mutable scratch space for commands with memory (`claude`, `ssh`). */
  state: Record<string, unknown>;
}

export interface Command {
  name: string;
  aliases?: string[];
  /** Runnable, but absent from `help`, chips and completion. */
  hidden?: boolean;
  /**
   * Sort weight for `help` and the chips bar. Lower comes first;
   * commands without one sort after, alphabetically.
   */
  order?: number;
  /** Argument hint used by `help`, e.g. "<file>". */
  usage?: string;
  /**
   * What `help` puts in the input when the row is clicked.
   * Defaults to the name, plus a trailing space when `usage` is set.
   */
  fill?: string;
  /** Argument candidates for Tab-completion and chips. */
  complete?(ctx: CommandContext, partial: string): string[];
  /** Relabel a candidate for display (kubectl's "describe pod " prefix). */
  completeLabel?(candidate: string): string;
  run(ctx: CommandContext, args: Args): void | Promise<void>;
}

/** Identity helper — gives editors the contract while authoring a command. */
export function defineCommand(command: Command): Command {
  return command;
}
