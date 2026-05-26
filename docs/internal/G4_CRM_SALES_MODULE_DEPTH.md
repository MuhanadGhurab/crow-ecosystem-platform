# G4 — CRM + Sales module depth (no paid infra)

**Status:** Passed (26 May 2026)  
**Constraint:** Commercial operations readiness only — no live payments, AI lead scoring, marketing automation, external CRM, or compliance certification claims.

---

## Part 1 — CRM/Sales module audit

### Routes inspected

| Route | Role | Data |
|-------|------|------|
| `/[tenant]/crm` | CRM readiness hub + accounts/contacts | `crm.service`, readiness snapshot |
| `/[tenant]/sales` | Commercial readiness + pipeline | `sales.service`, readiness snapshot |
| `/[tenant]/finance` | Revenue/expense handoff | G3 finance readiness |
| `/[tenant]/reports` | KPI roll-ups | Reports module |
| `/[tenant]/tasks` · `/workflows` | Approvals coordination | Real tasks/workflows |
| `/admin/requests` · `/admin/requests/[id]` | Implementation intake | Admin pipeline |
| `/request` | Public implementation request | No submission changes |
| Blueprint `request` on tenant | Request-to-account linkage | `referenceCode`, `status` |

### Real vs placeholder

- **Real:** CRM accounts/contacts (`crm.service`), sales opportunities and SAR summaries when module enabled, MEEM mock sales samples when `USE_MOCK_DATA`, workflow/task keyword matches, blueprint request reference on tenant.
- **Advisory:** Recommended CRM/Sales workflows when not matched in DB; sector notes; CyberCrow evidence examples; pipeline SAR labeled as coordination signals.
- **Not in scope:** Live invoicing, payment capture, AI lead scoring, marketing automation, contract signing, external CRM sync, automated revenue.

### Connections

- **Implementation requests:** Blueprint request ref surfaced on CRM/Sales linkage banners.
- **Finance:** Sales page retains `FinanceLinkageBanner`; readiness snapshots flag finance module for handoff.
- **Tasks/Workflows:** Keyword-matched workflows and open task counts per module.
- **Reports:** KPI signal lists in readiness panels (no fake charts).
- **CyberCrow:** Customer-data and commercial approval risks; links when CyberCrow initialized.
- **SAREA:** Persona-specific commercial experience density.

---

## Part 2 — Catalog refinement

Updated `erp-module-catalog.ts`:

- **CRM:** Commercial readiness purpose; deps `sales`, `finance`, `tasks`, `reports`, `workflows`, `cybercrow`; expanded workflows/risks/evidence; `futureOnlyCapabilities` for marketing automation, AI scoring, full CRM replacement.
- **Sales:** Commercial intake and proposal readiness; deps include `tasks`, `reports`, `workflows`, `cybercrow`; `futureOnlyCapabilities` for live payments, contract signing, external CRM, automated revenue.

---

## Part 3 — CRM page UX

`src/app/[tenant]/crm/page.tsx`:

- Stat strip (readiness, accounts, contacts, request link, CRM tasks).
- `CommercialLinkageBanner` (variant `crm`).
- `CrmOperationsReadinessPanel`.
- `TenantRuntimeCrossLinks` (`current="crm"`).
- Existing forms/lists when CRM module enabled; honest empty states.

---

## Part 4 — Sales page UX

`src/app/[tenant]/sales/page.tsx`:

- Always-on readiness content (not gated on MEEM hub only).
- Stat strip, commercial linkage, finance linkage when enabled.
- `SalesCommercialReadinessPanel`.
- Pipeline list when sales module enabled or MEEM mock; advisory SAR labeling.
- MEEM hubs preserved when applicable.

---

## Part 5 — CRM/Sales/Finance linkage

`CommercialLinkageBanner` + cross-links + catalog dependencies document:

- CRM → account/customer context and request linkage.
- Sales → opportunity/proposal readiness and finance handoff.
- Finance → revenue/billing readiness (G3).
- Tasks/Reports → coordination and KPI readiness.

No request submission or billing activation changes.

---

## Part 6 — Workflow/task readiness

`CRM_RECOMMENDED_WORKFLOWS` and `SALES_RECOMMENDED_WORKFLOWS` in `crm-sales-module-depth.ts`; merged with tenant workflows in `crm-sales-readiness.service.ts` (`found` | `recommended` | `partial`).

---

## Part 7 — CyberCrow posture

CRM risks: customer data exposure, unauthorized account changes, stale access, escalation/audit gaps.  
Sales risks: unauthorized commercial approval, proposal audit gaps, revenue handoff gaps, stale opportunities, role misuse.

Evidence examples listed in constants and readiness panels — advisory only.

---

## Part 8 — SAREA experience model

`CRM_SAREA_PERSONAS` and `SALES_SAREA_PERSONAS` — executive, sales manager, account manager, customer service, finance manager, analyst, tenant admin, CyberCrow reviewer. RBAC controls access; SAREA controls experience density.

---

## Part 9 — Reports/KPI readiness

`CRM_REPORT_KPI_SIGNALS` and `SALES_REPORT_KPI_SIGNALS` rendered as readiness lists in panels — no fabricated charts.

---

## Part 10 — Sector relevance

`CRM_SECTOR_NOTES` and `SALES_SECTOR_NOTES` for logistics, retail, construction, aviation, healthcare — advisory, public-safe.

---

## Part 11 — Verification

- `npm run crm-sales:verify` — catalog, routes, services, panels, forbidden-claim negation checks.
- `npm run erp:verify` — module catalog integrity.

---

## Remaining gaps

- No external CRM or email campaign integrations.
- Case management and CPQ remain future-only.
- MEEM still deepest demo for logistics sales samples.
- Public customer portal expansion out of scope.

---

## Recommended next

**G5 — Procurement module depth** (per G1 roadmap).
