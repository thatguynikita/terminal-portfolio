import { defineFile } from "./define";
import { escapeHtml } from "../core/html";
import { socialsFor } from "../core/profile";
import profile from "../../profile.config";

export default defineFile({
  enabled: socialsFor(profile, "terminal").length > 0,
  html: true,
  read: (ctx) =>
    socialsFor(ctx.profile, "terminal").map(
      (s) =>
        `<span class="accent">${escapeHtml(s.label)}:</span> ` +
        `<a href="${ctx.escapeAttr(s.href)}" target="_blank" rel="noopener">${escapeHtml(s.display)}</a>`
    ),
});
