import type { Terminal } from "./terminal";
import { LOCALES, nextLocale as rotateLocale, type Locale } from "../i18n/locales";
import { commonPrefix } from "./args";
import { isCompleteArgument, splitInput } from "./complete";
import { el, escapeAttr, escapeHtml } from "./html";

interface Chip {
  label: string;
  value: string;
}

export interface InputController {
  mount(): void;
  focus(): void;
  refresh(): void;
}

/**
 * The input row, keybindings, Tab-completion and the touch chip bar.
 *
 * Completion candidates come from the registry and the active mode, so
 * they can't drift from what actually runs — the original kept a separate
 * `COMMANDS` array and a second `getArgCandidates` switch for this.
 */
export function createInput(terminal: Terminal): InputController {
  const { ctx, registry } = terminal;
  const body = ctx.root;
  const chipsEl = document.getElementById("chips");

  const inputRow = el("div", "input-row");
  inputRow.innerHTML =
    `<span class="ps" id="psLabel">${terminal.prompt()}</span>` +
    `<input id="cmdline" autocomplete="off" autocapitalize="off" spellcheck="false" />`;
  const cmdInput = inputRow.querySelector("input") as HTMLInputElement;

  let busy = false;
  let lastTabValue: string | null = null;
  let chipsFrame: number | null = null;

  /* ---------------- completion ---------------- */

  function candidatesFor(raw: string): string[] {
    const { base, prefix } = splitInput(raw);
    if (ctx.mode) {
      return (ctx.mode.complete?.(ctx, raw) ?? []).filter((c) => c.startsWith(raw.toLowerCase()));
    }
    if (base === null) return registry.names().filter((c) => c.startsWith(prefix));
    const command = registry.get(base);
    return (command?.complete?.(ctx, prefix) ?? []).filter((c) => c.startsWith(prefix));
  }

  function labelFor(base: string | null, candidate: string): string {
    if (!base) return candidate;
    // `|| candidate`, not `??`: a trimming label helper can legitimately
    // return "" for the bare prefix candidate it also matches, and an
    // empty label renders as an invisible chip.
    return registry.get(base)?.completeLabel?.(candidate) || candidate;
  }

  /* ---------------- chips ---------------- */

  function nextLocale(): Locale {
    return rotateLocale(LOCALES, ctx.lang);
  }

  function defaultChips(): Chip[] {
    const chips: Chip[] = [];
    if (registry.get("help")) chips.push({ label: "help", value: "help" });
    if (LOCALES.length > 1 && registry.get("lang")) {
      const next = nextLocale();
      chips.push({ label: next, value: `lang ${next}` });
    }
    for (const command of registry.visible()) {
      if (chips.length >= 6) break;
      if (command.name === "help" || command.name === "lang" || command.name === "clear") continue;
      chips.push({ label: command.name, value: command.fill ?? command.name });
    }
    if (registry.get("clear")) chips.push({ label: "clear", value: "clear" });
    return chips;
  }

  function currentChips(): Chip[] {
    const raw = cmdInput.value;
    if (ctx.mode) return ctx.mode.chips?.(ctx, raw) ?? [];
    if (!raw) return defaultChips();
    const { base, head } = splitInput(raw);
    return candidatesFor(raw).map((c) => ({
      label: labelFor(base, c),
      value: head + c,
    }));
  }

  function renderChips(): void {
    if (!chipsEl) return;
    if (chipsFrame) cancelAnimationFrame(chipsFrame);
    chipsFrame = requestAnimationFrame(() => {
      chipsFrame = null;
      chipsEl.innerHTML = currentChips()
        .map(
          (chip) =>
            `<button class="chip" data-value="${escapeAttr(chip.value)}">${escapeHtml(chip.label)}</button>`
        )
        .join("");
    });
  }

  function applyChip(value: string): void {
    cmdInput.value = value;
    if (ctx.mode) {
      submit();
      return;
    }
    // A chip carries a complete intended command, so it should run unless
    // it only narrows the options — `theme ` opens the theme list, while
    // `theme green` runs.
    const withSpace = value.includes(" ") ? value : `${value} `;
    const { prefix } = splitInput(withSpace);
    if (isCompleteArgument(candidatesFor(withSpace), prefix)) {
      submit();
    } else {
      cmdInput.value = withSpace;
      cmdInput.focus();
      renderChips();
    }
  }

  /* ---------------- prompt chrome ---------------- */

  function updatePromptUI(): void {
    const label = document.getElementById("psLabel");
    if (label) label.innerHTML = terminal.prompt();
    const title = document.querySelector(".term-title");
    if (title) title.textContent = terminal.title();
    cmdInput.setAttribute("aria-label", ctx.t("ui.inputLabel"));
    body.setAttribute("aria-label", ctx.t("ui.outputLabel"));
  }

  function mount(): void {
    body.appendChild(inputRow);
    updatePromptUI();
    cmdInput.focus();
    renderChips();
    body.scrollTop = body.scrollHeight;
  }

  function submit(): void {
    if (busy) return;
    const value = cmdInput.value;
    cmdInput.value = "";
    renderChips();
    busy = true;
    inputRow.remove();
    void terminal.run(value).then(() => {
      mount();
      busy = false;
    });
  }

  /* ---------------- keybindings ---------------- */

  cmdInput.addEventListener("input", renderChips);

  cmdInput.addEventListener("keydown", (e) => {
    if (e.key !== "Tab") lastTabValue = null;

    // Cyrillic keycaps produce different `key` values for the same
    // physical key, so each shortcut checks both.
    const withMod = e.ctrlKey || e.metaKey;
    const is = (code: string, latin: string, cyrillic: string): boolean =>
      withMod &&
      (e.code === code ||
        e.key === latin ||
        e.key === latin.toUpperCase() ||
        e.key === cyrillic ||
        e.key === cyrillic.toUpperCase());

    if (is("KeyD", "d", "в")) {
      e.preventDefault();
      if (busy) return;
      if (cmdInput.value === "" && registry.get("exit")) {
        cmdInput.value = "exit";
        submit();
      }
      return;
    }

    if (is("KeyL", "l", "д")) {
      e.preventDefault();
      if (busy) return;
      inputRow.remove();
      ctx.clear();
      mount();
      return;
    }

    if (is("KeyC", "c", "с")) {
      e.preventDefault();
      if (busy) return;
      const value = cmdInput.value;
      if (ctx.mode && value === "") {
        inputRow.remove();
        void ctx.exitMode().then(mount);
        return;
      }
      cmdInput.value = "";
      inputRow.remove();
      ctx.promptEcho(value, `<span class="amber">^C</span>`);
      mount();
      return;
    }

    if (is("KeyW", "w", "ц")) {
      e.preventDefault();
      const pos = cmdInput.selectionStart ?? cmdInput.value.length;
      const before = cmdInput.value.slice(0, pos).replace(/\s+$/, "");
      const after = cmdInput.value.slice(pos);
      const lastSpace = before.lastIndexOf(" ");
      const kept = lastSpace === -1 ? "" : before.slice(0, lastSpace + 1);
      cmdInput.value = kept + after;
      cmdInput.setSelectionRange(kept.length, kept.length);
      renderChips();
      return;
    }

    // A mode may claim a bare keypress (`top` exits on `q`).
    if (ctx.mode?.onKey && cmdInput.value === "" && ctx.mode.onKey(ctx, e)) {
      e.preventDefault();
      inputRow.remove();
      void ctx.exitMode().then(mount);
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      submit();
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (terminal.historyIndex > 0) {
        terminal.historyIndex--;
        cmdInput.value = ctx.history[terminal.historyIndex] ?? "";
      }
      renderChips();
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (terminal.historyIndex < ctx.history.length - 1) {
        terminal.historyIndex++;
        cmdInput.value = ctx.history[terminal.historyIndex] ?? "";
      } else {
        terminal.historyIndex = ctx.history.length;
        cmdInput.value = "";
      }
      renderChips();
      return;
    }

    if (e.key === "Tab") {
      e.preventDefault();
      const raw = cmdInput.value;
      const { base, head, prefix } = splitInput(raw);
      const matches = candidatesFor(raw);

      if (matches.length === 1) {
        const only = matches[0] as string;
        cmdInput.value = ctx.mode ? only : head + only + (base === null ? " " : "");
        lastTabValue = null;
        renderChips();
      } else if (matches.length > 1) {
        const common = commonPrefix(matches);
        const compared = ctx.mode ? raw.toLowerCase() : prefix;
        if (common.length > compared.length) {
          cmdInput.value = ctx.mode ? common : head + common;
          lastTabValue = null;
          renderChips();
        } else if (lastTabValue === raw) {
          // Second Tab on an unchanged value lists the options.
          const labels = matches.map((m) => escapeHtml(labelFor(base, m)));
          body.insertBefore(el("div", "line dim", labels.join("&nbsp;&nbsp;&nbsp;")), inputRow);
          body.scrollTop = body.scrollHeight;
          lastTabValue = null;
        } else {
          lastTabValue = raw;
        }
      }
    }
  });

  /* ---------------- click targets ---------------- */

  document.addEventListener("click", (e) => {
    const target = e.target as HTMLElement | null;
    const helpCmd = target?.closest<HTMLElement>(".help-cmd");
    const replay = target?.closest<HTMLElement>(".prompt-row");
    if (helpCmd?.dataset["value"] !== undefined) {
      cmdInput.value = helpCmd.dataset["value"];
      renderChips();
    } else if (replay?.dataset["cmd"] !== undefined) {
      cmdInput.value = replay.dataset["cmd"];
      renderChips();
    }
    cmdInput.focus();
  });

  chipsEl?.addEventListener("click", (e) => {
    const button = (e.target as HTMLElement | null)?.closest<HTMLElement>(".chip");
    const value = button?.dataset["value"];
    if (value !== undefined) applyChip(value);
  });

  terminal.onModeChange = () => {
    updatePromptUI();
    renderChips();
  };

  return {
    mount,
    focus: () => cmdInput.focus(),
    refresh: renderChips,
  };
}
