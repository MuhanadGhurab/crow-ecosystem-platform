export const BLUEPRINT_STUDIO_SECTIONS = [
  { key: "overview", label: "Overview" },
  { key: "organization", label: "Organization" },
  { key: "operations", label: "Operations" },
  { key: "security-trust", label: "Security & Trust" },
  { key: "experience-sarea", label: "Experience / SAREA" },
  { key: "integrations", label: "Integrations" },
  { key: "commercial", label: "Commercial" },
  { key: "roi", label: "ROI" },
  { key: "sow", label: "SOW" },
  { key: "versions-evidence", label: "Versions & Evidence" },
] as const;

export type BlueprintStudioSectionKey = (typeof BLUEPRINT_STUDIO_SECTIONS)[number]["key"];

export function isBlueprintStudioSectionKey(value: string): value is BlueprintStudioSectionKey {
  return BLUEPRINT_STUDIO_SECTIONS.some((s) => s.key === value);
}

export function blueprintStudioSectionLabel(key: BlueprintStudioSectionKey): string {
  return BLUEPRINT_STUDIO_SECTIONS.find((s) => s.key === key)?.label ?? key;
}
