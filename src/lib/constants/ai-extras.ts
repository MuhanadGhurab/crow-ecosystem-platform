/** AI capability add-ons — discovery experience step; priced below standalone AI tools */

export const AI_EXTRAS = [
  {
    key: "route_optimization",
    nameEn: "Route optimization",
    monthlySar: 790,
    descriptionEn: "Fleet routing and hub load balancing on logistics workflows.",
  },
  {
    key: "demand_forecast",
    nameEn: "Demand forecast",
    monthlySar: 690,
    descriptionEn: "Seasonal demand signals tied to inventory and procurement modules.",
  },
  {
    key: "anomaly_detection",
    nameEn: "Shipment anomaly detection",
    monthlySar: 590,
    descriptionEn: "SLA breach and exception detection on shipment events.",
  },
  {
    key: "doc_intelligence",
    nameEn: "Document intelligence",
    monthlySar: 520,
    descriptionEn: "Contract and invoice extraction with human-in-the-loop review.",
  },
  {
    key: "executive_narratives",
    nameEn: "Executive AI narratives",
    monthlySar: 480,
    descriptionEn: "Leadership summaries on BI and compliance posture (SAREA).",
  },
] as const;

export type AiExtraKey = (typeof AI_EXTRAS)[number]["key"];

export function aiExtrasMonthlySar(keys?: string[] | null): number {
  if (!keys?.length) return 0;
  return keys.reduce((sum, key) => {
    const row = AI_EXTRAS.find((e) => e.key === key);
    return sum + (row?.monthlySar ?? 0);
  }, 0);
}
