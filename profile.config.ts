import { defineProfile } from "./src/core/profile";

/**
 * ─────────────────────────────────────────────────────────────────────
 *  This is the only file you need to edit to make this site your own.
 *  Run `npm run check` afterwards. It ships with real data rather than
 *  placeholders, so the guard is consistency: the check fails when
 *  SITE_URL and identity.domain disagree, when a field is missing a
 *  translation, when a social link isn't a URL, or when a referenced
 *  asset doesn't exist.
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
    photo: "/assets/img/nikita-photo.png",
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

  // `contexts` omitted means "everywhere". The CV shows the full table;
  // the terminal shows the readable subset.
  skills: [
    { key: { en: "Languages", ru: "Языки программирования" }, value: "Python, Bash, PowerShell, Go (beginner)", contexts: ["cv"] },
    { key: { en: "Linux", ru: "Linux" }, value: "RHEL, CentOS, Ubuntu, RedOS" },
    {
      key: { en: "Network", ru: "Сети" },
      value: "TCP/IP, HTTP(S), DNS, SSH, SSL/TLS, APIs, proxies, load balancers, routing, security",
    },
    { key: { en: "Web / LB", ru: "Web / балансировщики" }, value: "Nginx, OpenResty, HAProxy", contexts: ["cv"] },
    { key: { en: "CI/CD", ru: "CI/CD" }, value: "Jenkins, GitLab CI, Terraform, Ansible", contexts: ["cv"] },
    { key: { en: "Containers", ru: "Контейнеры" }, value: "ECS, Kubernetes, OpenShift, Docker, Helm" },
    { key: { en: "Virtualization", ru: "Виртуализация" }, value: "libvirt, LXC, Ceph, MAAS", contexts: ["cv"] },
    { key: { en: "Cloud", ru: "Облако" }, value: "AWS (primarily), GCP, Azure, Yandex Cloud, OpenStack" },
    { key: { en: "Databases", ru: "Базы данных" }, value: "PostgreSQL, MariaDB, MySQL, ClickHouse, MongoDB" },
    { key: { en: "Monitoring", ru: "Мониторинг" }, value: "Prometheus, Grafana, ELK Stack, Graylog, CloudWatch", contexts: ["cv"] },
  ],

  socials: [
    { label: "Email", href: "mailto:me@nikita.sh", display: "me@nikita.sh" },
    { label: "Website", href: "https://nikita.sh", display: "nikita.sh", contexts: ["cv"] },
    { label: "Telegram", href: "https://t.me/thatguynikita", display: "@thatguynikita" },
    { label: "GitHub", href: "https://github.com/thatguynikita", display: "thatguynikita" },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/nikita-chernozipunnikov",
      display: "nikita-chernozipunnikov",
    },
    { contexts: ["terminal"], label: "Twitter", href: "https://twitter.com/thatguynikita", display: "@thatguynikita" },
    {
      contexts: ["terminal"],
      label: "Facebook",
      href: "https://www.facebook.com/nikita.chernozipunnikov",
      display: "nikita.chernozipunnikov",
    },
    { contexts: ["terminal"], label: "Instagram", href: "https://www.instagram.com/thatguynikita", display: "@thatguynikita" },
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
    // Extra topbar links. The CV link is added automatically when
    // `cv` is configured, so this is for anything else you want up there.
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

  // The CV. One page is generated per locale in terminal.locales.
  // Delete this whole key and the CV disappears: no pages, no `cv` command,
  // no cv.html in `ls`, no sitemap rows — just the terminal.
  cv: {
    // The line under the contact row on the CV.
    metaLine: {
      en: "Saint Petersburg, Russia · Citizenship: Russia · hybrid, full day · not available for relocation or business trips",
      ru: "Санкт-Петербург, Россия · Гражданство: Россия · гибридный график, полный день · не готов к переезду или командировкам",
    },

    // Shown at the top of the CV, under the contact row.
    about: {
      en: `DevOps/SRE with eleven years of experience in Application Support and Operations, gradually
developing towards AI-driven Software Development. Solid knowledge of how modern computer
systems work (and how they don't), extensive Linux and network administration experience, a
sound understanding of Computer Science concepts, and plenty of enthusiasm for bringing
DevOps and SRE practices into reality. Looking for an opportunity to gang up with bright,
seasoned folks passionate about their work — and add all my skills, wisdom, and zeal to the
heap.`,
      ru: `DevOps/SRE-инженер с одиннадцатилетним опытом в Application Support и Operations, постепенно
развивающийся в сторону разработки ПО с применением ИИ. Хорошее понимание того, как устроены
современные компьютерные системы (и как именно они ломаются), богатый опыт администрирования
Linux и сетей, крепкое понимание основ Computer Science и море энтузиазма по внедрению
практик DevOps и SRE в реальную жизнь. Ищу возможность объединиться с толковыми, опытными
людьми, увлечёнными своим делом — и добавить все свои навыки, мудрость и рвение в общую
копилку.`,
    },

    jobs: [
      {
        id: "vk",
        dates: { en: "Nov 2022 – Sep 2025", ru: "Ноя 2022 – Сен 2025" },
        span: { en: "2y 11m", ru: "2 г. 11 мес." },
        org: {
          name: "VK",
          url: "https://vk.company",
          location: { en: "Saint Petersburg", ru: "Санкт-Петербург" },
        },
        title: { en: "Site Reliability Engineer", ru: "Инженер по надёжности (SRE)" },
        tech: "OpenStack, Linux (RHEL, CentOS, RedOS), libvirt, Kubernetes, Docker, Ansible, Terraform, HAProxy, Nginx, PostgreSQL, MariaDB, MySQL, ClickHouse, Prometheus, Grafana, ELK Stack",
        bullets: {
          en: [
          "Built and ran CorpCloud and ProdCloud, OpenStack-based private clouds spanning 500+ hypervisors",
          "Stood up a complete test environment for the platform from scratch",
          "Led a large-scale compute migration across multiple data centers with minimal downtime",
          "Delivered Managed Kubernetes and Cloud Databases as core platform services",
          "Rolled out cloud logging, monitoring, and event tracing for full-stack observability",
          "Investigated incidents, ran root-cause analysis, and squashed performance bottlenecks",
          "Wrote runbooks, operational guides, and technical documentation for the team",
          "Learned to sleep with one eye open during on-call weeks",
          ],
          ru: [
          "Построил и поддерживал CorpCloud и ProdCloud — частные облака на базе OpenStack на 500+ гипервизорах",
          "Развернул полное тестовое окружение платформы с нуля",
          "Провёл масштабную миграцию вычислительных мощностей между несколькими ЦОД с минимальным простоем",
          "Реализовал Managed Kubernetes и облачные базы данных как ключевые сервисы платформы",
          "Внедрил облачное логирование, мониторинг и трассировку событий для полного observability",
          "Разбирал инциденты, проводил root-cause анализ и устранял узкие места производительности",
          "Писал runbook'и, инструкции по эксплуатации и техническую документацию для команды",
          "Научился спать с одним открытым глазом во время дежурств",
          ],
        },
      },
      {
        id: "epam",
        dates: { en: "Jan 2021 – Jun 2022", ru: "Янв 2021 – Июн 2022" },
        span: { en: "1y 6m", ru: "1 г. 6 мес." },
        org: {
          name: "EPAM Anywhere",
          url: "https://anywhere.epam.com",
          location: { en: "Moscow", ru: "Москва" },
        },
        title: { en: "Systems Engineer", ru: "Системный инженер" },
        tech: "AWS (CloudFormation, Lambda, IAM, ECS, SQS, SNS, Step Functions, EventBridge, API Gateway, S3, EC2, CloudWatch), Jenkins, GitLab, SonarQube, Nexus, Bash, PowerShell, Python, Terraform, Docker, CentOS, TypeScript, Maven, Jest, Stryker",
        bullets: {
          en: [
          "Supported development and release of a Biotech solution from MVP to production readiness",
          "Designed serverless AWS architecture in collaboration with the Solutions Architect",
          "Automated CI/CD procedures from scratch",
          "Provisioned AWS infrastructure with IaC",
          "Implemented and fine-tuned strict security policies for compliance",
          "Singlehandedly owned the whole infrastructure and automation stack",
          "Battled off the enterprise bureaucracy",
          ],
          ru: [
          "Сопровождал разработку и релиз биотех-решения от MVP до продакшн-готовности",
          "Проектировал serverless-архитектуру на AWS совместно с Solutions Architect",
          "Автоматизировал процессы CI/CD с нуля",
          "Разворачивал инфраструктуру AWS через IaC",
          "Внедрял и настраивал строгие политики безопасности для соответствия требованиям",
          "В одиночку отвечал за всю инфраструктуру и стек автоматизации",
          "Отбивался от корпоративной бюрократии",
          ],
        },
      },
      {
        id: "assaia",
        dates: { en: "Feb 2020 – Sep 2020", ru: "Фев 2020 – Сен 2020" },
        span: { en: "8m", ru: "8 мес." },
        org: {
          name: "Assaia International AG",
          url: "https://assaia.com",
          location: { en: "Switzerland", ru: "Швейцария" },
        },
        title: { en: "Infrastructure Engineer", ru: "Инженер по инфраструктуре" },
        tech: "Azure, GCP, Debian, CentOS, Docker, Podman, K3s, Kubeflow, TensorFlow, PyTorch, Ansible, Terraform, Python, Bash, PostgreSQL, MongoDB, NSQ, Nginx, GitLab CI, Zabbix, Prometheus, Git, FFmpeg, Nvidia GPU, Jetson AGX Xavier",
        bullets: {
          en: [
          "Configured, deployed, and supported pilot instances of the platform",
          "Developed a video delivery pipeline with collection and storage systems",
          "Pushed the platform's first-ever release to production readiness",
          "Automated cloud resource provisioning; refactored and improved IaC readability",
          "Reinforced infrastructure security with best practices",
          "Supported software engineers, data availability, and internal uptime",
          "Perfected blindfold YAML engineering skills",
          ],
          ru: [
          "Настраивал, разворачивал и поддерживал пилотные инстансы платформы",
          "Разработал пайплайн доставки видео со сбором и хранением данных",
          "Довёл самый первый релиз платформы до продакшн-готовности",
          "Автоматизировал выделение облачных ресурсов; рефакторил и улучшал читаемость IaC",
          "Усилил безопасность инфраструктуры лучшими практиками",
          "Поддерживал разработчиков, доступность данных и внутренний аптайм",
          "Отточил навык писать YAML с закрытыми глазами",
          ],
        },
      },
      {
        id: "telekom",
        dates: { en: "Oct 2019 – Dec 2019", ru: "Окт 2019 – Дек 2019" },
        span: { en: "3m", ru: "3 мес." },
        org: {
          name: "Deutsche Telekom IT Solutions",
          url: "",
          location: { en: "Saint Petersburg · ex. T-Systems", ru: "Санкт-Петербург · ранее T-Systems" },
        },
        title: { en: "Configuration Manager", ru: "Менеджер по конфигурациям" },
        tech: "OpenShift, Kubernetes, Docker, Helm, Lua, Python, Bash, 3scale, Keycloak, PostgreSQL, Redis, Nginx, Kong, HAProxy, GitLab CI, Prometheus, Grafana, EFK Stack, Nexus, Jira, Confluence, Git",
        bullets: {
          en: [
          "Troubleshot infrastructure and deployment process issues",
          "Supported and consulted 15+ dev teams on CI/CD topics",
          "Managed an OpenShift cluster's load (30+ namespaces, ~100 pods each)",
          "Implemented a custom reverse/forward proxy plugin for Kong (in Lua)",
          "Participated on-call during critical incidents and primary rollouts",
          "Mentored and shared knowledge with team members",
          ],
          ru: [
          "Решал проблемы инфраструктуры и процессов деплоя",
          "Поддерживал и консультировал 15+ команд разработки по вопросам CI/CD",
          "Управлял нагрузкой кластера OpenShift (30+ namespace'ов, ~100 подов в каждом)",
          "Разработал кастомный reverse/forward proxy-плагин для Kong (на Lua)",
          "Участвовал в дежурствах при критичных инцидентах и основных релизах",
          "Менторил и делился знаниями с командой",
          ],
        },
      },
      {
        id: "ventx",
        dates: { en: "Jan 2018 – Jul 2018", ru: "Янв 2018 – Июл 2018" },
        span: { en: "7m", ru: "7 мес." },
        org: {
          name: "ventx GmbH",
          url: "https://ventx.de",
          location: { en: "Germany", ru: "Германия" },
        },
        title: { en: "Cloud Engineer", ru: "Облачный инженер" },
        tech: "AWS, Ubuntu, Docker, LXC, Kubernetes, Terraform, Ansible, Helm, Python, Bash, PostgreSQL, Redis, Nginx, HAProxy, Jenkins, Prometheus, Grafana, ELK Stack, Graylog, Ceph, MAAS, pfSense, Jira, Confluence, Bitbucket, Git",
        bullets: {
          en: [
          "Designed and built a highly-available Kubernetes cluster on bare-metal infrastructure",
          "Configured cluster networking; implemented log management and monitoring",
          "Shifted Jenkins pipelines to deploy via Kubernetes",
          "Established policies and operated the cluster for security and multi-tenancy",
          "Transitioned AWS infrastructure to code with Terraform and Ansible",
          "Consulted and shared wisdom with business clients and the team",
          "Contributed to the imposter syndrome rate in tech",
          ],
          ru: [
          "Спроектировал и построил отказоустойчивый Kubernetes-кластер на bare-metal инфраструктуре",
          "Настраивал сеть кластера; внедрил управление логами и мониторинг",
          "Перевёл пайплайны Jenkins на деплой через Kubernetes",
          "Внедрил политики и обслуживал кластер с учётом безопасности и мультитенантности",
          "Перевёл инфраструктуру AWS в код с помощью Terraform и Ansible",
          "Консультировал и делился опытом с бизнес-клиентами и командой",
          "Внёс свой вклад в статистику синдрома самозванца в IT",
          ],
        },
      },
      {
        id: "devexperts-de",
        dates: { en: "Oct 2015 – Sep 2017", ru: "Окт 2015 – Сен 2017" },
        span: { en: "2y", ru: "2 г." },
        org: {
          name: "Devexperts GmbH",
          url: "https://devexperts.com",
          location: { en: "Germany", ru: "Германия" },
        },
        title: { en: "Operations Engineer", ru: "Инженер по эксплуатации" },
        tech: "Java EE, WebLogic, Tomcat, Log4j, Oracle RDBMS, PostgreSQL, RHEL, CentOS, Splunk, Bash, Perl, Python, AWS EC2, Jira, Confluence, Bitbucket, Fisheye, Git",
        bullets: {
          en: [
          "Maintained dev, test, pre-prod, and production environments for a large-scale trading platform",
          "Ran deployments and configuration changes, troubleshooting issues while meeting SLAs",
          "Managed incidents, emergency response, and root-cause analysis",
          "Kept internal monitoring solutions in sync with the platform",
          "Automated release processes, built tooling with Bash and Python",
          "Collaborated with application support, QA, developers, and business owners",
          "Developed a healthy on-call fatigue",
          ],
          ru: [
          "Поддерживал dev, test, pre-prod и production окружения крупной торговой платформы",
          "Выполнял деплои и изменения конфигураций, устранял проблемы с соблюдением SLA",
          "Управлял инцидентами, экстренным реагированием и root-cause анализом",
          "Поддерживал внутренние системы мониторинга в актуальном состоянии",
          "Автоматизировал процессы релизов, писал инструменты на Bash и Python",
          "Взаимодействовал с поддержкой приложений, QA, разработчиками и бизнес-заказчиками",
          "Выработал здоровую усталость от дежурств",
          ],
        },
      },
      {
        id: "devexperts-spb",
        dates: { en: "Sep 2012 – Sep 2015", ru: "Сен 2012 – Сен 2015" },
        span: { en: "3y 1m", ru: "3 г. 1 мес." },
        org: {
          name: "Devexperts",
          url: "https://devexperts.com",
          location: { en: "Saint Petersburg", ru: "Санкт-Петербург" },
        },
        title: { en: "Application Support Specialist (Tier 2)", ru: "Специалист технической поддержки (2-я линия)" },
        tech: "Java EE, JVM, SQL, RHEL, Bash, grep, sed, awk, Perl, regex, Python, Jira, Confluence, Bitbucket, Git",
        bullets: {
          en: [
          "Monitored applications and infrastructure of a large-scale distributed trading platform",
          "Registered and supported incoming service requests and incidents through their lifecycle",
          "Investigated application/environment issues; ran SQL queries; analyzed logs",
          "Participated on-call during major incidents, engaging in resolution",
          "Performed daily maintenance, assisted with rollouts and configuration changes",
          "Wrote instructions and kept internal documentation up to date",
          "Operated in low-power mode during night shifts",
          ],
          ru: [
          "Мониторил приложения и инфраструктуру крупной распределённой торговой платформы",
          "Регистрировал и сопровождал заявки и инциденты на всех этапах их жизненного цикла",
          "Разбирал проблемы приложений и окружения; писал SQL-запросы; анализировал логи",
          "Участвовал в дежурствах при крупных инцидентах, помогая с их устранением",
          "Выполнял ежедневное обслуживание, помогал с релизами и изменениями конфигураций",
          "Писал инструкции и поддерживал внутреннюю документацию в актуальном состоянии",
          "Работал в режиме энергосбережения во время ночных смен",
          ],
        },
      },
    ],

    education: {
      university: {
        en: "Izhevsk Kalashnikov State Technical University",
        ru: "Ижевский государственный технический университет имени М.Т. Калашникова",
      },
      place: { en: "Izhevsk", ru: "Ижевск" },
      year: 2012,
      field: {
        en: "Radio Engineering, Wireless Communication Facilities",
        ru: "Радиотехника, средства беспроводной связи",
      },
    },

    certs: [
      { year: "2026", name: "Certified DevOps Engineer – Yandex Cloud" },
      { year: "2021", name: "AWS Certified DevOps Engineer – Professional" },
      { year: "2019", name: "CKA: Certified Kubernetes Administrator" },
      { year: "2017", name: "Cisco Certified Network Associate – Routing and Switching (CCNA)" },
      { year: "2017", name: "Red Hat Certified Engineer (RHCE)" },
    ],

    // The playful "notes.txt" list at the foot of the CV.
    traits: {
      en: [
        "English without a Slavic flavor",
        "devotion to the deity of technology",
        "dedication and perseverance of a dung beetle",
        "insatiable curiosity",
        "empathetic capacities of a shrink",
        "ability to make magic happen",
        "supernatural attention to detail",
        "healthy skepticism (that anyone reading this far)",
        "a born leader and a cutie patootie (as per my mom)",
      ],
      ru: [
        "английский без славянского акцента",
        "преданность богу технологий",
        "упорство и целеустремлённость навозного жука",
        "неутолимое любопытство",
        "эмпатия на уровне психотерапевта",
        "умение творить магию",
        "сверхъестественное внимание к деталям",
        "здоровый скептицизм (в том, что кто-то дочитал досюда)",
        "прирождённый лидер и лапочка (по словам моей мамы)",
      ],
    },

    // The closing line. Rendered as HTML, so markup is allowed.
    signOff: {
      en: `$ <span class="accent">echo</span> <span class="amber">"thanks for reading this far. let's build something reliable together."</span>`,
      ru: `$ <span class="accent">echo</span> <span class="amber">"спасибо, что дочитали до конца. давайте построим что-то надёжное вместе."</span>`,
    },

    // `filled` is the 0–10 proficiency meter; `sub` is the text beside it.
    languages: [
      { name: { en: "Russian", ru: "Русский" }, filled: 10, sub: { en: "Native", ru: "Родной" } },
      { name: { en: "English", ru: "Английский" }, filled: 8, sub: { en: "C1 — Advanced", ru: "C1 — Продвинутый" } },
      { name: { en: "German", ru: "Немецкий" }, filled: 3, sub: { en: "A2 — Elementary", ru: "A2 — Начальный" } },
      { name: { en: "Spanish", ru: "Испанский" }, filled: 5, sub: { en: "B1 — Intermediate", ru: "B1 — Средний" } },
    ],
  },
});
