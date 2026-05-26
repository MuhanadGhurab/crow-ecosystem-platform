import Link from "next/link";
import {
  SALES_CYBERCROW_EVIDENCE,
  SALES_CYBERCROW_RISKS,
  SALES_REPORT_KPI_SIGNALS,
  SALES_SAREA_PERSONAS,
  SALES_SECTOR_NOTES,
} from "@/lib/constants/crm-sales-module-depth";
import { routes } from "@/lib/routes";
import type { SalesCommercialReadinessSnapshot } from "@/lib/services/crm-sales-readiness.service";

type SalesCommercialReadinessPanelProps = {
  slug: string;
  snapshot: SalesCommercialReadinessSnapshot;
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

export function SalesCommercialReadinessPanel({
  slug,
  snapshot,
  cybercrowLive,
}: SalesCommercialReadinessPanelProps) {
  const r = routes.tenant(slug);
  const sectorNote = snapshot.sectorKey
    ? SALES_SECTOR_NOTES.find((n) => n.sector === snapshot.sectorKey)
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
          Sales readiness summary
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
          Commercial coordination — pipeline SAR is advisory only, not recognized revenue, and
          not live invoicing.
        </p>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-xs text-slate-500">Pipeline lines</dt>
            <dd className="text-lg font-medium text-white">{snapshot.opportunityCount}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Pipeline SAR</dt>
            <dd className="text-lg font-medium text-cyan-300">
              {snapshot.salesEnabled ? `${formatSar(snapshot.pipelineSar)} SAR` : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Won SAR</dt>
            <dd className="text-lg font-medium text-teal-300">
              {snapshot.salesEnabled ? `${formatSar(snapshot.wonSar)} SAR` : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Sales-related open tasks</dt>
            <dd className="text-lg font-medium text-white">{snapshot.salesRelatedOpenTasks}</dd>
          </div>
        </dl>
      </section>

      <section className="cc-glass-card p-5">
        <h3 className="font-display text-sm font-semibold text-cyan-400">
          Opportunity & proposal readiness
        </h3>
        <p className="mt-2 text-xs text-slate-500">
          Operator-managed opportunities — proposal handoff from implementation requests is
          advisory — not automated CPQ and not contract signing.
        </p>
        {snapshot.requestReferenceCode && (
          <p className="mt-3 text-sm text-white">
            Blueprint request:{" "}
            <span className="font-mono text-cyan-300">{snapshot.requestReferenceCode}</span>
          </p>
        )}
        {snapshot.opportunitiesWithoutAccount > 0 && (
          <p className="mt-2 text-xs text-amber-200">
            {snapshot.opportunitiesWithoutAccount} line(s) without CRM account — link for
            traceability.
          </p>
        )}
        {snapshot.crmEnabled && (
          <Link href={r.crm} className="mt-3 inline-block text-xs text-cyan-400 hover:text-cyan-300">
            CRM account context →
          </Link>
        )}
      </section>

      <section className="cc-glass-card p-5">
        <h3 className="font-display text-sm font-semibold text-cyan-400">Finance handoff</h3>
        <p className="mt-2 text-xs text-slate-500">
          Won and pipeline amounts inform finance coordination — finance does not auto-create
          invoices or collect payments in this phase.
        </p>
        {snapshot.financeEnabled ? (
          <Link href={r.finance} className="mt-3 inline-block text-xs text-amber-300 hover:text-amber-200">
            Finance readiness hub →
          </Link>
        ) : (
          <p className="mt-3 text-sm text-slate-500">Enable Finance module for handoff readiness.</p>
        )}
      </section>

      <section className="cc-glass-card p-5">
        <h3 className="font-display text-sm font-semibold text-cyan-400">Approval readiness</h3>
        <p className="mt-2 text-xs text-slate-500">
          Commercial approvals use existing tasks and workflows — not automated discount engines.
        </p>
        <div className="mt-3 flex flex-wrap gap-3 text-xs">
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
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-300">
          {snapshot.recommendedActions.map((action) => (
            <li key={action}>{action}</li>
          ))}
        </ol>
      </section>

      <section className="cc-glass-card p-5">
        <h3 className="font-display text-sm font-semibold text-cyan-400">
          Sales workflow readiness
        </h3>
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
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="cc-glass-card border-violet-500/15 p-5">
          <h3 className="font-display text-sm font-semibold text-violet-300">
            CyberCrow commercial posture
          </h3>
          <p className="mt-2 text-xs text-slate-500">
            Advisory commercial approval and customer-data risks — not AI lead scoring, not lead scoring,
            and not certified audit.
          </p>
          <ul className="mt-3 list-inside list-disc text-xs text-slate-500">
            {SALES_CYBERCROW_RISKS.slice(0, 5).map((risk) => (
              <li key={risk}>{risk}</li>
            ))}
          </ul>
          <ul className="mt-3 list-inside list-disc text-xs text-slate-500">
            {SALES_CYBERCROW_EVIDENCE.slice(0, 4).map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap gap-3 text-xs">
            <Link href={r.cybercrow.grc} className="text-violet-300 hover:text-violet-200">
              GRC →
            </Link>
            <Link href={r.cybercrow.auditLogs} className="text-violet-300 hover:text-violet-200">
              Audit logs →
            </Link>
          </div>
        </section>

        <section className="cc-glass-card border-rose-500/15 p-5">
          <h3 className="font-display text-sm font-semibold text-rose-300">
            SAREA commercial experience
          </h3>
          <ul className="mt-3 max-h-48 space-y-2 overflow-y-auto text-xs">
            {SALES_SAREA_PERSONAS.map((p) => (
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
        <ul className="mt-3 grid gap-2 sm:grid-cols-2 text-xs text-slate-400">
          {SALES_REPORT_KPI_SIGNALS.map((signal) => (
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
            Sector sales context · {sectorNote.sector}
          </h3>
          <p className="mt-1 text-sm text-white">{sectorNote.headline}</p>
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
