/**
 * G1 — Target UX sections for every ERP/CEM module page (standard only; not all implemented).
 */

export const ERP_MODULE_UX_STANDARD_SECTIONS = [
  {
    id: "page_header",
    label: "Page header",
    guidance: "Module label, tenant context, engine badge (CEM), and one-line scope.",
  },
  {
    id: "module_purpose",
    label: "Module purpose",
    guidance:
      "Self-describing business purpose from erp-module-catalog — rule-based, no autonomous AI claims.",
  },
  {
    id: "key_stats",
    label: "Key stats",
    guidance: "3–6 stat cards from services or advisory seeded summaries; empty state when none.",
  },
  {
    id: "related_workflows",
    label: "Related workflows",
    guidance: "Links or counts to /[tenant]/workflows filtered by module name where available.",
  },
  {
    id: "related_tasks",
    label: "Related tasks / approvals",
    guidance: "Open task count or link to /[tenant]/tasks; approvals CEM key maps to tasks route.",
  },
  {
    id: "departments_roles",
    label: "Departments & roles",
    guidance: "Pointers to org foundation routes when HR or IAM context matters.",
  },
  {
    id: "cybercrow_trust",
    label: "CyberCrow trust / evidence",
    guidance:
      "Advisory risks and evidence examples; link to CyberCrow suite — not compliance certification.",
  },
  {
    id: "sarea_experience",
    label: "SAREA experience note",
    guidance:
      "Who sees what and density hints; RBAC controls access, SAREA controls presentation only.",
  },
  {
    id: "reports_kpi",
    label: "Reports / KPI readiness",
    guidance: "Signals consumed by Reports/BI; link when bi module enabled.",
  },
  {
    id: "empty_states",
    label: "Empty states",
    guidance: "Explain missing enablement, seed, or discovery step — operator-guided next action.",
  },
  {
    id: "next_actions",
    label: "Next recommended actions",
    guidance: "Integration-ready handoffs via ErpChainLinks or cross-module constants.",
  },
] as const;

/** CyberCrow + SAREA integration standard (G1 Part 7). */
export const ERP_TRUST_EXPERIENCE_STANDARD = {
  cyberCrow: {
    role: "Advisory security, audit, and evidence posture across modules.",
    notClaimed: [
      "Autonomous remediation",
      "Certified compliance",
      "Live production SOC",
      "Payment or billing enforcement",
    ],
    perModuleFields: ["cyberCrowRisks", "evidenceExamples", "auditEvents"] as const,
    suiteRoutes: [
      "/[tenant]/cybercrow/dashboard",
      "/[tenant]/cybercrow/audit-logs",
      "/[tenant]/cybercrow/evidence",
      "/[tenant]/cybercrow/risk",
      "/[tenant]/cybercrow/identity",
    ],
  },
  sarea: {
    role: "Rule-based experience adaptation — navigation density, role mapping, device hints.",
    notClaimed: ["Autonomous AI layout", "Predictive UX without operator config"],
    perModuleFields: ["sareaExperienceHints"] as const,
    separation:
      "RBAC and tenant roles control access; SAREA profiles control how permitted users experience each surface.",
    adminRoutes: ["/sarea/overview", "/sarea/role-mapping", "/sarea/navigation"],
  },
} as const;
