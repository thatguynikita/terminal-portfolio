import type { Args } from "./types.ts";

/**
 * Parses the text after a command name.
 *
 *   parseArgs("-lah /tmp")  -> flags {l,a,h}, positional ["/tmp"]
 *   parseArgs("--human -l") -> flags {"human","l"}
 *
 * A lone "-" and anything after "--" are treated as positional, matching
 * the usual shell convention closely enough for a toy terminal.
 */
export function parseArgs(raw: string, name = ""): Args {
  const positional: string[] = [];
  const flags = new Set<string>();
  let endOfFlags = false;

  for (const token of raw.trim().split(/\s+/).filter(Boolean)) {
    if (endOfFlags) {
      positional.push(token);
    } else if (token === "--") {
      endOfFlags = true;
    } else if (token.startsWith("--")) {
      flags.add(token.slice(2).toLowerCase());
    } else if (token.startsWith("-") && token.length > 1) {
      for (const ch of token.slice(1)) flags.add(ch.toLowerCase());
    } else {
      positional.push(token);
    }
  }

  return {
    name,
    raw,
    positional,
    flags,
    normalized: raw.trim().toLowerCase().replace(/\s+/g, " "),
  };
}

/** Strips one layer of matching surrounding quotes: `"foo"` -> `foo`. */
export function unquote(s: string): string {
  return s.replace(/^(["'])(.*)\1$/, "$2");
}

/** Longest common prefix — drives Tab-completion's partial fill. */
export function commonPrefix(items: string[]): string {
  const first = items[0];
  if (first === undefined) return "";
  let prefix = first;
  for (const s of items.slice(1)) {
    while (prefix && !s.startsWith(prefix)) prefix = prefix.slice(0, -1);
    if (!prefix) return "";
  }
  return prefix;
}
