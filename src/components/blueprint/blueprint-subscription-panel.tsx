import { PLAN_DISPLAY_NAMES } from "@/lib/subscription/plan-capabilities";
import type { SubscriptionTierKey } from "@/lib/constants/subscriptions";

type BlueprintPlanContext = {
  planKey: SubscriptionTierKey;
  planDisplayName: string;
  identityMode: string;
  cybercrowDepth: string;
  sareaDepth: string;
  discoveryDepth: string;
  blueprintDepth: string;
  limits: {
    max_users: number;
    max_departments: number;
    max_branches: number;
    max_workflows: number;
    max_modules: number;
  };
};

export function BlueprintSubscriptionPanel({ context }: { context: BlueprintPlanContext }) {
  return (
    <section className="cc-glass-card space-y-4 !p-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
          Subscription scope
        </p>
        <p className="mt-1 text-sm text-slate-400">
          Blueprint generation used{" "}
          <span className="font-medium text-cyan-200">{context.planDisplayName}</span> capability
          depth. Your plan affects blueprint scope — Crow advises tier-appropriate org, security, and
          experience depth before go-live.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <ScopeChip label="Plan tier" value={context.planDisplayName} />
        <ScopeChip label="Blueprint depth" value={context.blueprintDepth} />
        <ScopeChip label="Identity mode" value={context.identityMode.replace(/_/g, " ")} />
        <ScopeChip label="CyberCrow baseline" value={context.cybercrowDepth} />
        <ScopeChip label="SAREA depth" value={context.sareaDepth} />
        <ScopeChip label="Discovery depth" value={context.discoveryDepth} />
      </div>
      <div className="rounded-cc-sm border border-cyan-500/15 bg-cyan-500/5 px-4 py-3 text-xs text-slate-400">
        <span className="font-medium text-cyan-200">Limits summary</span> — up to{" "}
        {context.limits.max_users} users, {context.limits.max_departments} departments,{" "}
        {context.limits.max_workflows} workflows, {context.limits.max_modules} modules.{" "}
        {context.planKey !== "enterprise" && (
          <>
            Upgrade to{" "}
            {context.planKey === "startup"
              ? PLAN_DISPLAY_NAMES.growth
              : PLAN_DISPLAY_NAMES.enterprise}{" "}
            expands depth; nothing here blocks editing your blueprint.
          </>
        )}
      </div>
    </section>
  );
}

function ScopeChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-cc-sm border border-white/10 px-3 py-2">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-sm font-medium capitalize text-white">{value}</p>
    </div>
  );
}
