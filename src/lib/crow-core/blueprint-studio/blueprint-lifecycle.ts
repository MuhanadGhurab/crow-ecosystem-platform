import type { BlueprintLifecycleState } from "../blueprint";

/** Prisma enum wire values — kept as strings so crow-core stays persistence-neutral. */
export type LifecycleBlueprintStatus = "DRAFT" | "IN_REVIEW" | "APPROVED" | "ARCHIVED";
export type LifecycleProposalStatus = "DRAFT" | "SENT" | "APPROVED" | "DECLINED";

export type LifecycleMappingInput = {
  requestStatus?: string | null;
  blueprintStatus?: LifecycleBlueprintStatus | string | null;
  proposalStatus?: LifecycleProposalStatus | string | null;
  clientApprovedAt?: Date | null;
  approvedAt?: Date | null;
};

export function mapToBlueprintLifecycleState(
  input: LifecycleMappingInput
): BlueprintLifecycleState {
  if (!input.blueprintStatus) {
    if (input.requestStatus === "UNDER_DISCOVERY") return "DISCOVERY_DRAFT";
    return "DISCOVERY_DRAFT";
  }

  if (input.blueprintStatus === "ARCHIVED") return "ARCHIVED";
  if (input.blueprintStatus === "APPROVED" || input.approvedAt) return "APPROVED";

  if (input.blueprintStatus === "IN_REVIEW") {
    if (input.proposalStatus === "SENT") {
      return "CLIENT_REVIEW";
    }
    if (input.proposalStatus === "DECLINED") return "CHANGES_REQUESTED";
    return "INTERNAL_REVIEW";
  }

  if (input.blueprintStatus === "DRAFT") return "BLUEPRINT_DRAFT";

  return "BLUEPRINT_DRAFT";
}

export function isLifecycleImmutable(state: BlueprintLifecycleState): boolean {
  return state === "APPROVED" || state === "ARCHIVED" || state === "SUPERSEDED";
}
