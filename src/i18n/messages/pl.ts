import type { Messages } from "./en";

/**
 * Polish messages. Typed as `Messages`, so a missing key is a build error.
 *
 * Ships in the repo but is **not selected** by profile.config.ts: a fork
 * switches the site to Polish by adding one import to `MESSAGES`, and an
 * unselected catalogue costs the bundle nothing. `tsc` still checks it, so
 * it cannot drift out of shape when `en.ts` gains a key.
 */
const pl: Messages = {
  ui: {
    welcome: "Witaj w moim głupiutkim terminalu. Wpisz 'help', żeby zobaczyć, co tu jest.",
    welcomeWhisper: "(psst — 'help' jest skromny. pogrzeb trochę.)",
    availableCommands: "Dostępne polecenia:",
    notFound: `nie znaleziono polecenia: <span class="accent">{cmd}</span>`,
    notFoundHint: `<span class="dim">to głupiutki terminal sklejony JavaScriptem, nie prawdziwa powłoka. spróbuj <span class="glow">help</span>, żeby zobaczyć, co tu jest</span>`,
    loggingOut: "wylogowywanie...",
    connClosed: "połączenie z {host} zamknięte.",
    footerHint: `wpisz <span class="accent">help</span>, żeby zacząć`,
    inputLabel: "Wprowadzanie poleceń terminala",
    outputLabel: "Wyjście terminala",
  },

  boot: {
    lines: [
      "sekwencja rozruchu {host} — jądro 6.6.0-sre",
      "[  OK  ] załadowano moduł: years_of_uptime.ko",
      `<span class="rm-line">[FAILED] montowanie /dev/motivation: nie znaleziono</span>`,
      "[  OK  ] zamontowano zamiast tego /dev/coffee",
      "[  OK  ] uruchomiono ssh-agent.service",
      "[  OK  ] uruchomiono kubernetes-cluster.service",
      `<span class="amber">[ WARN ] condensed-milk-reserve.service: stan krytyczny (kot powiadomiony, niewzruszony)</span>`,
      "[  OK  ] uruchomiono ai-assistant.service",
      "[  OK  ] uruchomiono recruiter-inbox.service (1125 nieprzeczytanych)",
      "[  OK  ] pager dyżurny wyciszony (na razie)",
      "",
      "dostęp przyznany — witaj, {user}",
    ],
  },

  commands: {
    about: "kim jest ta osoba",
    skills: "stos technologiczny",
    contact: "jak się ze mną skontaktować",
    cv: "otwórz pełne CV",
    neofetch: "karta informacji o systemie",
    whoami: "trochę za dużo o tobie",
    ls: "wypisz pliki",
    cat: "wyświetl plik",
    fortune: "losowa mądrość",
    top: "udawany monitor procesów",
    kubectl: "zerknij na wymyślony klaster",
    terraform: "zastosuj optymizm, zniszcz wszystko",
    ssh: "zdalne logowanie — pomiń rozmowę wstępną (albo zobacz, co jeszcze tu jest)",
    claude: "zapytaj asystenta AI",
    theme: "zmień kolor terminala",
    matrix: "włącz/wyłącz deszcz w tle",
    lang: "zmień język wyjścia",
    help: "pokaż tę listę",
    clear: "wyczyść ekran",
    history: "polecenia, które uruchomiłeś",
  },

  ls: {
    total: "razem {n}",
  },

  cat: {
    usage: "użycie: cat &lt;plik&gt;",
    noFile: "cat: {file}: Nie ma takiego pliku ani katalogu",
    notText: `cat: {file}: to nie jest plik tekstowy`,
  },

  rm: {
    missingOperand: "rm: brakujący operand",
    denied: "rm: nie można usunąć '{file}': Brak dostępu",
  },

  exec: {
    denied: "bash: ./{file}: Brak dostępu",
    notFound: "bash: ./{file}: Nie ma takiego pliku ani katalogu",
    notExecutable: "bash: ./{file}: Brak dostępu",
    launchingGame: `uruchamiam <span class="glow">{title}</span> w odizolowanym oknie CRT...`,
  },

  theme: {
    set: `motyw ustawiony na <span class="glow">{name}</span>`,
    usage: "użycie: theme &lt;{names}&gt;",
  },

  matrix: {
    on: "deszcz matrix: włączony",
    off: "deszcz matrix: wyłączony",
    usage: "użycie: matrix &lt;on|off&gt;",
  },

  lang: {
    set: `język przełączony na <span class="glow">polski</span>`,
    usage: "użycie: lang &lt;{codes}&gt;",
  },

  sudo: {
    reported: `<span class="amber">Ten incydent zostanie zgłoszony.</span>`,
    removing: `<span class="rm-line">usuwanie {path} ...</span>`,
    justKidding: `<span class="amber">...żartowałem. ale niezła próba.</span>`,
    noHarm: `<span class="dim">(nic nie ucierpiało — to statyczna strona, jesteś w przeglądarce, nie na prawdziwym serwerze)</span>`,
  },

  whoami: {
    user: "Użytkownik",
    browser: "Przeglądarka",
    os: "System",
    tz: "Strefa czasowa",
    unknownOs: "nieznany system",
    unknownBrowser: "tajemnicza przeglądarka",
    unknownTz: "nieznana strefa czasowa",
  },

  timeQuips: {
    lateNight: [
      "jeszcze nie śpisz? szacunek, ale też niepokój",
      "gdzieś jest 3 w nocy i niestety może to być tutaj",
      "maszyny nie śpią i najwyraźniej ty też nie",
    ],
    earlyMorning: [
      "wstałeś wcześnie, albo w ogóle się nie kładłeś — trudno powiedzieć",
      "skrajnie zalogowany ranny ptaszek",
    ],
    morning: [
      "rozsądne godziny, bardzo odpowiedzialnie",
      "produktywna poranna energia, szanuję",
    ],
    midday: ["przeglądanie w przerwie na lunch, klasyka", "złote okno prokrastynacji"],
    afternoon: [
      "dołek o 15, przeglądanie jako mechanizm obronny",
      "popołudniowa energia, trzyma się mocno",
    ],
    evening: ["wieczorne przeglądanie, to, co najlepsze", "godziny szczytu scrollowania, bez wstydu"],
    night: ["o tej porze pewnie powinieneś już spać", "jeszcze jedna karta przed snem, jasne"],
  },

  neofetch: {
    playing: "Odtwarzane",
    offline: "spotify offline",
    idle: "nic teraz nie gra",
  },

  fortunes: [
    "To zawsze DNS.",
    "99,9% dostępności to 8h46m przestoju rocznie — a dziś zużyliśmy już sześć z nich.",
    "Nie ma żadnej chmury. To tylko cudzy klaster Kubernetes.",
    "Energia piątkowego wdrożenia: wysokie ryzyko, wyższy żal.",
    "Bug nigdy nie jest na produkcji. (Bug jest na produkcji.)",
    "Obserwowany pipeline nigdy się nie kończy.",
    "U mnie działa — wysyłamy moją maszynę.",
    "Chaos engineering: to nie bug, to wtorek.",
    "Dzwonił twój dyżur. Chce podwyżki.",
    "Kopie zapasowe są jak nitkowanie zębów — każdy zgadza się, że są ważne, dopóki ich nie robi.",
    "Zautomatyzuj nudę, potem zautomatyzuj automatyzację.",
    "Wszędzie dobrze, ale pod 127.0.0.1 najlepiej.",
    "System rozproszony to taki, w którym maszyna, o której nigdy nie słyszałeś, może uniemożliwić ci pracę.",
    "Monitoring bez alertów to tylko bardzo drogi wygaszacz ekranu.",
    "Najlepszy runbook to ten, którego nikt nie musi czytać o 3 w nocy.",
    "Postmortemy: tam, gdzie 'błąd ludzki' po cichu staje się 'luką w procesie'.",
    "Twój load balancer nie dba o twoje uczucia.",
    "Idempotentność: bo uruchomienie dwa razy nie powinno kosztować dwa razy.",
    "Każda 'tymczasowa' poprawka staje się stała w chwili, gdy zadziała.",
    "Kubernetes: komplikuje proste rzeczy od 2014 roku.",
    "Wykres wyglądał dobrze, dopóki ktoś nie przybliżył.",
    "Infrastructure as Code: teraz twoje literówki mają historię wersji.",
    "Nic nie jest naprawdę usunięte — jest tylko ostatecznie spójne.",
    "Przycisk rollback to najbardziej niedoceniana funkcja w całym twoim pipeline.",
    "SLO: sztuka obiecywania odrobinę mniej niż 100%.",
    "Dobra rotacja dyżurów jest niewidoczna. Zła to czat grupowy o 2 w nocy.",
    "Incydent nigdy naprawdę się nie kończy — staje się tylko ticketem w Jirze, którego nikt nie przypisuje.",
    "Nie potrzebujesz więcej dashboardów. Musisz czytać te, które masz.",
  ],

  top: {
    header: ["PID", "CMD", "CPU%", "MEM%", "STATUS"],
    running: "działa",
    sleeping: "śpi",
    zombie: "zombie",
    quitHint: `<span class="dim">naciśnij <span class="accent">q</span> lub wpisz <span class="accent">exit</span>, żeby wyjść</span>`,
    quitHintPlain: `naciśnij <span class="accent">q</span> lub wpisz <span class="accent">exit</span>, żeby wyjść`,
    exited: "wyjście z top.",
    promptLabel: "(top — q, żeby wyjść)",
    chipQuit: "q — wyjdź",
  },

  kubectl: {
    header: ["NAME", "READY", "STATUS", "AGE"],
    running: "Running",
    justBarely: "ledwo",
    intro: "kubectl steruje menedżerem klastra Kubernetes.",
    subcommands: `dostępne podpolecenia: <span class="glow">get pods</span>, <span class="glow">describe pod &lt;nazwa&gt;</span>`,
    describeUsage: "użycie: kubectl describe pod &lt;nazwa&gt;",
    unknown: `error: unknown command "{cmd}" for "kubectl"`,
    notFound: `Error from server (NotFound): pods "{pod}" not found`,
    reason: "Powód",
    events: "Zdarzenia",
    pods: {
      "cat-deployment-7f9d8c-x2m4q": {
        status: "Running",
        reason: "w pełni zmotywowany, puszki mleka skondensowanego: 0/30",
        events: [
          "Started — kontener uruchomiony 11 lat temu",
          "Normal — stabilniejszy niż większość usług produkcyjnych",
        ],
      },
      "condensed-milk-store-0": {
        status: "CrashLoopBackOff",
        reason: "OOMKilled (zjadł za dużo mleka skondensowanego)",
        events: [
          "Killing — kontener przekroczył limit cukru",
          "BackOff — restart opóźniony, kontener dochodzi do siebie",
          `Pulling — image "cat:hungry-latest"`,
        ],
      },
      "sre-sanity-canary": {
        status: "Running",
        reason: "trzyma się na kawie i uporze",
        events: [
          "Started — kontener uruchomiony",
          "Warning — poziom niepokoju zbliża się do krytycznego",
        ],
      },
      "deploy-friday-afternoon": {
        status: "Evicted",
        reason: "presja na węźle: piątek, 17:58",
        events: ["Evicted — węzeł uznał, że na dziś wystarczy"],
      },
    },
  },

  terraform: {
    usage: "użycie: terraform &lt;podpolecenie&gt;",
    subcommands: `dostępne podpolecenia: <span class="glow">apply</span>, <span class="glow">destroy</span>`,
    unknown: `terraform: nieznane podpolecenie "{cmd}"`,
    willPerform: `<span class="dim">Terraform wykona następujące działania:</span>`,
    destroyWeekend: `<span class="amber">To zniszczy twój weekend. Do zatwierdzenia przyjmowane jest tylko 'yes'.</span>`,
    applyTimedOut: `<span class="dim">Enter a value: (przekroczono czas) — apply anulowany.</span>`,
    acquiringLock: `<span class="dim">Pobieranie blokady stanu (może to chwilę potrwać)...</span>`,
    willDestroy: `<span class="dim">Terraform zniszczy:</span>`,
    plan: `<span class="amber">Plan: 0 to add, 0 to change, {n} to destroy.</span>`,
    reallyDestroy: `Czy na pewno chcesz zniszczyć wszystkie zasoby? Do zatwierdzenia przyjmowane jest tylko 'yes'.`,
    answeredForYou: `<span class="dim">Enter a value: <span class="glow">yes</span> (terminal odpowiedział za ciebie)</span>`,
    destroyComplete: `<span class="amber">Destroy complete! Resources: {n} destroyed.</span>`,
    ripWeekend: `<span class="dim">(spoczywaj w pokoju, weekendzie.)</span>`,
  },

  ssh: {
    usage: "użycie: ssh &lt;użytkownik@host&gt;",
    knownHosts: `<span class="dim"># znane hosty na tej maszynie:</span> {hosts}`,
    handshake: [
      "żądanie uzgodnienia z {host} ...",
      "ECDSA key fingerprint is SHA256:7hR3s+kn0wYouR3Wo7rth.",
      "Are you sure you want to continue connecting (yes/no)? yes",
      "Warning: Permanently added '{host}' (ECDSA) to the list of known hosts.",
      "uwierzytelnianie...",
      "dostęp przyznany.",
    ],
    connected: `połączono z <span class="glow">{host}</span>.`,
    closing: "zamykanie połączenia z {host}...",
    menuPrompt: `Wpisz polecenie, żeby zadać pytanie, albo "exit", żeby się rozłączyć:`,
    topics: "tematy:",
    askAnother: `<span class="dim">zadaj kolejne pytanie albo wpisz "exit"</span>`,
    unrecognized: `nierozpoznane polecenie — dostępne: {cmds} albo "exit"`,
    failFirst: [
      "ssh: łączenie z {host} ...",
      "ssh: connect to host {host} port 22: Connection timed out",
      "ssh: ponawianie (1/3)...",
      "ssh: ponawianie (2/3)...",
      "ssh: connection reset by peer",
      `<span class="dim">ten host chyba nie istnieje. ta sesja też nie.</span>`,
    ],
    failPersistent: [
      "ssh: łączenie z {host} ...",
      "ssh: connect to host {host} port 22: Connection timed out",
      `<span class="amber">[uwaga]</span> to próba nr {count} połączenia z hostem, który nie istnieje`,
      `<span class="amber">[uwaga]</span> imponująca wytrwałość, naprawdę`,
      "ssh: ten host nigdy nie istniał. Sprawdziłem. Dwa razy.",
      `<span class="dim">psst — może spróbuj: <span class="glow">ssh {hint}</span></span>`,
    ],
  },

  claude: {
    version: `<span class="glow">Claude Code v2.1.4</span>`,
    usage: `użycie: claude "&lt;prompt&gt;" &nbsp;|&nbsp; claude log --oneline &nbsp;|&nbsp; claude --confess`,
    logCommits: [
      "feat: ukryłem kilka dodatkowych poleceń, nikomu nie powiedziałem",
      "fix: kursor był o piksel za daleko w prawo na pustej linii",
      "feat: gra za sudo, bo systemy uprawnień są takie zabawne",
      "fix: klawiatura androida mieszała pierwszą wpisaną literę (znowu)",
      "feat: udawane błędy ssh, z przełamaniem czwartej ściany",
      "revert: użytkownik poprosił tym razem mniej grzecznie :(",
    ],
    logFooter: `<span class="dim">ta strona ma ze mną dłuższą historię commitów niż większość moich prawdziwych relacji</span>`,
    confess: "tak — ten terminal powstał przez zapytanie AI (cześć, to ja).",
    lightTheme1: [
      "Rzucę okiem na obecną konfigurację motywów.",
      "Znalazłem — ta strona nie ma jasnego motywu. Nigdy nie miała. Nigdy nie będzie.",
      "Mógłbym dodać, ale muszę zaznaczyć, że może to zdenerwować kota.",
      "Oznaczam jako won't-fix. Coś jeszcze?",
    ],
    lightTheme2: [
      "Dobra, jesteś uparty. Tym razem naprawdę to zbuduję.",
      "Żadnego jasnego motywu tutaj. Chyba muszę go napisać.",
      "Szkicuję jasną paletę... coś w duchu Ayu Light.",
      "Podłączam i nazywam tak, żeby nikt nie zgadł.",
      "Wysłane. Kot został poinformowany i składa skargę.",
      "Zbudowanie to była moja robota — przełączenie jest twoje: theme {theme}.",
      "Zdejmuję won't-fix. Coś jeszcze?",
    ],
    lightTheme3: [
      "Już to przerabialiśmy.",
      "Ticket jest zamknięty. Nie ma już nic do zbudowania — wpisz po prostu theme {theme}.",
    ],
    fixBug: ["Nie ma buga. Nigdy nie było buga. Sprawdziłem. Dwa razy."],
    addTests: [
      "Znaleziono 0 testów. To albo bardzo niepokojące, albo odważna decyzja projektowa.",
      `Idę w "odważną decyzję projektową" i lecę dalej.`,
    ],
    generic: [
      "Jasne. Już się tym zajmuję.",
      "Właściwie to może potrwać dłużej, niż się spodziewałem. Dodaję do listy.",
      "(lista jest długa. lista zawsze jest długa.)",
    ],
  },

  free: {
    swapNote: `<span class="dim">swap: w zasadzie pełny, jak wszystko inne</span>`,
  },

  who: {
    yourBrowser: "twoja przeglądarka",
    stillFixing: "wciąż naprawia produkcję",
  },
  files: {
    game: [
      "#!/bin/bash",
      "# {script} — nie czytaj, po prostu uruchom",
      "# zobacz też: <a href=\"{url}\" target=\"_blank\" rel=\"noopener\">{url}</a>",
      "# uwaga: będziesz potrzebować sudo",
      'echo "otwieram małą niespodziankę..."',
      "xdg-open {url} 2&gt;/dev/null",
    ],
  },

  notFound: {
    message: "Nie ma takiego pliku ani katalogu",
    description: "404 — nie znaleziono strony.",
    quip: "Ups! Wygląda na to, że kot zjadł całe mleko skondensowane... i tę stronę też.",
    catAlt: "Rudy kot leży na plecach, zmęczony, otoczony rozlanymi puszkami mleka skondensowanego.",
    back: "wróć do terminala",
    unknownPage: "nieznana-strona",
    switchTo: "Zmień język",
    announce: "Język przełączony na polski",
  },

  cv: {
    catHint: `— użyj <span class="glow">cv</span>, żeby je otworzyć`,
    opening: `otwieranie <span class="glow">cv.html</span> ...`,
    techPrefix: "// tech:",
    photoAlt: "{name}, {role} — zdjęcie portretowe",
    print: "drukuj",
    backToTerminal: "wróć do terminala",
    switchLanguage: "Zmień język",
  },

};

export default pl;
