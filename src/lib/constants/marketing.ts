/** Public marketing copy — clients, industries, case studies */

export const MARKETING_CLIENTS = [
  {
    name: "Al Noor Holdings",
    industry: "Conglomerate",
    region: "Riyadh · KSA",
    engines: ["CEM", "CyberCrow", "SAREA"],
  },
  {
    name: "Riyadh Logistics Co.",
    industry: "Logistics",
    region: "Eastern Province · KSA",
    engines: ["CEM", "CyberCrow"],
  },
  {
    name: "Gulf Health Network",
    industry: "Healthcare",
    region: "GCC",
    engines: ["CEM", "SAREA"],
  },
  {
    name: "Najd Retail Group",
    industry: "Retail",
    region: "Central · KSA",
    engines: ["CEM", "CyberCrow", "SAREA"],
  },
] as const;

export const MARKETING_INDUSTRIES = [
  {
    key: "logistics",
    title: "Logistics & supply chain",
    summary:
      "Multi-branch CEM with warehouse and logistics modules, CyberCrow Sentinel posture, and SAREA frontline density.",
    entity: "cem" as const,
  },
  {
    key: "retail",
    title: "Retail & franchise",
    summary: "Growth-tier blueprints with CRM, inventory, franchise workflows, and NCA-aligned audit trails.",
    entity: "cem" as const,
  },
  {
    key: "healthcare",
    title: "Healthcare & regulated",
    summary:
      "Enterprise tier with Entra ID SSO, Fortress security package, executive SAREA personas, and governed go-live.",
    entity: "cybercrow" as const,
  },
  {
    key: "holding",
    title: "Holding & conglomerate",
    summary:
      "Implementation intake through discovery, blueprint pricing, and phased tenant provisioning across subsidiaries.",
    entity: "sarea" as const,
  },
  {
    key: "public",
    title: "Public sector & semi-government",
    summary: "NCA ECC alignment, auditor-ready CyberCrow exports, and role-appropriate adaptive dashboards.",
    entity: "cybercrow" as const,
  },
  {
    key: "energy",
    title: "Energy & industrial",
    summary: "Operational risk context on tenant dashboards with CyberCrow GRC and compliance baselines.",
    entity: "cem" as const,
  },
] as const;
