import Link from "next/link";
import {
  LOGISTICS_CYBERCROW_EVIDENCE,
  LOGISTICS_CYBERCROW_RISKS,
  LOGISTICS_REPORT_KPI_SIGNALS,
  LOGISTICS_SAREA_PERSONAS,
  LOGISTICS_SECTOR_NOTES,
} from "@/lib/constants/logistics-module-depth";
import { routes } from "@/lib/routes";
import type { LogisticsOperationsReadinessSnapshot } from "@/lib/services/logistics-readiness.service";

type LogisticsOperationsReadinessPanelProps = {
  slug: string;
  snapshot: LogisticsOperationsReadinessSnapshot;
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

export function LogisticsOperationsReadinessPanel({
  slug,
  snapshot,
  cybercrowLive,
}: LogisticsOperationsReadinessPanelProps) {
  const r = routes.tenant(slug);
  const sectorNote = snapshot.sectorKey
    ? LOGISTICS_SECTOR_NOTES.find((n) => n.sector === snapshot.sectorKey)
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
          Logistics readiness summary
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
          Dispatch and delivery operations readiness — operator-managed coordination, not a live TMS,
          carrier API, GPS tracking, or automated dispatch.
        </p>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-xs text-slate-500">Outbound lanes</dt>
            <dd className="text-lg font-medium text-white">{snapshot.outboundLanes}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">SKUs (inventory signal)</dt>
            <dd className="text-lg font-medium text-white">{snapshot.totalSkus}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Logistics open tasks</dt>
            <dd className="text-lg font-medium text-white">{snapshot.logisticsRelatedOpenTasks}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Matched workflows</dt>
            <dd className="text-lg font-medium text-white">{snapshot.matchedWorkflows.length}</dd>
          </div>
        </dl>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="cc-glass-card p-5">
          <h3 className="font-display text-sm font-semibold text-cyan-400">
            Dispatch readiness
          </h3>
          <p className="mt-2 text-xs text-slate-500">
            Dispatch coordination uses warehouse outbound lanes and task queues — not autonomous
            dispatch or route optimization.
          </p>
          {snapshot.warehouseEnabled ? (
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between gap-2">
                <dt className="text-slate-500">Warehouse locations</dt>
                <dd className="text-white">{snapshot.warehouseLocations}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-slate-500">Outbound / inbound lanes</dt>
                <dd className="text-white">
                  {snapshot.outboundLanes} / {snapshot.inboundLanes}
                </dd>
              </div>
            </dl>
          ) : (
            <p className="mt-3 text-sm text-slate-500">
              Enable Warehouse for outbound dispatch prep and handoff lanes.
            </p>
          )}
        </section>

        <section className="cc-glass-card p-5">
          <h3 className="font-display text-sm font-semibold text-cyan-400">
            Delivery lifecycle readiness
          </h3>
          <p className="mt-2 text-xs text-slate-500">
            Status updates and exception paths are operator-managed — not live shipment tracking.
          </p>
          <p className="mt-3 text-sm text-slate-400">
            {snapshot.matchedWorkflows.length > 0
              ? `${snapshot.matchedWorkflows.length} logistics-related workflow(s) detected in tenant Workflows.`
              : "No logistics-keyword workflows yet — use recommended patterns below."}
          </p>
        </section>
      </div>

      <section className="cc-glass-card p-5">
        <h3 className="font-display text-sm font-semibold text-cyan-400">
          Warehouse-to-logistics handoff
        </h3>
        <p className="mt-2 text-xs text-slate-500">
          Outbound lane readiness bridges warehouse prep and dispatch coordination — advisory
          handoff, not WMS automation.
        </p>
        <div className="mt-3 flex flex-wrap gap-3 text-xs">
          {snapshot.warehouseEnabled && (
            <Link href={r.warehouse} className="text-cyan-400 hover:text-cyan-300">
              Warehouse hub →
            </Link>
          )}
          {snapshot.inventoryEnabled && (
            <Link href={r.inventory} className="text-cyan-400 hover:text-cyan-300">
              Inventory hub →
            </Link>
          )}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="cc-glass-card p-5">
          <h3 className="font-display text-sm font-semibold text-cyan-400">
            Inventory movement context
          </h3>
          <p className="mt-2 text-xs text-slate-500">
            SKU and low-stock signals inform material readiness for dispatch — not real-time stock
            guarantees.
          </p>
          {snapshot.inventoryEnabled ? (
            <>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between gap-2">
                  <dt className="text-slate-500">Low-stock SKUs</dt>
                  <dd className="text-amber-300">{snapshot.lowStockCount}</dd>
                </div>
              </dl>
              <Link href={r.inventory} className="mt-3 inline-block text-xs text-cyan-400 hover:text-cyan-300">
                Inventory readiness →
              </Link>
            </>
          ) : (
            <p className="mt-3 text-sm text-slate-500">Enable Inventory for stock context.</p>
          )}
        </section>

        <section className="cc-glass-card p-5">
          <h3 className="font-display text-sm font-semibold text-cyan-400">
            Procurement / supplier handoff
          </h3>
          <p className="mt-2 text-xs text-slate-500">
            Purchase requests and approved lines support inbound planning — not carrier procurement
            APIs.
          </p>
          {snapshot.procurementEnabled ? (
            <>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between gap-2">
                  <dt className="text-slate-500">Purchase requests</dt>
                  <dd className="text-white">{snapshot.procurementPrCount}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-slate-500">Approved / ordered</dt>
                  <dd className="text-teal-300">{snapshot.approvedPrCount}</dd>
                </div>
              </dl>
              <Link href={r.procurement} className="mt-3 inline-block text-xs text-cyan-400 hover:text-cyan-300">
                Procurement hub →
              </Link>
            </>
          ) : (
            <p className="mt-3 text-sm text-slate-500">Enable Procurement for supplier handoff.</p>
          )}
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="cc-glass-card p-5">
          <h3 className="font-display text-sm font-semibold text-cyan-400">
            CRM / customer context
          </h3>
          <p className="mt-2 text-xs text-slate-500">
            Accounts and contacts support delivery issues and escalations — not a customer portal.
          </p>
          {snapshot.crmEnabled ? (
            <>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between gap-2">
                  <dt className="text-slate-500">Accounts / contacts</dt>
                  <dd className="text-white">
                    {snapshot.crmAccountCount} / {snapshot.crmContactCount}
                  </dd>
                </div>
              </dl>
              {snapshot.accountsWithoutContacts > 0 && (
                <p className="mt-2 text-xs text-amber-200">
                  {snapshot.accountsWithoutContacts} account(s) without linked contacts.
                </p>
              )}
              <Link href={r.crm} className="mt-3 inline-block text-xs text-cyan-400 hover:text-cyan-300">
                CRM hub →
              </Link>
            </>
          ) : (
            <p className="mt-3 text-sm text-slate-500">Enable CRM for customer issue linkage.</p>
          )}
        </section>

        <section className="cc-glass-card p-5">
          <h3 className="font-display text-sm font-semibold text-cyan-400">
            Finance cost / billing readiness
          </h3>
          <p className="mt-2 text-xs text-slate-500">
            Open AR supports freight billing coordination — not automated freight costing or live
            payments.
          </p>
          {snapshot.financeEnabled ? (
            <>
              <p className="mt-3 text-sm text-white">
                Open AR signal: {formatSar(snapshot.openArSar)} SAR
              </p>
              <Link href={r.finance} className="mt-3 inline-block text-xs text-cyan-400 hover:text-cyan-300">
                Finance readiness →
              </Link>
            </>
          ) : (
            <p className="mt-3 text-sm text-slate-500">Enable Finance for billing handoff signals.</p>
          )}
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="cc-glass-card p-5">
          <h3 className="font-display text-sm font-semibold text-cyan-400">
            Exception / incident readiness
          </h3>
          <p className="mt-2 text-xs text-slate-500">
            Delivery exceptions and incidents use review workflows and CyberCrow evidence hooks —
            not real-time fraud detection.
          </p>
          <Link href={r.tasks} className="mt-3 inline-block text-xs text-cyan-400 hover:text-cyan-300">
            Tasks →
          </Link>
        </section>

        <section className="cc-glass-card p-5">
          <h3 className="font-display text-sm font-semibold text-cyan-400">
            Proof-of-delivery readiness
          </h3>
          <p className="mt-2 text-xs text-slate-500">
            POD review checklists and evidence posture — not live capture, OCR automation, or carrier
            POD APIs.
          </p>
          <p className="mt-3 text-sm text-slate-500">
            Future integrations could attach document review; current mode is operator-managed
            readiness only.
          </p>
        </section>
      </div>

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
            Logistics coordination looks aligned — keep warehouse outbound and exception workflows
            current.
          </p>
        )}
      </section>

      <section className="cc-glass-card p-5">
        <h3 className="font-display text-sm font-semibold text-cyan-400">
          Logistics workflow & task readiness
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
            No logistics-keyword workflows detected — patterns below are readiness recommendations.
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
          <Link href={r.reports} className="text-cyan-400 hover:text-cyan-300">
            Reports →
          </Link>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="cc-glass-card border-violet-500/15 p-5">
          <h3 className="font-display text-sm font-semibold text-violet-300">
            CyberCrow logistics posture
          </h3>
          <p className="mt-2 text-xs text-slate-500">
            Advisory risk signals and evidence examples — not GPS monitoring, route compliance
            automation, or certified audit.
          </p>
          <p className="mt-2 text-xs text-violet-200/80">
            Status: {cybercrowLive ? "Initialized" : "Not initialized — setup recommended"}
          </p>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium text-slate-400">Risk focus</p>
              <ul className="mt-1 list-inside list-disc text-xs text-slate-500">
                {LOGISTICS_CYBERCROW_RISKS.slice(0, 6).map((risk) => (
                  <li key={risk}>{risk}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400">Evidence readiness</p>
              <ul className="mt-1 list-inside list-disc text-xs text-slate-500">
                {LOGISTICS_CYBERCROW_EVIDENCE.slice(0, 6).map((e) => (
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
            SAREA logistics experience
          </h3>
          <p className="mt-2 text-xs text-slate-500">
            RBAC controls access. SAREA adapts logistics density and navigation by profile.
          </p>
          <ul className="mt-3 max-h-48 space-y-2 overflow-y-auto text-xs">
            {LOGISTICS_SAREA_PERSONAS.map((p) => (
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
          Readiness signals from enabled modules — no fabricated delivery charts or OTIF
          scorecards.
        </p>
        <ul className="mt-3 columns-1 gap-x-6 text-xs text-slate-500 sm:columns-2">
          {LOGISTICS_REPORT_KPI_SIGNALS.map((signal) => (
            <li key={signal} className="mb-1 break-inside-avoid">
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
          <h3 className="font-display text-sm font-semibold text-slate-300">Sector relevance</h3>
          <p className="mt-2 text-sm text-cyan-200/90">{sectorNote.headline}</p>
          <ul className="mt-2 list-inside list-disc text-xs text-slate-500">
            {sectorNote.focus.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
