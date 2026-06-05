import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { isAuthDisabled } from "@/lib/supabase/env";
import { resolveTenantBusinessPortalAccess } from "@/lib/services/tenant-membership-access.service";
import type { TenantBusinessPortalAccessDecision } from "@/lib/tenant/tenant-membership-contract";
import { routes } from "@/lib/routes";
import { requireAuth } from "./session";

/**
 * M4 — Business Portal route guard for /[tenant]/*.
 * Client Portal access alone is insufficient.
 */
export async function requireTenantBusinessPortalAccess(
  tenantSlug: string
): Promise<{ user: User; decision: TenantBusinessPortalAccessDecision }> {
  const slug = tenantSlug.trim().toLowerCase();
  const user = await requireAuth(`/${slug}/dashboard`);

  if (isAuthDisabled()) {
    const decision = await resolveTenantBusinessPortalAccess(user, slug);
    return { user, decision };
  }

  const decision = await resolveTenantBusinessPortalAccess(user, slug);

  if (!decision.canViewBusinessPortal) {
    const params = new URLSearchParams({
      reason: "business_portal_blocked",
      tenant: slug,
    });
    if (decision.blockedReason) {
      params.set("message", decision.blockedReason.slice(0, 200));
    }
    redirect(`${routes.access}?${params.toString()}`);
  }

  return { user, decision };
}
