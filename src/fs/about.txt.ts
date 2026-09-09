import { defineFile } from "./define";
import { escapeHtml } from "../core/html";

/** Rendered from profile.config.ts — bilingual, so it can't be a flat file. */
export default defineFile({
  read: (ctx) => ctx.profile.bio[ctx.lang].split("\n").map(escapeHtml),
});
