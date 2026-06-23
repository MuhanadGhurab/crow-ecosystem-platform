/**
 * Discovery integration contract — signals map to recommendations only.
 * Discovery → recommendation → blueprint review → approval → future tenant build.
 */

export type DiscoverySignalKey =
  | "industry"
  | "organization_size"
  | "branch_count"
  | "workforce_type"
  | "customer_type"
  | "operating_locations"
  | "departments"
  | "approval_complexity"
  | "field_workforce"
  | "asset_intensity"
  | "inventory_needs"
  | "regulatory_needs"
  | "security_sensitivity"
  | "integration_needs";

export type DiscoverySignalMap = Partial<Record<DiscoverySignalKey, string | number | boolean | string[]>>;

const LEGACY_SECTOR_TO_ARCHETYPE: Record<string, string> = {
  logistics: "logistics_and_fleet",
  retail: "retail_and_commerce",
  healthcare: "healthcare_operations",
  construction: "construction_and_epc",
  aviation: "professional_services",
};

const SIZE_TO_OVERLAY: Record<string, string> = {
  startup: "startup",
  small: "small_business",
  sme: "mid_market",
  enterprise: "enterprise",
};

/** Map Discovery answers to registry inputs — advisory only. */
export function mapDiscoverySignalsToCompositionInput(signals: DiscoverySignalMap) {
  const industryRaw = typeof signals.industry === "string" ? signals.industry : undefined;
  const industryArchetype =
    (industryRaw && LEGACY_SECTOR_TO_ARCHETYPE[industryRaw]) ||
    industryRaw ||
    "professional_services";

  const overlays: string[] = [];
  const orgSize = typeof signals.organization_size === "string" ? signals.organization_size : undefined;
  if (orgSize && SIZE_TO_OVERLAY[orgSize]) overlays.push(SIZE_TO_OVERLAY[orgSize]);

  if (signals.field_workforce === true) overlays.push("field_workforce");
  if (typeof signals.branch_count === "number" && signals.branch_count > 1) overlays.push("multi_branch");
  if (signals.asset_intensity === "high") overlays.push("asset_heavy");
  if (signals.regulatory_needs === "high") overlays.push("highly_regulated");
  if (signals.customer_type === "membership") overlays.push("customer_membership");

  return {
    industryArchetype,
    overlays: [...new Set(overlays)],
    organizationSignals: {
      ...signals,
      branch_count: signals.branch_count,
      approval_complexity: signals.approval_complexity,
      inventory_needs: signals.inventory_needs,
      field_workforce: signals.field_workforce,
      regulatory_needs: signals.regulatory_needs,
      security_sensitivity: signals.security_sensitivity,
    },
  };
}

export const DISCOVERY_INTEGRATION_CONTRACT = {
  phase: "PLANNED",
  authoritative: false,
  requiredHumanApproval: true,
  pipeline: ["discovery_signal", "recommendation", "blueprint_review", "approval", "future_tenant_build"],
} as const;
