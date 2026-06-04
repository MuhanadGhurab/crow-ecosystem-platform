/**
 * M1 — CyberCrow tenant trust readiness (advisory only).
 */

export type CyberCrowTenantTrustStatus =
  | "not_started"
  | "needs_review"
  | "in_review"
  | "ready_for_go_no_go"
  | "blocked"
  | "advisory_ready";

export type CyberCrowIdentityReadiness = {
  identityModel: string;
  tenantDomain: string;
  authProviderMode: string;
  entraReadiness: string;
  userSource: string;
  roleSource: string;
  accessReviewStatus: string;
  mfaPosture: string;
  privilegedAccessPosture: string;
  notes: string | null;
};

export type CyberCrowGrcReadiness = {
  policyMapping: string;
  controlMapping: string;
  evidenceMapping: string;
  riskRegisterReadiness: string;
  auditTrailReadiness: string;
  compliancePosture: string;
  disclaimers: readonly string[];
};

export type CyberCrowRiskReadiness = {
  riskLevel: string;
  mainRisks: string[];
  mitigations: string[];
  openQuestions: string[];
  recommendedActions: string[];
};

export type CyberCrowEvidenceReadiness = {
  evidenceSources: string[];
  missingEvidence: string[];
  operatorChecklist: string[];
  readinessNotes: string;
};

export type CyberCrowAccessReviewReadiness = {
  status: string;
  checklist: string[];
  privilegedRolesNeedReview: boolean;
  notes: string | null;
};

export type CyberCrowTenantTrustSnapshot = {
  tenantSlug: string | null;
  tenantName: string;
  requestId: string | null;
  blueprintId: string | null;
  trustStatus: CyberCrowTenantTrustStatus;
  identity: CyberCrowIdentityReadiness;
  grc: CyberCrowGrcReadiness;
  risk: CyberCrowRiskReadiness;
  evidence: CyberCrowEvidenceReadiness;
  accessReview: CyberCrowAccessReviewReadiness;
  recommendedActions: string[];
  blockers: string[];
  warnings: string[];
  nextProCrowAction: string;
  sareaDependencies: string[];
  goNoGoDependencies: string[];
  cemRelationshipNote: string;
  sareaRelationshipNote: string;
  disclaimers: readonly string[];
};

export const CYBERCROW_TENANT_TRUST_DISCLAIMERS = [
  "Advisory trust readiness only — operator-reviewed before Go/No-Go.",
  "Not certified compliance, legal audit evidence, or regulator attestation.",
  "Not a SIEM replacement and not autonomous detection or remediation.",
  "Microsoft Entra ID readiness is mapping only — no live Graph sync unless configured later.",
] as const;

export const CYBERCROW_CEM_RELATIONSHIP_NOTE =
  "CEM runs day-to-day operations (users, roles, modules, workflows, tasks, reports). CyberCrow reviews trust posture around those operations — identity, access review, evidence, and risk." as const;

export const CYBERCROW_SAREA_RELATIONSHIP_NOTE =
  "CyberCrow validates trust and access boundaries; SAREA uses those boundaries to shape role-based experience. RBAC controls access — SAREA does not enforce it." as const;
