import { defineCommand } from "../core/types";
import profile from "../../profile.config";

/**
 * Opens the CV in whatever language the session is in — `/cv.html` or
 * `/ru/cv.html`. Runs the filesystem node, so `cv` and `./cv.html` behave
 * identically.
 *
 * Unregistered when no `cv` is configured, so a fork without a résumé
 * doesn't advertise a command that leads nowhere.
 */
export default defineCommand({
  name: "cv",
  order: 35,
  enabled: Boolean(profile.cv),
  run: (ctx) => ctx.runFile("cv.html"),
});
