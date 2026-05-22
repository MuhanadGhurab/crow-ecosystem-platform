/** Optional add-ons — not core homepage promise; quoted in blueprint commercial */

export const EXTRA_SERVICES = [
  {
    key: "ai-workflow-assist",
    name: "AI workflow assist",
    summary: "Suggested approvals, task routing, and operational nudges inside CEM workflows.",
    entity: "cem" as const,
  },
  {
    key: "ai-doc-intelligence",
    name: "AI document intelligence",
    summary: "Classification and extraction for contracts and invoices — human review required.",
    entity: "cem" as const,
  },
  {
    key: "ai-executive-insights",
    name: "AI executive insights",
    summary: "Narrative summaries on BI and compliance posture for leadership dashboards.",
    entity: "sarea" as const,
  },
  {
    key: "ai-discovery-assist",
    name: "AI discovery assist",
    summary: "Accelerated org templates during Discovery — validated by your Crow team.",
    entity: "cem" as const,
  },
  {
    key: "entra-accelerator",
    name: "Microsoft Entra accelerator",
    summary: "Guided SSO and group mapping with CyberCrow identity baselines.",
    entity: "cybercrow" as const,
  },
  {
    key: "industry-pack",
    name: "Industry module pack",
    summary: "Pre-configured CEM modules and workflows for your sector template.",
    entity: "cem" as const,
  },
] as const;
