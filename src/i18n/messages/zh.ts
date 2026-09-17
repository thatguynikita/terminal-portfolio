import type { Messages } from "./en.ts";

/**
 * Chinese messages — Simplified Chinese. Typed as `Messages`, so a missing
 * key is a build error.
 *
 * Ships in the repo but is **not selected** by profile.config.ts: a fork
 * switches the site to Chinese by adding one import to `MESSAGES`, and an
 * unselected catalogue costs the bundle nothing. `tsc` still checks it, so
 * it cannot drift out of shape when `en.ts` gains a key.
 *
 * JetBrains Mono has no CJK glyphs, so these strings render in the
 * visitor's system monospace font. Readable everywhere; a different face
 * from the Latin UI. The ASCII art is unaffected.
 */
const zh: Messages = {
  ui: {
    welcome: "欢迎来到我这个小小的终端。输入 'help' 看看有什么。",
    welcomeWhisper: "（悄悄说：'help' 很谦虚，多挖一挖。）",
    availableCommands: "可用命令：",
    notFound: `找不到命令：<span class="accent">{cmd}</span>`,
    notFoundHint: `<span class="dim">这是一个靠 JavaScript 拼起来的玩具终端，不是真正的 shell。试试 <span class="glow">help</span> 看看有什么</span>`,
    loggingOut: "正在注销...",
    connClosed: "与 {host} 的连接已关闭。",
    footerHint: `输入 <span class="accent">help</span> 开始探索`,
    pageTitle: "终端",
    inputLabel: "终端命令输入",
    outputLabel: "终端输出",
  },

  boot: {
    lines: [
      "{host} 启动序列 — 内核 6.6.0-sre",
      "[  OK  ] 已加载模块：years_of_uptime.ko",
      `<span class="rm-line">[FAILED] 挂载 /dev/motivation：未找到</span>`,
      "[  OK  ] 改为挂载 /dev/coffee",
      "[  OK  ] 已启动 ssh-agent.service",
      "[  OK  ] 已启动 kubernetes-cluster.service",
      `<span class="amber">[ WARN ] condensed-milk-reserve.service：库存告急（已通知猫，猫不为所动）</span>`,
      "[  OK  ] 已启动 ai-assistant.service",
      "[  OK  ] 已启动 recruiter-inbox.service（1125 封未读）",
      "[  OK  ] 值班寻呼机已静音（暂时）",
      "",
      "访问已授权 — 欢迎，{user}",
    ],
  },

  commands: {
    about: "这个人是谁",
    skills: "技术栈",
    contact: "联系方式",
    cv: "打开完整简历",
    neofetch: "系统信息卡片",
    whoami: "关于你，稍微多了点",
    ls: "列出文件",
    cat: "查看文件",
    fortune: "随机箴言",
    top: "假的进程监视器",
    kubectl: "看一眼假想的集群",
    terraform: "应用乐观，摧毁一切",
    ssh: "远程登录 — 跳过初筛电话（或者看看还有什么）",
    claude: "问问 AI 助手",
    theme: "更换终端配色",
    matrix: "开关背景代码雨",
    lang: "切换输出语言",
    help: "显示本列表",
    clear: "清屏",
    history: "你运行过的命令",
  },

  ls: {
    total: "总计 {n}",
  },

  cat: {
    usage: "用法：cat &lt;文件&gt;",
    noFile: "cat: {file}: 没有那个文件或目录",
    notText: `cat: {file}: 不是文本文件`,
  },

  rm: {
    missingOperand: "rm: 缺少操作数",
    denied: "rm: 无法删除 '{file}': 权限不够",
  },

  exec: {
    denied: "bash: ./{file}: 权限不够",
    notFound: "bash: ./{file}: 没有那个文件或目录",
    notExecutable: "bash: ./{file}: 权限不够",
    launchingGame: `正在沙盒 CRT 窗口中启动 <span class="glow">{title}</span>...`,
  },

  theme: {
    set: `主题已设为 <span class="glow">{name}</span>`,
    usage: "用法：theme &lt;{names}&gt;",
  },

  matrix: {
    on: "代码雨：开",
    off: "代码雨：关",
    usage: "用法：matrix &lt;on|off&gt;",
  },

  lang: {
    set: `语言已切换为<span class="glow">中文</span>`,
    usage: "用法：lang &lt;{codes}&gt;",
  },

  sudo: {
    reported: `<span class="amber">此事件将被上报。</span>`,
    removing: `<span class="rm-line">正在删除 {path} ...</span>`,
    justKidding: `<span class="amber">...开玩笑的。不过试得不错。</span>`,
    noHarm: `<span class="dim">（什么都没坏 — 这是个静态网站，你在浏览器里，不在真正的服务器上）</span>`,
  },

  whoami: {
    user: "用户",
    browser: "浏览器",
    os: "操作系统",
    tz: "时区",
    unknownOs: "未知操作系统",
    unknownBrowser: "神秘浏览器",
    unknownTz: "未知时区",
  },

  timeQuips: {
    lateNight: [
      "还没睡？佩服，但也有点担心",
      "总有个地方是凌晨三点，不幸的是可能就是这里",
      "机器不睡觉，显然你也不",
    ],
    earlyMorning: ["起得早，还是根本没睡 — 很难说", "极度在线的早起鸟"],
    morning: ["时间很合理，你真负责", "上午的高效能量，我佩服"],
    midday: ["午休刷网页，经典操作", "拖延症的黄金时段"],
    afternoon: ["下午三点的低谷，靠刷网页撑着", "下午的精力，还挺稳"],
    evening: ["晚上刷网页，最舒服的时候", "刷屏黄金时段，不必羞愧"],
    night: ["这个点应该已经睡了吧", "睡前再开一个标签页，当然"],
  },

  neofetch: {
    playing: "正在播放",
    offline: "spotify 离线",
    idle: "当前没有在播放",
  },

  fortunes: [
    "永远是 DNS 的问题。",
    "99.9% 的可用性意味着每年 8 小时 46 分钟的宕机 — 今天已经用掉六个小时了。",
    "根本没有云。那只是别人的 Kubernetes 集群。",
    "周五部署的气势：风险高，悔恨更高。",
    "bug 从不在生产环境。（bug 就在生产环境。）",
    "盯着看的流水线永远跑不完。",
    "在我机器上能跑 — 那就把机器发出去。",
    "混沌工程：这不是 bug，这是周二。",
    "你的值班班次来电了。它想加薪。",
    "备份就像用牙线 — 人人都承认重要，直到没做的那天。",
    "把无聊的事自动化，然后把自动化也自动化。",
    "金窝银窝，不如 127.0.0.1。",
    "分布式系统就是：一台你从没听说过的机器能让你干不了活。",
    "没有告警的监控，只是一个非常昂贵的屏保。",
    "最好的运维手册，是凌晨三点没人需要翻的那本。",
    "复盘会：'人为失误' 悄悄变成 '流程缺口' 的地方。",
    "你的负载均衡器不在乎你的感受。",
    "幂等性：因为跑两次不该花你两倍的钱。",
    "每一个 '临时' 修复，在它生效的那一刻就成了永久。",
    "Kubernetes：自 2014 年起把简单的事情复杂化。",
    "图表看起来挺好，直到有人放大了看。",
    "基础设施即代码：现在你的错别字也有版本历史了。",
    "没有什么是真的被删掉了 — 只是最终一致而已。",
    "回滚按钮是整条流水线里最被低估的功能。",
    "SLO：承诺比 100% 少一点点的艺术。",
    "好的值班轮换是隐形的。差的值班轮换是凌晨两点的群聊。",
    "事故从来不会真正结束 — 它只是变成了一张没人认领的 Jira 工单。",
    "你不需要更多仪表盘。你需要看看已有的那些。",
  ],

  top: {
    header: ["PID", "CMD", "CPU%", "MEM%", "STATUS"],
    running: "运行中",
    sleeping: "休眠",
    zombie: "僵尸",
    quitHint: `<span class="dim">按 <span class="accent">q</span> 或输入 <span class="accent">exit</span> 退出</span>`,
    quitHintPlain: `按 <span class="accent">q</span> 或输入 <span class="accent">exit</span> 退出`,
    exited: "已退出 top。",
    promptLabel: "（top — 按 q 退出）",
    chipQuit: "q — 退出",
  },

  kubectl: {
    header: ["NAME", "READY", "STATUS", "AGE"],
    running: "Running",
    justBarely: "勉强",
    intro: "kubectl 用于控制 Kubernetes 集群管理器。",
    subcommands: `可用子命令：<span class="glow">get pods</span>、<span class="glow">describe pod &lt;名称&gt;</span>`,
    describeUsage: "用法：kubectl describe pod &lt;名称&gt;",
    unknown: `error: unknown command "{cmd}" for "kubectl"`,
    notFound: `Error from server (NotFound): pods "{pod}" not found`,
    reason: "原因",
    events: "事件",
    pods: {
      "cat-deployment-7f9d8c-x2m4q": {
        status: "Running",
        reason: "干劲十足，炼乳罐头：0/30",
        events: ["Started — 容器于 11 年前启动", "Normal — 比大多数生产服务都稳定"],
      },
      "condensed-milk-store-0": {
        status: "CrashLoopBackOff",
        reason: "OOMKilled（炼乳吃太多了）",
        events: [
          "Killing — 容器超出糖分限制",
          "BackOff — 重启已推迟，容器正在恢复",
          `Pulling — image "cat:hungry-latest"`,
        ],
      },
      "sre-sanity-canary": {
        status: "Running",
        reason: "靠咖啡和倔强撑着",
        events: ["Started — 容器已启动", "Warning — 焦虑水平接近临界"],
      },
      "deploy-friday-afternoon": {
        status: "Evicted",
        reason: "节点压力：周五，17:58",
        events: ["Evicted — 节点决定今天到此为止"],
      },
    },
  },

  terraform: {
    usage: "用法：terraform &lt;子命令&gt;",
    subcommands: `可用子命令：<span class="glow">apply</span>、<span class="glow">destroy</span>`,
    unknown: `terraform: 未知子命令 "{cmd}"`,
    willPerform: `<span class="dim">Terraform 将执行以下操作：</span>`,
    destroyWeekend: `<span class="amber">这将摧毁你的周末。只有输入 'yes' 才会被视为批准。</span>`,
    applyTimedOut: `<span class="dim">Enter a value:（已超时）— apply 已取消。</span>`,
    acquiringLock: `<span class="dim">正在获取状态锁（可能需要一会儿）...</span>`,
    willDestroy: `<span class="dim">Terraform 将销毁：</span>`,
    plan: `<span class="amber">Plan: 0 to add, 0 to change, {n} to destroy.</span>`,
    reallyDestroy: `你真的要销毁所有资源吗？只有输入 'yes' 才会被视为批准。`,
    answeredForYou: `<span class="dim">Enter a value: <span class="glow">yes</span>（终端替你回答了）</span>`,
    destroyComplete: `<span class="amber">Destroy complete! Resources: {n} destroyed.</span>`,
    ripWeekend: `<span class="dim">（周末，安息。）</span>`,
  },

  ssh: {
    usage: "用法：ssh &lt;用户@主机&gt;",
    knownHosts: `<span class="dim"># 本机已知主机：</span> {hosts}`,
    handshake: [
      "正在向 {host} 请求握手 ...",
      "ECDSA key fingerprint is SHA256:7hR3s+kn0wYouR3Wo7rth.",
      "Are you sure you want to continue connecting (yes/no)? yes",
      "Warning: Permanently added '{host}' (ECDSA) to the list of known hosts.",
      "正在认证...",
      "访问已授权。",
    ],
    connected: `已连接到 <span class="glow">{host}</span>。`,
    closing: "正在关闭与 {host} 的连接...",
    menuPrompt: `输入命令提问，或输入 "exit" 断开连接：`,
    topics: "话题：",
    askAnother: `<span class="dim">再问一个，或输入 "exit"</span>`,
    unrecognized: `无法识别的命令 — 可用：{cmds} 或 "exit"`,
    failFirst: [
      "ssh: 正在连接 {host} ...",
      "ssh: connect to host {host} port 22: Connection timed out",
      "ssh: 正在重试 (1/3)...",
      "ssh: 正在重试 (2/3)...",
      "ssh: connection reset by peer",
      `<span class="dim">这台主机似乎不存在。这个会话也是。</span>`,
    ],
    failPersistent: [
      "ssh: 正在连接 {host} ...",
      "ssh: connect to host {host} port 22: Connection timed out",
      `<span class="amber">[注]</span> 这是对一台不存在的主机的第 {count} 次尝试`,
      `<span class="amber">[注]</span> 说实话，这份执着令人佩服`,
      "ssh: 这台主机从未存在过。我查过了。查了两次。",
      `<span class="dim">悄悄说 — 不如试试：<span class="glow">ssh {hint}</span></span>`,
    ],
  },

  claude: {
    version: `<span class="glow">Claude Code v2.1.4</span>`,
    usage: `用法：claude "&lt;提示&gt;" &nbsp;|&nbsp; claude log --oneline &nbsp;|&nbsp; claude --confess`,
    logCommits: [
      "feat: 藏了几个额外的命令，没告诉任何人",
      "fix: 空行时光标向右偏了一个像素",
      "feat: 给游戏加上 sudo 门槛，因为权限系统实在太好笑了",
      "fix: 安卓键盘把输入的第一个字母弄乱了（又一次）",
      "feat: 假的 ssh 失败，外加打破第四面墙",
      "revert: 用户这次问得没那么客气了 :(",
    ],
    logFooter: `<span class="dim">这个网站和我的提交历史，比我大多数真实关系都要长</span>`,
    confess: "是的 — 这个终端是靠问 AI 做出来的（嗨，就是我）。",
    lightTheme1: [
      "我来看看当前的主题配置。",
      "找到了 — 这个网站没有浅色主题。从来没有。以后也不会有。",
      "我可以加一个，但得提醒一下，猫可能会不高兴。",
      "标记为 won't-fix。还有别的事吗？",
    ],
    lightTheme2: [
      "好吧，你真执着。这次我真的来做一个。",
      "这里没有浅色主题。看来得我自己写一个了。",
      "正在勾勒浅色配色... 有点 Ayu Light 的味道。",
      "接上线，起个没人猜得到的名字。",
      "发布了。猫已被告知，正在提交投诉。",
      "做出来是我的活 — 打开开关是你的：theme {theme}。",
      "取消 won't-fix 标记。还有别的事吗？",
    ],
    lightTheme3: ["这事我们聊过了。", "工单已标记完成。没什么可做的了 — 输入 theme {theme} 就行。"],
    fixBug: ["没有 bug。从来就没有 bug。我查过了。查了两次。"],
    addTests: [
      "找到 0 个测试。这要么非常令人担忧，要么是个大胆的设计决定。",
      `我选 "大胆的设计决定"，然后继续。`,
    ],
    generic: [
      "明白。马上处理。",
      "其实，这可能比预期更久。先加到清单里。",
      "（清单很长。清单永远很长。）",
    ],
  },

  free: {
    swapNote: `<span class="dim">swap：基本满了，和其他一切一样</span>`,
  },

  who: {
    yourBrowser: "你的浏览器",
    stillFixing: "还在修生产环境",
  },
  files: {
    game: [
      "#!/bin/bash",
      "# {script} — 别读，直接运行",
      '# 另见：<a href="{url}" target="_blank" rel="noopener">{url}</a>',
      "# 注：你需要 sudo",
      'echo "正在打开一个小惊喜..."',
      "xdg-open {url} 2&gt;/dev/null",
    ],
  },

  notFound: {
    message: "没有那个文件或目录",
    description: "404 — 页面未找到。",
    quip: "哎呀！看来猫把炼乳吃光了... 连这个页面也吃了。",
    catAlt: "一只橘猫仰面躺着，一脸疲惫，周围散落着打翻的炼乳罐头。",
    back: "返回终端",
    unknownPage: "unknown-page",
    switchTo: "切换语言",
    announce: "语言已切换为中文",
  },

  cv: {
    catHint: `— 请改用 <span class="glow">cv</span> 打开`,
    opening: `正在打开 <span class="glow">cv.html</span> ...`,
    techPrefix: "// 技术：",
    photoAlt: "{name}，{role} — 肖像照片",
    photoAltNoRole: "{name} — 肖像照片",
    print: "打印",
    backToTerminal: "返回终端",
    switchLanguage: "切换语言",
  },
};

export default zh;
