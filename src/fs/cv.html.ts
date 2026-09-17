import { defineFile } from "./define.ts";
import { cvUrl } from "../cv/url.ts";
import profile from "../../profile.config.ts";

/**
 * The CV is a real page, not text — `cat` says so, and running it
 * navigates there in the current locale. Absent entirely when no `cv` is
 * configured.
 */
export default defineFile({
  enabled: Boolean(profile.cv),
  accent: true,
  // Real byte count of the rendered page, inlined at build time — the
  // terminal can't measure a file it doesn't generate.
  size: __CV_BYTES__,
  read: () => null,
  hint: (ctx) => ctx.t("cv.catHint"),
  exec: (ctx) => {
    ctx.print(ctx.t("cv.opening"));
    setTimeout(() => ctx.navigate(cvUrl(ctx.profile, ctx.lang)), 400);
  },
});
