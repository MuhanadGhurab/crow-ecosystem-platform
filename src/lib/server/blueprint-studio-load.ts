import { adaptEnterpriseBlueprintDetail } from "@/lib/crow-core/blueprint-studio/blueprint-adapter";
import { mapToBlueprintLifecycleState } from "@/lib/crow-core/blueprint-studio/blueprint-lifecycle";
import { assessBlueprintReadiness } from "@/lib/crow-core/blueprint-studio/blueprint-readiness.service";
import {
  createBlueprintVersionSnapshot,
  listBlueprintVersions,
} from "@/lib/crow-core/blueprint-studio/blueprint-version.service";
import {
  buildMeemGlobalReferenceDocument,
  buildMeemGlobalReferenceRoiModel,
  isMeemReferenceBlueprint,
} from "@/lib/crow-core/blueprint-studio/fixtures/meem-global-reference";
import type { EnterpriseBlueprintDocument } from "@/lib/crow-core/blueprint";
import type { RoiModel } from "@/lib/crow-core/commercial";
import { calculateRoi } from "@/lib/crow-core/commercial-intelligence/roi-calculator";
import { generateSowDraft } from "@/lib/crow-core/commercial-intelligence/sow-generator";
import type { TenantScope } from "@/lib/crow-core/blueprint-persistence/tenant-scope";
import {
  loadBlueprintRuntimeReadState,
  loadPersistedTraceTimeline,
} from "@/lib/crow-core/blueprint-runtime/blueprint-runtime.service";
import {
  loadPersistedBlueprintVersions,
  type PersistenceReadMode,
} from "@/lib/crow-core/blueprint-runtime/blueprint-dual-read.service";
import {
  buildBlueprintTraceTimeline,
  recordBlueprintTraceEvent,
} from "@/lib/crow-core/traceability/blueprint-traceability.service";
import type { BlueprintTraceTimeline } from "@/lib/crow-core/traceability";
import { shouldUseMockBlueprint } from "@/lib/mock/blueprint";
import { getEnterpriseBlueprint } from "@/lib/services/blueprint.service";

function buildDefaultRoiModel(document: EnterpriseBlueprintDocument): RoiModel {
  const comm = document.slices.find((s) => s.type === "commercial");
  const implementation =
    comm && comm.type === "commercial" && comm.implementationEffortDays != null
      ? comm.implementationEffortDays * 4000
      : 120_000;
  const subscription =
    comm && comm.type === "commercial" && comm.timelineWeeks != null
      ? comm.timelineWeeks * 2500
      : 48_000;

  return {
    blueprintVersion: document.ref.version,
    assumptions: [
      {
        key: "manual_process_cost",
        label: "Manual process cost (annual)",
        source: "operator_estimate",
        value: 180_000,
        unit: "SAR/year",
        confidence: "low",
        owner: "ProCrow commercial",
        approvalStatus: "draft",
        formulaRelationship: "annual_benefit_base",
      },
      {
        key: "productivity_gains",
        label: "Productivity gains (annual)",
        source: "operator_estimate",
        value: 95_000,
        unit: "SAR/year",
        confidence: "low",
        owner: "ProCrow commercial",
        approvalStatus: "draft",
        formulaRelationship: "annual_benefit_base",
      },
      {
        key: "implementation",
        label: "Implementation cost",
        source: "benchmark",
        value: implementation,
        unit: "SAR",
        confidence: "medium",
        owner: "ProCrow delivery",
        approvalStatus: "draft",
        formulaRelationship: "payback_denominator",
      },
      {
        key: "subscription_annual",
        label: "Annual subscription",
        source: "benchmark",
        value: subscription,
        unit: "SAR/year",
        confidence: "medium",
        owner: "ProCrow commercial",
        approvalStatus: "draft",
        formulaRelationship: "annual_cost_base",
      },
    ],
    currentAnnualCostEstimate: null,
    implementationCostEstimate: implementation,
    subscriptionAnnualEstimate: subscription,
    projectedAnnualSavings: null,
    paybackPeriodMonths: null,
    threeYearValue: null,
    riskReductionValue: null,
    confidenceRange: null,
    exclusions: ["Discovery-derived assumptions — not client-validated"],
    advisoryOnly: true,
  };
}

export type BlueprintStudioContext = {
  blueprintId: string;
  organizationName: string;
  blueprintStatus: string;
  proposalStatus: string | null;
  requestStatus: string;
  isReferenceFixture: boolean;
  document: EnterpriseBlueprintDocument;
  lifecycleState: ReturnType<typeof mapToBlueprintLifecycleState>;
  readiness: ReturnType<typeof assessBlueprintReadiness>;
  roiModel: RoiModel;
  roiResult: ReturnType<typeof calculateRoi>;
  sowResult: ReturnType<typeof generateSowDraft>;
  versions: ReturnType<typeof listBlueprintVersions>;
  timeline: BlueprintTraceTimeline;
  persistenceMode?: PersistenceReadMode;
  tenantId?: string | null;
  tenantUnresolved?: boolean;
  activeDraftVersionId?: string | null;
  draftRevision?: number | null;
  draftContentHash?: string | null;
};

async function loadVersionsForStudio(
  blueprintId: string,
  document: EnterpriseBlueprintDocument,
  scope: TenantScope | undefined,
  detailVersion: number
): Promise<{
  versions: ReturnType<typeof listBlueprintVersions>;
  persistenceMode: PersistenceReadMode;
}> {
  const usePersistence = scope && !shouldUseMockBlueprint(blueprintId);
  if (usePersistence) {
    const persisted = await loadPersistedBlueprintVersions(scope, blueprintId, document);
    if (persisted.versions.length > 0) {
      return { versions: persisted.versions, persistenceMode: persisted.mode };
    }
  }

  let versions = listBlueprintVersions(blueprintId);
  if (versions.length === 0) {
    createBlueprintVersionSnapshot(document);
    recordBlueprintTraceEvent({
      blueprintId,
      stage: "blueprint_version",
      actor: {
        actorType: "system_process",
        actorId: "blueprint-studio",
        displayName: "Blueprint Studio",
        isNonHuman: true,
      },
      summary: "Initial studio snapshot created from current blueprint state",
      version: detailVersion,
      document,
    });
    versions = listBlueprintVersions(blueprintId);
  }

  return { versions, persistenceMode: "legacy_unversioned" };
}

async function loadTimelineForStudio(
  blueprintId: string,
  scope: TenantScope | undefined
): Promise<BlueprintTraceTimeline> {
  if (scope && !shouldUseMockBlueprint(blueprintId)) {
    const persisted = await loadPersistedTraceTimeline(scope, blueprintId);
    if (persisted.events.length > 0) {
      return persisted;
    }
  }
  return buildBlueprintTraceTimeline(blueprintId);
}

export async function loadBlueprintStudioContext(
  blueprintId: string,
  scope?: TenantScope
): Promise<BlueprintStudioContext | null> {
  const detail = await getEnterpriseBlueprint(blueprintId, scope);
  if (!detail) return null;

  const isReferenceFixture = isMeemReferenceBlueprint(blueprintId);
  const document =
    isReferenceFixture && buildMeemGlobalReferenceDocument()
      ? buildMeemGlobalReferenceDocument()!
      : adaptEnterpriseBlueprintDetail(detail);

  const lifecycleState = mapToBlueprintLifecycleState({
    blueprintStatus: detail.status,
    proposalStatus: detail.proposalStatus,
    requestStatus: detail.request.status,
  });

  const readiness = assessBlueprintReadiness(document);
  const roiModel = isReferenceFixture
    ? buildMeemGlobalReferenceRoiModel()
    : buildDefaultRoiModel(document);
  const roiResult = calculateRoi({ model: roiModel });
  const sowResult = generateSowDraft({ document, roiModel });

  const { versions, persistenceMode } = await loadVersionsForStudio(
    blueprintId,
    document,
    scope,
    detail.version
  );

  const timeline = await loadTimelineForStudio(blueprintId, scope);

  const runtimeRead =
    scope && !shouldUseMockBlueprint(blueprintId)
      ? await loadBlueprintRuntimeReadState(scope, blueprintId, document)
      : null;

  return {
    blueprintId,
    organizationName: detail.request.organizationName,
    blueprintStatus: detail.status,
    proposalStatus: detail.proposalStatus,
    requestStatus: detail.request.status,
    isReferenceFixture,
    document: runtimeRead?.document ?? document,
    lifecycleState,
    readiness,
    roiModel,
    roiResult,
    sowResult,
    versions,
    timeline,
    persistenceMode: runtimeRead?.persistenceMode ?? persistenceMode,
    tenantId: runtimeRead?.tenantId ?? detail.tenantId ?? null,
    tenantUnresolved: runtimeRead?.tenantUnresolved ?? false,
    activeDraftVersionId: runtimeRead?.activeDraftVersionId ?? null,
    draftRevision: runtimeRead?.draftRevision ?? null,
    draftContentHash: runtimeRead?.draftContentHash ?? null,
  };
}
