import { defineProfile } from "./src/core/profile";
import en from "./src/i18n/messages/en";

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
export default defineProfile({
  identity: {
    name: {
      en: "Marina Volkova",
    },
    handle: "guest",
    // Where the site is published: the CNAME the build emits and the
    // canonical URL. Distinct from terminal.hostname below, which is only
    // the hostname shown in the prompt.
    domain: "marina.example",
    role: {
      en: "Data Engineer — Analytics Platform",
    },
    email: "hello@marina.example",
    location: {
      en: "Belgrade, Serbia",
    },
    tagline: {
      en: "Data Engineer — Analytics Platform · 10y experience",
    },
    photo: "/assets/img/portraits/marina-photo.png",
    // "pixel": a posterized pixel render under the theme tint. "tint": just the
    // grayscale + tint. Leave it out and the photo is served exactly as uploaded.
    photoStyle: "pixel",
  },

  // Line breaks matter: `about` types this out one line at a time.
  bio: {
    en: `Data engineer with ten years spent turning messy operational data
into models people actually trust.

I build batch and streaming pipelines, keep warehouses fast and cheap,
and care rather too much about column naming. Most of my work is the
unglamorous kind: backfills that don't melt the cluster, tests that fail
before a dashboard lies, and documentation someone reads at 2am.`,
  },

  // `contexts` omitted means "everywhere". The CV shows the full table;
  // the terminal shows the readable subset.
  skills: [
    { key: { en: "Languages" }, value: "Python, SQL, Scala, Bash", contexts: ["cv"] },
    { key: { en: "Warehouses" }, value: "Snowflake, BigQuery, Redshift, ClickHouse" },
    { key: { en: "Orchestration" }, value: "Airflow, Dagster, dbt Cloud" },
    { key: { en: "Streaming" }, value: "Kafka, Flink, Kinesis, Debezium" },
    { key: { en: "Modelling" }, value: "dbt, Kimball, Data Vault 2.0, slowly changing dimensions", contexts: ["cv"] },
    { key: { en: "Storage" }, value: "S3, Delta Lake, Apache Iceberg, Parquet", contexts: ["cv"] },
    { key: { en: "Cloud" }, value: "AWS (primarily), GCP" },
    { key: { en: "BI" }, value: "Looker, Metabase, Superset, Tableau", contexts: ["cv"] },
    { key: { en: "Infrastructure" }, value: "Terraform, Docker, Kubernetes, GitLab CI", contexts: ["cv"] },
    { key: { en: "Data quality" }, value: "dbt tests, Great Expectations, Soda, OpenLineage" },
  ],

  socials: [
    { label: "Email", href: "mailto:hello@marina.example", display: "hello@marina.example" },
    { label: "Website", href: "https://marina.example", display: "marina.example", contexts: ["cv"] },
    { label: "Telegram", href: "https://t.me/marina-volkova-demo", display: "@marina-volkova-demo" },
    { label: "GitHub", href: "https://github.com/marina-volkova-demo", display: "marina-volkova-demo" },
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

  neofetch: {
    ascii: `<span class="outline">  ╭───────────╮
  │ </span><span class="eye">▪ ▪ ▪ ▪ ▪</span><span class="outline"> │
  ├───────────┤
  │ </span><span class="nose">◆</span><span class="outline"> ░░░░░░░ │
  ├───────────┤
  │ ░░░░░░░░░ │
  ╰───────────╯</span>`,
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
          en: `<span class="amber">open to interesting problems</span>`,
        },
      },
    ],
  },

  // The live "Playing" row in the neofetch card. Delete this whole block
  // (or blank the endpoint) to turn the widget off: the row isn't rendered
  // at all and no request is ever made — neofetch just ends at Status.
  // An endpoint that's set but unreachable keeps the row and shows
  // "spotify offline" instead.
  nowPlaying: {
    endpoint: "https://api.marina.example/now-playing",
    pollMs: 20000,
  },

  ssh: {
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

  terminal: {
    hostname: "marina.example",
    title: {
      en: "guest@marina.example — bash — 80×24",
    },
    // Which languages this site ships is MESSAGES, at the top of this file.
    defaultLocale: "en",
    defaultTheme: "random",
  },

  commands: {
    // Overrides a command's one-line description in `help`. Anything not
    // listed here falls back to `commands.<name>` in src/i18n/<locale>.ts.
    // Use it for lines that carry your name or your voice.
    descriptions: {
      about: {
        en: "who is this marina person anyway",
      },
    },

    // The fake-system commands (ps, who, w, env) show two accounts: the
    // visitor, who is identity.handle, and the machine's owner — you.
    system: {
      owner: "marina",
    },
  },

  links: {
    // Extra links in the terminal page's top-right; the automatic `cv.html →`
    // always sits last, furthest right. These render as plain text — no
    // arrow. Labels are plain strings, not translated, terminal page only.
    topbar: [
      { label: "blog", href: "https://blog.marina.example" },
      { label: "talks", href: "https://talks.marina.example" },
    ],
  },

  game: {
    url: "https://game.marina.example/",
    title: "Backfill Quest",
    // The launcher: `ls -a` lists it, `sudo ./backfill.sh` opens the game.
    script: "backfill.sh",
  },

  seo: {
    title: {
      en: "Marina Volkova — Data Engineer",
    },
    description: {
      en: "Interactive terminal portfolio of a data engineer with 10 years of experience. Type `help` to explore.",
    },
  },

  footer: {
    /** The © line. Each page appends its own tail (see ui.footerHint). */
    copyright: {
      en: `© {year} <a href="https://marina.example" target="_blank" rel="noopener">Marina Volkova</a>`,
    },
  },

  // The CV. One page is generated per locale in MESSAGES, at the top.
  // Delete this whole key and the CV disappears: no pages, no `cv` command,
  // no cv.html in `ls`, no sitemap rows — just the terminal.
  cv: {
    // The line under the contact row on the CV.
    metaLine: {
      en: "Belgrade, Serbia · EU work authorisation · remote-first, open to hybrid in CET",
    },

    // Shown at the top of the CV, under the contact row.
    about: {
      en: "Data engineer with ten years spent turning messy operational data into models people actually trust. I build batch and streaming pipelines, keep warehouses fast and cheap, and care rather too much about column naming. Looking for a team that treats data as a product — with real ownership, a roadmap, and the patience to model things properly the first time.",
    },

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

    certs: [
      { year: "2025", name: "Google Cloud Professional Data Engineer" },
      { year: "2024", name: "dbt Analytics Engineering Certification" },
      { year: "2023", name: "AWS Certified Data Analytics – Specialty" },
      { year: "2021", name: "Databricks Certified Data Engineer Associate" },
      { year: "2019", name: "Confluent Certified Developer for Apache Kafka" },
    ],

    // The playful "notes.txt" list at the foot of the CV.
    traits: {
      en: [
        "will rename your columns and you will thank me later",
        "reads query plans for fun, which is its own diagnosis",
        "allergic to the phrase \"we'll clean it up downstream\"",
        "can explain a slowly changing dimension to a non-technical stakeholder",
        "keeps a personal list of every timezone bug I've caused",
        "believes the best dashboard is the one nobody needs to open",
        "patient with people, impatient with unlogged failures",
        "conversational in four languages, fluent in none before coffee",
        "still proudest of a pipeline I deleted",
      ],
    },

    // `filled` is the 0–10 proficiency meter; `sub` is the text beside it.
    languages: [
      { name: { en: "Polish" }, filled: 10, sub: { en: "Native" } },
      { name: { en: "English" }, filled: 9, sub: { en: "C1 — Advanced" } },
      { name: { en: "Serbian" }, filled: 5, sub: { en: "B1 — Intermediate" } },
      { name: { en: "German" }, filled: 3, sub: { en: "A2 — Elementary" } },
    ],

    // The closing line. Rendered as HTML, so markup is allowed.
    signOff: {
      en: `$ <span class="accent">echo</span> <span class="amber">"if you read this far, you'd probably enjoy working together."</span>`,
    },
  },
});
