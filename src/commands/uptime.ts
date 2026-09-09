import { defineCommand } from "../core/types";

/** Counts from a fixed point, so the number is always plausible. */
export const UPTIME_SINCE = new Date("2026-08-09T20:48:27+03:00");

const pad = (n: number): string => String(n).padStart(2, "0");

export function uptimeLine(users = 1): string {
  const now = new Date();
  const totalMinutes = Math.floor(Math.max(0, now.getTime() - UPTIME_SINCE.getTime()) / 60000);
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
    ctx.printText(uptimeLine());
  },
});
