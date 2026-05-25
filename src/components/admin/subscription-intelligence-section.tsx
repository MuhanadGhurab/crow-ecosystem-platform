import Link from "next/link";
import { StatCard } from "@/components/ui/stat-card";
import { PLAN_DISPLAY_NAMES } from "@/lib/subscription/plan-capabilities";
import { routes } from "@/lib/routes";
import type { SubscriptionPlatformSummary } from "@/lib/services/subscription-capability.service";
import type { SubscriptionTierKey } from "@/lib/constants/subscriptions";

const TIER_KEYS: SubscriptionTierKey[] = ["startup", "growth", "enterprise"];

export function SubscriptionIntelligenceSection({
  summary,
}: {
  summary: SubscriptionPlatformSummary;
}) {
  const totalTenants =
    summary.planDistribution.startup +
    summary.planDistribution.growth +
    summary.planDistribution.enterprise;

  return (
    <section className="cc-glass-card !p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-slate-400">
            Subscription intelligence
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Plan distribution and capability readiness — advisory visibility, not billing enforcement.
          </p>
        </div>
        <Link href={routes.admin.subscriptions} className="text-sm text-cyan-400 hover:text-cyan-300">
          Subscription catalog →
        </Link>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {TIER_KEYS.map((key) => (
          <StatCard
            key={key}
            label={PLAN_DISPLAY_NAMES[key]}
            value={summary.planDistribution[key]}
            hint={totalTenants > 0 ? `${Math.round((summary.planDistribution[key] / totalTenants) * 100)}%` : undefined}
            accent={key === "enterprise" ? "violet" : key === "growth" ? "teal" : "cyan"}
          />
        ))}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Plan health · healthy"
          value={summary.planHealthSummary.healthy}
          hint="within recommended bands"
          accent="teal"
        />
        <StatCard
          label="Near limit"
          value={summary.planHealthSummary.nearLimit}
          hint="≥80% of advisory band"
          accent="star"
        />
        <StatCard
          label="Over recommended"
          value={summary.planHealthSummary.overLimit}
          accent="cyan"
        />
        <StatCard
          label="Upgrade recommended"
          value={summary.planHealthSummary.upgradeRecommended}
          accent="violet"
        />
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Capability ready"
          value={summary.readinessReadyCount}
          hint="no watch-level warnings"
          accent="teal"
        />
        <StatCard
          label="Needs review"
          value={summary.readinessWatchCount}
          hint="missing sub or mismatch"
          accent="star"
        />
        <StatCard
          label="Active subscriptions"
          value={summary.subscriptionHealth.active}
          accent="cyan"
        />
        <StatCard
          label="Without Stripe link"
          value={summary.subscriptionHealth.withoutStripe}
          hint="provisioned locally"
          accent="violet"
        />
      </div>

      {(summary.tenantsNearLimit.length > 0 ||
        summary.tenantsOverRecommendedLimit.length > 0 ||
        summary.tenantsEnterpriseLikeOnLowerPlans.length > 0 ||
        summary.tenantsMissingSubscription.length > 0 ||
        summary.tenantsWithPlanKeyMismatch.length > 0) && (
        <div className="mt-6 space-y-4 border-t border-cyan-500/10 pt-4">
          {summary.tenantsNearLimit.length > 0 && (
            <UsageIntelList
              title={`Near plan limits (${summary.tenantsNearLimit.length})`}
              rows={summary.tenantsNearLimit}
            />
          )}
          {summary.tenantsOverRecommendedLimit.length > 0 && (
            <UsageIntelList
              title={`Over recommended limits (${summary.tenantsOverRecommendedLimit.length})`}
              rows={summary.tenantsOverRecommendedLimit}
            />
          )}
          {summary.tenantsEnterpriseLikeOnLowerPlans.length > 0 && (
            <UsageIntelList
              title={`Enterprise-like on lower plans (${summary.tenantsEnterpriseLikeOnLowerPlans.length})`}
              rows={summary.tenantsEnterpriseLikeOnLowerPlans}
            />
          )}
          {summary.tenantsMissingSubscription.length > 0 && (
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-amber-400/90">
                Missing TenantSubscription ({summary.tenantsMissingSubscription.length})
              </p>
              <ul className="mt-2 space-y-1 text-sm text-slate-400">
                {summary.tenantsMissingSubscription.slice(0, 5).map((t) => (
                  <li key={t.id}>
                    <Link href={routes.admin.tenant(t.id)} className="text-cyan-400 hover:text-cyan-300">
                      {t.displayName}
                    </Link>{" "}
                    <span className="font-mono text-xs text-slate-500">/{t.slug}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {summary.tenantsWithPlanKeyMismatch.length > 0 && (
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-amber-400/90">
                Plan key mismatch ({summary.tenantsWithPlanKeyMismatch.length})
              </p>
              <ul className="mt-2 space-y-1 text-sm text-slate-400">
                {summary.tenantsWithPlanKeyMismatch.slice(0, 5).map((t) => (
                  <li key={t.id}>
                    <Link href={routes.admin.tenant(t.id)} className="text-cyan-400 hover:text-cyan-300">
                      {t.displayName}
                    </Link>{" "}
                    — tenant {t.tenantPlan} vs subscription {t.subscriptionPlan}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function UsageIntelList({
  title,
  rows,
}: {
  title: string;
  rows: SubscriptionPlatformSummary["tenantsNearLimit"];
}) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wider text-amber-400/90">{title}</p>
      <ul className="mt-2 space-y-1 text-sm text-slate-400">
        {rows.slice(0, 5).map((t) => (
          <li key={t.id}>
            <Link href={routes.admin.tenant(t.id) + "?tab=plan"} className="text-cyan-400 hover:text-cyan-300">
              {t.displayName}
            </Link>{" "}
            <span className="font-mono text-xs text-slate-500">/{t.slug}</span>
            <span className="text-xs text-slate-500">
              {" "}
              · {PLAN_DISPLAY_NAMES[t.planKey]} · {t.overallStatus}
            </span>
            {t.highlight && <span className="block text-xs text-amber-400/80">{t.highlight}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}
