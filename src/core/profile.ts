import type { Localized, Locale } from "../i18n/locales";

/** A contact link. `display` is the visible text; `href` the target. */
export interface Social {
  label: string;
  href: string;
  display: string;
}

/** One row of the `skills` table and of `cat skills.txt`. */
export interface Skill {
  key: Localized;
  /** Tech/product names — not translated. */
  value: string;
}

/** One question the `ssh <persona>` mini-shell can answer. */
export interface PersonaQA {
  /** The word the visitor types, e.g. "why". */
  cmd: string;
  q: Localized;
  a: Localized;
}

export interface Persona {
  /** Full host string, e.g. "recruiter@nikita.sh". */
  host: string;
  qa: PersonaQA[];
}

export interface ProfileConfig {
  identity: {
    name: Localized;
    /** Shell user, also used in the prompt and `whoami`. */
    handle: string;
    domain: string;
    role: Localized;
    email: string;
    location: Localized;
    /** One-line summary under the role, used by the noscript/SEO fallback. */
    tagline: Localized;
  };

  /** `about` and `cat about.txt`. Line breaks are load-bearing — the
   *  terminal types this out line by line. */
  bio: Localized;

  /** `skills` and `cat skills.txt`. */
  skills: Skill[];

  /** `contact` and `cat contact.txt`. */
  socials: Social[];

  neofetch: {
    /** ASCII art, may contain markup (.outline/.eye/.nose spans). */
    ascii: string;
    rows: Array<{ key: Localized; value: Localized }>;
  };

  /** Live "now playing" row in neofetch. Omit to disable the row entirely. */
  nowPlaying?: {
    endpoint: string;
    pollMs: number;
  };

  /** `ssh <name>` personas. An empty object disables persona mode. */
  ssh: {
    personas: Record<string, Persona>;
  };

  terminal: {
    hostname: string;
    /** Window-chrome title, e.g. "guest@nikita.sh — bash — 80x24". */
    title?: Localized;
    locales: Locale[];
    defaultLocale: Locale;
    /** A theme name, or "random" to pick one per first-time visitor. */
    defaultTheme: string | "random";
    /** Whitelist. When set, only these commands are registered. */
    enabledCommands?: string[];
    /** Blacklist, applied after the whitelist. */
    disabledCommands?: string[];
  };

  links?: {
    /** Rendered top-right in the topbar. Empty/omitted renders nothing. */
    topbar?: Array<{ label: string; href: string }>;
  };

  /** The `game` command and `milk-quest.sh`. Omit to disable both. */
  game?: {
    url: string;
    title: string;
  };

  seo: {
    title: Localized;
    description: Localized;
    /** Path under the site root, e.g. "/assets/img/og-terminal.png". */
    ogImage?: string;
  };

  footer: {
    /** Rendered as-is; `{year}` is substituted. */
    copyright: Localized;
  };
}

/** Identity helper — exists purely so editors typecheck profile.config.ts. */
export function defineProfile(config: ProfileConfig): ProfileConfig {
  return config;
}
