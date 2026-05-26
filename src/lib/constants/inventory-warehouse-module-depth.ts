/**
 * G6 — Inventory + Warehouse module depth: stock/material and warehouse operations readiness
 * (not a full WMS, barcode system, IoT platform, or live stock accuracy guarantees).
 */

import type { ModeledSectorKey } from "@/lib/constants/sector-catalog";

export type SupplyWorkflowReadinessStatus = "found" | "recommended" | "partial";

export type SupplyRecommendedWorkflow = {
  id: string;
  label: string;
  description: string;
  status: SupplyWorkflowReadinessStatus;
  linkedModuleKeys: readonly string[];
};

export const INVENTORY_WORKFLOW_MATCH_KEYWORDS = [
  "inventory",
  "stock",
  "sku",
  "replenishment",
  "cycle count",
  "adjustment",
  "receiving",
  "catalog",
  "item",
  "material",
  "count",
  "exception",
] as const;

export const WAREHOUSE_WORKFLOW_MATCH_KEYWORDS = [
  "warehouse",
  "receiving",
  "putaway",
  "picking",
  "dispatch",
  "movement",
  "inbound",
  "outbound",
  "logistics",
  "dock",
  "bin",
  "staging",
  "exception",
] as const;

export const INVENTORY_RECOMMENDED_WORKFLOWS: readonly SupplyRecommendedWorkflow[] = [
  {
    id: "item-catalog-readiness",
    label: "Item / catalog readiness",
    description: "SKU and category structure review — operator-managed, not automated sync.",
    status: "recommended",
    linkedModuleKeys: ["inventory", "reports"],
  },
  {
    id: "stock-receiving",
    label: "Stock receiving",
    description: "Receiving coordination with procurement and warehouse — advisory checklist.",
    status: "recommended",
    linkedModuleKeys: ["inventory", "procurement", "warehouse"],
  },
  {
    id: "stock-adjustment-review",
    label: "Stock adjustment review",
    description: "Adjustment approval trail — not real-time stock guarantees.",
    status: "recommended",
    linkedModuleKeys: ["inventory", "tasks", "cybercrow"],
  },
  {
    id: "cycle-count-readiness",
    label: "Cycle count readiness",
    description: "Periodic count planning — operator-managed, not barcode automation.",
    status: "recommended",
    linkedModuleKeys: ["inventory", "tasks"],
  },
  {
    id: "replenishment-request",
    label: "Replenishment request",
    description: "Low-stock replenishment signals linked to procurement PRs when configured.",
    status: "recommended",
    linkedModuleKeys: ["inventory", "procurement"],
  },
  {
    id: "inventory-exception",
    label: "Inventory exception review",
    description: "Negative stock, write-off, or override review with evidence notes.",
    status: "recommended",
    linkedModuleKeys: ["inventory", "cybercrow", "reports"],
  },
  {
    id: "inventory-finance-review",
    label: "Inventory-to-finance review",
    description: "Cost / value context handoff — not live accounting or valuation engine.",
    status: "recommended",
    linkedModuleKeys: ["inventory", "finance"],
  },
  {
    id: "inventory-access-review",
    label: "Inventory access / role review",
    description: "Periodic review of inventory privileges — RBAC + evidence.",
    status: "recommended",
    linkedModuleKeys: ["inventory", "roles", "cybercrow"],
  },
  {
    id: "monthly-inventory-report",
    label: "Monthly inventory report",
    description: "Operator-managed stock roll-up — advisory reporting readiness.",
    status: "recommended",
    linkedModuleKeys: ["inventory", "reports"],
  },
] as const;

export const WAREHOUSE_RECOMMENDED_WORKFLOWS: readonly SupplyRecommendedWorkflow[] = [
  {
    id: "receiving-readiness",
    label: "Receiving readiness",
    description: "Inbound receiving checklist from procurement — not automated WMS receipt.",
    status: "recommended",
    linkedModuleKeys: ["warehouse", "procurement", "inventory"],
  },
  {
    id: "putaway-readiness",
    label: "Putaway readiness",
    description: "Zone/bin putaway coordination — operator-managed movement.",
    status: "recommended",
    linkedModuleKeys: ["warehouse", "inventory"],
  },
  {
    id: "picking-dispatch-readiness",
    label: "Picking / dispatch readiness",
    description: "Outbound picking and dispatch prep — logistics handoff readiness.",
    status: "recommended",
    linkedModuleKeys: ["warehouse", "logistics"],
  },
  {
    id: "warehouse-movement-review",
    label: "Warehouse movement review",
    description: "Movement exception and override review — advisory trail.",
    status: "recommended",
    linkedModuleKeys: ["warehouse", "tasks", "cybercrow"],
  },
  {
    id: "warehouse-exception-report",
    label: "Warehouse exception report",
    description: "Dock, lane, or movement exceptions — reporting readiness.",
    status: "recommended",
    linkedModuleKeys: ["warehouse", "reports"],
  },
  {
    id: "warehouse-logistics-handoff",
    label: "Warehouse-to-logistics handoff",
    description: "Dispatch readiness for logistics lanes — not carrier API automation.",
    status: "recommended",
    linkedModuleKeys: ["warehouse", "logistics"],
  },
  {
    id: "warehouse-access-review",
    label: "Warehouse access / role review",
    description: "Periodic review of warehouse floor privileges.",
    status: "recommended",
    linkedModuleKeys: ["warehouse", "roles", "cybercrow"],
  },
  {
    id: "monthly-warehouse-report",
    label: "Monthly warehouse report",
    description: "Operator-managed hub throughput summary — advisory.",
    status: "recommended",
    linkedModuleKeys: ["warehouse", "reports"],
  },
] as const;

export const INVENTORY_CYBERCROW_RISKS = [
  "Unauthorized stock adjustment",
  "Missing receiving trail",
  "Inventory count gaps",
  "Stale item / catalog data",
  "Stock movement abuse",
  "Overprivileged inventory users",
  "Missing adjustment approval trail",
  "Inventory exception audit gaps",
  "Procurement receiving mismatch",
  "Privileged admin misuse",
] as const;

export const INVENTORY_CYBERCROW_EVIDENCE = [
  "Stock receiving record",
  "Stock adjustment approval",
  "Cycle count record",
  "Item / catalog review",
  "Replenishment request trail",
  "Inventory exception review",
  "Inventory-to-finance handoff note",
  "Monthly inventory report",
  "Inventory role / access review",
] as const;

export const WAREHOUSE_CYBERCROW_RISKS = [
  "Unauthorized warehouse movement",
  "Receiving / putaway gaps",
  "Picking / dispatch mismatch",
  "Warehouse access anomalies",
  "Missing logistics handoff evidence",
  "Overprivileged warehouse users",
  "Warehouse exception audit gaps",
  "After-hours dispatch without trail",
  "Inbound lane misuse",
  "Privileged admin misuse",
] as const;

export const WAREHOUSE_CYBERCROW_EVIDENCE = [
  "Warehouse receiving record",
  "Putaway / picking readiness trail",
  "Warehouse movement review",
  "Warehouse-to-logistics handoff",
  "Dispatch sign-off (advisory)",
  "Warehouse exception report",
  "Monthly warehouse report",
  "Warehouse role / access review",
] as const;

export type SupplySareaPersona = {
  persona: string;
  audience: string;
  experience: string;
};

export const INVENTORY_SAREA_PERSONAS: readonly SupplySareaPersona[] = [
  {
    persona: "Executive / Owner",
    audience: "Leadership",
    experience: "Stock / material health and exception posture summary.",
  },
  {
    persona: "Operations Manager",
    audience: "Operations",
    experience: "Inventory readiness, low-stock signals, cross-module handoffs.",
  },
  {
    persona: "Inventory Controller",
    audience: "Inventory",
    experience: "Item catalog, adjustments, cycle counts — primary grid density.",
  },
  {
    persona: "Procurement Specialist",
    audience: "Procurement",
    experience: "Receiving handoff from PRs — links to Procurement hub.",
  },
  {
    persona: "Finance Manager",
    audience: "Finance",
    experience: "Cost / readiness review — not live valuation posting.",
  },
  {
    persona: "Analyst",
    audience: "Reporting",
    experience: "Inventory reports, SKU gaps, adjustment readiness lists.",
  },
  {
    persona: "Tenant Admin",
    audience: "Workspace admin",
    experience: "Role mappings and inventory access readiness.",
  },
  {
    persona: "CyberCrow Reviewer",
    audience: "Security / GRC",
    experience: "Stock / material evidence and risk signals — advisory read-only.",
  },
] as const;

export const WAREHOUSE_SAREA_PERSONAS: readonly SupplySareaPersona[] = [
  {
    persona: "Executive / Owner",
    audience: "Leadership",
    experience: "Warehouse health and movement risk posture.",
  },
  {
    persona: "Warehouse Supervisor",
    audience: "Warehouse",
    experience: "Receiving, putaway, picking, movement readiness — supervisor density.",
  },
  {
    persona: "Field / Warehouse Operator",
    audience: "Floor staff",
    experience: "Assigned tasks and movement checklists — minimal columns.",
  },
  {
    persona: "Logistics Coordinator",
    audience: "Logistics",
    experience: "Dispatch / warehouse handoff — links to Logistics.",
  },
  {
    persona: "Inventory Controller",
    audience: "Inventory",
    experience: "Stock / movement context — cross-links to Inventory.",
  },
  {
    persona: "Analyst",
    audience: "Reporting",
    experience: "Warehouse reports and exception lists.",
  },
  {
    persona: "Tenant Admin",
    audience: "Workspace admin",
    experience: "Role mappings and warehouse access readiness.",
  },
  {
    persona: "CyberCrow Reviewer",
    audience: "Security / GRC",
    experience: "Warehouse evidence and handoff trails — advisory read-only.",
  },
] as const;

export type SupplySectorNote = {
  sector: ModeledSectorKey;
  headline: string;
  inventoryFocus: readonly string[];
  warehouseFocus: readonly string[];
};

export const INVENTORY_WAREHOUSE_SECTOR_NOTES: readonly SupplySectorNote[] = [
  {
    sector: "logistics",
    headline: "Warehouse movement, stock readiness, dispatch handoff",
    inventoryFocus: ["Hub SKUs", "Fleet spares", "Low-stock at lanes"],
    warehouseFocus: ["Inbound / outbound lanes", "Cold storage zones", "Dispatch prep"],
  },
  {
    sector: "retail",
    headline: "Stock availability, replenishment, store supply",
    inventoryFocus: ["Category SKUs", "Store replenishment", "Returns / shrink signals (advisory)"],
    warehouseFocus: ["DC receiving", "Store dispatch lanes", "Replenishment staging"],
  },
  {
    sector: "construction",
    headline: "Materials control, receiving, site readiness",
    inventoryFocus: ["Site materials", "Bulk qty signals", "Project material refs"],
    warehouseFocus: ["Yard receiving", "Site dispatch staging", "Material handoff"],
  },
  {
    sector: "aviation",
    headline: "Limited supplies / service inventory — not warehouse-heavy default",
    inventoryFocus: ["MRO consumables", "Station supplies (advisory)", "Service parts catalog"],
    warehouseFocus: ["Station stores (when enabled)", "Limited bin structure", "Handoff to logistics"],
  },
  {
    sector: "healthcare",
    headline: "Limited supplies readiness — privacy-safe, not EMR/pharmacy system",
    inventoryFocus: ["Clinical supplies SKUs", "Privacy-safe locations", "Replenishment signals"],
    warehouseFocus: ["Central stores (when enabled)", "Receiving checklist", "No patient data on floor UI"],
  },
] as const;

export const INVENTORY_REPORT_KPI_SIGNALS = [
  "Inventory module enabled",
  "SKU / item count",
  "Low-stock SKU count",
  "Distinct stock locations",
  "Units on hand (coordination signal)",
  "Procurement PRs with inventory ref",
  "Warehouse module enabled (handoff)",
  "Logistics module enabled (handoff)",
  "Inventory-related open tasks",
  "Matched inventory workflows",
  "Reports module roll-ups",
  "Stock evidence readiness (CyberCrow)",
] as const;

export const WAREHOUSE_REPORT_KPI_SIGNALS = [
  "Warehouse module enabled",
  "Location / zone count",
  "Inbound / outbound lane counts",
  "Distinct hub sites",
  "Inventory module enabled (movement context)",
  "Logistics module enabled (dispatch handoff)",
  "Procurement receiving handoff",
  "Warehouse-related open tasks",
  "Matched warehouse workflows",
  "Reports module roll-ups",
  "Warehouse evidence readiness (CyberCrow)",
] as const;

export const INVENTORY_WAREHOUSE_FORBIDDEN_CLAIM_PHRASES = [
  "barcode scanner",
  "rfid",
  "iot sensor",
  "real-time stock accuracy",
  "automated stock synchronization",
  "automated replenishment engine",
  "ai demand forecasting",
  "inventory accuracy guarantee",
  "full wms",
  "warehouse automation platform",
  "fraud detection",
  "certified audit",
  "automated compliance",
  "live stock guarantee",
  "external warehouse api",
] as const;
