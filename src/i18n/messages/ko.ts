import type { Messages } from "./en.ts";

/**
 * Korean messages. Typed as `Messages`, so a missing key is a build error.
 *
 * Ships in the repo but is **not selected** by profile.config.ts: a fork
 * switches the site to Korean by adding one import to `MESSAGES`, and an
 * unselected catalogue costs the bundle nothing. `tsc` still checks it, so
 * it cannot drift out of shape when `en.ts` gains a key.
 *
 * JetBrains Mono has no CJK glyphs, so these strings render in the
 * visitor's system monospace font. Readable everywhere; a different face
 * from the Latin UI. The ASCII art is unaffected.
 */
const ko: Messages = {
  ui: {
    welcome: "제 장난감 터미널에 오신 걸 환영합니다. 'help'를 입력하면 무엇이 있는지 볼 수 있어요.",
    welcomeWhisper: "(속닥 — 'help'는 겸손한 편이에요. 조금 더 파보세요.)",
    availableCommands: "사용 가능한 명령어:",
    notFound: `명령어를 찾을 수 없음: <span class="accent">{cmd}</span>`,
    notFoundHint: `<span class="dim">이건 JavaScript로 얼기설기 만든 장난감 터미널이지 진짜 셸이 아닙니다. <span class="glow">help</span>로 무엇이 있는지 확인해 보세요</span>`,
    loggingOut: "로그아웃 중...",
    connClosed: "{host}와의 연결이 닫혔습니다.",
    footerHint: `<span class="accent">help</span>를 입력해 둘러보세요`,
    pageTitle: "터미널",
    inputLabel: "터미널 명령어 입력",
    outputLabel: "터미널 출력",
  },

  boot: {
    lines: [
      "{host} 부팅 시퀀스 — 커널 6.6.0-sre",
      "[  OK  ] 모듈 로드됨: years_of_uptime.ko",
      `<span class="rm-line">[FAILED] /dev/motivation 마운트: 찾을 수 없음</span>`,
      "[  OK  ] 대신 /dev/coffee 마운트됨",
      "[  OK  ] ssh-agent.service 시작됨",
      "[  OK  ] kubernetes-cluster.service 시작됨",
      `<span class="amber">[ WARN ] condensed-milk-reserve.service: 재고 위험 수준 (고양이에게 알림, 반응 없음)</span>`,
      "[  OK  ] ai-assistant.service 시작됨",
      "[  OK  ] recruiter-inbox.service 시작됨 (읽지 않음 1125건)",
      "[  OK  ] 당직 호출기 무음 처리됨 (일단은)",
      "",
      "접근 허가 — 환영합니다, {user}",
    ],
  },

  commands: {
    about: "이 사람은 누구",
    skills: "기술 스택",
    contact: "연락 방법",
    cv: "전체 이력서 열기",
    neofetch: "시스템 정보 카드",
    whoami: "당신에 대해 조금 지나치게",
    ls: "파일 목록",
    cat: "파일 출력",
    fortune: "무작위 명언",
    top: "가짜 프로세스 모니터",
    kubectl: "가상의 클러스터 엿보기",
    terraform: "낙관을 적용하고, 전부 파괴하기",
    ssh: "원격 로그인 — 사전 면접을 건너뛰세요 (아니면 또 뭐가 있는지 찾아보세요)",
    claude: "AI 어시스턴트에게 묻기",
    theme: "터미널 색상 변경",
    matrix: "배경 비 켜기/끄기",
    lang: "출력 언어 전환",
    help: "이 목록 표시",
    clear: "화면 지우기",
    history: "실행한 명령어",
  },

  ls: {
    total: "합계 {n}",
  },

  cat: {
    usage: "사용법: cat &lt;파일&gt;",
    noFile: "cat: {file}: 그런 파일이나 디렉터리가 없습니다",
    notText: `cat: {file}: 텍스트 파일이 아닙니다`,
  },

  rm: {
    missingOperand: "rm: 피연산자가 없습니다",
    denied: "rm: '{file}'을(를) 지울 수 없음: 허가 거부",
  },

  exec: {
    denied: "bash: ./{file}: 허가 거부",
    notFound: "bash: ./{file}: 그런 파일이나 디렉터리가 없습니다",
    notExecutable: "bash: ./{file}: 허가 거부",
    launchingGame: `격리된 CRT 창에서 <span class="glow">{title}</span> 실행 중...`,
  },

  theme: {
    set: `테마가 <span class="glow">{name}</span>(으)로 설정됨`,
    usage: "사용법: theme &lt;{names}&gt;",
  },

  matrix: {
    on: "매트릭스 비: 켜짐",
    off: "매트릭스 비: 꺼짐",
    usage: "사용법: matrix &lt;on|off&gt;",
  },

  lang: {
    set: `언어가 <span class="glow">한국어</span>로 전환됨`,
    usage: "사용법: lang &lt;{codes}&gt;",
  },

  sudo: {
    reported: `<span class="amber">이 사건은 보고될 것입니다.</span>`,
    removing: `<span class="rm-line">{path} 삭제 중 ...</span>`,
    justKidding: `<span class="amber">...농담이에요. 그래도 좋은 시도였어요.</span>`,
    noHarm: `<span class="dim">(아무것도 손상되지 않았습니다 — 이건 정적 사이트고, 당신은 진짜 서버가 아니라 브라우저 안에 있어요)</span>`,
  },

  whoami: {
    user: "사용자",
    browser: "브라우저",
    os: "OS",
    tz: "시간대",
    unknownOs: "알 수 없는 OS",
    unknownBrowser: "정체불명의 브라우저",
    unknownTz: "알 수 없는 시간대",
  },

  timeQuips: {
    lateNight: [
      "아직 안 주무세요? 존경하지만 걱정도 됩니다",
      "어딘가는 새벽 3시고, 안타깝게도 여기일지도 몰라요",
      "기계는 잠들지 않고, 보아하니 당신도 그렇네요",
    ],
    earlyMorning: [
      "일찍 일어났거나, 아예 안 잤거나 — 판단하기 어렵네요",
      "극도로 온라인인 얼리버드",
    ],
    morning: ["합리적인 시간대, 아주 책임감 있으시네요", "생산적인 아침 에너지, 존경합니다"],
    midday: ["점심시간 웹서핑, 클래식이죠", "미루기의 황금 시간대"],
    afternoon: ["오후 3시의 슬럼프, 대처 기제로서의 웹서핑", "오후의 에너지, 잘 버티고 있네요"],
    evening: ["저녁 웹서핑, 최고의 시간", "스크롤 황금 시간대, 부끄러워할 것 없어요"],
    night: ["이 시간이면 자고 있어야 할 텐데", "자기 전에 탭 하나만 더, 물론이죠"],
  },

  neofetch: {
    playing: "재생 중",
    offline: "spotify 오프라인",
    idle: "지금 재생 중인 곡 없음",
  },

  fortunes: [
    "언제나 DNS가 문제다.",
    "99.9% 가동률은 연간 8시간 46분의 다운타임 — 오늘 이미 6시간을 썼다.",
    "클라우드는 없다. 그저 남의 Kubernetes 클러스터일 뿐.",
    "금요일 배포의 기세: 높은 위험, 더 높은 후회.",
    "버그는 절대 프로덕션에 없다. (버그는 프로덕션에 있다.)",
    "지켜보는 파이프라인은 끝나지 않는다.",
    "내 컴퓨터에서는 되는데 — 그럼 컴퓨터째로 출시하자.",
    "카오스 엔지니어링: 버그가 아니라 화요일이다.",
    "당직 근무에서 전화가 왔다. 임금 인상을 원한단다.",
    "백업은 치실 같다 — 모두가 중요하다는 데 동의하지만, 안 한 날에 문제가 터진다.",
    "지루한 일을 자동화하고, 그다음 자동화를 자동화하라.",
    "127.0.0.1만 한 곳은 없다.",
    "분산 시스템이란, 들어본 적도 없는 머신이 내 일을 막을 수 있는 시스템이다.",
    "알림 없는 모니터링은 그저 아주 비싼 화면 보호기다.",
    "최고의 런북은 새벽 3시에 아무도 읽을 필요 없는 런북이다.",
    "포스트모템: '인적 오류'가 조용히 '프로세스 공백'으로 바뀌는 곳.",
    "로드 밸런서는 당신의 감정에 관심이 없다.",
    "멱등성: 두 번 실행해도 두 배로 비용이 들면 안 되니까.",
    "모든 '임시' 수정은 동작하는 순간 영구적이 된다.",
    "Kubernetes: 2014년부터 단순한 것을 복잡하게 만드는 중.",
    "그래프는 누군가 확대하기 전까지는 괜찮아 보였다.",
    "코드형 인프라: 이제 오타에도 버전 기록이 남는다.",
    "정말로 삭제되는 것은 없다 — 결국 일관성이 맞춰질 뿐.",
    "롤백 버튼은 파이프라인 전체에서 가장 과소평가된 기능이다.",
    "SLO: 100%보다 살짝 덜 약속하는 기술.",
    "좋은 당직 순환은 눈에 띄지 않는다. 나쁜 순환은 새벽 2시의 단체 채팅이다.",
    "장애는 결코 진짜로 끝나지 않는다 — 아무도 담당하지 않는 Jira 티켓이 될 뿐.",
    "대시보드가 더 필요한 게 아니다. 이미 있는 것을 읽어야 한다.",
  ],

  top: {
    header: ["PID", "CMD", "CPU%", "MEM%", "STATUS"],
    running: "실행 중",
    sleeping: "대기",
    zombie: "좀비",
    quitHint: `<span class="dim"><span class="accent">q</span>를 누르거나 <span class="accent">exit</span>을 입력해 종료</span>`,
    quitHintPlain: `<span class="accent">q</span>를 누르거나 <span class="accent">exit</span>을 입력해 종료`,
    exited: "top을 종료했습니다.",
    promptLabel: "(top — q로 종료)",
    chipQuit: "q — 종료",
  },

  kubectl: {
    header: ["NAME", "READY", "STATUS", "AGE"],
    running: "Running",
    justBarely: "간신히",
    intro: "kubectl은 Kubernetes 클러스터 관리자를 제어합니다.",
    subcommands: `사용 가능한 하위 명령어: <span class="glow">get pods</span>, <span class="glow">describe pod &lt;이름&gt;</span>`,
    describeUsage: "사용법: kubectl describe pod &lt;이름&gt;",
    unknown: `error: unknown command "{cmd}" for "kubectl"`,
    notFound: `Error from server (NotFound): pods "{pod}" not found`,
    reason: "사유",
    events: "이벤트",
    pods: {
      "cat-deployment-7f9d8c-x2m4q": {
        status: "Running",
        reason: "의욕 충만, 연유 캔: 0/30",
        events: [
          "Started — 컨테이너가 11년 전에 시작됨",
          "Normal — 대부분의 프로덕션 서비스보다 안정적",
        ],
      },
      "condensed-milk-store-0": {
        status: "CrashLoopBackOff",
        reason: "OOMKilled (연유를 너무 많이 먹음)",
        events: [
          "Killing — 컨테이너가 당분 한도를 초과함",
          "BackOff — 재시작 지연됨, 컨테이너 회복 중",
          `Pulling — image "cat:hungry-latest"`,
        ],
      },
      "sre-sanity-canary": {
        status: "Running",
        reason: "커피와 고집으로 버티는 중",
        events: ["Started — 컨테이너 시작됨", "Warning — 불안 수준이 임계치에 근접"],
      },
      "deploy-friday-afternoon": {
        status: "Evicted",
        reason: "노드 압박: 금요일 오후 5시 58분",
        events: ["Evicted — 노드가 오늘은 여기까지라고 판단함"],
      },
    },
  },

  terraform: {
    usage: "사용법: terraform &lt;하위 명령어&gt;",
    subcommands: `사용 가능한 하위 명령어: <span class="glow">apply</span>, <span class="glow">destroy</span>`,
    unknown: `terraform: 알 수 없는 하위 명령어 "{cmd}"`,
    willPerform: `<span class="dim">Terraform이 다음 작업을 수행합니다:</span>`,
    destroyWeekend: `<span class="amber">이 작업은 당신의 주말을 파괴합니다. 승인하려면 'yes'만 허용됩니다.</span>`,
    applyTimedOut: `<span class="dim">Enter a value: (시간 초과) — apply 취소됨.</span>`,
    acquiringLock: `<span class="dim">상태 잠금 획득 중 (잠시 걸릴 수 있습니다)...</span>`,
    willDestroy: `<span class="dim">Terraform이 파괴할 항목:</span>`,
    plan: `<span class="amber">Plan: 0 to add, 0 to change, {n} to destroy.</span>`,
    reallyDestroy: `정말 모든 리소스를 파괴하시겠습니까? 승인하려면 'yes'만 허용됩니다.`,
    answeredForYou: `<span class="dim">Enter a value: <span class="glow">yes</span> (터미널이 대신 답했습니다)</span>`,
    destroyComplete: `<span class="amber">Destroy complete! Resources: {n} destroyed.</span>`,
    ripWeekend: `<span class="dim">(주말이여, 편히 잠들라.)</span>`,
  },

  ssh: {
    usage: "사용법: ssh &lt;사용자@호스트&gt;",
    knownHosts: `<span class="dim"># 이 머신에 알려진 호스트:</span> {hosts}`,
    handshake: [
      "{host}에 핸드셰이크 요청 중 ...",
      "ECDSA key fingerprint is SHA256:7hR3s+kn0wYouR3Wo7rth.",
      "Are you sure you want to continue connecting (yes/no)? yes",
      "Warning: Permanently added '{host}' (ECDSA) to the list of known hosts.",
      "인증 중...",
      "접근 허가.",
    ],
    connected: `<span class="glow">{host}</span>에 연결됨.`,
    closing: "{host} 연결 종료 중...",
    menuPrompt: `질문하려면 명령어를 입력하고, 연결을 끊으려면 "exit"을 입력하세요:`,
    topics: "주제:",
    askAnother: `<span class="dim">다른 질문을 하거나 "exit"을 입력하세요</span>`,
    unrecognized: `인식할 수 없는 명령어 — 사용 가능: {cmds} 또는 "exit"`,
    failFirst: [
      "ssh: {host}에 연결 중 ...",
      "ssh: connect to host {host} port 22: Connection timed out",
      "ssh: 재시도 중 (1/3)...",
      "ssh: 재시도 중 (2/3)...",
      "ssh: connection reset by peer",
      `<span class="dim">이 호스트는 존재하지 않는 것 같습니다. 이 세션도 마찬가지고요.</span>`,
    ],
    failPersistent: [
      "ssh: {host}에 연결 중 ...",
      "ssh: connect to host {host} port 22: Connection timed out",
      `<span class="amber">[참고]</span> 존재하지 않는 호스트에 대한 {count}번째 시도입니다`,
      `<span class="amber">[참고]</span> 솔직히 인상적인 끈기네요`,
      "ssh: 이 호스트는 존재한 적이 없습니다. 확인했어요. 두 번이나.",
      `<span class="dim">속닥 — 이걸 시도해 보세요: <span class="glow">ssh {hint}</span></span>`,
    ],
  },

  claude: {
    version: `<span class="glow">Claude Code v2.1.4</span>`,
    usage: `사용법: claude "&lt;프롬프트&gt;" &nbsp;|&nbsp; claude log --oneline &nbsp;|&nbsp; claude --confess`,
    logCommits: [
      "feat: 명령어 몇 개를 숨겼는데, 아무에게도 말 안 함",
      "fix: 빈 줄에서 커서가 오른쪽으로 1픽셀 밀려 있었음",
      "feat: 게임에 sudo 관문 추가, 권한 시스템은 정말 웃기니까",
      "fix: 안드로이드 키보드가 첫 글자를 뒤섞음 (또)",
      "feat: 가짜 ssh 실패, 제4의 벽 깨기 포함",
      "revert: 이번엔 사용자가 덜 친절하게 요청함 :(",
    ],
    logFooter: `<span class="dim">이 웹사이트는 내 실제 인간관계 대부분보다 나와의 커밋 기록이 더 길다</span>`,
    confess: "네 — 이 터미널은 AI에게 부탁해서 만들었습니다 (안녕, 그게 저예요).",
    lightTheme1: [
      "현재 테마 설정을 살펴보겠습니다.",
      "찾았습니다 — 이 사이트에는 라이트 테마가 없어요. 있었던 적도 없고, 앞으로도 없을 겁니다.",
      "추가할 수는 있지만, 고양이가 언짢아할 수 있다는 점은 짚고 넘어가야겠네요.",
      "won't-fix로 표시합니다. 더 필요한 게 있나요?",
    ],
    lightTheme2: [
      "좋아요, 끈질기시네요. 이번엔 정말로 만들어 보죠.",
      "여기엔 라이트 테마가 없네요. 직접 하나 써야겠습니다.",
      "밝은 팔레트를 스케치하는 중... Ayu Light 느낌으로.",
      "연결하고, 아무도 못 맞힐 이름을 붙입니다.",
      "배포했습니다. 고양이에게 알렸고, 고양이는 항의서를 제출 중입니다.",
      "만드는 건 제 일이었고 — 스위치를 켜는 건 당신 몫입니다: theme {theme}.",
      "won't-fix 표시를 해제합니다. 더 필요한 게 있나요?",
    ],
    lightTheme3: [
      "이 얘기는 이미 했잖아요.",
      "티켓은 완료 처리됐습니다. 더 만들 건 없어요 — theme {theme}만 입력하세요.",
    ],
    fixBug: ["버그는 없습니다. 버그가 있었던 적도 없어요. 확인했습니다. 두 번이나."],
    addTests: [
      "테스트 0개 발견. 매우 걱정스럽거나, 아니면 대담한 설계 결정이거나.",
      `"대담한 설계 결정"으로 하고 넘어가겠습니다.`,
    ],
    generic: [
      "알겠습니다. 바로 작업하겠습니다.",
      "사실 예상보다 오래 걸릴 수 있어요. 목록에 추가합니다.",
      "(목록은 깁니다. 목록은 언제나 길어요.)",
    ],
  },

  free: {
    swapNote: `<span class="dim">swap: 사실상 가득 참, 다른 모든 것처럼</span>`,
  },

  who: {
    yourBrowser: "당신의 브라우저",
    stillFixing: "아직도 프로덕션 고치는 중",
  },
  files: {
    game: [
      "#!/bin/bash",
      "# {script} — 읽지 말고 그냥 실행하세요",
      '# 참고: <a href="{url}" target="_blank" rel="noopener">{url}</a>',
      "# 주의: sudo가 필요합니다",
      'echo "작은 깜짝 선물을 여는 중..."',
      "xdg-open {url} 2&gt;/dev/null",
    ],
  },

  notFound: {
    message: "그런 파일이나 디렉터리가 없습니다",
    description: "404 — 페이지를 찾을 수 없습니다.",
    quip: "이런! 고양이가 연유를 다 먹어 버린 것 같네요... 이 페이지까지도.",
    catAlt: "주황색 고양이가 지친 얼굴로 벌러덩 누워 있고, 주변에 쏟아진 연유 캔들이 널려 있다.",
    back: "터미널로 돌아가기",
    unknownPage: "unknown-page",
    switchTo: "언어 전환",
    announce: "언어가 한국어로 전환됨",
  },

  cv: {
    catHint: `— 대신 <span class="glow">cv</span>로 여세요`,
    opening: `<span class="glow">cv.html</span> 여는 중 ...`,
    techPrefix: "// 기술:",
    photoAlt: "{name}, {role} — 프로필 사진",
    photoAltNoRole: "{name} — 프로필 사진",
    print: "인쇄",
    backToTerminal: "터미널로 돌아가기",
    switchLanguage: "언어 전환",
  },
};

export default ko;
