import type { ComplianceOverlayDefinition } from "../domain-types";

const overlay = (key: string, displayName: string, concern: string): ComplianceOverlayDefinition => ({
  key,
  displayName,
  description: `Advisory operational control: ${concern}. Does not certify compliance.`,
  status: "PLANNED",
  version: "1.0.0",
  provenance: "crow_core",
  operationalConcern: concern,
  affectedEntityKeys: [],
  affectedWorkflowKeys: [],
  recommendedEvidenceKeys: [],
  recommendedAuditKeys: [],
  recommendedApprovalControls: [],
  recommendedCyberCrowPolicyPackKeys: ["audit_and_evidence"],
  requiresSourceReview: true,
  grantsAuthority: false,
  certificationClaim: false,
});

export const COMPLIANCE_OVERLAY_CATALOG: readonly ComplianceOverlayDefinition[] = [
  { ...overlay("data_privacy", "Data privacy", "Personal data handling boundaries"), affectedEntityKeys: ["customer", "document"], recommendedCyberCrowPolicyPackKeys: ["customer_data_protection", "data_export_control"] },
  { ...overlay("records_retention", "Records retention", "Retention and disposal schedules"), recommendedEvidenceKeys: ["approval_rationale"] },
  { ...overlay("financial_control", "Financial control", "Operational finance approvals — not banking certification"), affectedWorkflowKeys: ["request_and_approval"], recommendedApprovalControls: ["segregation_of_duties"] },
  { ...overlay("segregation_of_duties", "Segregation of duties", "Separate requester and approver"), recommendedApprovalControls: ["dual_approval"] },
  { ...overlay("occupational_safety", "Occupational safety", "Workplace safety programs"), affectedWorkflowKeys: ["incident_command"] },
  { ...overlay("quality_management", "Quality management", "Quality gates and CAPA"), affectedWorkflowKeys: ["inspection_and_corrective_action"] },
  { ...overlay("vendor_risk", "Vendor risk", "Third-party risk review"), affectedEntityKeys: ["supplier"], recommendedCyberCrowPolicyPackKeys: ["vendor_access"] },
  { ...overlay("contractor_governance", "Contractor governance", "Contractor access windows"), recommendedCyberCrowPolicyPackKeys: ["contractor_access"] },
  { ...overlay("sensitive_personnel_data", "Sensitive personnel data", "HR data protection"), affectedEntityKeys: ["document"], recommendedCyberCrowPolicyPackKeys: ["sensitive_hr_data"] },
  { ...overlay("customer_data_protection", "Customer data protection", "Customer PII controls"), affectedEntityKeys: ["customer", "case"] },
  { ...overlay("legal_confidentiality", "Legal confidentiality", "Matter confidentiality — requires legal review"), affectedEntityKeys: ["legal_matter", "conflict_check"], affectedWorkflowKeys: ["matter_intake_and_conflict_check"] },
  { ...overlay("research_evidence_integrity", "Research evidence integrity", "Sample chain of custody"), affectedEntityKeys: ["research_sample_record"], recommendedEvidenceKeys: ["lab_notebook", "peer_review_record"] },
  { ...overlay("content_rights_and_licensing", "Content rights and licensing", "Rights clearance tracking"), affectedEntityKeys: ["media_asset", "rights_clearance"], affectedWorkflowKeys: ["rights_clearance"] },
  { ...overlay("public_sector_controls", "Public sector controls", "Public service operational controls — requires compliance review"), affectedWorkflowKeys: ["case_resolution"] },
  { ...overlay("high_risk_asset_operations", "High risk asset operations", "Critical asset change control"), affectedEntityKeys: ["asset"] },
  { ...overlay("regulated_export_review", "Regulated export review", "Export review workflow — requires legal review"), status: "CONCEPT" },
] as const;
