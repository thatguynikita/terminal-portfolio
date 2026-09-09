/**
 * Pure completion logic, kept out of `input.ts` so it can be tested
 * without a DOM — both of the bugs this file exists to prevent were
 * predicate mistakes that no DOM-level test would have caught either.
 */

export interface InputParts {
  /** The command name, or null when the first word is still being typed. */
  base: string | null;
  /** Everything up to and including the first space — the unchanged head. */
  head: string;
  /** The lowercased fragment being completed. */
  prefix: string;
}

export function splitInput(raw: string): InputParts {
  const spaceIndex = raw.indexOf(" ");
  if (spaceIndex === -1) return { base: null, head: "", prefix: raw.toLowerCase() };
  return {
    base: raw.slice(0, spaceIndex).toLowerCase(),
    head: raw.slice(0, spaceIndex + 1),
    prefix: raw.slice(spaceIndex + 1).toLowerCase(),
  };
}

/**
 * Given the candidates for an argument, is `prefix` already a complete
 * command that should run — or does it only narrow the options, so the
 * input should stay open?
 *
 * Exact match wins. A chip's value is always a complete intended command,
 * so `lang en` must run even when a longer `en-GB` also matches; testing
 * only "does anything extend this?" would leave it sitting in the input.
 * (Tab completion is different — there, ambiguity should pause.)
 */
export function isCompleteArgument(candidates: readonly string[], prefix: string): boolean {
  if (candidates.includes(prefix)) return true;
  return !candidates.some((c) => c.startsWith(prefix) && c.length > prefix.length);
}
