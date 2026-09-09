/** `&`, `<`, `>` — the same three the original escaped. */
export function escapeHtml(s: string): string {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** As above, plus `"` — for values going into an HTML attribute. */
export function escapeAttr(s: string): string {
  return escapeHtml(s).replace(/"/g, "&quot;");
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Whether to play typewriter/pacing animations at full speed.
 *
 * Skipped when the visitor asked for reduced motion, and when the tab is
 * hidden — a backgrounded tab has its timers clamped to once a second
 * (once a minute after Chrome escalates), so an animation started there
 * would strand the terminal mid-line until the tab is focused again.
 * Re-read every call, since both conditions change during a session.
 */
export function animationsEnabled(): boolean {
  if (typeof document !== "undefined" && document.hidden) return false;
  try {
    return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return true;
  }
}

/** `sleep`, but instant when animations are off. */
export function pace(ms: number): Promise<void> {
  return animationsEnabled() ? sleep(ms) : Promise.resolve();
}

export function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)] as T;
}

/** Creates a detached element. `html` is assigned raw. */
export function el(tag: string, cls?: string, html?: string): HTMLElement {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (html !== undefined) node.innerHTML = html;
  return node;
}
