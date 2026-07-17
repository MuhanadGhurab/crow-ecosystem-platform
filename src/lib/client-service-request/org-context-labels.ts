/**
 * CROW.REQUEST.2 — organization context labels aligned with Build New / Transform.
 */

import type { OrganizationContextKind } from "./types";
import type { RequestJourneyKind } from "./journey";

export type OrganizationContextOption = {
  key: OrganizationContextKind;
  label: string;
  /** Recommended journey this context usually pairs with */
  typicalJourney: RequestJourneyKind;
  hint: string;
};

export const ORGANIZATION_CONTEXT_OPTIONS: OrganizationContextOption[] = [
  {
    key: "NEW_BUSINESS",
    label: "A new business",
    typicalJourney: "NEW",
    hint: "Build New — greenfield organization",
  },
  {
    key: "NEW_DIVISION",
    label: "A new division or branch",
    typicalJourney: "NEW",
    hint: "Build New — new unit inside a larger organization",
  },
  {
    key: "EXISTING_ORGANIZATION",
    label: "An existing organization",
    typicalJourney: "TRANSFORM",
    hint: "Transform — current operating model needs redesign",
  },
  {
    key: "MODERNIZATION",
    label: "A modernization project",
    typicalJourney: "TRANSFORM",
    hint: "Transform — systems and processes need upgrading",
  },
];

export function organizationContextLabel(kind: OrganizationContextKind | null | undefined): string {
  if (!kind) return "Not specified";
  return ORGANIZATION_CONTEXT_OPTIONS.find((o) => o.key === kind)?.label ?? kind;
}
