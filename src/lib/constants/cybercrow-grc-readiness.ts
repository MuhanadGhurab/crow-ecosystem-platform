/**
 * M1 — GRC & compliance readiness posture (advisory).
 */

export const CYBERCROW_GRC_READINESS_AREAS = [
  {
    key: "policy",
    label: "Policy readiness",
    description: "Internal policies mapped to control domains — advisory templates, not certified policies.",
  },
  {
    key: "controls",
    label: "Control mapping",
    description: "NCA-aware / ISO-aligned control catalog rows linked to evidence readiness.",
  },
  {
    key: "evidence",
    label: "Evidence mapping",
    description: "Artifact sources cataloged — metadata trails, not legal audit packs.",
  },
  {
    key: "audit_trail",
    label: "Audit trail readiness",
    description: "Platform and CyberCrow audit logs available for operator correlation.",
  },
  {
    key: "access_review",
    label: "Access review readiness",
    description: "Role and privileged access review before Go/No-Go.",
  },
  {
    key: "risk_register",
    label: "Risk register readiness",
    description: "Open risks and mitigations documented — rule-based posture, not ML.",
  },
  {
    key: "incident_response",
    label: "Incident response readiness",
    description: "Incident workflow available — human-governed, not autonomous SOC.",
  },
  {
    key: "data_governance",
    label: "Data governance readiness",
    description: "Module and workflow boundaries documented for operational accountability.",
  },
] as const;

export const CYBERCROW_GRC_SAFE_TERMS = {
  compliancePosture: "Compliance readiness posture",
  grcMapping: "GRC mapping",
  evidenceReadiness: "Evidence readiness",
} as const;

export const CYBERCROW_GRC_FORBIDDEN_CLAIMS = [
  "Certified compliant",
  "Official audit passed",
  "Regulator-approved",
  "Legal evidence",
] as const;

export const CYBERCROW_GRC_OPERATOR_CHECKLIST = [
  "Map discovery security preferences to control domains",
  "Close evidence gaps flagged on Evidence console",
  "Review open GRC findings",
  "Confirm incident playbooks are operator-owned",
  "Document exceptions — do not mark production-ready from UI",
] as const;
