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
    headline: "Construction operating model (validated)",
    whyItMatters:
      "Multi-project construction needs site operations, procurement and supplier coordination, materials receiving readiness, workforce coordination, HSE and quality evidence, document approvals, and cost/variation controls — with advisory CyberCrow posture (not compliance certification).",
    focusAreas: [
      "Number of active projects and sites",
      "Project types (civil, building, fit-out, infrastructure)",
      "Procurement and subcontractor process",
      "Material request, receiving, and inventory accuracy",
      "Site task coordination and daily reporting",
      "HSE and quality inspection process",
      "Document submission and approval",
      "Variation / change handling",
      "Workforce and HR coordination",
      "Cost control and monthly project reporting",
      "CyberCrow / security concerns on site and vendor access",
    ],
    departmentHints: [
      "Separate Project Management, Site Operations, Engineering / Technical Office, and Document Control — do not collapse into one generic projects department.",
      "Materials / Inventory Control is distinct from Procurement — capture receiving and stock accuracy when material workflows are in scope.",
      "HSE and Quality Control should exist before incident or inspection workflows are marked in scope.",
      "Finance / Cost Control and Procurement serve different approval paths; keep both when headcount supports it.",
      "Capture project count, site count, and whether subcontractors are managed in-system (advisory sizing).",
    ],
    workflowExamples: [
      "Project kickoff and site mobilization",
      "Material request, purchase request, and supplier approval",
      "Material receiving with receiving record",
      "Site task assignment and daily site report",
      "HSE incident report and quality inspection",
      "Variation / change request and document submission / approval",
      "Cost review, workforce request, and monthly project performance review",
      "Access / role review",
    ],
    securityHints: [
      "Site and subcontractor access need time-bound roles — advisory posture only, not SIEM or certification claims.",
      "Privileged purchase, supplier approval, material adjustment, and variation approvals are common audit risks — map to CyberCrow baselines.",
      "Document approval gaps and HSE underreporting are readiness topics — Crow documents evidence trails, not regulatory sign-off.",
      "MFA for PM, procurement, finance, and tenant admin is a common operator policy (advisory).",
    ],
    sareaHints: [
      "Executive / owner: portfolio health, HSE open items, cost posture — strategic density.",
      "Project manager: workflows, tasks, variations, cost readiness — control board.",
      "Site manager: site actions, daily reporting, crews — mobile-first; RBAC controls access.",
      "Procurement specialist: purchase and supplier workflows — operational dashboard.",
      "Materials controller: requests and receiving — distinct from procurement nav.",
      "HSE / quality reviewer: incidents, inspections, evidence — not a generic analyst UI.",
      "Analyst: reporting and readiness gaps; tenant admin: users, roles, mappings.",
      "Rimal staging tenant (slug rimal-construction) uses this model — not a public customer claim.",
    ],
    cybercrowHints: [
      "Suggest unauthorized purchase, supplier approval abuse, material receiving fraud, adjustment abuse, document approval gap, HSE underreport, quality gap, site access anomaly, role change abuse, and variation abuse baselines when construction modules are confirmed.",
      "Evidence readiness examples: material request approval trail, purchase request review, supplier approval evidence, material receiving record, HSE incident report, quality inspection record, document approval trail, variation approval, access review, monthly project report.",
      "Do not claim live SIEM, unattended automated approvals, or regulatory certification — advisory readiness language only.",
    ],
    blueprintNotes: [
      "Recommended live modules: procurement, inventory, finance, hr, crm, sales (commercial intake), approvals (tasks), bi (reports).",
      "Document management, BIM, equipment tracking, subcontractor portal, field mobile app, and advanced scheduling are future readiness — blueprint notes only.",
      "Blueprint should carry construction departments, roles, workflows, CyberCrow baselines, and SAREA profiles from org intelligence accept.",
      "Rimal tenant aligns modules in staging without logistics stack — idempotent seed; demo/staging validated only.",
      "When industry is ambiguous, confirm sector on the request — avoid logistics dispatch or retail store defaults leaking into construction blueprints.",
    ],
  },
  aviation: {
    sectorKey: "aviation",
    headline: "Aviation operating model (validated)",
    whyItMatters:
      "Aviation service and station operations need clear departments for ground work, passenger service, maintenance coordination, safety, and finance — with audit trails suitable for operator review and blueprint readiness.",
    focusAreas: [
      "Aviation service type and number of stations",
      "Passenger / customer service and escalation process",
      "Ground operations and task coordination",
      "Maintenance request coordination",
      "Safety incident reporting",
      "Supplier / procurement process",
      "Workforce and shift coordination",
      "Approval chains and reporting needs",
      "CyberCrow / security concerns at stations and service centers",
    ],
    departmentHints: [
      "Separate Aviation Operations, Ground Operations, and Passenger / Customer Service — do not collapse into one generic ops department.",
      "Maintenance Coordination is distinct from Procurement — capture request/review paths separately when both are in scope.",
      "Safety / Compliance and Quality / Service Assurance should exist before incident or review workflows are marked in scope.",
      "Finance / Billing Coordination and Procurement serve different approval paths; keep both when headcount supports it.",
      "Capture station count, service center count, and whether maintenance is coordinated in-system (advisory sizing).",
    ],
    workflowExamples: [
      "Service request intake and passenger / customer issue escalation",
      "Ground operation task assignment",
      "Maintenance request review and supplier request",
      "Safety incident report and quality / service review",
      "Workforce / shift request, access / role review, finance / billing review",
      "Monthly aviation operations report and CyberCrow incident review",
    ],
    securityHints: [
      "Station and service-center access need time-bound roles — advisory posture only, not SIEM or certification claims.",
      "Privileged admin, service escalation, and supplier approval paths are common audit risks — map to CyberCrow baselines.",
      "Safety underreporting and maintenance request gaps are readiness topics — Crow documents evidence trails, not regulatory sign-off.",
      "MFA for operations managers, procurement, finance, and tenant admin is a common operator policy (advisory).",
    ],
    sareaHints: [
      "Executive / owner: operations health, safety open items, service risk posture — strategic density.",
      "Aviation operations manager: workflows, service tasks, exceptions — control board.",
      "Ground operations coordinator: assigned operational tasks and shift handover.",
      "Customer service supervisor: escalations and service requests — operational dashboard.",
      "Passenger service agent: intake and follow-up — mobile-first; RBAC controls access.",
      "Maintenance coordinator: maintenance requests and review items.",
      "Safety / quality reviewer: incidents, inspections, evidence — not a generic analyst UI.",
      "Analyst: reporting and readiness gaps; tenant admin: users, roles, mappings.",
      "Najm-style organic intake on staging (reference CROW-2026-ARAX9K pattern) validates pipeline — not a public customer claim and no tenant unless provisioned.",
    ],
    cybercrowHints: [
      "Suggest unauthorized access change, service request manipulation, safety underreport, maintenance gap, passenger data exposure, supplier approval abuse, workforce misuse, escalation audit gap, admin misuse, and station access anomaly baselines when aviation modules are confirmed.",
      "Evidence readiness examples: service request trail, customer escalation record, ground operation task trail, maintenance request record, safety incident report, quality/service review record, supplier approval trail, access review, monthly operations report.",
      "Do not claim live SIEM, unattended automated approvals, regulatory sign-off as certification, or guaranteed compliance — advisory readiness language only.",
    ],
    blueprintNotes: [
      "Recommended live modules: crm, sales (commercial intake), procurement, finance, hr, approvals (tasks), bi (reports).",
      "Flight operations, airport systems, maintenance system, IoT telemetry, passenger portal, live compliance integrations, and advanced BI are future readiness — blueprint notes only.",
      "Blueprint should carry aviation departments, roles, workflows, CyberCrow baselines, and SAREA profiles from org intelligence accept.",
      "Organic Najm-style requests use industry aviation through discovery → blueprint — no automatic tenant provisioning.",
      "When industry is ambiguous, confirm sector on the request — avoid logistics hub, retail store, or construction site defaults leaking into aviation blueprints.",
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
