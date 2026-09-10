import type { CommandContext, FileSystem, FsNode, FsRunResult } from "../core/types";
import { escapeHtml } from "../core/html";
import type { FsDescriptor } from "./define";

/**
 * The virtual filesystem.
 *
 * Two kinds of entry, merged by name:
 *
 *   1. A plain file (`.bashrc`, `notes.txt`) — dropped into this folder
 *      and picked up with zero configuration. Its `ls` size is the file's
 *      real byte count and `cat` prints its real contents.
 *   2. A `<filename>.ts` descriptor — for files that are dynamic
 *      (rendered from profile.config.ts, translated) or executable.
 *
 * A descriptor may accompany a plain file of the same name, in which case
 * it layers on top: `.bashrc` supplies the text, `.bashrc.ts` styles it.
 */
const rawFiles = import.meta.glob(["./*", "./.*", "!./*.ts", "!./.*.ts"], {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const descriptorModules = import.meta.glob(
  ["./*.ts", "./.*.ts", "!./index.ts", "!./define.ts"],
  {
    import: "default",
    eager: true,
  }
) as Record<string, FsDescriptor>;

const DEFAULT_PERMS = "-rw-r--r--";
const EXEC_PERMS = "-rwxr--r--";

function basename(path: string): string {
  return path.replace(/^\.\//, "");
}

function byteLength(text: string): number {
  return new TextEncoder().encode(text).length;
}

/**
 * The text a reader actually sees, with our presentation markup removed.
 *
 * Rendered files wrap their content in `<span class="accent">`, `<a href=…>`
 * and the like. Measuring the raw HTML made `ls` report contact.txt as 950
 * bytes for 184 bytes of visible text — a number that is precise about the
 * wrong thing.
 */
function visibleText(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    // Ampersand last, so "&amp;lt;" does not decode twice.
    .replace(/&amp;/g, "&");
}

interface Entry {
  name: string;
  raw?: string;
  descriptor?: FsDescriptor;
}

/** Merge plain files and descriptors into one entry per filename. */
function collectEntries(): Map<string, Entry> {
  const entries = new Map<string, Entry>();

  for (const [path, content] of Object.entries(rawFiles)) {
    const name = basename(path);
    entries.set(name, { name, raw: content });
  }

  for (const [path, descriptor] of Object.entries(descriptorModules)) {
    // A descriptor can opt out when the feature behind it is unconfigured.
    if (descriptor?.enabled === false) continue;
    const name = descriptor?.name ?? basename(path).replace(/\.ts$/, "");
    const existing = entries.get(name);
    entries.set(name, { name, raw: existing?.raw, descriptor });
  }

  return entries;
}

const ENTRIES = collectEntries();

/** Materialise an entry into a node, resolving defaults and real sizes. */
function toNode(entry: Entry, ctx: CommandContext): FsNode {
  const d = entry.descriptor;
  const executable = typeof d?.exec === "function";

  const read = (context: CommandContext): string[] | null => {
    if (d?.read) return d.read(context);
    if (entry.raw === undefined) return null;
    const lines = entry.raw.replace(/\n$/, "").split("\n");
    return d?.html ? lines : lines.map(escapeHtml);
  };

  // A real byte count. A plain file reports its size on disk; a rendered
  // one reports the text `cat` displays, not the markup wrapped around it.
  let size = d?.size;
  if (size === undefined) {
    if (entry.raw !== undefined) {
      size = byteLength(entry.raw);
    } else {
      const lines = read(ctx);
      size = lines ? byteLength(visibleText(lines.join("\n"))) : 0;
    }
  }

  const node: FsNode = {
    name: entry.name,
    perms: d?.perms ?? (executable ? EXEC_PERMS : DEFAULT_PERMS),
    hidden: d?.hidden ?? entry.name.startsWith("."),
    accent: d?.accent ?? executable,
    size,
    read,
  };
  if (d?.hint) node.hint = d.hint;
  if (d?.exec) node.exec = d.exec;
  if (d?.requiresSudo) node.requiresSudo = true;
  return node;
}

export function createFileSystem(getContext: () => CommandContext): FileSystem {
  function nodes(): FsNode[] {
    const ctx = getContext();
    return [...ENTRIES.values()]
      .map((entry) => toNode(entry, ctx))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  return {
    list(opts = {}) {
      const all = nodes();
      return opts.all ? all : all.filter((n) => !n.hidden);
    },

    get(name) {
      return nodes().find((n) => n.name === name);
    },

    read(name) {
      const node = this.get(name);
      if (!node) return undefined;
      return node.read ? node.read(getContext()) : null;
    },

    async run(name, opts = {}): Promise<FsRunResult> {
      const node = this.get(name);
      if (!node) return "not-found";
      if (!node.exec) return "not-executable";
      if (node.requiresSudo && !opts.sudo) return "denied";
      await node.exec(getContext());
      return "ok";
    },
  };
}
