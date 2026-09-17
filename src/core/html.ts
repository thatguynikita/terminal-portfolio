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
/**
 * Resolves once the document is visible — at once when it already is.
 *
 * A page can start hidden: Chrome prerenders a URL it expects the visitor
 * to open (typed into the omnibox, or a link with speculation rules), and a
 * tab opened in the background is the same. `document.hidden` is true, so
 * every paced sleep is skipped and the whole intro lands on the page
 * already rendered — the visitor's first sight of it is the finished
 * transcript, not the boot. Anything that should be *watched* waits here
 * first; `animationsEnabled()` still decides what happens if the tab is
 * hidden mid-way.
 */
export function untilVisible(): Promise<void> {
  if (typeof document === "undefined" || !document.hidden) return Promise.resolve();
  return new Promise((resolve) => {
    const check = (): void => {
      if (document.hidden) return;
      document.removeEventListener("visibilitychange", check);
      document.removeEventListener("prerenderingchange", check);
      resolve();
    };
    document.addEventListener("visibilitychange", check);
    // Prerender activation; Chrome also flips visibility, but be explicit.
    document.addEventListener("prerenderingchange", check);
  });
}

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
