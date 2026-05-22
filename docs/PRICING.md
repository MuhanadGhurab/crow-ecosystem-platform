# Crow Ecosystem — commercial pricing (SAR)



**Currency:** Saudi Riyal (`estimatedMonthlySar` in pipeline — stored **excluding VAT**).  

**Model:** Orchestration platform (CEM + CyberCrow + SAREA) — **tier base + employee band + module/security/SAREA/AI add-ons**, not a per-seat ERP clone.  

**Positioning:** Credible for enterprise logistics/holding groups (e.g. MEEM 50–250 employees), typically **20–40% below** a comparable Odoo or Zoho One stack with security uplift at the same headcount (illustrative — not a legal quote).



---



## VAT policy (Saudi Arabia)



- **Catalog list prices** (tiers, bands, add-ons) are quoted **excluding 15% VAT** — standard B2B practice.

- **Invoices** add VAT at **15%** on the monthly subtotal (after complexity multiplier where applicable).

- **Display convention:** Subtotal (excl. VAT) → VAT 15% → Total (incl. VAT).

- **Pipeline field** `estimatedMonthlySar` remains **excl. VAT**; VAT lines are computed in `pricing.service.ts` (`vatAmountSar`, `totalInclVatSar`).



---



## Competitive reference (marketing)



| Vendor | Typical enterprise signal | Crow contrast |

|--------|---------------------------|---------------|

| **Odoo** | ~USD 30–50+/user/month + implementation | Band-based SAR bundle; discovery → blueprint single total |

| **Zoho One** | ~USD 37–45/user/month all-in suite | Same engines (ops + security + adaptive UI) without per-user multiplication |



**Illustrative comparison @ 150 employees** — all figures **monthly SAR excluding VAT** (ERP seats + ~28% security uplift — see `typicalMarketMonthlySar` in code):



| Reference | Typical monthly SAR (excl. VAT) |

|-----------|----------------------------------|

| Odoo Enterprise + security uplift | ~34,600 |

| Zoho One + security uplift | ~30,200 |

| Crow MEEM-like bundle (excl. VAT) | ~23,956 (see below) |

| Crow MEEM-like bundle (incl. VAT) | ~27,549.40 |



Source constants: `src/lib/constants/employee-bands.ts`, public table on `/pricing`.



---



## Platform tiers (CEM base)



> **Prices excl. 15% VAT unless stated.**



| Key | Name | Base SAR/mo (excl. VAT) | Auth |

|-----|------|-------------------------|------|

| `startup` | Startup | 1,899 | Native |

| `growth` | Growth | 4,499 | Native |

| `enterprise` | Enterprise | 8,999 | Microsoft Entra ID SSO |



---



## Employee band scale fee



Added to tier base before complexity multiplier (`×1.05` for 50–250 / 51–200 bands, `×1.10` for 201–500+). Band fees are **excl. VAT**.



| Band key | Label | Band fee SAR/mo (excl. VAT) |

|----------|-------|-----------------------------|

| `1-49` | 1–49 | 0 |

| `50-100` | 50–100 | 1,200 |

| `50-250` | 50–250 | 2,400 |

| `101-250` | 101–250 | 2,400 |

| `51-200` | 51–200 | 2,000 |

| `201-500` | 201–500 | 4,800 |

| `500+` | 500+ | 7,200 |



---



## CEM module add-ons (SAR/mo, excl. VAT)



| Key | Module | SAR/mo |

|-----|--------|--------|

| iam | Identity & access | 139 |

| hr | Human resources | 175 |

| finance | Finance & accounting | 239 |

| inventory | Inventory & warehousing | 195 |

| warehouse | Warehouse operations | 195 |

| logistics | Logistics | 185 |

| sales | Sales | 189 |

| crm | CRM | 199 |

| procurement | Procurement | 159 |

| projects | Project management | 179 |

| bi | Reporting & dashboards | 219 |

| documents | Document management | 129 |

| approvals | Approval workflows | 169 |



---



## CyberCrow security add-ons (SAR/mo, excl. VAT)



| Key | Package | SAR/mo |

|-----|---------|--------|

| `crow_shield` | Crow Shield (baseline) | 349 |

| `crow_sentinel` | Crow Sentinel | 899 |

| `crow_fortress` | Crow Fortress (NCA-aligned) | 1,699 |



---



## SAREA experience packages (SAR/mo, excl. VAT)



| Key | Label | SAR/mo |

|-----|-------|--------|

| `essential` | Frontline | 2,399 |

| `professional` | Manager (default) | 4,299 |

| `executive` | Executive | 5,799 |



Discovery field: `experience.sareaPackageKey`.



---



## AI extras (SAR/mo, excl. VAT)



| Key | Name | SAR/mo |

|-----|------|--------|

| `route_optimization` | Route optimization | 790 |

| `demand_forecast` | Demand forecast | 690 |

| `anomaly_detection` | Shipment anomaly detection | 590 |

| `doc_intelligence` | Document intelligence | 520 |

| `executive_narratives` | Executive AI narratives | 480 |



Discovery field: `experience.aiExtras` (string array).



---



## MEEM lighthouse example (50–250 logistics)



**Profile:** Enterprise, modules `logistics`, `warehouse`, `inventory`, `crm`, `hr`; security `crow_sentinel` + `crow_fortress`; SAREA `executive`; AI route + forecast + anomaly; band `50-250`.



| Line | SAR/mo (excl. VAT) |

|------|---------------------|

| Enterprise base | 8,999 |

| Employee band 50–250 | 2,400 |

| Modules (5) | 949 |

| CyberCrow security | 2,598 |

| SAREA Executive | 5,799 |

| AI extras (3) | 2,070 |

| **Pre-multiplier subtotal** | **22,815** |

| Complexity ×1.05 | |

| **Subtotal (excl. VAT)** | **23,956** |

| **VAT 15%** | **3,593.40** |

| **Total (incl. VAT)** | **27,549.40** |



**Live request ID:** `cmpge193x0000vhws8nclouoi` — refresh after discovery:



```bash

npx tsx --env-file=.env -e "

import { PrismaClient } from '@prisma/client';

import { refreshRequestPricingEstimate } from './src/lib/services/commercial.service.ts';

const p = new PrismaClient();

const e = await refreshRequestPricingEstimate('cmpge193x0000vhws8nclouoi');

console.log(e);

await p.\$disconnect();

"

```



Or re-seed: `npx tsx --env-file=.env prisma/seed-meem.ts` (runs `refreshRequestPricingEstimate` via pipeline).



**Mock (`USE_MOCK_DATA=true`):** `MEEM_PRICING_ESTIMATE` in `src/lib/mock/meem-global.ts` — derived from `calculateMonthlyEstimate` (same inputs).



---



## Implementation



- Calculator: `src/lib/services/pricing.service.ts` (`SAUDI_VAT_RATE`, `vatAmountSar`, `totalInclVatSar`)

- Persisted on request: `refreshRequestPricingEstimate` in `commercial.service.ts` (**excl. VAT** subtotal)

- Catalog seed: `npm run db:seed` (subscription plans from `SUBSCRIPTION_TIERS`)

- Public catalog: `/pricing` (footnote: 15% VAT at invoice)



**Stripe:** Plan Stripe IDs unchanged — billing integration is out of scope for this pricing pass.


