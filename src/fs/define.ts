import type { CommandContext, FsNode } from "../core/types";

/**
 * What a `<filename>.ts` descriptor exports.
 *
 * Everything is optional: a descriptor only states what differs from the
 * defaults derived from the file itself.
 */
export interface FsDescriptor {
  /** Defaults to the descriptor's own filename minus `.ts`. */
  name?: string;
  /** Defaults to "-rwxr--r--" when executable, "-rw-r--r--" otherwise. */
  perms?: string;
  /** Defaults to true for dotfiles. */
  hidden?: boolean;
  /** Accent colour in `ls`. Defaults to true when executable. */
  accent?: boolean;
  /** Overrides the byte count `ls` reports. */
  size?: number;
  /** Lines for `cat`. Return null for "not a text file". */
  read?: (ctx: CommandContext) => string[] | null;
  /** Treat this file's lines as HTML rather than escaping them. */
  html?: boolean;
  /** Makes the file runnable: `./name`, `sudo ./name`, or a command. */
  exec?: (ctx: CommandContext) => void | Promise<void>;
  /** `./name` on its own is denied; `sudo ./name` runs it. */
  requiresSudo?: boolean;
}

/** Identity helper, so editors typecheck a descriptor as you write it. */
export function defineFile(descriptor: FsDescriptor): FsDescriptor {
  return descriptor;
}

export type { FsNode };
