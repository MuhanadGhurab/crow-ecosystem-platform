import "@/lib/server-only-guard";

import { MODELED_SECTOR_CATALOG } from "@/lib/constants/sector-catalog";
import type {
  ClientDiscoveryIndustryTemplate,
  ClientDiscoveryRecommendation,
  ClientDiscoveryStageTemplate,
} from "@/lib/client-portal/client-discovery-contract";
import { getClientDiscoveryStageTemplate } from "@/lib/constants/client-discovery-stage-templates";
import {
  getSectorTemplateModel,
  SECTOR_TEMPLATE_KEYS,
} from "@/lib/org-intelligence/sector-template-data";
import type { SectorTemplateKey } from "@/lib/org-intelligence/types";
import { getDiscoveryTemplate } from "@/lib/constants/industry-templates";

function stageSliceCount(total: number, intensity: "core" | "expanded" | "full"): number {
  if (total <= 0) return 0;
  if (intensity === "core") return Math.max(2, Math.ceil(total * 0.45));
  if (intensity === "expanded") return Math.max(3, Math.ceil(total * 0.7));
  return total;
}

function resolveSectorKey(
  industry: ClientDiscoveryIndustryTemplate | null
): SectorTemplateKey | null {
  if (!industry || industry === "general") return null;
  if (SECTOR_TEMPLATE_KEYS.includes(industry as SectorTemplateKey)) {
    return industry as SectorTemplateKey;
  }
  return null;
}

/** Advisory recommendations from industry + company stage (no pricing guarantee). */
export function buildClientDiscoveryRecommendations(input: {
  industryTemplate: ClientDiscoveryIndustryTemplate | null;
  companyStageTemplate: ClientDiscoveryStageTemplate | null;
}): ClientDiscoveryRecommendation {
  const stage = getClientDiscoveryStageTemplate(input.companyStageTemplate);
  const intensity = stage?.moduleIntensity ?? "expanded";

  const sectorKey = resolveSectorKey(input.industryTemplate);
  const sectorCatalog = input.industryTemplate
    ? MODELED_SECTOR_CATALOG.find((s) => s.key === input.industryTemplate)
    : null;

  if (sectorKey) {
    const model = getSectorTemplateModel(sectorKey);
    const pack = getDiscoveryTemplate(sectorKey);
    const deptCount = stageSliceCount(model.departments.length, intensity);
    const roleCount = stageSliceCount(model.positions.length, intensity);
    const workflowCount = stageSliceCount(model.workflows.length, intensity);

    const modules =
      sectorCatalog?.cemModuleKeys.map(String) ?? pack?.moduleKeys.map(String) ?? [];

    return {
      departments: model.departments.slice(0, deptCount).map((d) => d.name),
      roles: model.positions.slice(0, roleCount).map((p) => p.title),
      modules: modules.slice(0, stageSliceCount(modules.length, intensity)),
      workflows: model.workflows.slice(0, workflowCount).map((w) => w.name),
      security: sectorCatalog?.cybercrowFocus.map(String) ?? [
        "Standard security baseline",
        "Access governance",
      ],
      sarea: sectorCatalog?.sareaFocus.map(String) ?? ["Role-based navigation", "Department dashboards"],
      advisoryNote:
        sectorCatalog?.advisoryNote ??
        "Recommendations are advisory. ProCrow validates and refines the official blueprint.",
    };
  }

  return {
    departments: ["Operations", "Finance", "Customer accounts"],
    roles: ["Operations manager", "Finance lead", "Department supervisor"],
    modules: ["crm", "finance", "hr", "tasks", "reports"],
    workflows: ["Purchase approval", "Customer onboarding", "Month-end close readiness"],
    security: ["Standard security baseline", "ProCrow advisory review required"],
    sarea: ["Simple role-based dashboards", "ProCrow configures final SAREA profile"],
    advisoryNote:
      "General template — select your industry in discovery for tighter recommendations. ProCrow review required.",
  };
}
