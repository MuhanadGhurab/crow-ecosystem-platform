import Link from "next/link";
import type { ProCrowGoNoGoSnapshot } from "@/lib/procrow/procrow-go-no-go-contract";
import { routes } from "@/lib/routes";
import { ProCrowDeploymentSafetyChecklist } from "@/components/procrow/procrow-deployment-safety-checklist";
import { ProCrowGateStatusCard } from "@/components/procrow/procrow-gate-status-card";
import { ProCrowGoNoGoDecisionBadge } from "@/components/procrow/procrow-go-no-go-decision-badge";
import { ProCrowReleaseBlockersPanel } from "@/components/procrow/procrow-release-blockers-panel";
import { ProCrowValidationCommandList } from "@/components/procrow/procrow-validation-command-list";
import { ProCrowSafetyNote } from "@/components/procrow/procrow-safety-note";

type ProCrowGoNoGoCenterProps = {
  snapshot: ProCrowGoNoGoSnapshot;
};

export function ProCrowGoNoGoCenter({ snapshot }: ProCrowGoNoGoCenterProps) {
  const pass = snapshot.gates.filter((g) => g.status === "pass").length;
  const advisory = snapshot.gates.filter((g) => g.status === "advisory").length;
  const notRun = snapshot.gates.filter((g) => g.status === "not_run").length;
  const blocked = snapshot.gates.filter((g) => g.status === "blocked").length;
  const needsReview = snapshot.gates.filter((g) => g.status === "needs_review").length;

  const checklist = [
    "Migrations change remote schema when applied against a live database — explicit approval required; Vercel deploy may run db:migrate:deploy only when wired in your pipeline (review scripts/migrate-deploy.mjs and vercel.json).",
    "Prisma generate (npm run db:generate) does not apply DDL — safe for client regen; it is not a substitute for migration discipline.",
    "No destructive seeds from this surface — db:seed:* commands write data and are never casual.",
    "Live payments and checkout activation remain off unless explicitly approved — pricing is advisory.",
    "Tenant auto-provisioning from client approval alone does not exist — onboarding stays ProCrow-controlled.",
    "No paid infrastructure activation is implied by passing local validation — staging/demo/portfolio mode by default.",
  ];

  return (
    <div className="space-y-10" data-procrow="go-no-go-center">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <ProCrowGoNoGoDecisionBadge decision={snapshot.decision} subtitle="Demo / staging readiness (advisory)" />
          <ProCrowGoNoGoDecisionBadge
            decision={snapshot.productionLaunchDecision}
            subtitle="Production commercial launch (F23 release gate)"
          />
          <p className="max-w-2xl text-sm text-slate-400">{snapshot.summary}</p>
          <p className="font-mono text-[10px] text-slate-600">Snapshot · {snapshot.generatedAt}</p>
        </div>
        <div className="cc-glass-card !p-4 text-sm text-slate-400">
          <p className="font-display text-xs font-semibold uppercase tracking-wider text-slate-500">Gate counts</p>
          <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 font-mono text-xs">
            <dt className="text-slate-600">pass</dt>
            <dd>{pass}</dd>
            <dt className="text-slate-600">advisory</dt>
            <dd>{advisory}</dd>
            <dt className="text-slate-600">not_run</dt>
            <dd>{notRun}</dd>
            <dt className="text-slate-600">needs_review</dt>
            <dd>{needsReview}</dd>
            <dt className="text-slate-600">blocked</dt>
            <dd>{blocked}</dd>
          </dl>
        </div>
      </div>

      <ProCrowSafetyNote />

      <ProCrowReleaseBlockersPanel blockers={snapshot.blockers} warnings={snapshot.warnings} />

      <section className="cc-glass-card !p-5">
        <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-slate-400">
          Operator next actions
        </h2>
        <ul className="mt-3 list-inside list-decimal space-y-2 text-sm text-slate-300">
          {snapshot.nextActions.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-slate-600">
          Queue context: <Link href={routes.admin.queue} className="text-cyan-400 hover:text-cyan-300">operator queue →</Link>
        </p>
      </section>

      <ProCrowDeploymentSafetyChecklist items={checklist} />

      <section className="space-y-3">
        <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-slate-400">
          Readiness gates (metadata)
        </h2>
        <p className="text-xs text-slate-500">
          Statuses are advisory — this page does not execute npm scripts, migrations, or deploy steps.
        </p>
        <div className="grid gap-3 lg:grid-cols-2">
          {snapshot.gates.map((g) => (
            <ProCrowGateStatusCard key={g.key} gate={g} />
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-slate-400">
          Validation command index
        </h2>
        <p className="text-xs text-slate-500">
          Grouped for operators — run locally or in CI. Marked read-only vs DB-write vs deployment-sensitive.
        </p>
        <div className="cc-glass-card !p-5">
          <ProCrowValidationCommandList commands={snapshot.validationCommands} />
        </div>
      </section>

      <section className="cc-glass-card !p-5">
        <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-slate-400">
          Internal references (not public routes)
        </h2>
        <ul className="mt-3 space-y-2 text-sm text-slate-400">
          {snapshot.docs.map((d) => (
            <li key={d.internalPath}>
              <span className="text-slate-300">{d.label}</span>
              <span className="ml-2 font-mono text-xs text-slate-600">{d.path}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-cc-sm border border-cyan-500/20 bg-cyan-500/5 p-4 text-xs text-slate-400">
        <p className="font-semibold text-cyan-200/90">Safety notes</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          {snapshot.safetyNotes.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
