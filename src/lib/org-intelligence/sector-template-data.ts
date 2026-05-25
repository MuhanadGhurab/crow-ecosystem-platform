import type { OrgIntelligenceModel, SectorTemplateKey } from "@/lib/org-intelligence/types";

const LOGISTICS: OrgIntelligenceModel = {
  sectorTemplateKey: "logistics",
  sectorName: "Logistics Operations",
  industry: "logistics",
  maturityLevel: "growth",
  branchTypes: [
    { key: "hq", name: "Headquarters", description: "Executive and shared services" },
    { key: "hub", name: "Distribution hub", description: "Regional consolidation" },
    { key: "depot", name: "Fleet depot", description: "Vehicle and driver operations" },
    { key: "warehouse", name: "Warehouse", description: "Inventory and dispatch" },
  ],
  departments: [
    { key: "exec", name: "Executive Office", recommendedPriority: 1, recommendedHeadcount: { min: 2, max: 8 } },
    { key: "ops", name: "Operations", recommendedPriority: 2, recommendedHeadcount: { min: 5, max: 40 } },
    { key: "logistics", name: "Logistics", recommendedPriority: 2, recommendedHeadcount: { min: 8, max: 60 } },
    { key: "fleet", name: "Fleet Management", recommendedPriority: 3, recommendedHeadcount: { min: 4, max: 30 } },
    { key: "warehouse", name: "Warehouse", recommendedPriority: 3, recommendedHeadcount: { min: 10, max: 80 } },
    { key: "inventory", name: "Inventory", recommendedPriority: 3, recommendedHeadcount: { min: 4, max: 25 } },
    { key: "sales", name: "Sales", recommendedPriority: 4, recommendedHeadcount: { min: 3, max: 20 } },
    { key: "finance", name: "Finance", recommendedPriority: 4, recommendedHeadcount: { min: 3, max: 15 } },
    { key: "hr", name: "HR", recommendedPriority: 5, recommendedHeadcount: { min: 2, max: 12 } },
    { key: "cs", name: "Customer Service", recommendedPriority: 4, recommendedHeadcount: { min: 4, max: 25 } },
    { key: "security", name: "CyberCrow Security", recommendedPriority: 2, recommendedHeadcount: { min: 1, max: 6 } },
  ],
  positions: [
    { key: "ceo", title: "CEO", departmentKey: "exec", level: "executive", responsibilities: ["Strategy", "Board reporting"], sareaPersonaKey: "executive", cybercrowSensitive: true },
    { key: "coo", title: "COO", departmentKey: "ops", level: "executive", responsibilities: ["Operations oversight", "SLA governance"], sareaPersonaKey: "executive", cybercrowSensitive: true },
    { key: "ops-mgr", title: "Operations Manager", departmentKey: "ops", level: "manager", responsibilities: ["Daily ops", "Escalations"], sareaPersonaKey: "manager", riskSensitive: true },
    { key: "logistics-mgr", title: "Logistics Manager", departmentKey: "logistics", level: "manager", responsibilities: ["Network planning", "Carrier relations"], sareaPersonaKey: "manager" },
    { key: "fleet-sup", title: "Fleet Supervisor", departmentKey: "fleet", level: "manager", responsibilities: ["Fleet readiness", "Driver scheduling"], sareaPersonaKey: "manager" },
    { key: "dispatcher", title: "Dispatcher", departmentKey: "logistics", level: "specialist", responsibilities: ["Route assignment", "Live tracking"], sareaPersonaKey: "specialist", riskSensitive: true },
    { key: "driver", title: "Driver", departmentKey: "fleet", level: "frontline", responsibilities: ["Deliveries", "Vehicle checks"], sareaPersonaKey: "frontline", cybercrowSensitive: true, recommendedCountMin: 5, recommendedCountMax: 120 },
    { key: "wh-mgr", title: "Warehouse Manager", departmentKey: "warehouse", level: "manager", responsibilities: ["Inbound/outbound", "Labor planning"], sareaPersonaKey: "manager" },
    { key: "inv-spec", title: "Inventory Specialist", departmentKey: "inventory", level: "specialist", responsibilities: ["Stock accuracy", "Cycle counts"], sareaPersonaKey: "specialist" },
    { key: "sales-mgr", title: "Sales Manager", departmentKey: "sales", level: "manager", responsibilities: ["Pipeline", "Key accounts"], sareaPersonaKey: "manager" },
    { key: "finance-mgr", title: "Finance Manager", departmentKey: "finance", level: "manager", responsibilities: ["AR/AP", "Approvals"], sareaPersonaKey: "manager", cybercrowSensitive: true },
    { key: "hr-spec", title: "HR Specialist", departmentKey: "hr", level: "specialist", responsibilities: ["Onboarding", "Policy"], sareaPersonaKey: "specialist" },
    { key: "cc-analyst", title: "CyberCrow Analyst", departmentKey: "security", level: "specialist", responsibilities: ["Audit review", "Incident triage"], sareaPersonaKey: "security", cybercrowSensitive: true },
    { key: "tenant-admin", title: "Tenant Admin", departmentKey: "exec", level: "manager", responsibilities: ["Tenant config", "User access"], sareaPersonaKey: "manager", cybercrowSensitive: true },
  ],
  workflows: [
    { key: "delivery-assign", name: "Delivery assignment", departmentScope: "logistics", complexityLevel: "standard" },
    { key: "route-approval", name: "Route approval", departmentScope: "fleet", complexityLevel: "standard" },
    { key: "shipment-track", name: "Shipment tracking", departmentScope: "logistics", complexityLevel: "lite" },
    { key: "incident-report", name: "Incident reporting", departmentScope: "security", complexityLevel: "standard" },
    { key: "vehicle-inspect", name: "Vehicle inspection", departmentScope: "fleet", complexityLevel: "lite" },
    { key: "inv-transfer", name: "Inventory transfer", departmentScope: "inventory", complexityLevel: "standard" },
    { key: "wh-dispatch", name: "Warehouse dispatch", departmentScope: "warehouse", complexityLevel: "standard" },
    { key: "cust-escalation", name: "Customer escalation", departmentScope: "cs", complexityLevel: "standard" },
    { key: "employee-onboard", name: "Employee onboarding", departmentScope: "hr", complexityLevel: "standard" },
    { key: "purchase-approval", name: "Purchase approval", departmentScope: "finance", complexityLevel: "advanced" },
  ],
  approvalChains: [
    { key: "driver-chain", name: "Driver escalation", workflowKey: "delivery-assign", steps: ["Driver", "Dispatcher", "Fleet Supervisor", "Operations Manager"] },
    { key: "warehouse-chain", name: "Warehouse dispatch", workflowKey: "wh-dispatch", steps: ["Warehouse Specialist", "Warehouse Manager", "Operations Manager"] },
    { key: "hr-chain", name: "HR approvals", workflowKey: "employee-onboard", steps: ["HR Specialist", "HR Manager", "Executive"] },
    { key: "finance-chain", name: "Finance approvals", workflowKey: "purchase-approval", steps: ["Finance Specialist", "Finance Manager", "CFO / Executive"] },
  ],
  cybercrowBaselines: [
    { key: "mobile-workforce", name: "Mobile workforce monitoring", controls: ["device_trust", "session_geo"], riskFocus: "field_operations", monitoringLevel: "elevated" },
    { key: "driver-trust", name: "Driver session trust", controls: ["mobile_mfa", "route_scope"], riskFocus: "identity", monitoringLevel: "elevated" },
    { key: "branch-boundary", name: "Branch-level access boundaries", controls: ["tenant_rbac", "branch_scope"], riskFocus: "access", monitoringLevel: "standard" },
    { key: "logistics-audit", name: "Logistics workflow audit", controls: ["audit_chain", "shipment_events"], riskFocus: "compliance", monitoringLevel: "standard" },
    { key: "privileged-monitor", name: "Privileged role monitoring", controls: ["admin_session", "approval_log"], riskFocus: "privilege", monitoringLevel: "critical" },
  ],
  sareaProfiles: [
    { key: "exec-dash", name: "Executive strategic dashboard", positionKey: "ceo", experienceProfile: "Executive command center", dashboardType: "strategic", complexityLevel: "executive", personaKey: "executive" },
    { key: "ops-dash", name: "Operations manager control dashboard", positionKey: "ops-mgr", experienceProfile: "Operational KPIs and dispatch", dashboardType: "control", complexityLevel: "manager", personaKey: "manager" },
    { key: "dispatcher-dash", name: "Dispatcher operational dashboard", positionKey: "dispatcher", experienceProfile: "Live routes and assignments", dashboardType: "operational", complexityLevel: "specialist", personaKey: "specialist" },
    { key: "driver-dash", name: "Driver mobile-first dashboard", positionKey: "driver", experienceProfile: "Tasks, routes, inspections", dashboardType: "mobile", complexityLevel: "frontline", personaKey: "frontline" },
    { key: "warehouse-dash", name: "Warehouse specialist dashboard", positionKey: "wh-mgr", experienceProfile: "Inbound/outbound queues", dashboardType: "operational", complexityLevel: "specialist", personaKey: "specialist" },
    { key: "hr-dash", name: "HR specialist dashboard", positionKey: "hr-spec", experienceProfile: "People ops and onboarding", dashboardType: "operational", complexityLevel: "specialist", personaKey: "specialist" },
    { key: "cc-console", name: "CyberCrow security console", positionKey: "cc-analyst", experienceProfile: "Audit, incidents, posture", dashboardType: "security", complexityLevel: "security", personaKey: "security" },
  ],
};

const CONSTRUCTION: OrgIntelligenceModel = {
  sectorTemplateKey: "construction",
  sectorName: "Construction & Projects",
  industry: "construction",
  maturityLevel: "growth",
  branchTypes: [
    { key: "hq", name: "Head office" },
    { key: "site", name: "Project site" },
    { key: "yard", name: "Equipment yard" },
  ],
  departments: [
    { key: "exec", name: "Executive Office", recommendedHeadcount: { min: 2, max: 6 } },
    { key: "projects", name: "Project Management", recommendedHeadcount: { min: 5, max: 40 } },
    { key: "engineering", name: "Engineering", recommendedHeadcount: { min: 4, max: 30 } },
    { key: "procurement", name: "Procurement", recommendedHeadcount: { min: 3, max: 15 } },
    { key: "safety", name: "Health & Safety", recommendedHeadcount: { min: 2, max: 12 } },
    { key: "finance", name: "Finance", recommendedHeadcount: { min: 3, max: 12 } },
    { key: "hr", name: "HR", recommendedHeadcount: { min: 2, max: 10 } },
    { key: "security", name: "CyberCrow Security", recommendedHeadcount: { min: 1, max: 4 } },
  ],
  positions: [
    { key: "pm", title: "Project Manager", departmentKey: "projects", level: "manager", responsibilities: ["Schedule", "Budget", "Stakeholders"], sareaPersonaKey: "manager" },
    { key: "site-mgr", title: "Site Manager", departmentKey: "projects", level: "manager", responsibilities: ["Site ops", "Contractors"], sareaPersonaKey: "manager", riskSensitive: true },
    { key: "engineer", title: "Site Engineer", departmentKey: "engineering", level: "specialist", responsibilities: ["Drawings", "QA"], sareaPersonaKey: "specialist" },
    { key: "safety-officer", title: "Safety Officer", departmentKey: "safety", level: "specialist", responsibilities: ["Inspections", "Incidents"], sareaPersonaKey: "specialist", cybercrowSensitive: true },
    { key: "proc-spec", title: "Procurement Specialist", departmentKey: "procurement", level: "specialist", responsibilities: ["PO workflow", "Vendors"], sareaPersonaKey: "specialist" },
  ],
  workflows: [
    { key: "rfi", name: "RFI / change request", departmentScope: "projects", complexityLevel: "standard" },
    { key: "site-inspection", name: "Site inspection", departmentScope: "safety", complexityLevel: "standard" },
    { key: "po-approval", name: "Purchase order approval", departmentScope: "procurement", complexityLevel: "advanced" },
  ],
  approvalChains: [
    { key: "change-chain", name: "Change approval", workflowKey: "rfi", steps: ["Site Engineer", "Project Manager", "Executive"] },
    { key: "po-chain", name: "PO approval", workflowKey: "po-approval", steps: ["Procurement Specialist", "Project Manager", "Finance Manager"] },
  ],
  cybercrowBaselines: [
    { key: "site-access", name: "Site access control", controls: ["site_rbac", "contractor_access"], riskFocus: "physical_digital", monitoringLevel: "elevated" },
    { key: "vendor-trust", name: "Vendor access controls", controls: ["vendor_session", "approval_log"], riskFocus: "supply_chain", monitoringLevel: "standard" },
  ],
  sareaProfiles: [
    { key: "pm-dash", name: "Project manager dashboard", positionKey: "pm", experienceProfile: "Portfolio and milestones", dashboardType: "control", complexityLevel: "manager", personaKey: "manager" },
    { key: "site-dash", name: "Site manager field dashboard", positionKey: "site-mgr", experienceProfile: "Site KPIs and crews", dashboardType: "mobile", complexityLevel: "manager", personaKey: "manager" },
  ],
};

const AVIATION: OrgIntelligenceModel = {
  sectorTemplateKey: "aviation",
  sectorName: "Aviation Operations",
  industry: "aviation",
  maturityLevel: "enterprise",
  branchTypes: [
    { key: "hq", name: "Operations center" },
    { key: "station", name: "Station / airport" },
    { key: "mro", name: "MRO facility" },
  ],
  departments: [
    { key: "ops", name: "Flight Operations", recommendedHeadcount: { min: 5, max: 50 } },
    { key: "maintenance", name: "Maintenance (MRO)", recommendedHeadcount: { min: 8, max: 60 } },
    { key: "ground", name: "Ground Services", recommendedHeadcount: { min: 10, max: 80 } },
    { key: "safety", name: "Safety & Compliance", recommendedHeadcount: { min: 3, max: 15 } },
    { key: "finance", name: "Finance", recommendedHeadcount: { min: 3, max: 12 } },
    { key: "security", name: "CyberCrow Security", recommendedHeadcount: { min: 2, max: 8 } },
  ],
  positions: [
    { key: "occ-mgr", title: "Operations Control Manager", departmentKey: "ops", level: "manager", responsibilities: ["Dispatch", "Irregular ops"], sareaPersonaKey: "manager", cybercrowSensitive: true },
    { key: "mro-lead", title: "MRO Lead", departmentKey: "maintenance", level: "manager", responsibilities: ["Work orders", "Airworthiness"], sareaPersonaKey: "manager" },
    { key: "ramp-sup", title: "Ramp Supervisor", departmentKey: "ground", level: "specialist", responsibilities: ["Turnaround", "Safety brief"], sareaPersonaKey: "specialist" },
  ],
  workflows: [
    { key: "disruption", name: "Disruption management", departmentScope: "ops", complexityLevel: "advanced" },
    { key: "work-order", name: "Maintenance work order", departmentScope: "maintenance", complexityLevel: "standard" },
    { key: "safety-report", name: "Safety report", departmentScope: "safety", complexityLevel: "standard" },
  ],
  approvalChains: [
    { key: "mro-chain", name: "MRO release", workflowKey: "work-order", steps: ["Technician", "MRO Lead", "Safety Officer"] },
  ],
  cybercrowBaselines: [
    { key: "occ-audit", name: "Operations audit trail", controls: ["occ_events", "privileged_access"], riskFocus: "safety", monitoringLevel: "critical" },
    { key: "maintenance-evidence", name: "Maintenance evidence chain", controls: ["work_order_signoff"], riskFocus: "compliance", monitoringLevel: "elevated" },
  ],
  sareaProfiles: [
    { key: "occ-dash", name: "Operations control dashboard", positionKey: "occ-mgr", experienceProfile: "Fleet status and disruptions", dashboardType: "control", complexityLevel: "manager", personaKey: "manager" },
  ],
};

const HEALTHCARE: OrgIntelligenceModel = {
  sectorTemplateKey: "healthcare",
  sectorName: "Healthcare Network",
  industry: "healthcare",
  maturityLevel: "enterprise",
  branchTypes: [
    { key: "hq", name: "Administrative HQ" },
    { key: "clinic", name: "Clinic / facility" },
    { key: "lab", name: "Diagnostic lab" },
  ],
  departments: [
    { key: "clinical", name: "Clinical Operations", recommendedHeadcount: { min: 20, max: 200 } },
    { key: "nursing", name: "Nursing", recommendedHeadcount: { min: 15, max: 150 } },
    { key: "admin", name: "Administration", recommendedHeadcount: { min: 5, max: 30 } },
    { key: "finance", name: "Finance & Billing", recommendedHeadcount: { min: 4, max: 25 } },
    { key: "compliance", name: "Compliance", recommendedHeadcount: { min: 2, max: 12 } },
    { key: "security", name: "CyberCrow Security", recommendedHeadcount: { min: 2, max: 8 } },
  ],
  positions: [
    { key: "cmo", title: "Chief Medical Officer", departmentKey: "clinical", level: "executive", responsibilities: ["Clinical governance"], sareaPersonaKey: "executive", cybercrowSensitive: true },
    { key: "nurse-mgr", title: "Nursing Manager", departmentKey: "nursing", level: "manager", responsibilities: ["Staffing", "Patient flow"], sareaPersonaKey: "manager" },
    { key: "compliance-off", title: "Compliance Officer", departmentKey: "compliance", level: "specialist", responsibilities: ["HIPAA/NCA alignment"], sareaPersonaKey: "specialist", cybercrowSensitive: true },
  ],
  workflows: [
    { key: "patient-admit", name: "Patient admission", departmentScope: "clinical", complexityLevel: "standard" },
    { key: "incident-clinical", name: "Clinical incident", departmentScope: "compliance", complexityLevel: "advanced" },
  ],
  approvalChains: [
    { key: "clinical-chain", name: "Clinical escalation", workflowKey: "incident-clinical", steps: ["Frontline clinician", "Nursing Manager", "Compliance Officer"] },
  ],
  cybercrowBaselines: [
    { key: "phi-access", name: "PHI access monitoring", controls: ["phi_audit", "break_glass"], riskFocus: "privacy", monitoringLevel: "critical" },
    { key: "clinical-session", name: "Clinical session trust", controls: ["workstation_trust"], riskFocus: "identity", monitoringLevel: "elevated" },
  ],
  sareaProfiles: [
    { key: "exec-health", name: "Executive clinical overview", positionKey: "cmo", experienceProfile: "Network KPIs and compliance", dashboardType: "strategic", complexityLevel: "executive", personaKey: "executive" },
    { key: "nurse-ops", name: "Nursing operations dashboard", positionKey: "nurse-mgr", experienceProfile: "Patient flow and staffing", dashboardType: "operational", complexityLevel: "manager", personaKey: "manager" },
  ],
};

const RETAIL: OrgIntelligenceModel = {
  sectorTemplateKey: "retail",
  sectorName: "Retail & Commerce",
  industry: "retail",
  maturityLevel: "growth",
  branchTypes: [
    { key: "hq", name: "Head office" },
    { key: "store", name: "Retail store" },
    { key: "dc", name: "Distribution center" },
  ],
  departments: [
    { key: "stores", name: "Store Operations", recommendedHeadcount: { min: 10, max: 100 } },
    { key: "merch", name: "Merchandising", recommendedHeadcount: { min: 3, max: 20 } },
    { key: "inventory", name: "Inventory & Supply", recommendedHeadcount: { min: 4, max: 30 } },
    { key: "finance", name: "Finance", recommendedHeadcount: { min: 3, max: 15 } },
    { key: "hr", name: "HR", recommendedHeadcount: { min: 2, max: 10 } },
    { key: "security", name: "CyberCrow Security", recommendedHeadcount: { min: 1, max: 5 } },
  ],
  positions: [
    { key: "store-mgr", title: "Store Manager", departmentKey: "stores", level: "manager", responsibilities: ["Store P&L", "Staff"], sareaPersonaKey: "manager" },
    { key: "merch-mgr", title: "Merchandising Manager", departmentKey: "merch", level: "manager", responsibilities: ["Assortment", "Pricing"], sareaPersonaKey: "manager" },
    { key: "associate", title: "Sales Associate", departmentKey: "stores", level: "frontline", responsibilities: ["POS", "Customer service"], sareaPersonaKey: "frontline", recommendedCountMin: 5, recommendedCountMax: 80 },
  ],
  workflows: [
    { key: "stock-transfer", name: "Stock transfer", departmentScope: "inventory", complexityLevel: "standard" },
    { key: "price-change", name: "Price change approval", departmentScope: "merch", complexityLevel: "standard" },
  ],
  approvalChains: [
    { key: "price-chain", name: "Pricing approval", workflowKey: "price-change", steps: ["Merchandising Specialist", "Merchandising Manager", "Finance Manager"] },
  ],
  cybercrowBaselines: [
    { key: "pos-audit", name: "POS and payment audit", controls: ["pos_events", "refund_monitor"], riskFocus: "fraud", monitoringLevel: "elevated" },
    { key: "store-access", name: "Store role boundaries", controls: ["store_rbac"], riskFocus: "access", monitoringLevel: "standard" },
  ],
  sareaProfiles: [
    { key: "store-dash", name: "Store manager dashboard", positionKey: "store-mgr", experienceProfile: "Sales KPIs and labor", dashboardType: "operational", complexityLevel: "manager", personaKey: "manager" },
    { key: "associate-mobile", name: "Associate mobile UI", positionKey: "associate", experienceProfile: "Tasks and POS shortcuts", dashboardType: "mobile", complexityLevel: "frontline", personaKey: "frontline" },
  ],
};

export const SECTOR_TEMPLATE_CATALOG: Record<SectorTemplateKey, OrgIntelligenceModel> = {
  logistics: LOGISTICS,
  construction: CONSTRUCTION,
  aviation: AVIATION,
  healthcare: HEALTHCARE,
  retail: RETAIL,
};

export const SECTOR_TEMPLATE_KEYS = Object.keys(SECTOR_TEMPLATE_CATALOG) as SectorTemplateKey[];

export function getSectorTemplateModel(key: SectorTemplateKey): OrgIntelligenceModel {
  return structuredClone(SECTOR_TEMPLATE_CATALOG[key]);
}
