import healthcareTemplate from "@/lib/discovery-templates/healthcare.json";
import logisticsTemplate from "@/lib/discovery-templates/logistics.json";
import retailTemplate from "@/lib/discovery-templates/retail.json";
import type { DiscoveryTemplatePack } from "@/lib/types/discovery-template";

export const DISCOVERY_INDUSTRY_OPTIONS = [
  { value: "", label: "General / other" },
  { value: "logistics", label: "Logistics & supply chain" },
  { value: "retail", label: "Retail" },
  { value: "healthcare", label: "Healthcare" },
] as const;

export type DiscoveryIndustryKey = "logistics" | "retail" | "healthcare";

const TEMPLATES: Record<DiscoveryIndustryKey, DiscoveryTemplatePack> = {
  logistics: logisticsTemplate as DiscoveryTemplatePack,
  retail: retailTemplate as DiscoveryTemplatePack,
  healthcare: healthcareTemplate as DiscoveryTemplatePack,
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
