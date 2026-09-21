import { defineProfile } from "./src/core/profile.ts";
import en from "./src/i18n/messages/en.ts";

/**
 * The languages this site ships, in rotation order.
 *
 * This example is English-only, and that is the whole of it: `en` is the
 * one catalogue imported, so every other language this repo ships stays
 * out of the build. Want Russian too? Add the import and list it here —
 * `Localized` will then point at every field below that needs
 * translating, so a half-translated site can't ship.
 */
export const MESSAGES = { en };

/**
 * ─────────────────────────────────────────────────────────────────────
 *  EXAMPLE PROFILE — a fictional data engineer, English only.
 *
 *  Copy over profile.config.ts and edit. Domains use the reserved
 *  `.example` TLD (RFC 2606), so nothing here resolves anywhere real.
 *
 *  Nothing outside this file needs touching to go English-only — the
 *  locale set is MESSAGES above, and no source file carries a second
 *  copy of that list.
 * ─────────────────────────────────────────────────────────────────────
 */
export default defineProfile(MESSAGES, {
  /**
   * Your name, the way the site should say it — the CV's heading, every page
   * title and share card, the © line, JSON-LD, llms.txt.
   */
  author: {
    en: "Marina Volkova",
  },

  /**
   * The fake shell itself: who's logged in, where, what it looks like on a
   * first visit, and the chrome around the window.
   */
  terminal: {
    /**
     * The visitor's account — the `guest` in guest@marina.example — used by the
     * prompt, whoami, the boot greeting and the "logged in" half of who/w.
     * Default "guest".
     */
    // handle: "guest",
    /**
     * The prompt, `uname`, every page title, og:site_name and the manifest's
     * short name. Defaults to the host of SITE_URL — where the site is
     * published.
     */
    hostname: "marina.example",
    /**
     * Where the language toggle starts; the set is MESSAGES at the top of
     * this file. Default: its first entry.
     */
    // defaultLocale: "en",
    /** A theme name from src/themes/, or "random" to deal one per first visit. Default "green". */
    defaultTheme: "random",
    /** Background rain for a first-time visitor (default "on"); `matrix on|off` is remembered. */
    // defaultMatrix: "on",
    /** The fake dmesg sequence before the terminal, once per session. Default true. */
    // bootScreen: true,
    /** The tappable command chips under the terminal. Default true. */
    // chips: true,
    /** Commands to leave out entirely — gone from help, completion and chips. */
    // disabledCommands: ["terraform", "kubectl"],
    /**
     * Extra topbar links. The CV link is added automatically when `cv` is
     * configured, so this is for anything else you want up there.
     */
    links: [
      { label: "blog", href: "https://blog.marina.example" },
      { label: "talks", href: "https://talks.marina.example" },
    ],
    /** The footer under the window, on every page. Omit the block for the defaults. */
    footer: {
      /** The generated `© year name`, linked to the site root. Default true. */
      // copyright: true,
      /** Terminal page only, plain text. Omit for the built-in "type help to explore". */
      hint: { en: "start with help, then wander" },
      /** The `back to terminal` link on the CV and 404 pages. Default true. */
      // backToTerminal: true,
      /**
       * A line under the rest, same in every language. Rendered as HTML — keep it
       * short. Default: the terminal-portfolio credit line; "" turns it off.
       */
      // bottomText: "",
    },
  },

  /**
   * What machines see: descriptions, structured data, the discovery files,
   * the 404 page — and a switch for each.
   */
  seo: {
    /**
     * What you do, in one line, for machines: JSON-LD jobTitle, the no-JS
     * fallback, llms.txt. Not shown on a page — that's cv.tagline and neofetch.
     * Omit and each of those leaves it out.
     */
    role: {
      en: "Data Engineer — Analytics Platform",
    },
    /**
     * The meta and share-card description of the terminal page, the manifest,
     * and llms.txt. The CV pages use cv.description; the 404 describes itself.
     * Omit and the tags are left out — `npm run check` warns.
     */
    description: {
      en: "Interactive terminal portfolio of a data engineer with 10 years of experience. Type `help` to explore.",
    },
    /** Every enable* switch below defaults to true; the whole seo block can be omitted. */
    /**
     * The 404 page (404.html) — what the host serves for a missing URL. Off
     * for a host that serves its own; the 404 cat is then not shipped either.
     */
    // enable404: true,
    /** robots.txt: per-crawler rules, Content-Signal, and the sitemap line. */
    // enableRobotsTxt: true,
    /** Adds <meta name="robots" content="noindex"> to every page — for a staging deploy. */
    // noindex: true,
    /** robots.txt Content-Signal: may the content be searched, train models, feed AI answers. Default all true. */
    // contentSignal: { search: true, aiTrain: true, aiInput: true },
    /** sitemap.xml: the home page and every CV page, with the portrait. */
    // enableSitemap: true,
    /** llms.txt: the index for AI agents, per the llms.txt spec. */
    // enableLlmsTxt: true,
    /** The Person JSON-LD on the terminal page and every CV page. */
    // enableJsonLd: true,
    /** The terminal page's static summary — read by crawlers, shown without JS, screen-reader-only otherwise. */
    // enableStaticSummary: true,
    /** The og:* and twitter:card share tags on every page; off makes ogImage inert. */
    // enableSocialCards: true,
    /** The share-card image for the terminal and 404 pages; the CV uses cv.photo. */
    // ogImage: "/assets/img/og-terminal.png",
  },

  /**
   * The card the terminal prints on boot and on `neofetch`. Omit it and there
   * is no card: no `neofetch` command, the intro is just the welcome lines.
   */
  neofetch: {
    /**
     * The art on the left. Raw HTML: the .outline/.eye/.nose spans take the
     * theme's colours; plain text works too.
     */
    ascii: `<span class="outline">  ╭───────────╮
  │ </span><span class="eye">▪ ▪ ▪ ▪ ▪</span><span class="outline"> │
  ├───────────┤
  │ </span><span class="nose">◆</span><span class="outline"> ░░░░░░░ │
  ├───────────┤
  │ ░░░░░░░░░ │
  ╰───────────╯</span>`,
    /**
     * The rows on the right, top to bottom. Plain text; `highlight` paints a
     * value amber.
     */
    rows: [
      {
        key: { en: "Name" },
        value: { en: "Marina Volkova" },
      },
      { key: { en: "Role" }, value: { en: "Data Engineer" } },
      {
        key: { en: "Uptime" },
        value: { en: "10+ years in pipelines" },
      },
      { key: { en: "Shell" }, value: { en: "/bin/zsh" } },
      {
        key: { en: "Stack" },
        value: {
          en: "Snowflake · dbt · Airflow · Kafka",
        },
      },
      {
        key: { en: "Status" },
        value: {
          en: "open to interesting problems",
        },
        highlight: true,
      },
    ],

    /**
     * The live "Playing" row in the neofetch card. Delete this whole block
     * (or blank the endpoint) to turn the widget off: the row isn't rendered
     * at all and no request is ever made — neofetch just ends at Status.
     * An endpoint that's set but unreachable keeps the row and shows
     * "spotify offline" instead.
     */
    nowPlaying: {
      /** Returns JSON { is_playing, track, artist, url } — see src/core/nowplaying.ts. A path like `/api/now-playing` when the widget runs as a Cloudflare Worker on your domain. */
      endpoint: "https://api.marina.example/now-playing",
      /** How often to ask it, in milliseconds. */
      pollMs: 20000,
    },
  },

  /**
   * Line breaks matter: `about` types this out one line at a time. Omit for
   * no `about` command and no about.txt.
   */
  bio: {
    en: `Data engineer with ten years spent turning messy operational data
into models people actually trust.

I build batch and streaming pipelines, keep warehouses fast and cheap,
and care rather too much about column naming. Most of my work is the
unglamorous kind: backfills that don't melt the cluster, tests that fail
before a dashboard lies, and documentation someone reads at 2am.`,
  },

  /**
   * `contexts` omitted means "everywhere". The CV shows the full table;
   * the terminal shows the readable subset. Omit the list for no `skills` at all.
   */
  skills: [
    { key: { en: "Languages" }, value: "Python, SQL, Scala, Bash", contexts: ["cv"] },
    { key: { en: "Warehouses" }, value: "Snowflake, BigQuery, Redshift, ClickHouse" },
    { key: { en: "Orchestration" }, value: "Airflow, Dagster, dbt Cloud" },
    { key: { en: "Streaming" }, value: "Kafka, Flink, Kinesis, Debezium" },
    {
      key: { en: "Modelling" },
      value: "dbt, Kimball, Data Vault 2.0, slowly changing dimensions",
      contexts: ["cv"],
    },
    { key: { en: "Storage" }, value: "S3, Delta Lake, Apache Iceberg, Parquet", contexts: ["cv"] },
    { key: { en: "Cloud" }, value: "AWS (primarily), GCP" },
    { key: { en: "BI" }, value: "Looker, Metabase, Superset, Tableau", contexts: ["cv"] },
    {
      key: { en: "Infrastructure" },
      value: "Terraform, Docker, Kubernetes, GitLab CI",
      contexts: ["cv"],
    },
    { key: { en: "Data quality" }, value: "dbt tests, Great Expectations, Soda, OpenLineage" },
  ],

  /**
   * Contact links: `contact`, `cat contact.txt`, the CV's contact row, the
   * no-JS fallback, llms.txt, and JSON-LD sameAs (http ones) / email (the
   * first mailto:). `contexts` omitted means everywhere. Omit the list for no
   * `contact` at all.
   */
  socials: [
    { label: "Email", href: "mailto:hello@marina.example", display: "hello@marina.example" },
    {
      label: "Website",
      href: "https://marina.example",
      display: "marina.example",
      contexts: ["cv"],
    },
    {
      label: "Telegram",
      href: "https://t.me/marina-volkova-demo",
      display: "@marina-volkova-demo",
    },
    {
      label: "GitHub",
      href: "https://github.com/marina-volkova-demo",
      display: "marina-volkova-demo",
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/marina-volkova-demo",
      display: "marina-volkova-demo",
    },
    {
      contexts: ["terminal"],
      label: "Mastodon",
      href: "https://fosstodon.org/@marina_volkova_demo",
      display: "@marina_volkova_demo",
    },
  ],

  /**
   * Per-command settings: help descriptions, the fake machine, the game, ssh.
   * Omit the whole block for every default and no game / ssh personas.
   */
  commands: {
    /**
     * Overrides a command's one-line description in `help`. Anything not
     * listed here falls back to `commands.<name>` in src/i18n/messages/.
     * Use it for lines that carry your name or your voice.
     */
    descriptions: {
      about: {
        en: "who is this marina person anyway",
      },
    },

    /**
     * The fake-system commands (ps, who, w, env) show two accounts: the
     * visitor, who is terminal.handle, and the machine's owner — you.
     */
    system: {
      /** The account those commands show as the machine's owner. Not translated. */
      owner: "marina",
      /**
       * When the machine came up: `uptime` counts from it, `uname -a` and
       * `ls -l` stamp it. Omit to count from the build instead.
       */
      since: "2026-03-14T09:15:00+01:00",
      /**
       * What the secret light theme is called once `claude "add light theme"` is
       * asked twice. Omit and it isn't offered at all.
       */
      secretTheme: "daylight",
    },

    /**
     * The hidden game: a page opened in a sandboxed CRT overlay. Omit the
     * whole block to remove the `game` command and the launcher script.
     */
    game: {
      /** What the overlay's iframe loads. */
      url: "https://game.marina.example/",
      /** Shown in the overlay's title bar and the "launching …" line. */
      title: { en: "Backfill Quest" },
      /** The launcher: `ls -a` lists it, `sudo ./backfill.sh` opens the game. */
      script: "backfill.sh",
    },

    /**
     * `ssh <name>` connects to a persona that answers scripted questions —
     * the recruiter screening call, without the call. Omit for none.
     */
    ssh: {
      /**
       * One entry per name: the host shown in the prompt, and cmd → q → a
       * triples the visitor types `cmd` to ask.
       */
      personas: {
        recruiter: {
          host: "recruiter@marina.example",
          qa: [
            {
              cmd: "why",
              q: { en: "Why should we hire you?" },
              a: {
                en: "Ten years of making data trustworthy rather than merely available. I ship pipelines that other teams stop worrying about, and I write the runbook before I'm asked.",
              },
            },
            {
              cmd: "favorite",
              q: {
                en: "What's your favorite part of the job?",
              },
              a: {
                en: "Deleting a pipeline. Every one I remove is a model that turned out to be simpler than we thought.",
              },
            },
            {
              cmd: "incident",
              q: {
                en: "Tell me about an incident you handled.",
              },
              a: {
                en: "A timezone change silently shifted a daily partition by an hour. Six dashboards were wrong for nine days. Now every model has a freshness test, and I still check timezone handling first.",
              },
            },
            {
              cmd: "goals",
              q: { en: "What are you looking for next?" },
              a: {
                en: "A team that treats data as a product, with real ownership and a roadmap — not a ticket queue attached to a warehouse.",
              },
            },
            {
              cmd: "salary",
              q: { en: "Salary expectations?" },
              a: {
                en: "Negotiable, and better discussed over email than in a terminal easter egg :)",
              },
            },
          ],
        },
      },
    },
  },

  /**
   * The CV. One page is generated per locale in MESSAGES, at the top.
   * Delete this whole key and the CV disappears: no pages, no `cv` command,
   * no cv.html in `ls`, no sitemap rows — just the terminal.
   */
  cv: {
    /**
     * The line under your name on the CV — the role, plus how long you've
     * been at it. CV page only.
     */
    tagline: {
      en: "Data Engineer — Analytics Platform · 10y experience",
    },
    /** The CV pages' meta and share-card description; omit to reuse seo.description. */
    description: {
      en: "Data Engineer — CV / résumé. Spark, Airflow, dbt, Kafka, Snowflake.",
    },

    /**
     * Portrait, root-absolute, under public/assets/img/portraits/ — only the
     * file named here survives the build; the example portraits are pruned.
     * Also the CV's og:image, JSON-LD image and sitemap image.
     */
    photo: "/assets/img/portraits/marina-photo.png",
    /**
     * "pixel": a posterized pixel render under the theme tint. "tint": just the
     * grayscale + tint. Leave it out and the photo is served exactly as uploaded.
     */
    photoStyle: "pixel",
    /** The CV pages' share image. Omit for the portrait; the terminal card is one option. */
    // ogImage: "/assets/img/og-terminal.png",

    /** The line under the contact row on the CV. */
    metaLine: {
      en: "Belgrade, Serbia · EU work authorisation · remote-first, open to hybrid in CET",
    },

    /** The first section of the CV, before the experience. */
    about: {
      en: "Data engineer with ten years spent turning messy operational data into models people actually trust. I build batch and streaming pipelines, keep warehouses fast and cheap, and care rather too much about column naming. Looking for a team that treats data as a product — with real ownership, a roadmap, and the patience to model things properly the first time.",
    },

    /**
     * Experience, most recent first. `id` is a stable anchor; `bullets` are
     * one line each per locale; `org.url` empty or omitted renders no link.
     */
    jobs: [
      {
        id: "northwind",
        dates: { en: "Mar 2022 – Sep 2025" },
        span: { en: "3y 7m" },
        org: {
          name: "Northwind Analytics",
          url: "https://northwind.example",
          location: { en: "Belgrade" },
        },
        title: { en: "Senior Data Engineer" },
        tech: "Snowflake, dbt, Airflow, Kafka, Python, Terraform, AWS (S3, MSK, Glue, Lambda), Looker",
        bullets: {
          en: [
            "Rebuilt the core revenue model in dbt, cutting a 40-minute nightly run to under six",
            "Introduced contract tests between ingestion and modelling, ending a recurring class of silent schema breaks",
            "Migrated 300+ legacy SQL jobs to Airflow with no reporting downtime",
            "Cut Snowflake spend by 38% through clustering, warehouse right-sizing and killing three unused pipelines",
            "Built a self-serve staging layer so analysts stopped filing tickets for one-off joins",
            "Mentored two juniors into owning their own domains end to end",
          ],
        },
      },
      {
        id: "lumen",
        dates: { en: "Aug 2019 – Feb 2022" },
        span: { en: "2y 7m" },
        org: {
          name: "Lumen Retail Group",
          url: "https://lumen-retail.example",
          location: { en: "Amsterdam · remote" },
        },
        title: { en: "Data Engineer" },
        tech: "BigQuery, Airflow, Python, Debezium, Kafka, Dataflow, GCP, Metabase",
        bullets: {
          en: [
            "Built change-data-capture from twelve store databases into BigQuery with sub-minute lag",
            "Designed the inventory data model that replaced four conflicting spreadsheets",
            "Automated the nightly reconciliation that finance had run by hand for three years",
            "Added lineage and freshness alerting, cutting mean time to detect a stale dashboard from days to minutes",
            "Wrote the onboarding guide new analysts still use",
          ],
        },
      },
      {
        id: "kestrel",
        dates: { en: "Jan 2018 – Jul 2019" },
        span: { en: "1y 7m" },
        org: {
          name: "Kestrel Labs",
          url: "https://kestrel-labs.example",
          location: { en: "Berlin" },
        },
        title: { en: "Analytics Engineer" },
        tech: "Redshift, dbt, Python, Looker, Airflow, PostgreSQL",
        bullets: {
          en: [
            "Introduced dbt to a team that had been maintaining 200 hand-written views",
            "Defined the company's first shared metric layer, ending three competing definitions of 'active user'",
            "Reduced Looker dashboard load times by an order of magnitude through pre-aggregation",
            "Ran a weekly data clinic that turned ad-hoc requests into reusable models",
          ],
        },
      },
      {
        id: "meridian",
        dates: { en: "Sep 2016 – Dec 2017" },
        span: { en: "1y 4m" },
        org: {
          name: "Meridian Bank",
          url: "",
          location: { en: "Warsaw" },
        },
        title: { en: "BI Developer" },
        tech: "SQL Server, SSIS, SSAS, Tableau, T-SQL, Python",
        bullets: {
          en: [
            "Owned regulatory reporting pipelines under a fixed monthly deadline that never slipped",
            "Rewrote the risk data mart, halving the month-end close window",
            "Documented every legacy SSIS package so the migration that followed was possible at all",
          ],
        },
      },
      {
        id: "orion",
        dates: { en: "Jun 2015 – Aug 2016" },
        span: { en: "1y 3m" },
        org: {
          name: "Orion Media",
          url: "https://orion-media.example",
          location: { en: "Kraków" },
        },
        title: { en: "Junior Data Analyst" },
        tech: "PostgreSQL, Python (pandas), Excel, Google Analytics",
        bullets: {
          en: [
            "Built the first automated weekly audience report, replacing a two-day manual assembly",
            "Learned more about data quality from one bad UTM convention than from any course since",
          ],
        },
      },
    ],

    /** One line on the CV: university — place, year / field. */
    education: {
      university: {
        en: "Kraków Institute of Technology",
      },
      place: { en: "Kraków" },
      year: 2015,
      field: {
        en: "Applied Mathematics and Computer Science",
      },
    },

    /**
     * Certifications, as printed — names aren't translated. Also JSON-LD
     * hasCredential.
     */
    certs: [
      { year: "2025", name: "Google Cloud Professional Data Engineer" },
      { year: "2024", name: "dbt Analytics Engineering Certification" },
      { year: "2023", name: "AWS Certified Data Analytics – Specialty" },
      { year: "2021", name: "Databricks Certified Data Engineer Associate" },
      { year: "2019", name: "Confluent Certified Developer for Apache Kafka" },
    ],

    /** `filled` is the 0–10 proficiency meter; `sub` is the text beside it. */
    languages: [
      { name: { en: "Polish" }, filled: 10, sub: { en: "Native" } },
      { name: { en: "English" }, filled: 9, sub: { en: "C1 — Advanced" } },
      { name: { en: "Serbian" }, filled: 5, sub: { en: "B1 — Intermediate" } },
      { name: { en: "German" }, filled: 3, sub: { en: "A2 — Elementary" } },
    ],

    /** The playful "notes.txt" list at the foot of the CV. */
    traits: {
      en: [
        "will rename your columns and you will thank me later",
        "reads query plans for fun, which is its own diagnosis",
        'allergic to the phrase "we\'ll clean it up downstream"',
        "can explain a slowly changing dimension to a non-technical stakeholder",
        "keeps a personal list of every timezone bug I've caused",
        "believes the best dashboard is the one nobody needs to open",
        "patient with people, impatient with unlogged failures",
        "conversational in four languages, fluent in none before coffee",
        "still proudest of a pipeline I deleted",
      ],
    },

    /** The closing line, plain text. Rendered as `$ echo "…"` with a blinking cursor. */
    signOff: {
      en: "if you read this far, you'd probably enjoy working together.",
    },
  },
});
