import type { CybercrowPolicyAction } from "@/lib/services/cybercrow-policy.service";
import { assertCybercrowPolicy } from "@/lib/services/cybercrow-policy.service";
import { getTenantBySlug } from "@/lib/services/tenant.service";
import { requireTenantAccess } from "./session";

/** Tenant server action: auth + CyberCrow policy check. */
export async function requireActionTenantPolicy(slug: string, action: CybercrowPolicyAction) {
  const user = await requireTenantAccess(slug);
  const tenant = await getTenantBySlug(slug);
  if (!tenant) throw new Error("Tenant not found");
  await assertCybercrowPolicy(tenant.id, user, action);
  return { user, tenant };
}
