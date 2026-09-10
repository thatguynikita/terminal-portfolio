import type { Localized, Locale } from "../i18n/locales";

/** Where an entry is shown. Omitted means everywhere. */
export type Context = "terminal" | "cv";

/** A contact link. `display` is the visible text; `href` the target. */
export interface Social {
  label: string;
  href: string;
  display: string;
  /** e.g. a personal site belongs on the CV but not in the terminal. */
  contexts?: Context[];
}

/** One row of the `skills` table and of `cat skills.txt`. */
export interface Skill {
  key: Localized;
  /** Tech/product names — not translated. */
  value: string;
  /** The CV shows the full list; the terminal shows a readable subset. */
  contexts?: Context[];
}

/** One position in the CV's experience section. */
export interface Job {
  /** Stable identifier, useful for anchors and diffs. */
  id: string;
  dates: Localized;
  /** Duration, e.g. "2y 11m". */
  span: Localized;
  org: {
    name: string;
    /** Employer's site. Empty or omitted renders the name unlinked. */
    url?: string;
    location: Localized;
  };
  title: Localized;
  /** Comma-separated stack. Not translated. */
  tech: string;
  bullets: Localized<string[]>;
}

/**
 * Every section is optional. Omit one and it simply isn't rendered — no
 * empty heading, no stray rule. `cv: {}` is a valid CV: you get the header
 * (name, tagline, contacts, portrait) and nothing else.
 */
export interface CvConfig {
  /** The line under the contact row: location, availability, and so on. */
  metaLine?: Localized;
  /** Opening paragraph, shown under the contact row. */
  about?: Localized;
  jobs?: Job[];
  /** The playful "notes.txt" list at the foot of the page. */
  traits?: Localized<string[]>;
  /** Closing line. Rendered as HTML, so it can carry markup. */
  signOff?: Localized;
  education?: { university: Localized; place: Localized; year: number; field: Localized };
  certs?: Array<{ year: string; name: string }>;
  /** `filled` drives the 0–10 proficiency meter. */
  languages?: Array<{ name: Localized; filled: number; sub: Localized }>;
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
    /**
     * The domain this site is deployed to — emitted as `CNAME` and used as
     * the canonical URL. Not the same as `terminal.hostname`, which is the
     * cosmetic hostname in the prompt and `uname`.
     */
    domain: string;
    role: Localized;
    email: string;
    location: Localized;
    /** One-line summary under the role, used by the noscript/SEO fallback. */
    tagline: Localized;
    /** Portrait, root-absolute. Shown on the CV and used as JSON-LD `image`. */
    photo?: string;
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

  /** Per-command configuration. */
  commands?: {
    /**
     * Overrides the help-line description for a command, keyed by command
     * name. Anything not listed falls back to `commands.<name>` in
     * `src/i18n/<locale>.ts`.
     *
     * Use it for descriptions carrying your name or voice — a fork should
     * be able to reword them without editing the message catalogues.
     */
    descriptions?: Record<string, Localized>;

    /** Shared by the fake-system commands: `ps`, `who`, `w`, `env`. */
    system?: {
      /**
       * The machine's owner — the account those commands show running
       * things, as opposed to `identity.handle`, which is the visitor.
       * Defaults to "root".
       */
      owner?: string;
    };
  };

  links?: {
    /** Rendered top-right in the topbar. Empty/omitted renders nothing. */
    topbar?: Array<{ label: string; href: string }>;
  };

  /**
   * The CV. Omit to drop the pages, the `cv` command and the filesystem
   * node entirely — a fork with no résumé to publish deletes this key.
   * One page is generated per locale in `terminal.locales`.
   */
  cv?: CvConfig;

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
    /** Adds <meta name="robots" content="noindex"> to every page. */
    noindex?: boolean;
  };

  footer: {
    /** Rendered as-is; `{year}` is substituted. */
    copyright: Localized;
  };
}

/** Entries with no `contexts` are shown everywhere. */
function shownIn<T extends { contexts?: Context[] }>(items: T[], context: Context): T[] {
  return items.filter((item) => !item.contexts || item.contexts.includes(context));
}

/** The skills table for a given page. */
export function skillsFor(profile: ProfileConfig, context: Context): Skill[] {
  return shownIn(profile.skills, context);
}

/** The contact links for a given page. */
export function socialsFor(profile: ProfileConfig, context: Context): Social[] {
  return shownIn(profile.socials, context);
}

/**
 * The © line, with `{year}` filled in. Returned as HTML, since the
 * configured string carries a link to the author's site.
 *
 * Shared so the three pages can't disagree — the CV used to build its own
 * and lost the link on the name.
 */
export function renderCopyright(profile: ProfileConfig, locale: Locale): string {
  return profile.footer.copyright[locale].replace("{year}", String(new Date().getFullYear()));
}

/** Identity helper — exists purely so editors typecheck profile.config.ts. */
export function defineProfile(config: ProfileConfig): ProfileConfig {
  return config;
}
