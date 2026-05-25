import type { SectorTemplateKey } from "@/lib/org-intelligence/types";
import { SECTOR_TEMPLATE_KEYS } from "@/lib/org-intelligence/sector-template-data";

const INDUSTRY_ALIASES: Record<string, SectorTemplateKey> = {
  logistics: "logistics",
  "logistics & transport": "logistics",
  transport: "logistics",
  shipping: "logistics",
  "supply chain": "logistics",
  construction: "construction",
  engineering: "construction",
  aviation: "aviation",
  airline: "aviation",
  aerospace: "aviation",
  healthcare: "healthcare",
  health: "healthcare",
  hospital: "healthcare",
  medical: "healthcare",
  retail: "retail",
  commerce: "retail",
  "e-commerce": "retail",
};

const MODULE_SECTOR_HINTS: Record<string, SectorTemplateKey> = {
  logistics: "logistics",
  warehouse: "logistics",
  inventory: "logistics",
  procurement: "construction",
  hr: "healthcare",
  finance: "retail",
  sales: "retail",
  crm: "retail",
};

export function normalizeIndustry(industry?: string | null): string {
  return (industry ?? "").trim().toLowerCase();
}

export function resolveSectorTemplateKey(input: {
  industry?: string | null;
  moduleKeys?: string[];
  explicitKey?: string | null;
}): SectorTemplateKey {
  const explicit = input.explicitKey?.trim().toLowerCase();
  if (explicit && SECTOR_TEMPLATE_KEYS.includes(explicit as SectorTemplateKey)) {
    return explicit as SectorTemplateKey;
  }

  const industry = normalizeIndustry(input.industry);
  if (industry && INDUSTRY_ALIASES[industry]) {
    return INDUSTRY_ALIASES[industry];
  }

  for (const [alias, key] of Object.entries(INDUSTRY_ALIASES)) {
    if (industry.includes(alias)) return key;
  }

  const modules = input.moduleKeys ?? [];
  for (const mod of modules) {
    const hint = MODULE_SECTOR_HINTS[mod];
    if (hint) return hint;
  }

  /** Neutral default when industry and modules are ambiguous — avoids MEEM logistics bias. */
  return "retail";
}

/** Scale recommended headcounts by employee band (advisory only). */
export function scaleHeadcountByEmployeeBand(
  min: number,
  max: number,
  employeeBand?: string | null
): { min: number; max: number } {
  const band = (employeeBand ?? "").toLowerCase();
  let factor = 1;
  if (band.includes("1-10") || band.includes("1-50")) factor = 0.5;
  else if (band.includes("50-250") || band.includes("51-200")) factor = 1;
  else if (band.includes("250") || band.includes("1000")) factor = 1.5;
  else if (band.includes("1000+")) factor = 2;

  return {
    min: Math.max(1, Math.round(min * factor)),
    max: Math.max(min + 1, Math.round(max * factor)),
  };
}
