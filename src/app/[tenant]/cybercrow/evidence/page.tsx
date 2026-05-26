import Link from "next/link";
import { notFound } from "next/navigation";
import { CybercrowEvidenceGapPanel } from "@/components/tenant/cybercrow/cybercrow-evidence-gap-panel";
import { CybercrowReportReadinessPanel } from "@/components/tenant/cybercrow/cybercrow-report-readiness-panel";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { routes } from "@/lib/routes";
import {
  evidenceSourceLabel,
  getEvidenceCatalog,
  getEvidenceGaps,
  getReportReadiness,
} from "@/lib/services/cybercrow-evidence-grc.service";
import { getEvidenceReadiness } from "@/lib/services/cybercrow-soc-workflow.service";
import { getCybercrowGrcSummary } from "@/lib/services/cybercrow-tenant.service";
import { getTenantBySlug } from "@/lib/services/tenant.service";

const STATUS_LABEL: Record<string, string> = {
  available: "Available",
  needs_review: "Needs review",
  recommended: "Recommended",
};

const STATUS_CLASS: Record<string, string> = {
  available: "text-teal-300 bg-teal-500/10 border-teal-500/20",
  needs_review: "text-amber-300 bg-amber-500/10 border-amber-500/20",
  recommended: "text-slate-400 bg-slate-500/10 border-slate-500/20",
};

export default async function CybercrowEvidencePage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: slug } = await params;
  const tenant = await getTenantBySlug(slug);
  if (!tenant) notFound();

  const [summary, catalog, gaps, readiness, report] = await Promise.all([
    getCybercrowGrcSummary(tenant.id),
    getEvidenceCatalog(tenant.id),
    getEvidenceGaps(tenant.id, slug),
    getEvidenceReadiness(tenant.id),
    getReportReadiness(tenant.id, slug),
  ]);
  const r = routes.tenant(slug).cybercrow;

  return (
    <div className="space-y-8">
      <PageHeader
        badge="CyberCrow"
        entity="cybercrow"
        title="Evidence repository"
        description="Evidence readiness catalog — control mapping and advisory gaps. Operator-managed."
      />

      <section className="rounded-lg border border-indigo-500/20 bg-indigo-950/15 px-4 py-3 text-sm text-indigo-100/90">
        <p className="font-medium text-indigo-300">Evidence readiness catalog</p>
        <p className="mt-1 text-xs text-slate-400">
          File upload and attestation sign-off workflows are not enabled in this phase. Rows are
          metadata titles linked to NCA-aligned controls. Use incidents, security events, and audit
          logs for operational evidence trails.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-cc-sm border border-violet-500/20 bg-violet-500/5 p-4">
          <p className="text-xs text-slate-500">Catalog items</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-indigo-200">{summary.evidenceCount}</p>
        </div>
        <div className="rounded-cc-sm border border-violet-500/20 bg-violet-500/5 p-4">
          <p className="text-xs text-slate-500">Mapped controls</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-violet-200">{summary.controlCount}</p>
        </div>
        <div className="rounded-cc-sm border border-violet-500/20 bg-violet-500/5 p-4">
          <p className="text-xs text-slate-500">Advisory gaps</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-amber-300">{gaps.length}</p>
        </div>
        <div className="rounded-cc-sm border border-violet-500/20 bg-violet-500/5 p-4">
          <p className="text-xs text-slate-500">Needs file review</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-slate-300">
            {catalog.filter((c) => !c.fileBacked).length}
          </p>
        </div>
      </section>

      <CybercrowEvidenceGapPanel gaps={gaps} />

      <section className="cc-glass-card">
        <h3 className="text-sm font-medium text-violet-300">Recommended evidence to collect</h3>
        <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-slate-400">
          {readiness.guidance.map((g) => (
            <li key={g}>{g}</li>
          ))}
        </ul>
        {readiness.incidentEvidenceHints.length > 0 ? (
          <>
            <p className="mt-4 text-xs font-medium text-slate-500">Open incident hints</p>
            <ul className="mt-2 space-y-1 text-xs text-slate-500">
              {readiness.incidentEvidenceHints.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </>
        ) : null}
      </section>

      <CybercrowReportReadinessPanel report={report} />

      {catalog.length === 0 ? (
        <EmptyState
          title="No evidence on file"
          description="Evidence rows appear when CyberCrow baseline seed or GRC provisioning attaches artifacts to controls."
        />
      ) : (
        <section className="space-y-2">
          <h3 className="text-sm font-medium text-violet-300">Evidence catalog</h3>
          <ul className="space-y-2">
            {catalog.map((e) => (
              <li key={e.id} className="cc-list-item flex-col !items-start gap-2">
                <div className="flex w-full flex-wrap items-start justify-between gap-2">
                  <span className="font-medium text-white">{e.title}</span>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${STATUS_CLASS[e.status] ?? STATUS_CLASS.recommended}`}
                  >
                    {STATUS_LABEL[e.status] ?? e.status}
                  </span>
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">
                  <span>
                    Domain: <span className="text-violet-300/80">{e.domain}</span>
                  </span>
                  <span>
                    Source: <span className="text-cyan-400/90">{evidenceSourceLabel(e.source)}</span>
                  </span>
                  <span>
                    Owner: <span className="text-slate-400">{e.owner}</span>
                  </span>
                  <span>
                    Control: <span className="font-mono text-violet-300/80">{e.controlKey}</span> ·{" "}
                    {e.controlStatus}
                  </span>
                </div>
                <span className="text-xs text-slate-600">
                  {e.frameworkId} · updated{" "}
                  {e.lastUpdated.toLocaleString("en-GB", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                  {e.fileBacked && e.storageKey ? (
                    <>
                      {" "}
                      · file ref <span className="font-mono">{e.storageKey}</span>
                    </>
                  ) : (
                    " · catalog metadata only (no uploaded file)"
                  )}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="flex flex-wrap gap-4 text-sm">
        <Link href={r.incidents} className="text-amber-400 hover:text-amber-300">
          Incidents (workflow) →
        </Link>
        <Link href={r.grc} className="text-violet-400 hover:text-violet-300">
          GRC overview →
        </Link>
        <Link href={r.compliance} className="text-cyan-400 hover:text-cyan-300">
          Compliance controls →
        </Link>
        <Link href={r.auditLogs} className="text-cyan-400 hover:text-cyan-300">
          Audit logs →
        </Link>
        <Link href={r.dashboard} className="text-cyan-400 hover:text-cyan-300">
          ← CyberCrow dashboard
        </Link>
      </div>
    </div>
  );
}
