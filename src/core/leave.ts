/**
 * Esc or `q` leaves the page for the terminal — Esc for "get me out", `q`
 * as in `less`. `q` is matched on the physical key too, so a non-Latin
 * layout works; nothing fires while a field is being typed in, and
 * modified, repeated, composing or already-handled presses are ignored, so
 * anything that later claims one of these keys only has to
 * `preventDefault()`.
 *
 * The `preventDefault()` here is load-bearing: Esc is Chrome's Stop
 * accelerator, run after the page declines the key, and Stop cancels the
 * navigation just started. In fullscreen Chrome takes Esc before the page
 * sees it — that is what `q` is for.
 */
export function leaveForTerminalOnKey(go: () => void = () => location.assign("/")): () => void {
  const onKey = (e: KeyboardEvent): void => {
    if (e.defaultPrevented || e.repeat || e.isComposing) return;
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    if (isTyping(e.target)) return;
    if (e.key !== "Escape" && e.key !== "q" && e.code !== "KeyQ") return;
    e.preventDefault();
    go();
  };
  document.addEventListener("keydown", onKey);
  return () => document.removeEventListener("keydown", onKey);
}

function isTyping(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName);
}
