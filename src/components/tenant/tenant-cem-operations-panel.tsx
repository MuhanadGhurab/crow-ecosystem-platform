import Link from "next/link";
import { routes } from "@/lib/routes";
import type { CemOperationsSnapshot } from "@/lib/cem-operations/types";

type TenantCemOperationsPanelProps = {
  slug: string;
  snapshot: CemOperationsSnapshot;
};

const READINESS_CLASS: Record<CemOperationsSnapshot["readinessLevel"], string> = {
  strong: "border-teal-500/25 bg-teal-500/10 text-teal-200",
  needs_review: "border-amber-500/25 bg-amber-500/10 text-amber-200",
  early: "border-cyan-500/25 bg-cyan-500/10 text-cyan-200",
  draft: "border-slate-500/25 bg-slate-500/10 text-slate-300",
};

export function TenantCemOperationsPanel({ slug, snapshot }: TenantCemOperationsPanelProps) {
  const r = routes.tenant(slug);

  return (
    <section className="cc-glass-card border-cyan-500/15 space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-medium text-cyan-400">CEM operations</h3>
          <p className="mt-1 text-xs text-slate-500">
            Workflow visibility and task coordination — advisory, not an automation engine.
          </p>
        </div>
        <span
          className={`rounded-full border px-3 py-1 text-xs font-medium ${READINESS_CLASS[snapshot.readinessLevel]}`}
        >
          {snapshot.readinessLabel}
        </span>
      </div>

      <p className="text-sm text-slate-400">{snapshot.readinessDetail}</p>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-cc border border-cyan-500/10 bg-white/[0.02] px-4 py-3">
          <p className="text-xs text-slate-500">Active workflows</p>
          <p className="mt-1 text-xl font-semibold text-white">{snapshot.activeWorkflowCount}</p>
          <p className="text-xs text-slate-600">{snapshot.workflowCount} total</p>
        </div>
        <div className="rounded-cc border border-amber-500/10 bg-white/[0.02] px-4 py-3">
          <p className="text-xs text-slate-500">Open tasks</p>
          <p className="mt-1 text-xl font-semibold text-amber-200">{snapshot.openTaskCount}</p>
          <p className="text-xs text-slate-600">{snapshot.taskCount} total</p>
        </div>
        <div className="rounded-cc border border-teal-500/10 bg-white/[0.02] px-4 py-3">
          <p className="text-xs text-slate-500">Departments</p>
          <p className="mt-1 text-xl font-semibold text-white">{snapshot.departmentCount}</p>
          <p className="text-xs text-slate-600">
            {snapshot.departmentsWithProfiles} with profiles
          </p>
        </div>
        <div className="rounded-cc border border-violet-500/10 bg-white/[0.02] px-4 py-3">
          <p className="text-xs text-slate-500">Roles mapped</p>
          <p className="mt-1 text-xl font-semibold text-white">{snapshot.roleCount}</p>
          <p className="text-xs text-slate-600">
            {snapshot.rolesWithAssignments} with assignments
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 text-xs">
        <Link href={r.workflows} className="text-cyan-400 hover:text-cyan-300">
          Workflows →
        </Link>
        <Link href={r.tasks} className="text-cyan-400 hover:text-cyan-300">
          Tasks →
        </Link>
        <Link href={r.departments} className="text-cyan-400 hover:text-cyan-300">
          Structure →
        </Link>
        <Link href={r.roles} className="text-violet-400 hover:text-violet-300">
          Roles →
        </Link>
        {snapshot.cybercrowInitialized ? (
          <Link href={r.cybercrow.auditLogs} className="text-violet-400 hover:text-violet-300">
            CyberCrow trust →
          </Link>
        ) : (
          <Link href={r.cybercrow.dashboard} className="text-violet-400 hover:text-violet-300">
            Initialize CyberCrow →
          </Link>
        )}
        <Link href={routes.sarea.profiles} className="text-rose-400 hover:text-rose-300">
          SAREA profiles →
        </Link>
      </div>

      {snapshot.recommendedActions.length > 0 && (
        <ul className="space-y-2 border-t border-white/5 pt-4">
          {snapshot.recommendedActions.map((action) => (
            <li
              key={action.label}
              className="flex flex-wrap items-baseline justify-between gap-2 text-sm"
            >
              <span className="text-slate-300">{action.label}</span>
              <span className="text-xs text-slate-500">{action.hint}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
