import {
  getSectorTemplateModel,
} from "@/lib/org-intelligence/sector-template-data";
import type { SectorTemplateKey } from "@/lib/org-intelligence/types";

export type DiscoveryAdvisoryRecommendations = {
  sectorKey: SectorTemplateKey;
  departments: string[];
  roles: string[];
  workflows: string[];
  cybercrow: string[];
  sarea: string[];
  blueprintNotes: string[];
};

export function buildAdvisoryRecommendations(sectorKey: SectorTemplateKey): DiscoveryAdvisoryRecommendations {
  const model = getSectorTemplateModel(sectorKey);
  return {
    sectorKey,
    departments: model.departments.slice(0, 8).map((d) => d.name),
    roles: model.positions.slice(0, 6).map((p) => p.title),
    workflows: model.workflows.slice(0, 5).map((w) => w.name),
    cybercrow: model.cybercrowBaselines.slice(0, 4).map((b) => b.name),
    sarea: model.sareaProfiles.slice(0, 4).map((s) => s.name),
    blueprintNotes: [
      `Sector template "${model.sectorName}" is advisory — edit structure before accept.`,
      `${model.departments.length} departments, ${model.positions.length} positions, ${model.workflows.length} workflows suggested.`,
      "CyberCrow and SAREA items are baseline suggestions, not deployed controls.",
    ],
  };
}
