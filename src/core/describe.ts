import { lookup } from "../i18n/index.ts";
import type { Locale } from "../i18n/locales.ts";
import type { ProfileConfig } from "./profile.ts";

/**
 * A command's one-line description for `help`.
 *
 * Precedence is config first, message catalogue second: `profile.commands`
 * lets a fork reword a description that carries a name or a turn of phrase
 * without touching `src/i18n/`.
 *
 * Returns "" when neither source has one — which is what lets the registry
 * test assert that every visible command is described *somewhere*, rather
 * than checking only the catalogue and missing config-only descriptions.
 */
export function commandDescription(
  profile: ProfileConfig,
  locale: Locale,
  name: string
): string {
  const override = profile.commands?.descriptions?.[name]?.[locale];
  if (typeof override === "string" && override.trim() !== "") return override;

  const fallback = lookup(locale, `commands.${name}`);
  return typeof fallback === "string" ? fallback : "";
}

/** Neutral default: a fork that configures nothing still reads sensibly. */
const DEFAULT_OWNER = "root";

/**
 * The account the fake-system commands (`ps`, `who`, `w`, `env`) show as
 * owning the machine — you, as opposed to `terminal.handle`, the visitor.
 *
 * Shared rather than read inline by each command, so the four of them
 * cannot drift apart on the fallback.
 */
export function systemOwner(profile: ProfileConfig): string {
  const owner = profile.commands?.system?.owner;
  return typeof owner === "string" && owner.trim() !== "" ? owner.trim() : DEFAULT_OWNER;
}

/**
 * When the machine came up: `commands.system.since` if it parses, else the
 * build. `uptime` counts from it and `uname -a` / `ls -l` stamp it, so all
 * three agree.
 */
export function systemSince(profile: ProfileConfig): Date {
  const configured = profile.commands?.system?.since;
  if (typeof configured === "string") {
    const parsed = new Date(configured);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  return new Date(__BUILD_TIME__);
}
