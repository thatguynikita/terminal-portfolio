import { defineFile } from "./define";
import { escapeHtml } from "../core/html";

export default defineFile({
  html: true,
  read: (ctx) =>
    ctx.profile.skills.map(
      (s) => `<span class="accent">${escapeHtml(s.key[ctx.lang])}:</span> ${escapeHtml(s.value)}`
    ),
});
