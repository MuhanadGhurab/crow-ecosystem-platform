/**
 * G1 — Self-describing ERP/CEM module catalog (architecture baseline).
 * Rule-based, operator-guided, integration-ready — no autonomous AI claims.
 */

import type { ModeledSectorKey } from "@/lib/constants/sector-catalog";
import type { ErpModuleKey } from "@/lib/constants/erp-module-registry";
import type { ErpModuleMaturityId } from "@/lib/constants/erp-module-maturity";

export type SectorRelevanceTier = "primary" | "secondary" | "optional" | "low";

export type ErpModuleCategory = "core_erp" | "platform_foundation" | "catalog_only";

export type ErpModuleCatalogEntry = {
  /** CEM / tenant module key (canonical catalog id) */
  cemModuleKey: string;
  erpKey?: ErpModuleKey;
  label: string;
  routePattern: string;
  hasTenantRoute: boolean;
  category: ErpModuleCategory;
  shortDescription: string;
  businessPurpose: string;
  primaryUsers: readonly string[];
  relatedDepartments: readonly string[];
  ownedDataExamples: readonly string[];
  commonWorkflows: readonly string[];
  approvalNeeds: readonly string[];
  reportSignals: readonly string[];
  cyberCrowRisks: readonly string[];
  evidenceExamples: readonly string[];
  auditEvents: readonly string[];
  sareaExperienceHints: readonly string[];
  sectorRelevance: Record<ModeledSectorKey, SectorRelevanceTier>;
  dependencies: readonly string[];
  implementationStatus: ErpModuleMaturityId;
  dataSource: string;
  uiMaturityNotes: string;
  futureDepth: readonly string[];
  futureOnlyCapabilities?: readonly string[];
};

const SECTORS: ModeledSectorKey[] = [
  "logistics",
  "retail",
  "construction",
  "aviation",
  "healthcare",
];

function rel(
  primary: ModeledSectorKey[],
  secondary: ModeledSectorKey[] = [],
  low: ModeledSectorKey[] = []
): Record<ModeledSectorKey, SectorRelevanceTier> {
  const out = {} as Record<ModeledSectorKey, SectorRelevanceTier>;
  for (const s of SECTORS) {
    if (primary.includes(s)) out[s] = "primary";
    else if (secondary.includes(s)) out[s] = "secondary";
    else if (low.includes(s)) out[s] = "low";
    else out[s] = "optional";
  }
  return out;
}

const SHARED_CYBER = {
  access: "Excessive role grants on module actions",
  audit: "Missing evidence for privileged changes",
} as const;

export const ERP_MODULE_CATALOG: ErpModuleCatalogEntry[] = [
  {
    cemModuleKey: "sales",
    erpKey: "sales",
    label: "Sales",
    routePattern: "/[tenant]/sales",
    hasTenantRoute: true,
    category: "core_erp",
    shortDescription: "Pipeline, quotes, and orders with CRM and finance handoffs.",
    businessPurpose:
      "Capture revenue opportunities and fulfillment demand for operator-guided selling.",
    primaryUsers: ["Sales manager", "Account executive", "Commercial ops"],
    relatedDepartments: ["Sales", "Commercial", "Revenue"],
    ownedDataExamples: ["Opportunities", "Quotes", "Order references", "Pipeline SAR totals"],
    commonWorkflows: ["Quote-to-order", "Freight quote (logistics tenants)", "B2B deal review"],
    approvalNeeds: ["Discount exceptions", "Large deal sign-off"],
    reportSignals: ["Pipeline SAR", "Win rate", "Quote volume"],
    cyberCrowRisks: ["Unauthorized quote approval", SHARED_CYBER.access],
    evidenceExamples: ["Approved discount", "Won deal audit trail"],
    auditEvents: ["sales.opportunity.created", "sales.status.changed"],
    sareaExperienceHints: [
      "Frontline: compact pipeline cards",
      "Manager: density with KPI strip",
      "Executive: link to Reports only",
    ],
    sectorRelevance: rel(
      ["logistics", "retail", "construction", "aviation", "healthcare"],
      [],
      []
    ),
    dependencies: ["crm", "finance", "inventory"],
    implementationStatus: "workflow_linked",
    dataSource: "sales.service + MEEM logistics samples when mock",
    uiMaturityNotes: "ErpModuleHub on MEEM; stat strip + opportunity table; ErpChainLinks",
    futureDepth: ["Configurable stages", "CPQ templates", "Sector quote packs"],
  },
  {
    cemModuleKey: "inventory",
    erpKey: "inventory",
    label: "Inventory",
    routePattern: "/[tenant]/inventory",
    hasTenantRoute: true,
    category: "core_erp",
    shortDescription: "SKU and stock signals for ops, warehouse, and reports.",
    businessPurpose: "Maintain stock visibility across locations and fulfillment paths.",
    primaryUsers: ["Inventory controller", "Ops manager", "Store manager"],
    relatedDepartments: ["Operations", "Supply chain", "Retail ops"],
    ownedDataExamples: ["SKUs", "On-hand qty", "Reorder hints", "Movement events"],
    commonWorkflows: ["Stock adjustment", "Replenishment", "Cycle count (advisory)"],
    approvalNeeds: ["Write-off", "Negative stock override"],
    reportSignals: ["Stock value", "SKU count", "Low-stock flags"],
    cyberCrowRisks: ["Bulk export without approval", SHARED_CYBER.audit],
    evidenceExamples: ["Adjustment ticket", "Count sheet attachment"],
    auditEvents: ["inventory.adjustment", "inventory.sku.updated"],
    sareaExperienceHints: ["Warehouse clerk: minimal columns", "Planner: full grid"],
    sectorRelevance: rel(["logistics", "retail", "construction"], ["aviation", "healthcare"]),
    dependencies: ["warehouse", "procurement", "sales"],
    implementationStatus: "workflow_linked",
    dataSource: "inventory.service + industry packs",
    uiMaturityNotes: "Hub + chain links; stronger on MEEM/logistics and retail seeds",
    futureDepth: ["Lot/serial tracking", "Multi-UOM", "ATP for sales"],
  },
  {
    cemModuleKey: "warehouse",
    erpKey: "warehouse",
    label: "Warehouse",
    routePattern: "/[tenant]/warehouse",
    hasTenantRoute: true,
    category: "core_erp",
    shortDescription: "Location-level throughput alongside inventory balances.",
    businessPurpose: "Track hub and bin activity feeding logistics and finance signals.",
    primaryUsers: ["Warehouse supervisor", "Hub operator"],
    relatedDepartments: ["Warehouse", "Distribution"],
    ownedDataExamples: ["Locations", "Throughput events", "Pick/pack status"],
    commonWorkflows: ["Inbound receipt", "Pick for shipment", "Hub transfer"],
    approvalNeeds: ["Location override", "High-value dispatch"],
    reportSignals: ["Hub throughput", "Dock utilization (advisory)"],
    cyberCrowRisks: ["After-hours access to dispatch", SHARED_CYBER.access],
    evidenceExamples: ["Dispatch sign-off", "Exception photo (advisory)"],
    auditEvents: ["warehouse.movement.posted"],
    sareaExperienceHints: ["Mobile-first for floor staff", "Desktop for supervisors"],
    sectorRelevance: rel(["logistics", "retail"], ["construction"], ["aviation", "healthcare"]),
    dependencies: ["inventory", "logistics"],
    implementationStatus: "workflow_linked",
    dataSource: "warehouse.service",
    uiMaturityNotes: "Operational lists + ErpModuleHub on reference tenants",
    futureDepth: ["Wave picking", "Barcode scan UI", "3PL integrations (future-only)"],
  },
  {
    cemModuleKey: "logistics",
    erpKey: "logistics",
    label: "Logistics",
    routePattern: "/[tenant]/logistics",
    hasTenantRoute: true,
    category: "core_erp",
    shortDescription: "Shipment and hub workflows — deepest on MEEM logistics tenants.",
    businessPurpose: "Coordinate lanes, hubs, and shipment lifecycle for freight operators.",
    primaryUsers: ["Dispatcher", "Hub manager", "Customer service"],
    relatedDepartments: ["Logistics", "Transport", "Fleet"],
    ownedDataExamples: ["Shipments", "Lanes", "Hub events", "POD status"],
    commonWorkflows: ["Shipment booking", "Hub scan", "Delivery exception"],
    approvalNeeds: ["Rate exception", "Manual POD"],
    reportSignals: ["OTIF (advisory)", "Hub volume", "Open shipments"],
    cyberCrowRisks: ["Tracker API misuse (future)", "POD tampering"],
    evidenceExamples: ["POD capture", "Exception approval"],
    auditEvents: ["logistics.shipment.status_changed"],
    sareaExperienceHints: ["Dispatcher: high-density timeline", "Exec: summary tiles only"],
    sectorRelevance: rel(["logistics"], ["retail"], ["construction", "aviation", "healthcare"]),
    dependencies: ["warehouse", "inventory", "sales", "finance"],
    implementationStatus: "fully_integrated_runtime",
    dataSource: "logistics services + MEEM ops catalog + industry pack",
    uiMaturityNotes: "Strongest module on MEEM; ErpChainLinks; ops intelligence panels",
    futureDepth: ["Fleet telematics (future-only)", "Carrier API (future-only)"],
    futureOnlyCapabilities: ["Live carrier tracking", "Autonomous dispatch"],
  },
  {
    cemModuleKey: "finance",
    erpKey: "finance",
    label: "Finance",
    routePattern: "/[tenant]/finance",
    hasTenantRoute: true,
    category: "core_erp",
    shortDescription: "Ledger and AR visibility when finance data is seeded.",
    businessPurpose: "Provide financial roll-ups and operator-guided fiscal checkpoints.",
    primaryUsers: ["Finance controller", "AR clerk", "CFO office"],
    relatedDepartments: ["Finance", "Accounting"],
    ownedDataExamples: ["AR balance", "Ledger lines (summary)", "Invoice references"],
    commonWorkflows: ["Month-end review", "AR collection", "PO accrual match"],
    approvalNeeds: ["Journal entry", "Write-off", "Payment release"],
    reportSignals: ["AR aging", "Cash snapshot", "Expense ratio"],
    cyberCrowRisks: ["Segregation of duties gaps", SHARED_CYBER.audit],
    evidenceExamples: ["Approved journal", "Payment batch log"],
    auditEvents: ["finance.entry.posted"],
    sareaExperienceHints: ["Clerk: form-first", "Controller: dashboard + reports link"],
    sectorRelevance: rel(
      ["logistics", "retail", "construction", "aviation", "healthcare"]
    ),
    dependencies: ["sales", "procurement", "reports"],
    implementationStatus: "workflow_linked",
    dataSource: "finance.service",
    uiMaturityNotes: "Summary stats + lists; not a full GL product",
    futureDepth: ["Multi-currency", "Budget vs actual", "Tax lines"],
  },
  {
    cemModuleKey: "procurement",
    erpKey: "procurement",
    label: "Procurement",
    routePattern: "/[tenant]/procurement",
    hasTenantRoute: true,
    category: "core_erp",
    shortDescription: "Purchase requests and supplier touchpoints.",
    businessPurpose: "Govern spend intake before inventory and finance posting.",
    primaryUsers: ["Buyer", "Site manager", "Procurement lead"],
    relatedDepartments: ["Procurement", "Projects", "Maintenance"],
    ownedDataExamples: ["PR lines", "Supplier refs", "Approval status"],
    commonWorkflows: ["PR to PO", "Supplier onboarding (advisory)", "Emergency buy"],
    approvalNeeds: ["PR approval", "Supplier master change"],
    reportSignals: ["Open PRs", "Spend by category"],
    cyberCrowRisks: ["Vendor bank detail change", SHARED_CYBER.access],
    evidenceExamples: ["Approved PR", "Three-quote policy note"],
    auditEvents: ["procurement.request.submitted"],
    sareaExperienceHints: ["Requester: simple form", "Approver: task-centric"],
    sectorRelevance: rel(
      ["logistics", "retail", "construction", "aviation", "healthcare"],
      [],
      []
    ),
    dependencies: ["inventory", "finance", "tasks"],
    implementationStatus: "workflow_linked",
    dataSource: "procurement.service",
    uiMaturityNotes: "Lists + hub on MEEM; chain link to inventory",
    futureDepth: ["Catalog punch-out (future-only)", "Contract compliance"],
  },
  {
    cemModuleKey: "hr",
    erpKey: "hr",
    label: "HR",
    routePattern: "/[tenant]/hr",
    hasTenantRoute: true,
    category: "core_erp",
    shortDescription:
      "Workforce operational readiness — people records, org linkage, and advisory onboarding/offboarding.",
    businessPurpose:
      "Coordinate workforce structure visibility across profiles, roles, departments, tasks, SAREA personas, and CyberCrow identity posture — not payroll or full HRMS.",
    primaryUsers: [
      "HR admin",
      "People ops",
      "Department manager",
      "Tenant admin",
      "CyberCrow reviewer (read-only)",
    ],
    relatedDepartments: ["HR", "People operations", "Line management"],
    ownedDataExamples: [
      "HR employee records",
      "Department assignment",
      "Profile–role linkage (via users)",
      "Workforce readiness signals",
    ],
    commonWorkflows: [
      "Onboarding readiness",
      "Offboarding readiness",
      "Role change",
      "Department transfer",
      "Access review (advisory)",
      "Policy acknowledgement readiness",
    ],
    approvalNeeds: ["Role change", "Sensitive profile edit", "Offboarding checklist"],
    reportSignals: [
      "Headcount (HR + profiles)",
      "Role coverage gaps",
      "Department mapping",
      "HR-related open tasks",
    ],
    cyberCrowRisks: [
      "Stale access after offboarding",
      "Overprivileged accounts",
      "HR/profile email mismatch",
      SHARED_CYBER.access,
    ],
    evidenceExamples: [
      "Onboarding approval trail",
      "Offboarding checklist",
      "Role change approval",
      "Access review record",
    ],
    auditEvents: ["hr.employee.updated", "hr.role.assigned"],
    sareaExperienceHints: [
      "RBAC on users/roles",
      "Persona density via SAREA profiles",
      "HR hub: readiness summary",
    ],
    sectorRelevance: rel(
      ["logistics", "retail", "construction", "aviation", "healthcare"]
    ),
    dependencies: ["departments", "roles", "users", "tasks", "reports", "cybercrow"],
    implementationStatus: "workflow_linked",
    dataSource: "hr.service + hr-readiness.service + tenant identity",
    uiMaturityNotes:
      "G2 depth: workforce readiness panel, org linkage banners, workflow recommendations — operator-managed",
    futureDepth: [
      "Leave management (future-only)",
      "Payroll export (future-only — not in scope)",
    ],
  },
  {
    cemModuleKey: "crm",
    erpKey: "crm",
    label: "CRM",
    routePattern: "/[tenant]/crm",
    hasTenantRoute: true,
    category: "core_erp",
    shortDescription: "Customer master and relationship context for sales workflows.",
    businessPurpose: "Maintain accounts and contacts for operator-guided commercial ops.",
    primaryUsers: ["Account manager", "Customer success", "Sales ops"],
    relatedDepartments: ["Sales", "Customer success"],
    ownedDataExamples: ["Accounts", "Contacts", "Activity notes"],
    commonWorkflows: ["Account review", "Escalation", "Renewal (advisory)"],
    approvalNeeds: ["Credit limit override", "Master data merge"],
    reportSignals: ["Active accounts", "Pipeline by account"],
    cyberCrowRisks: ["PII overexposure", SHARED_CYBER.access],
    evidenceExamples: ["Credit approval", "Contract attachment ref"],
    auditEvents: ["crm.account.updated"],
    sareaExperienceHints: ["Field rep: mobile account card", "Manager: pipeline join"],
    sectorRelevance: rel(
      ["logistics", "retail", "construction", "aviation", "healthcare"]
    ),
    dependencies: ["sales", "reports"],
    implementationStatus: "operational_list",
    dataSource: "crm.service",
    uiMaturityNotes: "Strong forms + lists; Meem hub optional",
    futureDepth: ["Case management", "Marketing lists (future-only)"],
  },
  {
    cemModuleKey: "approvals",
    erpKey: "tasks",
    label: "Tasks / Approvals",
    routePattern: "/[tenant]/tasks",
    hasTenantRoute: true,
    category: "core_erp",
    shortDescription: "Open approvals and tasks tied to workflows across modules.",
    businessPurpose: "Centralize operator tasks for cross-module governance.",
    primaryUsers: ["Approver", "Process owner", "Department manager"],
    relatedDepartments: ["All departments"],
    ownedDataExamples: ["Task rows", "Status", "Workflow linkage"],
    commonWorkflows: ["Approve PR", "Sign shipment exception", "HR change"],
    approvalNeeds: ["Delegation", "Escalation timeout"],
    reportSignals: ["Open task count", "Aging approvals"],
    cyberCrowRisks: ["Approval bypass", "Stale privileged approvers"],
    evidenceExamples: ["Task completion record", "Workflow step proof"],
    auditEvents: ["task.completed", "task.assigned"],
    sareaExperienceHints: ["Approver: task inbox first", "Requester: status chip on module"],
    sectorRelevance: rel(
      ["logistics", "retail", "construction", "aviation", "healthcare"]
    ),
    dependencies: ["workflows"],
    implementationStatus: "workflow_linked",
    dataSource: "tasks.service + cem-operations-intelligence",
    uiMaturityNotes: "F26 depth — cross-links from ERP modules",
    futureDepth: ["SLA timers", "Bulk approve with evidence"],
  },
  {
    cemModuleKey: "bi",
    erpKey: "reports",
    label: "Reports / BI",
    routePattern: "/[tenant]/reports",
    hasTenantRoute: true,
    category: "core_erp",
    shortDescription: "Cross-module KPIs and executive snapshots (lightweight BI).",
    businessPurpose: "Roll up module signals for advisory intelligence — not autonomous analytics.",
    primaryUsers: ["COO", "CFO", "Department head"],
    relatedDepartments: ["Executive", "Finance", "Operations"],
    ownedDataExamples: ["KPI definitions", "Snapshot tiles", "Module roll-ups"],
    commonWorkflows: ["Weekly ops review", "Board pack (advisory)"],
    approvalNeeds: ["Publish dashboard (future)"],
    reportSignals: ["All module reportSignals aggregate here"],
    cyberCrowRisks: ["Export of sensitive KPIs", SHARED_CYBER.access],
    evidenceExamples: ["Report run log", "Snapshot export"],
    auditEvents: ["reports.snapshot.generated"],
    sareaExperienceHints: ["Executive: low density charts", "Analyst: table forward"],
    sectorRelevance: rel(
      ["logistics", "retail", "construction", "aviation", "healthcare"]
    ),
    dependencies: ["sales", "finance", "inventory", "logistics", "hr"],
    implementationStatus: "evidence_report_linked",
    dataSource: "reports.service + workspace summary",
    uiMaturityNotes: "BI hub; links from modules page when bi enabled",
    futureDepth: ["Custom dashboards", "Scheduled email (future-only)"],
    futureOnlyCapabilities: ["Autonomous insights", "Predictive forecasting"],
  },
  {
    cemModuleKey: "workflows",
    label: "Workflows",
    routePattern: "/[tenant]/workflows",
    hasTenantRoute: true,
    category: "platform_foundation",
    shortDescription: "Named workflows and steps spanning departments.",
    businessPurpose: "Define rule-based process templates that generate tasks and evidence hooks.",
    primaryUsers: ["Process owner", "Ops excellence", "Admin"],
    relatedDepartments: ["Operations", "IT", "Compliance"],
    ownedDataExamples: ["Workflow definitions", "Steps", "Active flag"],
    commonWorkflows: ["Provision tenant", "OCR review (MEEM)", "Approval chain"],
    approvalNeeds: ["Workflow publish", "Step reorder"],
    reportSignals: ["Active workflow count"],
    cyberCrowRisks: ["Workflow tampering", SHARED_CYBER.audit],
    evidenceExamples: ["Published workflow version"],
    auditEvents: ["workflow.updated"],
    sareaExperienceHints: ["Admin: full editor (future)", "User: read-only catalog"],
    sectorRelevance: rel(
      ["logistics", "retail", "construction", "aviation", "healthcare"]
    ),
    dependencies: ["tasks", "departments"],
    implementationStatus: "workflow_linked",
    dataSource: "tenant-identity.service + cem-operations-intelligence",
    uiMaturityNotes: "Operational list with ops snapshot overlays on MEEM",
    futureDepth: ["Visual designer", "Versioned publish"],
  },
  {
    cemModuleKey: "departments",
    label: "Departments",
    routePattern: "/[tenant]/departments",
    hasTenantRoute: true,
    category: "platform_foundation",
    shortDescription: "Department tree for org structure and RBAC context.",
    businessPurpose: "Organize people and approvals by department.",
    primaryUsers: ["HR admin", "Tenant admin"],
    relatedDepartments: ["HR", "IT"],
    ownedDataExamples: ["Department nodes", "Parent/child"],
    commonWorkflows: ["Org restructure", "Cost center mapping (advisory)"],
    approvalNeeds: ["Department delete", "Merge"],
    reportSignals: ["Headcount by department"],
    cyberCrowRisks: [SHARED_CYBER.access],
    evidenceExamples: ["Org change ticket"],
    auditEvents: ["department.updated"],
    sareaExperienceHints: ["Rarely frontline-facing"],
    sectorRelevance: rel(
      ["logistics", "retail", "construction", "aviation", "healthcare"]
    ),
    dependencies: ["hr", "roles"],
    implementationStatus: "operational_list",
    dataSource: "tenant-identity.service",
    uiMaturityNotes: "List page; discovery seeds structure",
    futureDepth: ["Hierarchy drag-drop", "Delegated admin"],
  },
  {
    cemModuleKey: "roles",
    label: "Roles",
    routePattern: "/[tenant]/roles",
    hasTenantRoute: true,
    category: "platform_foundation",
    shortDescription: "Tenant roles for RBAC — separate from SAREA experience profiles.",
    businessPurpose: "Control which modules and actions operators may access.",
    primaryUsers: ["Security admin", "Tenant admin"],
    relatedDepartments: ["IT", "Security"],
    ownedDataExamples: ["Role definitions", "Permission bundles (advisory)"],
    commonWorkflows: ["Role assignment", "Access review"],
    approvalNeeds: ["Privileged role grant"],
    reportSignals: ["Role count", "Users per role"],
    cyberCrowRisks: ["Excessive admin roles", SHARED_CYBER.audit],
    evidenceExamples: ["Access review export"],
    auditEvents: ["role.permission.changed"],
    sareaExperienceHints: ["Maps to SAREA role-mapping — experience not access"],
    sectorRelevance: rel(
      ["logistics", "retail", "construction", "aviation", "healthcare"]
    ),
    dependencies: ["users", "sarea"],
    implementationStatus: "operational_list",
    dataSource: "tenant-identity.service",
    uiMaturityNotes: "List + linkage to CyberCrow identity advisory",
    futureDepth: ["Fine-grained permissions", "SoD rules (advisory)"],
  },
  {
    cemModuleKey: "users",
    label: "Users",
    routePattern: "/[tenant]/users",
    hasTenantRoute: true,
    category: "platform_foundation",
    shortDescription: "Tenant user directory and membership.",
    businessPurpose: "Bind auth identities to roles and departments.",
    primaryUsers: ["Tenant admin", "IT support"],
    relatedDepartments: ["IT", "HR"],
    ownedDataExamples: ["User records", "Role membership"],
    commonWorkflows: ["Invite user", "Deactivate", "Reset access (advisory)"],
    approvalNeeds: ["Admin invite", "Role elevation"],
    reportSignals: ["Active users"],
    cyberCrowRisks: ["Dormant admin accounts", SHARED_CYBER.audit],
    evidenceExamples: ["Joiner/mover/leaver log"],
    auditEvents: ["user.role.changed"],
    sareaExperienceHints: ["Admin console density"],
    sectorRelevance: rel(
      ["logistics", "retail", "construction", "aviation", "healthcare"]
    ),
    dependencies: ["roles", "hr"],
    implementationStatus: "operational_list",
    dataSource: "tenant-identity.service",
    uiMaturityNotes: "Operational list",
    futureDepth: ["SCIM (future-only)", "Entra group sync (future-only)"],
    futureOnlyCapabilities: ["Autonomous access provisioning"],
  },
  {
    cemModuleKey: "branches",
    label: "Branches",
    routePattern: "/[tenant]/branches",
    hasTenantRoute: true,
    category: "platform_foundation",
    shortDescription: "Physical locations seeded from discovery.",
    businessPurpose: "Anchor multi-site ops for retail, logistics, and construction tenants.",
    primaryUsers: ["Ops admin", "Regional manager"],
    relatedDepartments: ["Operations", "Facilities"],
    ownedDataExamples: ["Branch name", "City", "Region"],
    commonWorkflows: ["Site opening", "Regional rollup"],
    approvalNeeds: ["Branch closure"],
    reportSignals: ["Sites by region"],
    cyberCrowRisks: ["Wrong-site data access"],
    evidenceExamples: ["Site charter document"],
    auditEvents: ["branch.created"],
    sareaExperienceHints: ["Regional manager: branch switcher (future)"],
    sectorRelevance: rel(["retail", "logistics", "construction"], ["aviation"], ["healthcare"]),
    dependencies: ["inventory", "hr"],
    implementationStatus: "operational_list",
    dataSource: "tenant-identity.service",
    uiMaturityNotes: "Simple list — thin but functional",
    futureDepth: ["Geo map", "Hours of operation"],
  },
  {
    cemModuleKey: "modules",
    label: "Modules",
    routePattern: "/[tenant]/modules",
    hasTenantRoute: true,
    category: "platform_foundation",
    shortDescription: "Enabled CEM modules and operational depth advisory grid.",
    businessPurpose: "Self-describing map of what is enabled vs catalog-only on this tenant.",
    primaryUsers: ["Tenant admin", "Solution lead"],
    relatedDepartments: ["IT", "Transformation"],
    ownedDataExamples: ["TenantModule rows", "Enable flags"],
    commonWorkflows: ["Blueprint alignment", "Enable module"],
    approvalNeeds: ["Module entitlement change (advisory)"],
    reportSignals: ["Enabled module count"],
    cyberCrowRisks: ["Shadow modules enabled"],
    evidenceExamples: ["Blueprint module manifest"],
    auditEvents: ["tenant.module.enabled"],
    sareaExperienceHints: ["Admin overview — not frontline"],
    sectorRelevance: rel(
      ["logistics", "retail", "construction", "aviation", "healthcare"]
    ),
    dependencies: [],
    implementationStatus: "readiness_page",
    dataSource: "tenant.modules + erp-module-catalog",
    uiMaturityNotes: "TenantModulesOperationalGrid — uses catalog purpose copy",
    futureDepth: ["Dependency warnings", "Sector fit score from matrix"],
  },
  {
    cemModuleKey: "dashboard",
    label: "Tenant dashboard",
    routePattern: "/[tenant]/dashboard",
    hasTenantRoute: true,
    category: "platform_foundation",
    shortDescription: "Command center entry with cross-module snapshot.",
    businessPurpose: "Orient operators to open tasks, workflows, and module shortcuts.",
    primaryUsers: ["All tenant users"],
    relatedDepartments: ["Executive", "Operations"],
    ownedDataExamples: ["Summary counts", "Quick links"],
    commonWorkflows: ["Daily stand-up", "Ops pulse"],
    approvalNeeds: [],
    reportSignals: ["Aggregated KPI teasers"],
    cyberCrowRisks: ["Overprivileged dashboard widgets"],
    evidenceExamples: [],
    auditEvents: [],
    sareaExperienceHints: ["Role-based widget sets (future)"],
    sectorRelevance: rel(
      ["logistics", "retail", "construction", "aviation", "healthcare"]
    ),
    dependencies: ["tasks", "reports", "workflows"],
    implementationStatus: "operational_list",
    dataSource: "workspace-summary + ops snapshot",
    uiMaturityNotes: "CEM command center — cross-links",
    futureDepth: ["Personalized layouts", "Sector dashboard packs"],
  },
  {
    cemModuleKey: "settings",
    label: "Settings / Plan",
    routePattern: "/[tenant]/settings",
    hasTenantRoute: true,
    category: "platform_foundation",
    shortDescription: "Tenant settings and plan readiness (no live billing).",
    businessPurpose: "Show entitlement and configuration posture — advisory only.",
    primaryUsers: ["Tenant admin"],
    relatedDepartments: ["IT", "Finance"],
    ownedDataExamples: ["Plan tier (advisory)", "Feature flags"],
    commonWorkflows: ["Plan review"],
    approvalNeeds: [],
    reportSignals: [],
    cyberCrowRisks: ["Misconfigured auth settings"],
    evidenceExamples: ["Plan change request"],
    auditEvents: ["tenant.settings.updated"],
    sareaExperienceHints: ["Admin-only"],
    sectorRelevance: rel(
      ["logistics", "retail", "construction", "aviation", "healthcare"]
    ),
    dependencies: [],
    implementationStatus: "readiness_page",
    dataSource: "tenant record + billing advisory routes",
    uiMaturityNotes: "Plan page — billing deferred per F23 gate (advisory)",
    futureDepth: ["Usage meters", "Checkout (explicitly deferred)"],
    futureOnlyCapabilities: ["Live Stripe billing", "Usage enforcement"],
  },
  {
    cemModuleKey: "iam",
    label: "IAM (catalog)",
    routePattern: "(no tenant route)",
    hasTenantRoute: false,
    category: "catalog_only",
    shortDescription: "Identity alignment with CyberCrow sessions and RBAC.",
    businessPurpose: "CEM catalog key for identity — surfaces via CyberCrow and modules grid.",
    primaryUsers: ["Security admin"],
    relatedDepartments: ["IT", "Security"],
    ownedDataExamples: ["Session policy (advisory)", "Identity provider refs"],
    commonWorkflows: ["Access review"],
    approvalNeeds: ["IdP config change"],
    reportSignals: [],
    cyberCrowRisks: ["Session fixation", "Weak MFA policy (advisory)"],
    evidenceExamples: ["Identity review export"],
    auditEvents: ["identity.provider.updated"],
    sareaExperienceHints: ["Link from modules grid to CyberCrow identity"],
    sectorRelevance: rel(
      ["logistics", "retail", "construction", "aviation", "healthcare"]
    ),
    dependencies: ["cybercrow"],
    implementationStatus: "concept_placeholder",
    dataSource: "CEM_MODULES catalog only",
    uiMaturityNotes: "No /[tenant]/iam route — CyberCrow identity instead",
    futureDepth: ["Unified IAM route", "Entra tile"],
  },
  {
    cemModuleKey: "projects",
    label: "Projects (catalog)",
    routePattern: "(no tenant route)",
    hasTenantRoute: false,
    category: "catalog_only",
    shortDescription: "Project delivery tracking (lightweight in this phase).",
    businessPurpose: "Future project entity for construction and professional services.",
    primaryUsers: ["Project manager"],
    relatedDepartments: ["Projects", "Engineering"],
    ownedDataExamples: ["WBS (future)", "Milestones (future)"],
    commonWorkflows: ["Stage gate (future)"],
    approvalNeeds: ["Budget transfer"],
    reportSignals: ["Earned value (future)"],
    cyberCrowRisks: ["Shared project folder exposure"],
    evidenceExamples: ["Stage approval"],
    auditEvents: [],
    sareaExperienceHints: ["PM desktop density"],
    sectorRelevance: rel(["construction"], ["aviation", "logistics"], ["retail", "healthcare"]),
    dependencies: ["tasks", "procurement", "finance"],
    implementationStatus: "concept_placeholder",
    dataSource: "CEM_MODULES catalog only",
    uiMaturityNotes: "Not a live tenant route — use tasks/workflows today",
    futureDepth: ["Project hub route", "Cost codes"],
    futureOnlyCapabilities: ["Full PSA suite"],
  },
  {
    cemModuleKey: "documents",
    label: "Documents (catalog)",
    routePattern: "(no tenant route)",
    hasTenantRoute: false,
    category: "catalog_only",
    shortDescription: "Document control hooks (advisory in demo).",
    businessPurpose: "Future document vault linked to evidence and workflows.",
    primaryUsers: ["Compliance", "Quality"],
    relatedDepartments: ["Legal", "Quality"],
    ownedDataExamples: ["Document refs (future)", "Version (future)"],
    commonWorkflows: ["Controlled publish (future)"],
    approvalNeeds: ["Document release"],
    reportSignals: [],
    cyberCrowRisks: ["Uncontrolled document share"],
    evidenceExamples: ["Signed PDF", "Policy attestation"],
    auditEvents: [],
    sareaExperienceHints: ["Read-only viewer for frontline"],
    sectorRelevance: rel(["healthcare", "aviation", "construction"], ["logistics", "retail"]),
    dependencies: ["cybercrow", "tasks"],
    implementationStatus: "concept_placeholder",
    dataSource: "CEM_MODULES catalog only",
    uiMaturityNotes: "Advisory only — evidence via CyberCrow",
    futureDepth: ["Document route", "Retention labels"],
    futureOnlyCapabilities: ["Autonomous classification"],
  },
];

const BY_CEM = new Map(ERP_MODULE_CATALOG.map((e) => [e.cemModuleKey, e]));
const BY_ERP = new Map(
  ERP_MODULE_CATALOG.filter((e) => e.erpKey).map((e) => [e.erpKey!, e])
);

export const LIVE_ERP_CATALOG_ENTRIES = ERP_MODULE_CATALOG.filter(
  (e) => e.category === "core_erp" && e.hasTenantRoute
);

export const ERP_MODULE_CATALOG_CEM_KEYS = ERP_MODULE_CATALOG.map((e) => e.cemModuleKey);

export function getErpModuleCatalogEntry(
  cemOrErpKey: string
): ErpModuleCatalogEntry | undefined {
  return BY_CEM.get(cemOrErpKey) ?? BY_ERP.get(cemOrErpKey as ErpModuleKey);
}

export function getCatalogShortPurpose(moduleKey: string): string | undefined {
  return getErpModuleCatalogEntry(moduleKey)?.shortDescription;
}
