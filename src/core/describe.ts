import { lookup } from "../i18n";
import type { Locale } from "../i18n/locales";
import type { ProfileConfig } from "./profile";

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
 * owning the machine — you, as opposed to `identity.handle`, the visitor.
 *
 * Shared rather than read inline by each command, so the four of them
 * cannot drift apart on the fallback.
 */
export function systemOwner(profile: ProfileConfig): string {
  const owner = profile.commands?.system?.owner;
  return typeof owner === "string" && owner.trim() !== "" ? owner.trim() : DEFAULT_OWNER;
}
