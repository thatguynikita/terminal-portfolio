import { defineFile } from "./define";
import { escapeHtml } from "../core/html";
import { skillsFor } from "../core/profile";

export default defineFile({
  html: true,
  read: (ctx) =>
    skillsFor(ctx.profile, "terminal").map(
      (s) => `<span class="accent">${escapeHtml(s.key[ctx.lang])}:</span> ${escapeHtml(s.value)}`
    ),
});
