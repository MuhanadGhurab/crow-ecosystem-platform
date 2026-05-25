import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { getNcaControlDefinition } from "@/lib/constants/nca-compliance-controls";
import { routes } from "@/lib/routes";
import { getEvidenceReadiness } from "@/lib/services/cybercrow-soc-workflow.service";
import {
  getCybercrowGrcSummary,
  listTenantComplianceEvidence,
} from "@/lib/services/cybercrow-tenant.service";
import { getTenantBySlug } from "@/lib/services/tenant.service";

export default async function CybercrowEvidencePage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: slug } = await params;
  const tenant = await getTenantBySlug(slug);
  if (!tenant) notFound();

  const [summary, evidence, readiness] = await Promise.all([
    getCybercrowGrcSummary(tenant.id),
    listTenantComplianceEvidence(tenant.id),
    getEvidenceReadiness(tenant.id),
  ]);
  const r = routes.tenant(slug).cybercrow;

  return (
    <div className="space-y-8">
      <PageHeader
        badge="CyberCrow"
        entity="cybercrow"
        title="Evidence repository"
        description="Compliance evidence linked to NCA-aligned controls — readiness-oriented, read-only catalog."
      />

      <section className="rounded-lg border border-indigo-500/20 bg-indigo-950/15 px-4 py-3 text-sm text-indigo-100/90">
        <p className="font-medium text-indigo-300">Advisory evidence readiness</p>
        <p className="mt-1 text-xs text-slate-400">
          Items are stored against control keys at provision or seed time. Upload workflows and
          attestation sign-off are not enforced in this phase — use incidents and audit logs for
          operational evidence trails.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-cc-sm border border-violet-500/20 bg-violet-500/5 p-4">
          <p className="text-xs text-slate-500">Evidence items</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-indigo-200">{summary.evidenceCount}</p>
        </div>
        <div className="rounded-cc-sm border border-violet-500/20 bg-violet-500/5 p-4">
          <p className="text-xs text-slate-500">Mapped controls</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-violet-200">{summary.controlCount}</p>
        </div>
        <div className="rounded-cc-sm border border-violet-500/20 bg-violet-500/5 p-4">
          <p className="text-xs text-slate-500">Controls missing evidence</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-amber-300">
            {readiness.controlsMissingEvidence.length}
          </p>
        </div>
      </section>

      {readiness.controlsMissingEvidence.length > 0 && (
        <section className="cc-glass-card border-amber-500/15">
          <h3 className="text-sm font-medium text-amber-300">Evidence gaps (advisory)</h3>
          <ul className="mt-3 space-y-1 text-xs text-slate-400">
            {readiness.controlsMissingEvidence.map((c) => (
              <li key={c.controlKey}>
                <span className="font-mono text-violet-300/80">{c.controlKey}</span> · {c.status}
              </li>
            ))}
          </ul>
        </section>
      )}

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

      {evidence.length === 0 ? (
        <EmptyState
          title="No evidence on file"
          description="Evidence rows appear when CyberCrow baseline seed or GRC provisioning attaches artifacts to controls."
        />
      ) : (
        <ul className="space-y-2">
          {evidence.map((e) => {
            const nca = getNcaControlDefinition(e.control.controlKey);
            return (
              <li key={e.id} className="cc-list-item flex-col !items-start gap-1">
                <span className="font-medium text-white">{e.title}</span>
                <span className="text-xs text-slate-400">
                  {nca.frameworkId} · {nca.title} · control{" "}
                  <span className="font-mono text-violet-300/80">{e.control.controlKey}</span> ·{" "}
                  {e.control.status}
                </span>
                <span className="text-xs text-slate-500">
                  {e.createdAt.toLocaleString("en-GB", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                  {e.storageKey ? (
                    <>
                      {" "}
                      · <span className="font-mono text-slate-600">{e.storageKey}</span>
                    </>
                  ) : null}
                </span>
              </li>
            );
          })}
        </ul>
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
        <Link href={r.dashboard} className="text-cyan-400 hover:text-cyan-300">
          ← CyberCrow dashboard
        </Link>
      </div>
    </div>
  );
}
