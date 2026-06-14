import { prisma } from "@/lib/db";

import { mapPersistedRowToEnterpriseBlueprintDetail } from "../blueprint-persistence/blueprint-detail-mapper";
import { resolveBlueprintTenantId } from "../blueprint-persistence/blueprint.repository";
import {
  getActiveDraftForBlueprint,
  listVersionsForBlueprint,
} from "../blueprint-persistence/blueprint-version.repository";
import { type TenantScope } from "../blueprint-persistence/tenant-scope";
import { ensureInitialDraftVersion } from "./blueprint-versioning.service";
import { adaptEnterpriseBlueprintDetailToDocument } from "../blueprint-studio/blueprint-document-adapter";

export type BackfillRowResult = {
  blueprintId: string;
  tenantId: string | null;
  action: "skipped_existing" | "created_v1" | "unresolved_tenant" | "not_found";
  message: string;
};

export type BackfillReport = {
  dryRun: boolean;
  processed: number;
  created: number;
  skipped: number;
  unresolved: number;
  rows: BackfillRowResult[];
};

export type BackfillOptions = {
  dryRun: boolean;
  tenantId?: string;
  blueprintId?: string;
  limit?: number;
};

export async function runBlueprintPersistenceBackfill(
  options: BackfillOptions
): Promise<BackfillReport> {
  const limit = options.limit ?? 500;
  const rows = await prisma.enterpriseBlueprint.findMany({
    where: {
      ...(options.tenantId ? { tenantId: options.tenantId } : {}),
      ...(options.blueprintId ? { id: options.blueprintId } : {}),
    },
    take: limit,
    orderBy: { updatedAt: "asc" },
    include: {
      modules: true,
      request: {
        include: {
          contacts: true,
          requestedModules: true,
          requestedSecurityPkgs: true,
          requestedPlans: true,
          discoveryProfile: {
            include: { answers: true, experienceRequirements: true },
          },
        },
      },
      tenantOwner: { select: { id: true, slug: true, organization: true } },
      activeDraftVersion: true,
      currentApprovedVersion: true,
    },
  });

  const report: BackfillReport = {
    dryRun: options.dryRun,
    processed: 0,
    created: 0,
    skipped: 0,
    unresolved: 0,
    rows: [],
  };

  for (const blueprint of rows) {
    report.processed += 1;
    const tenantId =
      blueprint.tenantId ?? (await resolveBlueprintTenantId(blueprint.id));

    if (!tenantId) {
      report.unresolved += 1;
      report.rows.push({
        blueprintId: blueprint.id,
        tenantId: null,
        action: "unresolved_tenant",
        message: "Tenant ownership unresolved — excluded from apply",
      });
      continue;
    }

    const scope: TenantScope = { tenantId, isPlatformStaff: true };
    const existingVersions = await listVersionsForBlueprint(scope, blueprint.id);
    if (existingVersions.length > 0) {
      const active = await getActiveDraftForBlueprint(scope, blueprint.id);
      report.skipped += 1;
      report.rows.push({
        blueprintId: blueprint.id,
        tenantId,
        action: "skipped_existing",
        message: active
          ? `Already has ${existingVersions.length} version(s); active draft ${active.id}`
          : `Already has ${existingVersions.length} version(s)`,
      });
      continue;
    }

    if (options.dryRun) {
      report.created += 1;
      report.rows.push({
        blueprintId: blueprint.id,
        tenantId,
        action: "created_v1",
        message: "Would create version 1 (LEGACY_IMPORT provenance)",
      });
      continue;
    }

    const detail = mapPersistedRowToEnterpriseBlueprintDetail(blueprint);
    const document = adaptEnterpriseBlueprintDetailToDocument(detail);
    await ensureInitialDraftVersion({
      scope,
      blueprintId: blueprint.id,
      tenantId,
      document,
      authorUserId: null,
    });

    await prisma.enterpriseBlueprintVersion.updateMany({
      where: {
        blueprintId: blueprint.id,
        versionNumber: 1,
      },
      data: {
        provenance: "LEGACY_IMPORT",
      },
    });

    report.created += 1;
    report.rows.push({
      blueprintId: blueprint.id,
      tenantId,
      action: "created_v1",
      message: "Created version 1 with LEGACY_IMPORT provenance (not approved)",
    });
  }

  return report;
}
