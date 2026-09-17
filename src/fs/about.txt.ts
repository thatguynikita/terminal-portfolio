import { defineFile } from "./define.ts";
import { escapeHtml } from "../core/html.ts";
import profile from "../../profile.config.ts";

/** Rendered from profile.config.ts — bilingual, so it can't be a flat file. */
export default defineFile({
  enabled: Boolean(profile.bio),
  read: (ctx) => (ctx.profile.bio?.[ctx.lang] ?? "").split("\n").map(escapeHtml),
});
