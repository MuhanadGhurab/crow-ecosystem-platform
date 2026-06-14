import type { User } from "@supabase/supabase-js";

import { getCrowAuth, isPlatformStaff } from "@/lib/auth/roles";
import { prisma } from "@/lib/db";
import type { TenantScope } from "@/lib/crow-core/blueprint-persistence/tenant-scope";

/** Resolve tenant scope for Blueprint persistence from the authenticated session. */
export async function blueprintScopeFromSession(
  user: User | null
): Promise<TenantScope> {
  if (!user) {
    return { tenantId: null, isPlatformStaff: false };
  }
  const { role, tenantSlugs } = getCrowAuth(user);
  const platform = isPlatformStaff(role);
  if (platform) {
    return { tenantId: null, isPlatformStaff: true };
  }
  const slug = tenantSlugs[0];
  if (!slug) {
    return { tenantId: null, isPlatformStaff: false };
  }
  const tenant = await prisma.tenant.findUnique({
    where: { slug },
    select: { id: true },
  });
  return {
    tenantId: tenant?.id ?? null,
    isPlatformStaff: false,
  };
}
