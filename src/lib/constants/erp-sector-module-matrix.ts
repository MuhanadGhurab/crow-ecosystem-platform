/**
 * G1 — Sector → ERP module priority matrix (advisory, code-backed).
 */

import type { ModeledSectorKey } from "@/lib/constants/sector-catalog";
import type { ErpModuleKey } from "@/lib/constants/erp-module-registry";
import {
  AVIATION_RECOMMENDED_ERP_MODULE_KEYS,
  CONSTRUCTION_RECOMMENDED_ERP_MODULE_KEYS,
  HEALTHCARE_RECOMMENDED_ERP_MODULE_KEYS,
  LOGISTICS_RECOMMENDED_ERP_MODULE_KEYS,
  RETAIL_RECOMMENDED_ERP_MODULE_KEYS,
} from "@/lib/org-intelligence/sector-template-data";

export type SectorModuleTier = "primary" | "secondary" | "optional";

export type SectorModuleMatrixRow = {
  sector: ModeledSectorKey;
  primary: readonly ErpModuleKey[];
  secondary: readonly ErpModuleKey[];
  /** Platform routes that matter for every sector */
  foundation: readonly string[];
  advisoryNote: string;
};

const FOUNDATION = [
  "workflows",
  "tasks",
  "reports",
  "departments",
  "roles",
  "users",
] as const;

export const ERP_SECTOR_MODULE_MATRIX: SectorModuleMatrixRow[] = [
  {
    sector: "logistics",
    primary: [...LOGISTICS_RECOMMENDED_ERP_MODULE_KEYS],
    secondary: [],
    foundation: [...FOUNDATION],
    advisoryNote:
      "Logistics module is MEEM-aligned; other tenants may enable logistics for advisory demos only.",
  },
  {
    sector: "retail",
    primary: [...RETAIL_RECOMMENDED_ERP_MODULE_KEYS],
    secondary: [],
    foundation: [...FOUNDATION],
    advisoryNote: "Store ops and replenishment drive module priority — no POS replacement claim.",
  },
  {
    sector: "construction",
    primary: [...CONSTRUCTION_RECOMMENDED_ERP_MODULE_KEYS],
    secondary: [],
    foundation: [...FOUNDATION],
    advisoryNote: "Project delivery often maps to tasks/workflows before dedicated projects module route.",
  },
  {
    sector: "aviation",
    primary: [...AVIATION_RECOMMENDED_ERP_MODULE_KEYS],
    secondary: [],
    foundation: [...FOUNDATION],
    advisoryNote: "MRO and charter workflows lean on CRM/sales + approvals — advisory Najm alignment only.",
  },
  {
    sector: "healthcare",
    primary: [...HEALTHCARE_RECOMMENDED_ERP_MODULE_KEYS],
    secondary: [],
    foundation: [...FOUNDATION],
    advisoryNote:
      "Clinical systems are out of scope; privacy and access evidence tie to CyberCrow advisory posture.",
  },
];

const MATRIX_BY_SECTOR = new Map(ERP_SECTOR_MODULE_MATRIX.map((r) => [r.sector, r]));

export function getSectorModuleMatrix(
  sector: ModeledSectorKey
): SectorModuleMatrixRow | undefined {
  return MATRIX_BY_SECTOR.get(sector);
}

export function sectorTierForModule(
  sector: ModeledSectorKey,
  erpKey: ErpModuleKey
): SectorModuleTier {
  const row = MATRIX_BY_SECTOR.get(sector);
  if (!row) return "optional";
  if (row.primary.includes(erpKey)) return "primary";
  if (row.secondary.includes(erpKey)) return "secondary";
  return "optional";
}
