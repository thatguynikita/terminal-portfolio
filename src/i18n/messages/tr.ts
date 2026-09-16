import type { Messages } from "./en";

/**
 * Turkish messages. Typed as `Messages`, so a missing key is a build error.
 *
 * Ships in the repo but is **not selected** by profile.config.ts: a fork
 * switches the site to Turkish by adding one import to `MESSAGES`, and an
 * unselected catalogue costs the bundle nothing. `tsc` still checks it, so
 * it cannot drift out of shape when `en.ts` gains a key.
 */
const tr: Messages = {
  ui: {
    welcome: "Şapşal terminalime hoş geldin. Neler var görmek için 'help' yaz.",
    welcomeWhisper: "(pst — 'help' mütevazı davranıyor. biraz kurcala.)",
    availableCommands: "Kullanılabilir komutlar:",
    notFound: `komut bulunamadı: <span class="accent">{cmd}</span>`,
    notFoundHint: `<span class="dim">bu JavaScript'le tutturulmuş şapşal bir terminal, gerçek bir kabuk değil. neler olduğunu görmek için <span class="glow">help</span> dene</span>`,
    loggingOut: "çıkış yapılıyor...",
    connClosed: "{host} bağlantısı kapatıldı.",
    footerHint: `keşfetmek için <span class="accent">help</span> yaz`,
    inputLabel: "Terminal komut girişi",
    outputLabel: "Terminal çıktısı",
  },

  boot: {
    lines: [
      "{host} açılış sırası — çekirdek 6.6.0-sre",
      "[  OK  ] modül yüklendi: years_of_uptime.ko",
      `<span class="rm-line">[FAILED] /dev/motivation bağlanıyor: bulunamadı</span>`,
      "[  OK  ] yerine /dev/coffee bağlandı",
      "[  OK  ] ssh-agent.service başlatıldı",
      "[  OK  ] kubernetes-cluster.service başlatıldı",
      `<span class="amber">[ WARN ] condensed-milk-reserve.service: kritik seviyede düşük (kediye bildirildi, umursamadı)</span>`,
      "[  OK  ] ai-assistant.service başlatıldı",
      "[  OK  ] recruiter-inbox.service başlatıldı (1125 okunmamış)",
      "[  OK  ] nöbet çağrı cihazı sessize alındı (şimdilik)",
      "",
      "erişim verildi — hoş geldin, {user}",
    ],
  },

  commands: {
    about: "bu kişi kim",
    skills: "teknoloji yığını",
    contact: "bana ulaşma yolları",
    cv: "tam özgeçmişi aç",
    neofetch: "sistem bilgi kartı",
    whoami: "senin hakkında biraz fazla bilgi",
    ls: "dosyaları listele",
    cat: "bir dosyayı yazdır",
    fortune: "rastgele bilgelik",
    top: "sahte süreç izleyici",
    kubectl: "hayali bir kümeye göz at",
    terraform: "iyimserliği uygula, her şeyi yok et",
    ssh: "uzak oturum — ön görüşmeyi atla (ya da başka neler var gör)",
    claude: "bir yapay zekâ asistanına sor",
    theme: "terminal rengini değiştir",
    matrix: "arka plan yağmurunu aç/kapat",
    lang: "çıktı dilini değiştir",
    help: "bu listeyi göster",
    clear: "ekranı temizle",
    history: "çalıştırdığın komutlar",
  },

  ls: {
    total: "toplam {n}",
  },

  cat: {
    usage: "kullanım: cat &lt;dosya&gt;",
    noFile: "cat: {file}: Böyle bir dosya ya da dizin yok",
    notText: `cat: {file}: metin dosyası değil`,
  },

  rm: {
    missingOperand: "rm: işlenen eksik",
    denied: "rm: '{file}' silinemiyor: İzin verilmedi",
  },

  exec: {
    denied: "bash: ./{file}: İzin verilmedi",
    notFound: "bash: ./{file}: Böyle bir dosya ya da dizin yok",
    notExecutable: "bash: ./{file}: İzin verilmedi",
    launchingGame: `<span class="glow">{title}</span> yalıtılmış bir CRT penceresinde başlatılıyor...`,
  },

  theme: {
    set: `tema <span class="glow">{name}</span> olarak ayarlandı`,
    usage: "kullanım: theme &lt;{names}&gt;",
  },

  matrix: {
    on: "matrix yağmuru: açık",
    off: "matrix yağmuru: kapalı",
    usage: "kullanım: matrix &lt;on|off&gt;",
  },

  lang: {
    set: `dil <span class="glow">Türkçe</span> olarak değiştirildi`,
    usage: "kullanım: lang &lt;{codes}&gt;",
  },

  sudo: {
    reported: `<span class="amber">Bu olay rapor edilecek.</span>`,
    removing: `<span class="rm-line">{path} siliniyor ...</span>`,
    justKidding: `<span class="amber">...şaka şaka. yine de iyi denemeydi.</span>`,
    noHarm: `<span class="dim">(hiçbir şeye zarar gelmedi — bu statik bir site, bir tarayıcıdasın, gerçek bir sunucuda değil)</span>`,
  },

  whoami: {
    user: "Kullanıcı",
    browser: "Tarayıcı",
    os: "İşletim sistemi",
    tz: "Saat dilimi",
    unknownOs: "bilinmeyen bir işletim sistemi",
    unknownBrowser: "gizemli bir tarayıcı",
    unknownTz: "bilinmeyen bir saat dilimi",
  },

  timeQuips: {
    lateNight: [
      "hâlâ uyanık mısın? saygı duyarım ama biraz da endişe",
      "bir yerlerde saat sabahın 3'ü ve maalesef burası olabilir",
      "makineler uyumaz, görünüşe göre sen de",
    ],
    earlyMorning: [
      "erken kalktın ya da hiç yatmadın — söylemesi zor",
      "aşırı çevrimiçi erkenci kuş",
    ],
    morning: [
      "makul saatler, çok sorumluluk sahibisin",
      "verimli sabah enerjisi, saygı duyarım",
    ],
    midday: ["öğle arası gezintisi, klasik", "ertelemenin altın saati"],
    afternoon: [
      "saat 3 çöküşü, başa çıkma yöntemi olarak gezinmek",
      "öğleden sonra enerjisi, sıkı duruyor",
    ],
    evening: ["akşam gezintisi, en güzeli", "kaydırmanın yoğun saatleri, utanacak bir şey yok"],
    night: ["bu saatte muhtemelen uyuyor olmalısın", "yatmadan önce bir sekme daha, tabii"],
  },

  neofetch: {
    playing: "Çalıyor",
    offline: "spotify çevrimdışı",
    idle: "şu an bir şey çalmıyor",
  },

  fortunes: [
    "Her zaman DNS'tir.",
    "%99,9 çalışma süresi yılda 8s46d kesinti demek — bugün altı saatini harcadık bile.",
    "Bulut diye bir şey yok. Sadece başkasının Kubernetes kümesi var.",
    "Cuma dağıtımı enerjisi: yüksek risk, daha yüksek pişmanlık.",
    "Hata asla prod'da değildir. (Hata prod'da.)",
    "İzlenen pipeline hiç bitmez.",
    "Benim makinemde çalışıyor — makineyi gönderiyoruz.",
    "Kaos mühendisliği: bu bir hata değil, bu bir salı.",
    "Nöbetin aradı. Zam istiyor.",
    "Yedekler diş ipi gibidir — herkes önemli olduğunda hemfikirdir, ta ki yapmadıkları güne kadar.",
    "Sıkıcı olanı otomatikleştir, sonra otomasyonu otomatikleştir.",
    "127.0.0.1 gibisi yok.",
    "Dağıtık sistem, adını hiç duymadığın bir makinenin işini yapmanı engelleyebildiği sistemdir.",
    "Uyarısız izleme sadece çok pahalı bir ekran koruyucudur.",
    "En iyi runbook, sabahın 3'ünde kimsenin okumak zorunda kalmadığıdır.",
    "Postmortemler: 'insan hatası'nın sessizce 'süreç boşluğu'na dönüştüğü yer.",
    "Yük dengeleyicin duygularını umursamaz.",
    "İdempotentlik: iki kez çalıştırmak iki kat ödetmemeli.",
    "Her 'geçici' düzeltme çalıştığı anda kalıcı olur.",
    "Kubernetes: 2014'ten beri basit şeyleri karmaşıklaştırıyor.",
    "Grafik, biri yakınlaştırana kadar iyi görünüyordu.",
    "Kod Olarak Altyapı: artık yazım hatalarının da sürüm geçmişi var.",
    "Hiçbir şey gerçekten silinmez — sadece nihai tutarlıdır.",
    "Geri alma düğmesi, tüm pipeline'ındaki en az takdir edilen özelliktir.",
    "SLO: %100'den biraz azını vaat etme sanatı.",
    "İyi bir nöbet rotasyonu görünmezdir. Kötüsü, gece 2'de grup sohbetidir.",
    "Olay asla gerçekten bitmez — sadece kimsenin atamadığı bir Jira kaydına dönüşür.",
    "Daha fazla panoya ihtiyacın yok. Elindekileri okumaya ihtiyacın var.",
  ],

  top: {
    header: ["PID", "CMD", "CPU%", "MEM%", "STATUS"],
    running: "çalışıyor",
    sleeping: "uyuyor",
    zombie: "zombi",
    quitHint: `<span class="dim">çıkmak için <span class="accent">q</span>'ya bas ya da <span class="accent">exit</span> yaz</span>`,
    quitHintPlain: `çıkmak için <span class="accent">q</span>'ya bas ya da <span class="accent">exit</span> yaz`,
    exited: "top'tan çıkıldı.",
    promptLabel: "(top — çıkmak için q)",
    chipQuit: "q — çık",
  },

  kubectl: {
    header: ["NAME", "READY", "STATUS", "AGE"],
    running: "Running",
    justBarely: "kıl payı",
    intro: "kubectl, Kubernetes küme yöneticisini denetler.",
    subcommands: `kullanılabilir alt komutlar: <span class="glow">get pods</span>, <span class="glow">describe pod &lt;ad&gt;</span>`,
    describeUsage: "kullanım: kubectl describe pod &lt;ad&gt;",
    unknown: `error: unknown command "{cmd}" for "kubectl"`,
    notFound: `Error from server (NotFound): pods "{pod}" not found`,
    reason: "Neden",
    events: "Olaylar",
    pods: {
      "cat-deployment-7f9d8c-x2m4q": {
        status: "Running",
        reason: "tamamen motive, yoğunlaştırılmış süt kutusu: 0/30",
        events: [
          "Started — konteyner 11 yıl önce başlatıldı",
          "Normal — çoğu üretim servisinden daha kararlı",
        ],
      },
      "condensed-milk-store-0": {
        status: "CrashLoopBackOff",
        reason: "OOMKilled (çok fazla yoğunlaştırılmış süt yedi)",
        events: [
          "Killing — konteyner şeker sınırını aştı",
          "BackOff — yeniden başlatma ertelendi, konteyner toparlanıyor",
          `Pulling — image "cat:hungry-latest"`,
        ],
      },
      "sre-sanity-canary": {
        status: "Running",
        reason: "kahve ve inatla ayakta",
        events: [
          "Started — konteyner başlatıldı",
          "Warning — kaygı seviyesi kritiğe yaklaşıyor",
        ],
      },
      "deploy-friday-afternoon": {
        status: "Evicted",
        reason: "düğüm baskısı: cuma, 17:58",
        events: ["Evicted — düğüm bugünlük bu kadar dedi"],
      },
    },
  },

  terraform: {
    usage: "kullanım: terraform &lt;alt komut&gt;",
    subcommands: `kullanılabilir alt komutlar: <span class="glow">apply</span>, <span class="glow">destroy</span>`,
    unknown: `terraform: bilinmeyen alt komut "{cmd}"`,
    willPerform: `<span class="dim">Terraform şu işlemleri gerçekleştirecek:</span>`,
    destroyWeekend: `<span class="amber">Bu, hafta sonunu yok edecek. Onay için yalnızca 'yes' kabul edilir.</span>`,
    applyTimedOut: `<span class="dim">Enter a value: (zaman aşımı) — apply iptal edildi.</span>`,
    acquiringLock: `<span class="dim">Durum kilidi alınıyor (biraz sürebilir)...</span>`,
    willDestroy: `<span class="dim">Terraform şunları yok edecek:</span>`,
    plan: `<span class="amber">Plan: 0 to add, 0 to change, {n} to destroy.</span>`,
    reallyDestroy: `Tüm kaynakları gerçekten yok etmek istiyor musun? Onay için yalnızca 'yes' kabul edilir.`,
    answeredForYou: `<span class="dim">Enter a value: <span class="glow">yes</span> (terminal senin yerine cevapladı)</span>`,
    destroyComplete: `<span class="amber">Destroy complete! Resources: {n} destroyed.</span>`,
    ripWeekend: `<span class="dim">(huzur içinde yat, hafta sonu.)</span>`,
  },

  ssh: {
    usage: "kullanım: ssh &lt;kullanıcı@ana bilgisayar&gt;",
    knownHosts: `<span class="dim"># bu makinede bilinen ana bilgisayarlar:</span> {hosts}`,
    handshake: [
      "{host} ile el sıkışma isteniyor ...",
      "ECDSA key fingerprint is SHA256:7hR3s+kn0wYouR3Wo7rth.",
      "Are you sure you want to continue connecting (yes/no)? yes",
      "Warning: Permanently added '{host}' (ECDSA) to the list of known hosts.",
      "kimlik doğrulanıyor...",
      "erişim verildi.",
    ],
    connected: `<span class="glow">{host}</span> bağlantısı kuruldu.`,
    closing: "{host} bağlantısı kapatılıyor...",
    menuPrompt: `Soru sormak için bir komut yaz, bağlantıyı kesmek için "exit":`,
    topics: "konular:",
    askAnother: `<span class="dim">başka bir soru sor ya da "exit" yaz</span>`,
    unrecognized: `tanınmayan komut — kullanılabilir: {cmds} ya da "exit"`,
    failFirst: [
      "ssh: {host} adresine bağlanılıyor ...",
      "ssh: connect to host {host} port 22: Connection timed out",
      "ssh: yeniden deneniyor (1/3)...",
      "ssh: yeniden deneniyor (2/3)...",
      "ssh: connection reset by peer",
      `<span class="dim">bu ana bilgisayar var gibi görünmüyor. bu oturum da öyle.</span>`,
    ],
    failPersistent: [
      "ssh: {host} adresine bağlanılıyor ...",
      "ssh: connect to host {host} port 22: Connection timed out",
      `<span class="amber">[not]</span> bu, var olmayan bir ana bilgisayara {count}. deneme`,
      `<span class="amber">[not]</span> etkileyici bir ısrar, gerçekten`,
      "ssh: bu ana bilgisayar hiç var olmadı. Kontrol ettim. İki kez.",
      `<span class="dim">pst — belki şunu dene: <span class="glow">ssh {hint}</span></span>`,
    ],
  },

  claude: {
    version: `<span class="glow">Claude Code v2.1.4</span>`,
    usage: `kullanım: claude "&lt;istem&gt;" &nbsp;|&nbsp; claude log --oneline &nbsp;|&nbsp; claude --confess`,
    logCommits: [
      "feat: birkaç ek komut sakladım, kimseye söylemedim",
      "fix: boş satırda imleç bir piksel sağdaydı",
      "feat: oyunu sudo arkasına aldım, çünkü izin sistemleri çok komik",
      "fix: android klavyesi yazılan ilk harfi karıştırıyordu (yine)",
      "feat: sahte ssh hataları, dördüncü duvarı yıkarak",
      "revert: kullanıcı bu sefer daha az kibarca istedi :(",
    ],
    logFooter: `<span class="dim">bu sitenin benimle olan commit geçmişi, gerçek ilişkilerimin çoğundan daha uzun</span>`,
    confess: "evet — bu terminal bir yapay zekâya sorularak yapıldı (selam, o benim).",
    lightTheme1: [
      "Mevcut tema kurulumuna bir bakayım.",
      "Buldum — bu sitede açık tema yok. Hiç olmadı. Hiç olmayacak.",
      "Ekleyebilirim ama belirtmeliyim, kediyi üzebilir.",
      "won't-fix olarak işaretliyorum. Başka bir şey?",
    ],
    lightTheme2: [
      "Peki, ısrarcısın. Bu sefer gerçekten yapayım.",
      "Burada açık tema yok. Sanırım bir tane yazmam gerekecek.",
      "Açık bir palet taslağı çıkarıyorum... Ayu Light ruhunda bir şey.",
      "Bağlıyorum ve kimsenin tahmin edemeyeceği bir ad veriyorum.",
      "Gönderildi. Kediye bildirildi ve şikâyette bulunuyor.",
      "Yapmak benim işimdi — anahtarı çevirmek senin: theme {theme}.",
      "won't-fix işaretini kaldırıyorum. Başka bir şey?",
    ],
    lightTheme3: [
      "Bunu konuşmuştuk.",
      "Kayıt tamamlandı olarak işaretli. Yapılacak bir şey kalmadı — sadece theme {theme} yaz.",
    ],
    fixBug: ["Hata yok. Hiç hata olmadı. Kontrol ettim. İki kez."],
    addTests: [
      "0 test bulundu. Bu ya çok endişe verici ya da cesur bir tasarım kararı.",
      `"Cesur tasarım kararı" diyip devam ediyorum.`,
    ],
    generic: [
      "Anlaşıldı. Hemen üzerinde çalışıyorum.",
      "Aslında bu beklenenden uzun sürebilir. Listeye ekliyorum.",
      "(liste uzun. liste her zaman uzun.)",
    ],
  },

  free: {
    swapNote: `<span class="dim">swap: neredeyse dolu, diğer her şey gibi</span>`,
  },

  who: {
    yourBrowser: "tarayıcın",
    stillFixing: "hâlâ prod'u düzeltiyor",
  },
  files: {
    game: [
      "#!/bin/bash",
      "# {script} — okuma, sadece çalıştır",
      "# ayrıca bkz: <a href=\"{url}\" target=\"_blank\" rel=\"noopener\">{url}</a>",
      "# not: sudo gerekecek",
      'echo "küçük bir sürpriz açılıyor..."',
      "xdg-open {url} 2&gt;/dev/null",
    ],
  },

  notFound: {
    message: "Böyle bir dosya ya da dizin yok",
    quip: "Hoop! Görünüşe göre kedi tüm yoğunlaştırılmış sütü yemiş... bu sayfayı da.",
    catAlt: "Sırtüstü yatan yorgun bir turuncu kedi, etrafında devrilmiş yoğunlaştırılmış süt kutuları.",
    back: "terminale dön",
    unknownPage: "bilinmeyen-sayfa",
    switchTo: "Dili değiştir",
    announce: "Dil Türkçe olarak değiştirildi",
  },

  cv: {
    catHint: `— bunun yerine <span class="glow">cv</span> ile aç`,
    opening: `<span class="glow">cv.html</span> açılıyor ...`,
    techPrefix: "// teknoloji:",
    photoAlt: "{name}, {role} — portre fotoğrafı",
    print: "yazdır",
    backToTerminal: "terminale dön",
    switchLanguage: "Dili değiştir",
  },

};

export default tr;
