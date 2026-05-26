import type { SectorTemplateKey } from "@/lib/org-intelligence/types";
import { resolveSectorTemplateKey } from "@/lib/org-intelligence/resolve-sector";

export type SectorGuidance = {
  sectorKey: SectorTemplateKey;
  headline: string;
  whyItMatters: string;
  focusAreas: string[];
  departmentHints: string[];
  workflowExamples: string[];
  securityHints: string[];
  sareaHints: string[];
  cybercrowHints: string[];
  blueprintNotes: string[];
};

const GUIDANCE: Record<SectorTemplateKey, SectorGuidance> = {
  logistics: {
    sectorKey: "logistics",
    headline: "Logistics & fleet operations",
    whyItMatters:
      "Branch-scoped access, dispatch workflows, and field workforce patterns drive CEM structure and CyberCrow monitoring.",
    focusAreas: ["Fleet & dispatch", "Warehouse throughput", "Multi-branch RBAC"],
    departmentHints: [
      "Operations and logistics usually own dispatch and SLA governance.",
      "Fleet and warehouse are separate cost centers — split departments when headcount exceeds ~40.",
    ],
    workflowExamples: [
      "Delivery assignment and route approval",
      "Warehouse dispatch and inventory transfer",
      "Customer escalation from CS to operations",
    ],
    securityHints: [
      "Mobile workforce and driver sessions need elevated monitoring — not certification.",
      "Privileged finance and tenant-admin roles should map to CyberCrow baselines.",
    ],
    sareaHints: [
      "Dispatcher and driver dashboards are typically mobile-first.",
      "Executive view focuses on network KPIs, not individual shipments.",
    ],
    cybercrowHints: [
      "Suggest branch-boundary and driver-trust baselines when logistics module is selected.",
    ],
    blueprintNotes: [
      "Blueprint will carry branch types (hub, depot, warehouse) and approval chains for dispatch.",
      "Review org intelligence accept before completing discovery — seeds CEM at go-live.",
    ],
  },
  construction: {
    sectorKey: "construction",
    headline: "Construction & projects",
    whyItMatters:
      "Project sites, HSE, and contractor access need different structure than logistics — avoid fleet/dispatch defaults.",
    focusAreas: ["Project delivery", "HSE inspections", "Procurement PO chains"],
    departmentHints: [
      "Project management and site management are core — engineering and procurement follow.",
      "HSE should be explicit before blueprint if safety workflows are in scope.",
    ],
    workflowExamples: [
      "RFI / change request with PM sign-off",
      "Site HSE inspection and equipment mobilization",
      "Purchase order approval across procurement and finance",
    ],
    securityHints: [
      "Contractor and site access boundaries are advisory controls — map to CyberCrow packages on request.",
    ],
    sareaHints: [
      "Site manager experiences are often mobile; PM dashboards are control-oriented.",
    ],
    cybercrowHints: [
      "Vendor access and site-access suggestions apply when multi-site operating model is selected.",
    ],
    blueprintNotes: [
      "No logistics module leakage — confirm modules match construction scope.",
      "Trimmed approval chains on startup plan remain editable; review before accept.",
    ],
  },
  aviation: {
    sectorKey: "aviation",
    headline: "Aviation operations",
    whyItMatters:
      "OCC, ground handling, MRO, and safety reporting need shift-aware structure and strong audit trails.",
    focusAreas: ["Operations control", "MRO work orders", "Safety & compliance"],
    departmentHints: [
      "Operations control and ground ops are distinct — do not merge into a single generic ops dept.",
      "Maintenance (MRO) workflows tie to airworthiness evidence in CyberCrow advisory baselines.",
    ],
    workflowExamples: [
      "Disruption management between OCC and stations",
      "Maintenance work order with MRO release chain",
      "Safety report and shift handover on ramp",
    ],
    securityHints: [
      "OCC and maintenance evidence chains are suggested monitoring patterns — not regulatory sign-off.",
    ],
    sareaHints: [
      "OCC and ramp supervisor boards are operational; safety officer views emphasize open findings.",
    ],
    cybercrowHints: [
      "OCC audit trail and maintenance evidence suggestions align with Najm-style staging references.",
    ],
    blueprintNotes: [
      "Aviation template applies when industry or modules imply airline/MRO context.",
      "Confirm station/MRO branch types before blueprint handoff.",
    ],
  },
  healthcare: {
    sectorKey: "healthcare",
    headline: "Healthcare network",
    whyItMatters:
      "Clinical and administrative separation, compliance, and PHI-sensitive roles shape RBAC and CyberCrow posture.",
    focusAreas: ["Clinical ops", "Nursing flow", "Compliance & privacy"],
    departmentHints: [
      "Keep clinical and nursing separate for staffing workflows.",
      "Compliance officer role should exist before security package mapping.",
    ],
    workflowExamples: [
      "Patient admission and clinical incident escalation",
    ],
    securityHints: [
      "PHI access monitoring is an advisory baseline — align with selected security package.",
    ],
    sareaHints: [
      "Executive clinical overview vs nursing operations dashboard — different persona density.",
    ],
    cybercrowHints: [
      "Clinical session trust suggestions apply to workstation-heavy sites.",
    ],
    blueprintNotes: [
      "Blueprint readiness needs explicit compliance dept or role before complete.",
    ],
  },
  retail: {
    sectorKey: "retail",
    headline: "Retail & commerce",
    whyItMatters:
      "Store operations, merchandising, and inventory transfers drive a lighter HQ + store branch model.",
    focusAreas: ["Store ops", "Merchandising", "Inventory & DC"],
    departmentHints: [
      "Store operations and merchandising should not be collapsed — pricing approvals cross both.",
    ],
    workflowExamples: [
      "Stock transfer between DC and stores",
      "Price change approval through merchandising and finance",
    ],
    securityHints: [
      "POS and store RBAC boundaries are suggested when retail modules are confirmed.",
    ],
    sareaHints: [
      "Store manager operational dashboard vs associate mobile UI.",
    ],
    cybercrowHints: [
      "Fraud-focused POS audit suggestion when finance module is active.",
    ],
    blueprintNotes: [
      "Default sector when industry is ambiguous — verify industry on request if sector confidence is low.",
    ],
  },
};

export function resolveSectorGuidance(input: {
  industry?: string | null;
  moduleKeys?: string[];
  sectorTemplateKey?: string | null;
}): SectorGuidance {
  const key =
    (input.sectorTemplateKey as SectorTemplateKey | undefined) ??
    resolveSectorTemplateKey({
      industry: input.industry ?? "",
      moduleKeys: input.moduleKeys ?? [],
    });
  return GUIDANCE[key];
}

export function sectorConfidenceLabel(input: {
  industry?: string | null;
  sectorTemplateKey?: string | null;
}): { level: "high" | "medium" | "low"; detail: string } {
  if (input.sectorTemplateKey) {
    return {
      level: "high",
      detail: `Explicit sector template: ${input.sectorTemplateKey}`,
    };
  }
  const industry = (input.industry ?? "").trim().toLowerCase();
  if (!industry) {
    return {
      level: "low",
      detail: "No industry on request — using default retail advisory template",
    };
  }
  const mapped = resolveSectorTemplateKey({ industry, moduleKeys: [] });
  if (mapped === "retail" && !["retail", "commerce", "ecommerce"].some((k) => industry.includes(k))) {
    return {
      level: "medium",
      detail: `Industry "${input.industry}" mapped to ${mapped} — confirm in org intelligence`,
    };
  }
  return {
    level: "high",
    detail: `Industry "${input.industry}" maps to ${mapped}`,
  };
}
