import Link from "next/link";
import {
  TASK_APPROVAL_CYBERCROW_EVIDENCE,
  TASK_APPROVAL_CYBERCROW_RISKS,
  TASK_APPROVAL_REPORT_KPI_SIGNALS,
  TASK_APPROVAL_SAREA_PERSONAS,
  TASK_APPROVAL_SECTOR_NOTES,
} from "@/lib/constants/task-approval-engine-depth";
import { routes } from "@/lib/routes";
import type { TaskApprovalEngineReadinessSnapshot } from "@/lib/services/task-approval-readiness.service";

type TaskApprovalOperationsReadinessPanelProps = {
  slug: string;
  snapshot: TaskApprovalEngineReadinessSnapshot;
  cybercrowLive: boolean;
  /** Tasks page emphasizes task board; workflows page emphasizes definitions. */
  focus: "tasks" | "workflows";
};

function statusBadge(status: string) {
  if (status === "found") {
    return (
      <span className="rounded-full border border-teal-500/30 bg-teal-500/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-teal-300">
        Found
      </span>
    );
  }
  if (status === "partial") {
    return (
      <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-amber-300">
        Partial
      </span>
    );
  }
  return (
    <span className="rounded-full border border-slate-600 bg-slate-800/50 px-2 py-0.5 text-[10px] uppercase tracking-wide text-slate-400">
      Recommended
    </span>
  );
}

export function TaskApprovalOperationsReadinessPanel({
  slug,
  snapshot,
  cybercrowLive,
  focus,
}: TaskApprovalOperationsReadinessPanelProps) {
  const r = routes.tenant(slug);
  const sectorNote = snapshot.sectorKey
    ? TASK_APPROVAL_SECTOR_NOTES.find((n) => n.sector === snapshot.sectorKey)
    : null;

  const readinessAccent =
    snapshot.readinessLevel === "operational"
      ? "teal"
      : snapshot.readinessLevel === "building"
        ? "amber"
        : undefined;

  const statusEntries = Object.entries(snapshot.tasksByStatus).filter(([, n]) => n > 0);

  return (
    <div className="space-y-6">
      <section className="cc-glass-card border-cyan-500/15 p-5">
        <h3 className="font-display text-sm font-semibold text-cyan-300">
          {focus === "tasks" ? "Task engine readiness" : "Workflow & approval readiness"}
        </h3>
        <p className="mt-2 text-sm text-slate-400">{snapshot.readinessDetail}</p>
        <p
          className={`mt-2 text-lg font-medium ${
            readinessAccent === "teal"
              ? "text-teal-300"
              : readinessAccent === "amber"
                ? "text-amber-300"
                : "text-slate-300"
          }`}
        >
          {snapshot.readinessLabel}
        </p>
        <p className="mt-2 text-xs text-slate-600">
          Operator-guided task and approval coordination across ERP modules — not BPMN, RPA,
          autonomous approvals, or AI task assignment.
        </p>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-xs text-slate-500">Total tasks</dt>
            <dd className="text-lg font-medium text-white">{snapshot.taskCount}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Open / in progress</dt>
            <dd className="text-lg font-medium text-white">{snapshot.openTaskCount}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Workflow definitions</dt>
            <dd className="text-lg font-medium text-white">{snapshot.workflowCount}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Unassigned tasks</dt>
            <dd className="text-lg font-medium text-white">{snapshot.unassignedTaskCount}</dd>
          </div>
        </dl>
      </section>

      {statusEntries.length > 0 && focus === "tasks" && (
        <section className="cc-glass-card p-5">
          <h3 className="font-display text-sm font-semibold text-cyan-400">Status distribution</h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {statusEntries.map(([status, count]) => (
              <li
                key={status}
                className="rounded-lg border border-white/5 bg-slate-900/40 px-3 py-2 text-sm"
              >
                <span className="text-slate-400 capitalize">{status.replace(/_/g, " ")}</span>
                <span className="ml-2 font-medium text-white">{count}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="cc-glass-card p-5">
          <h3 className="font-display text-sm font-semibold text-cyan-400">
            {focus === "workflows" ? "Workflow-to-task linkage" : "Workflow linkage"}
          </h3>
          <p className="mt-2 text-xs text-slate-500">
            Definitions on{" "}
            <Link href={r.workflows} className="text-cyan-400 hover:text-cyan-300">
              Workflows
            </Link>{" "}
            should surface coordination tasks on{" "}
            <Link href={r.tasks} className="text-cyan-400 hover:text-cyan-300">
              Tasks
            </Link>
            — advisory coverage, not live automation.
          </p>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between gap-2">
              <dt className="text-slate-500">With linked tasks</dt>
              <dd className="text-white">{snapshot.workflowsWithTasks}</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-slate-500">Without tasks</dt>
              <dd className="text-white">{snapshot.workflowsWithoutTasks}</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-slate-500">Tasks without workflow</dt>
              <dd className="text-white">{snapshot.tasksWithoutWorkflow}</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-slate-500">Keyword-matched workflows</dt>
              <dd className="text-white">{snapshot.matchedWorkflows.length}</dd>
            </div>
          </dl>
        </section>

        <section className="cc-glass-card p-5">
          <h3 className="font-display text-sm font-semibold text-cyan-400">
            Approval / review readiness
          </h3>
          <p className="mt-2 text-xs text-slate-500">
            Recommended approval paths by enabled module — operator-managed review queues, not
            enforced approval chains.
          </p>
          {snapshot.moduleApprovalMap.length === 0 ? (
            <p className="mt-3 text-sm text-slate-500">
              Enable ERP modules on the modules page to see module-specific approval guidance.
            </p>
          ) : (
            <ul className="mt-3 max-h-64 space-y-3 overflow-y-auto pr-1 text-sm">
              {snapshot.moduleApprovalMap.map((mod) => (
                <li key={mod.moduleKey}>
                  <p className="font-medium text-slate-200">{mod.label}</p>
                  <ul className="mt-1 space-y-1 text-xs text-slate-500">
                    {mod.approvals.slice(0, 3).map((a) => (
                      <li key={a.id}>· {a.label}</li>
                    ))}
                    {mod.approvals.length > 3 && (
                      <li className="text-slate-600">+{mod.approvals.length - 3} more</li>
                    )}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="cc-glass-card p-5">
        <h3 className="font-display text-sm font-semibold text-cyan-400">
          Engine workflow readiness
        </h3>
        <ul className="mt-3 space-y-2">
          {snapshot.workflowReadiness.map((w) => (
            <li
              key={w.id}
              className="flex flex-wrap items-start justify-between gap-2 rounded-lg border border-white/5 bg-slate-900/30 px-3 py-2"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-200">{w.label}</p>
                <p className="text-xs text-slate-500">{w.description}</p>
              </div>
              {statusBadge(w.status)}
            </li>
          ))}
        </ul>
      </section>

      {snapshot.matchedWorkflows.length > 0 && (
        <section className="cc-glass-card p-5">
          <h3 className="font-display text-sm font-semibold text-teal-400">Matched workflows</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {snapshot.matchedWorkflows.slice(0, 8).map((w) => (
              <li key={w.id} className="flex justify-between gap-2 text-slate-400">
                <span className="text-slate-200">{w.name}</span>
                <span>
                  {w.openTaskCount} open · {w.taskCount} total
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="cc-glass-card border-violet-500/10 p-5">
          <h3 className="font-display text-sm font-semibold text-violet-300">CyberCrow posture</h3>
          <p className="mt-2 text-xs text-slate-500">
            Advisory evidence hooks for task and approval trails — not certified audit or
            compliance automation.
          </p>
          <ul className="mt-3 space-y-1 text-xs text-slate-400">
            {TASK_APPROVAL_CYBERCROW_RISKS.slice(0, 5).map((risk) => (
              <li key={risk}>· {risk}</li>
            ))}
          </ul>
          <p className="mt-3 text-xs font-medium text-slate-500">Evidence examples</p>
          <ul className="mt-1 space-y-1 text-xs text-slate-500">
            {TASK_APPROVAL_CYBERCROW_EVIDENCE.slice(0, 4).map((e) => (
              <li key={e}>· {e}</li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap gap-3">
            {cybercrowLive ? (
              <>
                <Link href={r.cybercrow.evidence} className="text-xs text-violet-400 hover:text-violet-300">
                  Evidence →
                </Link>
                <Link href={r.cybercrow.auditLogs} className="text-xs text-violet-400 hover:text-violet-300">
                  Audit logs →
                </Link>
                <Link href={r.cybercrow.grc} className="text-xs text-violet-400 hover:text-violet-300">
                  GRC →
                </Link>
              </>
            ) : (
              <Link href={r.cybercrow.dashboard} className="text-xs text-violet-400 hover:text-violet-300">
                Initialize CyberCrow →
              </Link>
            )}
          </div>
        </section>

        <section className="cc-glass-card border-rose-500/10 p-5">
          <h3 className="font-display text-sm font-semibold text-rose-300">SAREA experience</h3>
          <p className="mt-2 text-xs text-slate-500">
            RBAC controls access; SAREA adapts density and navigation for task-heavy personas.
          </p>
          <ul className="mt-3 space-y-2 text-xs">
            {TASK_APPROVAL_SAREA_PERSONAS.slice(0, 5).map((p) => (
              <li key={p.id}>
                <span className="text-slate-300">{p.label}</span>
                <span className="text-slate-500"> — {p.hint}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href={routes.sarea.roleMapping} className="text-xs text-rose-400 hover:text-rose-300">
              Role mapping →
            </Link>
            <Link href={routes.sarea.preview} className="text-xs text-rose-400 hover:text-rose-300">
              Preview →
            </Link>
          </div>
        </section>
      </div>

      <section className="cc-glass-card p-5">
        <h3 className="font-display text-sm font-semibold text-cyan-400">Reports / KPI readiness</h3>
        <p className="mt-2 text-xs text-slate-500">
          Signals roll up to Reports when the BI module is enabled — cards and tables only, no fake
          charts.
        </p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {TASK_APPROVAL_REPORT_KPI_SIGNALS.slice(0, 8).map((signal) => (
            <li
              key={signal}
              className="rounded-full border border-cyan-500/15 bg-cyan-500/5 px-2.5 py-1 text-[11px] text-cyan-200/90"
            >
              {signal}
            </li>
          ))}
        </ul>
        <Link href={r.reports} className="mt-4 inline-block text-xs text-cyan-400 hover:text-cyan-300">
          Open Reports hub →
        </Link>
      </section>

      {sectorNote && (
        <section className="cc-glass-card border-teal-500/10 p-5">
          <h3 className="font-display text-sm font-semibold text-teal-300">{sectorNote.title}</h3>
          <p className="mt-2 text-sm text-slate-400">{sectorNote.note}</p>
        </section>
      )}

      {snapshot.recommendedActions.length > 0 && (
        <section className="cc-glass-card border-amber-500/15 p-5">
          <h3 className="font-display text-sm font-semibold text-amber-300">Next recommended actions</h3>
          <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-slate-400">
            {snapshot.recommendedActions.map((action) => (
              <li key={action}>{action}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
