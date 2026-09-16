import type { Localized, Locale } from "../i18n/locales";
import { escapeHtml } from "./html";

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
  /**
   * The line under your name on the CV — typically `identity.role` plus
   * how long you've been at it. CV page only; omit for no line.
   */
  tagline?: Localized;
  /**
   * Portrait, root-absolute, under public/assets/img/portraits/ — only the
   * file named here survives the build. Shown on the CV, used as its
   * JSON-LD `image`, og:image and sitemap image. Omit for no portrait.
   */
  photo?: string;
  /**
   * How the CV renders the portrait on screen.
   *
   * - unset / `"plain"` — exactly as uploaded, colour and all
   * - `"tint"` — grayscale under the theme colour; for a photo that is
   *   already styled the way you want, like a hand-made pixel render
   * - `"pixel"` — the full terminal look: a posterized pixel render under
   *   the theme tint, so any photo reads as part of the site
   *
   * Print shows the source photo in grayscale whichever is set.
   */
  photoStyle?: "pixel" | "tint" | "plain";

  /** The line under the contact row: location, availability, and so on. */
  metaLine?: Localized;

  /** Opening paragraph, shown under the contact row. */
  about?: Localized;

  jobs?: Job[];

  education?: { university: Localized; place: Localized; year: number; field: Localized };

  certs?: Array<{ year: string; name: string }>;

  /** `filled` drives the 0–10 proficiency meter. */
  languages?: Array<{ name: Localized; filled: number; sub: Localized }>;

  /** The playful "notes.txt" list at the foot of the page. */
  traits?: Localized<string[]>;

  /**
   * Closing line, as plain text. Rendered as `$ echo "…"` with a blinking
   * cursor — the shell dressing and the quotes are added by the renderer.
   */
  signOff?: Localized;
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
  terminal: {
    /**
     * The shell user — the `guest` in `guest@nikita.sh`. It's the visitor's
     * account: the prompt, `whoami`, `pwd`, the boot greeting, and the
     * "logged in" half of `who`/`w`/`ps`. The machine's owner is
     * `commands.system.owner`. Not translated: usernames aren't.
     */
    handle: string;
    /**
     * The hostname in the prompt, `uname` and the window title — cosmetic.
     * Where the site is actually published is `SITE_URL` in `.env`, not
     * here: that's the origin for every absolute URL and the CNAME.
     */
    hostname: string;
    /** The locale set comes from MESSAGES in profile.config.ts. */
    defaultLocale: Locale;
    /** A theme name, or "random" to pick one per first-time visitor. */
    defaultTheme: string | "random";
    /**
     * Whether the background rain is on for a first-time visitor. Their own
     * `matrix on|off` is remembered and wins on later visits, on every page.
     */
    defaultMatrix: "on" | "off";
    /**
     * The fake dmesg boot sequence before the terminal, shown once per
     * browser session. `false` goes straight to the greeting; `dmesg` still
     * prints the lines.
     */
    bootScreen: boolean;
    /**
     * The tappable command chips under the terminal. `false` removes the
     * bar; Tab completion and `help` are unaffected.
     */
    chips: boolean;
    /** Whitelist. When set, only these commands are registered. */
    enabledCommands?: string[];
    /** Blacklist, applied after the whitelist. */
    disabledCommands?: string[];
    /**
     * Extra links in the topbar, after the built-in `cv.html →`, which is
     * added automatically when a CV is configured. Terminal page only.
     */
    links?: Array<{ label: string; href: string }>;
    /** The footer under the window, on every page. */
    footer: {
      /** The generated `© year name`, linked to the site root. */
      copyright: boolean;
      /** Terminal page only; plain text. Omit for the built-in `type help to explore`. */
      hint?: Localized;
      /** The `back to terminal` link on the CV and 404 pages. */
      backToTerminal: boolean;
      /**
       * A line under the rest, on every page, the same in every language.
       * Rendered as HTML — the one field besides `neofetch.ascii` that is.
       * Omit for none.
       */
      bottomText?: string;
    };
  };

  identity: {
    name: Localized;
    /**
     * What you do, in one line. With `name` it makes the terminal page's
     * `<title>` and og:title (`name — role`), the JSON-LD `jobTitle`, the
     * no-JS fallback and llms.txt. The CV shows `cv.tagline` instead.
     */
    role: Localized;
  };

  seo: {
    /** The `<meta name="description">` and og:description on every page. */
    description: Localized;
    /**
     * Where you are, for the CV's JSON-LD address and the terminal's no-JS
     * fallback. Not shown on any rendered page — the CV's visible line is
     * `cv.metaLine`.
     */
    location: Localized;
    /**
     * Path under the site root, e.g. "/assets/img/og-terminal.png". The
     * og:image of the terminal and 404 pages; inert with `enableSocialCards`
     * off. The CV pages use `cv.photo` instead.
     */
    ogImage?: string;
    /** Adds <meta name="robots" content="noindex"> to every page. */
    noindex?: boolean;
    /** Emit robots.txt: per-crawler rules, Content-Signal, the sitemap line. */
    enableRobotsTxt: boolean;
    /**
     * robots.txt's `Content-Signal`: what the content may be used for —
     * search indexing, AI model training, inference-time input — as opposed
     * to whether it may be fetched. Ignored by crawlers that don't support
     * it. Rendered as `search=yes, ai-train=no, ai-input=yes`.
     */
    contentSignal: { search: boolean; aiTrain: boolean; aiInput: boolean };
    /** Emit sitemap.xml: the home page and every CV page, with the portrait. */
    enableSitemap: boolean;
    /** Emit llms.txt, the index for AI agents (https://llmstxt.org). */
    enableLlmsTxt: boolean;
    /** The `Person` JSON-LD on the terminal page and every CV page. */
    enableJsonLd: boolean;
    /**
     * The `<noscript>` block on the terminal page — role, location, about,
     * skills and contact for crawlers and no-JS clients. The CV is static
     * HTML already and has none.
     */
    enableNoscript: boolean;
    /** The share-preview tags on every page: `og:*` and `twitter:card`. */
    enableSocialCards: boolean;
  };

  neofetch: {
    /** ASCII art, may contain markup (.outline/.eye/.nose spans). */
    ascii: string;
    /**
     * The card's rows, top to bottom. Values are plain text and escaped;
     * `highlight: true` renders one in the amber accent — the Status row,
     * typically. The `Playing` row is added separately by `nowPlaying`.
     */
    rows: Array<{ key: Localized; value: Localized; highlight?: boolean }>;
    /**
     * The live "Playing" row at the foot of the card. Omit and the row isn't
     * rendered and no request is made; an endpoint that's set but unreachable
     * keeps the row and shows "spotify offline".
     */
    nowPlaying?: {
      endpoint: string;
      pollMs: number;
    };
  };

  /** `about` and `cat about.txt`. Line breaks are load-bearing — the
   *  terminal types this out line by line. */
  bio: Localized;

  /** `skills` and `cat skills.txt`. */
  skills: Skill[];

  /** `contact` and `cat contact.txt`. */
  socials: Social[];

  /**
   * Per-command configuration: help-line overrides, the fake-system
   * account, and the two commands that carry their own data — `ssh`'s
   * personas and `game`'s launcher.
   */
  commands: {
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
       * things, as opposed to `terminal.handle`, which is the visitor.
       * Defaults to "root".
       */
      owner?: string;
      /**
       * When the machine came up — `uptime` counts from it, `uname -a` and
       * `ls -l` stamp it. ISO 8601 with an offset, e.g.
       * "2026-08-09T20:48:27+03:00". Omit to count from the moment the site
       * was built.
       */
      since?: string;
      /**
       * The name the secret theme (src/themes/secret.css, a light one) goes
       * by once `claude "add light theme"` unlocks it on the second try —
       * what `theme` lists and the visitor types. Omit and the secret theme
       * isn't offered at all: the egg stays at won't-fix.
       */
      secretTheme?: string;
    };

    /** The `game` command and its launcher script. Omit to remove both. */
    game?: {
      url: string;
      title: string;
      /**
       * The fake shell script that launches it — `ls -a` lists it,
       * `./<script>` is denied, `sudo ./<script>` runs it. A bare filename.
       */
      script: string;
    };

    /** `ssh <name>` personas. Omit, or leave `personas` empty, for none. */
    ssh?: {
      personas: Record<string, Persona>;
    };
  };

  /**
   * The CV. Omit to drop the pages, the `cv` command and the filesystem
   * node entirely — a fork with no résumé to publish deletes this key.
   * One page is generated per locale in `MESSAGES` (profile.config.ts).
   */
  cv?: CvConfig;
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
 * The address JSON-LD publishes as `email` — the first `mailto:` social's
 * href, with its scheme, or nothing. Derived rather than configured so the
 * address a crawler reads is the one a visitor sees; the config used to
 * carry it twice and nothing kept them in step.
 */
/** The `Content-Signal` line's value, from `seo.contentSignal`. */
export function renderContentSignal(profile: ProfileConfig): string {
  const { search, aiTrain, aiInput } = profile.seo.contentSignal;
  const yn = (v: boolean): string => (v ? "yes" : "no");
  return `search=${yn(search)}, ai-train=${yn(aiTrain)}, ai-input=${yn(aiInput)}`;
}

export function mailtoFor(profile: ProfileConfig): string | undefined {
  return profile.socials.find((s) => s.href.startsWith("mailto:"))?.href;
}

/**
 * The © line: `© <year> <name>`, the name linking to the site's own root.
 * Generated rather than configured — it used to be a chunk of HTML in the
 * config, once per locale, carrying the name a second time.
 *
 * `origin` is SITE_URL: the browser pages pass the inlined `__SITE_URL__`,
 * the Vite plugin passes its own constant, since `define` doesn't reach
 * code running in Node at config time. Empty (dev, no .env) falls back to
 * `/`, which resolves to the same place. Shared so the three pages can't
 * disagree.
 */
export function renderCopyright(profile: ProfileConfig, locale: Locale, origin: string): string {
  const year = new Date().getFullYear();
  return `© ${year} <a href="${escapeHtml(origin || "/")}">${escapeHtml(profile.identity.name[locale])}</a>`;
}

/**
 * The footer's HTML, shared by the terminal, the 404 and the CV so the
 * three can't drift: `[© year name] · [tail]`, then `bottomText` on its own
 * line. `tail` is the page's own already-localised HTML — the terminal's
 * hint or the back link — since this module can't reach the catalogues.
 * Empty when every part is off; the callers can still set it blindly.
 */
export function renderFooter(profile: ProfileConfig, locale: Locale, origin: string, tail: string): string {
  const { footer } = profile.terminal;
  const line = [footer.copyright ? renderCopyright(profile, locale, origin) : "", tail]
    .filter(Boolean)
    .join(" · ");
  const bottom = footer.bottomText ? `<div class="footer-bottom">${footer.bottomText}</div>` : "";
  return line + bottom;
}

/** Identity helper — exists purely so editors typecheck profile.config.ts. */
export function defineProfile(config: ProfileConfig): ProfileConfig {
  return config;
}
