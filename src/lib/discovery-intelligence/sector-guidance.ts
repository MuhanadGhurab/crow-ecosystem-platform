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
    headline: "Retail operating model",
    whyItMatters:
      "Multi-store retail needs HQ + store + DC structure, catalog/inventory discipline, and clear POS/payment boundaries — without treating retail as a slim variant of logistics.",
    focusAreas: [
      "Store network & branch count",
      "Catalog / inventory / replenishment",
      "POS awareness (operator-managed, no live payments)",
      "Returns, promotions, and cash reconciliation",
    ],
    departmentHints: [
      "Separate Retail Operations, Store Management, Merchandising, and Inventory — do not merge into one generic ops dept.",
      "Customer Service and Sales & CRM serve different escalation paths; keep both when headcount supports it.",
      "Finance & Reconciliation should exist before cash reconciliation or refund workflows are marked in scope.",
      "Marketing / Promotions / Loyalty can be advisory-only until loyalty modules are explicitly selected.",
    ],
    workflowExamples: [
      "Product catalog update and stock receiving at DC",
      "Inventory count with stock adjustment approval chain",
      "Return / exchange review and discount / promotion approval",
      "Cash reconciliation and monthly retail performance review",
      "Store incident report for security evidence readiness",
    ],
    securityHints: [
      "Capture whether a POS or payment system exists — Crow does not process payments; boundary is advisory only.",
      "Refund abuse, discount overrides, and inventory adjustments are common retail audit risks — map to CyberCrow baselines, not compliance claims.",
      "Customer data in CRM: segment store staff from finance and admin roles; MFA for managers is a common operator policy.",
      "Product identifiers (barcode / GTIN) and store location IDs are future integration readiness — not active GS1 integration.",
    ],
    sareaHints: [
      "Executive / owner: performance, revenue, store health, risk posture — strategic density.",
      "Retail Operations Manager: workflows, branches, tasks, exceptions — control board.",
      "Store Manager: daily tasks, stock issues, staff — operational dashboard.",
      "Frontline associate: assigned tasks and escalations — mobile-first; SAREA shapes experience, RBAC controls access.",
      "Inventory Controller and Analyst personas need different nav — do not give analysts frontline mobile UI.",
    ],
    cybercrowHints: [
      "Suggest POS/payment boundary, refund/return, discount override, and inventory adjustment baselines when retail modules are confirmed.",
      "Evidence readiness examples: refund approval, discount approval, stock adjustment audit, cash reconciliation review, supplier approval trail.",
      "Do not claim PCI DSS compliance, live payment monitoring, or active SIEM — advisory readiness language only.",
    ],
    blueprintNotes: [
      "Recommended live modules: sales, crm, inventory, warehouse, procurement, finance, hr, approvals (tasks), bi (reports).",
      "Loyalty, e-commerce, POS integration, and payment reconciliation are future readiness — document in blueprint notes, not as live modules.",
      "When industry is ambiguous, resolver may default to retail — confirm store count, online vs physical mix, and sector on the request.",
      "Blueprint should carry retail departments, roles, workflows, CyberCrow baselines, and SAREA profiles from org intelligence accept.",
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
