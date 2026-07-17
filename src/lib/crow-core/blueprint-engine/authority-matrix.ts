import type { BlueprintActorClass, BlueprintReviewActionType } from "./types";

const PLATFORM_ADMIN_ACTIONS: ReadonlySet<BlueprintReviewActionType> = new Set([
  "SUBMIT_FOR_INTERNAL_REVIEW",
  "REQUEST_INTERNAL_CHANGES",
  "MARK_READY_TO_SHARE",
  "SHARE_WITH_CLIENT",
  "PLATFORM_FINALIZE",
  "WITHDRAW",
  "SUPERSEDE",
]);

const REQUEST_OWNER_ACTIONS: ReadonlySet<BlueprintReviewActionType> = new Set([
  "CLIENT_COMMENT",
  "CLIENT_REQUEST_CHANGES",
  "CLIENT_ACCEPT",
]);

/** IMPLEMENTER denied for BLUEPRINT.1 — explicit policy. */
const IMPLEMENTER_ACTIONS: ReadonlySet<BlueprintReviewActionType> = new Set();

export function authorizeBlueprintAction(
  actorClass: BlueprintActorClass,
  action: BlueprintReviewActionType,
): { allowed: boolean; reason?: string } {
  if (actorClass === "PLATFORM_ADMIN") {
    return PLATFORM_ADMIN_ACTIONS.has(action)
      ? { allowed: true }
      : { allowed: false, reason: "Action not permitted for platform admin in current policy" };
  }
  if (actorClass === "IMPLEMENTER") {
    return IMPLEMENTER_ACTIONS.has(action)
      ? { allowed: true }
      : { allowed: false, reason: "IMPLEMENTER access denied for Blueprint persistence in BLUEPRINT.1" };
  }
  if (actorClass === "REQUEST_OWNER") {
    return REQUEST_OWNER_ACTIONS.has(action)
      ? { allowed: true }
      : { allowed: false, reason: "Request owner may only perform client review actions on shared versions" };
  }
  return { allowed: false, reason: "Access denied" };
}

export function resolveActorClass(input: {
  isPlatformAdmin: boolean;
  isImplementer: boolean;
  isRequestOwner: boolean;
  isTenantMember: boolean;
  metadataClaimsPlatformAdmin: boolean;
  emailOnlyMatch: boolean;
}): BlueprintActorClass {
  if (input.emailOnlyMatch || input.metadataClaimsPlatformAdmin) return "UNRELATED_CLIENT";
  if (input.isPlatformAdmin) return "PLATFORM_ADMIN";
  if (input.isImplementer) return "IMPLEMENTER";
  if (input.isRequestOwner) return "REQUEST_OWNER";
  if (input.isTenantMember) return "TENANT_MEMBER";
  return "ANONYMOUS";
}
