/**
 * G1 — ERP module maturity model (honest, non-autonomous).
 * Levels describe operator-visible depth — not production launch readiness.
 */

export const ERP_MODULE_MATURITY_LEVELS = [
  {
    level: 1,
    id: "concept_placeholder",
    label: "Concept / placeholder",
    description:
      "Catalog or advisory copy only; no dedicated tenant route or runtime lists.",
  },
  {
    level: 2,
    id: "readiness_page",
    label: "Readiness page",
    description:
      "Module purpose and enablement guidance; may show empty state when not enabled on tenant.",
  },
  {
    level: 3,
    id: "operational_list",
    label: "Operational list",
    description:
      "Read-only or CRUD lists backed by services or seeded demo data; limited cross-links.",
  },
  {
    level: 4,
    id: "workflow_linked",
    label: "Workflow-linked",
    description:
      "Surfaces tie to workflows, tasks, or chain navigation; operator-guided handoffs.",
  },
  {
    level: 5,
    id: "evidence_report_linked",
    label: "Evidence / report-linked",
    description:
      "KPIs, reports, or CyberCrow evidence hooks visible from the module context.",
  },
  {
    level: 6,
    id: "fully_integrated_runtime",
    label: "Fully integrated runtime",
    description:
      "Sector hub, chain links, ops intelligence, and cross-module stats on reference tenants (e.g. MEEM).",
  },
] as const;

export type ErpModuleMaturityId =
  (typeof ERP_MODULE_MATURITY_LEVELS)[number]["id"];

export function maturityLevelNumber(id: ErpModuleMaturityId): number {
  return ERP_MODULE_MATURITY_LEVELS.find((l) => l.id === id)?.level ?? 0;
}
