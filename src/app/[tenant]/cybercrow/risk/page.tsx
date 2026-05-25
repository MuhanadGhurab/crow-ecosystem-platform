import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { StatCard } from "@/components/ui/stat-card";
import { routes } from "@/lib/routes";
import { getCybercrowDashboardMetrics } from "@/lib/services/cybercrow-dashboard.service";
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
  const [scores, metrics] = await Promise.all([
    listTenantRiskScores(tenant.id),
    getCybercrowDashboardMetrics(tenant.id),
  ]);
  const r = routes.tenant(slug).cybercrow;

  return (
    <div className="space-y-8">
      <PageHeader
        badge="CyberCrow"
        entity="cybercrow"
        title="Risk posture"
        description="Aggregated risk score from incidents, events, and control status — transparent, not AI-generated."
      />

      <section className="cc-glass-card">
        <h3 className="text-sm font-medium text-violet-300">Current posture score: {metrics.riskScore}</h3>
        <p className="mt-2 text-sm text-slate-400">Contributors applied in order:</p>
        <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-slate-500">
          <li>Latest stored risk assessment row (if present), otherwise baseline 85</li>
          <li>−12 points per open incident ({metrics.openIncidentCount} open)</li>
          <li>−4 points per high/medium/critical event, capped at −24 ({metrics.highSeverityEventCount} events)</li>
          <li>Compliance average from NCA-aligned control status labels</li>
        </ul>
        <p className="mt-3 text-xs text-slate-600">
          Trend compares the computed score to the previous stored assessment or incident volume — no
          predictive model.
        </p>
      </section>

      {scores.length === 0 ? (
        <EmptyState
          title="No historical assessments"
          description="Point-in-time risk rows will appear when assessments are recorded. The dashboard still shows a derived score from live incident and event counts."
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
