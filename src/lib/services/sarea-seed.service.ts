import { prisma } from "@/lib/db";

export {
  PERSONA_DISPLAY_NAMES,
  PERSONA_ROLE_ALIASES,
  SAREA_DEFAULT_PERSONA_KEYS,
} from "@/lib/services/sarea-seed-core";

import {
  backfillSareaProfileDefaults as backfillSareaProfileDefaultsCore,
  ensureTenantSareaPersonas as ensureTenantSareaPersonasCore,
  seedSareaProfileDefaults as seedSareaProfileDefaultsCore,
  upgradeLogisticsSareaForTenant as upgradeLogisticsSareaForTenantCore,
} from "@/lib/services/sarea-seed-core";

/** Default SAREA child records for one experience profile. */
export async function seedSareaProfileDefaults(profileId: string, personaKey: string) {
  return seedSareaProfileDefaultsCore(prisma, profileId, personaKey);
}

/** Idempotent: ensure each personaKey has a tenant profile + child defaults. */
export async function ensureTenantSareaPersonas(
  tenantId: string,
  personaKeys?: readonly string[]
) {
  return ensureTenantSareaPersonasCore(prisma, tenantId, personaKeys);
}

/** Backfill SAREA child data for profiles that only have the parent row. */
export async function backfillSareaProfileDefaults(tenantId?: string) {
  return backfillSareaProfileDefaultsCore(prisma, tenantId);
}

/** Idempotent MEEM / logistics SAREA upgrade — names, role aliases, logistics widgets, nav. */
export async function upgradeLogisticsSareaForTenant(tenantId: string) {
  return upgradeLogisticsSareaForTenantCore(prisma, tenantId);
}
