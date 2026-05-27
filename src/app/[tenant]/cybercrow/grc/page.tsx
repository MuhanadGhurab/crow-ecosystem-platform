import Link from "next/link";
import { notFound } from "next/navigation";
import { CybercrowControlReadinessPanel } from "@/components/tenant/cybercrow/cybercrow-control-readiness-panel";
import { CybercrowEvidenceGapPanel } from "@/components/tenant/cybercrow/cybercrow-evidence-gap-panel";
import { CybercrowOperatorNextActions } from "@/components/tenant/cybercrow/cybercrow-operator-next-actions";
import { CybercrowPageHeader } from "@/components/tenant/cybercrow/cybercrow-page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { routes } from "@/lib/routes";
import {
  getControlEvidenceMapping,
  getEvidenceGaps,
  getGrcControlReadiness,
} from "@/lib/services/cybercrow-evidence-grc.service";
import {
  getCybercrowGrcSummary,
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

  const [summary, domains, mapping, gaps, findings] = await Promise.all([
    getCybercrowGrcSummary(tenant.id),
    getGrcControlReadiness(tenant.id),
    getControlEvidenceMapping(tenant.id),
    getEvidenceGaps(tenant.id, slug),
    listTenantGrcFindings(tenant.id),
  ]);
  const r = routes.tenant(slug).cybercrow;

  return (
    <div className="space-y-8">
      <CybercrowPageHeader tenantSlug={slug} area="grc" title="GRC overview" />

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-cc-sm border border-violet-500/20 bg-violet-500/5 p-4">
          <p className="text-xs text-slate-500">Controls</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-violet-200">{summary.controlCount}</p>
        </div>
        <div className="rounded-cc-sm border border-violet-500/20 bg-violet-500/5 p-4">
          <p className="text-xs text-slate-500">Ready for review (compliant + evidence)</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-teal-300">
            {summary.compliancePct != null ? `${summary.compliancePct}%` : "—"}
          </p>
        </div>
        <div className="rounded-cc-sm border border-violet-500/20 bg-violet-500/5 p-4">
          <p className="text-xs text-slate-500">Evidence items</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-indigo-200">{summary.evidenceCount}</p>
        </div>
        <div className="rounded-cc-sm border border-violet-500/20 bg-violet-500/5 p-4">
          <p className="text-xs text-slate-500">Evidence gaps</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-amber-200">{gaps.length}</p>
        </div>
      </section>

      <CybercrowEvidenceGapPanel gaps={gaps} maxItems={6} />

      {domains.length === 0 ? (
        <EmptyState
          title="No controls seeded"
          description="Provision the tenant or run CyberCrow baseline seed to populate NCA-aligned controls."
        />
      ) : (
        <CybercrowControlReadinessPanel domains={domains} mapping={mapping} showMapping />
      )}

      <section className="cc-glass-card">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-medium text-violet-300">GRC findings</h3>
          <Link href={r.evidence} className="text-xs text-indigo-400 hover:text-indigo-300">
            Evidence gaps →
          </Link>
        </div>
        {findings.length === 0 ? (
          <EmptyState
            title="No findings"
            description="Findings appear after baseline seed or operator assessment import."
          />
        ) : (
          <ul className="mt-4 space-y-2">
            {findings.slice(0, 8).map((f) => (
              <li key={f.id} className="cc-list-item">
                <span className="text-white">{f.title}</span>
                <span className="text-slate-500">{f.status}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="text-xs text-slate-500">
        Live counts: {summary.openFindings} open finding(s) · {summary.compliantCount} compliant of{" "}
        {summary.controlCount} controls. Review recommended before external assessor packs.
      </p>

      <CybercrowOperatorNextActions
        items={[
          ...(gaps.length > 0
            ? [
                {
                  action: "map_control" as const,
                  href: r.evidence,
                  detail: `${gaps.length} evidence mapping gap(s)`,
                },
              ]
            : []),
          {
            action: "collect_evidence",
            href: r.evidence,
            detail: "Attach artifacts to control domains",
          },
          {
            action: "review_risk",
            href: r.risk,
            detail: "Review posture contributors",
          },
        ]}
      />

      <div className="flex flex-wrap gap-4 text-sm">
        <Link href={r.compliance} className="text-cyan-400 hover:text-cyan-300">
          Compliance controls →
        </Link>
        <Link href={r.evidence} className="text-indigo-400 hover:text-indigo-300">
          Evidence repository →
        </Link>
        <Link href={r.dashboard} className="text-cyan-400 hover:text-cyan-300">
          ← CyberCrow dashboard
        </Link>
      </div>
    </div>
  );
}
