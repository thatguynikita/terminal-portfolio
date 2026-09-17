import { pick } from "../core/html.ts";
import { defineCommand } from "../core/types.ts";

/** Hour boundary -> the i18n key holding that bucket's jokes. */
const BUCKETS: Array<[number, string]> = [
  [5, "lateNight"],
  [8, "earlyMorning"],
  [12, "morning"],
  [14, "midday"],
  [18, "afternoon"],
  [22, "evening"],
  [24, "night"],
];

function detectClient(): { browser: string; os: string } | null {
  const ua = navigator.userAgent || "";
  if (!ua) return null;

  let os = "";
  if (/windows/i.test(ua)) os = "Windows";
  else if (/iphone|ipad|ipod/i.test(ua)) os = "iOS";
  else if (/mac os x|macintosh/i.test(ua)) os = "macOS";
  else if (/android/i.test(ua)) os = "Android";
  else if (/cros/i.test(ua)) os = "ChromeOS";
  else if (/linux/i.test(ua)) os = "Linux";

  // Order matters: the in-app iOS browsers all claim Safari too.
  let browser = "";
  if (/crios/i.test(ua)) browser = "Chrome";
  else if (/fxios/i.test(ua)) browser = "Firefox";
  else if (/edg\//i.test(ua)) browser = "Edge";
  else if (/opr\/|opera/i.test(ua)) browser = "Opera";
  else if (/samsungbrowser/i.test(ua)) browser = "Samsung Internet";
  else if (/firefox/i.test(ua)) browser = "Firefox";
  else if (/chrome/i.test(ua)) browser = "Chrome";
  else if (/safari/i.test(ua)) browser = "Safari";

  return { browser, os };
}

export default defineCommand({
  name: "whoami",
  order: 50,
  run(ctx) {
    const client = detectClient();
    const browser = client?.browser || ctx.t("whoami.unknownBrowser");
    const os = client?.os || ctx.t("whoami.unknownOs");

    let tz = ctx.t("whoami.unknownTz");
    try {
      tz = Intl.DateTimeFormat().resolvedOptions().timeZone || tz;
    } catch {
      /* keep the fallback */
    }

    const hour = new Date().getHours();
    const bucket = BUCKETS.find(([max]) => hour < max)?.[1] ?? "night";
    const quip = pick(ctx.tList(`timeQuips.${bucket}`));

    const row = (label: string, value: string): string =>
      `<div><span class="accent">${ctx.escape(label)}:</span> ${value}</div>`;

    ctx.print(
      [
        row(ctx.t("whoami.user"), ctx.escape(ctx.profile.terminal.handle)),
        row(ctx.t("whoami.browser"), ctx.escape(browser)),
        row(ctx.t("whoami.os"), ctx.escape(os)),
        row(
          ctx.t("whoami.tz"),
          `${ctx.escape(tz)} <span class="dim">\u2014 ${ctx.escape(quip)}</span>`,
        ),
      ].join(""),
    );
  },
});
