import type { CybercrowPolicyAction } from "@/lib/services/cybercrow-policy.service";
import { assertCybercrowPolicy } from "@/lib/services/cybercrow-policy.service";
import { getTenantBySlug } from "@/lib/services/tenant.service";
import { requireTenantBusinessPortalAccess } from "./tenant-business-portal-guard";

const WORKFLOW_MANAGE_ACTIONS = new Set<CybercrowPolicyAction>([
  "cem.workflows.manage",
]);

/** Tenant server action: M4 membership + CyberCrow policy check. */
export async function requireActionTenantPolicy(slug: string, action: CybercrowPolicyAction) {
  const { user, decision } = await requireTenantBusinessPortalAccess(slug);
  const tenant = await getTenantBySlug(slug);
  if (!tenant) throw new Error("Tenant not found");

  if (WORKFLOW_MANAGE_ACTIONS.has(action) && !decision.canUseWorkflowActions) {
    throw new Error(
      decision.blockedReason ??
        "Workflow actions require verified tenant membership with appropriate role.",
    );
  }

  await assertCybercrowPolicy(tenant.id, user, action);
  return { user, tenant, decision };
}
