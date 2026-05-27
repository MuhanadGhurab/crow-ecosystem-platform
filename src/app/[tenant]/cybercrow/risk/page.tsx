import Link from "next/link";
import { notFound } from "next/navigation";
import { CybercrowOperatorNextActions } from "@/components/tenant/cybercrow/cybercrow-operator-next-actions";
import { CybercrowPageHeader } from "@/components/tenant/cybercrow/cybercrow-page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { StatCard } from "@/components/ui/stat-card";
import { routes } from "@/lib/routes";
import { getRiskGrcSignals } from "@/lib/services/cybercrow-evidence-grc.service";
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
  const [scores, posture, grcSignals] = await Promise.all([
    listTenantRiskScores(tenant.id),
    getRiskPostureDetail(tenant.id),
    getRiskGrcSignals(tenant.id, slug),
  ]);
  const r = routes.tenant(slug).cybercrow;

  return (
    <div className="space-y-8">
      <CybercrowPageHeader tenantSlug={slug} area="risk" title="Risk posture" />

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

      <section className="cc-glass-card border-indigo-500/15">
        <h3 className="text-sm font-medium text-indigo-300">Evidence & GRC signals</h3>
        <p className="mt-1 text-xs text-slate-500">
          Rule-based linkage to evidence gaps, incidents, events, and compliance — not AI scoring.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-cc-sm border border-white/5 px-3 py-2">
            <p className="text-[10px] text-slate-600">Evidence gaps</p>
            <p className="text-lg font-semibold tabular-nums text-amber-300">{grcSignals.gapCount}</p>
          </div>
          <div className="rounded-cc-sm border border-white/5 px-3 py-2">
            <p className="text-[10px] text-slate-600">Open incidents</p>
            <p className="text-lg font-semibold tabular-nums text-rose-300">
              {grcSignals.openIncidents}
            </p>
          </div>
          <div className="rounded-cc-sm border border-white/5 px-3 py-2">
            <p className="text-[10px] text-slate-600">Events pending review</p>
            <p className="text-lg font-semibold tabular-nums text-violet-300">
              {grcSignals.pendingReviewEvents}
            </p>
          </div>
          <div className="rounded-cc-sm border border-white/5 px-3 py-2">
            <p className="text-[10px] text-slate-600">Controls w/o evidence</p>
            <p className="text-lg font-semibold tabular-nums text-slate-300">
              {grcSignals.controlsWithoutEvidence}
            </p>
          </div>
        </div>
        <ul className="mt-4 list-inside list-disc space-y-1 text-sm text-slate-400">
          {grcSignals.summaryLines.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        <div className="mt-4 flex flex-wrap gap-3 text-xs">
          <Link href={r.evidence} className="text-indigo-400">
            Evidence gaps →
          </Link>
          <Link href={r.grc} className="text-violet-400">
            GRC readiness →
          </Link>
          <Link href={r.compliance} className="text-cyan-400">
            Compliance →
          </Link>
        </div>
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

      <CybercrowOperatorNextActions
        items={[
          ...(grcSignals.pendingReviewEvents > 0
            ? [
                {
                  action: "review_event" as const,
                  href: r.securityEvents,
                  detail: `${grcSignals.pendingReviewEvents} event(s) pending review`,
                },
              ]
            : []),
          ...(grcSignals.gapCount > 0
            ? [
                {
                  action: "collect_evidence" as const,
                  href: r.evidence,
                  detail: `${grcSignals.gapCount} evidence gap(s)`,
                },
              ]
            : []),
          {
            action: "map_control",
            href: r.grc,
            detail: "GRC control mapping",
          },
        ]}
      />

      <Link href={r.dashboard} className="text-sm text-cyan-400 hover:text-cyan-300">
        ← CyberCrow dashboard
      </Link>
    </div>
  );
}
