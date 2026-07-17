import type { BlueprintVersionStatus } from "@prisma/client";

/** Editable version statuses (service-enforced; DB partial unique on active draft). */
export const EDITABLE_VERSION_STATUSES: ReadonlySet<BlueprintVersionStatus> = new Set([
  "DISCOVERY_DRAFT",
  "BLUEPRINT_DRAFT",
  "CHANGES_REQUESTED",
]);

export const IMMUTABLE_VERSION_STATUSES: ReadonlySet<BlueprintVersionStatus> = new Set([
  "APPROVED",
  "SUPERSEDED",
  "ARCHIVED",
]);

export function isVersionEditable(status: BlueprintVersionStatus): boolean {
  return EDITABLE_VERSION_STATUSES.has(status);
}

const ALLOWED_TRANSITIONS: Partial<
  Record<BlueprintVersionStatus, readonly BlueprintVersionStatus[]>
> = {
  DISCOVERY_DRAFT: ["BLUEPRINT_DRAFT", "INTERNAL_REVIEW", "ARCHIVED"],
  BLUEPRINT_DRAFT: ["INTERNAL_REVIEW", "ARCHIVED"],
  INTERNAL_REVIEW: ["CLIENT_REVIEW", "CHANGES_REQUESTED", "APPROVAL_PENDING", "BLUEPRINT_DRAFT"],
  CLIENT_REVIEW: ["CHANGES_REQUESTED", "APPROVAL_PENDING", "INTERNAL_REVIEW"],
  CHANGES_REQUESTED: ["BLUEPRINT_DRAFT", "INTERNAL_REVIEW"],
  APPROVAL_PENDING: ["APPROVED", "CHANGES_REQUESTED"],
  APPROVED: ["SUPERSEDED", "CONFIGURATION_PROPOSED"],
  CONFIGURATION_PROPOSED: ["SUPERSEDED", "ARCHIVED"],
  SUPERSEDED: ["ARCHIVED"],
};

export function canTransition(
  from: BlueprintVersionStatus | string,
  to: BlueprintVersionStatus | string
): boolean {
  const allowed = ALLOWED_TRANSITIONS[from as BlueprintVersionStatus];
  return allowed?.includes(to as BlueprintVersionStatus) ?? false;
}

export function isEditableStatus(status: BlueprintVersionStatus | string): boolean {
  return isVersionEditable(status as BlueprintVersionStatus);
}

export function assertLifecycleTransition(
  from: BlueprintVersionStatus,
  to: BlueprintVersionStatus
): void {
  if (!canTransition(from, to)) {
    throw new Error(`Invalid lifecycle transition: ${from} → ${to}`);
  }
}
