import type { EnterpriseBlueprintDetail } from "@/lib/services/blueprint.service";
import type { getBlueprintByTenantAndId } from "./blueprint.repository";

type PersistedBlueprintRow = NonNullable<
  Awaited<ReturnType<typeof getBlueprintByTenantAndId>>
>;

/** Map C2 persistence row (tenantOwner) to legacy EnterpriseBlueprintDetail shape (tenant). */
export function mapPersistedRowToEnterpriseBlueprintDetail(
  row: PersistedBlueprintRow
): EnterpriseBlueprintDetail {
  const { tenantOwner, activeDraftVersion, currentApprovedVersion, ...rest } = row;
  void activeDraftVersion;
  void currentApprovedVersion;

  const tenant = tenantOwner
    ? {
        id: tenantOwner.id,
        slug: tenantOwner.slug,
        organization: tenantOwner.organization,
        blueprintId: row.id,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        status: "ACTIVE" as const,
        planCode: null,
        regionCode: null,
        locale: null,
        timezone: null,
        currency: null,
        onboardingCompletedAt: null,
        goLiveAt: null,
        suspendedAt: null,
        deletedAt: null,
        metadata: null,
      }
    : null;

  return {
    ...rest,
    tenant,
  } as EnterpriseBlueprintDetail;
}
