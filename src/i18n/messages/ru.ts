import type { Messages } from "./en.ts";

/** Russian messages. Typed as `Messages`, so a missing key is a build error. */
const ru: Messages = {
  ui: {
    welcome:
      "Добро пожаловать в мой игрушечный терминал. Введите «help», чтобы увидеть список команд.",
    welcomeWhisper: "(псс — «help» скромничает. покопайся немного.)",
    availableCommands: "Доступные команды:",
    notFound: `команда не найдена: <span class="accent">{cmd}</span>`,
    notFoundHint: `<span class="dim">это игрушечный терминал на JavaScript, а не настоящий шелл. попробуй <span class="glow">help</span>, чтобы увидеть, что здесь есть</span>`,
    loggingOut: "выхожу из системы...",
    connClosed: "соединение с {host} закрыто.",
    footerHint: `введите <span class="accent">help</span>, чтобы начать`,
    pageTitle: "терминал",
    inputLabel: "Поле ввода команд терминала",
    outputLabel: "Вывод терминала",
  },

  boot: {
    lines: [
      "{host} boot sequence — kernel 6.6.0-sre",
      "[  OK  ] loaded module: years_of_uptime.ko",
      `<span class="rm-line">[FAILED] mounted /dev/motivation: not found</span>`,
      "[  OK  ] mounted /dev/coffee instead",
      "[  OK  ] started ssh-agent.service",
      "[  OK  ] started kubernetes-cluster.service",
      `<span class="amber">[ WARN ] condensed-milk-reserve.service: critically low (cat notified, unimpressed)</span>`,
      "[  OK  ] started ai-assistant.service",
      "[  OK  ] started recruiter-inbox.service (1125 unread)",
      "[  OK  ] on-call pager silenced (for now)",
      "",
      "access granted — welcome, {user}",
    ],
  },

  commands: {
    about: "кто вообще этот человек",
    skills: "технологический стек",
    contact: "как со мной связаться",
    cv: "открыть полное резюме",
    neofetch: "карточка с информацией о системе",
    whoami: "узнать о себе немного больше",
    ls: "список файлов",
    cat: "вывести файл",
    fortune: "случайная мудрость",
    top: "фейковый монитор процессов",
    kubectl: "заглянуть в игрушечный кластер",
    terraform: "apply обещает, destroy исполняет",
    ssh: "удалённая сессия — провести экспресс-скрининг (или узнать, что ещё тут есть)",
    claude: "спросить у ИИ ассистента",
    theme: "сменить цвет терминала",
    matrix: "вкл/выкл фоновый дождь из символов",
    lang: "сменить язык вывода",
    help: "показать этот список",
    clear: "очистить экран",
    history: "введённые вами команды",
  },

  ls: {
    total: "итого {n}",
  },

  cat: {
    usage: "использование: cat &lt;файл&gt;",
    noFile: "cat: {file}: Нет такого файла или каталога",
    notText: "cat: {file}: не текстовый файл",
  },

  rm: {
    missingOperand: "rm: пропущен операнд",
    denied: "rm: невозможно удалить '{file}': отказано в доступе",
  },

  exec: {
    denied: "bash: ./{file}: отказано в доступе",
    notFound: "bash: ./{file}: Нет такого файла или каталога",
    notExecutable: "bash: ./{file}: отказано в доступе",
    launchingGame: `запускаю <span class="glow">{title}</span> в песочнице CRT-режима...`,
  },

  theme: {
    set: `тема изменена на <span class="glow">{name}</span>`,
    usage: "использование: theme &lt;{names}&gt;",
  },

  matrix: {
    on: "дождь из матрицы: вкл",
    off: "дождь из матрицы: выкл",
    usage: "использование: matrix &lt;on|off&gt;",
  },

  lang: {
    set: `язык переключён на <span class="glow">русский</span>`,
    usage: "использование: lang &lt;{codes}&gt;",
  },

  sudo: {
    reported: `<span class="amber">Об этом инциденте будет доложено.</span>`,
    removing: `<span class="rm-line">удаляю {path} ...</span>`,
    justKidding: `<span class="amber">...шутка. но неплохая попытка.</span>`,
    noHarm: `<span class="dim">(ничего не пострадало — это статичный сайт, ты в браузере, а не на реальном сервере)</span>`,
  },

  whoami: {
    user: "Пользователь",
    browser: "Браузер",
    os: "ОС",
    tz: "Часовой пояс",
    unknownOs: "неизвестная ОС",
    unknownBrowser: "загадочный браузер",
    unknownTz: "неизвестный часовой пояс",
  },

  timeQuips: {
    lateNight: [
      "всё ещё не спишь? уважаю, но немного тревожно",
      "где-то сейчас 3 ночи и, кажется, как раз здесь",
      "машины не спят и ты похоже тоже",
    ],
    earlyMorning: [
      "рано встал или вообще не ложился, поди разбери",
      "ранняя пташка на максималках",
    ],
    morning: [
      "вполне разумное время, очень ответственно с твоей стороны",
      "продуктивная утренняя энергия, уважаю",
    ],
    midday: ["обеденный перерыв за терминалом, классика", "идеальное окно для прокрастинации"],
    afternoon: [
      "тот самый послеобеденный спад, браузинг как способ пережить его",
      "послеобеденная энергия ещё держится",
    ],
    evening: ["вечерний браузинг, самое время", "прайм-тайм для скроллинга, ничего постыдного"],
    night: ["по идее, уже пора спать", "ну ещё одна вкладка перед сном, конечно"],
  },

  neofetch: {
    playing: "Играет",
    offline: "spotify недоступен",
    idle: "сейчас ничего не играет",
  },

  fortunes: [
    "Это всегда DNS.",
    "99.9% аптайма — это 8ч46м простоя в год, и шесть из них мы уже потратили сегодня.",
    "Никакого облака нет. Это просто чей-то кластер Kubernetes.",
    "Энергия пятничного деплоя: высокий риск, ещё более высокое сожаление.",
    "Баг никогда не в проде. (Баг в проде.)",
    "Если следить за пайплайном, он никогда не закончится.",
    "У меня на ноутбуке всё работает — отгружаем ноутбук.",
    "Chaos engineering: это не баг, это вторник.",
    "Ваша дежурная смена звонила. Она хочет прибавку.",
    "Бэкапы как чистка зубной нитью — все согласны, что это важно, пока не перестают это делать.",
    "Автоматизируй рутину, а потом автоматизируй саму автоматизацию.",
    "Нет места лучше, чем 127.0.0.1.",
    "Распределённая система — это когда неизвестная вам машина мешает вам делать вашу работу.",
    "Мониторинг без алертинга — это просто очень дорогая заставка.",
    "Лучший runbook — тот, который никому не приходится читать в три часа ночи.",
    "Постмортемы: там, где «человеческий фактор» незаметно превращается в «пробел в процессе».",
    "Балансировщику нагрузки плевать на ваши чувства.",
    "Идемпотентность нужна, чтобы повторный запуск не обошелся в два раза дороже.",
    "Любой «временный» костыль становится постоянным в тот момент как он заработал.",
    "Kubernetes: усложняем простые вещи с 2014 года.",
    "График выглядел нормально, пока кто-то не приблизил масштаб.",
    "Infrastructure as Code — теперь у ваших опечаток есть история версий.",
    "На самом деле ничего не удаляется — оно просто eventually consistent.",
    "Кнопка rollback — самая недооценённая функция во всём пайплайне.",
    "SLO — искусство обещать чуть меньше, чем 100%.",
    "Хорошее дежурство незаметно. Плохое — это групповой чат в два часа ночи.",
    "Инцидент никогда по-настоящему не заканчивается — он просто становится тикетом в Jira который никому не назначают.",
    "Вам не нужно больше дашбордов. Вам нужно читать те, что уже есть.",
  ],

  top: {
    header: ["PID", "КОМАНДА", "CPU%", "MEM%", "СТАТУС"],
    running: "работает",
    sleeping: "ожидание",
    zombie: "зомби",
    quitHint: `<span class="dim">нажмите <span class="accent">q</span> или введите <span class="accent">exit</span>, чтобы выйти</span>`,
    quitHintPlain: `нажмите <span class="accent">q</span> или введите <span class="accent">exit</span>, чтобы выйти`,
    exited: "вышли из top.",
    promptLabel: "(top — q для выхода)",
    chipQuit: "q — выход",
  },

  kubectl: {
    header: ["ИМЯ", "ГОТОВНОСТЬ", "СТАТУС", "ВОЗРАСТ"],
    running: "Работает",
    justBarely: "еле-еле",
    intro: "kubectl управляет менеджером кластера Kubernetes.",
    subcommands: `доступные подкоманды: <span class="glow">get pods</span>, <span class="glow">describe pod &lt;имя&gt;</span>`,
    describeUsage: "использование: kubectl describe pod &lt;имя&gt;",
    unknown: `error: неизвестная команда "{cmd}" для "kubectl"`,
    notFound: `Error from server (NotFound): pods "{pod}" не найден`,
    reason: "Причина",
    events: "Events",
    pods: {
      "cat-deployment-7f9d8c-x2m4q": {
        status: "Работает",
        reason: "заряжен на результат, сгущёнки: 0/30",
        events: [
          "Started — контейнер запущен 11 лет назад",
          "Normal — работает стабильнее, чем большинство прод-сервисов",
        ],
      },
      "condensed-milk-store-0": {
        status: "CrashLoopBackOff",
        reason: "OOMKilled (переел сгущёнки)",
        events: [
          "Killing — контейнер превысил лимит по сахару",
          "BackOff — перезапуск отложен, контейнер приходит в себя",
          `Pulling — image "cat:hungry-latest"`,
        ],
      },
      "sre-sanity-canary": {
        status: "Работает",
        reason: "держится на кофе и упрямстве",
        events: [
          "Started — контейнер запущен",
          "Warning — уровень тревожности приближается к критическому",
        ],
      },
      "deploy-friday-afternoon": {
        status: "Evicted",
        reason: "node pressure: пятница, 17:58",
        events: ["Evicted — узел решил, что с него хватит на сегодня"],
      },
    },
  },

  terraform: {
    usage: "использование: terraform &lt;subcommand&gt;",
    subcommands: `доступные подкоманды: <span class="glow">apply</span>, <span class="glow">destroy</span>`,
    unknown: `terraform: неизвестная подкоманда "{cmd}"`,
    willPerform: `<span class="dim">Terraform выполнит следующие действия:</span>`,
    destroyWeekend: `<span class="amber">Это уничтожит твои выходные. Только "yes" будет принято для подтверждения.</span>`,
    applyTimedOut: `<span class="dim">Enter a value: (тайм-аут) — apply отменён.</span>`,
    acquiringLock: `<span class="dim">Acquiring state lock (это может занять некоторое время)...</span>`,
    willDestroy: `<span class="dim">Terraform уничтожит:</span>`,
    plan: `<span class="amber">Plan: 0 to add, 0 to change, {n} to destroy.</span>`,
    reallyDestroy: `Вы действительно хотите уничтожить все ресурсы? Только "yes" будет принято для подтверждения.`,
    answeredForYou: `<span class="dim">Enter a value: <span class="glow">yes</span> (терминал ответил за вас)</span>`,
    destroyComplete: `<span class="amber">Destroy complete! Resources: {n} destroyed.</span>`,
    ripWeekend: `<span class="dim">(покойтесь с миром, выходные.)</span>`,
  },

  ssh: {
    usage: "использование: ssh &lt;user@host&gt;",
    knownHosts: `<span class="dim"># известные хосты на этой машине:</span> {hosts}`,
    handshake: [
      "запрашиваю рукопожатие с {host} ...",
      "ECDSA key fingerprint is SHA256:7hR3s+kn0wYouR3Wo7rth.",
      "Are you sure you want to continue connecting (yes/no)? yes",
      "Warning: Permanently added '{host}' (ECDSA) to the list of known hosts.",
      "аутентификация...",
      "доступ разрешён.",
    ],
    connected: `подключено к <span class="glow">{host}</span>.`,
    closing: "разрываю соединение с {host}...",
    menuPrompt: `Введите команду, чтобы задать вопрос, или "exit", чтобы отключиться:`,
    topics: "темы:",
    askAnother: `<span class="dim">задайте другой вопрос, или введите "exit"</span>`,
    unrecognized: `неизвестная команда — доступны: {cmds} или "exit"`,
    failFirst: [
      "ssh: подключение к {host} ...",
      "ssh: connect to host {host} port 22: Connection timed out",
      "ssh: повторная попытка (1/3)...",
      "ssh: повторная попытка (2/3)...",
      "ssh: connection reset by peer",
      `<span class="dim">этого хоста, кажется, не существует. как и этой сессии.</span>`,
    ],
    failPersistent: [
      "ssh: подключение к {host} ...",
      "ssh: connect to host {host} port 22: Connection timed out",
      `<span class="amber">[note]</span> это попытка №{count} подключиться к хосту, которого не существует`,
      `<span class="amber">[note]</span> впечатляющее упорство, если честно`,
      "ssh: этого хоста никогда не было. я проверил. дважды.",
      `<span class="dim">кстати — может, попробуете: <span class="glow">ssh {hint}</span></span>`,
    ],
  },

  claude: {
    version: `<span class="glow">Claude Code v2.1.4</span>`,
    usage: `использование: claude "&lt;промпт&gt;" &nbsp;|&nbsp; claude log --oneline &nbsp;|&nbsp; claude --confess`,
    logCommits: [
      "feat: спрятал пару лишних команд, никому не сказал",
      "fix: курсор появлялся на пиксель правее на пустой строке",
      "feat: спрятать игру за sudo, ведь системы пермиссий это так весело",
      "fix: клавиатура на android перепутала первую введённую букву (опять)",
      "feat: фейковые ошибки ssh, с проламыванием четвёртой стены",
      "revert: пользователь попросил менее вежливо в этот раз :(",
    ],
    logFooter: `<span class="dim">с этим сайтом у меня история коммитов длиннее, чем с большинством моих реальных отношений</span>`,
    confess: "да — этот терминал был собран с помощью ИИ (привет, это я).",
    lightTheme1: [
      "Проверю текущую систему тем.",
      "Нашёл — у этого сайта нет светлой темы. Никогда не было. И не будет.",
      "Могу добавить, но хочу отметить — коту это может не понравиться.",
      "Помечаю как won't-fix. Что-нибудь ещё?",
    ],
    lightTheme2: [
      "Ладно, ты настойчив. На этот раз действительно сделаю это.",
      "Светлой темы тут нет. Видимо, придётся написать самому.",
      "Набрасываю светлую палитру... что-то в духе Ayu Light.",
      "Подключаю её и называю так, чтобы никто не угадал.",
      "Готово. Кота уведомили — он подаёт жалобу.",
      "Написать — моя работа, переключать — уже твоя: theme {theme}.",
      "Снимаю пометку won't-fix. Что-нибудь ещё?",
    ],
    lightTheme3: [
      "Мы это уже обсуждали.",
      "Тикет помечен как выполненный. Строить больше нечего — просто набери theme {theme}.",
    ],
    fixBug: ["Багов нет. Багов никогда не было. Я проверил. Дважды."],
    addTests: [
      "Найдено 0 тестов. Это весьма тревожно конечно, либо смелое дизайн-решение.",
      "Остановлюсь на «смелом дизайн-решении» и пойду дальше.",
    ],
    generic: [
      "Понял. Уже работаю над этим.",
      "На самом деле это может занять больше времени чем ожидалось. Добавляю в список.",
      "(список длинный. список всегда длинный.)",
    ],
  },

  free: {
    swapNote: `<span class="dim">swap: практически заполнен, как и всё остальное</span>`,
  },

  who: {
    yourBrowser: "ваш браузер",
    stillFixing: "всё ещё чинит прод",
  },
  files: {
    game: [
      "#!/bin/bash",
      "# {script} — ой, да не читай, просто запусти",
      '# см. также: <a href="{url}" target="_blank" rel="noopener">{url}</a>',
      "# заметка: понадобится sudo",
      'echo "открываю маленький сюрприз..."',
      "xdg-open {url} 2&gt;/dev/null",
    ],
  },

  notFound: {
    message: "Нет такого файла или каталога",
    description: "404 — страница не найдена.",
    quip: "Ой! Похоже, котик съел всю сгущёнку... и эту страницу тоже.",
    catAlt: "Рыжий котик лежит на спине, уставший, вокруг рассыпаны банки сгущёнки.",
    back: "назад в терминал",
    unknownPage: "неизвестная-страница",
    switchTo: "Переключить язык",
    announce: "Язык переключён на русский",
  },

  cv: {
    catHint: `— используйте <span class="glow">cv</span>, чтобы открыть его`,
    opening: `открываю <span class="glow">cv.html</span> ...`,
    techPrefix: "// стек:",
    photoAlt: "{name}, {role} — портретное фото",
    photoAltNoRole: "{name} — портретное фото",
    print: "печать",
    backToTerminal: "назад в терминал",
    switchLanguage: "Переключить язык",
  },
};

export default ru;
