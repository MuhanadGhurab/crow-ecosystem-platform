import type { CyberCrowPolicyPack } from "./types";

const pack = (
  key: string,
  displayName: string,
  purpose: string,
  tier: CyberCrowPolicyPack["recommendedEntitlementTier"] = "crow_shield",
): CyberCrowPolicyPack => ({
  key,
  displayName,
  description: purpose,
  status: "PLANNED",
  version: "1.0.0",
  provenance: "crow_core",
  purpose,
  applicableCapabilityKeys: [],
  protectedResources: [],
  requiredTrustSignals: ["authenticated_session"],
  auditRequirements: ["access_logged"],
  recommendedEntitlementTier: tier,
});

/** Tenant-scoped CyberCrow policy packs — not separate users or tenants. */
export const CYBERCROW_POLICY_PACK_CATALOG: readonly CyberCrowPolicyPack[] = [
  { ...pack("baseline_identity_trust", "Baseline identity trust", "Foundation identity and session trust.", "crow_shield"), status: "PARTIAL", applicableCapabilityKeys: ["*"] },
  { ...pack("privileged_access", "Privileged access", "Elevated access monitoring.", "crow_sentinel"), protectedResources: ["admin_configuration"] },
  { ...pack("financial_approval_protection", "Financial approval protection", "Segregation of duties for financial approvals.", "crow_sentinel"), applicableCapabilityKeys: ["invoice_workflow", "budget_requests", "payment_approvals"] },
  { ...pack("sensitive_hr_data", "Sensitive HR data", "HR data access controls.", "crow_sentinel"), applicableCapabilityKeys: ["employee_lifecycle", "workforce_directory"] },
  { ...pack("customer_data_protection", "Customer data protection", "Customer PII protection.", "crow_sentinel"), applicableCapabilityKeys: ["crm", "customer_portal", "case_management"] },
  { ...pack("field_device_trust", "Field device trust", "Mobile device posture checks.", "crow_shield"), applicableCapabilityKeys: ["field_service", "dispatch", "delivery_management"] },
  { ...pack("vendor_access", "Vendor access", "Supplier portal access boundaries.", "crow_shield"), applicableCapabilityKeys: ["vendor_management", "procurement"] },
  { ...pack("contractor_access", "Contractor access", "Limited contractor access windows.", "crow_shield"), applicableCapabilityKeys: ["contractor_management"] },
  { ...pack("external_portal_protection", "External portal protection", "Hardening for external portals.", "crow_sentinel"), applicableCapabilityKeys: ["customer_portal"] },
  { ...pack("high_risk_workflow_approval", "High risk workflow approval", "Step-up for sensitive approvals.", "crow_fortress") },
  { ...pack("audit_and_evidence", "Audit and evidence", "Immutable audit trails.", "crow_sentinel"), applicableCapabilityKeys: ["audit", "evidence"] },
  { ...pack("incident_escalation", "Incident escalation", "Incident response escalation paths.", "crow_fortress"), applicableCapabilityKeys: ["incident_management"] },
  { ...pack("data_export_control", "Data export control", "Export approval and logging.", "crow_sentinel") },
  { ...pack("branch_access_control", "Branch access control", "Branch-scoped data boundaries.", "crow_shield"), applicableCapabilityKeys: ["organization_structure"] },
  { ...pack("session_risk", "Session risk", "Adaptive session risk signals.", "crow_sentinel") },
] as const;
