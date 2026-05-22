/** Logistics industry pack — sample ERP rows (tenant-agnostic reference codes). */

export const LOGISTICS_AI_EXTRA_KEYS = [
  "route_optimization",
  "demand_forecast",
  "anomaly_detection",
  "doc_intelligence",
] as const;

export const LOGISTICS_DISCOVERY_WORKFLOWS = [
  {
    name: "Shipment dispatch approval",
    description: "Multi-hub routing with SLA breach escalation",
  },
  {
    name: "Warehouse intake",
    description: "ASN → QC scan → putaway with inventory sync",
  },
  {
    name: "OCR document capture",
    description: "POD/BOL upload, OCR extraction, human-in-the-loop verify",
  },
  {
    name: "AI route optimization",
    description: "Load plan → AI optimize routes → dispatcher approval",
  },
] as const;

export type LogisticsTenantWorkflowDef = {
  name: string;
  status: string;
  steps: readonly string[];
};

export const LOGISTICS_TENANT_WORKFLOWS: readonly LogisticsTenantWorkflowDef[] = [
  {
    name: "Shipment dispatch approval",
    status: "active",
    steps: ["Request", "Hub review", "Dispatch release"],
  },
  {
    name: "Warehouse intake",
    status: "active",
    steps: ["ASN received", "QC scan", "Putaway confirm"],
  },
  {
    name: "OCR document capture",
    status: "active",
    steps: ["Upload POD/BOL", "OCR extract", "Human verify", "Post to shipment"],
  },
  {
    name: "AI route optimization",
    status: "active",
    steps: ["Load plan", "AI optimize", "Dispatcher approve"],
  },
] as const;

export const LOGISTICS_DISCOVERY_BRANCHES = [
  { name: "Riyadh HQ", city: "Riyadh", region: "Central" },
  { name: "Jeddah Hub", city: "Jeddah", region: "Western" },
  { name: "Dammam DC", city: "Dammam", region: "Eastern" },
] as const;

export const LOGISTICS_HR_SAMPLES = [
  {
    fullName: "Noura Al-Harbi",
    email: "noura.harbi@meem-logistics.demo",
    jobTitle: "Hub Manager",
    employeeNumber: "MEEM-1001",
  },
  {
    fullName: "Khalid Al-Otaibi",
    email: "khalid.otaibi@meem-logistics.demo",
    jobTitle: "Dispatcher",
    employeeNumber: "MEEM-1042",
  },
] as const;

export const LOGISTICS_CRM_SAMPLES = {
  account: {
    name: "Saudi Retail Distribution Co.",
    industry: "retail",
    website: "https://srd.example",
  },
  contact: {
    fullName: "Layla Al-Qahtani",
    email: "layla@srd.example",
    title: "Logistics Director",
    phone: "+966551009900",
  },
} as const;

export const LOGISTICS_SALES_SAMPLES = [
  {
    referenceCode: "MEEM-FQ-4401",
    title: "Freight quote — Riyadh ↔ Jeddah (FTL)",
    kind: "quote",
    status: "quoted",
    customerName: "Saudi Retail Distribution Co.",
    amountSar: 48500,
    workflowName: "Shipment dispatch approval",
  },
  {
    referenceCode: "MEEM-ORD-2287",
    title: "B2B contract — multi-hub distribution (Q2)",
    kind: "order",
    status: "won",
    customerName: "Gulf FMCG Partners",
    amountSar: 312000,
    workflowName: "Shipment dispatch approval",
  },
  {
    referenceCode: "MEEM-FQ-4410",
    title: "Cross-border line — Dammam → Bahrain",
    kind: "quote",
    status: "draft",
    customerName: "Eastern Ports Trading",
    amountSar: 22800,
    workflowName: "OCR document capture",
  },
  {
    referenceCode: "MEEM-OPP-1192",
    title: "Cold-chain lane expansion — Western region",
    kind: "opportunity",
    status: "negotiation",
    customerName: "Western Grocers LLC",
    amountSar: 156000,
    workflowName: "AI route optimization",
  },
  {
    referenceCode: "MEEM-ORD-2291",
    title: "Shipment sales line — fleet 12 weekly slot",
    kind: "order",
    status: "fulfilled",
    customerName: "Saudi Retail Distribution Co.",
    amountSar: 67200,
    workflowName: "AI route optimization",
  },
] as const;

export const LOGISTICS_INVENTORY_SAMPLES = [
  {
    referenceCode: "MEEM-INV-PLT-01",
    sku: "PLT-EUR-48",
    name: "Euro pallet — 48×40",
    category: "pallet",
    qtyOnHand: 420,
    reorderLevel: 80,
    location: "Riyadh HQ — yard",
    status: "active",
  },
  {
    referenceCode: "MEEM-INV-CC-12",
    sku: "CC-GEL-5KG",
    name: "Cold-chain gel packs (5 kg)",
    category: "cold_chain",
    qtyOnHand: 36,
    reorderLevel: 50,
    location: "Jeddah Hub — cold room",
    status: "low_stock",
  },
  {
    referenceCode: "MEEM-INV-CC-20",
    sku: "CC-LINER-40FT",
    name: "Refrigerated container liner — 40 ft",
    category: "cold_chain",
    qtyOnHand: 18,
    reorderLevel: 12,
    location: "Dammam DC — staging",
    status: "active",
  },
  {
    referenceCode: "MEEM-INV-FLT-44",
    sku: "FLT-BRK-NQR",
    name: "Fleet brake pad kit — Isuzu NQR",
    category: "fleet_spare",
    qtyOnHand: 14,
    reorderLevel: 10,
    location: "Riyadh HQ — fleet bay",
    status: "active",
  },
  {
    referenceCode: "MEEM-INV-FLT-51",
    sku: "FLT-TYR-315",
    name: "Tyre set 315/80R22.5 (drive axle)",
    category: "fleet_spare",
    qtyOnHand: 6,
    reorderLevel: 8,
    location: "Jeddah Hub — fleet bay",
    status: "low_stock",
  },
  {
    referenceCode: "MEEM-INV-PKG-08",
    sku: "PKG-WRAP-500",
    name: "Stretch wrap — 500 mm × 300 m",
    category: "packaging",
    qtyOnHand: 92,
    reorderLevel: 40,
    location: "Dammam DC — pack station",
    status: "active",
  },
] as const;

export const LOGISTICS_WAREHOUSE_SAMPLES = [
  {
    referenceCode: "MEEM-WH-RYD-IN",
    name: "Inbound dock A — ASN intake",
    site: "Riyadh DC",
    zone: "Dock",
    bin: "RYD-DOCK-A",
    movementKind: "inbound",
    status: "active",
  },
  {
    referenceCode: "MEEM-WH-RYD-OUT",
    name: "Fleet bay outbound — dispatch staging",
    site: "Riyadh DC",
    zone: "Fleet",
    bin: "RYD-FLT-OUT",
    movementKind: "outbound",
    status: "active",
  },
  {
    referenceCode: "MEEM-WH-JED-COLD",
    name: "Cold room B — gel packs & liners",
    site: "Jeddah Hub",
    zone: "Cold chain",
    bin: "JED-COLD-B",
    movementKind: "cold_storage",
    status: "active",
  },
  {
    referenceCode: "MEEM-WH-JED-STG",
    name: "Cross-dock staging — Western transfers",
    site: "Jeddah Hub",
    zone: "Staging",
    bin: "JED-XD-01",
    movementKind: "staging",
    status: "active",
  },
  {
    referenceCode: "MEEM-WH-DMM-PK",
    name: "Pack station inbound — consumables",
    site: "Dammam DC",
    zone: "Pack",
    bin: "DMM-PK-IN",
    movementKind: "inbound",
    status: "active",
  },
] as const;

export const LOGISTICS_PROCUREMENT_SAMPLES = [
  {
    referenceCode: "MEEM-PR-CC-12",
    title: "Reorder — cold-chain gel packs (5 kg)",
    status: "submitted",
    priority: "urgent",
    amountSar: 28500,
    vendorName: "Gulf Cold Chain Supplies",
    linkedInventoryRef: "MEEM-INV-CC-12",
    linkedFinanceRef: null,
  },
  {
    referenceCode: "MEEM-PR-FLT-51",
    title: "Tyre set 315/80R22.5 — drive axle replenishment",
    status: "approved",
    priority: "normal",
    amountSar: 18400,
    vendorName: "Gulf Fleet Parts Co.",
    linkedInventoryRef: "MEEM-INV-FLT-51",
    linkedFinanceRef: "MEEM-AP-FLT-51",
  },
] as const;

export const LOGISTICS_FINANCE_SAMPLES = [
  {
    referenceCode: "MEEM-AR-4401",
    title: "Freight invoice — Riyadh ↔ Jeddah (FTL)",
    entryType: "invoice",
    direction: "ar",
    status: "open",
    amountSar: 48500,
    customerName: "Saudi Retail Distribution Co.",
    linkedReference: "MEEM-FQ-4401",
  },
  {
    referenceCode: "MEEM-AR-2287",
    title: "B2B distribution contract — Q2 billing",
    entryType: "invoice",
    direction: "ar",
    status: "posted",
    amountSar: 312000,
    customerName: "Gulf FMCG Partners",
    linkedReference: "MEEM-ORD-2287",
  },
  {
    referenceCode: "MEEM-PAY-2291",
    title: "Payment received — fleet 12 weekly slot",
    entryType: "payment",
    direction: "ar",
    status: "cleared",
    amountSar: 67200,
    customerName: "Saudi Retail Distribution Co.",
    linkedReference: "MEEM-ORD-2291",
  },
  {
    referenceCode: "MEEM-AP-FLT-51",
    title: "AP — fleet tyre supplier (drive axle set)",
    entryType: "invoice",
    direction: "ap",
    status: "open",
    amountSar: 18400,
    customerName: "Gulf Fleet Parts Co.",
    linkedReference: "MEEM-INV-FLT-51",
  },
] as const;

export const LOGISTICS_WORKFLOW_META: Record<
  string,
  { moduleTags: readonly string[]; logisticsOcrAi?: boolean }
> = {
  "Shipment dispatch approval": { moduleTags: ["logistics", "warehouse"] },
  "Warehouse intake": { moduleTags: ["warehouse", "inventory"] },
  "OCR document capture": { moduleTags: ["logistics"], logisticsOcrAi: true },
  "AI route optimization": { moduleTags: ["logistics"], logisticsOcrAi: true },
};

export const LOGISTICS_OCR_AI_WORKFLOW_NAMES = new Set(
  Object.entries(LOGISTICS_WORKFLOW_META)
    .filter(([, m]) => m.logisticsOcrAi)
    .map(([name]) => name)
);

export const LOGISTICS_TASK_SAMPLES = [
  {
    title: "Verify OCR extraction — BOL #MEEM-4402",
    workflowName: "OCR document capture",
    status: "open",
  },
  {
    title: "Approve dispatch — Jeddah → Riyadh",
    workflowName: "Shipment dispatch approval",
    status: "open",
  },
  {
    title: "Review AI route plan — fleet 12",
    workflowName: "AI route optimization",
    status: "in_progress",
  },
  {
    title: "QC scan putaway — Dammam DC",
    workflowName: "Warehouse intake",
    status: "open",
  },
] as const;

export const LOGISTICS_LOGISTICS_FEATURES = [
  {
    key: "ocr_capture",
    title: "OCR document capture",
    aiExtraKey: "doc_intelligence",
    description:
      "Scan PODs, bills of lading, and customs forms — extract fields with human-in-the-loop review before posting to shipments.",
    status: "Active",
  },
  {
    key: "route_ai",
    title: "AI route optimization",
    aiExtraKey: "route_optimization",
    description:
      "Fleet routing and hub load balancing on dispatch workflows — dispatcher approves AI-suggested routes.",
    status: "Active",
  },
  {
    key: "demand_ai",
    title: "Demand forecast",
    aiExtraKey: "demand_forecast",
    description: "Seasonal demand signals tied to inventory and procurement for multi-hub stocking.",
    status: "Active",
  },
  {
    key: "anomaly_ai",
    title: "Shipment anomaly detection",
    aiExtraKey: "anomaly_detection",
    description: "SLA breach and exception detection on shipment events with CyberCrow audit trail.",
    status: "Active",
  },
] as const;
