import type { TenantBlueprintComposition } from "./types";
import { composeTenantBlueprint } from "./registry";

export type ReferenceComposition = {
  key: string;
  displayName: string;
  description: string;
  industryArchetype: string;
  overlays: readonly string[];
  organizationSignals: Record<string, string | number | boolean | string[]>;
  snapshot: TenantBlueprintComposition;
};

function ref(
  key: string,
  displayName: string,
  industryArchetype: string,
  overlays: readonly string[],
  organizationSignals: ReferenceComposition["organizationSignals"] = {},
): ReferenceComposition {
  const snapshot = composeTenantBlueprint({
    industryArchetype,
    overlays,
    organizationSignals,
  });
  return {
    key,
    displayName,
    description: `Reference composition — ${displayName} (example, not mandatory).`,
    industryArchetype,
    overlays,
    organizationSignals,
    snapshot,
  };
}

/** Six reference compositions demonstrating composability. */
export const REFERENCE_COMPOSITIONS: readonly ReferenceComposition[] = [
  ref("logistics_fleet_operator", "Logistics fleet operator", "logistics_and_fleet", ["multi_branch", "field_workforce"], {
    branch_count: 5,
    fleet_size: 40,
    approval_complexity: "medium",
  }),
  ref("construction_epc_contractor", "Construction EPC contractor", "construction_and_epc", ["enterprise", "project_based", "field_workforce"], {
    project_count: 12,
    approval_complexity: "high",
    subcontractor_usage: true,
  }),
  ref("retail_multi_branch", "Retail multi-branch", "retail_and_commerce", ["multi_branch", "mid_market"], {
    store_count: 25,
    approval_complexity: "medium",
    inventory_needs: true,
  }),
  ref("professional_services_firm", "Professional services firm", "professional_services", ["mid_market", "project_based"], {
    client_count: 80,
    approval_complexity: "medium",
    billable_model: "time_and_materials",
  }),
  ref("facilities_management_operator", "Facilities management operator", "property_and_facilities", ["enterprise", "asset_heavy", "vendor_heavy"], {
    property_count: 120,
    approval_complexity: "high",
    maintenance_sla: true,
  }),
  ref("events_and_venue_operator", "Events and venue operator", "events_and_venues", ["seasonal_workforce", "vendor_heavy"], {
    venue_count: 3,
    event_frequency: "high",
    approval_complexity: "medium",
  }),
] as const;

export function getReferenceComposition(key: string): ReferenceComposition | undefined {
  return REFERENCE_COMPOSITIONS.find((r) => r.key === key);
}
