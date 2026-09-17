import type { Output, SequenceStep } from "./types.ts";
import { animationsEnabled, el, escapeHtml, sleep } from "./html.ts";


export interface OutputOptions {
  /** Prompt HTML for `promptEcho`, re-read on every call. */
  prompt: () => string;
}

/**
 * The one place that touches the terminal DOM. Commands get this as part
 * of their context and never reach past it.
 */
export function createOutput(root: HTMLElement, opts: OutputOptions): Output {
  function scroll(): void {
    root.scrollTop = root.scrollHeight;
  }

  function print(html: string, cls?: string): HTMLElement {
    const line = el("div", "line" + (cls ? ` ${cls}` : ""), html);
    root.appendChild(line);
    scroll();
    return line;
  }

  const output: Output = {
    root,
    print,

    printText(text, cls) {
      return print(escapeHtml(text), cls);
    },

    printLines(lines, cls) {
      // An empty string is a deliberate blank line, not a no-op.
      for (const line of lines) print(line === "" ? "&nbsp;" : line, cls);
    },

    async type(text, options = {}) {
      const cls = options.cls ? ` ${options.cls}` : "";
      const line = el("div", `line${cls}`);
      root.appendChild(line);

      if (!animationsEnabled()) {
        // textContent, so markup shows literally — same as the typed path.
        line.textContent = text;
        scroll();
        return;
      }

      const speed = options.speed ?? 12;
      for (const ch of text) {
        line.textContent += ch;
        scroll();
        await sleep(speed);
      }
    },

    async sequence(steps: SequenceStep[]) {
      const animate = animationsEnabled();
      for (const step of steps) {
        if (step.delay && animate) await sleep(step.delay);
        if (step.typed) await output.type(step.text, { cls: step.cls });
        else print(step.text, step.cls);
      }
    },

    table(header, rows) {
      let html = `<table class="tbl">`;
      if (header) {
        html += `<tr>${header.map((h) => `<td class="accent">${h}</td>`).join("")}</tr>`;
      }
      for (const row of rows) {
        html += `<tr>${row.map((v) => `<td>${v}</td>`).join("")}</tr>`;
      }
      html += `</table>`;
      return print(html);
    },

    kv(pairs) {
      const rows = pairs
        .map(([k, v]) => `<tr><td class="accent">${k}</td><td>${v}</td></tr>`)
        .join("");
      return print(`<table class="tbl kv-tbl">${rows}</table>`);
    },

    promptEcho(cmd, suffix = "") {
      const row = el("div", "line prompt-row");
      row.innerHTML = `<span class="ps">${opts.prompt()}</span>${escapeHtml(cmd)}${suffix}`;
      // Lets a click on the row replay the command.
      row.dataset.cmd = cmd;
      root.appendChild(row);
      scroll();
    },

    clear() {
      root.innerHTML = "";
    },
  };

  return output;
}
