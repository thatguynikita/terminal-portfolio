import type { Messages } from "./en.ts";

/**
 * German messages. Typed as `Messages`, so a missing key is a build error.
 *
 * This catalogue ships in the repo but is **not selected** by
 * profile.config.ts — it is here so a fork can switch the site to German
 * by adding one import, and as the standing proof that an unselected
 * language costs the bundle nothing. `tsc` still checks it, so it cannot
 * drift out of shape when `en.ts` gains a key.
 */
const de: Messages = {
  ui: {
    welcome: "Willkommen in meinem albernen Terminal. Tippe „help“ für die Befehlsliste.",
    welcomeWhisper: "(psst — „help“ untertreibt. grab ruhig etwas tiefer.)",
    availableCommands: "Verfügbare Befehle:",
    notFound: `Befehl nicht gefunden: <span class="accent">{cmd}</span>`,
    notFoundHint: `<span class="dim">das hier ist ein albernes Terminal aus JavaScript, keine echte Shell. probier <span class="glow">help</span> für das, was es gibt</span>`,
    loggingOut: "wird abgemeldet ...",
    connClosed: "Verbindung zu {host} geschlossen.",
    footerHint: `tippe <span class="accent">help</span> zum Stöbern`,
    pageTitle: "Terminal",
    inputLabel: "Terminal-Befehlseingabe",
    outputLabel: "Terminal-Ausgabe",
  },

  boot: {
    lines: [
      "{host} Startvorgang — Kernel 6.6.0-sre",
      "[  OK  ] Modul geladen: years_of_uptime.ko",
      `<span class="rm-line">[FEHLER] /dev/motivation eingehängt: nicht gefunden</span>`,
      "[  OK  ] stattdessen /dev/coffee eingehängt",
      "[  OK  ] ssh-agent.service gestartet",
      "[  OK  ] kubernetes-cluster.service gestartet",
      `<span class="amber">[ WARN ] condensed-milk-reserve.service: kritisch niedrig (Katze informiert, wenig beeindruckt)</span>`,
      "[  OK  ] ai-assistant.service gestartet",
      "[  OK  ] recruiter-inbox.service gestartet (1125 ungelesen)",
      "[  OK  ] Bereitschafts-Pager stummgeschaltet (vorerst)",
      "",
      "Zugriff gewährt — willkommen, {user}",
    ],
  },

  /** One entry per registered command; `help` reads these. */
  commands: {
    about: "wer ist diese Person überhaupt",
    skills: "Tech-Stack",
    contact: "so erreichst du mich",
    cv: "den vollständigen Lebenslauf öffnen",
    neofetch: "Systeminfo-Karte",
    whoami: "ein bisschen zu viel über dich",
    ls: "Dateien auflisten",
    cat: "eine Datei ausgeben",
    fortune: "zufällige Weisheit",
    top: "unechter Prozessmonitor",
    kubectl: "einen Blick in einen Pseudo-Cluster werfen",
    terraform: "Optimismus ausrollen, alles zerstören",
    ssh: "Remote-Login — spar dir das Screening-Gespräch (oder finde heraus, was es sonst noch gibt)",
    claude: "einen KI-Assistenten fragen",
    theme: "Terminalfarbe ändern",
    matrix: "Hintergrundregen umschalten",
    lang: "Ausgabesprache wechseln",
    help: "diese Liste anzeigen",
    clear: "Bildschirm leeren",
    history: "Befehle, die du ausgeführt hast",
  },

  ls: {
    total: "insgesamt {n}",
  },

  cat: {
    usage: "Aufruf: cat &lt;Datei&gt;",
    noFile: "cat: {file}: Datei oder Verzeichnis nicht gefunden",
    notText: `cat: {file}: keine Textdatei`,
  },

  rm: {
    missingOperand: "rm: fehlender Operand",
    denied: "rm: „{file}“ kann nicht entfernt werden: Zugriff verweigert",
  },

  exec: {
    denied: "bash: ./{file}: Zugriff verweigert",
    notFound: "bash: ./{file}: Datei oder Verzeichnis nicht gefunden",
    notExecutable: "bash: ./{file}: Zugriff verweigert",
    launchingGame: `<span class="glow">{title}</span> wird in einem abgeschotteten CRT-Fenster gestartet ...`,
  },

  theme: {
    set: `Farbschema auf <span class="glow">{name}</span> gesetzt`,
    usage: "Aufruf: theme &lt;{names}&gt;",
  },

  matrix: {
    on: "Matrix-Regen: an",
    off: "Matrix-Regen: aus",
    usage: "Aufruf: matrix &lt;on|off&gt;",
  },

  lang: {
    set: `Sprache umgestellt auf <span class="glow">Deutsch</span>`,
    usage: "Aufruf: lang &lt;{codes}&gt;",
  },

  sudo: {
    reported: `<span class="amber">Dieser Vorfall wird gemeldet.</span>`,
    removing: `<span class="rm-line">{path} wird entfernt ...</span>`,
    justKidding: `<span class="amber">... nur Spaß. Guter Versuch aber.</span>`,
    noHarm: `<span class="dim">(es ist nichts passiert — das ist eine statische Seite, du sitzt in einem Browser, nicht auf einem echten Server)</span>`,
  },

  whoami: {
    user: "Benutzer",
    browser: "Browser",
    os: "Betriebssystem",
    tz: "Zeitzone",
    unknownOs: "ein unbekanntes Betriebssystem",
    unknownBrowser: "ein rätselhafter Browser",
    unknownTz: "eine unbekannte Zeitzone",
  },

  /** Buckets are keyed by name; the hour ranges live in the command. */
  timeQuips: {
    lateNight: [
      "noch wach? Respekt, aber auch besorgniserregend",
      "irgendwo ist es 3 Uhr nachts, und leider vielleicht genau hier",
      "die Maschinen schlafen nicht, und du offenbar auch nicht",
    ],
    earlyMorning: [
      "früh auf oder nie ins Bett — schwer zu sagen",
      "der ausgesprochen online frühe Vogel",
    ],
    morning: [
      "vernünftige Uhrzeit, sehr verantwortungsbewusst",
      "produktive Morgenenergie, alle Achtung",
    ],
    midday: ["Surfen in der Mittagspause, ein Klassiker", "erstklassiges Aufschiebe-Zeitfenster"],
    afternoon: [
      "das Nachmittagstief, Surfen als Bewältigungsstrategie",
      "Nachmittagsenergie, hält sich wacker",
    ],
    evening: ["Abendsurfen, die guten Sachen", "beste Scroll-Stunden, ganz ohne schlechtes Gewissen"],
    night: ["solltest längst schlafen", "noch ein Tab vor dem Schlafen, na klar"],
  },

  neofetch: {
    playing: "Läuft gerade",
    offline: "Spotify offline",
    idle: "gerade läuft nichts",
  },

  fortunes: [
    "Es ist immer DNS.",
    "99,9 % Verfügbarkeit heißt 8 Std. 46 Min. Ausfall im Jahr — sechs davon haben wir heute schon verbraucht.",
    "Es gibt keine Cloud. Es ist nur der Kubernetes-Cluster von jemand anderem.",
    "Freitags-Deploy-Energie: hohes Risiko, noch höheres Bedauern.",
    "Der Bug ist nie in Produktion. (Der Bug ist in Produktion.)",
    "Eine Pipeline, der man zusieht, wird nie fertig.",
    "Läuft auf meinem Rechner — dann liefern wir eben den Rechner aus.",
    "Chaos Engineering: das ist kein Bug, das ist ein Dienstag.",
    "Deine Rufbereitschaft hat angerufen. Sie möchte mehr Gehalt.",
    "Backups sind wie Zahnseide — alle finden sie wichtig, bis sie sie nicht benutzen.",
    "Automatisiere das Langweilige, dann automatisiere die Automatisierung.",
    "Daheim ist es doch am schönsten: 127.0.0.1.",
    "Ein verteiltes System ist eines, in dem ein Rechner, von dem du nie gehört hast, dich an der Arbeit hindern kann.",
    "Monitoring ohne Alarmierung ist nur ein sehr teurer Bildschirmschoner.",
    "Das beste Runbook ist das, das um 3 Uhr nachts niemand lesen muss.",
    "Postmortems: wo aus „menschlichem Versagen“ ganz leise eine „Prozesslücke“ wird.",
    "Deinem Load Balancer sind deine Gefühle egal.",
    "Idempotenz: weil zweimal ausführen nicht doppelt kosten sollte.",
    "Jeder „vorübergehende“ Workaround wird dauerhaft, sobald er funktioniert.",
    "Kubernetes: macht einfache Dinge kompliziert, seit 2014.",
    "Der Graph sah gut aus, bis jemand hineingezoomt hat.",
    "Infrastructure as Code: jetzt haben deine Tippfehler eine Versionsgeschichte.",
    "Nichts wird wirklich gelöscht — es ist nur irgendwann konsistent.",
    "Der Rollback-Knopf ist das meistunterschätzte Feature deiner ganzen Pipeline.",
    "SLOs: die Kunst, etwas weniger als 100 % zu versprechen.",
    "Eine gute Rufbereitschaft ist unsichtbar. Eine schlechte ist ein Gruppenchat um 2 Uhr nachts.",
    "Der Incident ist nie wirklich vorbei — er wird nur ein Jira-Ticket, das niemand zuweist.",
    "Du brauchst keine weiteren Dashboards. Du musst die lesen, die du hast.",
  ],

  top: {
    header: ["PID", "BEFEHL", "CPU%", "MEM%", "STATUS"],
    running: "läuft",
    sleeping: "schläft",
    zombie: "Zombie",
    quitHint: `<span class="dim">drücke <span class="accent">q</span> oder tippe <span class="accent">exit</span> zum Beenden</span>`,
    quitHintPlain: `drücke <span class="accent">q</span> oder tippe <span class="accent">exit</span> zum Beenden`,
    exited: "top beendet.",
    promptLabel: "(top — q zum Beenden)",
    chipQuit: "q — Ende",
  },

  kubectl: {
    header: ["NAME", "BEREIT", "STATUS", "ALTER"],
    running: "Running",
    justBarely: "gerade so",
    intro: "kubectl steuert den Kubernetes-Cluster-Manager.",
    subcommands: `verfügbare Unterbefehle: <span class="glow">get pods</span>, <span class="glow">describe pod &lt;name&gt;</span>`,
    describeUsage: "Aufruf: kubectl describe pod &lt;name&gt;",
    unknown: `Fehler: unbekannter Befehl „{cmd}“ für „kubectl“`,
    notFound: `Fehler vom Server (NotFound): Pod „{pod}“ nicht gefunden`,
    reason: "Grund",
    events: "Ereignisse",
    pods: {
      "cat-deployment-7f9d8c-x2m4q": {
        status: "Running",
        reason: "voll motiviert, Dosen Kondensmilch: 0/30",
        events: [
          "Started — Container vor 11 Jahren gestartet",
          "Normal — stabiler als die meisten Produktivdienste",
        ],
      },
      "condensed-milk-store-0": {
        status: "CrashLoopBackOff",
        reason: "OOMKilled (zu viel Kondensmilch gegessen)",
        events: [
          "Killing — Container hat das Zuckerlimit überschritten",
          "BackOff — Neustart verzögert, Container erholt sich",
          `Pulling — Image „cat:hungry-latest“`,
        ],
      },
      "sre-sanity-canary": {
        status: "Running",
        reason: "hält nur durch Kaffee und Sturheit zusammen",
        events: [
          "Started — Container gestartet",
          "Warning — Anspannung nähert sich dem kritischen Bereich",
        ],
      },
      "deploy-friday-afternoon": {
        status: "Evicted",
        reason: "Node-Druck: es ist Freitag, 17:58 Uhr",
        events: ["Evicted — der Node fand, für heute sei Schluss"],
      },
    },
  },

  terraform: {
    usage: "Aufruf: terraform &lt;Unterbefehl&gt;",
    subcommands: `verfügbare Unterbefehle: <span class="glow">apply</span>, <span class="glow">destroy</span>`,
    unknown: `terraform: unbekannter Unterbefehl „{cmd}“`,
    willPerform: `<span class="dim">Terraform wird die folgenden Aktionen ausführen:</span>`,
    destroyWeekend: `<span class="amber">Das wird dein Wochenende zerstören. Nur „yes“ wird als Zustimmung akzeptiert.</span>`,
    applyTimedOut: `<span class="dim">Wert eingeben: (Zeitüberschreitung) — apply abgebrochen.</span>`,
    acquiringLock: `<span class="dim">State-Lock wird geholt (das kann einen Moment dauern) ...</span>`,
    willDestroy: `<span class="dim">Terraform wird zerstören:</span>`,
    plan: `<span class="amber">Plan: 0 hinzuzufügen, 0 zu ändern, {n} zu zerstören.</span>`,
    reallyDestroy: `Willst du wirklich alle Ressourcen zerstören? Nur „yes“ wird als Zustimmung akzeptiert.`,
    answeredForYou: `<span class="dim">Wert eingeben: <span class="glow">yes</span> (das Terminal hat für dich geantwortet)</span>`,
    destroyComplete: `<span class="amber">Zerstörung abgeschlossen! Ressourcen: {n} zerstört.</span>`,
    ripWeekend: `<span class="dim">(Ruhe in Frieden, Wochenende.)</span>`,
  },

  ssh: {
    usage: "Aufruf: ssh &lt;benutzer@host&gt;",
    knownHosts: `<span class="dim"># bekannte Hosts auf diesem Rechner:</span> {hosts}`,
    handshake: [
      "Handshake mit {host} wird angefragt ...",
      "ECDSA-Schlüssel-Fingerabdruck ist SHA256:7hR3s+kn0wYouR3Wo7rth.",
      "Willst du die Verbindung wirklich fortsetzen (yes/no)? yes",
      "Warnung: „{host}“ (ECDSA) dauerhaft zur Liste bekannter Hosts hinzugefügt.",
      "Authentifizierung läuft ...",
      "Zugriff gewährt.",
    ],
    connected: `verbunden mit <span class="glow">{host}</span>.`,
    closing: "Verbindung zu {host} wird geschlossen ...",
    menuPrompt: `Tippe einen Befehl, um eine Frage zu stellen, oder „exit“ zum Trennen:`,
    topics: "Themen:",
    askAnother: `<span class="dim">stell noch eine Frage oder tippe „exit“</span>`,
    unrecognized: `unbekannter Befehl — verfügbar: {cmds} oder „exit“`,
    failFirst: [
      "ssh: verbinde mit {host} ...",
      "ssh: Verbindung zu Host {host} Port 22: Zeitüberschreitung",
      "ssh: neuer Versuch (1/3) ...",
      "ssh: neuer Versuch (2/3) ...",
      "ssh: Verbindung von der Gegenstelle zurückgesetzt",
      `<span class="dim">diesen Host scheint es nicht zu geben. diese Sitzung übrigens auch nicht.</span>`,
    ],
    failPersistent: [
      "ssh: verbinde mit {host} ...",
      "ssh: Verbindung zu Host {host} Port 22: Zeitüberschreitung",
      `<span class="amber">[Hinweis]</span> das ist Versuch Nr. {count} bei einem Host, den es nicht gibt`,
      `<span class="amber">[Hinweis]</span> beeindruckende Ausdauer, ehrlich gesagt`,
      "ssh: diesen Host hat es nie gegeben. Ich habe nachgesehen. Zweimal.",
      `<span class="dim">psst — versuch mal: <span class="glow">ssh {hint}</span></span>`,
    ],
  },

  claude: {
    version: `<span class="glow">Claude Code v2.1.4</span>`,
    usage: `Aufruf: claude "&lt;Anweisung&gt;" &nbsp;|&nbsp; claude log --oneline &nbsp;|&nbsp; claude --confess`,
    logCommits: [
      "feat: ein paar zusätzliche Befehle versteckt, niemandem Bescheid gesagt",
      "fix: Cursor stand auf leerer Zeile ein Pixel zu weit rechts",
      "feat: das Spiel hinter sudo gelegt, weil Rechtesysteme ja so lustig sind",
      "fix: Android-Tastatur hat den ersten getippten Buchstaben verwürfelt (schon wieder)",
      "feat: unechte ssh-Fehler, mit Bruch der vierten Wand",
      "revert: Nutzer hat diesmal weniger nett gefragt :(",
    ],
    logFooter: `<span class="dim">diese Website hat eine längere Commit-Historie mit mir als die meisten meiner echten Beziehungen</span>`,
    confess: "ja — dieses Terminal ist entstanden, indem jemand eine KI gefragt hat (hallo, das bin ich).",
    lightTheme1: [
      "Ich sehe mir die aktuelle Farbschema-Einrichtung an.",
      "Gefunden — diese Seite hat kein helles Farbschema. Hatte sie nie. Wird sie nie haben.",
      "Ich könnte eins bauen, möchte aber anmerken, dass das die Katze verstimmen könnte.",
      "Ich markiere das als won't-fix. Sonst noch etwas?",
    ],
    lightTheme2: [
      "Gut, du bleibst hartnäckig. Dann baue ich es diesmal wirklich.",
      "Hier ist kein helles Farbschema. Dann muss ich wohl eins schreiben.",
      "Ich skizziere eine helle Palette ... etwas im Geiste von Ayu Light.",
      "Ich verdrahte es und gebe ihm einen Namen, den niemand errät.",
      "Ausgeliefert. Die Katze wurde informiert und reicht Beschwerde ein.",
      "Das Bauen war mein Job — den Schalter umlegen ist deiner: theme {theme}.",
      "Ich nehme das won't-fix zurück. Sonst noch etwas?",
    ],
    lightTheme3: [
      "Das hatten wir doch schon.",
      "Das Ticket ist erledigt. Es gibt nichts mehr zu bauen — tipp einfach theme {theme}.",
    ],
    fixBug: ["Es gibt keinen Bug. Es gab nie einen Bug. Ich habe nachgesehen. Zweimal."],
    addTests: [
      "0 Tests gefunden. Das ist entweder sehr besorgniserregend oder eine mutige Design-Entscheidung.",
      `Ich entscheide mich für „mutige Design-Entscheidung“ und mache weiter.`,
    ],
    generic: [
      "Verstanden. Ich kümmere mich darum.",
      "Das dauert vielleicht doch länger als gedacht. Kommt auf die Liste.",
      "(die Liste ist lang. die Liste ist immer lang.)",
    ],
  },

  free: {
    swapNote: `<span class="dim">Swap: im Grunde voll, wie alles andere auch</span>`,
  },

  who: {
    yourBrowser: "dein Browser",
    stillFixing: "repariert immer noch Produktion",
  },
  files: {
    game: [
      "#!/bin/bash",
      "# {script} — nicht lesen, einfach ausführen",
      "# siehe auch: <a href=\"{url}\" target=\"_blank\" rel=\"noopener\">{url}</a>",
      "# Hinweis: du brauchst sudo",
      'echo "eine kleine Überraschung wird geöffnet ..."',
      "xdg-open {url} 2&gt;/dev/null",
    ],
  },

  notFound: {
    message: "Datei oder Verzeichnis nicht gefunden",
    description: "404 — Seite nicht gefunden.",
    quip: "Hoppla! Sieht aus, als hätte die Katze die ganze Kondensmilch gefressen ... und diese Seite gleich mit.",
    catAlt: "Eine orange Katze liegt müde auf dem Rücken, umgeben von verschütteten Kondensmilchdosen.",
    back: "zurück zum Terminal",
    unknownPage: "unbekannte-seite",
    switchTo: "Sprache wechseln",
    announce: "Sprache umgestellt auf Deutsch",
  },

  cv: {
    catHint: `— nimm stattdessen <span class="glow">cv</span> zum Öffnen`,
    opening: `<span class="glow">cv.html</span> wird geöffnet ...`,
    techPrefix: "// Technik:",
    photoAlt: "{name}, {role} — Porträtfoto",
    photoAltNoRole: "{name} — Porträtfoto",
    print: "drucken",
    backToTerminal: "zurück zum Terminal",
    switchLanguage: "Sprache wechseln",
  },

};

export default de;
