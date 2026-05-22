import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { routes } from "@/lib/routes";
import {
  getCybercrowGrcSummary,
  listTenantComplianceControls,
  listTenantGrcFindings,
} from "@/lib/services/cybercrow-tenant.service";
import { getTenantBySlug } from "@/lib/services/tenant.service";

export default async function CybercrowGrcPage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: slug } = await params;
  const tenant = await getTenantBySlug(slug);
  if (!tenant) notFound();

  const [summary, controls, findings] = await Promise.all([
    getCybercrowGrcSummary(tenant.id),
    listTenantComplianceControls(tenant.id),
    listTenantGrcFindings(tenant.id),
  ]);
  const r = routes.tenant(slug).cybercrow;

  return (
    <div className="space-y-8">
      <PageHeader
        badge="CyberCrow"
        entity="cybercrow"
        title="GRC overview"
        description="Governance, risk, and compliance — counts from tenant controls, evidence, and findings."
      />

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-cc-sm border border-violet-500/20 bg-violet-500/5 p-4">
          <p className="text-xs text-slate-500">Controls</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-violet-200">{summary.controlCount}</p>
        </div>
        <div className="rounded-cc-sm border border-violet-500/20 bg-violet-500/5 p-4">
          <p className="text-xs text-slate-500">Compliant</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-teal-300">
            {summary.compliancePct != null ? `${summary.compliancePct}%` : "—"}
          </p>
        </div>
        <div className="rounded-cc-sm border border-violet-500/20 bg-violet-500/5 p-4">
          <p className="text-xs text-slate-500">Evidence items</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-indigo-200">{summary.evidenceCount}</p>
        </div>
        <div className="rounded-cc-sm border border-violet-500/20 bg-violet-500/5 p-4">
          <p className="text-xs text-slate-500">Open findings</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-amber-200">{summary.openFindings}</p>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="cc-glass-card">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-medium text-violet-300">Compliance controls</h3>
            <Link href={r.compliance} className="text-xs text-violet-400 hover:text-violet-300">
              Full list →
            </Link>
          </div>
          {controls.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">No controls seeded for this tenant.</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {controls.slice(0, 6).map((c) => (
                <li key={c.id} className="cc-list-item">
                  <span className="font-mono text-white">{c.controlKey}</span>
                  <span className="text-slate-500">
                    {c.status} · {c._count.evidence} evidence
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="cc-glass-card">
          <h3 className="text-sm font-medium text-violet-300">GRC findings</h3>
          {findings.length === 0 ? (
            <EmptyState
              title="No findings"
              description="GRC assessments will appear here after baseline seed or assessment import."
            />
          ) : (
            <ul className="mt-4 space-y-2">
              {findings.map((f) => (
                <li key={f.id} className="cc-list-item">
                  <span className="text-white">{f.title}</span>
                  <span className="text-slate-500">{f.status}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <p className="text-xs text-slate-500">
        Summary metrics are live database counts (not static demo cards). {summary.findingCount} total
        findings · {summary.compliantCount} of {summary.controlCount} controls marked compliant.
      </p>

      <Link href={r.dashboard} className="text-sm text-cyan-400 hover:text-cyan-300">
        ← CyberCrow dashboard
      </Link>
    </div>
  );
}
