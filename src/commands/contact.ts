import { defineCommand } from "../core/types";

export default defineCommand({
  name: "contact",
  order: 30,
  run(ctx) {
    const links = ctx.profile.socials
      .map(
        (s) =>
          `<a href="${ctx.escapeAttr(s.href)}" target="_blank" rel="noopener">${ctx.escape(s.label)}</a>`
      )
      .join("");
    ctx.print(`<div class="links">${links}</div>`);
  },
});
