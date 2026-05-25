import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { StatCard } from "@/components/ui/stat-card";
import { routes } from "@/lib/routes";
import { getRiskPostureDetail } from "@/lib/services/cybercrow-soc-workflow.service";
import { listTenantRiskScores } from "@/lib/services/cybercrow-tenant.service";
import { getTenantBySlug } from "@/lib/services/tenant.service";

export default async function CybercrowRiskPage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: slug } = await params;
  const tenant = await getTenantBySlug(slug);
  if (!tenant) notFound();
  const [scores, posture] = await Promise.all([
    listTenantRiskScores(tenant.id),
    getRiskPostureDetail(tenant.id),
  ]);
  const r = routes.tenant(slug).cybercrow;

  return (
    <div className="space-y-8">
      <PageHeader
        badge="CyberCrow"
        entity="cybercrow"
        title="Risk posture"
        description="Rule-based advisory score from incidents, events, controls, and evidence — transparent, not AI-generated."
      />

      <section className="cc-glass-card">
        <h3 className="text-sm font-medium text-violet-300">
          Current posture score: {posture.score} / 100
        </h3>
        <p className="mt-1 text-xs text-slate-500">
          Trend: {posture.trend} · Formula is deterministic and explainable below.
        </p>
        <ul className="mt-4 space-y-2">
          {posture.contributors.map((c) => (
            <li key={c.label} className="rounded-cc-sm border border-violet-500/10 px-3 py-2 text-sm">
              <div className="flex flex-wrap justify-between gap-2">
                <span className="font-medium text-white">{c.label}</span>
                <span className="text-xs text-slate-500">{c.impact}</span>
              </div>
              <p className="mt-1 text-xs text-slate-400">{c.detail}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="cc-glass-card">
        <h3 className="text-sm font-medium text-violet-300">Recommended actions</h3>
        <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-slate-400">
          {posture.recommendedActions.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
        <div className="mt-4 flex flex-wrap gap-3 text-xs">
          <Link href={r.securityEvents} className="text-violet-400">
            Security events →
          </Link>
          <Link href={r.incidents} className="text-violet-400">
            Incidents →
          </Link>
          <Link href={r.evidence} className="text-indigo-400">
            Evidence →
          </Link>
        </div>
      </section>

      {scores.length === 0 ? (
        <EmptyState
          title="No historical assessments"
          description="Point-in-time risk rows appear when assessments are recorded. The score above is derived from live counts."
        />
      ) : (
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-slate-400">Stored assessments</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {scores.map((s) => (
              <StatCard
                key={s.id}
                label={s.createdAt.toLocaleDateString("en-GB", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
                value={String(s.score)}
                accent="violet"
                entity="cybercrow"
              />
            ))}
          </div>
        </div>
      )}

      <Link href={r.dashboard} className="text-sm text-cyan-400 hover:text-cyan-300">
        ← CyberCrow dashboard
      </Link>
    </div>
  );
}
