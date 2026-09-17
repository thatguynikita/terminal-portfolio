import type { Messages } from "./en.ts";

/**
 * French messages. Typed as `Messages`, so a missing key is a build error.
 *
 * Ships in the repo but is **not selected** by profile.config.ts: a fork
 * switches the site to French by adding one import to `MESSAGES`, and an
 * unselected catalogue costs the bundle nothing. `tsc` still checks it, so
 * it cannot drift out of shape when `en.ts` gains a key.
 */
const fr: Messages = {
  ui: {
    welcome: "Bienvenue dans mon petit terminal. Tapez 'help' pour voir ce qu'il propose.",
    welcomeWhisper: "(psst — 'help' reste modeste. fouillez un peu.)",
    availableCommands: "Commandes disponibles :",
    notFound: `commande introuvable : <span class="accent">{cmd}</span>`,
    notFoundHint: `<span class="dim">ceci est un petit terminal tenu ensemble par du JavaScript, pas un vrai shell. essayez <span class="glow">help</span> pour voir ce qu'il y a</span>`,
    loggingOut: "déconnexion...",
    connClosed: "connexion à {host} fermée.",
    footerHint: `tapez <span class="accent">help</span> pour explorer`,
    pageTitle: "terminal",
    inputLabel: "Saisie de commande du terminal",
    outputLabel: "Sortie du terminal",
  },

  boot: {
    lines: [
      "séquence de démarrage de {host} — noyau 6.6.0-sre",
      "[  OK  ] module chargé : years_of_uptime.ko",
      `<span class="rm-line">[FAILED] montage de /dev/motivation : introuvable</span>`,
      "[  OK  ] /dev/coffee monté à la place",
      "[  OK  ] ssh-agent.service démarré",
      "[  OK  ] kubernetes-cluster.service démarré",
      `<span class="amber">[ WARN ] condensed-milk-reserve.service : niveau critique (chat prévenu, pas impressionné)</span>`,
      "[  OK  ] ai-assistant.service démarré",
      "[  OK  ] recruiter-inbox.service démarré (1125 non lus)",
      "[  OK  ] bipeur d'astreinte coupé (pour l'instant)",
      "",
      "accès accordé — bienvenue, {user}",
    ],
  },

  commands: {
    about: "qui est cette personne",
    skills: "stack technique",
    contact: "comment me joindre",
    cv: "ouvrir le CV complet",
    neofetch: "fiche d'infos système",
    whoami: "un peu trop de choses sur vous",
    ls: "lister les fichiers",
    cat: "afficher un fichier",
    fortune: "sagesse aléatoire",
    top: "faux moniteur de processus",
    kubectl: "jeter un œil à un cluster imaginaire",
    terraform: "appliquer l'optimisme, tout détruire",
    ssh: "connexion distante — sautez l'entretien de présélection (ou découvrez ce qu'il y a d'autre)",
    claude: "demander à un assistant IA",
    theme: "changer la couleur du terminal",
    matrix: "activer/désactiver la pluie de fond",
    lang: "changer la langue d'affichage",
    help: "afficher cette liste",
    clear: "effacer l'écran",
    history: "commandes que vous avez lancées",
  },

  ls: {
    total: "total {n}",
  },

  cat: {
    usage: "usage : cat &lt;fichier&gt;",
    noFile: "cat: {file}: Aucun fichier ou dossier de ce type",
    notText: `cat: {file}: pas un fichier texte`,
  },

  rm: {
    missingOperand: "rm: opérande manquant",
    denied: "rm: impossible de supprimer '{file}': Permission non accordée",
  },

  exec: {
    denied: "bash: ./{file}: Permission non accordée",
    notFound: "bash: ./{file}: Aucun fichier ou dossier de ce type",
    notExecutable: "bash: ./{file}: Permission non accordée",
    launchingGame: `lancement de <span class="glow">{title}</span> dans une fenêtre CRT isolée...`,
  },

  theme: {
    set: `thème réglé sur <span class="glow">{name}</span>`,
    usage: "usage : theme &lt;{names}&gt;",
  },

  matrix: {
    on: "pluie matrix : activée",
    off: "pluie matrix : désactivée",
    usage: "usage : matrix &lt;on|off&gt;",
  },

  lang: {
    set: `langue passée en <span class="glow">français</span>`,
    usage: "usage : lang &lt;{codes}&gt;",
  },

  sudo: {
    reported: `<span class="amber">Cet incident sera signalé.</span>`,
    removing: `<span class="rm-line">suppression de {path} ...</span>`,
    justKidding: `<span class="amber">...je plaisante. bien tenté quand même.</span>`,
    noHarm: `<span class="dim">(rien n'a été abîmé — c'est un site statique, vous êtes dans un navigateur, pas sur un vrai serveur)</span>`,
  },

  whoami: {
    user: "Utilisateur",
    browser: "Navigateur",
    os: "OS",
    tz: "Fuseau horaire",
    unknownOs: "un OS inconnu",
    unknownBrowser: "un navigateur mystère",
    unknownTz: "un fuseau horaire inconnu",
  },

  timeQuips: {
    lateNight: [
      "encore debout ? respect, mais c'est aussi inquiétant",
      "il est 3h du matin quelque part, et malheureusement c'est peut-être ici",
      "les machines ne dorment pas, et vous non plus apparemment",
    ],
    earlyMorning: [
      "levé tôt, ou jamais couché — difficile à dire",
      "le lève-tôt extrêmement connecté",
    ],
    morning: [
      "des horaires raisonnables, très responsable de votre part",
      "énergie productive du matin, je respecte",
    ],
    midday: ["navigation de pause déjeuner, un classique", "créneau idéal pour procrastiner"],
    afternoon: [
      "le coup de mou de 15h, la navigation comme mécanisme de défense",
      "énergie de l'après-midi, ça tient bon",
    ],
    evening: ["navigation du soir, le meilleur moment", "heure de pointe du scroll, aucune honte"],
    night: [
      "vous devriez sans doute dormir à cette heure",
      "un dernier onglet avant de dormir, bien sûr",
    ],
  },

  neofetch: {
    playing: "Écoute",
    offline: "spotify hors ligne",
    idle: "rien en lecture pour l'instant",
  },

  fortunes: [
    "C'est toujours le DNS.",
    "99,9 % de disponibilité, c'est 8h46 de panne par an — on en a déjà consommé six aujourd'hui.",
    "Le cloud n'existe pas. C'est juste le cluster Kubernetes de quelqu'un d'autre.",
    "Déploiement du vendredi : risque élevé, regrets plus élevés encore.",
    "Le bug n'est jamais en prod. (Le bug est en prod.)",
    "Un pipeline qu'on regarde ne finit jamais.",
    "Ça marche sur ma machine — on livre la machine.",
    "Chaos engineering : ce n'est pas un bug, c'est un mardi.",
    "Votre astreinte a appelé. Elle veut une augmentation.",
    "Les sauvegardes, c'est comme le fil dentaire — tout le monde est d'accord que c'est important, jusqu'au jour où on ne l'a pas fait.",
    "Automatisez l'ennuyeux, puis automatisez l'automatisation.",
    "Rien ne vaut 127.0.0.1, doux 127.0.0.1.",
    "Un système distribué, c'est quand une machine dont vous n'avez jamais entendu parler peut vous empêcher de travailler.",
    "La supervision sans alertes, c'est juste un économiseur d'écran très cher.",
    "Le meilleur runbook est celui que personne n'a à lire à 3h du matin.",
    "Post-mortems : là où « erreur humaine » devient discrètement « lacune de processus ».",
    "Votre load balancer se fiche de vos sentiments.",
    "Idempotence : parce que lancer deux fois ne devrait pas coûter deux fois.",
    "Chaque correctif « temporaire » devient permanent dès qu'il fonctionne.",
    "Kubernetes : complique les choses simples depuis 2014.",
    "Le graphe avait l'air bien jusqu'à ce que quelqu'un zoome.",
    "Infrastructure as Code : vos fautes de frappe ont désormais un historique de versions.",
    "Rien n'est vraiment supprimé — c'est juste éventuellement cohérent.",
    "Le bouton rollback est la fonctionnalité la plus sous-estimée de tout votre pipeline.",
    "SLO : l'art de promettre un peu moins que 100 %.",
    "Une bonne rotation d'astreinte est invisible. Une mauvaise, c'est une discussion de groupe à 2h du matin.",
    "L'incident n'est jamais vraiment terminé — il devient juste un ticket Jira que personne n'assigne.",
    "Vous n'avez pas besoin de plus de tableaux de bord. Vous avez besoin de lire ceux que vous avez.",
  ],

  top: {
    header: ["PID", "CMD", "CPU%", "MEM%", "STATUS"],
    running: "en cours",
    sleeping: "en veille",
    zombie: "zombie",
    quitHint: `<span class="dim">appuyez sur <span class="accent">q</span> ou tapez <span class="accent">exit</span> pour quitter</span>`,
    quitHintPlain: `appuyez sur <span class="accent">q</span> ou tapez <span class="accent">exit</span> pour quitter`,
    exited: "top fermé.",
    promptLabel: "(top — q pour quitter)",
    chipQuit: "q — quitter",
  },

  kubectl: {
    header: ["NAME", "READY", "STATUS", "AGE"],
    running: "Running",
    justBarely: "de justesse",
    intro: "kubectl contrôle le gestionnaire de cluster Kubernetes.",
    subcommands: `sous-commandes disponibles : <span class="glow">get pods</span>, <span class="glow">describe pod &lt;nom&gt;</span>`,
    describeUsage: "usage : kubectl describe pod &lt;nom&gt;",
    unknown: `error: unknown command "{cmd}" for "kubectl"`,
    notFound: `Error from server (NotFound): pods "{pod}" not found`,
    reason: "Raison",
    events: "Événements",
    pods: {
      "cat-deployment-7f9d8c-x2m4q": {
        status: "Running",
        reason: "pleinement motivé, boîtes de lait concentré : 0/30",
        events: [
          "Started — conteneur démarré il y a 11 ans",
          "Normal — plus stable que la plupart des services en production",
        ],
      },
      "condensed-milk-store-0": {
        status: "CrashLoopBackOff",
        reason: "OOMKilled (a mangé trop de lait concentré)",
        events: [
          "Killing — le conteneur a dépassé sa limite de sucre",
          "BackOff — redémarrage différé, le conteneur récupère",
          `Pulling — image "cat:hungry-latest"`,
        ],
      },
      "sre-sanity-canary": {
        status: "Running",
        reason: "tient grâce au café et à l'entêtement",
        events: ["Started — conteneur démarré", "Warning — niveau d'anxiété proche du critique"],
      },
      "deploy-friday-afternoon": {
        status: "Evicted",
        reason: "pression sur le nœud : on est vendredi, 17h58",
        events: ["Evicted — le nœud a décidé que sa journée était finie"],
      },
    },
  },

  terraform: {
    usage: "usage : terraform &lt;sous-commande&gt;",
    subcommands: `sous-commandes disponibles : <span class="glow">apply</span>, <span class="glow">destroy</span>`,
    unknown: `terraform: sous-commande inconnue "{cmd}"`,
    willPerform: `<span class="dim">Terraform va effectuer les actions suivantes :</span>`,
    destroyWeekend: `<span class="amber">Ceci va détruire votre week-end. Seul 'yes' sera accepté pour approuver.</span>`,
    applyTimedOut: `<span class="dim">Enter a value: (délai dépassé) — apply annulé.</span>`,
    acquiringLock: `<span class="dim">Acquisition du verrou d'état (cela peut prendre un moment)...</span>`,
    willDestroy: `<span class="dim">Terraform va détruire :</span>`,
    plan: `<span class="amber">Plan: 0 to add, 0 to change, {n} to destroy.</span>`,
    reallyDestroy: `Voulez-vous vraiment détruire toutes les ressources ? Seul 'yes' sera accepté pour approuver.`,
    answeredForYou: `<span class="dim">Enter a value: <span class="glow">yes</span> (le terminal a répondu pour vous)</span>`,
    destroyComplete: `<span class="amber">Destroy complete! Resources: {n} destroyed.</span>`,
    ripWeekend: `<span class="dim">(RIP le week-end.)</span>`,
  },

  ssh: {
    usage: "usage : ssh &lt;utilisateur@hôte&gt;",
    knownHosts: `<span class="dim"># hôtes connus sur cette machine :</span> {hosts}`,
    handshake: [
      "demande de handshake avec {host} ...",
      "ECDSA key fingerprint is SHA256:7hR3s+kn0wYouR3Wo7rth.",
      "Are you sure you want to continue connecting (yes/no)? yes",
      "Warning: Permanently added '{host}' (ECDSA) to the list of known hosts.",
      "authentification...",
      "accès accordé.",
    ],
    connected: `connecté à <span class="glow">{host}</span>.`,
    closing: "fermeture de la connexion à {host}...",
    menuPrompt: `Tapez une commande pour poser une question, ou "exit" pour vous déconnecter :`,
    topics: "sujets :",
    askAnother: `<span class="dim">posez une autre question, ou tapez "exit"</span>`,
    unrecognized: `commande non reconnue — disponibles : {cmds} ou "exit"`,
    failFirst: [
      "ssh: connexion à {host} ...",
      "ssh: connect to host {host} port 22: Connection timed out",
      "ssh: nouvelle tentative (1/3)...",
      "ssh: nouvelle tentative (2/3)...",
      "ssh: connection reset by peer",
      `<span class="dim">cet hôte ne semble pas exister. cette session non plus.</span>`,
    ],
    failPersistent: [
      "ssh: connexion à {host} ...",
      "ssh: connect to host {host} port 22: Connection timed out",
      `<span class="amber">[note]</span> c'est la tentative n°{count} vers un hôte qui n'existe pas`,
      `<span class="amber">[note]</span> persévérance impressionnante, franchement`,
      "ssh: cet hôte n'a jamais existé. J'ai vérifié. Deux fois.",
      `<span class="dim">psst — essayez plutôt : <span class="glow">ssh {hint}</span></span>`,
    ],
  },

  claude: {
    version: `<span class="glow">Claude Code v2.1.4</span>`,
    usage: `usage : claude "&lt;prompt&gt;" &nbsp;|&nbsp; claude log --oneline &nbsp;|&nbsp; claude --confess`,
    logCommits: [
      "feat: caché quelques commandes en plus, sans le dire à personne",
      "fix: le curseur était un pixel trop à droite sur une ligne vide",
      "feat: le jeu derrière sudo, parce que les systèmes de permissions sont tellement drôles",
      "fix: le clavier android mélangeait la première lettre tapée (encore)",
      "feat: fausses erreurs ssh, avec rupture du quatrième mur",
      "revert: l'utilisateur a demandé moins gentiment cette fois :(",
    ],
    logFooter: `<span class="dim">ce site a un historique de commits avec moi plus long que la plupart de mes vraies relations</span>`,
    confess: "oui — ce terminal a été construit en demandant à une IA (coucou, c'est moi).",
    lightTheme1: [
      "Je jette un œil à la configuration actuelle des thèmes.",
      "Trouvé — ce site n'a pas de thème clair. Il n'en a jamais eu. Il n'en aura jamais.",
      "Je pourrais en ajouter un, mais je dois signaler que ça risque de contrarier le chat.",
      "Marqué en won't-fix. Autre chose ?",
    ],
    lightTheme2: [
      "Bon, vous insistez. Je le construis pour de vrai cette fois.",
      "Aucun thème clair ici. Je vais devoir en écrire un.",
      "Je dessine une palette claire... dans l'esprit d'Ayu Light.",
      "Je le branche et lui donne un nom que personne ne devinera.",
      "Livré. Le chat a été informé et dépose une réclamation.",
      "Le construire, c'était mon travail — l'activer, c'est le vôtre : theme {theme}.",
      "Won't-fix retiré. Autre chose ?",
    ],
    lightTheme3: [
      "On en a déjà parlé.",
      "Le ticket est fermé. Plus rien à construire — tapez juste theme {theme}.",
    ],
    fixBug: ["Il n'y a pas de bug. Il n'y a jamais eu de bug. J'ai vérifié. Deux fois."],
    addTests: [
      "0 test trouvé. C'est soit très inquiétant, soit un choix de conception audacieux.",
      `Je vais partir sur « choix de conception audacieux » et passer à autre chose.`,
    ],
    generic: [
      "Compris. Je m'en occupe.",
      "En fait, ça pourrait prendre plus de temps que prévu. Je l'ajoute à la liste.",
      "(la liste est longue. la liste est toujours longue.)",
    ],
  },

  free: {
    swapNote: `<span class="dim">swap : pratiquement plein, comme tout le reste</span>`,
  },

  who: {
    yourBrowser: "votre navigateur",
    stillFixing: "toujours en train de réparer la prod",
  },
  files: {
    game: [
      "#!/bin/bash",
      "# {script} — ne le lisez pas, lancez-le",
      '# voir aussi : <a href="{url}" target="_blank" rel="noopener">{url}</a>',
      "# note : il vous faudra sudo",
      'echo "ouverture d\'une petite surprise..."',
      "xdg-open {url} 2&gt;/dev/null",
    ],
  },

  notFound: {
    message: "Aucun fichier ou dossier de ce type",
    description: "404 — page introuvable.",
    quip: "Oups ! On dirait que le chat a mangé tout le lait concentré... et cette page avec.",
    catAlt:
      "Un chat roux couché sur le dos, fatigué, entouré de boîtes de lait concentré renversées.",
    back: "retour au terminal",
    unknownPage: "page-inconnue",
    switchTo: "Changer de langue",
    announce: "Langue passée en français",
  },

  cv: {
    catHint: `— utilisez plutôt <span class="glow">cv</span> pour l'ouvrir`,
    opening: `ouverture de <span class="glow">cv.html</span> ...`,
    techPrefix: "// tech :",
    photoAlt: "{name}, {role} — photo de profil",
    photoAltNoRole: "{name} — photo de profil",
    print: "imprimer",
    backToTerminal: "retour au terminal",
    switchLanguage: "Changer de langue",
  },
};

export default fr;
