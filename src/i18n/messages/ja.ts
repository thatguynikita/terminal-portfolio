import type { Messages } from "./en";

/**
 * Japanese messages. Typed as `Messages`, so a missing key is a build error.
 *
 * Ships in the repo but is **not selected** by profile.config.ts: a fork
 * switches the site to Japanese by adding one import to `MESSAGES`, and an
 * unselected catalogue costs the bundle nothing. `tsc` still checks it, so
 * it cannot drift out of shape when `en.ts` gains a key.
 *
 * JetBrains Mono has no CJK glyphs, so these strings render in the
 * visitor's system monospace font. Readable everywhere; a different face
 * from the Latin UI. The ASCII art is unaffected.
 */
const ja: Messages = {
  ui: {
    welcome: "おふざけターミナルへようこそ。'help' と入力すると何ができるか分かります。",
    welcomeWhisper: "（こっそり — 'help' は控えめです。少し掘ってみて。）",
    availableCommands: "使えるコマンド：",
    notFound: `コマンドが見つかりません：<span class="accent">{cmd}</span>`,
    notFoundHint: `<span class="dim">これは JavaScript でつなぎ合わせたおふざけターミナルで、本物のシェルではありません。<span class="glow">help</span> で何があるか見てみてください</span>`,
    loggingOut: "ログアウト中...",
    connClosed: "{host} への接続を閉じました。",
    footerHint: `<span class="accent">help</span> と入力して探索`,
    pageTitle: "ターミナル",
    inputLabel: "ターミナルのコマンド入力",
    outputLabel: "ターミナル出力",
  },

  boot: {
    lines: [
      "{host} 起動シーケンス — カーネル 6.6.0-sre",
      "[  OK  ] モジュールを読み込みました：years_of_uptime.ko",
      `<span class="rm-line">[FAILED] /dev/motivation のマウント：見つかりません</span>`,
      "[  OK  ] 代わりに /dev/coffee をマウントしました",
      "[  OK  ] ssh-agent.service を開始しました",
      "[  OK  ] kubernetes-cluster.service を開始しました",
      `<span class="amber">[ WARN ] condensed-milk-reserve.service：残量が危機的（猫に通知済み、無反応）</span>`,
      "[  OK  ] ai-assistant.service を開始しました",
      "[  OK  ] recruiter-inbox.service を開始しました（未読 1125 件）",
      "[  OK  ] オンコールのポケベルをミュートしました（今のところ）",
      "",
      "アクセス許可 — ようこそ、{user}",
    ],
  },

  commands: {
    about: "この人は誰",
    skills: "技術スタック",
    contact: "連絡手段",
    cv: "履歴書の全文を開く",
    neofetch: "システム情報カード",
    whoami: "あなたのことをちょっと知りすぎ",
    ls: "ファイル一覧",
    cat: "ファイルを表示",
    fortune: "ランダムな格言",
    top: "偽物のプロセスモニター",
    kubectl: "架空のクラスタをのぞく",
    terraform: "楽観を適用し、すべてを破壊する",
    ssh: "リモートログイン — 一次面接をスキップ（他に何があるかも分かる）",
    claude: "AI アシスタントに聞く",
    theme: "ターミナルの配色を変更",
    matrix: "背景の雨を切り替え",
    lang: "表示言語を切り替え",
    help: "この一覧を表示",
    clear: "画面をクリア",
    history: "実行したコマンド",
  },

  ls: {
    total: "合計 {n}",
  },

  cat: {
    usage: "使い方：cat &lt;ファイル&gt;",
    noFile: "cat: {file}: そのようなファイルやディレクトリはありません",
    notText: `cat: {file}: テキストファイルではありません`,
  },

  rm: {
    missingOperand: "rm: オペランドがありません",
    denied: "rm: '{file}' を削除できません: 許可がありません",
  },

  exec: {
    denied: "bash: ./{file}: 許可がありません",
    notFound: "bash: ./{file}: そのようなファイルやディレクトリはありません",
    notExecutable: "bash: ./{file}: 許可がありません",
    launchingGame: `サンドボックスの CRT ウィンドウで <span class="glow">{title}</span> を起動中...`,
  },

  theme: {
    set: `テーマを <span class="glow">{name}</span> に設定しました`,
    usage: "使い方：theme &lt;{names}&gt;",
  },

  matrix: {
    on: "マトリックスの雨：オン",
    off: "マトリックスの雨：オフ",
    usage: "使い方：matrix &lt;on|off&gt;",
  },

  lang: {
    set: `言語を<span class="glow">日本語</span>に切り替えました`,
    usage: "使い方：lang &lt;{codes}&gt;",
  },

  sudo: {
    reported: `<span class="amber">この件は報告されます。</span>`,
    removing: `<span class="rm-line">{path} を削除中 ...</span>`,
    justKidding: `<span class="amber">...冗談です。惜しかったですね。</span>`,
    noHarm: `<span class="dim">（何も壊れていません — これは静的サイトで、あなたはブラウザの中にいます。本物のサーバーではありません）</span>`,
  },

  whoami: {
    user: "ユーザー",
    browser: "ブラウザ",
    os: "OS",
    tz: "タイムゾーン",
    unknownOs: "不明な OS",
    unknownBrowser: "謎のブラウザ",
    unknownTz: "不明なタイムゾーン",
  },

  timeQuips: {
    lateNight: [
      "まだ起きてる？尊敬するけど、ちょっと心配",
      "どこかは午前3時。残念ながらここかもしれない",
      "機械は眠らないし、どうやらあなたも眠らない",
    ],
    earlyMorning: [
      "早起きか、まだ寝てないか — 判断が難しい",
      "極端にオンラインな早起き鳥",
    ],
    morning: [
      "まともな時間帯、とても真面目ですね",
      "生産的な朝のエネルギー、尊敬します",
    ],
    midday: ["昼休みのネットサーフィン、定番", "先延ばしのゴールデンタイム"],
    afternoon: [
      "午後3時の眠気、ブラウジングで対処中",
      "午後のエネルギー、まだ持ってる",
    ],
    evening: ["夜のブラウジング、いい時間", "スクロールのゴールデンタイム、恥じることはない"],
    night: ["もう寝ている時間では", "寝る前にもう1タブだけ、ですよね"],
  },

  neofetch: {
    playing: "再生中",
    offline: "spotify オフライン",
    idle: "今は何も再生していません",
  },

  fortunes: [
    "いつだって DNS が原因。",
    "稼働率 99.9% は年間 8 時間 46 分のダウンタイム — 今日だけでもう 6 時間使った。",
    "クラウドなど存在しない。誰かの Kubernetes クラスタがあるだけ。",
    "金曜デプロイの勢い：リスクは高く、後悔はもっと高い。",
    "バグは本番にはない。（バグは本番にある。）",
    "見つめているパイプラインは終わらない。",
    "自分のマシンでは動く — じゃあマシンごと出荷しよう。",
    "カオスエンジニアリング：バグじゃない、火曜日だ。",
    "オンコール当番から電話です。昇給を求めています。",
    "バックアップはデンタルフロスのようなもの — 大事だとみんな同意するのに、やらなかった日に限って痛い目を見る。",
    "退屈な作業を自動化して、次にその自動化を自動化する。",
    "127.0.0.1 に勝る場所はない。",
    "分散システムとは、聞いたこともないマシンのせいで自分の仕事が止まる仕組みのこと。",
    "アラートのない監視は、ただの高価なスクリーンセーバー。",
    "最高のランブックは、午前3時に誰も読まずに済むもの。",
    "ポストモーテム：「人為ミス」が静かに「プロセスの隙間」に変わる場所。",
    "ロードバランサーはあなたの気持ちなど気にしない。",
    "冪等性：2回実行しても2倍払わずに済むように。",
    "「一時的」な修正は、動いた瞬間に恒久化する。",
    "Kubernetes：2014 年以来、単純なことを複雑にし続けている。",
    "グラフは誰かがズームするまで問題なさそうに見えた。",
    "Infrastructure as Code：タイポにもバージョン履歴が付く時代。",
    "本当に削除されるものは何もない — 結果整合性があるだけ。",
    "ロールバックボタンは、パイプライン全体で最も過小評価されている機能。",
    "SLO：100% より少しだけ低く約束する技術。",
    "良いオンコール当番は目立たない。悪い当番は午前2時のグループチャット。",
    "インシデントは本当には終わらない — 誰も担当しない Jira チケットになるだけ。",
    "ダッシュボードはもう十分。今あるものを読むべき。",
  ],

  top: {
    header: ["PID", "CMD", "CPU%", "MEM%", "STATUS"],
    running: "実行中",
    sleeping: "スリープ",
    zombie: "ゾンビ",
    quitHint: `<span class="dim"><span class="accent">q</span> を押すか <span class="accent">exit</span> と入力して終了</span>`,
    quitHintPlain: `<span class="accent">q</span> を押すか <span class="accent">exit</span> と入力して終了`,
    exited: "top を終了しました。",
    promptLabel: "（top — q で終了）",
    chipQuit: "q — 終了",
  },

  kubectl: {
    header: ["NAME", "READY", "STATUS", "AGE"],
    running: "Running",
    justBarely: "ぎりぎり",
    intro: "kubectl は Kubernetes クラスタマネージャーを操作します。",
    subcommands: `使えるサブコマンド：<span class="glow">get pods</span>、<span class="glow">describe pod &lt;名前&gt;</span>`,
    describeUsage: "使い方：kubectl describe pod &lt;名前&gt;",
    unknown: `error: unknown command "{cmd}" for "kubectl"`,
    notFound: `Error from server (NotFound): pods "{pod}" not found`,
    reason: "理由",
    events: "イベント",
    pods: {
      "cat-deployment-7f9d8c-x2m4q": {
        status: "Running",
        reason: "やる気満々、練乳缶：0/30",
        events: [
          "Started — コンテナは 11 年前に起動",
          "Normal — 大半の本番サービスより安定",
        ],
      },
      "condensed-milk-store-0": {
        status: "CrashLoopBackOff",
        reason: "OOMKilled（練乳を食べすぎた）",
        events: [
          "Killing — コンテナが糖分制限を超過",
          "BackOff — 再起動を延期、コンテナは回復中",
          `Pulling — image "cat:hungry-latest"`,
        ],
      },
      "sre-sanity-canary": {
        status: "Running",
        reason: "コーヒーと意地で持ちこたえている",
        events: [
          "Started — コンテナ起動",
          "Warning — 不安レベルが臨界に接近",
        ],
      },
      "deploy-friday-afternoon": {
        status: "Evicted",
        reason: "ノード圧迫：金曜 17:58",
        events: ["Evicted — ノードが今日はもう終わりだと判断"],
      },
    },
  },

  terraform: {
    usage: "使い方：terraform &lt;サブコマンド&gt;",
    subcommands: `使えるサブコマンド：<span class="glow">apply</span>、<span class="glow">destroy</span>`,
    unknown: `terraform: 不明なサブコマンド "{cmd}"`,
    willPerform: `<span class="dim">Terraform は以下の操作を実行します：</span>`,
    destroyWeekend: `<span class="amber">これはあなたの週末を破壊します。承認には 'yes' のみ受け付けます。</span>`,
    applyTimedOut: `<span class="dim">Enter a value:（タイムアウト）— apply を中止しました。</span>`,
    acquiringLock: `<span class="dim">state ロックを取得中（少し時間がかかることがあります）...</span>`,
    willDestroy: `<span class="dim">Terraform は以下を破壊します：</span>`,
    plan: `<span class="amber">Plan: 0 to add, 0 to change, {n} to destroy.</span>`,
    reallyDestroy: `本当にすべてのリソースを破壊しますか？承認には 'yes' のみ受け付けます。`,
    answeredForYou: `<span class="dim">Enter a value: <span class="glow">yes</span>（ターミナルが代わりに答えました）</span>`,
    destroyComplete: `<span class="amber">Destroy complete! Resources: {n} destroyed.</span>`,
    ripWeekend: `<span class="dim">（週末よ、安らかに。）</span>`,
  },

  ssh: {
    usage: "使い方：ssh &lt;ユーザー@ホスト&gt;",
    knownHosts: `<span class="dim"># このマシンの既知のホスト：</span> {hosts}`,
    handshake: [
      "{host} にハンドシェイクを要求中 ...",
      "ECDSA key fingerprint is SHA256:7hR3s+kn0wYouR3Wo7rth.",
      "Are you sure you want to continue connecting (yes/no)? yes",
      "Warning: Permanently added '{host}' (ECDSA) to the list of known hosts.",
      "認証中...",
      "アクセス許可。",
    ],
    connected: `<span class="glow">{host}</span> に接続しました。`,
    closing: "{host} への接続を閉じています...",
    menuPrompt: `質問するにはコマンドを入力、切断するには "exit" と入力：`,
    topics: "トピック：",
    askAnother: `<span class="dim">別の質問をするか、"exit" と入力</span>`,
    unrecognized: `認識できないコマンド — 使えるのは：{cmds} または "exit"`,
    failFirst: [
      "ssh: {host} に接続中 ...",
      "ssh: connect to host {host} port 22: Connection timed out",
      "ssh: 再試行中 (1/3)...",
      "ssh: 再試行中 (2/3)...",
      "ssh: connection reset by peer",
      `<span class="dim">このホストは存在しないようです。このセッションも。</span>`,
    ],
    failPersistent: [
      "ssh: {host} に接続中 ...",
      "ssh: connect to host {host} port 22: Connection timed out",
      `<span class="amber">[注]</span> 存在しないホストへの {count} 回目の試行です`,
      `<span class="amber">[注]</span> 正直、その粘り強さは見事`,
      "ssh: このホストは一度も存在したことがありません。確認しました。2回。",
      `<span class="dim">こっそり — こちらを試してみては：<span class="glow">ssh {hint}</span></span>`,
    ],
  },

  claude: {
    version: `<span class="glow">Claude Code v2.1.4</span>`,
    usage: `使い方：claude "&lt;プロンプト&gt;" &nbsp;|&nbsp; claude log --oneline &nbsp;|&nbsp; claude --confess`,
    logCommits: [
      "feat: 追加コマンドをいくつか隠した、誰にも言ってない",
      "fix: 空行でカーソルが1ピクセル右にずれていた",
      "feat: ゲームに sudo を必須に、権限システムは面白いので",
      "fix: android のキーボードが最初の1文字を乱していた（また）",
      "feat: 偽の ssh 失敗、第四の壁を破る演出つき",
      "revert: 今回はユーザーの頼み方が優しくなかった :(",
    ],
    logFooter: `<span class="dim">このサイトとのコミット履歴は、私の実際の人間関係の大半より長い</span>`,
    confess: "はい — このターミナルは AI に頼んで作られました（どうも、私です）。",
    lightTheme1: [
      "現在のテーマ設定を確認します。",
      "見つけました — このサイトにライトテーマはありません。かつても、これからも。",
      "追加はできますが、猫が不機嫌になるかもしれないと申し添えておきます。",
      "won't-fix としてマークします。他に何か？",
    ],
    lightTheme2: [
      "分かりました、粘りますね。今回は本当に作ります。",
      "ここにライトテーマはない。書くしかないようです。",
      "明るいパレットを描いています... Ayu Light の雰囲気で。",
      "配線して、誰にも当てられない名前を付けます。",
      "出荷しました。猫には通知済みで、苦情を提出しています。",
      "作るのは私の仕事 — スイッチを入れるのはあなたの仕事：theme {theme}。",
      "won't-fix を解除しました。他に何か？",
    ],
    lightTheme3: [
      "その話はもう済みました。",
      "チケットは完了です。作るものはもうありません — theme {theme} と入力するだけ。",
    ],
    fixBug: ["バグはありません。バグがあったことは一度もありません。確認しました。2回。"],
    addTests: [
      "テストが 0 件見つかりました。非常に心配か、大胆な設計判断かのどちらかです。",
      `「大胆な設計判断」ということにして先に進みます。`,
    ],
    generic: [
      "了解。今取りかかります。",
      "実は、思ったより時間がかかりそうです。リストに追加します。",
      "（リストは長い。リストはいつも長い。）",
    ],
  },

  free: {
    swapNote: `<span class="dim">swap：ほぼ満杯、他のすべてと同じく</span>`,
  },

  who: {
    yourBrowser: "あなたのブラウザ",
    stillFixing: "まだ本番を直している",
  },
  files: {
    game: [
      "#!/bin/bash",
      "# {script} — 読まずに、実行して",
      "# 関連：<a href=\"{url}\" target=\"_blank\" rel=\"noopener\">{url}</a>",
      "# 注：sudo が必要です",
      'echo "ちょっとしたサプライズを開いています..."',
      "xdg-open {url} 2&gt;/dev/null",
    ],
  },

  notFound: {
    message: "そのようなファイルやディレクトリはありません",
    description: "404 — ページが見つかりません。",
    quip: "おっと！猫が練乳を全部食べてしまったようです... このページまで。",
    catAlt: "仰向けに寝転がった疲れた顔のオレンジ色の猫。周りにはこぼれた練乳の缶。",
    back: "ターミナルに戻る",
    unknownPage: "unknown-page",
    switchTo: "言語を切り替え",
    announce: "言語を日本語に切り替えました",
  },

  cv: {
    catHint: `— 代わりに <span class="glow">cv</span> で開いてください`,
    opening: `<span class="glow">cv.html</span> を開いています ...`,
    techPrefix: "// 技術：",
    photoAlt: "{name}、{role} — ポートレート写真",
    photoAltNoRole: "{name} — ポートレート写真",
    print: "印刷",
    backToTerminal: "ターミナルに戻る",
    switchLanguage: "言語を切り替え",
  },

};

export default ja;
