/**
 * Canonical CyberCrow seven-layer security model for informational trust positioning.
 * Informational only — does not grant access or imply certification.
 */

export type CyberCrowSecurityLayer = {
  order: number;
  id: string;
  name: string;
  summary: string;
};

export const CYBERCROW_SECURITY_LAYERS: readonly CyberCrowSecurityLayer[] = [
  {
    order: 1,
    id: "identity-access",
    name: "Identity & Access Security",
    summary:
      "Authentication, authorization boundaries, privileged access, session trust, and least-privilege controls across platform surfaces.",
  },
  {
    order: 2,
    id: "application-workflow",
    name: "Application & Workflow Security",
    summary:
      "Secure application design, workflow gates, change control, and separation between client, business, and internal operator surfaces.",
  },
  {
    order: 3,
    id: "data-protection",
    name: "Data Protection & Cryptography",
    summary:
      "Classification-aware handling, encryption in transit and at rest where applicable, key stewardship, and data minimization.",
  },
  {
    order: 4,
    id: "infrastructure-cloud",
    name: "Infrastructure & Cloud Security",
    summary:
      "Hardened hosting, network boundaries, environment isolation, and cloud configuration aligned to applicable control frameworks.",
  },
  {
    order: 5,
    id: "detection-monitoring",
    name: "Detection, Monitoring & Threat Intelligence",
    summary:
      "Logging, monitoring, anomaly awareness, and advisory threat context — not a substitute for a customer SOC or SIEM.",
  },
  {
    order: 6,
    id: "incident-recovery",
    name: "Incident Response, Recovery & Continuity",
    summary:
      "Incident handling playbooks, backup and recovery expectations, and continuity planning with human approval gates.",
  },
  {
    order: 7,
    id: "governance-assurance",
    name: "Governance, Assurance & Resilience",
    summary:
      "Policy governance, traceability, tenant resilience, and assurance activities designed with reference to recognized standards.",
  },
] as const;

export const CYBERCROW_LAYER_COUNT = CYBERCROW_SECURITY_LAYERS.length;
