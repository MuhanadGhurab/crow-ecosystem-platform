import { BlueprintAction, type BlueprintActionKey } from "@/lib/auth/blueprint-actions";
import { Permission } from "@/lib/auth/permissions";
import { requirePermission, requirePlatformStaff } from "@/lib/auth/session";
import { BlueprintAuthorizationError } from "@/lib/crow-core/blueprint-runtime/blueprint-errors";

const READ_ACTIONS = new Set<BlueprintActionKey>([
  BlueprintAction["blueprint.list"],
  BlueprintAction["blueprint.read.internal"],
  BlueprintAction["blueprint.read.client"],
  BlueprintAction["blueprint.version.compare"],
  BlueprintAction["blueprint.trace.read"],
]);

const DRAFT_EDIT_ACTIONS = new Set<BlueprintActionKey>([
  BlueprintAction["blueprint.draft.create"],
  BlueprintAction["blueprint.draft.edit.organization"],
  BlueprintAction["blueprint.draft.edit.operations"],
  BlueprintAction["blueprint.draft.edit.security"],
  BlueprintAction["blueprint.draft.edit.experience"],
  BlueprintAction["blueprint.draft.edit.integrations"],
  BlueprintAction["blueprint.draft.edit.commercial"],
  BlueprintAction["blueprint.version.create_next"],
]);

const REVIEW_ACTIONS = new Set<BlueprintActionKey>([
  BlueprintAction["blueprint.review.submit"],
  BlueprintAction["blueprint.review.request_changes"],
]);

const APPROVE_ACTIONS = new Set<BlueprintActionKey>([
  BlueprintAction["blueprint.approve"],
  BlueprintAction["blueprint.archive"],
]);

const ROI_EDIT_ACTIONS = new Set<BlueprintActionKey>([
  BlueprintAction["blueprint.roi.generate"],
  BlueprintAction["blueprint.roi.assumption.edit"],
]);

const ROI_APPROVE_ACTIONS = new Set<BlueprintActionKey>([
  BlueprintAction["blueprint.roi.assumption.approve"],
]);

const SOW_ACTIONS = new Set<BlueprintActionKey>([
  BlueprintAction["blueprint.sow.generate"],
  BlueprintAction["blueprint.sow.edit"],
  BlueprintAction["blueprint.sow.review"],
]);

const CONFIG_ACTIONS = new Set<BlueprintActionKey>([
  BlueprintAction["blueprint.configuration.propose"],
]);

/** Conservative role mapping — default deny for unknown actions. */
export async function requireBlueprintAction(
  action: BlueprintActionKey,
  context?: { crowRole?: string | null; authorUserId?: string; approverUserId?: string }
) {
  await requirePlatformStaff();

  if (READ_ACTIONS.has(action)) {
    if (action === BlueprintAction["blueprint.read.client"]) {
      return;
    }
    await requirePermission(Permission["platform.blueprint.view"]);
    return;
  }

  if (DRAFT_EDIT_ACTIONS.has(action) || REVIEW_ACTIONS.has(action)) {
    await requirePermission(Permission["platform.discovery.write"]);
    return;
  }

  if (APPROVE_ACTIONS.has(action)) {
    await requirePermission(Permission["platform.discovery.write"]);
    const role = (context?.crowRole ?? "").toLowerCase();
    if (role === "sales" || role === "client") {
      throw new BlueprintAuthorizationError("Role cannot approve blueprints");
    }
    if (
      context?.authorUserId &&
      context.approverUserId &&
      context.authorUserId === context.approverUserId
    ) {
      throw new BlueprintAuthorizationError("Self-approval is not permitted");
    }
    return;
  }

  if (ROI_EDIT_ACTIONS.has(action)) {
    await requirePermission(Permission["platform.discovery.write"]);
    return;
  }

  if (ROI_APPROVE_ACTIONS.has(action)) {
    await requirePermission(Permission["platform.discovery.write"]);
    const role = (context?.crowRole ?? "").toLowerCase();
    if (role === "sales") {
      throw new BlueprintAuthorizationError("Sales cannot approve ROI assumptions");
    }
    return;
  }

  if (SOW_ACTIONS.has(action)) {
    await requirePermission(Permission["platform.discovery.write"]);
    return;
  }

  if (CONFIG_ACTIONS.has(action)) {
    await requirePermission(Permission["platform.blueprint.provision"]);
    return;
  }

  throw new BlueprintAuthorizationError(`Unknown or denied blueprint action: ${action}`);
}
