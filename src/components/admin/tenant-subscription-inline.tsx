import type { TenantCapabilitySnapshot } from "@/lib/services/subscription-capability.service";

export function TenantSubscriptionInline({ snapshot }: { snapshot: TenantCapabilitySnapshot }) {
  return (
    <div className="mt-2 space-y-1 text-xs text-slate-500">
      <p>
        <span className="text-cyan-300">{snapshot.planDisplayName}</span>
        {" · "}
        Identity {snapshot.identityMode}
        {" · "}
        CyberCrow {snapshot.cybercrowDepth}
        {" · "}
        SAREA {snapshot.sareaDepth}
        {" · "}
        Discovery {snapshot.discoveryDepth}
      </p>
      {snapshot.planKeyMismatch && (
        <p className="text-amber-400/90">
          Plan key mismatch — review TenantSubscription vs Tenant.planKey in control room.
        </p>
      )}
      {!snapshot.hasTenantSubscription && (
        <p className="text-amber-400/90">No TenantSubscription row — capabilities inferred from planKey.</p>
      )}
      {snapshot.upgradeRecommendation && (
        <p className="text-slate-400">{snapshot.upgradeRecommendation}</p>
      )}
    </div>
  );
}
