import { defineProfile } from "./src/core/profile";

/**
 * ─────────────────────────────────────────────────────────────────────
 *  This is the only file you need to edit to make this site your own.
 *  Run `npm run check` afterwards — it fails while placeholder values
 *  from the original author are still in place.
 * ─────────────────────────────────────────────────────────────────────
 */
export default defineProfile({
  identity: {
    name: {
      en: "Nikita Chernozipunnikov",
      ru: "Никита Чернозипунников",
    },
    handle: "guest",
    // Where this site is published: the CNAME the build emits and the
    // canonical URL in OG tags / JSON-LD. Distinct from terminal.hostname
    // below, which is only the hostname shown in the prompt.
    domain: "terminal.nikita.sh",
    role: {
      en: "DevOps / SRE — Systems Engineer",
      ru: "DevOps / SRE — Системный инженер",
    },
    email: "me@nikita.sh",
    location: {
      en: "Saint Petersburg, Russia",
      ru: "Санкт-Петербург, Россия",
    },
    tagline: {
      en: "DevOps / SRE — Systems Engineer · 11y experience",
      ru: "DevOps / SRE — Системный инженер · 11 лет опыта",
    },
  },

  // Line breaks matter: `about` types this out one line at a time.
  bio: {
    en: `DevOps/SRE with eleven years of experience in Application Support and Operations,
gradually developing towards AI-driven Software Development.

Solid knowledge of how modern computer systems work (and how they don't),
extensive Linux and network administration experience, a sound understanding
of Computer Science concepts, and plenty of enthusiasm for bringing DevOps
and SRE practices into reality.`,
    ru: `DevOps/SRE-инженер с одиннадцатилетним опытом в Application Support и Operations,
постепенно развивающийся в сторону разработки ПО с применением ИИ.

Хорошее понимание того, как устроены современные компьютерные системы
(и как именно они ломаются), богатый опыт администрирования Linux и сетей,
крепкое понимание основ Computer Science и море энтузиазма по внедрению
практик DevOps и SRE в реальную жизнь.`,
  },

  skills: [
    { key: { en: "Linux", ru: "Linux" }, value: "RHEL, CentOS, Ubuntu, RedOS" },
    {
      key: { en: "Network", ru: "Сети" },
      value: "TCP/IP, HTTP(S), DNS, SSH, SSL/TLS, APIs, proxies, load balancers, routing, security",
    },
    { key: { en: "Containers", ru: "Контейнеры" }, value: "ECS, Kubernetes, OpenShift, Docker, Helm" },
    { key: { en: "Cloud", ru: "Облако" }, value: "AWS (primarily), GCP, Azure, Yandex Cloud, OpenStack" },
    { key: { en: "Databases", ru: "Базы данных" }, value: "PostgreSQL, MariaDB, MySQL, ClickHouse, MongoDB" },
  ],

  socials: [
    { label: "Email", href: "mailto:me@nikita.sh", display: "me@nikita.sh" },
    { label: "Telegram", href: "https://t.me/thatguynikita", display: "@thatguynikita" },
    { label: "GitHub", href: "https://github.com/thatguynikita", display: "thatguynikita" },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/nikita-chernozipunnikov",
      display: "nikita-chernozipunnikov",
    },
    { label: "Twitter", href: "https://twitter.com/thatguynikita", display: "@thatguynikita" },
    {
      label: "Facebook",
      href: "https://www.facebook.com/nikita.chernozipunnikov",
      display: "nikita.chernozipunnikov",
    },
    { label: "Instagram", href: "https://www.instagram.com/thatguynikita", display: "@thatguynikita" },
  ],

  neofetch: {
    ascii: `<span class="outline">     ░░░░░
  ░░▒▓▓▓▓▓▒░░
 ░▒▒▓▓▓</span><span class="nose">●</span><span class="outline">▓▓▓▒▒░
⋆░▒▓▓</span><span class="eye">●◉◉◉●</span><span class="outline">▓▓▒░⋆
 ░▒▒▓▓▓</span><span class="nose">●</span><span class="outline">▓▓▓▒▒░
  ░░▒▓▓▓▓▓▒░░
     ░░░░░</span>`,
    rows: [
      {
        key: { en: "Name", ru: "Имя" },
        value: { en: "Nikita Chernozipunnikov", ru: "Никита Чернозипунников" },
      },
      { key: { en: "Role", ru: "Должность" }, value: { en: "DevOps / SRE", ru: "DevOps / SRE" } },
      {
        key: { en: "Uptime", ru: "Стаж" },
        value: { en: "11+ years in production", ru: "11+ лет в проде" },
      },
      { key: { en: "Shell", ru: "Оболочка" }, value: { en: "/bin/bash", ru: "/bin/bash" } },
      {
        key: { en: "Stack", ru: "Стек" },
        value: {
          en: "AWS · OpenStack · Kubernetes · Linux",
          ru: "AWS · OpenStack · Kubernetes · Linux",
        },
      },
      {
        key: { en: "Status", ru: "Статус" },
        value: {
          en: `<span class="amber">on sabbatical (pager silenced)</span>`,
          ru: `<span class="amber">в творческом отпуске (алерты замьючены)</span>`,
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
    endpoint: "https://functions.yandexcloud.net/d4e5vur1qk4p911pcu58",
    pollMs: 20000,
  },

  ssh: {
    personas: {
      recruiter: {
        host: "recruiter@nikita.sh",
        qa: [
          {
            cmd: "why",
            q: { en: "Why should we hire you?", ru: "Почему нам стоит вас нанять?" },
            a: {
              en: "Eleven years of keeping production upright so everyone else could sleep. Calm in incidents, comfortable with automation, and I take ownership.",
              ru: "Одиннадцать лет держу прод в рабочем состоянии, чтобы другие могли спать. Спокоен в инцидентах, дружу с автоматизацией и беру на себя ответственность.",
            },
          },
          {
            cmd: "favorite",
            q: {
              en: "What's your favorite part of DevOps?",
              ru: "Что вам больше всего нравится в DevOps?",
            },
            a: {
              en: "The moment a shaky manual process turns into a boring, reliable pipeline — and everyone can forget it exists.",
              ru: "Момент, когда шаткая ручная процедура превращается в скучный, надёжный пайплайн — и про неё можно забыть.",
            },
          },
          {
            cmd: "incident",
            q: {
              en: "Tell me about an incident you handled.",
              ru: "Расскажите про инцидент, который вы разруливали.",
            },
            a: {
              en: "Skipping the gory details — a cluster went down on a Friday night, and by Monday nobody remembered it except the postmortem doc.",
              ru: "Опустим подробности — кластер лёг в пятницу вечером, а к понедельнику про это уже никто не помнил, кроме постмортема.",
            },
          },
          {
            cmd: "goals",
            q: { en: "What are you looking for next?", ru: "Что вы ищете в следующей роли?" },
            a: {
              en: "A team where SRE practices aren't optional, with room to grow toward AI-driven development.",
              ru: "Команду, где SRE-практики не факультатив, и где можно расти в сторону AI-driven разработки.",
            },
          },
          {
            cmd: "salary",
            q: { en: "Salary expectations?", ru: "Ожидания по зарплате?" },
            a: {
              en: "Negotiable — let's actually talk about that via contact instead of a terminal easter egg :)",
              ru: "Обсуждаемо — предлагаю продолжить это через contact, а не в терминальном пасхальном яйце :)",
            },
          },
        ],
      },
    },
  },

  terminal: {
    hostname: "nikita.sh",
    title: {
      en: "guest@nikita.sh — bash — 80×24",
      ru: "guest@nikita.sh — bash — 80×24",
    },
    locales: ["en", "ru"],
    defaultLocale: "en",
    defaultTheme: "random",
  },

  commands: {
    // Overrides a command's one-line description in `help`. Anything not
    // listed here falls back to `commands.<name>` in src/i18n/<locale>.ts.
    // Use it for lines that carry your name or your voice.
    descriptions: {
      about: {
        en: "who is that guy nikita anyway",
        ru: "кто такой вообще этот никита",
      },
    },

    // The fake-system commands (ps, who, w, env) show two accounts: the
    // visitor, who is identity.handle, and the machine's owner — you.
    system: {
      owner: "nikita",
    },
  },

  links: {
    // Rendered top-right. Empty until cv.html exists in this repo.
    topbar: [],
  },

  game: {
    url: "https://cat.nikita.sh/",
    title: "Котик и Сгущенка",
  },

  seo: {
    title: {
      en: "Nikita Chernozipunnikov — DevOps / SRE",
      ru: "Никита Чернозипунников — DevOps / SRE",
    },
    description: {
      en: "Interactive terminal portfolio of a DevOps/SRE engineer with 11 years of experience. Type `help` to explore.",
      ru: "Интерактивное терминальное портфолио DevOps/SRE-инженера с 11-летним опытом. Введите `help`, чтобы начать.",
    },
    ogImage: "/assets/img/og-terminal.png",
  },

  footer: {
    /** The © line. Each page appends its own tail (see ui.footerHint). */
    copyright: {
      en: `© {year} <a href="https://nikita.sh" target="_blank" rel="noopener">Nikita Chernozipunnikov</a>`,
      ru: `© {year} <a href="https://nikita.sh" target="_blank" rel="noopener">Никита Чернозипунников</a>`,
    },
  },
});
