# G3 — Finance module depth (no paid infra)

**Status:** Passed (26 May 2026)  
**Constraint:** Financial operations readiness only — no live payments, tax/VAT engine, full accounting, or compliance certification claims.

---

## Part 1 — Finance module audit

### Routes inspected

| Route | Current role | Data |
|-------|----------------|------|
| `/[tenant]/finance` | Finance readiness hub + optional ledger | `FinanceEntry`, readiness snapshot |
| `/[tenant]/sales` | Pipeline / opportunities | `SalesOpportunity` when enabled |
| `/[tenant]/procurement` | Purchase requests | `PurchaseRequest` + `linkedFinanceRef` |
| `/[tenant]/settings/plan` | Plan advisory | `getTenantCapabilitySnapshot` |
| `/admin/subscriptions` | Platform subscriptions | Admin (out of tenant hub scope) |
| `/[tenant]/tasks` | Approvals / work items | Real tasks |
| `/[tenant]/workflows` | Workflow definitions | Real workflows |
| `/[tenant]/reports` | KPI roll-ups | `getReportsKpiSummary` |
| `/[tenant]/cybercrow/*` | Advisory GRC/evidence/audit | CyberCrow init flag |

### Real vs placeholder

- **Real:** Finance ledger lines (`finance.service`), sales/procurement summaries when modules enabled, workflow/task keyword matches, plan snapshot, reports finance entry count.
- **Advisory / recommended:** Finance workflow patterns when not matched in DB; sector finance notes; evidence examples; plan/subscription review.
- **Not in scope:** Live payments, Stripe checkout activation, tax/VAT, bank feeds, GL engine, payment reconciliation automation, fraud detection product.

### Connections

- **Sales:** Pipeline and won SAR contribute to revenue readiness; optional linked references on ledger lines.
- **Procurement:** PR value and `linkedFinanceRef` for expense handoff.
- **Plan:** Advisory entitlements via `settings/plan` — no self-service checkout in this phase.
- **Tasks/Workflows:** Approval readiness via keyword-matched workflows and open task counts.
- **Reports:** Finance entry count in KPI summary when finance module enabled.
- **CyberCrow:** Financial posture risks and evidence readiness.
- **SAREA:** Persona-specific finance experience density.

### Gaps before G3

- Finance page content only rendered for MEEM logistics demo hub — empty for most tenants.
- Catalog still read like a mini-GL product (journal entry, payment release).
- No cross-links from sales/procurement/plan to finance posture.

---

## Part 2 — Catalog refinement

Updated `src/lib/constants/erp-module-catalog.ts` Finance entry:

- Purpose: financial operations readiness (not full accounting).
- Dependencies: `sales`, `procurement`, `crm`, `tasks`, `reports`, `cybercrow`.
- Expanded workflows, report signals, CyberCrow/SAREA hints.
- `futureOnlyCapabilities`: live payments, tax engine, bank integration, full GL, reconciliation automation.

---

## Part 3 — Finance page UX

`src/app/[tenant]/finance/page.tsx` now includes:

- Honest scope in `TenantModulePage` description.
- `TenantRuntimeStatStrip` (readiness, ledger, AR/AP, sales pipeline, PR value).
- `FinanceOperationsReadinessPanel` (summary, revenue/procurement, approvals, plan advisory, workflows, CyberCrow, SAREA, KPIs, sector note).
- Optional MEEM `ErpModuleHub` / `MeemFinanceHub` when logistics demo applies.
- Ledger list when finance module enabled (real or mock MEEM data).
- `TenantRuntimeCrossLinks` with `current="finance"`.

---

## Part 4 — Sales / procurement / subscription linkage

`FinanceLinkageBanner` on:

- `sales` — revenue readiness context.
- `procurement` — expense handoff; warns when PRs lack finance reference.
- `settings/plan` — subscription advisory; warns on plan key mismatch.

No checkout activation or billing logic changes.

---

## Part 5 — Workflow / task readiness

`finance-module-depth.ts` defines 10 recommended finance workflows.  
`finance-readiness.service.ts` matches tenant workflows/tasks by finance keywords and marks found / partial / recommended.

---

## Part 6 — CyberCrow finance posture

Documented risks and evidence examples on the finance panel with links to GRC, evidence, and audit logs. Advisory only — not fraud detection or certified audit.

---

## Part 7 — SAREA finance experience

Eight personas (executive, finance manager, procurement, sales, department manager, analyst, tenant admin, CyberCrow reviewer). RBAC vs SAREA separation reiterated.

---

## Part 8 — Reports / KPI readiness

KPI signal list on panel; live count from `getReportsKpiSummary` when reports module enabled. No fabricated charts.

---

## Part 9 — Sector relevance

Five sector notes (logistics, retail, construction, aviation, healthcare) — public-safe advisory.

---

## Part 10 — Verification

| Command | Result |
|---------|--------|
| `npm run finance:verify` | G3 finance depth checks |
| `npm run erp:verify` | Catalog + integration map |
| `npm run mock:verify` | Mock mode guards |
| `npm run typecheck` | TypeScript |
| `npm run lint` | ESLint |
| `npm run build` | Next.js build |
| `npm run public:mirror-manifest` | Public mirror |

---

## Remaining gaps

- Finance ledger remains operator-seeded — no automated sales-to-cash posting.
- Non-MEEM tenants without finance module still see readiness hub but not ledger section.
- Admin subscription screens not deepened in G3 (tenant plan advisory only).

---

## Recommended next

**G4 — CRM + Sales module depth** per G1 roadmap.
