import Link from "next/link";
import {
  CRM_CYBERCROW_EVIDENCE,
  CRM_CYBERCROW_RISKS,
  CRM_REPORT_KPI_SIGNALS,
  CRM_SAREA_PERSONAS,
  CRM_SECTOR_NOTES,
} from "@/lib/constants/crm-sales-module-depth";
import { routes } from "@/lib/routes";
import type { CrmCommercialReadinessSnapshot } from "@/lib/services/crm-sales-readiness.service";

type CrmOperationsReadinessPanelProps = {
  slug: string;
  snapshot: CrmCommercialReadinessSnapshot;
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

export function CrmOperationsReadinessPanel({
  slug,
  snapshot,
  cybercrowLive,
}: CrmOperationsReadinessPanelProps) {
  const r = routes.tenant(slug);
  const sectorNote = snapshot.sectorKey
    ? CRM_SECTOR_NOTES.find((n) => n.sector === snapshot.sectorKey)
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
          CRM readiness summary
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
          Commercial operations readiness — not a full CRM replacement, not marketing
          automation, and not automated privacy compliance.
        </p>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-xs text-slate-500">Accounts</dt>
            <dd className="text-lg font-medium text-white">{snapshot.accountCount}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Contacts</dt>
            <dd className="text-lg font-medium text-white">{snapshot.contactCount}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Accounts w/o contacts</dt>
            <dd className="text-lg font-medium text-white">{snapshot.accountsWithoutContacts}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">CRM-related open tasks</dt>
            <dd className="text-lg font-medium text-white">{snapshot.crmRelatedOpenTasks}</dd>
          </div>
        </dl>
      </section>

      <section className="cc-glass-card p-5">
        <h3 className="font-display text-sm font-semibold text-cyan-400">
          Request-to-account linkage
        </h3>
        <p className="mt-2 text-xs text-slate-500">
          Public implementation requests become blueprint context on the tenant — operators map
          that context to CRM accounts manually.
        </p>
        {snapshot.requestReferenceCode ? (
          <p className="mt-3 text-sm text-white">
            Linked request:{" "}
            <span className="font-mono text-cyan-300">{snapshot.requestReferenceCode}</span>
            {snapshot.requestStatus && (
              <span className="text-slate-500"> · {snapshot.requestStatus}</span>
            )}
          </p>
        ) : (
          <p className="mt-3 text-sm text-slate-500">
            No blueprint request on this tenant yet — add accounts when commercial intake exists.
          </p>
        )}
        {snapshot.salesEnabled && (
          <Link href={r.sales} className="mt-3 inline-block text-xs text-cyan-400 hover:text-cyan-300">
            Sales commercial readiness →
          </Link>
        )}
      </section>

      <section className="cc-glass-card p-5">
        <h3 className="font-display text-sm font-semibold text-cyan-400">
          Customer issue & escalation readiness
        </h3>
        <p className="mt-2 text-xs text-slate-500">
          Use tasks and workflows for escalations — advisory service coordination, not a full case
          management product.
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
          CRM workflow & task readiness
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
        <Link href={r.workflows} className="mt-3 inline-block text-xs text-cyan-400 hover:text-cyan-300">
          View workflows →
        </Link>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="cc-glass-card border-violet-500/15 p-5">
          <h3 className="font-display text-sm font-semibold text-violet-300">
            CyberCrow customer-data posture
          </h3>
          <p className="mt-2 text-xs text-slate-500">
            Advisory risk signals and evidence examples — not fraud detection, not certified
            audit, and not automated privacy compliance.
          </p>
          <p className="mt-2 text-xs text-violet-200/80">
            Status: {cybercrowLive ? "Initialized" : "Not initialized — setup recommended"}
          </p>
          <ul className="mt-3 list-inside list-disc text-xs text-slate-500">
            {CRM_CYBERCROW_RISKS.slice(0, 5).map((risk) => (
              <li key={risk}>{risk}</li>
            ))}
          </ul>
          <ul className="mt-3 list-inside list-disc text-xs text-slate-500">
            {CRM_CYBERCROW_EVIDENCE.slice(0, 4).map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap gap-3 text-xs">
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
            SAREA account-management experience
          </h3>
          <p className="mt-2 text-xs text-slate-500">
            RBAC controls access. SAREA adapts CRM density and navigation by profile.
          </p>
          <ul className="mt-3 max-h-48 space-y-2 overflow-y-auto text-xs">
            {CRM_SAREA_PERSONAS.map((p) => (
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
          {CRM_REPORT_KPI_SIGNALS.map((signal) => (
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
            Sector CRM context · {sectorNote.sector}
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
