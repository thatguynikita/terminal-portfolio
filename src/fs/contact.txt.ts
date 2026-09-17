import { defineFile } from "./define.ts";
import { escapeHtml } from "../core/html.ts";
import { socialsFor } from "../core/profile.ts";
import profile from "../../profile.config.ts";

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
