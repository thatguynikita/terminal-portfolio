import { defineCommand } from "../core/types";
import type { CommandContext } from "../core/types";

const RESOURCES = [
  { addr: "condensed_milk_reserve.cat_stash", block: `resource "condensed_milk_reserve" "cat_stash" { cans = 30 }`, id: "cans-0030", secs: 2 },
  { addr: "on_call_pager.sanity", block: `resource "on_call_pager" "sanity" {}`, id: "sanity-0001", secs: 3 },
  { addr: "personal_time.weekend", block: `resource "personal_time" "weekend" {}`, id: "sat-sun-47", secs: 2 },
  { addr: "aws_iam_role.impostor_syndrome", block: `resource "aws_iam_role" "impostor_syndrome" {}`, id: "self-esteem-8f21", secs: 4 },
  { addr: "dns_record.last_two_brain_cells", block: `resource "dns_record" "last_two_brain_cells" {}`, id: "ttl-300s", secs: 3 },
  { addr: "kubernetes_deployment.social_life", block: `resource "kubernetes_deployment" "social_life" {}`, id: "replicas-0", secs: 5 },
  { addr: "aws_backup_plan.will_to_live", block: `resource "aws_backup_plan" "will_to_live" {}`, id: "retention-inf", secs: 23 },
];

async function apply(ctx: CommandContext): Promise<void> {
  await ctx.sequence([
    { text: ctx.t("terraform.willPerform") },
    { text: `  <span class="amber">~</span> resource "aws_instance" "sre_sleep_schedule" { hours = 0 -&gt; 8 }` },
    { text: `  <span style="color:var(--red)">-</span> resource "personal_time" "weekend" {}` },
    { text: `  <span class="glow">+</span> resource "incident" "unplanned" { severity = "sev1" }` },
    { text: ctx.t("terraform.destroyWeekend"), delay: 500 },
    { text: ctx.t("terraform.applyTimedOut"), delay: 2000 },
  ]);
}

async function destroy(ctx: CommandContext): Promise<void> {
  ctx.print(ctx.t("terraform.acquiringLock"));
  await ctx.sleep(1500);
  ctx.print(ctx.t("terraform.willDestroy"));

  for (const resource of RESOURCES) {
    ctx.print(`  <span style="color:var(--red)">-</span> ${ctx.escape(resource.block)}`);
    await ctx.sleep(400);
  }

  ctx.print(ctx.t("terraform.plan", { n: RESOURCES.length }));
  ctx.print(ctx.t("terraform.reallyDestroy"));
  await ctx.sleep(2500);
  ctx.print(ctx.t("terraform.answeredForYou"));
  await ctx.sleep(1500);

  document.body.classList.add("panic-amber");
  await ctx.sleep(200);

  const steps = RESOURCES.flatMap((r, i) => {
    const destroying = {
      text: `<span class="dim">${r.addr}: Destroying... [id=${r.id}]</span>`,
      delay: i === 0 ? 0 : 400,
    };
    const complete = {
      text: `<span class="dim">${r.addr}: Destruction complete after ${r.secs}s</span>`,
      delay: 350,
    };
    // The last resource drags on, as the slow one always does.
    if (i < RESOURCES.length - 1) return [destroying, complete];
    return [
      destroying,
      { text: `<span class="dim">${r.addr}: Still destroying... [id=${r.id}, 10s elapsed]</span>`, delay: 500 },
      { text: `<span class="dim">${r.addr}: Still destroying... [id=${r.id}, 20s elapsed]</span>`, delay: 500 },
      complete,
    ];
  });

  await ctx.sequence(steps);
  document.body.classList.remove("panic-amber");

  ctx.print(ctx.t("terraform.destroyComplete", { n: RESOURCES.length }));
  ctx.print(ctx.t("terraform.ripWeekend"));
}

export default defineCommand({
  name: "terraform",
  usage: "<subcommand>",
  order: 110,
  complete: () => ["apply", "destroy"],

  async run(ctx, args) {
    const sub = args.normalized;
    if (sub === "apply") return apply(ctx);
    if (sub === "destroy") return destroy(ctx);
    if (!sub) {
      ctx.print(ctx.t("terraform.usage"));
      ctx.print(ctx.t("terraform.subcommands"));
      return;
    }
    ctx.print(ctx.t("terraform.unknown", { cmd: ctx.escape(args.raw.trim()) }));
  },
});
