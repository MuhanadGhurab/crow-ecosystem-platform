import type { CemModuleKey } from "@/lib/constants/modules";

/** Marketing talent profiles — maps to SAREA persona families and workshop roles */
export const TALENT_PROFILES = [
  { key: "executive", label: "Executive" },
  { key: "manager", label: "Operations manager" },
  { key: "finance", label: "Finance" },
  { key: "hr", label: "HR" },
  { key: "sales", label: "Sales" },
  { key: "operations", label: "Operations" },
  { key: "warehouse", label: "Warehouse" },
  { key: "security", label: "Security / IT" },
  { key: "compliance", label: "Compliance" },
] as const;

export type TalentProfileKey = (typeof TALENT_PROFILES)[number]["key"];

/** Primary talent profiles per CEM module — see docs/PRODUCT_NARRATIVE.md */
export const MODULE_TALENT_PROFILES: Record<CemModuleKey, readonly TalentProfileKey[]> = {
  iam: ["manager", "security"],
  hr: ["hr", "manager"],
  finance: ["finance", "executive"],
  inventory: ["operations", "warehouse"],
  warehouse: ["warehouse", "operations"],
  logistics: ["operations", "manager"],
  sales: ["sales", "executive"],
  crm: ["sales", "manager"],
  procurement: ["finance", "operations"],
  projects: ["manager", "operations"],
  bi: ["executive", "finance"],
  documents: ["compliance", "manager"],
  approvals: ["manager", "executive"],
};

export function talentLabelsForModule(moduleKey: CemModuleKey): string[] {
  const keys = MODULE_TALENT_PROFILES[moduleKey] ?? [];
  const byKey = new Map<TalentProfileKey, string>(TALENT_PROFILES.map((p) => [p.key, p.label]));
  return keys.map((k) => byKey.get(k) ?? k);
}
