import aviationTemplate from "@/lib/discovery-templates/aviation.json";
import constructionTemplate from "@/lib/discovery-templates/construction.json";
import healthcareTemplate from "@/lib/discovery-templates/healthcare.json";
import logisticsTemplate from "@/lib/discovery-templates/logistics.json";
import retailTemplate from "@/lib/discovery-templates/retail.json";
import type { DiscoveryTemplatePack } from "@/lib/types/discovery-template";

export {
  REQUEST_INDUSTRY_OPTIONS as DISCOVERY_INDUSTRY_OPTIONS,
  getRequestIndustryPreview,
} from "@/lib/constants/sector-catalog";

import type { ModeledSectorKey } from "@/lib/constants/sector-catalog";

export type DiscoveryIndustryKey = ModeledSectorKey;

const TEMPLATES: Record<DiscoveryIndustryKey, DiscoveryTemplatePack> = {
  logistics: logisticsTemplate as DiscoveryTemplatePack,
  retail: retailTemplate as DiscoveryTemplatePack,
  healthcare: healthcareTemplate as DiscoveryTemplatePack,
  construction: constructionTemplate as DiscoveryTemplatePack,
  aviation: aviationTemplate as DiscoveryTemplatePack,
};

export function getDiscoveryTemplate(industryKey: string): DiscoveryTemplatePack | null {
  if (industryKey in TEMPLATES) {
    return TEMPLATES[industryKey as DiscoveryIndustryKey];
  }
  return null;
}

export function listDiscoveryTemplateKeys(): DiscoveryIndustryKey[] {
  return Object.keys(TEMPLATES) as DiscoveryIndustryKey[];
}
