import {
  CAPABILITY_MIN_TIER,
  PLAN_DISPLAY_NAMES,
  PLAN_CAPABILITY_PROFILES,
  advisoryHintForCapability,
  advisoryLabelForHint,
  type CapabilityKey,
} from "@/lib/subscription/plan-capabilities";
import { TenantUsageSignalsPanel } from "@/components/admin/tenant-usage-signals-panel";
import type { CapabilityReadinessResult } from "@/lib/services/capability-readiness.service";
import type { TenantCapabilitySnapshot } from "@/lib/services/subscription-capability.service";
import type { TenantUsageSignals } from "@/lib/services/usage-signals.service";
import type { TenantBillingAlignment } from "@/lib/services/subscription-billing-alignment.service";
import { planLabel } from "@/lib/catalog-labels";

const HIGHLIGHT_CAPABILITIES: CapabilityKey[] = [
  "microsoft_entra_sso",
  "scim_provisioning",
  "custom_workflows",
  "advanced_analytics",
  "full_grc",
  "executive_command_center",
  "full_organizational_intelligence",
  "operational_blueprint",
];

function capabilityListLabel(key: CapabilityKey): string {
  return key.replace(/_/g, " ");
}

function formatDate(d: Date | null | undefined): string {
  if (!d) return "—";
  return d.toLocaleDateString(undefined, { dateStyle: "medium" });
}

export function TenantPlanPanel({
  snapshot,
  readiness,
  usageSignals,
  billing,
  checkedAt,
}: {
  snapshot: TenantCapabilitySnapshot;
  readiness: CapabilityReadinessResult;
  usageSignals?: TenantUsageSignals | null;
  billing?: TenantBillingAlignment | null;
  checkedAt?: Date;
}) {
  const profile = PLAN_CAPABILITY_PROFILES[snapshot.planKey];
  const included = [...profile.capabilities].filter((k) => HIGHLIGHT_CAPABILITIES.includes(k) || !CAPABILITY_MIN_TIER[k]);
  const advisory = HIGHLIGHT_CAPABILITIES.filter(
    (k) => !profile.capabilities.has(k) && CAPABILITY_MIN_TIER[k]
  );
  const lastChecked = checkedAt ?? billing?.checkedAt ?? new Date();

  return (
    <div className="space-y-6">
      <p className="rounded-cc-sm border border-cyan-500/15 bg-cyan-500/5 px-4 py-3 text-sm text-slate-300">
        This tenant is operating under{" "}
        <span className="font-medium text-cyan-200">{snapshot.planDisplayName}</span> capability
        scope — advisory only, not enforced at runtime.
      </p>

      <section className="cc-glass-card space-y-4 !p-6">
        <h3 className="text-sm font-medium text-cyan-400">Subscription & plan</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-xs text-slate-500">Effective plan</p>
            <p className="text-lg font-semibold text-white">{snapshot.planDisplayName}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Tenant.planKey</p>
            <p className="text-sm font-medium text-white">{planLabel(snapshot.tenantPlanKey)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">TenantSubscription</p>
            <p className="text-sm font-medium text-white">
              {snapshot.hasTenantSubscription
                ? `${snapshot.subscriptionStatus ?? "linked"}${snapshot.subscriptionPlanKey ? ` · ${planLabel(snapshot.subscriptionPlanKey)}` : ""}`
                : "Not linked"}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Readiness</p>
            <p className={`text-sm font-medium ${readiness.ready ? "text-emerald-300" : "text-amber-300"}`}>
              {readiness.ready ? "Ready (advisory)" : "Review recommended"}
            </p>
          </div>
        </div>
        {snapshot.upgradeRecommendation && (
          <p className="rounded-cc-sm border border-cyan-500/20 bg-cyan-500/5 px-4 py-3 text-sm text-slate-300">
            {snapshot.upgradeRecommendation}
          </p>
        )}
        <p className="text-xs text-slate-500">
          Last checked {lastChecked.toLocaleString()} — subscription intelligence refresh.
        </p>
      </section>

      {billing && (
        <section className="cc-glass-card space-y-4 !p-6">
          <h3 className="text-sm font-medium text-cyan-400">Billing alignment (read-only)</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <DepthChip label="Billing mode" value={billing.billingModeLabel} />
            <DepthChip label="Subscription status" value={billing.subscriptionStatus ?? "—"} />
            <DepthChip label="Stripe customer" value={billing.stripeCustomerId ? "Linked" : "—"} />
            <DepthChip
              label="Stripe subscription"
              value={billing.stripeSubscriptionId ? "Active link" : "—"}
            />
          </div>
          {(billing.currentPeriodStart || billing.currentPeriodEnd) && (
            <div className="grid gap-3 sm:grid-cols-2">
              <DepthChip label="Period start" value={formatDate(billing.currentPeriodStart)} />
              <DepthChip label="Period end" value={formatDate(billing.currentPeriodEnd)} />
            </div>
          )}
          {billing.cancelAtPeriodEnd != null && (
            <p className="text-sm text-slate-400">
              Cancel at period end:{" "}
              <span className={billing.cancelAtPeriodEnd ? "text-amber-300" : "text-emerald-300"}>
                {billing.cancelAtPeriodEnd ? "Yes (scheduled)" : "No"}
              </span>
            </p>
          )}
          {billing.advisoryMessage && (
            <p className="rounded-cc-sm border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
              {billing.advisoryMessage}
            </p>
          )}
          {billing.stripeCustomerId && (
            <p className="font-mono text-xs text-slate-500 break-all">
              Customer: {billing.stripeCustomerId}
              {billing.stripeSubscriptionId && ` · Sub: ${billing.stripeSubscriptionId}`}
            </p>
          )}
        </section>
      )}

      <section className="cc-glass-card space-y-4 !p-6">
        <h3 className="text-sm font-medium text-cyan-400">Depth & identity (advisory)</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <DepthChip label="Identity mode" value={snapshot.identityMode} />
          <DepthChip label="CyberCrow depth" value={snapshot.cybercrowDepth} />
          <DepthChip label="SAREA depth" value={snapshot.sareaDepth} />
          <DepthChip label="Discovery depth" value={snapshot.discoveryDepth} />
        </div>
      </section>

      {usageSignals && <TenantUsageSignalsPanel signals={usageSignals} />}

      <section className="cc-glass-card space-y-4 !p-6">
        <h3 className="text-sm font-medium text-cyan-400">Plan limits (reference)</h3>
        <p className="text-xs text-slate-500">Advisory bands — not enforced at runtime in this phase.</p>
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <LimitChip label="Users" value={snapshot.limits.max_users} />
          <LimitChip label="Departments" value={snapshot.limits.max_departments} />
          <LimitChip label="Branches" value={snapshot.limits.max_branches} />
          <LimitChip label="Workflows" value={snapshot.limits.max_workflows} />
          <LimitChip label="Modules" value={snapshot.limits.max_modules} />
          <LimitChip label="SAREA profiles" value={snapshot.limits.max_sarea_profiles} />
        </div>
      </section>

      <section className="cc-glass-card space-y-4 !p-6">
        <h3 className="text-sm font-medium text-cyan-400">Capabilities</h3>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-emerald-400/80">Included</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {included.slice(0, 12).map((k) => (
              <CapabilityBadge key={k} label={capabilityListLabel(k)} tone="included" />
            ))}
          </ul>
        </div>
        {advisory.length > 0 && (
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-amber-400/90">
              Advisory upgrade
            </p>
            <ul className="mt-2 space-y-2">
              {advisory.map((k) => {
                const hint = advisoryHintForCapability(snapshot.planKey, k);
                const label = advisoryLabelForHint(hint, snapshot.planKey);
                const min = CAPABILITY_MIN_TIER[k];
                return (
                  <li
                    key={k}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-cc-sm border border-white/10 px-3 py-2 text-sm"
                  >
                    <span className="text-slate-300">{capabilityListLabel(k)}</span>
                    <span className="text-xs text-amber-400/90">
                      {hint === "enterprise"
                        ? "Enterprise capability"
                        : hint === "growth"
                          ? "Recommended for Crow Growth"
                          : label}
                      {min && ` · unlocks on ${PLAN_DISPLAY_NAMES[min]}`}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </section>

      {readiness.warnings.length > 0 && (
        <section className="cc-glass-card space-y-3 !p-6">
          <h3 className="text-sm font-medium text-amber-300">Readiness notes</h3>
          <ul className="space-y-2 text-sm text-slate-400">
            {readiness.warnings.map((w) => (
              <li key={w.code} className="rounded-cc-sm border border-amber-500/15 bg-amber-500/5 px-3 py-2">
                {w.message}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function DepthChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-cc-sm border border-cyan-500/15 bg-cyan-500/5 px-3 py-2">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-sm font-medium capitalize text-cyan-200">{value.replace(/_/g, " ")}</p>
    </div>
  );
}

function LimitChip({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-cc-sm border border-white/10 px-3 py-2 text-center">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-lg font-semibold text-white">{value >= 99 ? "∞" : value}</p>
    </div>
  );
}

function CapabilityBadge({ label, tone }: { label: string; tone: "included" | "advisory" }) {
  const cls =
    tone === "included"
      ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-200"
      : "border-amber-500/25 bg-amber-500/10 text-amber-200";
  return (
    <span className={`rounded-full border px-2 py-0.5 text-[10px] capitalize ${cls}`}>{label}</span>
  );
}
