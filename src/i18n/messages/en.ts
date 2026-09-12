/**
 * English messages. This file is the schema: `ru.ts` is typed as
 * `Messages`, so TypeScript fails the build on any key missing there.
 *
 * `{name}` placeholders are substituted by `t()`.
 */
const en = {
  ui: {
    welcome: "Welcome to my silly terminal. Type 'help' to see what's available.",
    welcomeWhisper: "(psst — 'help' is being modest. dig a little.)",
    availableCommands: "Available commands:",
    notFound: `command not found: <span class="accent">{cmd}</span>`,
    notFoundHint: `<span class="dim">this is a silly terminal held together by JavaScript, not a real shell. try <span class="glow">help</span> for what's here</span>`,
    loggingOut: "logging out...",
    connClosed: "connection to {host} closed.",
    footerHint: `type <span class="accent">help</span> to explore`,
    inputLabel: "Terminal command input",
    outputLabel: "Terminal output",
  },

  boot: {
    lines: [
      "{host} boot sequence — kernel 6.6.0-sre",
      "[  OK  ] loaded module: eleven_years_of_uptime.ko",
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

  /** One entry per registered command; `help` reads these. */
  commands: {
    about: "who is that guy anyway",
    skills: "tech stack",
    contact: "ways to reach me",
    cv: "open the full CV",
    neofetch: "system info card",
    whoami: "a little too much about you",
    ls: "list files",
    cat: "print a file",
    fortune: "random sysadmin wisdom",
    top: "fake process monitor",
    kubectl: "peek at a pretend cluster",
    terraform: "apply optimism, destroy everything",
    ssh: "remote login — skip the screening call (or find out what else is out there)",
    claude: "ask an AI assistant",
    theme: "change terminal color",
    matrix: "toggle background rain",
    lang: "switch output language",
    help: "show this list",
    clear: "clear the screen",
    history: "commands you've run",
  },

  ls: {
    total: "total {n}",
  },

  cat: {
    usage: "usage: cat &lt;file&gt;",
    noFile: "cat: {file}: No such file or directory",
    notText: `cat: {file}: not a text file`,
  },

  rm: {
    missingOperand: "rm: missing operand",
    denied: "rm: cannot remove '{file}': Permission denied",
  },

  exec: {
    denied: "bash: ./{file}: Permission denied",
    notFound: "bash: ./{file}: No such file or directory",
    notExecutable: "bash: ./{file}: Permission denied",
    launchingGame: `launching <span class="glow">{title}</span> in a sandboxed CRT window...`,
  },

  theme: {
    set: `theme set to <span class="glow">{name}</span>`,
    usage: "usage: theme &lt;{names}&gt;",
  },

  matrix: {
    on: "matrix rain: on",
    off: "matrix rain: off",
    usage: "usage: matrix &lt;on|off&gt;",
  },

  lang: {
    set: `language switched to <span class="glow">English</span>`,
    usage: "usage: lang &lt;{codes}&gt;",
  },

  sudo: {
    reported: `<span class="amber">This incident will be reported.</span>`,
    removing: `<span class="rm-line">removing {path} ...</span>`,
    justKidding: `<span class="amber">...just kidding. nice try though.</span>`,
    noHarm: `<span class="dim">(nothing was harmed — this is a static site, you're in a browser, not a real server)</span>`,
  },

  whoami: {
    user: "User",
    browser: "Browser",
    os: "OS",
    tz: "Timezone",
    unknownOs: "an unknown OS",
    unknownBrowser: "a mystery browser",
    unknownTz: "an unknown timezone",
  },

  /** Buckets are keyed by name; the hour ranges live in the command. */
  timeQuips: {
    lateNight: [
      "still awake? respect, but also concerning",
      "it's 3am somewhere, and unfortunately it might be here",
      "the machines don't sleep and apparently neither do you",
    ],
    earlyMorning: [
      "up early, or never went to bed — hard to say which",
      "the extremely online early bird",
    ],
    morning: [
      "reasonable hours, very responsible of you",
      "productive morning energy, I respect it",
    ],
    midday: ["lunch break browsing, a classic", "prime procrastination window"],
    afternoon: [
      "the 3pm slump, browsing as a coping mechanism",
      "afternoon energy, holding strong",
    ],
    evening: ["evening browsing, the good stuff", "prime scrolling hours, no shame in it"],
    night: ["should probably be asleep by now", "one more tab before bed, sure"],
  },

  neofetch: {
    playing: "Playing",
    offline: "spotify offline",
    idle: "nothing playing right now",
  },

  fortunes: [
    "It's always DNS.",
    "99.9% uptime means 8h46m of downtime a year — we've already used six of them today.",
    "There is no cloud. It's just someone else's Kubernetes cluster.",
    "Friday deploy energy: high risk, higher regret.",
    "The bug is never in prod. (The bug is in prod.)",
    "A watched pipeline never finishes.",
    "Works on my machine — shipping the machine.",
    "Chaos engineering: it's not a bug, it's a Tuesday.",
    "Your on-call shift called. It wants a raise.",
    "Backups are like flossing — everyone agrees they matter, right up until they don't do them.",
    "Automate the boring stuff, then automate the automation.",
    "There's no place like 127.0.0.1.",
    "A distributed system is one where a machine you've never heard of can stop you from doing your job.",
    "Monitoring without alerting is just a very expensive screensaver.",
    "The best runbook is the one nobody has to read at 3am.",
    "Postmortems: where 'human error' quietly becomes 'process gap'.",
    "Your load balancer doesn't care about your feelings.",
    "Idempotency: because running it twice shouldn't cost you twice.",
    "Every 'temporary' fix becomes permanent the moment it works.",
    "Kubernetes: making simple things complicated since 2014.",
    "The graph looked fine until someone zoomed in.",
    "Infrastructure as Code: now your typos have version history.",
    "Nothing is really deleted — it's just eventually consistent.",
    "The rollback button is the most underrated feature in your whole pipeline.",
    "SLOs: the art of promising slightly less than 100%.",
    "A good on-call rotation is invisible. A bad one is a group chat at 2am.",
    "The incident is never really over — it just becomes a Jira ticket nobody assigns.",
    "You don't need more dashboards. You need to read the ones you have.",
  ],

  top: {
    header: ["PID", "CMD", "CPU%", "MEM%", "STATUS"],
    running: "running",
    sleeping: "sleeping",
    zombie: "zombie",
    quitHint: `<span class="dim">press <span class="accent">q</span> or type <span class="accent">exit</span> to quit</span>`,
    quitHintPlain: `press <span class="accent">q</span> or type <span class="accent">exit</span> to quit`,
    exited: "exited top.",
    promptLabel: "(top — q to quit)",
    chipQuit: "q — quit",
  },

  kubectl: {
    header: ["NAME", "READY", "STATUS", "AGE"],
    running: "Running",
    justBarely: "just barely",
    intro: "kubectl controls the Kubernetes cluster manager.",
    subcommands: `available subcommands: <span class="glow">get pods</span>, <span class="glow">describe pod &lt;name&gt;</span>`,
    describeUsage: "usage: kubectl describe pod &lt;name&gt;",
    unknown: `error: unknown command "{cmd}" for "kubectl"`,
    notFound: `Error from server (NotFound): pods "{pod}" not found`,
    reason: "Reason",
    events: "Events",
    pods: {
      "cat-deployment-7f9d8c-x2m4q": {
        status: "Running",
        reason: "fully motivated, condensed milk cans: 0/30",
        events: [
          "Started — container started 11 years ago",
          "Normal — more stable than most production services",
        ],
      },
      "condensed-milk-store-0": {
        status: "CrashLoopBackOff",
        reason: "OOMKilled (ate too much condensed milk)",
        events: [
          "Killing — container exceeded sugar limit",
          "BackOff — restart delayed, container is recovering",
          `Pulling — image "cat:hungry-latest"`,
        ],
      },
      "sre-sanity-canary": {
        status: "Running",
        reason: "held together by coffee and stubbornness",
        events: [
          "Started — container started",
          "Warning — anxiety level approaching critical",
        ],
      },
      "deploy-friday-afternoon": {
        status: "Evicted",
        reason: "node pressure: it's Friday, 5:58pm",
        events: ["Evicted — the node decided it was done for the day"],
      },
    },
  },

  terraform: {
    usage: "usage: terraform &lt;subcommand&gt;",
    subcommands: `available subcommands: <span class="glow">apply</span>, <span class="glow">destroy</span>`,
    unknown: `terraform: unknown subcommand "{cmd}"`,
    willPerform: `<span class="dim">Terraform will perform the following actions:</span>`,
    destroyWeekend: `<span class="amber">This will destroy your weekend. Only 'yes' will be accepted to approve.</span>`,
    applyTimedOut: `<span class="dim">Enter a value: (timed out) — apply cancelled.</span>`,
    acquiringLock: `<span class="dim">Acquiring state lock (this may take a few moments)...</span>`,
    willDestroy: `<span class="dim">Terraform will destroy:</span>`,
    plan: `<span class="amber">Plan: 0 to add, 0 to change, {n} to destroy.</span>`,
    reallyDestroy: `Do you really want to destroy all resources? Only 'yes' will be accepted to approve.`,
    answeredForYou: `<span class="dim">Enter a value: <span class="glow">yes</span> (the terminal answered for you)</span>`,
    destroyComplete: `<span class="amber">Destroy complete! Resources: {n} destroyed.</span>`,
    ripWeekend: `<span class="dim">(RIP weekend.)</span>`,
  },

  ssh: {
    usage: "usage: ssh &lt;user@host&gt;",
    knownHosts: `<span class="dim"># known hosts on this machine:</span> {hosts}`,
    handshake: [
      "requesting handshake with {host} ...",
      "ECDSA key fingerprint is SHA256:7hR3s+kn0wYouR3Wo7rth.",
      "Are you sure you want to continue connecting (yes/no)? yes",
      "Warning: Permanently added '{host}' (ECDSA) to the list of known hosts.",
      "authenticating...",
      "access granted.",
    ],
    connected: `connected to <span class="glow">{host}</span>.`,
    closing: "closing connection to {host}...",
    menuPrompt: `Type a command to ask a question, or "exit" to disconnect:`,
    topics: "topics:",
    askAnother: `<span class="dim">ask another question, or type "exit"</span>`,
    unrecognized: `unrecognized command — available: {cmds} or "exit"`,
    failFirst: [
      "ssh: connecting to {host} ...",
      "ssh: connect to host {host} port 22: Connection timed out",
      "ssh: retrying (1/3)...",
      "ssh: retrying (2/3)...",
      "ssh: connection reset by peer",
      `<span class="dim">this host does not appear to exist. neither does this session.</span>`,
    ],
    failPersistent: [
      "ssh: connecting to {host} ...",
      "ssh: connect to host {host} port 22: Connection timed out",
      `<span class="amber">[note]</span> this is attempt #{count} at a host that does not exist`,
      `<span class="amber">[note]</span> impressive persistence, honestly`,
      "ssh: this host has never existed. I checked. Twice.",
      `<span class="dim">psst — maybe try: <span class="glow">ssh {hint}</span></span>`,
    ],
  },

  claude: {
    version: `<span class="glow">Claude Code v2.1.4</span>`,
    usage: `usage: claude "&lt;prompt&gt;" &nbsp;|&nbsp; claude log --oneline &nbsp;|&nbsp; claude --confess`,
    logCommits: [
      "feat: hid a few extra commands, didn't tell anyone",
      "fix: cursor was one pixel to the right on empty line",
      "feat: sudo-gate the game, because permission systems are so funny",
      "fix: android keyboard scrambled the first typed letter (again)",
      "feat: fake ssh failures, with a fourth-wall break",
      "revert: user asked less nicely this time :(",
    ],
    logFooter: `<span class="dim">this website has a longer commit history with me than most of my actual relationships</span>`,
    confess: "yes — this terminal was built by asking an AI (hi, that's me).",
    lightTheme1: [
      "I'll take a look at the current theming setup.",
      "Found it — this site doesn't have a light theme. It never has. It never will.",
      "I could add one, but I'd like to flag it may upset the cat.",
      "Marking as won't-fix. Anything else?",
    ],
    lightTheme2: [
      "Alright, you're persistent. Let me actually build it this time.",
      "No light theme in here. Guess I'll have to write one.",
      "Sketching out a light palette... something in the spirit of Ayu Light.",
      "Wiring it up and naming it something nobody will guess.",
      "Shipped it. The cat has been informed and is filing a complaint.",
      "Building it was my job — flipping the switch is yours: theme {theme}.",
      "Un-marking as won't-fix. Anything else?",
    ],
    lightTheme3: [
      "We've been over this.",
      "Ticket's marked done. Nothing left to build — just type theme {theme}.",
    ],
    fixBug: ["There is no bug. There has never been a bug. I checked. Twice."],
    addTests: [
      "Found 0 tests. This is either very concerning or a bold design decision.",
      `I'm going to go with "bold design decision" and move on.`,
    ],
    generic: [
      "Got it. Working on that now.",
      "Actually, this might take longer than expected. Adding it to the list.",
      "(the list is long. the list is always long.)",
    ],
  },

  free: {
    swapNote: `<span class="dim">swap: basically full, much like everything else</span>`,
  },

  who: {
    yourBrowser: "your browser",
    stillFixing: "still fixing prod",
  },
  files: {
    game: [
      "#!/bin/bash",
      "# {script} — don't read it, just run it",
      "# see also: <a href=\"{url}\" target=\"_blank\" rel=\"noopener\">{url}</a>",
      "# note: you'll need sudo",
      'echo "opening a little surprise..."',
      "xdg-open {url} 2&gt;/dev/null",
    ],
  },

  notFound: {
    message: "No such file or directory",
    quip: "Oops! Looks like the cat ate all the condensed milk... and this page too.",
    catAlt: "An orange cat lies on its back, tired, surrounded by spilled condensed-milk cans.",
    back: "back to terminal",
    unknownPage: "unknown-page",
    switchTo: "Switch language",
    announce: "Language switched to English",
  },

  cv: {
    catHint: `— use <span class="glow">cv</span> to open it instead`,
    opening: `opening <span class="glow">cv.html</span> ...`,
    techPrefix: "// tech:",
    photoAlt: "{name}, {role} — portrait photo",
    print: "print",
    backToTerminal: "back to terminal",
    switchLanguage: "Switch language",
  },

};

export type Messages = typeof en;
export default en;
