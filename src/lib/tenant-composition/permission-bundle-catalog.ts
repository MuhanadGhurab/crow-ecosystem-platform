import type { PermissionBundle } from "./types";

const bundle = (
  key: string,
  displayName: string,
  resource: string,
  actions: PermissionBundle["actions"],
  scope: PermissionBundle["scope"],
): PermissionBundle => ({
  key,
  displayName,
  description: `${displayName} — tenant-scoped permission bundle (advisory).`,
  status: "PLANNED",
  version: "1.0.0",
  provenance: "crow_core",
  resource,
  actions,
  scope,
  conditions: [],
  platformAuthority: false,
});

/** Tenant-scoped permission bundles — never include platform ProCrow authority. */
export const PERMISSION_BUNDLE_CATALOG: readonly PermissionBundle[] = [
  bundle("self_service", "Self service", "assigned_records", ["view", "create", "edit", "submit"], "own"),
  bundle("team_supervisor", "Team supervisor", "team_records", ["view", "assign", "approve", "reject"], "team"),
  bundle("department_operator", "Department operator", "department_records", ["view", "create", "edit", "execute", "complete"], "department"),
  bundle("department_manager", "Department manager", "department_records", ["view", "create", "edit", "assign", "approve", "export"], "department"),
  bundle("tenant_executive_read", "Tenant executive read", "tenant_reports", ["view", "export"], "tenant"),
  bundle("tenant_operations_admin", "Tenant operations admin", "tenant_configuration", ["view", "edit", "administer"], "tenant"),
  bundle("workflow_approver", "Workflow approver", "workflow_items", ["view", "approve", "reject"], "assigned"),
  bundle("field_execution", "Field execution", "field_tasks", ["view", "execute", "complete"], "assigned"),
  bundle("financial_approver", "Financial approver", "financial_requests", ["view", "approve", "reject"], "managed"),
  bundle("security_posture_reader", "Security posture reader", "security_posture", ["view"], "tenant"),
  bundle("security_tenant_admin", "Security tenant admin", "security_configuration", ["view", "edit", "administer"], "tenant"),
  bundle("external_customer", "External customer", "customer_portal", ["view", "create", "submit"], "own"),
  bundle("external_supplier", "External supplier", "supplier_portal", ["view", "submit"], "explicit"),
  bundle("external_contractor", "External contractor", "contractor_tasks", ["view", "execute", "complete"], "assigned"),
  bundle("auditor_read_only", "Auditor read only", "audit_evidence", ["view", "export"], "tenant"),
] as const;

/** Platform roles that must never appear in tenant bundles. */
export const FORBIDDEN_PLATFORM_BUNDLE_KEYS = [
  "platform_admin",
  "implementer",
  "platform_operator",
  "procrow_owner",
] as const;
