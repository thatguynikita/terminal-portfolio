import type { Messages } from "./en.ts";

/**
 * Ukrainian messages. Typed as `Messages`, so a missing key is a build error.
 *
 * Ships in the repo but is **not selected** by profile.config.ts: a fork
 * switches the site to Ukrainian by adding one import to `MESSAGES`, and an
 * unselected catalogue costs the bundle nothing. `tsc` still checks it, so
 * it cannot drift out of shape when `en.ts` gains a key.
 */
const uk: Messages = {
  ui: {
    welcome:
      "Ласкаво просимо до мого іграшкового термінала. Введіть 'help', щоб побачити, що тут є.",
    welcomeWhisper: "(тс-с — 'help' скромничає. покопайтеся трохи.)",
    availableCommands: "Доступні команди:",
    notFound: `команду не знайдено: <span class="accent">{cmd}</span>`,
    notFoundHint: `<span class="dim">це іграшковий термінал, зліплений на JavaScript, а не справжня оболонка. спробуйте <span class="glow">help</span>, щоб побачити, що тут є</span>`,
    loggingOut: "вихід із системи...",
    connClosed: "з'єднання з {host} закрито.",
    footerHint: `введіть <span class="accent">help</span>, щоб почати`,
    pageTitle: "термінал",
    inputLabel: "Введення команд термінала",
    outputLabel: "Вивід термінала",
  },

  boot: {
    lines: [
      "послідовність завантаження {host} — ядро 6.6.0-sre",
      "[  OK  ] завантажено модуль: years_of_uptime.ko",
      `<span class="rm-line">[FAILED] монтування /dev/motivation: не знайдено</span>`,
      "[  OK  ] натомість змонтовано /dev/coffee",
      "[  OK  ] запущено ssh-agent.service",
      "[  OK  ] запущено kubernetes-cluster.service",
      `<span class="amber">[ WARN ] condensed-milk-reserve.service: критично мало (кота повідомлено, кіт незворушний)</span>`,
      "[  OK  ] запущено ai-assistant.service",
      "[  OK  ] запущено recruiter-inbox.service (1125 непрочитаних)",
      "[  OK  ] чергового пейджера вимкнено (поки що)",
      "",
      "доступ надано — вітаємо, {user}",
    ],
  },

  commands: {
    about: "хто ця людина",
    skills: "технологічний стек",
    contact: "як зі мною зв'язатися",
    cv: "відкрити повне резюме",
    neofetch: "картка з інформацією про систему",
    whoami: "трохи забагато про вас",
    ls: "показати файли",
    cat: "вивести файл",
    fortune: "випадкова мудрість",
    top: "несправжній монітор процесів",
    kubectl: "зазирнути у вигаданий кластер",
    terraform: "застосувати оптимізм, знищити все",
    ssh: "віддалений вхід — пропустіть скринінг-дзвінок (або дізнайтеся, що тут іще є)",
    claude: "запитати ШІ-асистента",
    theme: "змінити колір термінала",
    matrix: "увімкнути/вимкнути дощ на фоні",
    lang: "перемкнути мову виводу",
    help: "показати цей список",
    clear: "очистити екран",
    history: "команди, які ви виконували",
  },

  ls: {
    total: "всього {n}",
  },

  cat: {
    usage: "використання: cat &lt;файл&gt;",
    noFile: "cat: {file}: Немає такого файла або каталогу",
    notText: `cat: {file}: не текстовий файл`,
  },

  rm: {
    missingOperand: "rm: пропущено операнд",
    denied: "rm: не вдалося видалити '{file}': Відмовлено у доступі",
  },

  exec: {
    denied: "bash: ./{file}: Відмовлено у доступі",
    notFound: "bash: ./{file}: Немає такого файла або каталогу",
    notExecutable: "bash: ./{file}: Відмовлено у доступі",
    launchingGame: `запускаю <span class="glow">{title}</span> в ізольованому вікні CRT...`,
  },

  theme: {
    set: `тему змінено на <span class="glow">{name}</span>`,
    usage: "використання: theme &lt;{names}&gt;",
  },

  matrix: {
    on: "дощ matrix: увімкнено",
    off: "дощ matrix: вимкнено",
    usage: "використання: matrix &lt;on|off&gt;",
  },

  lang: {
    set: `мову перемкнено на <span class="glow">українську</span>`,
    usage: "використання: lang &lt;{codes}&gt;",
  },

  sudo: {
    reported: `<span class="amber">Про цей інцидент буде повідомлено.</span>`,
    removing: `<span class="rm-line">видалення {path} ...</span>`,
    justKidding: `<span class="amber">...жартую. але спроба непогана.</span>`,
    noHarm: `<span class="dim">(нічого не постраждало — це статичний сайт, ви в браузері, а не на справжньому сервері)</span>`,
  },

  whoami: {
    user: "Користувач",
    browser: "Браузер",
    os: "ОС",
    tz: "Часовий пояс",
    unknownOs: "невідома ОС",
    unknownBrowser: "загадковий браузер",
    unknownTz: "невідомий часовий пояс",
  },

  timeQuips: {
    lateNight: [
      "ще не спите? повага, але й занепокоєння",
      "десь зараз третя ночі, і, на жаль, це може бути тут",
      "машини не сплять, і ви, схоже, теж",
    ],
    earlyMorning: [
      "рано встали чи взагалі не лягали — важко сказати",
      "гранично онлайновий ранній птах",
    ],
    morning: [
      "розумний час, дуже відповідально з вашого боку",
      "продуктивна ранкова енергія, поважаю",
    ],
    midday: ["перегляд в обідню перерву, класика", "золоте вікно прокрастинації"],
    afternoon: [
      "спад о 15:00, перегляд як механізм захисту",
      "післяобідня енергія, тримається міцно",
    ],
    evening: ["вечірній перегляд, найкраще", "година пік скролінгу, соромитися нічого"],
    night: ["о цій порі вже варто спати", "ще одна вкладка перед сном, звісно"],
  },

  neofetch: {
    playing: "Грає",
    offline: "spotify офлайн",
    idle: "зараз нічого не грає",
  },

  fortunes: [
    "Це завжди DNS.",
    "99,9% аптайму — це 8 год 46 хв простою на рік, і шість із них ми вже витратили сьогодні.",
    "Хмари не існує. Це просто чужий кластер Kubernetes.",
    "Енергія п'ятничного деплою: високий ризик, ще вищий жаль.",
    "Баг ніколи не в проді. (Баг у проді.)",
    "Пайплайн, за яким стежиш, ніколи не завершується.",
    "На моїй машині працює — відвантажуємо машину.",
    "Хаос-інженерія: це не баг, це вівторок.",
    "Дзвонило ваше чергування. Хоче підвищення зарплати.",
    "Бекапи — як зубна нитка: всі згодні, що це важливо, доки не з'ясується, що ніхто цього не робив.",
    "Автоматизуйте нудне, а потім автоматизуйте автоматизацію.",
    "Всюди добре, а на 127.0.0.1 найкраще.",
    "Розподілена система — це коли машина, про яку ви ніколи не чули, може не дати вам працювати.",
    "Моніторинг без алертів — просто дуже дорога заставка.",
    "Найкращий ранбук — той, який нікому не доводиться читати о третій ночі.",
    "Постмортеми: там, де «людська помилка» тихо стає «прогалиною в процесі».",
    "Вашому балансувальнику байдуже до ваших почуттів.",
    "Ідемпотентність: бо запуск двічі не має коштувати вдвічі.",
    "Кожен «тимчасовий» фікс стає постійним, щойно запрацює.",
    "Kubernetes: ускладнює прості речі з 2014 року.",
    "Графік виглядав нормально, доки хтось не наблизив.",
    "Інфраструктура як код: тепер у ваших одруків є історія версій.",
    "Нічого не видаляється по-справжньому — воно лише зрештою узгоджене.",
    "Кнопка відкату — найбільш недооцінена функція у всьому вашому пайплайні.",
    "SLO: мистецтво обіцяти трохи менше за 100%.",
    "Добра ротація чергувань непомітна. Погана — це груповий чат о другій ночі.",
    "Інцидент ніколи не закінчується по-справжньому — він просто стає тікетом у Jira, який ніхто не призначає.",
    "Вам не потрібні нові дашборди. Вам потрібно читати ті, що є.",
  ],

  top: {
    header: ["PID", "CMD", "CPU%", "MEM%", "STATUS"],
    running: "працює",
    sleeping: "спить",
    zombie: "зомбі",
    quitHint: `<span class="dim">натисніть <span class="accent">q</span> або введіть <span class="accent">exit</span>, щоб вийти</span>`,
    quitHintPlain: `натисніть <span class="accent">q</span> або введіть <span class="accent">exit</span>, щоб вийти`,
    exited: "вихід із top.",
    promptLabel: "(top — q, щоб вийти)",
    chipQuit: "q — вийти",
  },

  kubectl: {
    header: ["NAME", "READY", "STATUS", "AGE"],
    running: "Running",
    justBarely: "ледве",
    intro: "kubectl керує менеджером кластера Kubernetes.",
    subcommands: `доступні підкоманди: <span class="glow">get pods</span>, <span class="glow">describe pod &lt;назва&gt;</span>`,
    describeUsage: "використання: kubectl describe pod &lt;назва&gt;",
    unknown: `error: unknown command "{cmd}" for "kubectl"`,
    notFound: `Error from server (NotFound): pods "{pod}" not found`,
    reason: "Причина",
    events: "Події",
    pods: {
      "cat-deployment-7f9d8c-x2m4q": {
        status: "Running",
        reason: "повністю вмотивований, банок згущенки: 0/30",
        events: [
          "Started — контейнер запущено 11 років тому",
          "Normal — стабільніший за більшість продакшн-сервісів",
        ],
      },
      "condensed-milk-store-0": {
        status: "CrashLoopBackOff",
        reason: "OOMKilled (з'їв забагато згущенки)",
        events: [
          "Killing — контейнер перевищив ліміт цукру",
          "BackOff — перезапуск відкладено, контейнер приходить до тями",
          `Pulling — image "cat:hungry-latest"`,
        ],
      },
      "sre-sanity-canary": {
        status: "Running",
        reason: "тримається на каві та впертості",
        events: [
          "Started — контейнер запущено",
          "Warning — рівень тривоги наближається до критичного",
        ],
      },
      "deploy-friday-afternoon": {
        status: "Evicted",
        reason: "тиск на вузол: п'ятниця, 17:58",
        events: ["Evicted — вузол вирішив, що на сьогодні досить"],
      },
    },
  },

  terraform: {
    usage: "використання: terraform &lt;підкоманда&gt;",
    subcommands: `доступні підкоманди: <span class="glow">apply</span>, <span class="glow">destroy</span>`,
    unknown: `terraform: невідома підкоманда "{cmd}"`,
    willPerform: `<span class="dim">Terraform виконає такі дії:</span>`,
    destroyWeekend: `<span class="amber">Це знищить ваші вихідні. Для підтвердження приймається лише 'yes'.</span>`,
    applyTimedOut: `<span class="dim">Enter a value: (час вийшов) — apply скасовано.</span>`,
    acquiringLock: `<span class="dim">Отримання блокування стану (це може зайняти хвилину)...</span>`,
    willDestroy: `<span class="dim">Terraform знищить:</span>`,
    plan: `<span class="amber">Plan: 0 to add, 0 to change, {n} to destroy.</span>`,
    reallyDestroy: `Ви справді хочете знищити всі ресурси? Для підтвердження приймається лише 'yes'.`,
    answeredForYou: `<span class="dim">Enter a value: <span class="glow">yes</span> (термінал відповів за вас)</span>`,
    destroyComplete: `<span class="amber">Destroy complete! Resources: {n} destroyed.</span>`,
    ripWeekend: `<span class="dim">(спочивайте з миром, вихідні.)</span>`,
  },

  ssh: {
    usage: "використання: ssh &lt;користувач@хост&gt;",
    knownHosts: `<span class="dim"># відомі хости на цій машині:</span> {hosts}`,
    handshake: [
      "запит рукостискання з {host} ...",
      "ECDSA key fingerprint is SHA256:7hR3s+kn0wYouR3Wo7rth.",
      "Are you sure you want to continue connecting (yes/no)? yes",
      "Warning: Permanently added '{host}' (ECDSA) to the list of known hosts.",
      "автентифікація...",
      "доступ надано.",
    ],
    connected: `під'єднано до <span class="glow">{host}</span>.`,
    closing: "закриття з'єднання з {host}...",
    menuPrompt: `Введіть команду, щоб поставити запитання, або "exit", щоб від'єднатися:`,
    topics: "теми:",
    askAnother: `<span class="dim">поставте ще одне запитання або введіть "exit"</span>`,
    unrecognized: `нерозпізнана команда — доступні: {cmds} або "exit"`,
    failFirst: [
      "ssh: під'єднання до {host} ...",
      "ssh: connect to host {host} port 22: Connection timed out",
      "ssh: повторна спроба (1/3)...",
      "ssh: повторна спроба (2/3)...",
      "ssh: connection reset by peer",
      `<span class="dim">цього хоста, схоже, не існує. цієї сесії теж.</span>`,
    ],
    failPersistent: [
      "ssh: під'єднання до {host} ...",
      "ssh: connect to host {host} port 22: Connection timed out",
      `<span class="amber">[примітка]</span> це спроба №{count} до хоста, якого не існує`,
      `<span class="amber">[примітка]</span> вражаюча наполегливість, чесно`,
      "ssh: цього хоста ніколи не існувало. Я перевірив. Двічі.",
      `<span class="dim">тс-с — може, спробуйте: <span class="glow">ssh {hint}</span></span>`,
    ],
  },

  claude: {
    version: `<span class="glow">Claude Code v2.1.4</span>`,
    usage: `використання: claude "&lt;запит&gt;" &nbsp;|&nbsp; claude log --oneline &nbsp;|&nbsp; claude --confess`,
    logCommits: [
      "feat: сховав кілька додаткових команд, нікому не сказав",
      "fix: курсор був на піксель правіше в порожньому рядку",
      "feat: гра за sudo, бо системи дозволів такі кумедні",
      "fix: клавіатура android плутала першу введену літеру (знову)",
      "feat: несправжні збої ssh, з розбиттям четвертої стіни",
      "revert: цього разу користувач попросив менш чемно :(",
    ],
    logFooter: `<span class="dim">у цього сайту зі мною довша історія комітів, ніж у більшості моїх справжніх стосунків</span>`,
    confess: "так — цей термінал зроблено, попросивши ШІ (привіт, це я).",
    lightTheme1: [
      "Гляну на поточне налаштування тем.",
      "Знайшов — на цьому сайті немає світлої теми. Ніколи не було. Ніколи не буде.",
      "Я міг би додати, але маю попередити: це може засмутити кота.",
      "Позначаю як won't-fix. Щось іще?",
    ],
    lightTheme2: [
      "Гаразд, ви наполегливі. Цього разу справді зроблю.",
      "Світлої теми тут немає. Доведеться написати.",
      "Накидаю світлу палітру... щось у дусі Ayu Light.",
      "Під'єдную і даю назву, яку ніхто не вгадає.",
      "Готово. Кота повідомлено, він подає скаргу.",
      "Зробити — моя робота, увімкнути — ваша: theme {theme}.",
      "Знімаю won't-fix. Щось іще?",
    ],
    lightTheme3: [
      "Ми це вже проходили.",
      "Тікет закрито. Робити більше нічого — просто введіть theme {theme}.",
    ],
    fixBug: ["Бага немає. Бага ніколи не було. Я перевірив. Двічі."],
    addTests: [
      "Знайдено 0 тестів. Це або дуже тривожно, або смілива дизайнерська рішучість.",
      `Обираю «сміливу дизайнерську рішучість» і рухаюся далі.`,
    ],
    generic: [
      "Зрозумів. Уже працюю над цим.",
      "Насправді це може зайняти більше часу, ніж очікувалося. Додаю до списку.",
      "(список довгий. список завжди довгий.)",
    ],
  },

  free: {
    swapNote: `<span class="dim">swap: майже повний, як і все інше</span>`,
  },

  who: {
    yourBrowser: "ваш браузер",
    stillFixing: "досі чинить прод",
  },
  files: {
    game: [
      "#!/bin/bash",
      "# {script} — не читайте, просто запустіть",
      '# див. також: <a href="{url}" target="_blank" rel="noopener">{url}</a>',
      "# примітка: знадобиться sudo",
      'echo "відкриваю маленький сюрприз..."',
      "xdg-open {url} 2&gt;/dev/null",
    ],
  },

  notFound: {
    message: "Немає такого файла або каталогу",
    description: "404 — сторінку не знайдено.",
    quip: "Ой! Схоже, кіт з'їв усю згущенку... і цю сторінку заодно.",
    catAlt: "Рудий кіт лежить на спині, втомлений, в оточенні розлитих банок згущенки.",
    back: "назад до термінала",
    unknownPage: "невідома-сторінка",
    switchTo: "Змінити мову",
    announce: "Мову перемкнено на українську",
  },

  cv: {
    catHint: `— відкрийте його командою <span class="glow">cv</span>`,
    opening: `відкриваю <span class="glow">cv.html</span> ...`,
    techPrefix: "// tech:",
    photoAlt: "{name}, {role} — портретне фото",
    photoAltNoRole: "{name} — портретне фото",
    print: "друк",
    backToTerminal: "назад до термінала",
    switchLanguage: "Змінити мову",
  },
};

export default uk;
