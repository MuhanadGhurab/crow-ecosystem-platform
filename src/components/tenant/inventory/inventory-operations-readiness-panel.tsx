import Link from "next/link";
import {
  INVENTORY_CYBERCROW_EVIDENCE,
  INVENTORY_CYBERCROW_RISKS,
  INVENTORY_REPORT_KPI_SIGNALS,
  INVENTORY_SAREA_PERSONAS,
  INVENTORY_WAREHOUSE_SECTOR_NOTES,
} from "@/lib/constants/inventory-warehouse-module-depth";
import { routes } from "@/lib/routes";
import type { InventoryOperationsReadinessSnapshot } from "@/lib/services/inventory-warehouse-readiness.service";

type InventoryOperationsReadinessPanelProps = {
  slug: string;
  snapshot: InventoryOperationsReadinessSnapshot;
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

export function InventoryOperationsReadinessPanel({
  slug,
  snapshot,
  cybercrowLive,
}: InventoryOperationsReadinessPanelProps) {
  const r = routes.tenant(slug);
  const sectorNote = snapshot.sectorKey
    ? INVENTORY_WAREHOUSE_SECTOR_NOTES.find((n) => n.sector === snapshot.sectorKey)
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
        <h3 className="font-display text-sm font-semibold text-cyan-300">
          Inventory readiness summary
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
          Stock and material operations readiness — operator-managed coordination, not automated
          stock synchronization or inventory accuracy guarantees.
        </p>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-xs text-slate-500">SKUs</dt>
            <dd className="text-lg font-medium text-white">{snapshot.totalSkus}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Low-stock signals</dt>
            <dd className="text-lg font-medium text-amber-300">{snapshot.lowStockCount}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Stock locations</dt>
            <dd className="text-lg font-medium text-white">{snapshot.locationCount}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Inventory open tasks</dt>
            <dd className="text-lg font-medium text-white">{snapshot.inventoryRelatedOpenTasks}</dd>
          </div>
        </dl>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="cc-glass-card p-5">
          <h3 className="font-display text-sm font-semibold text-cyan-400">
            Item / category readiness
          </h3>
          <p className="mt-2 text-xs text-slate-500">
            SKU catalog and categories support coordination — not barcode catalog automation.
          </p>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between gap-2">
              <dt className="text-slate-500">Distinct categories</dt>
              <dd className="text-white">{snapshot.distinctCategories}</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-slate-500">Units on hand (signal)</dt>
              <dd className="text-white">{snapshot.qtyOnHand}</dd>
            </div>
          </dl>
        </section>

        <section className="cc-glass-card p-5">
          <h3 className="font-display text-sm font-semibold text-cyan-400">
            Stock adjustment readiness
          </h3>
          <p className="mt-2 text-xs text-slate-500">
            Adjustments and low-stock flags use operator review — not real-time stock guarantees.
          </p>
          {snapshot.lowStockCount > 0 ? (
            <p className="mt-2 text-xs text-amber-200">
              {snapshot.lowStockCount} SKU(s) at or below reorder — review replenishment requests.
            </p>
          ) : (
            <p className="mt-3 text-sm text-slate-500">
              No low-stock signals in current records — add items when material tracking starts.
            </p>
          )}
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="cc-glass-card p-5">
          <h3 className="font-display text-sm font-semibold text-cyan-400">
            Procurement receiving handoff
          </h3>
          <p className="mt-2 text-xs text-slate-500">
            Purchase requests with inventory refs support receiving readiness — not automated GRN.
          </p>
          {snapshot.procurementEnabled ? (
            <>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between gap-2">
                  <dt className="text-slate-500">PRs (procurement)</dt>
                  <dd className="text-white">{snapshot.procurementPrCount}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-slate-500">With inventory ref</dt>
                  <dd className="text-teal-300">{snapshot.prsWithInventoryRef}</dd>
                </div>
              </dl>
              {snapshot.prsWithoutInventoryRef > 0 && (
                <p className="mt-2 text-xs text-amber-200">
                  {snapshot.prsWithoutInventoryRef} PR(s) without inventory SKU reference.
                </p>
              )}
              <Link
                href={r.procurement}
                className="mt-3 inline-block text-xs text-cyan-400 hover:text-cyan-300"
              >
                Procurement hub →
              </Link>
            </>
          ) : (
            <p className="mt-3 text-sm text-slate-500">Enable Procurement for receiving handoff.</p>
          )}
        </section>

        <section className="cc-glass-card p-5">
          <h3 className="font-display text-sm font-semibold text-cyan-400">Warehouse linkage</h3>
          <p className="mt-2 text-xs text-slate-500">
            Hub receiving and movement align with warehouse locations when both modules are on.
          </p>
          {snapshot.warehouseEnabled ? (
            <Link href={r.warehouse} className="mt-3 inline-block text-xs text-cyan-400 hover:text-cyan-300">
              Warehouse readiness hub →
            </Link>
          ) : (
            <p className="mt-3 text-sm text-slate-500">Enable Warehouse for hub lane coordination.</p>
          )}
        </section>
      </div>

      <section className="cc-glass-card p-5">
        <h3 className="font-display text-sm font-semibold text-cyan-400">
          Logistics & replenishment readiness
        </h3>
        <p className="mt-2 text-xs text-slate-500">
          Dispatch and replenishment use advisory handoffs — not carrier APIs or automated
          replenishment engines.
        </p>
        {snapshot.logisticsEnabled ? (
          <Link href={r.logistics} className="mt-3 inline-block text-xs text-cyan-400 hover:text-cyan-300">
            Logistics hub →
          </Link>
        ) : (
          <p className="mt-3 text-sm text-slate-500">Enable Logistics for outbound handoff signals.</p>
        )}
        {snapshot.financeEnabled && (
          <Link href={r.finance} className="mt-2 inline-block text-xs text-slate-500 hover:text-slate-400">
            Finance cost / readiness context →
          </Link>
        )}
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
            Inventory structure looks coordinated — keep procurement refs and count workflows current.
          </p>
        )}
      </section>

      <section className="cc-glass-card p-5">
        <h3 className="font-display text-sm font-semibold text-cyan-400">
          Inventory workflow & task readiness
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
            No inventory-keyword workflows detected — patterns below are readiness recommendations.
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
        <div className="mt-4 flex flex-wrap gap-3 text-xs">
          <Link href={r.tasks} className="text-cyan-400 hover:text-cyan-300">
            Tasks →
          </Link>
          <Link href={r.workflows} className="text-cyan-400 hover:text-cyan-300">
            Workflows →
          </Link>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="cc-glass-card border-violet-500/15 p-5">
          <h3 className="font-display text-sm font-semibold text-violet-300">
            CyberCrow inventory posture
          </h3>
          <p className="mt-2 text-xs text-slate-500">
            Advisory risk signals and evidence examples — not fraud detection, not certified audit,
            and not automated stock assurance.
          </p>
          <p className="mt-2 text-xs text-violet-200/80">
            Status: {cybercrowLive ? "Initialized" : "Not initialized — setup recommended"}
          </p>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium text-slate-400">Risk focus</p>
              <ul className="mt-1 list-inside list-disc text-xs text-slate-500">
                {INVENTORY_CYBERCROW_RISKS.slice(0, 5).map((risk) => (
                  <li key={risk}>{risk}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400">Evidence readiness</p>
              <ul className="mt-1 list-inside list-disc text-xs text-slate-500">
                {INVENTORY_CYBERCROW_EVIDENCE.slice(0, 5).map((e) => (
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
            SAREA inventory experience
          </h3>
          <p className="mt-2 text-xs text-slate-500">
            RBAC controls access. SAREA adapts inventory density and navigation by profile.
          </p>
          <ul className="mt-3 max-h-48 space-y-2 overflow-y-auto text-xs">
            {INVENTORY_SAREA_PERSONAS.map((p) => (
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
          Readiness signals from enabled modules — no fabricated stock charts or accuracy scorecards.
        </p>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2 text-xs text-slate-400">
          {INVENTORY_REPORT_KPI_SIGNALS.map((signal) => (
            <li key={signal} className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-cyan-500/60" />
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
            Sector inventory context · {sectorNote.sector}
          </h3>
          <p className="mt-1 text-sm text-white">{sectorNote.headline}</p>
          <ul className="mt-2 list-inside list-disc text-xs text-slate-500">
            {sectorNote.inventoryFocus.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <p className="mt-3 text-[10px] text-slate-600">
            Public-safe advisory — not WMS certification or live stock accuracy claims.
          </p>
        </section>
      )}
    </div>
  );
}
