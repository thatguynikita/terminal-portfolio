import { defineCommand } from "../core/types";
import { systemSince } from "../core/describe";

const pad = (n: number): string => String(n).padStart(2, "0");

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** The build stamp in `uname -a`: `Sun Aug 9 17:48:27 UTC 2026`, in UTC as uname prints it. */
export function unameStamp(since: Date): string {
  const time = `${pad(since.getUTCHours())}:${pad(since.getUTCMinutes())}:${pad(since.getUTCSeconds())}`;
  return `${DAYS[since.getUTCDay()]} ${MONTHS[since.getUTCMonth()]} ${since.getUTCDate()} ${time} UTC ${since.getUTCFullYear()}`;
}

/** The mtime column in `ls -l`: `Aug  9 20:48`, day space-padded, local time as ls shows it. */
export function lsStamp(since: Date): string {
  const day = String(since.getDate()).padStart(2, " ");
  return `${MONTHS[since.getMonth()]} ${day} ${pad(since.getHours())}:${pad(since.getMinutes())}`;
}

/** `uptime`'s line, counting from `since` so the number is always plausible. */
export function uptimeLine(since: Date, users = 1): string {
  const now = new Date();
  const totalMinutes = Math.floor(Math.max(0, now.getTime() - since.getTime()) / 60000);
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;
  const time = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  const up = days > 0 ? `${days} day${days === 1 ? "" : "s"}, ${hours}:${pad(minutes)}` : `${hours}:${pad(minutes)}`;
  const load = (): string => (Math.random() * 1.4 + 0.05).toFixed(2);
  return ` ${time} up ${up},  ${users} user${users === 1 ? "" : "s"},  load average: ${load()}, ${load()}, ${load()}`;
}

export function nowDateTime(): string {
  const now = new Date();
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

export default defineCommand({
  name: "uptime",
  hidden: true,
  run(ctx) {
    ctx.printText(uptimeLine(systemSince(ctx.profile)));
  },
});
