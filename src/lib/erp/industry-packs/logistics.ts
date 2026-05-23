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

export type LogisticsAiFeature = {
  key: string;
  title: string;
  aiExtraKey: string;
  description: string;
  status: string;
};

/** Sales module AI capability cards (MEEM logistics tenant). */
export const LOGISTICS_SALES_FEATURES = [
  {
    key: "quote_intel",
    title: "Quote & contract intelligence",
    aiExtraKey: "doc_intelligence",
    description:
      "Extract freight lanes, rates, and SLA terms from B2B quotes and distribution contracts — human verify before pipeline commit.",
    status: "Active",
  },
  {
    key: "pipeline_forecast",
    title: "Pipeline demand signals",
    aiExtraKey: "demand_forecast",
    description:
      "Seasonal freight demand tied to quote win probability and hub capacity — feeds inventory and procurement.",
    status: "Active",
  },
  {
    key: "deal_anomaly",
    title: "Deal anomaly detection",
    aiExtraKey: "anomaly_detection",
    description:
      "Flags rate outliers, duplicate quotes, and stalled negotiations — events post to CyberCrow audit.",
    status: "Active",
  },
] as const satisfies readonly LogisticsAiFeature[];

export const LOGISTICS_SALES_PIPELINE = [
  "CRM account qualified → freight quote draft with lane and SLA",
  "AI extracts contract terms → sales ops verify and publish",
  "Quote won → hand off to dispatch workflow and AR billing",
  "Executive narrative summarizes pipeline and hub load weekly",
] as const;

/** Inventory module AI capability cards. */
export const LOGISTICS_INVENTORY_FEATURES = [
  {
    key: "demand_stock",
    title: "Demand-driven stocking",
    aiExtraKey: "demand_forecast",
    description:
      "Multi-hub reorder signals from seasonal demand — auto-suggest PRs when SKUs hit reorder level.",
    status: "Active",
  },
  {
    key: "stock_anomaly",
    title: "Stock anomaly detection",
    aiExtraKey: "anomaly_detection",
    description:
      "Detects shrinkage patterns, negative adjustments, and hub transfer mismatches across DCs.",
    status: "Active",
  },
  {
    key: "asn_intel",
    title: "ASN document intelligence",
    aiExtraKey: "doc_intelligence",
    description:
      "OCR on advance ship notices — match expected qty to warehouse intake before putaway.",
    status: "Active",
  },
] as const satisfies readonly LogisticsAiFeature[];

export const LOGISTICS_INVENTORY_PIPELINE = [
  "Demand forecast → reorder level adjustment per hub SKU",
  "Low stock alert → procurement PR with linked inventory ref",
  "ASN OCR intake → QC scan confirms qty at warehouse lane",
  "Anomaly review → CyberCrow audit on exception events",
] as const;

/** Warehouse module AI capability cards. */
export const LOGISTICS_WAREHOUSE_FEATURES = [
  {
    key: "intake_ocr",
    title: "Intake document OCR",
    aiExtraKey: "doc_intelligence",
    description:
      "Scan ASNs and packing lists at inbound lanes — extract SKU, qty, and lot before QC putaway.",
    status: "Active",
  },
  {
    key: "lane_anomaly",
    title: "Lane & cold-chain anomalies",
    aiExtraKey: "anomaly_detection",
    description:
      "Temperature excursion and dwell-time alerts on cold storage zones — escalate to hub manager.",
    status: "Active",
  },
  {
    key: "staging_forecast",
    title: "Outbound staging forecast",
    aiExtraKey: "demand_forecast",
    description:
      "Predict pack-lane load from dispatch schedule — balance Jeddah cold room vs Dammam staging.",
    status: "Active",
  },
] as const satisfies readonly LogisticsAiFeature[];

export const LOGISTICS_WAREHOUSE_PIPELINE = [
  "ASN received at inbound lane → OCR extract and QC scan",
  "Putaway confirm → inventory sync with hub location",
  "Dispatch staging → LABEL → outbound lane release",
  "Cold-chain anomaly → workflow task to hub manager",
] as const;

/** Procurement module AI capability cards. */
export const LOGISTICS_PROCUREMENT_FEATURES = [
  {
    key: "pr_forecast",
    title: "AI reorder suggestions",
    aiExtraKey: "demand_forecast",
    description:
      "Low-stock SKUs and seasonal spikes auto-draft PRs with vendor hints and estimated SAR value.",
    status: "Active",
  },
  {
    key: "vendor_doc",
    title: "Vendor invoice intelligence",
    aiExtraKey: "doc_intelligence",
    description:
      "Extract line items from supplier invoices — match to approved PR before AP posting on finance.",
    status: "Active",
  },
  {
    key: "spend_anomaly",
    title: "Spend anomaly detection",
    aiExtraKey: "anomaly_detection",
    description:
      "Flags duplicate PRs, off-contract pricing, and urgent spend spikes — CyberCrow audit trail.",
    status: "Active",
  },
] as const satisfies readonly LogisticsAiFeature[];

export const LOGISTICS_PROCUREMENT_PIPELINE = [
  "Low stock signal → draft PR with inventory SKU ref",
  "Hub manager approve → vendor PO issued",
  "Goods received → warehouse intake workflow",
  "Supplier invoice OCR → AP line on finance ledger",
] as const;

/** Reports / BI module AI capability cards. */
export const LOGISTICS_REPORTS_FEATURES = [
  {
    key: "exec_narratives",
    title: "Executive AI narratives",
    aiExtraKey: "executive_narratives",
    description:
      "Leadership summaries on pipeline, receivables, hub throughput, and compliance posture — SAREA exec persona.",
    status: "Active",
  },
  {
    key: "kpi_forecast",
    title: "KPI demand outlook",
    aiExtraKey: "demand_forecast",
    description:
      "Forward-looking freight volume and stock coverage projections across enabled ERP modules.",
    status: "Active",
  },
  {
    key: "ops_anomaly",
    title: "Cross-module anomaly roll-up",
    aiExtraKey: "anomaly_detection",
    description:
      "Aggregates shipment, billing, and stock exceptions into a single ops risk view on the dashboard.",
    status: "Active",
  },
] as const satisfies readonly LogisticsAiFeature[];

export const LOGISTICS_REPORTS_PIPELINE = [
  "Aggregate KPIs from sales, inventory, finance, and workflows",
  "AI narrative draft for executive persona (SAREA)",
  "Anomaly roll-up → CyberCrow security and audit views",
  "Frontline persona sees task-focused widgets only",
] as const;

/** CRM module AI capability cards. */
export const LOGISTICS_CRM_FEATURES = [
  {
    key: "account_intel",
    title: "Account document intelligence",
    aiExtraKey: "doc_intelligence",
    description:
      "Extract contacts, credit terms, and lane preferences from customer MSAs and onboarding packs.",
    status: "Active",
  },
  {
    key: "relationship_narratives",
    title: "Relationship narratives",
    aiExtraKey: "executive_narratives",
    description:
      "Account health summaries for sales leadership — ties CRM to pipeline and AR aging.",
    status: "Active",
  },
  {
    key: "crm_anomaly",
    title: "CRM data anomaly detection",
    aiExtraKey: "anomaly_detection",
    description:
      "Duplicate accounts, stale contacts, and credit-limit breaches flagged before quote release.",
    status: "Active",
  },
] as const satisfies readonly LogisticsAiFeature[];

export const LOGISTICS_CRM_PIPELINE = [
  "New B2B account → document OCR for MSA terms",
  "Contacts synced → freight quote tied to CRM account",
  "Win/loss signals → executive narrative on key accounts",
  "Anomaly review before high-value quote approval",
] as const;

/** HR module AI capability cards. */
export const LOGISTICS_HR_FEATURES = [
  {
    key: "workforce_narratives",
    title: "Workforce narratives",
    aiExtraKey: "executive_narratives",
    description:
      "Hub staffing and role coverage summaries for operations leadership — complements SAREA personas.",
    status: "Active",
  },
  {
    key: "shift_forecast",
    title: "Shift demand forecast",
    aiExtraKey: "demand_forecast",
    description:
      "Predict dispatcher and hub-manager load from seasonal freight volume and workflow throughput.",
    status: "Active",
  },
  {
    key: "access_anomaly",
    title: "Access anomaly detection",
    aiExtraKey: "anomaly_detection",
    description:
      "Unusual login patterns and role changes on tenant users — integrates with CyberCrow IAM posture.",
    status: "Active",
  },
] as const satisfies readonly LogisticsAiFeature[];

export const LOGISTICS_HR_PIPELINE = [
  "Employee onboarded → role mapped to SAREA persona",
  "Hub assignment → workflow task routing by job title",
  "Shift forecast → staffing hints on dashboard widgets",
  "Access anomaly → CyberCrow audit and admin review",
] as const;

export const LOGISTICS_LOGISTICS_PIPELINE = [
  "OCR document capture — upload POD/BOL, extract, verify",
  "Shipment dispatch approval — hub review and release",
  "AI route optimization — dispatcher approves fleet plan",
  "Anomaly detection — SLA breach alerts to CyberCrow",
] as const;

/** Finance module capability cards (MEEM logistics tenant). */
export const LOGISTICS_FINANCE_FEATURES = [
  {
    key: "freight_ar",
    title: "Freight AR billing",
    aiExtraKey: "doc_intelligence",
    description:
      "Convert freight quotes and B2B contracts to posted invoices — OCR-verified POD/BOL can trigger AR lines on shipment close.",
    status: "Active",
  },
  {
    key: "demand_cash",
    title: "Demand & cash signals",
    aiExtraKey: "demand_forecast",
    description:
      "Forecast-driven procurement and AP timing — ties inventory reorder signals to working-capital planning.",
    status: "Active",
  },
  {
    key: "billing_anomaly",
    title: "Billing anomaly detection",
    aiExtraKey: "anomaly_detection",
    description:
      "Flags duplicate invoices, rate mismatches, and SLA-linked billing exceptions — events flow to CyberCrow audit.",
    status: "Active",
  },
] as const satisfies readonly LogisticsAiFeature[];

/** Freight billing pipeline steps (MEEM demo narrative). */
export const LOGISTICS_FINANCE_PIPELINE = [
  "Freight quote won → AR invoice draft from sales reference",
  "OCR POD/BOL verified → post revenue to ledger",
  "AP fleet & consumables — match procurement PR to supplier invoice",
  "Payment clearance — bank feed reconcile to MEEM reference codes",
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
] as const satisfies readonly LogisticsAiFeature[];
