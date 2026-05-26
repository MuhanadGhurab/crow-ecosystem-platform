import Link from "next/link";
import {
  FINANCE_CYBERCROW_EVIDENCE,
  FINANCE_CYBERCROW_RISKS,
  FINANCE_REPORT_KPI_SIGNALS,
  FINANCE_SAREA_PERSONAS,
  FINANCE_SECTOR_NOTES,
} from "@/lib/constants/finance-module-depth";
import { routes } from "@/lib/routes";
import type { FinanceOperationsReadinessSnapshot } from "@/lib/services/finance-readiness.service";

type FinanceOperationsReadinessPanelProps = {
  slug: string;
  snapshot: FinanceOperationsReadinessSnapshot;
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

export function FinanceOperationsReadinessPanel({
  slug,
  snapshot,
  cybercrowLive,
}: FinanceOperationsReadinessPanelProps) {
  const r = routes.tenant(slug);
  const sectorNote = snapshot.sectorKey
    ? FINANCE_SECTOR_NOTES.find((n) => n.sector === snapshot.sectorKey)
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
          Finance readiness summary
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
          Financial operations coordination — not a full accounting platform, not a tax engine,
          and not a live payment processor.
        </p>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-xs text-slate-500">Ledger lines</dt>
            <dd className="text-lg font-medium text-white">{snapshot.financeEntryCount}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Open AR</dt>
            <dd className="text-lg font-medium text-white">
              {snapshot.financeEnabled ? `${formatSar(snapshot.arOpenSar)} SAR` : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Open AP</dt>
            <dd className="text-lg font-medium text-white">
              {snapshot.financeEnabled ? `${formatSar(snapshot.apOpenSar)} SAR` : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Finance-related open tasks</dt>
            <dd className="text-lg font-medium text-white">{snapshot.financeRelatedOpenTasks}</dd>
          </div>
        </dl>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="cc-glass-card p-5">
          <h3 className="font-display text-sm font-semibold text-cyan-400">
            Revenue & billing readiness
          </h3>
          <p className="mt-2 text-xs text-slate-500">
            Sales contributes pipeline and won value — billing coordination is operator-managed.
          </p>
          {snapshot.salesEnabled ? (
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between gap-2">
                <dt className="text-slate-500">Opportunities</dt>
                <dd className="text-white">{snapshot.salesOpportunityCount}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-slate-500">Pipeline SAR</dt>
                <dd className="text-cyan-300">{formatSar(snapshot.salesPipelineSar)}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-slate-500">Won SAR</dt>
                <dd className="text-teal-300">{formatSar(snapshot.salesWonSar)}</dd>
              </div>
            </dl>
          ) : (
            <p className="mt-3 text-sm text-slate-500">
              Sales module not enabled — enable for revenue readiness signals.
            </p>
          )}
          <Link href={r.sales} className="mt-3 inline-block text-xs text-cyan-400 hover:text-cyan-300">
            Sales module →
          </Link>
        </section>

        <section className="cc-glass-card p-5">
          <h3 className="font-display text-sm font-semibold text-cyan-400">
            Procurement & expense linkage
          </h3>
          <p className="mt-2 text-xs text-slate-500">
            Purchase requests feed expense readiness; link finance references when available.
          </p>
          {snapshot.procurementEnabled ? (
            <>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between gap-2">
                  <dt className="text-slate-500">Purchase requests</dt>
                  <dd className="text-white">{snapshot.procurementRequestCount}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-slate-500">Open PRs</dt>
                  <dd className="text-amber-300">{snapshot.procurementOpenCount}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-slate-500">PR value SAR</dt>
                  <dd className="text-white">{formatSar(snapshot.procurementAmountSar)}</dd>
                </div>
              </dl>
              {snapshot.procurementWithoutFinanceLink > 0 && (
                <p className="mt-2 text-xs text-amber-200">
                  {snapshot.procurementWithoutFinanceLink} PR(s) without finance reference.
                </p>
              )}
            </>
          ) : (
            <p className="mt-3 text-sm text-slate-500">
              Procurement module not enabled — enable for spend intake signals.
            </p>
          )}
          <Link
            href={r.procurement}
            className="mt-3 inline-block text-xs text-cyan-400 hover:text-cyan-300"
          >
            Procurement module →
          </Link>
        </section>
      </div>

      <section className="cc-glass-card p-5">
        <h3 className="font-display text-sm font-semibold text-cyan-400">Approval readiness</h3>
        <p className="mt-2 text-xs text-slate-500">
          Financial review uses existing tasks and workflows — not automated payment release.
        </p>
        <dl className="mt-3 grid gap-3 sm:grid-cols-3 text-sm">
          <div>
            <dt className="text-xs text-slate-500">Active workflows</dt>
            <dd className="text-lg text-white">{snapshot.activeWorkflowCount}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Open tasks (workspace)</dt>
            <dd className="text-lg text-white">{snapshot.openTaskCount}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Finance-keyword workflows</dt>
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

      <section className="cc-glass-card border-slate-700/40 p-5">
        <h3 className="font-display text-sm font-semibold text-slate-300">
          Plan & subscription advisory
        </h3>
        <p className="mt-2 text-xs text-slate-500">
          Plan entitlements are advisory in this phase. No live checkout or payment activation is
          implied on this page.
        </p>
        <p className="mt-2 text-sm text-white">
          Current plan: {snapshot.planDisplayName ?? "Not resolved"}
        </p>
        {snapshot.planKeyMismatch && (
          <p className="mt-2 text-xs text-amber-200">
            Plan key mismatch detected — review subscription alignment (advisory).
          </p>
        )}
        {snapshot.billingCheckoutConfigured && (
          <p className="mt-2 text-xs text-slate-600">
            Billing API keys may be configured in the environment — tenant checkout remains
            operator-controlled and is not activated by this module depth work.
          </p>
        )}
        <Link
          href={r.settingsPlan}
          className="mt-3 inline-block text-xs text-slate-400 hover:text-slate-300"
        >
          Plan settings (advisory) →
        </Link>
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
          Finance workflow & task readiness
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
            No finance-keyword workflows detected — patterns below are readiness recommendations.
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
            CyberCrow financial posture
          </h3>
          <p className="mt-2 text-xs text-slate-500">
            Advisory risk signals and evidence examples — not fraud detection, not certified
            audit, and not autonomous financial controls.
          </p>
          <p className="mt-2 text-xs text-violet-200/80">
            Status: {cybercrowLive ? "Initialized" : "Not initialized — setup recommended"}
          </p>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium text-slate-400">Risk focus</p>
              <ul className="mt-1 list-inside list-disc text-xs text-slate-500">
                {FINANCE_CYBERCROW_RISKS.slice(0, 5).map((risk) => (
                  <li key={risk}>{risk}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400">Evidence readiness</p>
              <ul className="mt-1 list-inside list-disc text-xs text-slate-500">
                {FINANCE_CYBERCROW_EVIDENCE.slice(0, 5).map((e) => (
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
            SAREA finance experience
          </h3>
          <p className="mt-2 text-xs text-slate-500">
            RBAC controls access. SAREA adapts finance density and navigation by profile.
          </p>
          <ul className="mt-3 max-h-48 space-y-2 overflow-y-auto text-xs">
            {FINANCE_SAREA_PERSONAS.map((p) => (
              <li key={p.persona} className="border-b border-slate-800/60 pb-2">
                <span className="font-medium text-rose-200">{p.persona}</span>
                <span className="text-slate-600"> · {p.audience}</span>
                <p className="text-slate-500">{p.financeExperience}</p>
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
          Readiness signals from enabled modules — no fabricated revenue charts.
        </p>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2 text-xs text-slate-400">
          {FINANCE_REPORT_KPI_SIGNALS.map((signal) => (
            <li key={signal} className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-amber-500/60" />
              {signal}
            </li>
          ))}
        </ul>
        {snapshot.reportsEnabled && (
          <p className="mt-3 text-xs text-slate-500">
            Reports roll-up includes {snapshot.reportsFinanceEntries} finance ledger line
            {snapshot.reportsFinanceEntries === 1 ? "" : "s"} when finance is enabled.
          </p>
        )}
        <Link href={r.reports} className="mt-3 inline-block text-xs text-cyan-400 hover:text-cyan-300">
          Reports hub →
        </Link>
      </section>

      {sectorNote && (
        <section className="cc-glass-card border-slate-700/50 p-5">
          <h3 className="font-display text-sm font-semibold text-slate-300">
            Sector finance context · {sectorNote.sector}
          </h3>
          <p className="mt-1 text-sm text-white">{sectorNote.headline}</p>
          <ul className="mt-2 list-inside list-disc text-xs text-slate-500">
            {sectorNote.focus.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <p className="mt-3 text-[10px] text-slate-600">
            Public-safe advisory — not tax, legal, or payment certification.
          </p>
        </section>
      )}
    </div>
  );
}
