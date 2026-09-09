import en from "./en";
import ru from "./ru";
import type { Messages } from "./en";
import { LOCALES, type Locale } from "./locales";

/**
 * Registered message catalogues. To add a language: create the file,
 * add its code to LOCALES, and register it here.
 */
export const messages: Record<Locale, Messages> = { en, ru };

export type { Messages, Locale };
export { LOCALES };

const DEFAULT_LOCALE: Locale = "en";

/** Walks a dotted path like "ssh.failFirst" through a nested object. */
function resolve(source: unknown, key: string): unknown {
  let node: unknown = source;
  for (const part of key.split(".")) {
    if (node === null || typeof node !== "object") return undefined;
    node = (node as Record<string, unknown>)[part];
  }
  return node;
}

/** Substitutes `{name}` placeholders. Unknown names are left as-is. */
export function interpolate(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in vars ? String(vars[name]) : match
  );
}

/**
 * Looks a key up in `locale`, falling back to the default locale.
 * A key missing from both is returned verbatim — visible in the UI rather
 * than silently blank, which is what you want while adding a language.
 */
export function lookup(locale: Locale, key: string): unknown {
  const found = resolve(messages[locale], key);
  if (found !== undefined) return found;
  return resolve(messages[DEFAULT_LOCALE], key);
}

export function translate(
  locale: Locale,
  key: string,
  vars?: Record<string, string | number>
): string {
  const value = lookup(locale, key);
  return typeof value === "string" ? interpolate(value, vars) : key;
}

export function translateList(
  locale: Locale,
  key: string,
  vars?: Record<string, string | number>
): string[] {
  const value = lookup(locale, key);
  if (!Array.isArray(value)) return [];
  return value.map((item) => (typeof item === "string" ? interpolate(item, vars) : String(item)));
}
