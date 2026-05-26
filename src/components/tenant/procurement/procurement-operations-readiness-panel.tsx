import Link from "next/link";
import {
  PROCUREMENT_CYBERCROW_EVIDENCE,
  PROCUREMENT_CYBERCROW_RISKS,
  PROCUREMENT_REPORT_KPI_SIGNALS,
  PROCUREMENT_SAREA_PERSONAS,
  PROCUREMENT_SECTOR_NOTES,
} from "@/lib/constants/procurement-module-depth";
import { routes } from "@/lib/routes";
import type { ProcurementOperationsReadinessSnapshot } from "@/lib/services/procurement-readiness.service";

type ProcurementOperationsReadinessPanelProps = {
  slug: string;
  snapshot: ProcurementOperationsReadinessSnapshot;
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

function formatSar(amount: number) {
  return new Intl.NumberFormat("en-SA", { maximumFractionDigits: 0 }).format(amount);
}

export function ProcurementOperationsReadinessPanel({
  slug,
  snapshot,
  cybercrowLive,
}: ProcurementOperationsReadinessPanelProps) {
  const r = routes.tenant(slug);
  const sectorNote = snapshot.sectorKey
    ? PROCUREMENT_SECTOR_NOTES.find((n) => n.sector === snapshot.sectorKey)
    : null;

  const readinessAccent =
    snapshot.readinessLevel === "operational"
      ? "teal"
      : snapshot.readinessLevel === "building"
        ? "amber"
        : undefined;

  return (
    <div className="space-y-6">
      <section className="cc-glass-card border-amber-500/15 p-5">
        <h3 className="font-display text-sm font-semibold text-amber-300">
          Procurement readiness summary
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
          Supplier and purchase operations readiness — operator-managed coordination, not a full
          purchasing suite or live supplier payments.
        </p>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-xs text-slate-500">Purchase requests</dt>
            <dd className="text-lg font-medium text-white">{snapshot.requestCount}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Open / in review</dt>
            <dd className="text-lg font-medium text-white">
              {snapshot.draftCount + snapshot.submittedCount}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">PR value SAR</dt>
            <dd className="text-lg font-medium text-white">{formatSar(snapshot.totalAmountSar)}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Procurement open tasks</dt>
            <dd className="text-lg font-medium text-white">{snapshot.procurementRelatedOpenTasks}</dd>
          </div>
        </dl>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="cc-glass-card p-5">
          <h3 className="font-display text-sm font-semibold text-cyan-400">
            Purchase request readiness
          </h3>
          <p className="mt-2 text-xs text-slate-500">
            PR lines track status, priority, and SAR amounts for coordination — not paid invoices.
          </p>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between gap-2">
              <dt className="text-slate-500">Draft</dt>
              <dd className="text-white">{snapshot.draftCount}</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-slate-500">Submitted</dt>
              <dd className="text-amber-300">{snapshot.submittedCount}</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-slate-500">Approved</dt>
              <dd className="text-teal-300">{snapshot.approvedCount}</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-slate-500">Urgent</dt>
              <dd className="text-amber-300">{snapshot.urgentCount}</dd>
            </div>
          </dl>
        </section>

        <section className="cc-glass-card p-5">
          <h3 className="font-display text-sm font-semibold text-cyan-400">
            Supplier coordination
          </h3>
          <p className="mt-2 text-xs text-slate-500">
            Vendor names on PRs support supplier coordination — not supplier risk scoring or a
            vendor marketplace.
          </p>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between gap-2">
              <dt className="text-slate-500">Distinct vendors (on PRs)</dt>
              <dd className="text-white">{snapshot.uniqueVendorCount}</dd>
            </div>
          </dl>
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="cc-glass-card p-5">
          <h3 className="font-display text-sm font-semibold text-cyan-400">Finance handoff</h3>
          <p className="mt-2 text-xs text-slate-500">
            Link finance references on PRs for AP coordination — Finance does not execute live
            supplier payments here.
          </p>
          {snapshot.financeEnabled ? (
            <>
              {snapshot.requestsWithoutFinanceLink > 0 && (
                <p className="mt-2 text-xs text-amber-200">
                  {snapshot.requestsWithoutFinanceLink} PR(s) without finance reference.
                </p>
              )}
              <Link href={r.finance} className="mt-3 inline-block text-xs text-cyan-400 hover:text-cyan-300">
                Finance readiness hub →
              </Link>
            </>
          ) : (
            <p className="mt-3 text-sm text-slate-500">Enable Finance for spend handoff signals.</p>
          )}
        </section>

        <section className="cc-glass-card p-5">
          <h3 className="font-display text-sm font-semibold text-cyan-400">
            Inventory & warehouse linkage
          </h3>
          <p className="mt-2 text-xs text-slate-500">
            SKU and receiving references connect procurement to stock and hub operations.
          </p>
          {snapshot.inventoryEnabled || snapshot.warehouseEnabled ? (
            <>
              {snapshot.requestsWithoutInventoryLink > 0 && snapshot.inventoryEnabled && (
                <p className="mt-2 text-xs text-amber-200">
                  {snapshot.requestsWithoutInventoryLink} PR(s) without inventory SKU reference.
                </p>
              )}
              <div className="mt-3 flex flex-wrap gap-3 text-xs">
                {snapshot.inventoryEnabled && (
                  <Link href={r.inventory} className="text-cyan-400 hover:text-cyan-300">
                    Inventory →
                  </Link>
                )}
                {snapshot.warehouseEnabled && (
                  <Link href={r.warehouse} className="text-cyan-400 hover:text-cyan-300">
                    Warehouse →
                  </Link>
                )}
              </div>
            </>
          ) : (
            <p className="mt-3 text-sm text-slate-500">
              Enable Inventory or Warehouse for receiving handoff when stock matters.
            </p>
          )}
        </section>
      </div>

      <section className="cc-glass-card p-5">
        <h3 className="font-display text-sm font-semibold text-cyan-400">Approval readiness</h3>
        <p className="mt-2 text-xs text-slate-500">
          Purchase review uses existing tasks and workflows — not automated approval or payment
          release.
        </p>
        <dl className="mt-3 grid gap-3 sm:grid-cols-3 text-sm">
          <div>
            <dt className="text-xs text-slate-500">Open tasks (workspace)</dt>
            <dd className="text-lg text-white">{snapshot.openTaskCount}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Procurement-keyword tasks</dt>
            <dd className="text-lg text-white">{snapshot.procurementRelatedOpenTasks}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Matched workflows</dt>
            <dd className="text-lg text-white">{snapshot.matchedWorkflows.length}</dd>
          </div>
        </dl>
        <div className="mt-4 flex flex-wrap gap-3 text-xs">
          <Link href={r.tasks} className="text-cyan-400 hover:text-cyan-300">
            Tasks →
          </Link>
          <Link href={r.workflows} className="text-cyan-400 hover:text-cyan-300">
            Workflows →
          </Link>
        </div>
      </section>

      <section className="cc-glass-card p-5">
        <h3 className="font-display text-sm font-semibold text-cyan-400">Next recommended actions</h3>
        {snapshot.recommendedActions.length > 0 ? (
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-300">
            {snapshot.recommendedActions.map((action) => (
              <li key={action}>{action}</li>
            ))}
          </ol>
        ) : (
          <p className="mt-3 text-sm text-slate-500">
            Procurement structure looks coordinated — keep finance and inventory references current.
          </p>
        )}
      </section>

      <section className="cc-glass-card p-5">
        <h3 className="font-display text-sm font-semibold text-cyan-400">
          Procurement workflow & task readiness
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
            No procurement-keyword workflows detected — patterns below are readiness recommendations.
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
            CyberCrow procurement posture
          </h3>
          <p className="mt-2 text-xs text-slate-500">
            Advisory risk signals and evidence examples — not fraud detection, not supplier risk
            scoring, and not certified audit.
          </p>
          <p className="mt-2 text-xs text-violet-200/80">
            Status: {cybercrowLive ? "Initialized" : "Not initialized — setup recommended"}
          </p>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium text-slate-400">Risk focus</p>
              <ul className="mt-1 list-inside list-disc text-xs text-slate-500">
                {PROCUREMENT_CYBERCROW_RISKS.slice(0, 5).map((risk) => (
                  <li key={risk}>{risk}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400">Evidence readiness</p>
              <ul className="mt-1 list-inside list-disc text-xs text-slate-500">
                {PROCUREMENT_CYBERCROW_EVIDENCE.slice(0, 5).map((e) => (
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
            SAREA procurement experience
          </h3>
          <p className="mt-2 text-xs text-slate-500">
            RBAC controls access. SAREA adapts procurement density and navigation by profile.
          </p>
          <ul className="mt-3 max-h-48 space-y-2 overflow-y-auto text-xs">
            {PROCUREMENT_SAREA_PERSONAS.map((p) => (
              <li key={p.persona} className="border-b border-slate-800/60 pb-2">
                <span className="font-medium text-rose-200">{p.persona}</span>
                <span className="text-slate-600"> · {p.audience}</span>
                <p className="text-slate-500">{p.experience}</p>
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
          Readiness signals from enabled modules — no fabricated spend charts or supplier scorecards.
        </p>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2 text-xs text-slate-400">
          {PROCUREMENT_REPORT_KPI_SIGNALS.map((signal) => (
            <li key={signal} className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-amber-500/60" />
              {signal}
            </li>
          ))}
        </ul>
        {snapshot.reportsEnabled && (
          <Link href={r.reports} className="mt-3 inline-block text-xs text-cyan-400 hover:text-cyan-300">
            Reports hub →
          </Link>
        )}
      </section>

      {sectorNote && (
        <section className="cc-glass-card border-slate-700/50 p-5">
          <h3 className="font-display text-sm font-semibold text-slate-300">
            Sector procurement context · {sectorNote.sector}
          </h3>
          <p className="mt-1 text-sm text-white">{sectorNote.headline}</p>
          <ul className="mt-2 list-inside list-disc text-xs text-slate-500">
            {sectorNote.focus.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <p className="mt-3 text-[10px] text-slate-600">
            Public-safe advisory — not legal, payment, or supplier certification.
          </p>
        </section>
      )}
    </div>
  );
}
