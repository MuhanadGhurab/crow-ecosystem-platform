import type { EnterpriseBlueprintDocument } from "../blueprint";
import {
  getBlueprintByTenantAndId,
  resolveBlueprintTenantId,
} from "../blueprint-persistence/blueprint.repository";
import { mapPersistedRowToEnterpriseBlueprintDetail } from "../blueprint-persistence/blueprint-detail-mapper";
import { listTraceEventsForBlueprint } from "../blueprint-persistence/blueprint-trace.repository";
import type { TenantScope } from "../blueprint-persistence/tenant-scope";
import { adaptEnterpriseBlueprintDetailToDocument } from "../blueprint-studio/blueprint-document-adapter";
import {
  loadPersistedBlueprintVersions,
  mapPersistedTraceToTimeline,
  type PersistenceReadMode,
} from "./blueprint-dual-read.service";
export type BlueprintRuntimeLoadResult = {
  persistenceMode: PersistenceReadMode;
  tenantId: string | null;
  tenantUnresolved: boolean;
  activeDraftVersionId: string | null;
  draftRevision: number | null;
  draftContentHash: string | null;
  document: EnterpriseBlueprintDocument;
};

/** Read-only runtime enrichment for Studio — does not create or mutate versions. */
export async function loadBlueprintRuntimeReadState(
  scope: TenantScope,
  blueprintId: string,
  fallbackDocument: EnterpriseBlueprintDocument
): Promise<BlueprintRuntimeLoadResult | null> {
  const row = await getBlueprintByTenantAndId(scope, blueprintId);
  if (!row) return null;

  const tenantId = row.tenantId ?? (await resolveBlueprintTenantId(blueprintId));
  const activeDraftVersionId = row.activeDraftVersionId;
  const draftRevision = row.activeDraftVersion?.revision ?? null;
  const draftContentHash = row.activeDraftVersion?.contentHash ?? null;

  const { mode, versions } = await loadPersistedBlueprintVersions(
    scope,
    blueprintId,
    fallbackDocument
  );

  if (versions.length > 0) {
    const active =
      versions.find((v) => v.id === activeDraftVersionId) ?? versions[versions.length - 1];
    return {
      persistenceMode: mode,
      tenantId,
      tenantUnresolved: !tenantId,
      activeDraftVersionId: active?.id ?? activeDraftVersionId,
      draftRevision: active?.id === activeDraftVersionId ? draftRevision : null,
      draftContentHash: active?.contentHash ?? draftContentHash,
      document: active?.document ?? fallbackDocument,
    };
  }

  return {
    persistenceMode: "legacy_unversioned",
    tenantId,
    tenantUnresolved: !tenantId,
    activeDraftVersionId,
    draftRevision,
    draftContentHash,
    document: fallbackDocument,
  };
}

export async function loadPersistedTraceTimeline(
  scope: TenantScope,
  blueprintId: string
) {
  const events = await listTraceEventsForBlueprint(scope, blueprintId);
  return mapPersistedTraceToTimeline(blueprintId, events);
}
