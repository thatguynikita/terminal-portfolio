import { defineFile } from "./define.ts";
import { escapeHtml } from "../core/html.ts";
import { skillsFor } from "../core/profile.ts";
import profile from "../../profile.config.ts";

export default defineFile({
  enabled: skillsFor(profile, "terminal").length > 0,
  html: true,
  read: (ctx) =>
    skillsFor(ctx.profile, "terminal").map(
      (s) => `<span class="accent">${escapeHtml(s.key[ctx.lang])}:</span> ${escapeHtml(s.value)}`
    ),
});
