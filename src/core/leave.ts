/**
 * Esc or `q` leaves the page for the terminal. A courtesy for terminal
 * users — the topbar link is the real way back, this just answers the
 * reflex: Esc for "get me out", `q` for "quit the pager", as in `less`.
 *
 * `q` is matched on the physical key as well as the character, so it works
 * under a non-Latin layout where the same key types `й`. Nothing fires
 * while a field is being typed in.
 *
 * Ignores modified, repeated, IME-composing and already-handled presses:
 * anything on the page that later claims one of these keys for itself only
 * has to `preventDefault()` and this stays out of the way.
 *
 * The `preventDefault()` here is load-bearing, not politeness. Esc is
 * Chrome's *Stop* accelerator, and Chrome runs it after the page declines
 * a key — which cancels the very navigation this handler just started.
 * It won a race often enough that the first press usually did nothing.
 *
 * What it can't fix: in fullscreen, Chrome takes Esc for itself *before*
 * the page sees it, by design. That's what `q` is for.
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
