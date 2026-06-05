import type { CemOperationalArea } from "@/lib/cem/cem-runtime-handoff-contract";

export type CemOperationalAreaExpectation = {
  area: CemOperationalArea;
  label: string;
  routeKey:
    | "dashboard"
    | "modules"
    | "departments"
    | "roles"
    | "users"
    | "tasks"
    | "workflows"
    | "reports"
    | "hr"
    | "finance"
    | "procurement"
    | "logistics"
    | "inventory"
    | "warehouse"
    | "crm"
    | "sales";
  moduleKey?: string;
  purpose: string;
  expectations: readonly string[];
  thinLabel: string;
  nextAction: string;
};

export const CEM_OPERATIONAL_AREA_EXPECTATIONS: readonly CemOperationalAreaExpectation[] = [
  {
    area: "modules",
    label: "Modules",
    routeKey: "modules",
    purpose: "Show enabled operational areas and how they connect across the Business Portal.",
    expectations: [
      "Enabled modules are visible with clear purpose",
      "Module list ties to blueprint / ProCrow prep",
    ],
    thinLabel: "Few modules enabled — expand via blueprint before staging handoff demo.",
    nextAction: "Review enabled modules on blueprint or tenant workbench.",
  },
  {
    area: "departments",
    label: "Departments",
    routeKey: "departments",
    purpose: "Org structure foundation for roles, workflows, and SAREA profiles.",
    expectations: ["At least one department visible for staging walkthrough"],
    thinLabel: "Departments thin — seed or complete discovery org model.",
    nextAction: "Add departments via discovery or ops seeding.",
  },
  {
    area: "roles",
    label: "Roles",
    routeKey: "roles",
    purpose: "RBAC role structure visible; SAREA maps experience on top of roles.",
    expectations: ["Role definitions visible", "No permission grants from handoff layer"],
    thinLabel: "Roles not seeded — handoff remains demo-limited.",
    nextAction: "Seed roles from blueprint or discovery acceptance.",
  },
  {
    area: "users",
    label: "Users",
    routeKey: "users",
    purpose: "Tenant user / profile list or invitation state for operational assignments.",
    expectations: ["Profiles or invitation posture visible"],
    thinLabel: "No tenant profiles — tasks and workflows lack assignees.",
    nextAction: "Invite tenant users or run approved ops seeding.",
  },
  {
    area: "tasks",
    label: "Tasks",
    routeKey: "tasks",
    purpose: "Coordination layer across modules — assignments and status.",
    expectations: ["Task list or empty state explains next seeding step"],
    thinLabel: "No tasks — coordination demo-limited until ops seeding.",
    nextAction: "Seed tasks after workflows or run meem ops seed on demo tenant.",
  },
  {
    area: "workflows",
    label: "Workflows",
    routeKey: "workflows",
    purpose: "Workflow definitions linking departments, tasks, and approvals.",
    expectations: ["Workflow definitions or provisioning guidance visible"],
    thinLabel: "No workflows — operational handoff stays thin.",
    nextAction: "Add workflow definitions via discovery / blueprint provisioning.",
  },
  {
    area: "reports",
    label: "Reports",
    routeKey: "reports",
    purpose: "Visibility / BI roll-up layer — advisory signals, not certified reporting.",
    expectations: ["Reports hub explains data sources", "Links back to module signals"],
    thinLabel: "Reports visibility layer present; underlying module data may be demo-limited.",
    nextAction: "Enable finance/inventory/sales modules for richer roll-ups.",
  },
  {
    area: "hr",
    label: "HR",
    routeKey: "hr",
    moduleKey: "hr",
    purpose: "HR operations readiness hub — demo-limited depth, not full HCM.",
    expectations: ["Route exists when HR module enabled", "Operational purpose explained"],
    thinLabel: "HR hub is demo-limited — not production HCM.",
    nextAction: "Use HR hub for staging narrative; deepen in module pass if needed.",
  },
  {
    area: "finance",
    label: "Finance",
    routeKey: "finance",
    moduleKey: "finance",
    purpose: "Finance operations readiness — ledger signals, not live accounting.",
    expectations: ["Route exists when finance module enabled"],
    thinLabel: "Finance hub is demo-limited — not live accounting.",
    nextAction: "Enable finance data via approved seeding for richer demo.",
  },
  {
    area: "procurement",
    label: "Procurement",
    routeKey: "procurement",
    moduleKey: "procurement",
    purpose: "Procurement readiness hub linked to inventory and finance.",
    expectations: ["Route exists when procurement module enabled"],
    thinLabel: "Procurement hub is demo-limited.",
    nextAction: "Walk procurement → inventory linkage on staging demo.",
  },
  {
    area: "logistics",
    label: "Logistics",
    routeKey: "logistics",
    moduleKey: "logistics",
    purpose: "Logistics operations readiness — no live TMS/GPS claims.",
    expectations: ["Route exists when logistics module enabled"],
    thinLabel: "Logistics hub is demo-limited.",
    nextAction: "Use logistics hub for cross-module cohesion demo.",
  },
  {
    area: "inventory",
    label: "Inventory",
    routeKey: "inventory",
    moduleKey: "inventory",
    purpose: "Inventory readiness hub — not live WMS/RFID.",
    expectations: ["Route exists when inventory module enabled"],
    thinLabel: "Inventory hub is demo-limited.",
    nextAction: "Link inventory to warehouse and procurement on demo.",
  },
  {
    area: "warehouse",
    label: "Warehouse",
    routeKey: "warehouse",
    moduleKey: "warehouse",
    purpose: "Warehouse readiness hub — staging operations narrative.",
    expectations: ["Route exists when warehouse module enabled"],
    thinLabel: "Warehouse hub is demo-limited.",
    nextAction: "Show warehouse ↔ inventory chain on staging walkthrough.",
  },
  {
    area: "crm",
    label: "CRM",
    routeKey: "crm",
    moduleKey: "crm",
    purpose: "CRM readiness hub — pipeline visibility, not live CRM sync.",
    expectations: ["Route exists when CRM module enabled"],
    thinLabel: "CRM hub is demo-limited.",
    nextAction: "Enable CRM module data for pipeline demo if needed.",
  },
  {
    area: "sales",
    label: "Sales",
    routeKey: "sales",
    moduleKey: "sales",
    purpose: "Sales readiness hub linked to CRM and finance signals.",
    expectations: ["Route exists when sales module enabled"],
    thinLabel: "Sales hub is demo-limited.",
    nextAction: "Use sales hub in cohesion demo with CRM/finance.",
  },
] as const;

export const CEM_DASHBOARD_HANDOFF_EXPECTATIONS = [
  "Tenant identity and enabled modules overview",
  "Next actions for operations, trust, and experience",
  "CyberCrow trust posture signal when initialized",
  "SAREA experience note — RBAC unchanged",
  "Staging/runtime disclaimer — F23-gated production",
] as const;
