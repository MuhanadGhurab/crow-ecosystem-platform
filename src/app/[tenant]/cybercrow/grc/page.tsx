import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { getNcaControlDefinition } from "@/lib/constants/nca-compliance-controls";
import { routes } from "@/lib/routes";
import {
  getCybercrowGrcSummary,
  listTenantComplianceControlsWithEvidence,
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
    listTenantComplianceControlsWithEvidence(tenant.id, 3),
    listTenantGrcFindings(tenant.id),
  ]);
  const r = routes.tenant(slug).cybercrow;

  return (
    <div className="space-y-8">
      <PageHeader
        badge="CyberCrow"
        entity="cybercrow"
        title="GRC overview"
        description="Governance, risk, and compliance — NCA ECC control labels with evidence preview."
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

      <section className="cc-glass-card">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-medium text-violet-300">NCA-aligned controls</h3>
          <Link href={r.compliance} className="text-xs text-violet-400 hover:text-violet-300">
            Full list →
          </Link>
        </div>
        {controls.length === 0 ? (
          <div className="mt-4">
            <EmptyState
              title="No controls seeded"
              description="Provision the tenant or run CyberCrow baseline seed to populate NCA-aligned controls."
            />
          </div>
        ) : (
          <ul className="mt-4 space-y-4">
            {controls.map((c) => {
              const nca = getNcaControlDefinition(c.controlKey);
              return (
                <li
                  key={c.id}
                  className="rounded-cc-sm border border-violet-500/10 bg-violet-500/[0.03] p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="font-mono text-xs text-violet-300">{nca.frameworkId}</p>
                      <p className="mt-1 font-medium text-white">{nca.title}</p>
                      <p className="text-xs text-slate-500">
                        {nca.domain} · <span className="font-mono">{c.controlKey}</span>
                      </p>
                    </div>
                    <span className="text-sm text-slate-400">
                      {c.status} · {c._count.evidence} evidence
                    </span>
                  </div>
                  {c.evidence.length > 0 ? (
                    <ul className="mt-3 space-y-1 border-t border-white/5 pt-3 text-sm text-slate-400">
                      {c.evidence.map((e) => (
                        <li key={e.id} className="flex gap-2">
                          <span className="text-violet-500/80">•</span>
                          <span>{e.title}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-3 text-xs text-slate-600">No evidence uploaded yet.</p>
                  )}
                </li>
              );
            })}
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
            {findings.slice(0, 6).map((f) => (
              <li key={f.id} className="cc-list-item">
                <span className="text-white">{f.title}</span>
                <span className="text-slate-500">{f.status}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="text-xs text-slate-500">
        Summary metrics are live database counts. {summary.findingCount} total findings ·{" "}
        {summary.compliantCount} of {summary.controlCount} controls marked compliant.
      </p>

      <Link href={r.dashboard} className="text-sm text-cyan-400 hover:text-cyan-300">
        ← CyberCrow dashboard
      </Link>
    </div>
  );
}
