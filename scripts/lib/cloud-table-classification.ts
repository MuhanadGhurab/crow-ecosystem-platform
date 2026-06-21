/**
 * CLOUD.1B — public schema classification for RLS rollout.
 * Hosted `pg_tables` count verified 2026-06-21: **107** (CLOUD.0 audit cited 97 RLS-audited posture).
 */
export type CloudTableAccessClass =
  | "SERVER_ONLY"
  | "PUBLIC_READ_ONLY"
  | "AUTHENTICATED_SELF"
  | "REQUEST_OWNER"
  | "CLIENT_ORGANIZATION_SCOPED"
  | "TENANT_SCOPED"
  | "PROCROW_INTERNAL"
  | "CYBERCROW_INTERNAL"
  | "REFERENCE_CONFIGURATION"
  | "MIGRATION_INTERNAL"
  | "UNKNOWN";

export type CloudTableClassification = {
  table: string;
  accessClass: CloudTableAccessClass;
  rlsEnabledHosted: boolean;
  shouldRemainExposed: boolean;
  intendedRoles: string[];
  ownershipPredicate: string;
  rlsRequired: boolean;
  grantRequirement: string;
  riskIfImmediatelyDenied: string;
};

/** Hosted RLS state captured 2026-06-21 (10 enabled, 87 disabled). */
const RLS_ENABLED = new Set([
  "account_consent_preferences",
  "account_legal_acceptances",
  "email_verification_challenges",
  "legal_document_versions",
  "legal_documents",
  "phone_verification_challenges",
  "platform_account_audit_events",
  "platform_account_profiles",
  "platform_accounts",
  "platform_provider_identities",
]);

function row(
  table: string,
  accessClass: CloudTableAccessClass,
  opts: Partial<Omit<CloudTableClassification, "table" | "accessClass">> = {}
): CloudTableClassification {
  return {
    table,
    accessClass,
    rlsEnabledHosted: RLS_ENABLED.has(table),
    shouldRemainExposed: opts.shouldRemainExposed ?? false,
    intendedRoles: opts.intendedRoles ?? ["service_role"],
    ownershipPredicate: opts.ownershipPredicate ?? "server-side Prisma authorization",
    rlsRequired: opts.rlsRequired ?? true,
    grantRequirement: opts.grantRequirement ?? "REVOKE anon/authenticated; deny-by-default RLS",
    riskIfImmediatelyDenied:
      opts.riskIfImmediatelyDenied ??
      "None for Crow app (Prisma direct); PostgREST anonymous access removed",
  };
}

export const CLOUD_PUBLIC_TABLE_CLASSIFICATION: CloudTableClassification[] = [
  row("_prisma_migrations", "MIGRATION_INTERNAL", {
    shouldRemainExposed: false,
    grantRequirement: "REVOKE all client roles",
    riskIfImmediatelyDenied: "Low — not used by app runtime",
  }),
  row("access_attempts", "CYBERCROW_INTERNAL"),
  row("account_consent_preferences", "AUTHENTICATED_SELF", {
    rlsEnabledHosted: true,
    shouldRemainExposed: false,
    intendedRoles: ["service_role"],
    grantRequirement: "Already REVOKED + RLS (C3 hardening)",
  }),
  row("account_legal_acceptances", "AUTHENTICATED_SELF", {
    rlsEnabledHosted: true,
    shouldRemainExposed: false,
    grantRequirement: "Already REVOKED + RLS (C3 hardening)",
  }),
  row("adaptive_ui_rules", "TENANT_SCOPED", { ownershipPredicate: "tenantId" }),
  row("api_keys", "PROCROW_INTERNAL"),
  row("approvals", "TENANT_SCOPED", { ownershipPredicate: "tenantId" }),
  row("billing_records", "TENANT_SCOPED", { ownershipPredicate: "tenantId" }),
  row("blueprint_approvals", "TENANT_SCOPED", { ownershipPredicate: "blueprintVersion.tenantId" }),
  row("blueprint_change_requests", "TENANT_SCOPED"),
  row("blueprint_configuration_proposals", "TENANT_SCOPED"),
  row("blueprint_go_live_checklists", "TENANT_SCOPED"),
  row("blueprint_integrations", "TENANT_SCOPED"),
  row("blueprint_modules", "TENANT_SCOPED"),
  row("blueprint_permissions", "TENANT_SCOPED"),
  row("blueprint_roles", "TENANT_SCOPED"),
  row("blueprint_sarea_profiles", "TENANT_SCOPED"),
  row("blueprint_security_baselines", "TENANT_SCOPED"),
  row("blueprint_trace_events", "TENANT_SCOPED"),
  row("blueprint_workflows", "TENANT_SCOPED"),
  row("branches", "TENANT_SCOPED", { ownershipPredicate: "organizationId" }),
  row("client_organization_members", "CLIENT_ORGANIZATION_SCOPED", {
    ownershipPredicate: "organizationId + membership",
  }),
  row("client_organization_request_links", "CLIENT_ORGANIZATION_SCOPED"),
  row("client_organizations", "CLIENT_ORGANIZATION_SCOPED"),
  row("compliance_controls", "CYBERCROW_INTERNAL"),
  row("compliance_evidence", "CYBERCROW_INTERNAL"),
  row("crm_accounts", "TENANT_SCOPED", { ownershipPredicate: "tenantId" }),
  row("crm_contacts", "TENANT_SCOPED", { ownershipPredicate: "tenantId" }),
  row("cybercrow_audit_logs", "CYBERCROW_INTERNAL"),
  row("dashboard_layouts", "TENANT_SCOPED"),
  row("departments", "TENANT_SCOPED", { ownershipPredicate: "tenantId" }),
  row("device_experience_rules", "TENANT_SCOPED"),
  row("device_trust_records", "CYBERCROW_INTERNAL"),
  row("discovery_answers", "REQUEST_OWNER", { ownershipPredicate: "discoveryProfile.requestId" }),
  row("discovery_branches", "REQUEST_OWNER"),
  row("discovery_departments", "REQUEST_OWNER"),
  row("discovery_experience_requirements", "REQUEST_OWNER"),
  row("discovery_integrations", "REQUEST_OWNER"),
  row("discovery_org_intelligence", "REQUEST_OWNER"),
  row("discovery_profiles", "REQUEST_OWNER"),
  row("discovery_roles", "REQUEST_OWNER"),
  row("discovery_security_requirements", "REQUEST_OWNER"),
  row("discovery_workflows", "REQUEST_OWNER"),
  row("documents", "TENANT_SCOPED"),
  row("email_verification_challenges", "AUTHENTICATED_SELF", {
    rlsEnabledHosted: true,
    grantRequirement: "Already REVOKED + RLS (C3 hardening)",
  }),
  row("enterprise_blueprint_versions", "TENANT_SCOPED"),
  row("enterprise_blueprints", "TENANT_SCOPED"),
  row("entra_id_configs", "PROCROW_INTERNAL"),
  row("grc_findings", "CYBERCROW_INTERNAL"),
  row("hr_employees", "TENANT_SCOPED", { ownershipPredicate: "tenantId" }),
  row("identity_providers", "PROCROW_INTERNAL"),
  row("implementation_requests", "REQUEST_OWNER", {
    ownershipPredicate: "submittedByUserId OR authoritative client access",
    riskIfImmediatelyDenied: "HIGH if PostgREST used; NONE for Prisma server routes",
  }),
  row("incidents", "CYBERCROW_INTERNAL"),
  row("integration_connections", "TENANT_SCOPED"),
  row("legal_document_versions", "REFERENCE_CONFIGURATION", {
    rlsEnabledHosted: true,
    shouldRemainExposed: false,
    intendedRoles: ["service_role", "authenticated_read_via_server"],
    grantRequirement: "REVOKE client roles; publication via server only",
  }),
  row("legal_documents", "REFERENCE_CONFIGURATION", {
    rlsEnabledHosted: true,
    shouldRemainExposed: false,
  }),
  row("login_events", "CYBERCROW_INTERNAL"),
  row("module_limits", "REFERENCE_CONFIGURATION", {
    shouldRemainExposed: false,
    rlsRequired: false,
  }),
  row("navigation_profiles", "TENANT_SCOPED"),
  row("organization_modules", "TENANT_SCOPED"),
  row("organizations", "CLIENT_ORGANIZATION_SCOPED"),
  row("permissions", "REFERENCE_CONFIGURATION"),
  row("phone_verification_challenges", "AUTHENTICATED_SELF", {
    rlsEnabledHosted: true,
    grantRequirement: "Already REVOKED + RLS (C3 hardening)",
  }),
  row("platform_account_audit_events", "SERVER_ONLY", {
    rlsEnabledHosted: true,
    grantRequirement: "Already REVOKED + RLS (C3 hardening)",
  }),
  row("platform_account_profiles", "AUTHENTICATED_SELF", {
    rlsEnabledHosted: true,
    grantRequirement: "Already REVOKED + RLS (C3 hardening)",
  }),
  row("platform_accounts", "AUTHENTICATED_SELF", {
    rlsEnabledHosted: true,
    grantRequirement: "Already REVOKED + RLS (C3 hardening)",
  }),
  row("platform_notifications", "PROCROW_INTERNAL"),
  row("platform_provider_identities", "AUTHENTICATED_SELF", {
    rlsEnabledHosted: true,
    grantRequirement: "Already REVOKED + RLS (C3 hardening)",
  }),
  row("profiles", "AUTHENTICATED_SELF", { ownershipPredicate: "userId" }),
  row("reports", "TENANT_SCOPED"),
  row("request_contacts", "REQUEST_OWNER", { ownershipPredicate: "requestId" }),
  row("requested_modules", "REQUEST_OWNER"),
  row("requested_security_packages", "REQUEST_OWNER"),
  row("requested_subscription_plans", "REQUEST_OWNER"),
  row("risk_scores", "CYBERCROW_INTERNAL"),
  row("roi_assumption_revisions", "TENANT_SCOPED"),
  row("roi_assumptions", "TENANT_SCOPED"),
  row("roi_snapshots", "TENANT_SCOPED"),
  row("role_experience_maps", "TENANT_SCOPED"),
  row("role_permissions", "TENANT_SCOPED"),
  row("roles", "TENANT_SCOPED"),
  row("sarea_experience_profiles", "TENANT_SCOPED"),
  row("sector_templates", "REFERENCE_CONFIGURATION", {
    shouldRemainExposed: false,
    rlsRequired: false,
    riskIfImmediatelyDenied: "Low — loaded server-side if needed",
  }),
  row("security_events", "CYBERCROW_INTERNAL"),
  row("session_events", "CYBERCROW_INTERNAL"),
  row("sow_documents", "TENANT_SCOPED"),
  row("sow_sections", "TENANT_SCOPED"),
  row("sow_versions", "TENANT_SCOPED"),
  row("sso_configs", "PROCROW_INTERNAL"),
  row("subscription_plans", "PUBLIC_READ_ONLY", {
    shouldRemainExposed: false,
    rlsRequired: false,
    intendedRoles: ["service_role"],
    riskIfImmediatelyDenied: "Low — marketing/pricing via server",
  }),
  row("sync_jobs", "PROCROW_INTERNAL"),
  row("tasks", "TENANT_SCOPED", { ownershipPredicate: "tenantId" }),
  row("tenant_finance_entries", "TENANT_SCOPED", { ownershipPredicate: "tenantId" }),
  row("tenant_inventory_items", "TENANT_SCOPED", { ownershipPredicate: "tenantId" }),
  row("tenant_membership_invites", "TENANT_SCOPED", { ownershipPredicate: "tenantId" }),
  row("tenant_memberships", "TENANT_SCOPED", {
    ownershipPredicate: "tenantId + supabaseUserId",
    riskIfImmediatelyDenied: "HIGH if PostgREST used; NONE for Prisma server routes",
  }),
  row("tenant_purchase_requests", "TENANT_SCOPED"),
  row("tenant_sales_opportunities", "TENANT_SCOPED"),
  row("tenant_subscriptions", "TENANT_SCOPED"),
  row("tenant_warehouse_locations", "TENANT_SCOPED"),
  row("tenants", "TENANT_SCOPED", { ownershipPredicate: "tenantId / membership" }),
  row("usage_metrics", "PROCROW_INTERNAL"),
  row("user_roles", "TENANT_SCOPED"),
  row("webhook_events", "PROCROW_INTERNAL"),
  row("widget_rules", "TENANT_SCOPED"),
  row("workflow_steps", "TENANT_SCOPED"),
  row("workflows", "TENANT_SCOPED"),
];

export function assertCompleteTableClassification(expectedCount = 107): void {
  if (CLOUD_PUBLIC_TABLE_CLASSIFICATION.length !== expectedCount) {
    throw new Error(
      `Expected ${expectedCount} table classifications, got ${CLOUD_PUBLIC_TABLE_CLASSIFICATION.length}`
    );
  }
  const names = CLOUD_PUBLIC_TABLE_CLASSIFICATION.map((t) => t.table);
  const dup = names.filter((n, i) => names.indexOf(n) !== i);
  if (dup.length) {
    throw new Error(`Duplicate table classifications: ${dup.join(", ")}`);
  }
}

export function classificationSummary(): Record<CloudTableAccessClass, number> {
  const summary = {} as Record<CloudTableAccessClass, number>;
  for (const entry of CLOUD_PUBLIC_TABLE_CLASSIFICATION) {
    summary[entry.accessClass] = (summary[entry.accessClass] ?? 0) + 1;
  }
  return summary;
}
