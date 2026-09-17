import { readStored, StorageKey } from "./storage.ts";
import type { MatrixController } from "./types.ts";

/**
 * Whether the rain starts enabled: the visitor's stored `matrix on|off`
 * wins; a first visit takes the config's default. Shared by the terminal,
 * the CV and the 404 so the three pages agree.
 */
export function initialMatrixEnabled(defaultState: "on" | "off"): boolean {
  const stored = readStored(StorageKey.matrix);
  return stored === "on" || stored === "off" ? stored === "on" : defaultState === "on";
}

const GLYPHS = "01アイウエオカキクケコサシスセソ$#&+=-<>/\\{}[]";
const FONT_SIZE = 15;

/** Self-contained matrix-rain animation bound to a <canvas>. */
export function createMatrixRain(canvas: HTMLCanvasElement): MatrixController {
  const ctx = canvas.getContext("2d");
  let cols = 0;
  let drops: number[] = [];
  let color = "#3dff8a";
  let fadeColor = "rgba(2,4,3,0.08)";
  let enabled = true;

  function resize(): void {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    cols = Math.floor(canvas.width / FONT_SIZE);
    drops = new Array(cols).fill(0).map(() => Math.random() * -50);
  }

  function draw(): void {
    // document.hidden guard: a backgrounded tab throttles rAF anyway, and
    // drawing into it just burns battery.
    if (ctx && enabled && !document.hidden) {
      ctx.fillStyle = fadeColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = color;
      ctx.font = `${FONT_SIZE}px monospace`;
      for (let i = 0; i < cols; i++) {
        const glyph = GLYPHS[Math.floor(Math.random() * GLYPHS.length)] as string;
        const drop = drops[i] ?? 0;
        ctx.fillText(glyph, i * FONT_SIZE, drop * FONT_SIZE);
        if (drop * FONT_SIZE > canvas.height && Math.random() > 0.975) drops[i] = 0;
        else drops[i] = drop + 1;
      }
    }
    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener("resize", resize);
  draw();

  return {
    setColor(c) {
      color = c;
    },
    setFadeColor(c) {
      fadeColor = c;
    },
    setEnabled(v) {
      enabled = v;
      canvas.classList.toggle("off", !v);
    },
    get enabled() {
      return enabled;
    },
  };
}
