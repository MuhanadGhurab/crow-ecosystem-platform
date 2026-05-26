import Link from "next/link";
import {
  HR_CYBERCROW_EVIDENCE,
  HR_CYBERCROW_RISKS,
  HR_REPORT_KPI_SIGNALS,
  HR_SAREA_PERSONAS,
  HR_SECTOR_WORKFORCE_NOTES,
} from "@/lib/constants/hr-module-depth";
import { routes } from "@/lib/routes";
import type { HrWorkforceReadinessSnapshot } from "@/lib/services/hr-readiness.service";

type HrWorkforceReadinessPanelProps = {
  slug: string;
  snapshot: HrWorkforceReadinessSnapshot;
  cybercrowLive: boolean;
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

export function HrWorkforceReadinessPanel({
  slug,
  snapshot,
  cybercrowLive,
}: HrWorkforceReadinessPanelProps) {
  const r = routes.tenant(slug);
  const sectorNote = snapshot.sectorKey
    ? HR_SECTOR_WORKFORCE_NOTES.find((n) => n.sector === snapshot.sectorKey)
    : null;

  const readinessAccent =
    snapshot.readinessLevel === "operational"
      ? "teal"
      : snapshot.readinessLevel === "building"
        ? "amber"
        : undefined;

  return (
    <div className="space-y-6">
      <section className="cc-glass-card border-cyan-500/15 p-5">
        <h3 className="font-display text-sm font-semibold text-cyan-400">
          Workforce readiness summary
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
        <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-xs text-slate-500">Workspace profiles</dt>
            <dd className="text-lg font-medium text-white">{snapshot.profileCount}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">HR employees</dt>
            <dd className="text-lg font-medium text-white">
              {snapshot.employeeCount}
              <span className="ml-1 text-xs text-slate-500">
                ({snapshot.activeEmployeeCount} active)
              </span>
            </dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Roles</dt>
            <dd className="text-lg font-medium text-white">{snapshot.roleCount}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Departments</dt>
            <dd className="text-lg font-medium text-white">{snapshot.departmentCount}</dd>
          </div>
        </dl>
        {(snapshot.profilesWithoutRoles > 0 ||
          snapshot.unassignedRoleCount > 0 ||
          snapshot.employeesWithoutProfileMatch > 0) && (
          <ul className="mt-4 space-y-1 text-xs text-amber-200">
            {snapshot.profilesWithoutRoles > 0 && (
              <li>
                {snapshot.profilesWithoutRoles} profile(s) without RBAC role assignment
              </li>
            )}
            {snapshot.unassignedRoleCount > 0 && (
              <li>{snapshot.unassignedRoleCount} role(s) with no user assignment</li>
            )}
            {snapshot.employeesWithoutProfileMatch > 0 && (
              <li>
                {snapshot.employeesWithoutProfileMatch} HR employee record(s) without matching
                workspace profile (email)
              </li>
            )}
          </ul>
        )}
      </section>

      <section className="cc-glass-card p-5">
        <h3 className="font-display text-sm font-semibold text-cyan-400">Next recommended actions</h3>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-300">
          {snapshot.recommendedActions.map((action) => (
            <li key={action}>{action}</li>
          ))}
        </ol>
        <div className="mt-4 flex flex-wrap gap-3 text-xs">
          <Link href={r.users} className="text-cyan-400 hover:text-cyan-300">
            Users & roles →
          </Link>
          <Link href={r.departments} className="text-cyan-400 hover:text-cyan-300">
            Structure →
          </Link>
          <Link href={r.tasks} className="text-cyan-400 hover:text-cyan-300">
            Tasks →
          </Link>
        </div>
      </section>

      <section className="cc-glass-card p-5">
        <h3 className="font-display text-sm font-semibold text-cyan-400">
          Onboarding & offboarding readiness
        </h3>
        <p className="mt-2 text-xs text-slate-500">
          Operator-managed checklists — not automated identity governance or payroll.
        </p>
        <ul className="mt-3 space-y-2 text-sm text-slate-300">
          <li>
            <strong className="text-white">Onboarding:</strong> invite profile → assign RBAC role →
            map department → optional HR employee record (
            {snapshot.employeesLinkedToProfiles} linked by email today).
          </li>
          <li>
            <strong className="text-white">Offboarding:</strong> deactivate access, complete open
            tasks ({snapshot.openTaskCount} open workspace-wide), retain advisory evidence in
            CyberCrow.
          </li>
        </ul>
      </section>

      <section className="cc-glass-card p-5">
        <h3 className="font-display text-sm font-semibold text-cyan-400">
          HR workflow & task readiness
        </h3>
        {snapshot.matchedWorkflows.length > 0 ? (
          <ul className="mt-3 space-y-2 text-sm">
            {snapshot.matchedWorkflows.map((w) => (
              <li
                key={w.id}
                className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2"
              >
                <span className="text-white">{w.name}</span>
                <span className="text-xs text-slate-500">
                  {w.taskCount} task{w.taskCount === 1 ? "" : "s"}
                  {w.openTaskCount > 0 ? ` · ${w.openTaskCount} open` : ""}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-slate-500">
            No HR-keyword workflows or tasks detected yet — patterns below are readiness
            recommendations.
          </p>
        )}
        <ul className="mt-4 space-y-3">
          {snapshot.workflowReadiness.map((wf) => (
            <li
              key={wf.id}
              className="flex flex-wrap items-start justify-between gap-2 rounded border border-slate-800/80 px-3 py-2"
            >
              <div>
                <p className="text-sm font-medium text-slate-200">{wf.label}</p>
                <p className="text-xs text-slate-500">{wf.description}</p>
              </div>
              {statusBadge(wf.status)}
            </li>
          ))}
        </ul>
        <Link href={r.workflows} className="mt-3 inline-block text-xs text-cyan-400 hover:text-cyan-300">
          View workflows →
        </Link>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="cc-glass-card border-violet-500/15 p-5">
          <h3 className="font-display text-sm font-semibold text-violet-300">
            CyberCrow identity & access posture
          </h3>
          <p className="mt-2 text-xs text-slate-500">
            Advisory risk signals and evidence examples — not compliance certification.
          </p>
          <p className="mt-2 text-xs text-violet-200/80">
            Status: {cybercrowLive ? "Initialized" : "Not initialized — setup recommended"}
          </p>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium text-slate-400">Risk focus</p>
              <ul className="mt-1 list-inside list-disc text-xs text-slate-500">
                {HR_CYBERCROW_RISKS.slice(0, 5).map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400">Evidence readiness</p>
              <ul className="mt-1 list-inside list-disc text-xs text-slate-500">
                {HR_CYBERCROW_EVIDENCE.slice(0, 5).map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-3 text-xs">
            <Link href={r.cybercrow.grc} className="text-violet-300 hover:text-violet-200">
              GRC →
            </Link>
            <Link href={r.cybercrow.evidence} className="text-violet-300 hover:text-violet-200">
              Evidence →
            </Link>
            <Link href={r.cybercrow.auditLogs} className="text-violet-300 hover:text-violet-200">
              Audit logs →
            </Link>
          </div>
        </section>

        <section className="cc-glass-card border-rose-500/15 p-5">
          <h3 className="font-display text-sm font-semibold text-rose-300">
            SAREA experience by persona
          </h3>
          <p className="mt-2 text-xs text-slate-500">
            RBAC controls access. SAREA controls layout density and navigation — map roles in the
            studio ({snapshot.sareaProfileCount} profile mapping
            {snapshot.sareaProfileCount === 1 ? "" : "s"}).
          </p>
          <ul className="mt-3 max-h-48 space-y-2 overflow-y-auto text-xs">
            {HR_SAREA_PERSONAS.map((p) => (
              <li key={p.persona} className="border-b border-slate-800/60 pb-2">
                <span className="font-medium text-rose-200">{p.persona}</span>
                <span className="text-slate-600"> · {p.audience}</span>
                <p className="text-slate-500">{p.hrExperience}</p>
              </li>
            ))}
          </ul>
          <Link
            href={routes.sarea.roleMapping}
            className="mt-3 inline-block text-xs text-rose-300 hover:text-rose-200"
          >
            SAREA role mapping →
          </Link>
        </section>
      </div>

      <section className="cc-glass-card p-5">
        <h3 className="font-display text-sm font-semibold text-cyan-400">
          Reporting & KPI readiness
        </h3>
        <p className="mt-2 text-xs text-slate-500">
          Signals available from workspace data — no payroll or attendance charts.
        </p>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2 text-xs text-slate-400">
          {HR_REPORT_KPI_SIGNALS.map((signal) => (
            <li key={signal} className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-cyan-500/60" />
              {signal}
            </li>
          ))}
        </ul>
        <Link href={r.reports} className="mt-3 inline-block text-xs text-cyan-400 hover:text-cyan-300">
          Reports hub →
        </Link>
      </section>

      {sectorNote && (
        <section className="cc-glass-card border-slate-700/50 p-5">
          <h3 className="font-display text-sm font-semibold text-slate-300">
            Sector workforce context · {sectorNote.sector}
          </h3>
          <p className="mt-1 text-sm text-white">{sectorNote.headline}</p>
          <ul className="mt-2 list-inside list-disc text-xs text-slate-500">
            {sectorNote.focus.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <p className="mt-3 text-[10px] text-slate-600">
            Public-safe advisory — not industry certification or regulated HR claims.
          </p>
        </section>
      )}
    </div>
  );
}
