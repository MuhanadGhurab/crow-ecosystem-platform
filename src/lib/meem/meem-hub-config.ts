import type { LogisticsAiFeature } from "@/lib/erp/industry-packs/logistics";
import {
  LOGISTICS_CRM_FEATURES,
  LOGISTICS_CRM_PIPELINE,
  LOGISTICS_FINANCE_FEATURES,
  LOGISTICS_FINANCE_PIPELINE,
  LOGISTICS_HR_FEATURES,
  LOGISTICS_HR_PIPELINE,
  LOGISTICS_INVENTORY_FEATURES,
  LOGISTICS_INVENTORY_PIPELINE,
  LOGISTICS_LOGISTICS_FEATURES,
  LOGISTICS_LOGISTICS_PIPELINE,
  LOGISTICS_PROCUREMENT_FEATURES,
  LOGISTICS_PROCUREMENT_PIPELINE,
  LOGISTICS_REPORTS_FEATURES,
  LOGISTICS_REPORTS_PIPELINE,
  LOGISTICS_SALES_FEATURES,
  LOGISTICS_SALES_PIPELINE,
  LOGISTICS_WAREHOUSE_FEATURES,
  LOGISTICS_WAREHOUSE_PIPELINE,
} from "@/lib/erp/industry-packs/logistics";
import { routes } from "@/lib/routes";

export type MeemHubModuleKey =
  | "sales"
  | "inventory"
  | "warehouse"
  | "logistics"
  | "finance"
  | "procurement"
  | "reports"
  | "crm"
  | "hr";

export type MeemHubConfig = {
  opsTitle: string;
  opsDescription: string;
  aiSectionTitle: string;
  pipelineTitle: string;
  features: readonly LogisticsAiFeature[];
  pipeline: readonly string[];
  defaultAiKeys: readonly string[];
  links: (slug: string) => { href: string; label: string }[];
};

const MEEM_HUB_CONFIG: Record<MeemHubModuleKey, MeemHubConfig> = {
  sales: {
    opsTitle: "Freight sales hub",
    opsDescription:
      "freight quotes, B2B distribution contracts, and shipment sales lines tied to dispatch, OCR, and AR billing on live CEM workflows",
    aiSectionTitle: "Sales intelligence",
    pipelineTitle: "Quote-to-dispatch pipeline",
    features: LOGISTICS_SALES_FEATURES,
    pipeline: LOGISTICS_SALES_PIPELINE,
    defaultAiKeys: ["doc_intelligence", "demand_forecast", "anomaly_detection"],
    links: (slug) => {
      const r = routes.tenant(slug);
      return [
        { href: r.workflows, label: "Shipment dispatch workflow" },
        { href: r.logistics, label: "Logistics hub" },
        { href: r.crm, label: "CRM accounts" },
        { href: r.finance, label: "Finance & AR" },
      ];
    },
  },
  inventory: {
    opsTitle: "Stock & hubs",
    opsDescription:
      "pallets, cold-chain consumables, fleet spares, and packaging across hub DCs — synced with warehouse intake and AI demand forecast",
    aiSectionTitle: "Inventory intelligence",
    pipelineTitle: "Stock replenishment pipeline",
    features: LOGISTICS_INVENTORY_FEATURES,
    pipeline: LOGISTICS_INVENTORY_PIPELINE,
    defaultAiKeys: ["demand_forecast", "anomaly_detection", "doc_intelligence"],
    links: (slug) => {
      const r = routes.tenant(slug);
      return [
        { href: r.warehouse, label: "Warehouse" },
        { href: r.logistics, label: "Logistics hub" },
        { href: r.procurement, label: "Procurement" },
        { href: r.sales, label: "Sales & quotes" },
      ];
    },
  },
  warehouse: {
    opsTitle: "Hubs & zones",
    opsDescription:
      "Riyadh DC intake, Jeddah cold room, Dammam pack lanes, and outbound staging tied to OCR intake and dispatch workflows",
    aiSectionTitle: "Warehouse intelligence",
    pipelineTitle: "Intake-to-dispatch pipeline",
    features: LOGISTICS_WAREHOUSE_FEATURES,
    pipeline: LOGISTICS_WAREHOUSE_PIPELINE,
    defaultAiKeys: ["doc_intelligence", "anomaly_detection", "demand_forecast"],
    links: (slug) => {
      const r = routes.tenant(slug);
      return [
        { href: r.inventory, label: "Inventory" },
        { href: r.logistics, label: "Logistics hub" },
        { href: r.workflows, label: "Warehouse intake" },
        { href: `${r.cybercrow.auditLogs}?category=logistics`, label: "Ops audit trail" },
      ];
    },
  },
  logistics: {
    opsTitle: "Operations hub",
    opsDescription:
      "multi-hub logistics with OCR document intake and AI-assisted dispatch on live CEM workflows",
    aiSectionTitle: "OCR & AI capabilities",
    pipelineTitle: "Shipment pipeline",
    features: LOGISTICS_LOGISTICS_FEATURES,
    pipeline: LOGISTICS_LOGISTICS_PIPELINE,
    defaultAiKeys: ["route_optimization", "doc_intelligence", "demand_forecast", "anomaly_detection"],
    links: (slug) => {
      const r = routes.tenant(slug);
      return [
        { href: r.workflows, label: "View workflows" },
        { href: `${r.cybercrow.auditLogs}?category=logistics`, label: "Logistics audit trail" },
        { href: r.warehouse, label: "Warehouse" },
        { href: r.inventory, label: "Inventory" },
      ];
    },
  },
  finance: {
    opsTitle: "Freight billing hub",
    opsDescription:
      "AR from freight quotes, AP for fleet and consumables, and payment clearance tied to sales and logistics reference codes on live CEM workflows",
    aiSectionTitle: "Finance intelligence",
    pipelineTitle: "Freight billing pipeline",
    features: LOGISTICS_FINANCE_FEATURES,
    pipeline: LOGISTICS_FINANCE_PIPELINE,
    defaultAiKeys: ["doc_intelligence", "demand_forecast", "anomaly_detection"],
    links: (slug) => {
      const r = routes.tenant(slug);
      return [
        { href: r.sales, label: "Sales & AR" },
        { href: r.logistics, label: "Logistics hub" },
        { href: r.workflows, label: "View workflows" },
        { href: r.procurement, label: "Procurement & AP" },
        { href: `${r.cybercrow.auditLogs}?category=logistics`, label: "Billing audit trail" },
      ];
    },
  },
  procurement: {
    opsTitle: "Purchase operations hub",
    opsDescription:
      "AI-suggested reorder PRs from low-stock SKUs, vendor invoice OCR, and AP hand-off to finance on approved spend",
    aiSectionTitle: "Procurement intelligence",
    pipelineTitle: "Reorder-to-AP pipeline",
    features: LOGISTICS_PROCUREMENT_FEATURES,
    pipeline: LOGISTICS_PROCUREMENT_PIPELINE,
    defaultAiKeys: ["demand_forecast", "doc_intelligence", "anomaly_detection"],
    links: (slug) => {
      const r = routes.tenant(slug);
      return [
        { href: r.inventory, label: "Inventory & low stock" },
        { href: r.finance, label: "Finance & AP" },
        { href: r.warehouse, label: "Warehouse intake" },
        { href: r.workflows, label: "Workflows" },
      ];
    },
  },
  reports: {
    opsTitle: "ERP insights hub",
    opsDescription:
      "cross-module KPIs, executive AI narratives, and anomaly roll-ups from sales, inventory, finance, and workflows — SAREA adapts the view by persona",
    aiSectionTitle: "BI & narrative intelligence",
    pipelineTitle: "Insight delivery pipeline",
    features: LOGISTICS_REPORTS_FEATURES,
    pipeline: LOGISTICS_REPORTS_PIPELINE,
    defaultAiKeys: ["executive_narratives", "demand_forecast", "anomaly_detection"],
    links: (slug) => {
      const r = routes.tenant(slug);
      return [
        { href: r.sales, label: "Sales pipeline" },
        { href: r.finance, label: "Finance & AR" },
        { href: r.logistics, label: "Logistics hub" },
        { href: r.dashboard, label: "SAREA dashboard" },
      ];
    },
  },
  crm: {
    opsTitle: "B2B relationships hub",
    opsDescription:
      "freight customer accounts, contract intelligence, and pipeline linkage for multi-hub logistics sales",
    aiSectionTitle: "CRM intelligence",
    pipelineTitle: "Account-to-quote pipeline",
    features: LOGISTICS_CRM_FEATURES,
    pipeline: LOGISTICS_CRM_PIPELINE,
    defaultAiKeys: ["doc_intelligence", "executive_narratives", "anomaly_detection"],
    links: (slug) => {
      const r = routes.tenant(slug);
      return [
        { href: r.sales, label: "Sales & quotes" },
        { href: r.finance, label: "Finance & AR" },
        { href: r.logistics, label: "Logistics hub" },
      ];
    },
  },
  hr: {
    opsTitle: "Workforce hub",
    opsDescription:
      "hub managers, dispatchers, and frontline roles mapped to SAREA personas and workflow task routing",
    aiSectionTitle: "Workforce intelligence",
    pipelineTitle: "People & access pipeline",
    features: LOGISTICS_HR_FEATURES,
    pipeline: LOGISTICS_HR_PIPELINE,
    defaultAiKeys: ["executive_narratives", "demand_forecast", "anomaly_detection"],
    links: (slug) => {
      const r = routes.tenant(slug);
      return [
        { href: r.dashboard, label: "SAREA dashboard" },
        { href: r.workflows, label: "Workflow tasks" },
        { href: r.settings, label: "Tenant settings" },
        { href: `${r.cybercrow.auditLogs}`, label: "CyberCrow audit" },
      ];
    },
  },
};

export function getMeemHubConfig(moduleKey: MeemHubModuleKey): MeemHubConfig {
  return MEEM_HUB_CONFIG[moduleKey];
}
