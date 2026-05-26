import Link from "next/link";
import {
  INVENTORY_WAREHOUSE_SECTOR_NOTES,
  WAREHOUSE_CYBERCROW_EVIDENCE,
  WAREHOUSE_CYBERCROW_RISKS,
  WAREHOUSE_REPORT_KPI_SIGNALS,
  WAREHOUSE_SAREA_PERSONAS,
} from "@/lib/constants/inventory-warehouse-module-depth";
import { routes } from "@/lib/routes";
import type { WarehouseOperationsReadinessSnapshot } from "@/lib/services/inventory-warehouse-readiness.service";

type WarehouseOperationsReadinessPanelProps = {
  slug: string;
  snapshot: WarehouseOperationsReadinessSnapshot;
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

export function WarehouseOperationsReadinessPanel({
  slug,
  snapshot,
  cybercrowLive,
}: WarehouseOperationsReadinessPanelProps) {
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
      <section className="cc-glass-card border-teal-500/15 p-5">
        <h3 className="font-display text-sm font-semibold text-teal-300">
          Warehouse readiness summary
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
          Hub operations readiness — operator-managed receiving, putaway, and dispatch coordination,
          not warehouse automation or IoT.
        </p>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-xs text-slate-500">Locations</dt>
            <dd className="text-lg font-medium text-white">{snapshot.totalLocations}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Hub sites</dt>
            <dd className="text-lg font-medium text-white">{snapshot.siteCount}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Inbound / outbound lanes</dt>
            <dd className="text-lg font-medium text-white">
              {snapshot.inboundLanes} / {snapshot.outboundLanes}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Warehouse open tasks</dt>
            <dd className="text-lg font-medium text-white">{snapshot.warehouseRelatedOpenTasks}</dd>
          </div>
        </dl>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="cc-glass-card p-5">
          <h3 className="font-display text-sm font-semibold text-teal-400">
            Location / zone readiness
          </h3>
          <p className="mt-2 text-xs text-slate-500">
            Sites, zones, and bins structure hub work — not RFID or live location tracking.
          </p>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between gap-2">
              <dt className="text-slate-500">Cold storage lanes</dt>
              <dd className="text-white">{snapshot.coldStorageLanes}</dd>
            </div>
          </dl>
        </section>

        <section className="cc-glass-card p-5">
          <h3 className="font-display text-sm font-semibold text-teal-400">
            Receiving & putaway readiness
          </h3>
          <p className="mt-2 text-xs text-slate-500">
            Inbound lanes support receiving checklists from procurement — not automated putaway robots.
          </p>
          {snapshot.inboundLanes > 0 ? (
            <p className="mt-2 text-xs text-teal-200">
              {snapshot.inboundLanes} inbound lane(s) configured for receiving coordination.
            </p>
          ) : (
            <p className="mt-3 text-sm text-slate-500">
              Add inbound movement kinds when receiving workflows start.
            </p>
          )}
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="cc-glass-card p-5">
          <h3 className="font-display text-sm font-semibold text-teal-400">
            Picking / dispatch readiness
          </h3>
          <p className="mt-2 text-xs text-slate-500">
            Outbound lanes prepare dispatch handoff — not carrier API automation.
          </p>
          {snapshot.outboundLanes > 0 ? (
            <p className="mt-2 text-xs text-teal-200">
              {snapshot.outboundLanes} outbound lane(s) for picking / dispatch prep.
            </p>
          ) : (
            <p className="mt-3 text-sm text-slate-500">Add outbound lanes when dispatch prep begins.</p>
          )}
        </section>

        <section className="cc-glass-card p-5">
          <h3 className="font-display text-sm font-semibold text-teal-400">
            Inventory movement readiness
          </h3>
          <p className="mt-2 text-xs text-slate-500">
            Stock context lives on Inventory — warehouse coordinates lane-level movement.
          </p>
          {snapshot.inventoryEnabled ? (
            <Link href={r.inventory} className="mt-3 inline-block text-xs text-cyan-400 hover:text-cyan-300">
              Inventory hub →
            </Link>
          ) : (
            <p className="mt-3 text-sm text-slate-500">Enable Inventory for SKU movement context.</p>
          )}
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="cc-glass-card p-5">
          <h3 className="font-display text-sm font-semibold text-teal-400">Procurement handoff</h3>
          <p className="mt-2 text-xs text-slate-500">
            Approved or in-flight PRs signal inbound receiving readiness — operator-managed receipts.
          </p>
          {snapshot.procurementEnabled ? (
            <>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between gap-2">
                  <dt className="text-slate-500">PRs (procurement)</dt>
                  <dd className="text-white">{snapshot.procurementPrCount}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-slate-500">Approved / in-flight</dt>
                  <dd className="text-teal-300">{snapshot.approvedPrCount}</dd>
                </div>
              </dl>
              <Link
                href={r.procurement}
                className="mt-3 inline-block text-xs text-cyan-400 hover:text-cyan-300"
              >
                Procurement hub →
              </Link>
            </>
          ) : (
            <p className="mt-3 text-sm text-slate-500">Enable Procurement for inbound PR handoff.</p>
          )}
        </section>

        <section className="cc-glass-card p-5">
          <h3 className="font-display text-sm font-semibold text-teal-400">Logistics handoff</h3>
          <p className="mt-2 text-xs text-slate-500">
            Logistics consumes warehouse readiness for dispatch and delivery coordination.
          </p>
          {snapshot.logisticsEnabled ? (
            <Link href={r.logistics} className="mt-3 inline-block text-xs text-cyan-400 hover:text-cyan-300">
              Logistics hub →
            </Link>
          ) : (
            <p className="mt-3 text-sm text-slate-500">Enable Logistics for dispatch handoff.</p>
          )}
        </section>
      </div>

      <section className="cc-glass-card p-5">
        <h3 className="font-display text-sm font-semibold text-teal-400">Next recommended actions</h3>
        {snapshot.recommendedActions.length > 0 ? (
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-300">
            {snapshot.recommendedActions.map((action) => (
              <li key={action}>{action}</li>
            ))}
          </ol>
        ) : (
          <p className="mt-3 text-sm text-slate-500">
            Warehouse structure looks coordinated — keep logistics handoff and movement workflows current.
          </p>
        )}
      </section>

      <section className="cc-glass-card p-5">
        <h3 className="font-display text-sm font-semibold text-teal-400">
          Warehouse workflow & task readiness
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
            No warehouse-keyword workflows detected — patterns below are readiness recommendations.
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
          <Link href={r.tasks} className="text-teal-400 hover:text-teal-300">
            Tasks →
          </Link>
          <Link href={r.workflows} className="text-teal-400 hover:text-teal-300">
            Workflows →
          </Link>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="cc-glass-card border-violet-500/15 p-5">
          <h3 className="font-display text-sm font-semibold text-violet-300">
            CyberCrow warehouse posture
          </h3>
          <p className="mt-2 text-xs text-slate-500">
            Advisory risk signals and evidence examples — not fraud detection, not certified audit,
            and not autonomous warehouse controls.
          </p>
          <p className="mt-2 text-xs text-violet-200/80">
            Status: {cybercrowLive ? "Initialized" : "Not initialized — setup recommended"}
          </p>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium text-slate-400">Risk focus</p>
              <ul className="mt-1 list-inside list-disc text-xs text-slate-500">
                {WAREHOUSE_CYBERCROW_RISKS.slice(0, 5).map((risk) => (
                  <li key={risk}>{risk}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400">Evidence readiness</p>
              <ul className="mt-1 list-inside list-disc text-xs text-slate-500">
                {WAREHOUSE_CYBERCROW_EVIDENCE.slice(0, 5).map((e) => (
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
            SAREA warehouse experience
          </h3>
          <p className="mt-2 text-xs text-slate-500">
            RBAC controls access. SAREA adapts warehouse density and navigation by profile.
          </p>
          <ul className="mt-3 max-h-48 space-y-2 overflow-y-auto text-xs">
            {WAREHOUSE_SAREA_PERSONAS.map((p) => (
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
        <h3 className="font-display text-sm font-semibold text-teal-400">
          Reporting & KPI readiness
        </h3>
        <p className="mt-2 text-xs text-slate-500">
          Readiness signals from enabled modules — no fabricated throughput charts or WMS dashboards.
        </p>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2 text-xs text-slate-400">
          {WAREHOUSE_REPORT_KPI_SIGNALS.map((signal) => (
            <li key={signal} className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-teal-500/60" />
              {signal}
            </li>
          ))}
        </ul>
        {snapshot.reportsEnabled && (
          <Link href={r.reports} className="mt-3 inline-block text-xs text-teal-400 hover:text-teal-300">
            Reports hub →
          </Link>
        )}
      </section>

      {sectorNote && (
        <section className="cc-glass-card border-slate-700/50 p-5">
          <h3 className="font-display text-sm font-semibold text-slate-300">
            Sector warehouse context · {sectorNote.sector}
          </h3>
          <p className="mt-1 text-sm text-white">{sectorNote.headline}</p>
          <ul className="mt-2 list-inside list-disc text-xs text-slate-500">
            {sectorNote.warehouseFocus.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <p className="mt-3 text-[10px] text-slate-600">
            Public-safe advisory — not WMS certification or IoT claims.
          </p>
        </section>
      )}
    </div>
  );
}
