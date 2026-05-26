# F32 — Retail operating model pack & tenant readiness

**Phase:** F32  
**Constraint:** No paid infrastructure · no production launch · no live payments · no external APIs · no schema changes  
**Status:** Passed (26 May 2026) — pending validation command run in CI/local

---

## 1. Objective

Make **Retail** a first-class Crow operating model alongside Logistics, Construction, and Aviation — reusable for discovery, org intelligence, blueprint readiness, SAREA personas, and CyberCrow advisory posture. This is **operator-managed readiness**, not a live retail ERP or payment launch.

---

## 2. Retail operating model overview

| Dimension | Crow posture |
|-----------|--------------|
| **Scope** | Multi-store retail: HQ, stores, DC, optional e-commerce fulfillment node (readiness) |
| **Operations** | Catalog, inventory, replenishment, procurement, sales/CRM, customer service, returns, promotions |
| **Finance** | Cash reconciliation and refund review workflows — **no live payment processing in Crow** |
| **Security** | CyberCrow baselines for refund/discount/inventory/access risks — **advisory only** |
| **Experience** | SAREA maps executive, ops, store, frontline, inventory, analyst, admin personas |

### Research considerations (readiness language)

| Topic | Crow treatment |
|-------|----------------|
| Product identifiers (barcode / GTIN) | **Future integration readiness** — operator-managed catalog fields; no active GS1 integration |
| Store / location IDs (GLN) | **Future integration readiness** — branch model supports HQ / store / DC |
| Stock movement & visibility | Workflows: receiving, transfer, count, adjustment, replenishment |
| POS / payment data | **Boundary awareness** — Crow does not process cards; POS summary review workflow only |
| PCI DSS | **Advisory reference** if payment data is ever handled outside Crow — **not PCI compliant, not certified** |
| E-commerce / MFA | Future security reference in discovery template identity notes |
| Returns / refunds | Return review workflow + refund abuse baseline |
| Promotions / discounts | Promotion approval chain + discount override baseline |
| Customer privacy | CRM segmentation hints; customer data baseline |

---

## 3. Sector template (code-backed)

**Primary source:** `src/lib/org-intelligence/sector-template-data.ts` — `RETAIL` + `SECTOR_TEMPLATE_CATALOG.retail`

**Exports:**

- `RETAIL_RECOMMENDED_CEM_MODULE_KEYS` — live CEM catalog keys only
- `RETAIL_RECOMMENDED_ERP_MODULE_KEYS` — ERP runtime keys (`tasks` → `approvals`, `reports` → `bi`)
- `RETAIL_FUTURE_READINESS_KEYS` — documented future only (not live modules)

### Recommended departments (12)

1. Retail Operations  
2. Store Management  
3. Merchandising  
4. Inventory & Stock Control  
5. Procurement / Supplier Management  
6. Sales & CRM  
7. Customer Service  
8. Finance & Reconciliation  
9. Marketing / Promotions / Loyalty  
10. HR / Workforce  
11. IT & Security  
12. CyberCrow Security  

### Recommended roles (15 positions)

Executive / Business Owner · Retail Operations Manager · Store Manager · Sales Associate / Cashier · Inventory Controller · Merchandiser · Buyer / Procurement Specialist · Customer Service Agent · Finance Clerk · Marketing / Loyalty Coordinator · HR Coordinator · IT / Security Administrator · Retail Analyst · Tenant Admin · CyberCrow Analyst

### Recommended workflows (14)

Product catalog update · Stock receiving · Inventory count / stock adjustment · Replenishment request · Supplier purchase request · POS summary review · Return / exchange review · Discount / promotion approval · Customer complaint escalation · Cash reconciliation · Store incident report · Monthly retail performance review · Stock transfer (DC ↔ store) · Price change approval

### Approval chains (6)

Pricing · Promotion · Return / refund · Stock adjustment · Cash reconciliation · Supplier purchase

---

## 4. Recommended modules

### Live (existing CEM keys)

| CEM key | ERP runtime | Purpose |
|---------|-------------|---------|
| `sales` | sales | Orders / POS summary awareness |
| `crm` | crm | Customer relationships |
| `inventory` | inventory | Stock levels |
| `warehouse` | warehouse | DC / store logistics |
| `procurement` | procurement | Supplier POs |
| `finance` | finance | Reconciliation |
| `hr` | hr | Workforce |
| `approvals` | tasks | Workflow tasks |
| `bi` | reports | Reporting |

### Future readiness only (not live modules)

`loyalty` · `ecommerce` · `pos_integration` · `payment_reconciliation` · `advanced_bi`

---

## 5. Discovery guidance

**Files:**

- `src/lib/discovery-intelligence/sector-guidance.ts` — expanded `retail` block (discovery topics, blueprint notes, SAREA/CyberCrow hints)
- `src/lib/discovery-templates/retail.json` — aligned module keys, departments, roles, workflows, security requirements (advisory PCI wording)

**Discovery should guide operators on:**

- Store / branch count and network shape  
- Online vs physical sales mix  
- Product categories and stock locations  
- Supplier count and count frequency  
- Return / refund and promotion approval processes  
- POS system presence (without live integration)  
- Staff roles and reporting needs  
- Security concerns (refund abuse, adjustments, customer data)

**Ambiguous industry:** Resolver may default sector confidence to retail — operators should confirm industry on intake when confidence is low.

---

## 6. Blueprint readiness

On org intelligence **accept**, retail template flows into blueprint with:

- Departments, positions, workflows, approval chains  
- CyberCrow baselines and SAREA profile hints  
- Module recommendations via existing CEM/ERP mapping  

Blueprint notes in sector guidance call out live vs future modules and confidence caveats.

---

## 7. SAREA persona model

SAREA controls **experience density and navigation**, not permissions (RBAC remains authoritative).

| Persona | Primary users | Experience focus |
|---------|---------------|------------------|
| `executive` | Owner / executive | Performance, revenue, store health, risk |
| `manager` | Retail ops, store managers | Workflows, branches, exceptions, control board |
| `frontline` | Associate / cashier | Mobile tasks, escalations, minimal nav |
| `specialist` | Inventory, CS, finance clerks | Domain dashboards |
| `analyst` | Retail analyst | Reports, trends, evidence gaps |
| `security` | CyberCrow analyst | Evidence and incident console |

Template profiles in `RETAIL.sareaProfiles` include executive, retail ops, store manager, associate mobile, inventory, analyst, tenant admin, and CyberCrow console variants.

---

## 8. CyberCrow retail posture

**Advisory baselines** (8): POS/payment boundary · refund abuse · discount override · inventory adjustment audit · store access · customer privacy · privileged role changes · supplier fraud

**Evidence readiness examples** (operator-managed, not automated SIEM):

- Refund approval evidence  
- Discount approval evidence  
- Stock adjustment audit  
- Cash reconciliation review  
- Access review  
- Store incident report  
- Supplier approval trail  
- Inventory count record  

**Explicit non-claims:** No PCI compliance, no active payment monitoring, no live SIEM integration, no GS1 integration active.

---

## 9. Database / seed readiness

| Layer | Mechanism |
|-------|-----------|
| **Code catalog** | `SECTOR_TEMPLATE_CATALOG` includes `retail: RETAIL` |
| **DB sync** | `prisma/seed-sector-templates.ts` upserts all `SECTOR_TEMPLATE_KEYS` from catalog — **idempotent** |
| **Command** | `npm run db:seed:sectors` (requires staging env file; operator-approved) |

**Preferred path:** Sector template first — **no synthetic retail tenant** created in F32 (consistent with template-first over Rimal-style tenant unless explicitly approved).

---

## 10. Verification

| Command | Purpose |
|---------|---------|
| `npm run retail:verify` | Read-only template + module + guidance checks |
| `npm run mock:verify` | General mock integrity (includes sector catalog) |
| `npm run request:pipeline:verify` | Discovery pipeline (optional) |

**Script:** `scripts/verify-retail-sector-template.ts`

---

## 11. Homepage hero

**File:** `src/components/public/enterprise-operating-model-card.tsx`  

**Scenario chips (after model readiness):** Logistics · Construction · **Retail** · Aviation intake

---

## 12. Deferred (out of F32 scope)

- Live POS / payment gateway integration  
- GS1 / barcode registry integration  
- Loyalty and e-commerce modules as live CEM keys  
- Synthetic retail tenant provisioning  
- Production retail customer or public case study  
- PCI DSS certification or compliance claims  
- Automated payment fraud monitoring  

---

## 13. Validation checklist

Run before marking F32 complete:

```bash
npm run retail:verify
npm run mock:verify
npm run typecheck
npm run lint
npm run build
npm run public:mirror-manifest
```

Optional:

```bash
npm run request:e2e:dry
npm run request:pipeline:verify
```

Do **not** run destructive seeds or production migrations unless explicitly approved.

---

## 14. F32 acceptance

| # | Criterion | Result |
|---|-----------|--------|
| 1 | Retail study documented | This document |
| 2 | Sector template exists / improved | `RETAIL` in sector-template-data |
| 3 | Departments / roles / workflows defined | 12 / 15 / 14 |
| 4 | Module keys are existing CEM only | `RETAIL_RECOMMENDED_CEM_MODULE_KEYS` |
| 5 | SAREA persona model | `sareaProfiles` + guidance hints |
| 6 | CyberCrow posture | `cybercrowBaselines` + guidance |
| 7 | DB/seed readiness documented | §9 |
| 8 | Verification script | `retail:verify` |
| 9 | Hero includes Retail | `enterprise-operating-model-card.tsx` |
| 10 | Validation commands pass | Record in PR / session notes |
| 11 | No forbidden scope | No paid infra / payments / schema |

---

## Files touched (F32)

| File | Change |
|------|--------|
| `src/lib/org-intelligence/sector-template-data.ts` | Full retail operating model + module exports |
| `src/lib/discovery-intelligence/sector-guidance.ts` | Retail discovery / blueprint guidance |
| `src/lib/discovery-templates/retail.json` | Aligned discovery pack |
| `src/components/public/enterprise-operating-model-card.tsx` | Retail scenario chip |
| `scripts/verify-retail-sector-template.ts` | Read-only verification |
| `package.json` | `retail:verify` script |
| `docs/internal/F32_RETAIL_OPERATING_MODEL_PACK.md` | This document |
| `docs/internal/MILESTONES.md` | F32 row |
| `docs/internal/PROJECT_STATUS.md` | F32 status |
