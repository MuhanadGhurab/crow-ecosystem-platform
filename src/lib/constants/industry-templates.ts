import aviationTemplate from "@/lib/discovery-templates/aviation.json";
import constructionTemplate from "@/lib/discovery-templates/construction.json";
import healthcareTemplate from "@/lib/discovery-templates/healthcare.json";
import logisticsTemplate from "@/lib/discovery-templates/logistics.json";
import retailTemplate from "@/lib/discovery-templates/retail.json";
import type { DiscoveryTemplatePack } from "@/lib/types/discovery-template";

export const DISCOVERY_INDUSTRY_OPTIONS = [
  { value: "", label: "General / other" },
  { value: "logistics", label: "Logistics & supply chain" },
  { value: "construction", label: "Construction & engineering" },
  { value: "retail", label: "Retail" },
  { value: "healthcare", label: "Healthcare" },
  { value: "aviation", label: "Aviation & aerospace" },
] as const;

export type DiscoveryIndustryKey =
  | "logistics"
  | "retail"
  | "healthcare"
  | "construction"
  | "aviation";

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
