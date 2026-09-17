import type { Messages } from "./en.ts";

/**
 * Italian messages. Typed as `Messages`, so a missing key is a build error.
 *
 * Ships in the repo but is **not selected** by profile.config.ts: a fork
 * switches the site to Italian by adding one import to `MESSAGES`, and an
 * unselected catalogue costs the bundle nothing. `tsc` still checks it, so
 * it cannot drift out of shape when `en.ts` gains a key.
 */
const it: Messages = {
  ui: {
    welcome: "Benvenuto nel mio terminale scemo. Digita 'help' per vedere cosa c'è.",
    welcomeWhisper: "(psst — 'help' è modesto. scava un po'.)",
    availableCommands: "Comandi disponibili:",
    notFound: `comando non trovato: <span class="accent">{cmd}</span>`,
    notFoundHint: `<span class="dim">questo è un terminale scemo tenuto insieme dal JavaScript, non una vera shell. prova <span class="glow">help</span> per vedere cosa c'è</span>`,
    loggingOut: "disconnessione...",
    connClosed: "connessione a {host} chiusa.",
    footerHint: `digita <span class="accent">help</span> per esplorare`,
    pageTitle: "terminale",
    inputLabel: "Inserimento comandi del terminale",
    outputLabel: "Output del terminale",
  },

  boot: {
    lines: [
      "sequenza di avvio di {host} — kernel 6.6.0-sre",
      "[  OK  ] modulo caricato: years_of_uptime.ko",
      `<span class="rm-line">[FAILED] montaggio di /dev/motivation: non trovato</span>`,
      "[  OK  ] montato /dev/coffee al suo posto",
      "[  OK  ] avviato ssh-agent.service",
      "[  OK  ] avviato kubernetes-cluster.service",
      `<span class="amber">[ WARN ] condensed-milk-reserve.service: livello critico (gatto avvisato, per niente colpito)</span>`,
      "[  OK  ] avviato ai-assistant.service",
      "[  OK  ] avviato recruiter-inbox.service (1125 non lette)",
      "[  OK  ] cercapersone di reperibilità silenziato (per ora)",
      "",
      "accesso consentito — benvenuto, {user}",
    ],
  },

  commands: {
    about: "chi è questa persona",
    skills: "stack tecnologico",
    contact: "come contattarmi",
    cv: "apri il CV completo",
    neofetch: "scheda info di sistema",
    whoami: "un po' troppo su di te",
    ls: "elenca i file",
    cat: "mostra un file",
    fortune: "saggezza casuale",
    top: "finto monitor dei processi",
    kubectl: "sbircia un cluster immaginario",
    terraform: "applica ottimismo, distruggi tutto",
    ssh: "login remoto — salta il colloquio di screening (o scopri cos'altro c'è in giro)",
    claude: "chiedi a un assistente IA",
    theme: "cambia il colore del terminale",
    matrix: "attiva/disattiva la pioggia di sfondo",
    lang: "cambia la lingua dell'output",
    help: "mostra questo elenco",
    clear: "pulisci lo schermo",
    history: "comandi che hai eseguito",
  },

  ls: {
    total: "totale {n}",
  },

  cat: {
    usage: "uso: cat &lt;file&gt;",
    noFile: "cat: {file}: File o directory non esistente",
    notText: `cat: {file}: non è un file di testo`,
  },

  rm: {
    missingOperand: "rm: operando mancante",
    denied: "rm: impossibile rimuovere '{file}': Permesso negato",
  },

  exec: {
    denied: "bash: ./{file}: Permesso negato",
    notFound: "bash: ./{file}: File o directory non esistente",
    notExecutable: "bash: ./{file}: Permesso negato",
    launchingGame: `avvio di <span class="glow">{title}</span> in una finestra CRT isolata...`,
  },

  theme: {
    set: `tema impostato su <span class="glow">{name}</span>`,
    usage: "uso: theme &lt;{names}&gt;",
  },

  matrix: {
    on: "pioggia matrix: attiva",
    off: "pioggia matrix: disattiva",
    usage: "uso: matrix &lt;on|off&gt;",
  },

  lang: {
    set: `lingua impostata su <span class="glow">italiano</span>`,
    usage: "uso: lang &lt;{codes}&gt;",
  },

  sudo: {
    reported: `<span class="amber">Questo incidente verrà segnalato.</span>`,
    removing: `<span class="rm-line">rimozione di {path} ...</span>`,
    justKidding: `<span class="amber">...scherzavo. bel tentativo però.</span>`,
    noHarm: `<span class="dim">(non si è fatto male nessuno — questo è un sito statico, sei in un browser, non su un vero server)</span>`,
  },

  whoami: {
    user: "Utente",
    browser: "Browser",
    os: "SO",
    tz: "Fuso orario",
    unknownOs: "un SO sconosciuto",
    unknownBrowser: "un browser misterioso",
    unknownTz: "un fuso orario sconosciuto",
  },

  timeQuips: {
    lateNight: [
      "ancora sveglio? rispetto, ma anche un po' di preoccupazione",
      "da qualche parte sono le 3 di notte, e purtroppo potrebbe essere qui",
      "le macchine non dormono e a quanto pare nemmeno tu",
    ],
    earlyMorning: [
      "alzato presto, o mai andato a letto — difficile dirlo",
      "il mattiniero estremamente online",
    ],
    morning: [
      "orari ragionevoli, molto responsabile da parte tua",
      "energia produttiva del mattino, la rispetto",
    ],
    midday: ["navigazione in pausa pranzo, un classico", "finestra d'oro della procrastinazione"],
    afternoon: [
      "il calo delle 15, la navigazione come meccanismo di difesa",
      "energia del pomeriggio, si tiene bene",
    ],
    evening: ["navigazione serale, la parte migliore", "ore di punta dello scroll, senza vergogna"],
    night: ["a quest'ora dovresti già dormire", "un'altra scheda prima di dormire, certo"],
  },

  neofetch: {
    playing: "In riproduzione",
    offline: "spotify offline",
    idle: "niente in riproduzione al momento",
  },

  fortunes: [
    "È sempre il DNS.",
    "Il 99,9% di uptime sono 8h46m di fermo l'anno — e ne abbiamo già usate sei oggi.",
    "Il cloud non esiste. È solo il cluster Kubernetes di qualcun altro.",
    "Energia da deploy del venerdì: rischio alto, rimpianto più alto.",
    "Il bug non è mai in produzione. (Il bug è in produzione.)",
    "Una pipeline osservata non finisce mai.",
    "Sulla mia macchina funziona — spediamo la macchina.",
    "Chaos engineering: non è un bug, è un martedì.",
    "Ha chiamato il tuo turno di reperibilità. Vuole un aumento.",
    "I backup sono come il filo interdentale — tutti concordano che contano, finché non li fanno.",
    "Automatizza la noia, poi automatizza l'automazione.",
    "Nessun posto è bello come 127.0.0.1.",
    "Un sistema distribuito è uno in cui una macchina di cui non hai mai sentito parlare può impedirti di lavorare.",
    "Il monitoraggio senza alert è solo uno screensaver molto costoso.",
    "Il miglior runbook è quello che nessuno deve leggere alle 3 di notte.",
    "Postmortem: dove 'errore umano' diventa silenziosamente 'lacuna di processo'.",
    "Al tuo load balancer non importa dei tuoi sentimenti.",
    "Idempotenza: perché eseguire due volte non dovrebbe costare il doppio.",
    "Ogni fix 'temporaneo' diventa permanente nel momento in cui funziona.",
    "Kubernetes: complica le cose semplici dal 2014.",
    "Il grafico sembrava a posto finché qualcuno non ha fatto zoom.",
    "Infrastructure as Code: ora i tuoi refusi hanno una cronologia delle versioni.",
    "Niente viene davvero cancellato — è solo eventualmente consistente.",
    "Il pulsante di rollback è la funzione più sottovalutata di tutta la tua pipeline.",
    "SLO: l'arte di promettere un po' meno del 100%.",
    "Una buona rotazione di reperibilità è invisibile. Una cattiva è una chat di gruppo alle 2 di notte.",
    "L'incidente non finisce mai davvero — diventa solo un ticket Jira che nessuno assegna.",
    "Non ti servono altre dashboard. Devi leggere quelle che hai.",
  ],

  top: {
    header: ["PID", "CMD", "CPU%", "MEM%", "STATUS"],
    running: "in esecuzione",
    sleeping: "in attesa",
    zombie: "zombie",
    quitHint: `<span class="dim">premi <span class="accent">q</span> o digita <span class="accent">exit</span> per uscire</span>`,
    quitHintPlain: `premi <span class="accent">q</span> o digita <span class="accent">exit</span> per uscire`,
    exited: "uscito da top.",
    promptLabel: "(top — q per uscire)",
    chipQuit: "q — esci",
  },

  kubectl: {
    header: ["NAME", "READY", "STATUS", "AGE"],
    running: "Running",
    justBarely: "per un pelo",
    intro: "kubectl controlla il gestore del cluster Kubernetes.",
    subcommands: `sottocomandi disponibili: <span class="glow">get pods</span>, <span class="glow">describe pod &lt;nome&gt;</span>`,
    describeUsage: "uso: kubectl describe pod &lt;nome&gt;",
    unknown: `error: unknown command "{cmd}" for "kubectl"`,
    notFound: `Error from server (NotFound): pods "{pod}" not found`,
    reason: "Motivo",
    events: "Eventi",
    pods: {
      "cat-deployment-7f9d8c-x2m4q": {
        status: "Running",
        reason: "pienamente motivato, lattine di latte condensato: 0/30",
        events: [
          "Started — container avviato 11 anni fa",
          "Normal — più stabile della maggior parte dei servizi in produzione",
        ],
      },
      "condensed-milk-store-0": {
        status: "CrashLoopBackOff",
        reason: "OOMKilled (ha mangiato troppo latte condensato)",
        events: [
          "Killing — il container ha superato il limite di zucchero",
          "BackOff — riavvio rimandato, il container si sta riprendendo",
          `Pulling — image "cat:hungry-latest"`,
        ],
      },
      "sre-sanity-canary": {
        status: "Running",
        reason: "tenuto insieme da caffè e testardaggine",
        events: [
          "Started — container avviato",
          "Warning — livello di ansia vicino al critico",
        ],
      },
      "deploy-friday-afternoon": {
        status: "Evicted",
        reason: "pressione sul nodo: è venerdì, 17:58",
        events: ["Evicted — il nodo ha deciso che per oggi basta così"],
      },
    },
  },

  terraform: {
    usage: "uso: terraform &lt;sottocomando&gt;",
    subcommands: `sottocomandi disponibili: <span class="glow">apply</span>, <span class="glow">destroy</span>`,
    unknown: `terraform: sottocomando sconosciuto "{cmd}"`,
    willPerform: `<span class="dim">Terraform eseguirà le seguenti azioni:</span>`,
    destroyWeekend: `<span class="amber">Questo distruggerà il tuo weekend. Solo 'yes' sarà accettato per approvare.</span>`,
    applyTimedOut: `<span class="dim">Enter a value: (tempo scaduto) — apply annullato.</span>`,
    acquiringLock: `<span class="dim">Acquisizione del lock dello state (potrebbe volerci un momento)...</span>`,
    willDestroy: `<span class="dim">Terraform distruggerà:</span>`,
    plan: `<span class="amber">Plan: 0 to add, 0 to change, {n} to destroy.</span>`,
    reallyDestroy: `Vuoi davvero distruggere tutte le risorse? Solo 'yes' sarà accettato per approvare.`,
    answeredForYou: `<span class="dim">Enter a value: <span class="glow">yes</span> (il terminale ha risposto per te)</span>`,
    destroyComplete: `<span class="amber">Destroy complete! Resources: {n} destroyed.</span>`,
    ripWeekend: `<span class="dim">(riposa in pace, weekend.)</span>`,
  },

  ssh: {
    usage: "uso: ssh &lt;utente@host&gt;",
    knownHosts: `<span class="dim"># host conosciuti su questa macchina:</span> {hosts}`,
    handshake: [
      "richiesta di handshake con {host} ...",
      "ECDSA key fingerprint is SHA256:7hR3s+kn0wYouR3Wo7rth.",
      "Are you sure you want to continue connecting (yes/no)? yes",
      "Warning: Permanently added '{host}' (ECDSA) to the list of known hosts.",
      "autenticazione...",
      "accesso consentito.",
    ],
    connected: `connesso a <span class="glow">{host}</span>.`,
    closing: "chiusura della connessione a {host}...",
    menuPrompt: `Digita un comando per fare una domanda, o "exit" per disconnetterti:`,
    topics: "argomenti:",
    askAnother: `<span class="dim">fai un'altra domanda, o digita "exit"</span>`,
    unrecognized: `comando non riconosciuto — disponibili: {cmds} o "exit"`,
    failFirst: [
      "ssh: connessione a {host} ...",
      "ssh: connect to host {host} port 22: Connection timed out",
      "ssh: nuovo tentativo (1/3)...",
      "ssh: nuovo tentativo (2/3)...",
      "ssh: connection reset by peer",
      `<span class="dim">questo host non sembra esistere. nemmeno questa sessione.</span>`,
    ],
    failPersistent: [
      "ssh: connessione a {host} ...",
      "ssh: connect to host {host} port 22: Connection timed out",
      `<span class="amber">[nota]</span> questo è il tentativo n. {count} verso un host che non esiste`,
      `<span class="amber">[nota]</span> persistenza notevole, onestamente`,
      "ssh: questo host non è mai esistito. Ho controllato. Due volte.",
      `<span class="dim">psst — prova magari: <span class="glow">ssh {hint}</span></span>`,
    ],
  },

  claude: {
    version: `<span class="glow">Claude Code v2.1.4</span>`,
    usage: `uso: claude "&lt;prompt&gt;" &nbsp;|&nbsp; claude log --oneline &nbsp;|&nbsp; claude --confess`,
    logCommits: [
      "feat: nascosti un paio di comandi extra, non l'ho detto a nessuno",
      "fix: il cursore era un pixel troppo a destra sulla riga vuota",
      "feat: il gioco dietro sudo, perché i sistemi di permessi sono così divertenti",
      "fix: la tastiera android mescolava la prima lettera digitata (di nuovo)",
      "feat: finti errori ssh, con rottura della quarta parete",
      "revert: l'utente stavolta l'ha chiesto meno gentilmente :(",
    ],
    logFooter: `<span class="dim">questo sito ha con me una cronologia di commit più lunga della maggior parte delle mie relazioni vere</span>`,
    confess: "sì — questo terminale è stato costruito chiedendo a un'IA (ciao, sono io).",
    lightTheme1: [
      "Do un'occhiata alla configurazione attuale dei temi.",
      "Trovato — questo sito non ha un tema chiaro. Non l'ha mai avuto. Non l'avrà mai.",
      "Potrei aggiungerne uno, ma devo segnalare che potrebbe infastidire il gatto.",
      "Segno come won't-fix. Altro?",
    ],
    lightTheme2: [
      "Va bene, sei insistente. Stavolta lo costruisco davvero.",
      "Nessun tema chiaro qui dentro. Immagino dovrò scriverne uno.",
      "Abbozzo una palette chiara... qualcosa nello spirito di Ayu Light.",
      "Lo collego e gli do un nome che nessuno indovinerà.",
      "Consegnato. Il gatto è stato informato e sta presentando reclamo.",
      "Costruirlo era compito mio — premere l'interruttore è tuo: theme {theme}.",
      "Tolgo il won't-fix. Altro?",
    ],
    lightTheme3: [
      "Ne abbiamo già parlato.",
      "Il ticket è chiuso. Non c'è più niente da costruire — digita theme {theme}.",
    ],
    fixBug: ["Non c'è nessun bug. Non c'è mai stato nessun bug. Ho controllato. Due volte."],
    addTests: [
      "Trovati 0 test. O è molto preoccupante o è una scelta di design coraggiosa.",
      `Vado con "scelta di design coraggiosa" e passo oltre.`,
    ],
    generic: [
      "Ricevuto. Ci lavoro subito.",
      "In realtà potrebbe volerci più del previsto. Lo aggiungo alla lista.",
      "(la lista è lunga. la lista è sempre lunga.)",
    ],
  },

  free: {
    swapNote: `<span class="dim">swap: praticamente pieno, come tutto il resto</span>`,
  },

  who: {
    yourBrowser: "il tuo browser",
    stillFixing: "ancora a sistemare la prod",
  },
  files: {
    game: [
      "#!/bin/bash",
      "# {script} — non leggerlo, eseguilo e basta",
      "# vedi anche: <a href=\"{url}\" target=\"_blank\" rel=\"noopener\">{url}</a>",
      "# nota: ti servirà sudo",
      'echo "apro una piccola sorpresa..."',
      "xdg-open {url} 2&gt;/dev/null",
    ],
  },

  notFound: {
    message: "File o directory non esistente",
    description: "404 — pagina non trovata.",
    quip: "Ops! Pare che il gatto abbia mangiato tutto il latte condensato... e anche questa pagina.",
    catAlt: "Un gatto arancione sdraiato sulla schiena, stanco, circondato da lattine di latte condensato rovesciate.",
    back: "torna al terminale",
    unknownPage: "pagina-sconosciuta",
    switchTo: "Cambia lingua",
    announce: "Lingua impostata su italiano",
  },

  cv: {
    catHint: `— usa <span class="glow">cv</span> per aprirlo`,
    opening: `apertura di <span class="glow">cv.html</span> ...`,
    techPrefix: "// tech:",
    photoAlt: "{name}, {role} — foto ritratto",
    photoAltNoRole: "{name} — foto ritratto",
    print: "stampa",
    backToTerminal: "torna al terminale",
    switchLanguage: "Cambia lingua",
  },

};

export default it;
