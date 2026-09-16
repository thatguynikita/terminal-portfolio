import type { ProfileConfig } from "./profile";

/**
 * The sandboxed game overlay. Set up once by the page entry; commands and
 * filesystem nodes just call `openGame()`.
 */
let overlay: HTMLElement | null = null;
let frame: HTMLIFrameElement | null = null;
let gameUrl = "";

export function initGameOverlay(profile: ProfileConfig): void {
  overlay = document.getElementById("gameOverlay");
  frame = document.getElementById("gameFrame") as HTMLIFrameElement | null;
  gameUrl = profile.commands?.game?.url ?? "";
  if (!overlay || !frame) return;

  document.getElementById("gameClose")?.addEventListener("click", closeGame);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeGame();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay && !overlay.classList.contains("hidden")) closeGame();
  });
}

export function openGame(): void {
  if (!overlay || !frame || !gameUrl) return;
  frame.src = gameUrl;
  overlay.classList.remove("hidden");
}

export function closeGame(): void {
  if (!overlay || !frame) return;
  overlay.classList.add("hidden");
  // Blank the src so the game stops running behind the closed overlay.
  frame.src = "about:blank";
}
