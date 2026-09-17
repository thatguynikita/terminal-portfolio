import type { Messages } from "./en.ts";

/** Spanish messages. Typed as `Messages`, so a missing key is a build error. */
const es: Messages = {
  ui: {
    welcome: "Bienvenido a mi terminal de juguete. Escribe «help» para ver qué hay.",
    welcomeWhisper: "(psst — «help» se queda corto. escarba un poco.)",
    availableCommands: "Comandos disponibles:",
    notFound: `orden no encontrada: <span class="accent">{cmd}</span>`,
    notFoundHint: `<span class="dim">esto es una terminal de juguete hecha con JavaScript, no un shell de verdad. prueba <span class="glow">help</span> para ver qué hay</span>`,
    loggingOut: "cerrando sesión...",
    connClosed: "conexión con {host} cerrada.",
    footerHint: `escribe <span class="accent">help</span> para explorar`,
    pageTitle: "terminal",
    inputLabel: "Entrada de comandos de la terminal",
    outputLabel: "Salida de la terminal",
  },

  boot: {
    lines: [
      "{host} secuencia de arranque — kernel 6.6.0-sre",
      "[  OK  ] módulo cargado: years_of_uptime.ko",
      `<span class="rm-line">[FALLO ] montado /dev/motivation: no encontrado</span>`,
      "[  OK  ] montado /dev/coffee en su lugar",
      "[  OK  ] iniciado ssh-agent.service",
      "[  OK  ] iniciado kubernetes-cluster.service",
      `<span class="amber">[ AVISO ] condensed-milk-reserve.service: nivel crítico (gato informado, nada impresionado)</span>`,
      "[  OK  ] iniciado ai-assistant.service",
      "[  OK  ] iniciado recruiter-inbox.service (1125 sin leer)",
      "[  OK  ] busca de guardia silenciado (por ahora)",
      "",
      "acceso concedido — bienvenido, {user}",
    ],
  },

  /** One entry per registered command; `help` reads these. */
  commands: {
    about: "quién es esta persona",
    skills: "stack técnico",
    contact: "cómo dar conmigo",
    cv: "abrir el CV completo",
    neofetch: "ficha de información del sistema",
    whoami: "un poco demasiado sobre ti",
    ls: "listar archivos",
    cat: "mostrar un archivo",
    fortune: "sabiduría aleatoria",
    top: "monitor de procesos de mentira",
    kubectl: "asomarse a un clúster de pega",
    terraform: "aplicar optimismo, destruirlo todo",
    ssh: "acceso remoto — sáltate la entrevista de cribado (o averigua qué más hay por aquí)",
    claude: "preguntar a un asistente de IA",
    theme: "cambiar el color de la terminal",
    matrix: "activar o desactivar la lluvia de fondo",
    lang: "cambiar el idioma de salida",
    help: "mostrar esta lista",
    clear: "limpiar la pantalla",
    history: "comandos que has ejecutado",
  },

  ls: {
    total: "total {n}",
  },

  cat: {
    usage: "uso: cat &lt;archivo&gt;",
    noFile: "cat: {file}: No existe el archivo o el directorio",
    notText: `cat: {file}: no es un archivo de texto`,
  },

  rm: {
    missingOperand: "rm: falta un operando",
    denied: "rm: no se puede borrar «{file}»: Permiso denegado",
  },

  exec: {
    denied: "bash: ./{file}: Permiso denegado",
    notFound: "bash: ./{file}: No existe el archivo o el directorio",
    notExecutable: "bash: ./{file}: Permiso denegado",
    launchingGame: `abriendo <span class="glow">{title}</span> en una ventana CRT aislada...`,
  },

  theme: {
    set: `tema cambiado a <span class="glow">{name}</span>`,
    usage: "uso: theme &lt;{names}&gt;",
  },

  matrix: {
    on: "lluvia matrix: activada",
    off: "lluvia matrix: desactivada",
    usage: "uso: matrix &lt;on|off&gt;",
  },

  lang: {
    set: `idioma cambiado a <span class="glow">español</span>`,
    usage: "uso: lang &lt;{codes}&gt;",
  },

  sudo: {
    reported: `<span class="amber">Este incidente será notificado.</span>`,
    removing: `<span class="rm-line">borrando {path} ...</span>`,
    justKidding: `<span class="amber">...era broma. Buen intento, eso sí.</span>`,
    noHarm: `<span class="dim">(no ha pasado nada — esto es una web estática, estás en un navegador, no en un servidor de verdad)</span>`,
  },

  whoami: {
    user: "Usuario",
    browser: "Navegador",
    os: "Sistema operativo",
    tz: "Zona horaria",
    unknownOs: "un sistema operativo desconocido",
    unknownBrowser: "un navegador misterioso",
    unknownTz: "una zona horaria desconocida",
  },

  /** Buckets are keyed by name; the hour ranges live in the command. */
  timeQuips: {
    lateNight: [
      "¿todavía despierto? respeto, pero también preocupación",
      "son las 3 de la mañana en algún sitio, y por desgracia puede que aquí",
      "las máquinas no duermen y por lo visto tú tampoco",
    ],
    earlyMorning: [
      "madrugando, o sin haberte acostado — difícil saberlo",
      "el pájaro madrugador, extremadamente conectado",
    ],
    morning: [
      "a una hora razonable, muy responsable por tu parte",
      "energía matutina productiva, la respeto",
    ],
    midday: ["navegando en la pausa de la comida, un clásico", "ventana ideal para procrastinar"],
    afternoon: [
      "el bajón de las cinco, navegar como mecanismo de defensa",
      "energía de media tarde, aguantando el tipo",
    ],
    evening: ["navegar de noche, lo bueno de verdad", "horas prime de scroll, sin remordimientos"],
    night: ["probablemente ya deberías estar durmiendo", "una pestaña más antes de dormir, claro"],
  },

  neofetch: {
    playing: "Sonando",
    offline: "spotify sin conexión",
    idle: "ahora mismo no suena nada",
  },

  fortunes: [
    "Siempre es el DNS.",
    "Un 99,9 % de disponibilidad son 8 h 46 min de caída al año — hoy ya hemos gastado seis.",
    "No existe la nube. Es el clúster de Kubernetes de otro.",
    "Energía de despliegue en viernes: mucho riesgo, más arrepentimiento.",
    "El bug nunca está en producción. (El bug está en producción.)",
    "Pipeline observado nunca termina.",
    "En mi máquina funciona — enviamos la máquina.",
    "Ingeniería del caos: no es un bug, es un martes.",
    "Tu turno de guardia ha llamado. Quiere un aumento.",
    "Las copias de seguridad son como el hilo dental: todos coinciden en que importan, justo hasta que no lo usan.",
    "Automatiza lo aburrido y después automatiza la automatización.",
    "Como en 127.0.0.1 no se está en ningún sitio.",
    "Un sistema distribuido es aquel en el que una máquina de la que nunca has oído hablar puede impedirte trabajar.",
    "Monitorizar sin alertar es un salvapantallas carísimo.",
    "El mejor runbook es el que nadie tiene que leer a las 3 de la mañana.",
    "Post mortems: donde el «error humano» se convierte discretamente en «fallo del proceso».",
    "A tu balanceador de carga le dan igual tus sentimientos.",
    "Idempotencia: porque ejecutarlo dos veces no debería costarte el doble.",
    "Todo apaño «temporal» se vuelve permanente en cuanto funciona.",
    "Kubernetes: complicando cosas sencillas desde 2014.",
    "La gráfica tenía buena pinta hasta que alguien hizo zoom.",
    "Infraestructura como código: ahora tus erratas tienen historial de versiones.",
    "Nada se borra de verdad — solo llega a ser consistente con el tiempo.",
    "El botón de rollback es la función más infravalorada de todo tu pipeline.",
    "SLOs: el arte de prometer un poco menos del 100 %.",
    "Una buena rotación de guardias es invisible. Una mala es un grupo de chat a las 2 de la mañana.",
    "El incidente nunca termina del todo — solo se convierte en un ticket de Jira que nadie asigna.",
    "No necesitas más paneles. Necesitas leer los que ya tienes.",
  ],

  top: {
    header: ["PID", "COMANDO", "CPU%", "MEM%", "ESTADO"],
    running: "en ejecución",
    sleeping: "durmiendo",
    zombie: "zombi",
    quitHint: `<span class="dim">pulsa <span class="accent">q</span> o escribe <span class="accent">exit</span> para salir</span>`,
    quitHintPlain: `pulsa <span class="accent">q</span> o escribe <span class="accent">exit</span> para salir`,
    exited: "has salido de top.",
    promptLabel: "(top — q para salir)",
    chipQuit: "q — salir",
  },

  kubectl: {
    header: ["NOMBRE", "LISTO", "ESTADO", "EDAD"],
    running: "Running",
    justBarely: "por los pelos",
    intro: "kubectl controla el gestor del clúster de Kubernetes.",
    subcommands: `subcomandos disponibles: <span class="glow">get pods</span>, <span class="glow">describe pod &lt;name&gt;</span>`,
    describeUsage: "uso: kubectl describe pod &lt;name&gt;",
    unknown: `error: comando desconocido «{cmd}» para «kubectl»`,
    notFound: `Error del servidor (NotFound): pod «{pod}» no encontrado`,
    reason: "Motivo",
    events: "Eventos",
    pods: {
      "cat-deployment-7f9d8c-x2m4q": {
        status: "Running",
        reason: "plenamente motivado, latas de leche condensada: 0/30",
        events: [
          "Started — contenedor iniciado hace 11 años",
          "Normal — más estable que la mayoría de servicios en producción",
        ],
      },
      "condensed-milk-store-0": {
        status: "CrashLoopBackOff",
        reason: "OOMKilled (comió demasiada leche condensada)",
        events: [
          "Killing — el contenedor superó el límite de azúcar",
          "BackOff — reinicio aplazado, el contenedor se está recuperando",
          `Pulling — imagen «cat:hungry-latest»`,
        ],
      },
      "sre-sanity-canary": {
        status: "Running",
        reason: "se sostiene a base de café y cabezonería",
        events: [
          "Started — contenedor iniciado",
          "Warning — nivel de ansiedad acercándose al crítico",
        ],
      },
      "deploy-friday-afternoon": {
        status: "Evicted",
        reason: "presión en el nodo: es viernes, 17:58",
        events: ["Evicted — el nodo decidió que por hoy ya estaba bien"],
      },
    },
  },

  terraform: {
    usage: "uso: terraform &lt;subcomando&gt;",
    subcommands: `subcomandos disponibles: <span class="glow">apply</span>, <span class="glow">destroy</span>`,
    unknown: `terraform: subcomando desconocido «{cmd}»`,
    willPerform: `<span class="dim">Terraform realizará las siguientes acciones:</span>`,
    destroyWeekend: `<span class="amber">Esto destruirá tu fin de semana. Solo se aceptará «yes» para aprobar.</span>`,
    applyTimedOut: `<span class="dim">Introduce un valor: (tiempo agotado) — apply cancelado.</span>`,
    acquiringLock: `<span class="dim">Adquiriendo el bloqueo de estado (esto puede tardar un momento)...</span>`,
    willDestroy: `<span class="dim">Terraform destruirá:</span>`,
    plan: `<span class="amber">Plan: 0 por añadir, 0 por cambiar, {n} por destruir.</span>`,
    reallyDestroy: `¿Seguro que quieres destruir todos los recursos? Solo se aceptará «yes» para aprobar.`,
    answeredForYou: `<span class="dim">Introduce un valor: <span class="glow">yes</span> (la terminal ha respondido por ti)</span>`,
    destroyComplete: `<span class="amber">¡Destrucción completada! Recursos: {n} destruidos.</span>`,
    ripWeekend: `<span class="dim">(Descanse en paz, fin de semana.)</span>`,
  },

  ssh: {
    usage: "uso: ssh &lt;usuario@host&gt;",
    knownHosts: `<span class="dim"># hosts conocidos en esta máquina:</span> {hosts}`,
    handshake: [
      "solicitando handshake con {host} ...",
      "La huella de la clave ECDSA es SHA256:7hR3s+kn0wYouR3Wo7rth.",
      "¿Seguro que quieres continuar con la conexión (yes/no)? yes",
      "Aviso: «{host}» (ECDSA) añadido permanentemente a la lista de hosts conocidos.",
      "autenticando...",
      "acceso concedido.",
    ],
    connected: `conectado a <span class="glow">{host}</span>.`,
    closing: "cerrando la conexión con {host}...",
    menuPrompt: `Escribe un comando para hacer una pregunta, o «exit» para desconectar:`,
    topics: "temas:",
    askAnother: `<span class="dim">haz otra pregunta, o escribe «exit»</span>`,
    unrecognized: `comando no reconocido — disponibles: {cmds} o «exit»`,
    failFirst: [
      "ssh: conectando con {host} ...",
      "ssh: conexión al host {host} puerto 22: Tiempo de espera agotado",
      "ssh: reintentando (1/3)...",
      "ssh: reintentando (2/3)...",
      "ssh: conexión reiniciada por el otro extremo",
      `<span class="dim">este host no parece existir. esta sesión tampoco.</span>`,
    ],
    failPersistent: [
      "ssh: conectando con {host} ...",
      "ssh: conexión al host {host} puerto 22: Tiempo de espera agotado",
      `<span class="amber">[nota]</span> este es el intento n.º {count} contra un host que no existe`,
      `<span class="amber">[nota]</span> constancia impresionante, la verdad`,
      "ssh: este host no ha existido nunca. Lo he comprobado. Dos veces.",
      `<span class="dim">psst — prueba con: <span class="glow">ssh {hint}</span></span>`,
    ],
  },

  claude: {
    version: `<span class="glow">Claude Code v2.1.4</span>`,
    usage: `uso: claude "&lt;instrucción&gt;" &nbsp;|&nbsp; claude log --oneline &nbsp;|&nbsp; claude --confess`,
    logCommits: [
      "feat: escondidos unos cuantos comandos extra, sin decírselo a nadie",
      "fix: el cursor se iba un píxel a la derecha en la línea vacía",
      "feat: el juego ahora pide sudo, porque los sistemas de permisos tienen mucha gracia",
      "fix: el teclado de android desordenaba la primera letra escrita (otra vez)",
      "feat: fallos de ssh de mentira, rompiendo la cuarta pared",
      "revert: el usuario lo pidió con menos educación esta vez :(",
    ],
    logFooter: `<span class="dim">esta web tiene un historial de commits conmigo más largo que la mayoría de mis relaciones reales</span>`,
    confess: "sí — esta terminal se construyó preguntándole a una IA (hola, soy yo).",
    lightTheme1: [
      "Voy a echar un vistazo a la configuración de temas actual.",
      "Encontrado — esta web no tiene tema claro. Nunca lo ha tenido. Nunca lo tendrá.",
      "Podría añadir uno, pero conviene avisar de que puede disgustar al gato.",
      "Lo marco como won't-fix. ¿Algo más?",
    ],
    lightTheme2: [
      "Vale, eres insistente. Esta vez lo construyo de verdad.",
      "Aquí no hay ningún tema claro. Habrá que escribir uno.",
      "Esbozando una paleta clara... algo en la línea de Ayu Light.",
      "Lo conecto y le pongo un nombre que nadie va a adivinar.",
      "Publicado. El gato ha sido informado y está presentando una queja.",
      "Construirlo era cosa mía — accionar el interruptor es cosa tuya: theme {theme}.",
      "Retiro el won't-fix. ¿Algo más?",
    ],
    lightTheme3: [
      "Ya hemos hablado de esto.",
      "El ticket está cerrado. No queda nada por construir — solo escribe theme {theme}.",
    ],
    fixBug: ["No hay ningún bug. Nunca ha habido ningún bug. Lo he comprobado. Dos veces."],
    addTests: [
      "Encontrados 0 tests. Esto es o muy preocupante o una decisión de diseño muy atrevida.",
      `Me quedo con «decisión de diseño muy atrevida» y sigo adelante.`,
    ],
    generic: [
      "Entendido. Me pongo con ello.",
      "En realidad puede que lleve más de lo previsto. Lo añado a la lista.",
      "(la lista es larga. la lista siempre es larga.)",
    ],
  },

  free: {
    swapNote: `<span class="dim">swap: prácticamente lleno, como todo lo demás</span>`,
  },

  who: {
    yourBrowser: "tu navegador",
    stillFixing: "todavía arreglando producción",
  },
  files: {
    game: [
      "#!/bin/bash",
      "# {script} — no lo leas, simplemente ejecútalo",
      '# ver también: <a href="{url}" target="_blank" rel="noopener">{url}</a>',
      "# nota: vas a necesitar sudo",
      'echo "abriendo una pequeña sorpresa..."',
      "xdg-open {url} 2&gt;/dev/null",
    ],
  },

  notFound: {
    message: "No existe el archivo o el directorio",
    description: "404 — página no encontrada.",
    quip: "¡Vaya! Parece que el gato se ha comido toda la leche condensada... y esta página también.",
    catAlt:
      "Un gato naranja tumbado boca arriba, agotado, rodeado de latas de leche condensada derramadas.",
    back: "volver a la terminal",
    unknownPage: "pagina-desconocida",
    switchTo: "Cambiar de idioma",
    announce: "Idioma cambiado a español",
  },

  cv: {
    catHint: `— usa <span class="glow">cv</span> para abrirlo`,
    opening: `abriendo <span class="glow">cv.html</span> ...`,
    techPrefix: "// tecnología:",
    photoAlt: "{name}, {role} — foto de retrato",
    photoAltNoRole: "{name} — foto de retrato",
    print: "imprimir",
    backToTerminal: "volver a la terminal",
    switchLanguage: "Cambiar de idioma",
  },
};

export default es;
