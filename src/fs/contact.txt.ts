import { defineFile } from "./define";
import { escapeHtml } from "../core/html";

export default defineFile({
  html: true,
  read: (ctx) =>
    ctx.profile.socials.map(
      (s) =>
        `<span class="accent">${escapeHtml(s.label)}:</span> ` +
        `<a href="${ctx.escapeAttr(s.href)}" target="_blank" rel="noopener">${escapeHtml(s.display)}</a>`
    ),
});
