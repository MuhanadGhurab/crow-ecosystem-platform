import Link from "next/link";
import type { CemTransactionWorkflowSnapshot } from "@/lib/cem/cem-transaction-workflow-contract";
import { routes } from "@/lib/routes";

type Props = {
  snapshot: CemTransactionWorkflowSnapshot;
};

export function CemTransactionStageTimeline({ snapshot }: Props) {
  return (
    <ol className="space-y-3">
      {snapshot.steps.map((step) => (
        <li
          key={step.stage}
          className={`rounded-lg border p-4 ${
            step.status === "active"
              ? "border-cyan-500/40 bg-cyan-500/5"
              : step.status === "completed"
                ? "border-teal-500/20 bg-teal-500/5"
                : step.status === "blocked"
                  ? "border-rose-500/30 bg-rose-500/5"
                  : "border-white/5 bg-white/[0.02]"
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-medium text-white">{step.label}</p>
            <span className="rounded-full px-2 py-0.5 text-xs capitalize text-slate-300">
              {step.status}
            </span>
          </div>
          <p className="mt-2 text-sm text-slate-400">{step.description}</p>
          <div className="mt-3 flex flex-wrap gap-3 text-xs">
            <Link href={step.route} className="text-cyan-400 hover:text-cyan-300">
              {step.moduleKey} module →
            </Link>
            <span className="text-slate-500">Owner: {step.ownerRole.replace(/_/g, " ")}</span>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function CemTransactionEvidencePanel({ snapshot }: Props) {
  return (
    <ul className="space-y-2">
      {snapshot.cyberCrowEvidence.map((hook) => (
        <li key={hook.key} className="rounded-lg border border-violet-500/15 bg-violet-500/5 p-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-medium text-violet-200">{hook.label}</p>
            <span className="text-xs capitalize text-slate-400">{hook.readiness}</span>
          </div>
          <p className="mt-1 text-xs text-slate-400">{hook.description}</p>
          {hook.route && (
            <Link href={hook.route} className="mt-2 inline-block text-xs text-violet-300 hover:text-violet-200">
              Evidence readiness →
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
}

export function CemTransactionSareaPanel({ snapshot }: Props) {
  return (
    <ul className="grid gap-2 sm:grid-cols-2">
      {snapshot.sareaExperienceImpact.map((view) => (
        <li key={view.role} className="rounded-lg border border-rose-500/15 bg-rose-500/5 p-3">
          <p className="text-sm font-medium text-rose-200">{view.label}</p>
          <p className="mt-1 text-xs text-slate-400">{view.focus}</p>
          <p className="mt-2 text-xs text-slate-500">Widgets: {view.widgets.join(", ")}</p>
        </li>
      ))}
    </ul>
  );
}

export function CemTransactionReportPanel({ snapshot }: Props) {
  const r = routes.tenant(snapshot.tenantSlug);
  if (snapshot.relatedReports.length === 0) {
    return (
      <p className="text-sm text-slate-400">
        Advisory report output — create a tenant-backed request to generate workflow reports.
      </p>
    );
  }
  return (
    <ul className="space-y-2">
      {snapshot.relatedReports.map((rep) => (
        <li key={rep.id} className="rounded-lg border border-white/5 p-3">
          <p className="text-sm font-medium text-white">{rep.name}</p>
          <p className="mt-1 text-xs text-slate-400">{rep.summary}</p>
        </li>
      ))}
      <li className="text-xs text-slate-500">
        <Link href={r.reports} className="text-cyan-400 hover:text-cyan-300">
          View reports module →
        </Link>
      </li>
    </ul>
  );
}

export function CemTransactionTasksPanel({ snapshot }: Props) {
  const r = routes.tenant(snapshot.tenantSlug);
  if (snapshot.relatedTasks.length === 0) {
    return <p className="text-sm text-slate-400">No linked tasks yet — workflow tasks appear after request creation.</p>;
  }
  return (
    <ul className="space-y-2">
      {snapshot.relatedTasks.map((task) => (
        <li key={task.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-white/5 p-3">
          <div>
            <p className="text-sm text-white">{task.title}</p>
            {task.workflowName && (
              <p className="text-xs text-slate-500">{task.workflowName}</p>
            )}
          </div>
          <span className="text-xs capitalize text-slate-400">{task.status}</span>
        </li>
      ))}
      <li>
        <Link href={r.tasks} className="text-xs text-cyan-400 hover:text-cyan-300">
          Tasks board →
        </Link>
      </li>
    </ul>
  );
}
