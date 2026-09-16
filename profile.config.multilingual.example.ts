import { defineProfile } from "./src/core/profile";
import en from "./src/i18n/messages/en";
import es from "./src/i18n/messages/es";
import de from "./src/i18n/messages/de";

/**
 * The languages this site ships, in rotation order.
 *
 * Three of them here, which is the whole difference between this example
 * and the single-language one: the language chip cycles en → es → de → en,
 * `lang` completes all three, and the build emits /cv.html, /es/cv.html
 * and /de/cv.html with a matching hreflang cluster.
 *
 * Russian also lives in src/i18n/messages/ and is *not* imported, so none
 * of it reaches the bundle. Dropping a language here works the same way.
 */
export const MESSAGES = { en, es, de };

/**
 * ─────────────────────────────────────────────────────────────────────
 *  EXAMPLE PROFILE (multilingual) — a fictional robotics engineer in
 *  English, Spanish and German.
 *
 *  Copy over profile.config.ts and edit. Domains use the reserved
 *  `.example` TLD (RFC 2606), so nothing here resolves anywhere real.
 *
 *  Every user-visible field carries all three languages, because
 *  `Localized` is `Record<Locale, T>` and `Locale` comes from MESSAGES
 *  above. Drop `de` from that map and TypeScript names each field still
 *  holding German, one error apiece — which is the same guarantee that
 *  stops a half-translated site from building.
 *
 *  See profile.config.example.ts for the single-language version.
 * ─────────────────────────────────────────────────────────────────────
 */
export default defineProfile({
  terminal: {
    handle: "guest",
    // Cosmetic — the prompt and `uname`. Where the site is published is
    // SITE_URL in .env, which drives every absolute URL and the CNAME.
    hostname: "beatriz.example",
    // Which languages this site ships is MESSAGES, at the top of this file.
    // The chip rotates in that order; this one is served unprefixed.
    defaultLocale: "en",
    defaultTheme: "random",
    // Background rain for a first-time visitor; `matrix on|off` is remembered.
    defaultMatrix: "on",
    // The fake dmesg sequence before the terminal, once per session.
    bootScreen: true,
    // The tappable command chips under the terminal.
    chips: true,
    // Extra topbar links. The CV link is added automatically when `cv` is
    // configured, so this is for anything else you want up there.
    links: [
      { label: "lab", href: "https://lab.beatriz.example" },
      { label: "talks", href: "https://talks.beatriz.example" },
    ],
    // The footer under the window, on every page.
    footer: {
      // The generated `© year name`, linked to the site root.
      copyright: true,
      // Terminal page only, plain text. Omit for the built-in "type help to explore".
      // hint: { en: "…", es: "…", de: "…" },
      // The `back to terminal` link on the CV and 404 pages.
      backToTerminal: true,
      // A line under the rest, same in every language. Rendered as HTML — keep it short.
      bottomText: 'Made with ❤ using <a href="https://github.com/thatguynikita/terminal-portfolio">terminal-portfolio</a>',
    },
  },

  identity: {
    name: {
      en: "Beatriz Ocaña Ruiz",
      es: "Beatriz Ocaña Ruiz",
      de: "Beatriz Ocaña Ruiz",
    },
    role: {
      en: "Embedded Systems Engineer — Robotics",
      es: "Ingeniera de sistemas embebidos — Robótica",
      de: "Embedded-Systems-Entwicklerin — Robotik",
    },
  },

  seo: {
    description: {
      en: "Interactive terminal portfolio of an embedded systems engineer with 10 years in robotics. Type `help` to explore.",
      es: "Portfolio interactivo en terminal de una ingeniera de sistemas embebidos con 10 años en robótica. Escribe `help` para explorar.",
      de: "Interaktives Terminal-Portfolio einer Embedded-Systems-Entwicklerin mit 10 Jahren Robotik-Erfahrung. Tippe `help` zum Stöbern.",
    },    // For the CV's JSON-LD address and the no-JS fallback; not shown on a page.
    location: {
      en: "Munich, Germany",
      es: "Múnich, Alemania",
      de: "München, Deutschland",
    },
    // robots.txt: per-crawler rules, Content-Signal, and the sitemap line.
    enableRobotsTxt: true,
    // robots.txt Content-Signal: may the content be searched, train models, feed AI answers.
    contentSignal: { search: true, aiTrain: true, aiInput: true },
    // sitemap.xml: the home page and every CV page, with the portrait.
    enableSitemap: true,
    // llms.txt: the index for AI agents, per the llms.txt spec.
    enableLlmsTxt: true,
    // The Person JSON-LD on the terminal page and every CV page.
    enableJsonLd: true,
    // The terminal's <noscript> fallback for crawlers and no-JS visitors.
    enableNoscript: true,
    // The og:* and twitter:card share tags on every page; off makes ogImage inert.
    enableSocialCards: true,
  },

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
        key: { en: "Name", es: "Nombre", de: "Name" },
        value: {
          en: "Beatriz Ocaña Ruiz",
          es: "Beatriz Ocaña Ruiz",
          de: "Beatriz Ocaña Ruiz",
        },
      },
      {
        key: { en: "Role", es: "Puesto", de: "Rolle" },
        value: {
          en: "Embedded Systems Engineer",
          es: "Ingeniera de sistemas embebidos",
          de: "Embedded-Systems-Entwicklerin",
        },
      },
      {
        key: { en: "Uptime", es: "Tiempo activo", de: "Laufzeit" },
        value: {
          en: "10+ years close to the metal",
          es: "más de 10 años pegada al metal",
          de: "über 10 Jahre nah an der Hardware",
        },
      },
      {
        key: { en: "Shell", es: "Shell", de: "Shell" },
        value: { en: "/bin/zsh", es: "/bin/zsh", de: "/bin/zsh" },
      },
      {
        key: { en: "Stack", es: "Stack", de: "Stack" },
        value: {
          en: "Zephyr · ROS 2 · Rust · CAN-FD",
          es: "Zephyr · ROS 2 · Rust · CAN-FD",
          de: "Zephyr · ROS 2 · Rust · CAN-FD",
        },
      },
      {
        key: { en: "Status", es: "Estado", de: "Status" },
        value: {
          en: "open to interesting problems",
          es: "abierta a problemas interesantes",
          de: "offen für interessante Probleme",
        },
        highlight: true,
      },
    ],

    // The live "Playing" row in the neofetch card. Delete this whole block
    // (or blank the endpoint) to turn the widget off: the row isn't rendered
    // at all and no request is ever made — neofetch just ends at Status.
    // An endpoint that's set but unreachable keeps the row and shows
    // "spotify offline" instead.
    nowPlaying: {
      endpoint: "https://api.beatriz.example/now-playing",
      pollMs: 20000,
    },
  },

  // Line breaks matter: `about` types this out one line at a time.
  bio: {
    en: `Embedded engineer with ten years spent making machines move
predictably.

I write firmware for robots that share a floor with people, which
concentrates the mind. Most of the work is unglamorous: bring-up on new
boards, timing bugs that only show up when it's cold, and test rigs that
catch a fault before a warehouse does.`,
    es: `Ingeniera de embebidos con diez años haciendo que las máquinas se
muevan de forma predecible.

Escribo firmware para robots que comparten el suelo con personas, lo cual
concentra bastante la atención. Casi todo el trabajo es poco lucido:
puesta en marcha de placas nuevas, fallos de temporización que solo
aparecen con frío, y bancos de pruebas que detectan una avería antes que
un almacén.`,
    de: `Embedded-Entwicklerin mit zehn Jahren Erfahrung darin, Maschinen
vorhersagbar zu bewegen.

Ich schreibe Firmware für Roboter, die sich den Boden mit Menschen teilen
— das schärft die Aufmerksamkeit. Das meiste davon ist unglamourös:
Inbetriebnahme neuer Platinen, Timing-Fehler, die nur bei Kälte
auftreten, und Prüfstände, die einen Defekt vor dem Lager bemerken.`,
  },

  // `contexts` omitted means "everywhere". The CV shows the full table;
  // the terminal shows the readable subset.
  skills: [
    {
      key: { en: "Languages", es: "Lenguajes", de: "Sprachen" },
      value: "C, C++17, Rust, Python, Bash",
      contexts: ["cv"],
    },
    {
      key: { en: "RTOS", es: "RTOS", de: "RTOS" },
      value: "Zephyr, FreeRTOS, ThreadX, bare-metal",
    },
    {
      key: { en: "Robotics", es: "Robótica", de: "Robotik" },
      value: "ROS 2, DDS, Nav2, MoveIt",
    },
    {
      key: { en: "Silicon", es: "Silicio", de: "Silizium" },
      value: "STM32, NXP i.MX, Nordic nRF52, ESP32",
    },
    {
      key: { en: "Buses", es: "Buses", de: "Busse" },
      value: "CAN / CAN-FD, EtherCAT, SPI, I²C, UART",
      contexts: ["cv"],
    },
    {
      key: { en: "Embedded Linux", es: "Linux embebido", de: "Embedded Linux" },
      value: "Yocto, Buildroot, device tree, kernel modules",
      contexts: ["cv"],
    },
    {
      key: { en: "Debugging", es: "Depuración", de: "Debugging" },
      value: "GDB, OpenOCD, SEGGER J-Link, logic analysers, oscilloscopes",
    },
    {
      key: { en: "Test", es: "Pruebas", de: "Test" },
      value: "Hardware-in-the-loop, Renode, pytest, Robot Framework",
    },
    {
      key: { en: "Safety", es: "Seguridad funcional", de: "Funktionale Sicherheit" },
      value: "ISO 13849, IEC 61508, MISRA C, FMEA",
      contexts: ["cv"],
    },
    {
      key: { en: "Build & CI", es: "Compilación y CI", de: "Build & CI" },
      value: "CMake, Conan, Docker, GitLab CI",
      contexts: ["cv"],
    },
  ],

  socials: [
    { label: "Email", href: "mailto:hola@beatriz.example", display: "hola@beatriz.example" },
    {
      label: "Website",
      href: "https://beatriz.example",
      display: "beatriz.example",
      contexts: ["cv"],
    },
    {
      label: "GitHub",
      href: "https://github.com/beatriz-ocana-demo",
      display: "beatriz-ocana-demo",
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/beatriz-ocana-demo",
      display: "beatriz-ocana-demo",
    },
    {
      contexts: ["terminal"],
      label: "Mastodon",
      href: "https://fosstodon.org/@beatriz_ocana_demo",
      display: "@beatriz_ocana_demo",
    },
  ],

  commands: {
    // Overrides a command's one-line description in `help`. Anything not
    // listed here falls back to `commands.<name>` in src/i18n/messages/.
    // Use it for lines that carry your name or your voice.
    descriptions: {
      about: {
        en: "who is this beatriz person anyway",
        es: "quién es esta tal beatriz, en fin",
        de: "wer ist diese beatriz überhaupt",
      },
    },

    // The fake-system commands (ps, who, w, env) show two accounts: the
    // visitor, who is terminal.handle, and the machine's owner — you.
    system: {
      owner: "beatriz",
      // When the machine came up: `uptime` counts from it, `uname -a` and
      // `ls -l` stamp it. Omit to count from the build instead.
      since: "2026-05-02T18:30:00+02:00",
      // What the secret light theme is called once `claude "add light theme"` is
      // asked twice. Omit and it isn't offered at all.
      secretTheme: "sunrise",
    },

    game: {
      url: "https://game.beatriz.example/",
      title: "Servo Rush",
      // The launcher: `ls -a` lists it, `sudo ./flash-firmware.sh` opens the game.
      script: "flash-firmware.sh",
    },

    ssh: {
      personas: {
        recruiter: {
          host: "recruiter@beatriz.example",
          qa: [
            {
              cmd: "why",
              q: {
                en: "Why should we hire you?",
                es: "¿Por qué deberíamos contratarte?",
                de: "Warum sollten wir dich einstellen?",
              },
              a: {
                en: "Ten years of firmware that runs next to people and doesn't surprise them. I bring boards up quickly, I write the test rig before the feature, and I'm the person who asks what happens when the encoder lies.",
                es: "Diez años de firmware que funciona junto a personas sin darles sustos. Pongo placas en marcha rápido, monto el banco de pruebas antes que la funcionalidad y soy la que pregunta qué pasa cuando el encoder miente.",
                de: "Zehn Jahre Firmware, die neben Menschen läuft und sie nicht überrascht. Ich nehme Platinen schnell in Betrieb, baue den Prüfstand vor dem Feature und bin die, die fragt, was passiert, wenn der Encoder lügt.",
              },
            },
            {
              cmd: "favorite",
              q: {
                en: "What's your favorite part of the job?",
                es: "¿Qué es lo que más te gusta del trabajo?",
                de: "Was magst du an der Arbeit am liebsten?",
              },
              a: {
                en: "The first clean motion after a week of jitter. You feel it in the room before you see it on the scope.",
                es: "El primer movimiento limpio después de una semana de jitter. Se nota en la sala antes de verlo en el osciloscopio.",
                de: "Die erste saubere Bewegung nach einer Woche Jitter. Man spürt sie im Raum, bevor man sie auf dem Oszilloskop sieht.",
              },
            },
            {
              cmd: "incident",
              q: {
                en: "Tell me about an incident you handled.",
                es: "Cuéntame algún incidente que hayas gestionado.",
                de: "Erzähl von einem Vorfall, den du bearbeitet hast.",
              },
              a: {
                en: "A fleet started stopping short on cold mornings. A crystal drifted just enough below 5 °C to skew a CAN bit time. We found it with a thermal chamber and a very long weekend; now every board is characterised across its full temperature range before it ships.",
                es: "Una flota empezó a frenar antes de tiempo en las mañanas frías. Un cristal se desviaba lo justo por debajo de 5 °C para alterar el bit time del CAN. Lo encontramos con una cámara térmica y un fin de semana muy largo; ahora cada placa se caracteriza en todo su rango de temperatura antes de salir.",
                de: "Eine Flotte bremste an kalten Morgen zu früh. Ein Quarz driftete unter 5 °C gerade so weit, dass die CAN-Bitzeit verrutschte. Gefunden haben wir es mit einer Klimakammer und einem sehr langen Wochenende; heute wird jede Platine über den vollen Temperaturbereich charakterisiert, bevor sie ausgeliefert wird.",
              },
            },
            {
              cmd: "goals",
              q: {
                en: "What are you looking for next?",
                es: "¿Qué buscas a continuación?",
                de: "Was suchst du als Nächstes?",
              },
              a: {
                en: "A team that treats firmware as a product with a lifecycle — versioned, tested on real hardware in CI, and updatable in the field without a truck roll.",
                es: "Un equipo que trate el firmware como un producto con ciclo de vida: versionado, probado sobre hardware real en CI y actualizable en campo sin mandar una furgoneta.",
                de: "Ein Team, das Firmware als Produkt mit Lebenszyklus behandelt — versioniert, in der CI auf echter Hardware getestet und im Feld aktualisierbar, ohne einen Techniker rauszuschicken.",
              },
            },
            {
              cmd: "salary",
              q: {
                en: "Salary expectations?",
                es: "¿Expectativas salariales?",
                de: "Gehaltsvorstellung?",
              },
              a: {
                en: "Negotiable, and better discussed over email than in a terminal easter egg :)",
                es: "Negociable, y mejor hablarlo por correo que en un easter egg de una terminal :)",
                de: "Verhandelbar — und per E-Mail besser aufgehoben als in einem Terminal-Easter-Egg :)",
              },
            },
          ],
        },
      },
    },
  },

  // The CV. One page is generated per locale in MESSAGES, at the top.
  // Delete this whole key and the CV disappears: no pages, no `cv` command,
  // no cv.html in `ls`, no sitemap rows — just the terminal.
  cv: {
    // The line under your name on the CV — the role, plus how long you've
    // been at it. CV page only.
    tagline: {
      en: "Embedded Systems Engineer — Robotics · 10y experience",
      es: "Ingeniera de sistemas embebidos — Robótica · 10 años de experiencia",
      de: "Embedded-Systems-Entwicklerin — Robotik · 10 Jahre Erfahrung",
    },

    photo: "/assets/img/portraits/beatriz-photo.png",
    // "pixel": a posterized pixel render under the theme tint. "tint": just the
    // grayscale + tint. Leave it out and the photo is served exactly as uploaded.
    photoStyle: "pixel",

    // The line under the contact row on the CV.
    metaLine: {
      en: "Munich, Germany · EU citizen · on-site for bring-up, remote for the rest",
      es: "Múnich, Alemania · ciudadanía de la UE · presencial para puesta en marcha, remoto para lo demás",
      de: "München, Deutschland · EU-Bürgerin · vor Ort für die Inbetriebnahme, sonst remote",
    },

    // Shown at the top of the CV, under the contact row.
    about: {
      en: "Embedded engineer with ten years spent making machines move predictably. I write firmware for robots that share a floor with people, from board bring-up through safety review to field updates. I care about the unglamorous parts — timing, thermals, and test rigs that catch a fault before a warehouse does. Looking for a team that treats firmware as a product with a lifecycle, not a binary that ships once.",
      es: "Ingeniera de embebidos con diez años haciendo que las máquinas se muevan de forma predecible. Escribo firmware para robots que comparten el suelo con personas, desde la puesta en marcha de la placa hasta la revisión de seguridad y las actualizaciones en campo. Me importan las partes poco lucidas: la temporización, el comportamiento térmico y los bancos de pruebas que detectan una avería antes que un almacén. Busco un equipo que trate el firmware como un producto con ciclo de vida, no como un binario que se entrega una sola vez.",
      de: "Embedded-Entwicklerin mit zehn Jahren Erfahrung darin, Maschinen vorhersagbar zu bewegen. Ich schreibe Firmware für Roboter, die sich den Boden mit Menschen teilen — von der Platinen-Inbetriebnahme über die Sicherheitsabnahme bis zu Updates im Feld. Mir liegen die unglamourösen Teile am Herzen: Timing, Thermik und Prüfstände, die einen Defekt vor dem Lager bemerken. Ich suche ein Team, das Firmware als Produkt mit Lebenszyklus begreift und nicht als Binary, das einmal ausgeliefert wird.",
    },

    jobs: [
      {
        id: "halcyon",
        dates: {
          en: "Mar 2022 – Sep 2025",
          es: "Mar 2022 – Sep 2025",
          de: "März 2022 – Sep 2025",
        },
        span: { en: "3y 7m", es: "3 a. 7 m.", de: "3 J. 7 Mon." },
        org: {
          name: "Halcyon Robotics",
          url: "https://halcyon-robotics.example",
          location: { en: "Munich", es: "Múnich", de: "München" },
        },
        title: {
          en: "Senior Firmware Engineer",
          es: "Ingeniera sénior de firmware",
          de: "Senior Firmware-Entwicklerin",
        },
        tech: "Zephyr, C, C++17, Rust, ROS 2, CAN-FD, STM32H7, Yocto, GitLab CI, Renode",
        bullets: {
          en: [
            "Led the motion-control firmware for a fleet of 400+ warehouse robots operating alongside people",
            "Moved the safety-critical stop path off Linux onto a dedicated MCU, cutting worst-case stop latency from 180 ms to 12 ms",
            "Built a hardware-in-the-loop rig into CI so every merge runs on real silicon, not just an emulator",
            "Introduced signed, resumable over-the-air updates, ending on-site firmware visits entirely",
            "Took the drive subsystem through ISO 13849 PL d review with no findings",
            "Mentored three engineers through their first board bring-up",
          ],
          es: [
            "Dirigí el firmware de control de movimiento de una flota de más de 400 robots de almacén que operan junto a personas",
            "Saqué la ruta de parada crítica de Linux a un microcontrolador dedicado, reduciendo la latencia de parada en el peor caso de 180 ms a 12 ms",
            "Integré un banco hardware-in-the-loop en CI para que cada merge se ejecute sobre silicio real, no sobre un emulador",
            "Introduje actualizaciones OTA firmadas y reanudables, eliminando por completo las visitas presenciales para actualizar firmware",
            "Llevé el subsistema de tracción a la revisión ISO 13849 PL d sin ninguna no conformidad",
            "Acompañé a tres ingenieros en su primera puesta en marcha de una placa",
          ],
          de: [
            "Leitete die Motion-Control-Firmware für eine Flotte von über 400 Lagerrobotern, die neben Menschen arbeiten",
            "Verlagerte den sicherheitskritischen Stopp-Pfad von Linux auf einen eigenen Mikrocontroller und senkte die Worst-Case-Stoppzeit von 180 ms auf 12 ms",
            "Band einen Hardware-in-the-Loop-Prüfstand in die CI ein, sodass jeder Merge auf echtem Silizium läuft statt nur im Emulator",
            "Führte signierte, fortsetzbare Over-the-Air-Updates ein und machte Firmware-Einsätze vor Ort überflüssig",
            "Brachte das Antriebssubsystem ohne Beanstandungen durch die ISO-13849-PL-d-Abnahme",
            "Begleitete drei Kolleg:innen durch ihre erste Platinen-Inbetriebnahme",
          ],
        },
      },
      {
        id: "nordwind",
        dates: {
          en: "Jun 2019 – Feb 2022",
          es: "Jun 2019 – Feb 2022",
          de: "Juni 2019 – Feb 2022",
        },
        span: { en: "2y 9m", es: "2 a. 9 m.", de: "2 J. 9 Mon." },
        org: {
          name: "Nordwind Automation",
          url: "https://nordwind-automation.example",
          location: { en: "Stuttgart", es: "Stuttgart", de: "Stuttgart" },
        },
        title: {
          en: "Embedded Software Engineer",
          es: "Ingeniera de software embebido",
          de: "Embedded-Software-Entwicklerin",
        },
        tech: "FreeRTOS, C, EtherCAT, STM32F4, NXP i.MX6, Buildroot, Python, pytest",
        bullets: {
          en: [
            "Wrote the EtherCAT slave stack integration for a servo-drive family still in production today",
            "Replaced a hand-tuned PID with a model-based controller, halving settling time on the heaviest axis",
            "Cut firmware build times from 14 minutes to 90 seconds by restructuring the CMake tree",
            "Added a fault recorder that captured the last 200 ms before any trip, turning 'it just stopped' into a waveform",
            "Documented the bootloader protocol the support team had been reverse-engineering for years",
          ],
          es: [
            "Escribí la integración de la pila EtherCAT esclava para una familia de servoaccionamientos que sigue en producción hoy",
            "Sustituí un PID ajustado a mano por un control basado en modelo, reduciendo a la mitad el tiempo de establecimiento del eje más pesado",
            "Bajé los tiempos de compilación del firmware de 14 minutos a 90 segundos reestructurando el árbol de CMake",
            "Añadí un registrador de fallos que capturaba los últimos 200 ms antes de cada disparo, convirtiendo el «se paró sin más» en una forma de onda",
            "Documenté el protocolo del bootloader que el equipo de soporte llevaba años deduciendo por ingeniería inversa",
          ],
          de: [
            "Schrieb die EtherCAT-Slave-Stack-Integration für eine Servoantriebs-Familie, die bis heute produziert wird",
            "Ersetzte einen handabgestimmten PID durch eine modellbasierte Regelung und halbierte die Einschwingzeit der schwersten Achse",
            "Verkürzte die Firmware-Buildzeit von 14 Minuten auf 90 Sekunden durch Umbau des CMake-Baums",
            "Ergänzte einen Fehlerschreiber, der die letzten 200 ms vor jeder Abschaltung festhielt — aus „es blieb einfach stehen“ wurde eine Kurve",
            "Dokumentierte das Bootloader-Protokoll, das der Support jahrelang per Reverse Engineering erschlossen hatte",
          ],
        },
      },
      {
        id: "valtec",
        dates: {
          en: "Sep 2017 – May 2019",
          es: "Sep 2017 – May 2019",
          de: "Sep 2017 – Mai 2019",
        },
        span: { en: "1y 9m", es: "1 a. 9 m.", de: "1 J. 9 Mon." },
        org: {
          name: "Valtec Sistemas",
          url: "https://valtec.example",
          location: { en: "Valencia", es: "València", de: "Valencia" },
        },
        title: {
          en: "Embedded Engineer",
          es: "Ingeniera de embebidos",
          de: "Embedded-Entwicklerin",
        },
        tech: "C, Nordic nRF52, LoRaWAN, BLE, low-power design, KiCad, Python",
        bullets: {
          en: [
            "Designed the firmware for a battery-powered soil sensor that ran three seasons on one cell",
            "Got average current from 340 µA down to 11 µA, which is the whole product in one number",
            "Built the LoRaWAN provisioning flow field technicians used without a laptop",
            "Ran the certification campaign for CE and ETSI radio compliance, first pass",
          ],
          es: [
            "Diseñé el firmware de un sensor de suelo alimentado por pila que funcionó tres temporadas con una sola celda",
            "Bajé la corriente media de 340 µA a 11 µA, que es el producto entero resumido en un número",
            "Construí el flujo de aprovisionamiento LoRaWAN que los técnicos de campo usaban sin ordenador",
            "Llevé la campaña de certificación CE y de conformidad radio ETSI, aprobada a la primera",
          ],
          de: [
            "Entwarf die Firmware für einen batteriebetriebenen Bodensensor, der drei Saisons mit einer Zelle lief",
            "Senkte den mittleren Strom von 340 µA auf 11 µA — das ganze Produkt in einer Zahl",
            "Baute den LoRaWAN-Provisionierungsablauf, den Servicetechniker:innen ohne Laptop nutzten",
            "Führte die Zertifizierung für CE und ETSI-Funkkonformität durch, im ersten Anlauf bestanden",
          ],
        },
      },
      {
        id: "marea",
        dates: {
          en: "Jul 2015 – Aug 2017",
          es: "Jul 2015 – Ago 2017",
          de: "Juli 2015 – Aug 2017",
        },
        span: { en: "2y 2m", es: "2 a. 2 m.", de: "2 J. 2 Mon." },
        org: {
          name: "Marea Instruments",
          url: "",
          location: { en: "Valencia", es: "València", de: "Valencia" },
        },
        title: {
          en: "Junior Embedded Developer",
          es: "Desarrolladora júnior de embebidos",
          de: "Junior-Embedded-Entwicklerin",
        },
        tech: "C, AVR, MSP430, RS-485, Modbus RTU, oscilloscopes, soldering iron",
        bullets: {
          en: [
            "Maintained firmware for marine depth sounders that had to survive salt, vibration and indifference",
            "Learned more about grounding from one noisy RS-485 run than from four years of coursework",
          ],
          es: [
            "Mantuve el firmware de sondas de profundidad marinas que tenían que aguantar sal, vibración e indiferencia",
            "Aprendí más sobre masas con una tirada ruidosa de RS-485 que en cuatro años de carrera",
          ],
          de: [
            "Betreute die Firmware von Echoloten, die Salz, Vibration und Gleichgültigkeit überstehen mussten",
            "Lernte aus einer verrauschten RS-485-Leitung mehr über Masseführung als in vier Studienjahren",
          ],
        },
      },
    ],

    education: {
      university: {
        en: "Universitat Politècnica de València",
        es: "Universitat Politècnica de València",
        de: "Universitat Politècnica de València",
      },
      place: { en: "Valencia", es: "València", de: "Valencia" },
      year: 2015,
      field: {
        en: "Telecommunications Engineering",
        es: "Ingeniería de Telecomunicación",
        de: "Nachrichtentechnik",
      },
    },

    certs: [
      { year: "2025", name: "Zephyr RTOS Certified Developer" },
      { year: "2024", name: "ROS 2 Industrial Developer" },
      { year: "2022", name: "TÜV Rheinland Functional Safety Engineer (Machinery)" },
      { year: "2020", name: "ISTQB Certified Tester — Foundation Level" },
      { year: "2018", name: "IPC-A-610 Certified Specialist" },
    ],

    // `filled` is the 0–10 proficiency meter; `sub` is the text beside it.
    languages: [
      {
        name: { en: "Spanish", es: "Español", de: "Spanisch" },
        filled: 10,
        sub: { en: "Native", es: "Nativo", de: "Muttersprache" },
      },
      {
        name: { en: "Valencian", es: "Valencià", de: "Valencianisch" },
        filled: 9,
        sub: { en: "Bilingual", es: "Bilingüe", de: "Zweisprachig" },
      },
      {
        name: { en: "English", es: "Inglés", de: "Englisch" },
        filled: 9,
        sub: { en: "C1 — Advanced", es: "C1 — Avanzado", de: "C1 — Fortgeschritten" },
      },
      {
        name: { en: "German", es: "Alemán", de: "Deutsch" },
        filled: 7,
        sub: {
          en: "B2 — Upper intermediate",
          es: "B2 — Intermedio alto",
          de: "B2 — Gute Mittelstufe",
        },
      },
    ],

    // The playful "notes.txt" list at the foot of the CV.
    traits: {
      en: [
        "will not ship firmware I haven't watched run cold",
        "owns four oscilloscopes and regrets none of them",
        "believes one good log line beats ten breakpoints",
        "can usually tell you which capacitor is whistling",
        "has opinions about connector keying that I will share unprompted",
        "translates between hardware and software teams for a living",
        "keeps every dev board I've ever bricked, as a shrine",
        "reads datasheets the way other people read novels",
        "still proudest of a bug that took three weeks and one resistor",
      ],
      es: [
        "no entrego firmware que no haya visto arrancar en frío",
        "tengo cuatro osciloscopios y no me arrepiento de ninguno",
        "creo que una buena línea de log vale por diez breakpoints",
        "normalmente sé decirte qué condensador está silbando",
        "tengo opiniones sobre el chaveteado de conectores que comparto sin que me pregunten",
        "me gano la vida traduciendo entre los equipos de hardware y de software",
        "guardo todas las placas que he dejado inservibles, como si fueran un altar",
        "leo hojas de características como otros leen novelas",
        "sigo estando más orgullosa de un fallo que costó tres semanas y una resistencia",
      ],
      de: [
        "liefere keine Firmware aus, die ich nicht im Kaltstart gesehen habe",
        "besitze vier Oszilloskope und bereue keines davon",
        "halte eine gute Log-Zeile für wertvoller als zehn Breakpoints",
        "kann dir meistens sagen, welcher Kondensator da pfeift",
        "habe Meinungen zur Steckerkodierung, die ich ungefragt teile",
        "übersetze beruflich zwischen Hardware- und Software-Teams",
        "hebe jedes Board auf, das ich je gebrickt habe — als Schrein",
        "lese Datenblätter, wie andere Romane lesen",
        "bin noch immer am stolzesten auf einen Fehler, der drei Wochen und einen Widerstand gekostet hat",
      ],
    },

    // The closing line, plain text. Rendered as `$ echo "…"` with a blinking cursor.
    signOff: {
      en: "if you read this far, you'd probably enjoy working together.",
      es: "si has llegado hasta aquí, seguramente trabajaríamos bien juntos.",
      de: "wenn du bis hierher gelesen hast, würde uns die Zusammenarbeit vermutlich liegen.",
    },
  },
});
