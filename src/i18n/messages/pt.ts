import type { Messages } from "./en.ts";

/**
 * Portuguese messages — Brazilian Portuguese. Typed as `Messages`, so a
 * missing key is a build error.
 *
 * Ships in the repo but is **not selected** by profile.config.ts: a fork
 * switches the site to Portuguese by adding one import to `MESSAGES`, and
 * an unselected catalogue costs the bundle nothing. `tsc` still checks it,
 * so it cannot drift out of shape when `en.ts` gains a key.
 */
const pt: Messages = {
  ui: {
    welcome: "Bem-vindo ao meu terminal bobo. Digite 'help' para ver o que há por aqui.",
    welcomeWhisper: "(psiu — o 'help' é modesto. fuce um pouco.)",
    availableCommands: "Comandos disponíveis:",
    notFound: `comando não encontrado: <span class="accent">{cmd}</span>`,
    notFoundHint: `<span class="dim">isto é um terminal bobo sustentado por JavaScript, não um shell de verdade. tente <span class="glow">help</span> para ver o que existe</span>`,
    loggingOut: "saindo...",
    connClosed: "conexão com {host} encerrada.",
    footerHint: `digite <span class="accent">help</span> para explorar`,
    pageTitle: "terminal",
    inputLabel: "Entrada de comandos do terminal",
    outputLabel: "Saída do terminal",
  },

  boot: {
    lines: [
      "sequência de boot de {host} — kernel 6.6.0-sre",
      "[  OK  ] módulo carregado: years_of_uptime.ko",
      `<span class="rm-line">[FAILED] montagem de /dev/motivation: não encontrado</span>`,
      "[  OK  ] /dev/coffee montado no lugar",
      "[  OK  ] ssh-agent.service iniciado",
      "[  OK  ] kubernetes-cluster.service iniciado",
      `<span class="amber">[ WARN ] condensed-milk-reserve.service: nível crítico (gato avisado, indiferente)</span>`,
      "[  OK  ] ai-assistant.service iniciado",
      "[  OK  ] recruiter-inbox.service iniciado (1125 não lidas)",
      "[  OK  ] pager de plantão silenciado (por enquanto)",
      "",
      "acesso concedido — bem-vindo, {user}",
    ],
  },

  commands: {
    about: "quem é essa pessoa",
    skills: "stack técnica",
    contact: "como falar comigo",
    cv: "abrir o currículo completo",
    neofetch: "cartão de informações do sistema",
    whoami: "um pouco demais sobre você",
    ls: "listar arquivos",
    cat: "mostrar um arquivo",
    fortune: "sabedoria aleatória",
    top: "monitor de processos de mentira",
    kubectl: "espiar um cluster de faz de conta",
    terraform: "aplicar otimismo, destruir tudo",
    ssh: "login remoto — pule a entrevista de triagem (ou descubra o que mais existe por aí)",
    claude: "perguntar a um assistente de IA",
    theme: "mudar a cor do terminal",
    matrix: "ligar/desligar a chuva de fundo",
    lang: "trocar o idioma da saída",
    help: "mostrar esta lista",
    clear: "limpar a tela",
    history: "comandos que você executou",
  },

  ls: {
    total: "total {n}",
  },

  cat: {
    usage: "uso: cat &lt;arquivo&gt;",
    noFile: "cat: {file}: Arquivo ou diretório inexistente",
    notText: `cat: {file}: não é um arquivo de texto`,
  },

  rm: {
    missingOperand: "rm: operando ausente",
    denied: "rm: não foi possível remover '{file}': Permissão negada",
  },

  exec: {
    denied: "bash: ./{file}: Permissão negada",
    notFound: "bash: ./{file}: Arquivo ou diretório inexistente",
    notExecutable: "bash: ./{file}: Permissão negada",
    launchingGame: `abrindo <span class="glow">{title}</span> numa janela CRT isolada...`,
  },

  theme: {
    set: `tema definido como <span class="glow">{name}</span>`,
    usage: "uso: theme &lt;{names}&gt;",
  },

  matrix: {
    on: "chuva matrix: ligada",
    off: "chuva matrix: desligada",
    usage: "uso: matrix &lt;on|off&gt;",
  },

  lang: {
    set: `idioma alterado para <span class="glow">português</span>`,
    usage: "uso: lang &lt;{codes}&gt;",
  },

  sudo: {
    reported: `<span class="amber">Este incidente será reportado.</span>`,
    removing: `<span class="rm-line">removendo {path} ...</span>`,
    justKidding: `<span class="amber">...brincadeira. mas foi uma boa tentativa.</span>`,
    noHarm: `<span class="dim">(nada foi danificado — isto é um site estático, você está num navegador, não num servidor de verdade)</span>`,
  },

  whoami: {
    user: "Usuário",
    browser: "Navegador",
    os: "SO",
    tz: "Fuso horário",
    unknownOs: "um SO desconhecido",
    unknownBrowser: "um navegador misterioso",
    unknownTz: "um fuso horário desconhecido",
  },

  timeQuips: {
    lateNight: [
      "ainda acordado? respeito, mas também me preocupo",
      "são 3 da manhã em algum lugar, e infelizmente pode ser aqui",
      "as máquinas não dormem e, pelo visto, você também não",
    ],
    earlyMorning: [
      "acordou cedo, ou nem foi dormir — difícil dizer",
      "o madrugador extremamente online",
    ],
    morning: [
      "horário razoável, muito responsável da sua parte",
      "energia produtiva de manhã, respeito isso",
    ],
    midday: ["navegando na hora do almoço, um clássico", "janela nobre da procrastinação"],
    afternoon: [
      "a moleza das 15h, navegando como mecanismo de defesa",
      "energia da tarde, firme e forte",
    ],
    evening: [
      "navegação noturna, a melhor parte",
      "horário nobre da rolagem, sem vergonha nenhuma",
    ],
    night: ["já devia estar dormindo a essa hora", "só mais uma aba antes de dormir, claro"],
  },

  neofetch: {
    playing: "Tocando",
    offline: "spotify offline",
    idle: "nada tocando agora",
  },

  fortunes: [
    "É sempre o DNS.",
    "99,9% de uptime são 8h46m de indisponibilidade por ano — e já gastamos seis delas hoje.",
    "Não existe nuvem. É só o cluster Kubernetes de outra pessoa.",
    "Energia de deploy na sexta: risco alto, arrependimento maior.",
    "O bug nunca está em prod. (O bug está em prod.)",
    "Pipeline vigiado nunca termina.",
    "Funciona na minha máquina — vamos entregar a máquina.",
    "Engenharia do caos: não é um bug, é terça-feira.",
    "Seu plantão ligou. Quer um aumento.",
    "Backup é como fio dental — todo mundo concorda que importa, até o dia em que não fez.",
    "Automatize o chato, depois automatize a automação.",
    "Não há lugar como 127.0.0.1.",
    "Sistema distribuído é aquele em que uma máquina que você nunca ouviu falar impede você de trabalhar.",
    "Monitoramento sem alerta é só um protetor de tela muito caro.",
    "O melhor runbook é o que ninguém precisa ler às 3 da manhã.",
    "Postmortem: onde 'erro humano' vira discretamente 'lacuna de processo'.",
    "Seu load balancer não liga para os seus sentimentos.",
    "Idempotência: porque rodar duas vezes não deveria custar o dobro.",
    "Todo ajuste 'temporário' vira permanente no instante em que funciona.",
    "Kubernetes: complicando coisas simples desde 2014.",
    "O gráfico parecia ótimo até alguém dar zoom.",
    "Infraestrutura como Código: agora seus erros de digitação têm histórico de versões.",
    "Nada é realmente apagado — só é eventualmente consistente.",
    "O botão de rollback é o recurso mais subestimado de todo o seu pipeline.",
    "SLOs: a arte de prometer um pouco menos que 100%.",
    "Uma boa escala de plantão é invisível. Uma ruim é um grupo no chat às 2 da manhã.",
    "O incidente nunca acaba de verdade — só vira um ticket no Jira que ninguém atribui.",
    "Você não precisa de mais dashboards. Precisa ler os que já tem.",
  ],

  top: {
    header: ["PID", "CMD", "CPU%", "MEM%", "STATUS"],
    running: "executando",
    sleeping: "dormindo",
    zombie: "zumbi",
    quitHint: `<span class="dim">pressione <span class="accent">q</span> ou digite <span class="accent">exit</span> para sair</span>`,
    quitHintPlain: `pressione <span class="accent">q</span> ou digite <span class="accent">exit</span> para sair`,
    exited: "saiu do top.",
    promptLabel: "(top — q para sair)",
    chipQuit: "q — sair",
  },

  kubectl: {
    header: ["NAME", "READY", "STATUS", "AGE"],
    running: "Running",
    justBarely: "por pouco",
    intro: "kubectl controla o gerenciador de cluster do Kubernetes.",
    subcommands: `subcomandos disponíveis: <span class="glow">get pods</span>, <span class="glow">describe pod &lt;nome&gt;</span>`,
    describeUsage: "uso: kubectl describe pod &lt;nome&gt;",
    unknown: `error: unknown command "{cmd}" for "kubectl"`,
    notFound: `Error from server (NotFound): pods "{pod}" not found`,
    reason: "Motivo",
    events: "Eventos",
    pods: {
      "cat-deployment-7f9d8c-x2m4q": {
        status: "Running",
        reason: "totalmente motivado, latas de leite condensado: 0/30",
        events: [
          "Started — contêiner iniciado há 11 anos",
          "Normal — mais estável que a maioria dos serviços em produção",
        ],
      },
      "condensed-milk-store-0": {
        status: "CrashLoopBackOff",
        reason: "OOMKilled (comeu leite condensado demais)",
        events: [
          "Killing — contêiner excedeu o limite de açúcar",
          "BackOff — reinício adiado, contêiner se recuperando",
          `Pulling — image "cat:hungry-latest"`,
        ],
      },
      "sre-sanity-canary": {
        status: "Running",
        reason: "sustentado por café e teimosia",
        events: [
          "Started — contêiner iniciado",
          "Warning — nível de ansiedade se aproximando do crítico",
        ],
      },
      "deploy-friday-afternoon": {
        status: "Evicted",
        reason: "pressão no nó: é sexta, 17h58",
        events: ["Evicted — o nó decidiu que já deu por hoje"],
      },
    },
  },

  terraform: {
    usage: "uso: terraform &lt;subcomando&gt;",
    subcommands: `subcomandos disponíveis: <span class="glow">apply</span>, <span class="glow">destroy</span>`,
    unknown: `terraform: subcomando desconhecido "{cmd}"`,
    willPerform: `<span class="dim">O Terraform vai executar as seguintes ações:</span>`,
    destroyWeekend: `<span class="amber">Isto vai destruir o seu fim de semana. Só 'yes' será aceito para aprovar.</span>`,
    applyTimedOut: `<span class="dim">Enter a value: (tempo esgotado) — apply cancelado.</span>`,
    acquiringLock: `<span class="dim">Adquirindo lock do state (isso pode levar alguns instantes)...</span>`,
    willDestroy: `<span class="dim">O Terraform vai destruir:</span>`,
    plan: `<span class="amber">Plan: 0 to add, 0 to change, {n} to destroy.</span>`,
    reallyDestroy: `Você realmente quer destruir todos os recursos? Só 'yes' será aceito para aprovar.`,
    answeredForYou: `<span class="dim">Enter a value: <span class="glow">yes</span> (o terminal respondeu por você)</span>`,
    destroyComplete: `<span class="amber">Destroy complete! Resources: {n} destroyed.</span>`,
    ripWeekend: `<span class="dim">(descanse em paz, fim de semana.)</span>`,
  },

  ssh: {
    usage: "uso: ssh &lt;usuário@host&gt;",
    knownHosts: `<span class="dim"># hosts conhecidos nesta máquina:</span> {hosts}`,
    handshake: [
      "solicitando handshake com {host} ...",
      "ECDSA key fingerprint is SHA256:7hR3s+kn0wYouR3Wo7rth.",
      "Are you sure you want to continue connecting (yes/no)? yes",
      "Warning: Permanently added '{host}' (ECDSA) to the list of known hosts.",
      "autenticando...",
      "acesso concedido.",
    ],
    connected: `conectado a <span class="glow">{host}</span>.`,
    closing: "encerrando conexão com {host}...",
    menuPrompt: `Digite um comando para fazer uma pergunta, ou "exit" para desconectar:`,
    topics: "tópicos:",
    askAnother: `<span class="dim">faça outra pergunta, ou digite "exit"</span>`,
    unrecognized: `comando não reconhecido — disponíveis: {cmds} ou "exit"`,
    failFirst: [
      "ssh: conectando a {host} ...",
      "ssh: connect to host {host} port 22: Connection timed out",
      "ssh: tentando de novo (1/3)...",
      "ssh: tentando de novo (2/3)...",
      "ssh: connection reset by peer",
      `<span class="dim">este host parece não existir. esta sessão também não.</span>`,
    ],
    failPersistent: [
      "ssh: conectando a {host} ...",
      "ssh: connect to host {host} port 22: Connection timed out",
      `<span class="amber">[nota]</span> esta é a tentativa nº {count} num host que não existe`,
      `<span class="amber">[nota]</span> persistência impressionante, sinceramente`,
      "ssh: este host nunca existiu. Eu verifiquei. Duas vezes.",
      `<span class="dim">psiu — tente talvez: <span class="glow">ssh {hint}</span></span>`,
    ],
  },

  claude: {
    version: `<span class="glow">Claude Code v2.1.4</span>`,
    usage: `uso: claude "&lt;prompt&gt;" &nbsp;|&nbsp; claude log --oneline &nbsp;|&nbsp; claude --confess`,
    logCommits: [
      "feat: escondi alguns comandos extras, não contei pra ninguém",
      "fix: cursor estava um pixel à direita na linha vazia",
      "feat: exigir sudo para o jogo, porque sistemas de permissão são muito engraçados",
      "fix: teclado do android embaralhava a primeira letra digitada (de novo)",
      "feat: falhas falsas de ssh, com quebra da quarta parede",
      "revert: o usuário pediu com menos educação desta vez :(",
    ],
    logFooter: `<span class="dim">este site tem um histórico de commits comigo mais longo que a maioria dos meus relacionamentos de verdade</span>`,
    confess: "sim — este terminal foi feito pedindo a uma IA (oi, sou eu).",
    lightTheme1: [
      "Vou dar uma olhada na configuração atual de temas.",
      "Achei — este site não tem tema claro. Nunca teve. Nunca terá.",
      "Eu poderia adicionar um, mas preciso avisar que pode chatear o gato.",
      "Marcando como won't-fix. Mais alguma coisa?",
    ],
    lightTheme2: [
      "Tá bom, você é persistente. Vou construir de verdade desta vez.",
      "Nenhum tema claro por aqui. Acho que vou ter que escrever um.",
      "Esboçando uma paleta clara... algo no espírito do Ayu Light.",
      "Ligando tudo e dando um nome que ninguém vai adivinhar.",
      "Entregue. O gato foi informado e está registrando uma reclamação.",
      "Construir era comigo — virar a chave é com você: theme {theme}.",
      "Tirando o won't-fix. Mais alguma coisa?",
    ],
    lightTheme3: [
      "Já passamos por isso.",
      "O ticket está fechado. Não há mais nada a construir — é só digitar theme {theme}.",
    ],
    fixBug: ["Não há bug. Nunca houve bug. Eu verifiquei. Duas vezes."],
    addTests: [
      "Encontrei 0 testes. Isso é ou muito preocupante ou uma decisão de design ousada.",
      `Vou ficar com "decisão de design ousada" e seguir em frente.`,
    ],
    generic: [
      "Entendido. Trabalhando nisso agora.",
      "Na verdade, isso pode demorar mais que o esperado. Adicionando à lista.",
      "(a lista é longa. a lista é sempre longa.)",
    ],
  },

  free: {
    swapNote: `<span class="dim">swap: basicamente cheio, como tudo o mais</span>`,
  },

  who: {
    yourBrowser: "seu navegador",
    stillFixing: "ainda consertando a prod",
  },
  files: {
    game: [
      "#!/bin/bash",
      "# {script} — não leia, só execute",
      '# veja também: <a href="{url}" target="_blank" rel="noopener">{url}</a>',
      "# nota: você vai precisar de sudo",
      'echo "abrindo uma pequena surpresa..."',
      "xdg-open {url} 2&gt;/dev/null",
    ],
  },

  notFound: {
    message: "Arquivo ou diretório inexistente",
    description: "404 — página não encontrada.",
    quip: "Opa! Parece que o gato comeu todo o leite condensado... e esta página também.",
    catAlt:
      "Um gato laranja deitado de costas, cansado, cercado de latas de leite condensado derramadas.",
    back: "voltar ao terminal",
    unknownPage: "pagina-desconhecida",
    switchTo: "Trocar idioma",
    announce: "Idioma alterado para português",
  },

  cv: {
    catHint: `— use <span class="glow">cv</span> para abri-lo`,
    opening: `abrindo <span class="glow">cv.html</span> ...`,
    techPrefix: "// tech:",
    photoAlt: "{name}, {role} — foto de perfil",
    photoAltNoRole: "{name} — foto de perfil",
    print: "imprimir",
    backToTerminal: "voltar ao terminal",
    switchLanguage: "Trocar idioma",
  },
};

export default pt;
