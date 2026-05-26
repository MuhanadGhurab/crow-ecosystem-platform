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
    headline: "Logistics operating model (lighthouse)",
    whyItMatters:
      "Multi-branch logistics needs dispatch, fleet/field workforce, warehouse/inventory movement, supplier coordination, and customer escalation paths — with branch-scoped RBAC and advisory CyberCrow evidence readiness (not compliance certification).",
    focusAreas: [
      "Branches / depots / warehouses",
      "Fleet size and driver coordination",
      "Delivery volume and shipment lifecycle",
      "Dispatch and proof-of-delivery readiness",
      "Warehouse receiving and inventory movement",
      "Supplier and customer escalation",
      "Reporting and exception handling",
    ],
    departmentHints: [
      "Separate Logistics Operations, Dispatch, Fleet, Warehouse, and Inventory — do not collapse into one generic ops department.",
      "Customer Accounts / CRM and Finance / Billing serve different escalation paths; keep both when headcount supports it.",
      "Compliance / Safety should exist before delivery exception or incident workflows are marked in scope.",
      "Capture fleet or driver count and delivery volume bands — drives branch and role sizing (advisory).",
      "Procurement / Supplier Management should be explicit when supplier purchase requests are in scope.",
    ],
    workflowExamples: [
      "Delivery request intake and dispatch assignment",
      "Driver task update and shipment status update",
      "Warehouse receiving and inventory movement with stock adjustment review",
      "Supplier purchase request and customer issue escalation",
      "Delivery exception / incident report and proof-of-delivery review",
      "Monthly logistics performance review and access / role change review",
    ],
    securityHints: [
      "Mobile workforce and driver sessions need elevated monitoring — advisory posture only, not SIEM or certification claims.",
      "Capture whether telematics or carrier APIs exist — Crow documents readiness boundaries; no live external API integration in this phase.",
      "Privileged dispatch changes, inventory adjustments, and role changes are common audit risks — map to CyberCrow baselines.",
      "Customer PII in CRM: segment dispatch, warehouse, finance, and admin roles; MFA for coordinators is a common operator policy.",
    ],
    sareaHints: [
      "Executive / owner: network KPIs, SLA health, exceptions, risk posture — strategic density.",
      "Logistics Operations Manager: multi-branch coordination, workflows, tasks — control board.",
      "Dispatch Coordinator: live routes, assignments, delivery exceptions — operational dashboard.",
      "Driver / field operator: assigned tasks and status updates — mobile-first; SAREA shapes experience, RBAC controls access.",
      "Warehouse Supervisor and Inventory Controller need distinct nav from Analyst — avoid giving analysts a frontline mobile UI.",
      "MEEM lighthouse uses this model in staging — not a public customer claim.",
    ],
    cybercrowHints: [
      "Suggest dispatch-change, proof-of-delivery dispute, delivery-exception, inventory-movement, warehouse-access, supplier-fraud, and driver-misuse baselines when logistics modules are confirmed.",
      "Evidence readiness examples: proof-of-delivery record, dispatch assignment trail, driver task update trail, delivery exception review, inventory movement audit, supplier approval trail, customer escalation record, role/access review.",
      "Do not claim live SIEM, autonomous AI dispatch, or regulatory certification — advisory readiness language only.",
    ],
    blueprintNotes: [
      "Recommended live modules: logistics, warehouse, inventory, procurement, crm, finance, hr, sales, approvals (tasks), bi (reports).",
      "Telematics, carrier API, route optimization SaaS, live POD capture, and autonomous dispatch are future readiness — document in blueprint notes, not as live modules.",
      "Blueprint should carry logistics departments, roles, workflows, CyberCrow baselines, and SAREA profiles from org intelligence accept.",
      "MEEM lighthouse tenant (slug meem-global) aligns modules in staging — idempotent seed; not a production customer claim.",
      "When industry is ambiguous, confirm sector on the request — avoid retail or construction defaults leaking into logistics blueprints.",
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
