import type { CapabilityDefinition } from "./types";

const base = (
  key: string,
  displayName: string,
  group: string,
  purpose: string,
  status: CapabilityDefinition["status"] = "PLANNED",
): CapabilityDefinition => ({
  key,
  displayName,
  description: purpose,
  status,
  version: "1.0.0",
  provenance: "crow_core",
  group,
  purpose,
  coreEntities: [],
  typicalWorkflowPatternKeys: [],
  recommendedRoleArchetypeKeys: [],
  recommendedSareaPatternKeys: [],
  securityConsiderations: ["tenant_scoped_access"],
  industryRelevance: [],
  dependencies: [],
  conflicts: [],
});

function withMeta(
  entry: CapabilityDefinition,
  meta: Partial<
    Pick<
      CapabilityDefinition,
      | "coreEntities"
      | "typicalWorkflowPatternKeys"
      | "recommendedRoleArchetypeKeys"
      | "recommendedSareaPatternKeys"
      | "securityConsiderations"
      | "industryRelevance"
      | "dependencies"
      | "status"
    >
  >,
): CapabilityDefinition {
  return { ...entry, ...meta };
}

/** Reusable capability catalog — advisory composition building blocks. */
export const CAPABILITY_CATALOG: readonly CapabilityDefinition[] = [
  // Organization and workforce
  withMeta(base("organization_structure", "Organization structure", "organization_workforce", "Departments, branches, and reporting lines."), {
    status: "PARTIAL",
    coreEntities: ["department", "branch", "reporting_line"],
    industryRelevance: ["*"],
  }),
  withMeta(base("workforce_directory", "Workforce directory", "organization_workforce", "Employee and contractor directory."), {
    coreEntities: ["person", "employment_record"],
    recommendedRoleArchetypeKeys: ["hr_specialist", "department_manager"],
  }),
  withMeta(base("employee_lifecycle", "Employee lifecycle", "organization_workforce", "Hire, transfer, and offboard workflows."), {
    typicalWorkflowPatternKeys: ["hire_to_onboard"],
    recommendedRoleArchetypeKeys: ["hr_specialist"],
  }),
  withMeta(base("attendance", "Attendance", "organization_workforce", "Time and attendance tracking."), { status: "CONCEPT" }),
  withMeta(base("leave_management", "Leave management", "organization_workforce", "Leave requests and balances."), { status: "CONCEPT" }),
  withMeta(base("performance", "Performance management", "organization_workforce", "Goals, reviews, and feedback."), { status: "CONCEPT" }),
  withMeta(base("learning", "Learning", "organization_workforce", "Training and certification tracking."), { status: "CONCEPT" }),
  withMeta(base("contractor_management", "Contractor management", "organization_workforce", "External workforce onboarding and access."), {
    recommendedRoleArchetypeKeys: ["contractor", "supervisor"],
  }),
  // Customer and commercial
  withMeta(base("crm", "CRM", "customer_commercial", "Customer accounts and relationship tracking."), {
    status: "PARTIAL",
    coreEntities: ["account", "contact", "activity"],
    recommendedRoleArchetypeKeys: ["sales_representative", "coordinator"],
  }),
  withMeta(base("sales_pipeline", "Sales pipeline", "customer_commercial", "Opportunity stages and forecasting."), { status: "CONCEPT" }),
  withMeta(base("quotations", "Quotations", "customer_commercial", "Quote creation and revision."), {
    typicalWorkflowPatternKeys: ["request_and_approval"],
  }),
  withMeta(base("contracts", "Contracts", "customer_commercial", "Contract lifecycle management."), {
    typicalWorkflowPatternKeys: ["contract_review_and_approval"],
  }),
  withMeta(base("customer_portal", "Customer portal", "customer_commercial", "External customer self-service."), {
    recommendedRoleArchetypeKeys: ["customer"],
    recommendedSareaPatternKeys: ["customer_portal"],
  }),
  withMeta(base("customer_service", "Customer service", "customer_commercial", "Service desk and case intake."), {
    typicalWorkflowPatternKeys: ["case_resolution"],
  }),
  withMeta(base("case_management", "Case management", "customer_commercial", "Structured case handling."), {
    typicalWorkflowPatternKeys: ["case_resolution"],
    recommendedSareaPatternKeys: ["case_inbox"],
  }),
  withMeta(base("subscriptions", "Subscriptions", "customer_commercial", "Recurring service entitlements."), { status: "CONCEPT" }),
  // Projects and service delivery
  withMeta(base("project_management", "Project management", "projects_delivery", "Projects, phases, and deliverables."), {
    typicalWorkflowPatternKeys: ["project_delivery"],
    recommendedSareaPatternKeys: ["project_workspace"],
  }),
  withMeta(base("task_management", "Task management", "projects_delivery", "Assignable tasks and checklists."), { status: "PARTIAL" }),
  withMeta(base("work_orders", "Work orders", "projects_delivery", "Operational work order execution."), {
    typicalWorkflowPatternKeys: ["work_order_execution"],
  }),
  withMeta(base("field_service", "Field service", "projects_delivery", "Mobile field execution and proof."), {
    typicalWorkflowPatternKeys: ["work_order_execution"],
    recommendedSareaPatternKeys: ["field_task_mobile"],
  }),
  withMeta(base("resource_planning", "Resource planning", "projects_delivery", "Capacity and allocation planning."), { status: "CONCEPT" }),
  withMeta(base("time_tracking", "Time tracking", "projects_delivery", "Billable and operational time capture."), { status: "CONCEPT" }),
  withMeta(base("service_delivery", "Service delivery", "projects_delivery", "SLA-backed service fulfillment."), { status: "CONCEPT" }),
  withMeta(base("milestone_management", "Milestone management", "projects_delivery", "Milestone sign-off and billing gates."), {
    typicalWorkflowPatternKeys: ["project_delivery"],
  }),
  // Supply chain and logistics
  withMeta(base("procurement", "Procurement", "supply_chain", "Purchase requests and vendor orders."), {
    typicalWorkflowPatternKeys: ["procure_to_receive"],
    recommendedRoleArchetypeKeys: ["procurement_specialist"],
  }),
  withMeta(base("vendor_management", "Vendor management", "supply_chain", "Supplier onboarding and performance."), {
    recommendedRoleArchetypeKeys: ["supplier", "procurement_specialist"],
  }),
  withMeta(base("inventory", "Inventory", "supply_chain", "Stock levels and movements."), {
    status: "PARTIAL",
    industryRelevance: ["retail_and_commerce", "manufacturing_and_industrial", "logistics_and_fleet"],
  }),
  withMeta(base("warehouse", "Warehouse", "supply_chain", "Inbound, putaway, and outbound operations."), {
    industryRelevance: ["logistics_and_fleet", "retail_and_commerce"],
  }),
  withMeta(base("fleet", "Fleet", "supply_chain", "Vehicle registry and utilization."), {
    industryRelevance: ["logistics_and_fleet"],
    recommendedRoleArchetypeKeys: ["dispatcher", "driver"],
  }),
  withMeta(base("dispatch", "Dispatch", "supply_chain", "Assignment and routing of field resources."), {
    status: "PARTIAL",
    typicalWorkflowPatternKeys: ["dispatch_and_delivery"],
    recommendedSareaPatternKeys: ["dispatch_console"],
    industryRelevance: ["logistics_and_fleet"],
  }),
  withMeta(base("shipment_tracking", "Shipment tracking", "supply_chain", "Shipment status and exceptions."), {
    industryRelevance: ["logistics_and_fleet"],
  }),
  withMeta(base("delivery_management", "Delivery management", "supply_chain", "Last-mile delivery coordination."), {
    typicalWorkflowPatternKeys: ["dispatch_and_delivery"],
    industryRelevance: ["logistics_and_fleet", "food_service"],
  }),
  withMeta(base("returns", "Returns", "supply_chain", "RMA and reverse logistics."), { status: "CONCEPT" }),
  // Assets and facilities
  withMeta(base("asset_registry", "Asset registry", "assets_facilities", "Asset register and custody."), {
    industryRelevance: ["property_and_facilities", "manufacturing_and_industrial"],
  }),
  withMeta(base("maintenance", "Maintenance", "assets_facilities", "Corrective and planned maintenance."), {
    typicalWorkflowPatternKeys: ["inspection_to_corrective_action"],
  }),
  withMeta(base("facilities", "Facilities", "assets_facilities", "Building and site operations."), {
    industryRelevance: ["property_and_facilities"],
  }),
  withMeta(base("property_operations", "Property operations", "assets_facilities", "Leases, tenants, and work orders."), {
    industryRelevance: ["property_and_facilities"],
  }),
  withMeta(base("inspections", "Inspections", "assets_facilities", "Inspection schedules and findings."), {
    typicalWorkflowPatternKeys: ["inspection_to_corrective_action"],
  }),
  withMeta(base("preventive_maintenance", "Preventive maintenance", "assets_facilities", "PM schedules and compliance."), { status: "CONCEPT" }),
  // Finance operations (no regulated banking claims)
  withMeta(base("budget_requests", "Budget requests", "finance_ops", "Budget proposals and approvals."), {
    typicalWorkflowPatternKeys: ["request_and_approval"],
    recommendedRoleArchetypeKeys: ["finance_specialist", "approver"],
  }),
  withMeta(base("expense_management", "Expense management", "finance_ops", "Expense submission and reimbursement."), { status: "CONCEPT" }),
  withMeta(base("invoice_workflow", "Invoice workflow", "finance_ops", "Invoice review and approval — not payment processing."), {
    typicalWorkflowPatternKeys: ["request_and_approval"],
    securityConsiderations: ["financial_approval_protection", "segregation_of_duties"],
  }),
  withMeta(base("payment_approvals", "Payment approvals", "finance_ops", "Approval gates for outbound payments — advisory workflow only."), {
    status: "CONCEPT",
    securityConsiderations: ["financial_approval_protection"],
  }),
  withMeta(base("cost_tracking", "Cost tracking", "finance_ops", "Project and operational cost capture."), { status: "CONCEPT" }),
  withMeta(base("financial_reporting", "Financial reporting", "finance_ops", "Operational finance dashboards — not core accounting."), {
    status: "CONCEPT",
    recommendedSareaPatternKeys: ["analytics_workspace"],
  }),
  // Governance and compliance
  withMeta(base("policy_management", "Policy management", "governance", "Policy publication and attestation."), { status: "CONCEPT" }),
  withMeta(base("risk_register", "Risk register", "governance", "Risk identification and treatment."), { status: "CONCEPT" }),
  withMeta(base("audit", "Audit", "governance", "Audit planning and findings."), {
    recommendedRoleArchetypeKeys: ["auditor"],
    recommendedSareaPatternKeys: ["compliance_cockpit"],
  }),
  withMeta(base("evidence", "Evidence", "governance", "Evidence collection for controls."), { status: "CONCEPT" }),
  withMeta(base("quality_management", "Quality management", "governance", "Quality checks and CAPA."), { status: "CONCEPT" }),
  withMeta(base("safety_management", "Safety management", "governance", "Safety programs and observations."), {
    industryRelevance: ["construction_and_epc", "manufacturing_and_industrial"],
  }),
  withMeta(base("incident_management", "Incident management", "governance", "Incident intake and resolution."), {
    typicalWorkflowPatternKeys: ["incident_to_resolution"],
  }),
  withMeta(base("regulatory_reporting", "Regulatory reporting", "governance", "Structured regulatory submissions."), { status: "CONCEPT" }),
  // Communication and knowledge
  withMeta(base("documents", "Documents", "communication", "Document storage and versioning."), { status: "PARTIAL" }),
  withMeta(base("knowledge_base", "Knowledge base", "communication", "Internal knowledge articles."), { status: "CONCEPT" }),
  withMeta(base("announcements", "Announcements", "communication", "Org-wide announcements."), { status: "CONCEPT" }),
  withMeta(base("internal_requests", "Internal requests", "communication", "Employee service requests."), {
    typicalWorkflowPatternKeys: ["request_and_approval"],
  }),
  withMeta(base("notifications", "Notifications", "communication", "In-app and email notifications."), { status: "PARTIAL" }),
  withMeta(base("collaboration", "Collaboration", "communication", "Team collaboration surfaces."), { status: "CONCEPT" }),
  // Intelligence and automation
  withMeta(base("analytics", "Analytics", "intelligence", "Cross-domain analytics."), {
    recommendedSareaPatternKeys: ["analytics_workspace", "executive_command_center"],
  }),
  withMeta(base("operational_reporting", "Operational reporting", "intelligence", "Operational KPI dashboards."), { status: "CONCEPT" }),
  withMeta(base("workflow_automation", "Workflow automation", "intelligence", "Rule-based automation."), { status: "CONCEPT" }),
  withMeta(base("decision_support", "Decision support", "intelligence", "Advisory decision aids."), { status: "CONCEPT" }),
  withMeta(base("ai_assistance", "AI assistance", "intelligence", "Copilot-style assistance within authorized actions."), { status: "CONCEPT" }),
  withMeta(base("forecasting", "Forecasting", "intelligence", "Demand and capacity forecasting."), { status: "CONCEPT" }),
] as const;

export const CAPABILITY_GROUPS = [
  "organization_workforce",
  "customer_commercial",
  "projects_delivery",
  "supply_chain",
  "assets_facilities",
  "finance_ops",
  "governance",
  "communication",
  "intelligence",
] as const;
