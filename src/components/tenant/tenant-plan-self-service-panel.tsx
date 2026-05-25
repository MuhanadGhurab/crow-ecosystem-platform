import Link from "next/link";
import {
  CAPABILITY_MIN_TIER,
  PLAN_CAPABILITY_PROFILES,
  PLAN_DISPLAY_NAMES,
  advisoryHintForCapability,
  advisoryLabelForHint,
  type CapabilityKey,
} from "@/lib/subscription/plan-capabilities";
import { USAGE_STATUS_LABELS } from "@/lib/services/usage-signals.service";
import type { TenantCapabilitySnapshot } from "@/lib/services/subscription-capability.service";
import type { TenantUsageSignals } from "@/lib/services/usage-signals.service";
import { routes } from "@/lib/routes";

const HIGHLIGHT_CAPABILITIES: CapabilityKey[] = [
  "core_modules",
  "operational_blueprint",
  "role_based_layouts",
  "microsoft_entra_sso",
  "full_grc",
  "executive_command_center",
];

export function TenantPlanSelfServicePanel({
  slug,
  snapshot,
  usageSignals,
}: {
  slug: string;
  snapshot: TenantCapabilitySnapshot;
  usageSignals: TenantUsageSignals | null;
}) {
  const profile = PLAN_CAPABILITY_PROFILES[snapshot.planKey];
  const included = HIGHLIGHT_CAPABILITIES.filter((k) => profile.capabilities.has(k));

  return (
    <div className="space-y-6">
      <section className="cc-glass-card space-y-4 !p-6">
        <h3 className="text-sm font-medium text-cyan-400">Your plan</h3>
        <p className="text-2xl font-semibold text-white">{snapshot.planDisplayName}</p>
        <p className="text-sm text-slate-400">
          This workspace is operating under{" "}
          <span className="font-medium text-cyan-200">{snapshot.planDisplayName}</span> capability
          scope. Limits shown below are advisory reference bands — not enforced at runtime.
        </p>
        {snapshot.upgradeRecommendation && (
          <p className="rounded-cc-sm border border-violet-500/20 bg-violet-500/5 px-4 py-3 text-sm text-slate-300">
            <span className="font-medium text-violet-200">Upgrade recommendation: </span>
            {snapshot.upgradeRecommendation}
          </p>
        )}
      </section>

      {usageSignals && (
        <section className="cc-glass-card space-y-4 !p-6">
          <h3 className="text-sm font-medium text-cyan-400">Usage vs recommended limits</h3>
          <p className="text-xs text-slate-500">
            Overall: {USAGE_STATUS_LABELS[usageSignals.overallStatus]}
          </p>
          <ul className="space-y-2">
            {usageSignals.metrics.map((m) => (
              <li
                key={m.key}
                className="flex flex-wrap items-center justify-between gap-2 rounded-cc-sm border border-white/10 px-3 py-2 text-sm"
              >
                <span className="text-slate-300">{m.label}</span>
                <span className="text-slate-400">
                  {m.used} / {m.max >= 99 ? "∞" : m.max}
                  {m.max < 99 && ` (${m.percent}%)`}
                </span>
              </li>
            ))}
          </ul>
          {usageSignals.upgradeNote && (
            <p className="text-xs text-amber-300/90">{usageSignals.upgradeNote}</p>
          )}
        </section>
      )}

      <section className="cc-glass-card space-y-4 !p-6">
        <h3 className="text-sm font-medium text-cyan-400">Included capabilities</h3>
        <ul className="flex flex-wrap gap-2">
          {included.map((k) => (
            <li
              key={k}
              className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 text-[10px] capitalize text-emerald-200"
            >
              {k.replace(/_/g, " ")}
            </li>
          ))}
        </ul>
        {snapshot.planKey !== "enterprise" && (
          <ul className="mt-3 space-y-2 text-sm text-slate-400">
            {(["microsoft_entra_sso", "executive_command_center"] as CapabilityKey[]).map((k) => {
              if (profile.capabilities.has(k)) return null;
              const hint = advisoryHintForCapability(snapshot.planKey, k);
              const min = CAPABILITY_MIN_TIER[k];
              return (
                <li key={k} className="rounded-cc-sm border border-amber-500/15 px-3 py-2">
                  <span className="text-slate-300">{k.replace(/_/g, " ")}</span>
                  <span className="ml-2 text-xs text-amber-400/90">
                    {advisoryLabelForHint(hint, snapshot.planKey)}
                    {min && ` · unlocks on ${PLAN_DISPLAY_NAMES[min]}`}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="cc-glass-card space-y-3 !p-6">
        <h3 className="text-sm font-medium text-cyan-400">Billing & upgrades</h3>
        <p className="text-sm text-slate-400">
          Plan changes and Stripe checkout are managed by your Crow platform administrator. Contact
          them to discuss Crow Growth or Crow Enterprise.
        </p>
        <Link href={routes.tenant(slug).settings} className="text-sm text-cyan-400 hover:text-cyan-300">
          ← Workspace settings
        </Link>
      </section>
    </div>
  );
}
