/**
 * CROW.DISCOVERY.3 — adaptive visibility and required evaluation (pure).
 */

import type { OrganizationContextKind } from "@/lib/client-service-request/types";
import type { RequestJourneyKind } from "@/lib/client-service-request/journey";
import type {
  DiscoveryMvpAdaptiveContext,
  DiscoveryMvpFieldDefinition,
  DiscoveryMvpRequiredCondition,
} from "@/lib/discovery/discovery-mvp-d3-types";

function matchesCondition(
  condition: DiscoveryMvpRequiredCondition | "always",
  ctx: DiscoveryMvpAdaptiveContext,
): boolean {
  switch (condition) {
    case "always":
      return true;
    case "never":
      return false;
    case "if_journey_NEW":
      return ctx.journeyKind === "NEW";
    case "if_journey_TRANSFORM":
      return ctx.journeyKind === "TRANSFORM";
    case "if_org_NEW_DIVISION":
      return ctx.organizationContext === "NEW_DIVISION";
    case "if_org_MODERNIZATION":
      return ctx.organizationContext === "MODERNIZATION";
    default: {
      const _exhaustive: never = condition;
      return _exhaustive;
    }
  }
}

export function isFieldJourneyApplicable(
  field: DiscoveryMvpFieldDefinition,
  journeyKind: RequestJourneyKind | null,
): boolean {
  if (field.journeyApplicability === "BOTH") return true;
  if (!journeyKind) return false;
  return field.journeyApplicability === journeyKind;
}

export function isFieldOrgApplicable(
  field: DiscoveryMvpFieldDefinition,
  organizationContext: OrganizationContextKind | null,
): boolean {
  if (field.organizationContextApplicability === "ALL") return true;
  if (!organizationContext) return false;
  return field.organizationContextApplicability.includes(organizationContext);
}

/** Visible when journey/org applicability and visibilityCondition hold. */
export function isDiscoveryMvpFieldVisible(
  field: DiscoveryMvpFieldDefinition,
  ctx: DiscoveryMvpAdaptiveContext,
): boolean {
  if (!isFieldJourneyApplicable(field, ctx.journeyKind)) return false;
  if (!isFieldOrgApplicable(field, ctx.organizationContext)) return false;
  return matchesCondition(field.visibilityCondition, ctx);
}

export function isDiscoveryMvpFieldRequired(
  field: DiscoveryMvpFieldDefinition,
  ctx: DiscoveryMvpAdaptiveContext,
): boolean {
  if (!isDiscoveryMvpFieldVisible(field, ctx)) return false;
  return matchesCondition(field.requiredCondition, ctx);
}

export function filterVisibleDiscoveryMvpFields(
  catalog: readonly DiscoveryMvpFieldDefinition[],
  ctx: DiscoveryMvpAdaptiveContext,
): DiscoveryMvpFieldDefinition[] {
  return catalog.filter((f) => isDiscoveryMvpFieldVisible(f, ctx));
}
