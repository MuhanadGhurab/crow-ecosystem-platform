/**
 * Public sector catalog — validated operating models (F37).
 * Safe wording for marketing, request intake, and verification.
 */

import { CEM_MODULES, type CemModuleKey } from "@/lib/constants/modules";
import {
  AVIATION_RECOMMENDED_CEM_MODULE_KEYS,
  CONSTRUCTION_RECOMMENDED_CEM_MODULE_KEYS,
  HEALTHCARE_RECOMMENDED_CEM_MODULE_KEYS,
  LOGISTICS_RECOMMENDED_CEM_MODULE_KEYS,
  RETAIL_RECOMMENDED_CEM_MODULE_KEYS,
} from "@/lib/org-intelligence/sector-template-data";

export type ModeledSectorKey =
  | "logistics"
  | "retail"
  | "healthcare"
  | "construction"
  | "aviation";

export type SectorCatalogEntry = {
  key: ModeledSectorKey;
  title: string;
  badge: string;
  summary: string;
  readinessNote: string;
  coreWorkflows: readonly string[];
  cemModuleKeys: readonly CemModuleKey[];
  cybercrowFocus: readonly string[];
  sareaFocus: readonly string[];
  advisoryNote: string;
  entity: "cem" | "cybercrow" | "sarea";
};

function moduleLabels(keys: readonly string[]): string[] {
  return keys.map((k) => CEM_MODULES.find((m) => m.key === k)?.nameEn ?? k);
}

export const MODELED_SECTOR_CATALOG: SectorCatalogEntry[] = [
  {
    key: "logistics",
    title: "Logistics",
    badge: "Flagship",
    summary:
      "Multi-branch operations, dispatch, warehouse movement, and customer escalation — validated as the MEEM-style lighthouse operating model on staging.",
    readinessNote: "Lighthouse / staging-demo validated · advisory posture",
    coreWorkflows: [
      "Delivery request intake and dispatch assignment",
      "Driver task and shipment status updates",
      "Warehouse receiving and inventory movement",
      "Delivery exception review and monthly ops review",
    ],
    cemModuleKeys: LOGISTICS_RECOMMENDED_CEM_MODULE_KEYS,
    cybercrowFocus: [
      "Privileged dispatch and inventory changes",
      "Driver/mobile session monitoring (advisory)",
      "Incident and exception evidence trails",
    ],
    sareaFocus: [
      "Dispatch coordinator and warehouse lead density",
      "Branch manager exception dashboards",
      "Field workforce simplified views",
    ],
    advisoryNote:
      "Crow documents logistics readiness and workflow trust — not live telematics or carrier API integration in this phase.",
    entity: "cem",
  },
  {
    key: "retail",
    title: "Retail",
    badge: "Validated model",
    summary:
      "Store and customer-facing operations with catalog, inventory, sales, CRM, and reporting readiness — franchise-style structure without claiming live POS or loyalty integrations.",
    readinessNote: "Retail operating model · staging validated",
    coreWorkflows: [
      "Store sales intake and stock replenishment",
      "Customer issue escalation and returns review",
      "Procurement for store supplies",
      "Monthly store performance review",
    ],
    cemModuleKeys: RETAIL_RECOMMENDED_CEM_MODULE_KEYS,
    cybercrowFocus: [
      "Cash-handling and refund approval trails",
      "Store manager privileged access reviews",
      "Shrinkage / exception incident logging",
    ],
    sareaFocus: [
      "Store manager and floor supervisor layouts",
      "Regional ops rollup views",
      "Back-office finance-friendly density",
    ],
    advisoryNote:
      "Loyalty, e-commerce, and POS connectors are future-readiness only — not live modules in the current catalog.",
    entity: "cem",
  },
  {
    key: "construction",
    title: "Construction",
    badge: "Validated model",
    summary:
      "Project and site operations with procurement, materials, HSE/quality signals, and Rimal-style staging readiness — projects without claiming live BIM or site IoT feeds.",
    readinessNote: "Rimal-style staging readiness · advisory posture",
    coreWorkflows: [
      "Project mobilization and site setup",
      "Material requisition and procurement approval",
      "HSE incident report and quality inspection",
      "Subcontractor coordination and monthly project review",
    ],
    cemModuleKeys: CONSTRUCTION_RECOMMENDED_CEM_MODULE_KEYS,
    cybercrowFocus: [
      "Site access and subcontractor onboarding reviews",
      "HSE incident evidence and corrective actions",
      "Procurement override and budget change trails",
    ],
    sareaFocus: [
      "Site supervisor mobile-friendly tasks",
      "Project director rollup dashboards",
      "Safety officer exception-first views",
    ],
    advisoryNote:
      "Document management and site telemetry integrations are readiness notes only — operators confirm scope before blueprint.",
    entity: "cem",
  },
  {
    key: "aviation",
    title: "Aviation",
    badge: "Validated model",
    summary:
      "Ground and service operations with safety/quality workflows and Najm-style intake readiness — not an MRO or flight-ops replacement system.",
    readinessNote: "Najm-style intake readiness · advisory posture",
    coreWorkflows: [
      "Service request intake and ground handling coordination",
      "Maintenance work order and safety report",
      "Passenger service escalation",
      "Regulatory readiness review (advisory documentation)",
    ],
    cemModuleKeys: AVIATION_RECOMMENDED_CEM_MODULE_KEYS,
    cybercrowFocus: [
      "Safety event and incident review baselines",
      "Privileged maintenance and ground-access changes",
      "Third-party handler access reviews (advisory)",
    ],
    sareaFocus: [
      "Ground operations coordinator density",
      "Safety officer exception dashboards",
      "Passenger services simplified intake views",
    ],
    advisoryNote:
      "Crow supports aviation-style service intake and ops structure on staging — not certified aviation compliance or live regulator feeds.",
    entity: "cybercrow",
  },
  {
    key: "healthcare",
    title: "Healthcare",
    badge: "Validated model",
    summary:
      "Clinic and service operations with privacy/safety readiness — facility coordination, access reviews, and incident workflows without replacing clinical or EMR systems.",
    readinessNote: "Privacy/safety readiness pack · not clinical replacement",
    coreWorkflows: [
      "Patient service intake (non-clinical coordination)",
      "Staff access review and privacy incident report",
      "Facility maintenance and procurement request",
      "Monthly facility operations review",
    ],
    cemModuleKeys: HEALTHCARE_RECOMMENDED_CEM_MODULE_KEYS,
    cybercrowFocus: [
      "Privacy incident and access review baselines",
      "Break-glass and privileged clinical-adjacent access (advisory)",
      "Facility safety event documentation",
    ],
    sareaFocus: [
      "Clinic administrator operational density",
      "Privacy officer review-oriented layouts",
      "Front-desk simplified service coordination views",
    ],
    advisoryNote:
      "Do not position Crow as HIPAA-certified, EMR replacement, or autonomous clinical AI — advisory operations and trust workflows only.",
    entity: "cybercrow",
  },
];

const MODELED_BY_KEY = Object.fromEntries(
  MODELED_SECTOR_CATALOG.map((e) => [e.key, e])
) as Record<ModeledSectorKey, SectorCatalogEntry>;

export function getModeledSectorCatalog(key: string): SectorCatalogEntry | null {
  if (key in MODELED_BY_KEY) return MODELED_BY_KEY[key as ModeledSectorKey];
  return null;
}

export function getModeledSectorModuleLabels(key: ModeledSectorKey): string[] {
  return moduleLabels(MODELED_BY_KEY[key].cemModuleKeys);
}

/** Request intake — order matches F37 spec */
export const REQUEST_INDUSTRY_OPTIONS = [
  { value: "", label: "Other / Not sure" },
  { value: "logistics", label: "Logistics" },
  { value: "retail", label: "Retail" },
  { value: "construction", label: "Construction" },
  { value: "aviation", label: "Aviation" },
  { value: "healthcare", label: "Healthcare" },
] as const;

export type RequestIndustryPreview = {
  title: string;
  recommendedModules: string[];
  typicalWorkflows: string[];
  discoveryNext: string[];
  advisoryNote: string;
};

const OTHER_PREVIEW: RequestIndustryPreview = {
  title: "General discovery",
  recommendedModules: ["CRM", "Finance", "HR", "Approvals", "Reporting & dashboards"],
  typicalWorkflows: [
    "Implementation request review",
    "Department and role mapping",
    "Module and security package alignment",
  ],
  discoveryNext: [
    "Crow starts with a neutral retail-leaning baseline until your operator confirms sector.",
    "Organization, branches, roles, and workflows are captured in structured discovery.",
    "Sector template can be switched on the organization model page after review.",
  ],
  advisoryNote:
    "Selecting Other / Not sure does not auto-provision anything. An operator will confirm the best operating model before blueprint.",
};

export function getRequestIndustryPreview(industryValue: string): RequestIndustryPreview {
  const entry = getModeledSectorCatalog(industryValue);
  if (!entry) return OTHER_PREVIEW;
  return {
    title: entry.title,
    recommendedModules: moduleLabels(entry.cemModuleKeys).slice(0, 8),
    typicalWorkflows: [...entry.coreWorkflows].slice(0, 4),
    discoveryNext: [
      `Discovery opens with the ${entry.title.toLowerCase()} sector template and advisory guidance.`,
      "Departments, roles, and workflows are suggested for operator review — not auto-applied.",
      "CyberCrow and SAREA hints align to the same sector model on organization model and blueprint.",
    ],
    advisoryNote: entry.advisoryNote,
  };
}

/** Future / template-ready sectors shown below the five modeled cards on /industries */
export const FUTURE_SECTOR_READINESS = [
  {
    key: "holding",
    title: "Holding & conglomerate",
    summary:
      "Multi-entity intake, subsidiary discovery, and phased blueprint — template-ready, not a full first-class operating model yet.",
    entity: "sarea" as const,
  },
  {
    key: "public",
    title: "Public & semi-government",
    summary:
      "Governance-heavy discovery with auditor-oriented CyberCrow exports — readiness framing only, not certification claims.",
    entity: "cybercrow" as const,
  },
  {
    key: "energy",
    title: "Energy & industrial",
    summary:
      "Operational risk context on dashboards with GRC-oriented CyberCrow baselines — future expansion beyond the five validated models.",
    entity: "cem" as const,
  },
] as const;

/** Public marketing — legacy shape for clients page compatibility */
export const MARKETING_INDUSTRIES_LEGACY = [
  {
    key: "logistics",
    title: "Logistics & supply chain",
    summary: MODELED_BY_KEY.logistics.summary,
    entity: "cem" as const,
  },
  {
    key: "retail",
    title: "Retail & franchise",
    summary: MODELED_BY_KEY.retail.summary,
    entity: "cem" as const,
  },
  {
    key: "healthcare",
    title: "Healthcare operations",
    summary: MODELED_BY_KEY.healthcare.summary,
    entity: "cybercrow" as const,
  },
  {
    key: "holding",
    title: "Holding & conglomerate",
    summary: FUTURE_SECTOR_READINESS[0].summary,
    entity: "sarea" as const,
  },
  {
    key: "public",
    title: "Public sector & semi-government",
    summary: FUTURE_SECTOR_READINESS[1].summary,
    entity: "cybercrow" as const,
  },
  {
    key: "energy",
    title: "Energy & industrial",
    summary: FUTURE_SECTOR_READINESS[2].summary,
    entity: "cem" as const,
  },
] as const;
