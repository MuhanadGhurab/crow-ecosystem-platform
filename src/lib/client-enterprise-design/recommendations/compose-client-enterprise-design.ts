import { listCapabilities } from "@/lib/tenant-composition/registry";
import { listWorkPersonas, listWorkflowTemplates } from "@/lib/model-forge";
import { buildScaleProfile } from "@/lib/model-forge/scale/tenant-scale";
import type { TenantScalePreset } from "@/lib/model-forge/types";
import { getBusinessPurpose } from "../purposes/business-purpose-catalog";
import { resolveRecommendedPurposes } from "../purposes/industry-purpose-mappings";
import { adjustVariantForPriority, MODEL_VARIANT_BASELINES } from "../comparisons/model-variants";
import type {
  ClientEnterpriseDesignInput,
  ClientEnterpriseDesignSnapshot,
  ClientRecommendationProvenance,
  LeanResponsibleOperatingModel,
} from "../types";
import { CLIENT_ENTERPRISE_DESIGN_SCHEMA_VERSION } from "../types";
import { buildLeanResponsibleOperatingModel } from "../lean-model/build-lean-responsible-model";

function stableSort(keys: string[]): string[] {
  return [...keys].sort();
}

function scalePresetFromKey(key: string | null): TenantScalePreset {
  const map: Record<string, TenantScalePreset> = {
    SOLO: "SOLO",
    MICRO: "MICRO",
    SMALL_TEAM: "SMALL_TEAM",
    STARTER: "SMALL_TEAM",
    GROWTH: "GROWING_ORGANIZATION",
    GROWING_ORGANIZATION: "GROWING_ORGANIZATION",
    ENTERPRISE: "ENTERPRISE",
    MULTI_BRANCH: "MULTI_BRANCH",
  };
  return map[key ?? ""] ?? "SMALL_TEAM";
}

function collectCapabilities(input: ClientEnterpriseDesignInput): string[] {
  const fromPurposes = input.businessPurposes.flatMap((p) => getBusinessPurpose(p)?.recommendedCapabilityKeys ?? []);
  const selected = input.selectedCapabilities;
  return stableSort([...new Set([...fromPurposes, ...selected])]);
}

function collectPersonas(input: ClientEnterpriseDesignInput, capabilityKeys: string[]): string[] {
  const fromPurposes = input.businessPurposes.flatMap((p) => getBusinessPurpose(p)?.recommendedPersonaKeys ?? []);
  const fromCaps = capabilityKeys.flatMap((cap) => {
    const def = listCapabilities().find((c) => c.key === cap);
    return def?.recommendedRoleArchetypeKeys ?? [];
  });
  return stableSort([...new Set([...fromPurposes, ...fromCaps])]).slice(0, 12);
}

function collectWorkflows(input: ClientEnterpriseDesignInput): string[] {
  const fromPurposes = input.businessPurposes.flatMap((p) => getBusinessPurpose(p)?.recommendedWorkflowKeys ?? []);
  return stableSort([...new Set(fromPurposes)]).slice(0, 8);
}

function buildProvenance(
  input: ClientEnterpriseDesignInput,
  capabilityKeys: string[],
  personaKeys: string[],
): ClientRecommendationProvenance[] {
  const items: ClientRecommendationProvenance[] = [];
  if (input.primaryIndustry) {
    items.push({
      recommendationKey: `industry:${input.primaryIndustry}`,
      essentiality: "recommended",
      causedBySelection: `primaryIndustry=${input.primaryIndustry}`,
      catalogSource: "tenant-composition/industry-archetype-catalog",
      ruleApplied: "industry_capability_hints",
      simpleExplanation: "Crow aligned capabilities with your selected field.",
      advancedExplanation: `Industry archetype ${input.primaryIndustry} informed capability and workflow recommendations.`,
    });
  }
  for (const purposeKey of input.businessPurposes) {
    items.push({
      recommendationKey: `purpose:${purposeKey}`,
      essentiality: input.primaryPurposeKey === purposeKey ? "essential" : "recommended",
      causedBySelection: `businessPurpose=${purposeKey}`,
      catalogSource: "client-enterprise-design/business-purpose-catalog",
      ruleApplied: "purpose_capability_expansion",
      simpleExplanation: `Your purpose "${purposeKey.replace(/_/g, " ")}" shaped recommended workflows and responsibilities.`,
      advancedExplanation: `Purpose catalog entry ${purposeKey} expanded capabilities and persona suggestions.`,
    });
  }
  for (const cap of capabilityKeys.slice(0, 5)) {
    items.push({
      recommendationKey: `capability:${cap}`,
      essentiality: input.selectedCapabilities.includes(cap) ? "essential" : "recommended",
      causedBySelection: input.selectedCapabilities.includes(cap) ? `selectedCapability=${cap}` : `derivedFromPurpose`,
      catalogSource: "tenant-composition/capability-catalog",
      ruleApplied: "capability_workflow_binding",
      simpleExplanation: `Capability "${cap.replace(/_/g, " ")}" supports your operating model.`,
      advancedExplanation: `Capability catalog binding for ${cap}.`,
    });
  }
  for (const persona of personaKeys.slice(0, 4)) {
    items.push({
      recommendationKey: `persona:${persona}`,
      essentiality: "recommended",
      causedBySelection: "capability_persona_binding",
      catalogSource: "model-forge/work-persona-catalog",
      ruleApplied: "persona_from_capability",
      simpleExplanation: `Operating responsibility "${persona.replace(/_/g, " ")}" is commonly needed.`,
      advancedExplanation: `Work Persona ${persona} suggested from capability bindings.`,
    });
  }
  if (input.operatingPriority) {
    items.push({
      recommendationKey: `priority:${input.operatingPriority}`,
      essentiality: "essential",
      causedBySelection: `operatingPriority=${input.operatingPriority}`,
      catalogSource: "client-enterprise-design/types",
      ruleApplied: "priority_variant_adjustment",
      simpleExplanation: "Your operating priority adjusted team range and control depth.",
      advancedExplanation: `Priority ${input.operatingPriority} modified variant approval depth and team range.`,
    });
  }
  return items;
}

export function composeClientEnterpriseDesign(
  input: ClientEnterpriseDesignInput,
): ClientEnterpriseDesignSnapshot {
  const purposes =
    input.businessPurposes.length > 0
      ? input.businessPurposes
      : resolveRecommendedPurposes({
          primaryIndustry: input.primaryIndustry,
          specialistDomains: input.specialistDomains,
        });

  const normalized: ClientEnterpriseDesignInput = {
    ...input,
    businessPurposes: stableSort(purposes),
    specialistDomains: stableSort(input.specialistDomains),
    secondaryIndustries: stableSort(input.secondaryIndustries),
    selectedCapabilities: stableSort(input.selectedCapabilities),
  };

  const capabilityKeys = collectCapabilities(normalized);
  const personaKeys = collectPersonas(normalized, capabilityKeys);
  const workflowKeys = collectWorkflows(normalized);
  const currentScale = buildScaleProfile(scalePresetFromKey(normalized.currentScale));
  const targetScale = buildScaleProfile(scalePresetFromKey(normalized.targetScale ?? normalized.currentScale));

  const variants = (["STARTER", "GROWTH", "ENTERPRISE", "CUSTOM"] as const).map((key) => {
    const base = { ...MODEL_VARIANT_BASELINES[key] };
    base.capabilityKeys = capabilityKeys;
    base.personaKeys = personaKeys;
    base.departmentKeys = stableSort(
      capabilityKeys
        .map((c) => listCapabilities().find((x) => x.key === c)?.group)
        .filter((g): g is string => Boolean(g)),
    );
    base.cyberCrowRecommendations = ["baseline_identity_trust", "audit_and_evidence"];
    base.sareaRecommendations = ["operations_control_board", "manager_work_queue"];
    base.integrationRecommendations = capabilityKeys.includes("crm") ? ["email_connector"] : [];
    return adjustVariantForPriority(base, normalized.operatingPriority);
  });

  const recommendedVariant =
    targetScale.preset === "ENTERPRISE" || targetScale.preset === "GROUP_OR_ECOSYSTEM"
      ? "ENTERPRISE"
      : targetScale.preset === "GROWING_ORGANIZATION" || targetScale.preset === "MULTI_DEPARTMENT"
        ? "GROWTH"
        : normalized.selectedModelVariant !== "CUSTOM"
          ? normalized.selectedModelVariant
          : "STARTER";

  const leanModel = buildLeanResponsibleOperatingModel({
    input: normalized,
    variant: variants.find((v) => v.key === recommendedVariant) ?? variants[0]!,
    personaKeys,
    currentScale,
    targetScale,
  });

  const workflowSummaries = workflowKeys.map((key) => {
    const wf = listWorkflowTemplates().find((w) => w.key === key);
    return {
      key,
      displayName: wf?.displayName ?? key.replace(/_/g, " "),
      purpose: wf?.purpose ?? wf?.description ?? "Support daily operations for your selected purposes.",
      trigger: wf?.trigger ?? "Business event or client request",
      stages: [...(wf?.states ?? ["Intake", "Execute", "Close"])],
      responsiblePersonas: personaKeys.slice(0, 3),
      approvals: recommendedVariant === "ENTERPRISE" ? ["Supervisor review", "Manager approval"] : ["Owner review"],
      evidence: [...(wf?.evidenceRequirementKeys ?? ["Activity record", "Status change"])],
      automationOpportunities: ["Reminder notifications", "Status routing"],
    };
  });

  const warnings: string[] = [];
  if (!normalized.primaryIndustry) warnings.push("Select a primary field to sharpen recommendations.");
  if (!normalized.primaryPurposeKey) warnings.push("Select a primary business purpose.");
  if (normalized.operatingPriority === "LEAN_RESPONSIBLE") {
    warnings.push("Lean models trade specialization for efficiency — review segregation of duties.");
  }

  const unresolvedDecisions: string[] = [];
  if (capabilityKeys.length > 12) {
    unresolvedDecisions.push("Large capability set — confirm phasing for first release.");
  }

  return {
    schemaVersion: CLIENT_ENTERPRISE_DESIGN_SCHEMA_VERSION,
    variants,
    recommendedVariant,
    recommendedCapabilities: capabilityKeys,
    recommendedPersonaKeys: personaKeys,
    workflowSummaries,
    leanModel,
    warnings,
    unresolvedDecisions,
    provenance: buildProvenance(normalized, capabilityKeys, personaKeys),
  };
}

export function normalizeDesignInputForHash(input: ClientEnterpriseDesignInput): string {
  return JSON.stringify({
    ...input,
    businessPurposes: stableSort(input.businessPurposes),
    specialistDomains: stableSort(input.specialistDomains),
    secondaryIndustries: stableSort(input.secondaryIndustries),
    selectedCapabilities: stableSort(input.selectedCapabilities),
    customizations: (input.customizations ?? []).map((c) => ({ ...c })).sort((a, b) => a.id.localeCompare(b.id)),
  });
}
