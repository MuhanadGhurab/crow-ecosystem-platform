# M3.5 — Purchase-to-Stock Demo Script (7–10 minutes)

**Audience:** Stakeholders evaluating CEM staging readiness  
**Environment:** https://crow-ecosystem-platform.vercel.app  
**Sign-in:** mkkzero@gmail.com (tenant_admin on meem-global)  
**Tone:** Staging/demo operational readiness. This demo is **not production launch** — no payments, legal PO, accounting posting, or certified compliance claims.

---

## Before you start

- Use Incognito or a clean profile after sign-out.
- Confirm `/api/health` returns `deployReady: true`.
- Have this script beside the browser; capture screenshots per [`M3_5_SCREENSHOT_CHECKLIST.md`](M3_5_SCREENSHOT_CHECKLIST.md) if recording.

---

## 1. Access gateway (~1 min)

**Route:** `/access`

**Say:**

> Crow uses one sign-in and multiple portals. Client Portal is for implementation requests and onboarding. Business Portal is where tenant employees run day-to-day CEM operations. ProCrow is internal operator control only.

**Show:**

- Business Portal card for **meem-global** (verified tenant membership).
- ProCrow card only if this account has platform staff role.
- Safety notes: staging posture, no auto-provisioning, no production launch claim.

**Do not say:** “Production is live” or “payments are active.”

---

## 2. Enter Business Portal (~1 min)

**Route:** `/meem-global/dashboard`

**Say:**

> CEM runs operations for this tenant — modules, tasks, workflows, and reports on one staging spine. This is demo depth, not a certified ERP go-live.

**Show:**

- CEM / Business Portal framing on dashboard.
- Operating model or module context panels if visible.

**Do not say:** “Accounting is posted” or “Inventory is legally updated.”

---

## 3. Open purchase-to-stock workflow (~2 min)

**Route:** `/meem-global/workflows/purchase-to-stock`

**Say:**

> This is our first cross-module transaction workflow prototype: department need through procurement, finance approval, warehouse receiving, inventory visibility, and report output. It connects modules without executing payments, legal purchase orders, or real stock mutation.

**Show:**

- Amber disclaimer list at top.
- Status / current stage / persistence mode cards.
- **Stage timeline** — Department need → Procurement → Finance → Warehouse → Inventory → Reports.
- **Next action** panel (staging-safe actions only).
- **Persistence panel** — tenant-backed / inferred / missing links (M3.4).
- **Related tasks** and **report output** sections.

**Do not say:** “Supplier paid,” “Legal PO issued,” “Accounting posted,” or “SIEM replacement.”

---

## 4. CyberCrow evidence hook (~30 sec)

**On same page** — scroll to CyberCrow evidence section.

**Say:**

> CyberCrow observes evidence and trust posture for this workflow. Labels are advisory readiness signals — not regulator attestation or certified compliance.

**Show:** Evidence hooks with readiness states and optional link to CyberCrow surfaces.

---

## 5. SAREA role experience hook (~30 sec)

**On same page** — SAREA role experience section.

**Say:**

> SAREA shapes role-specific experience — which widgets and focus areas each role sees. RBAC still controls access; SAREA does not grant permissions.

**Show:** Role cards (e.g. procurement, finance, warehouse) with widget hints.

---

## 6. Module links (~2 min)

Walk these routes briefly; each should link back to purchase-to-stock:

| Route | What to highlight |
|-------|-------------------|
| `/meem-global/procurement` | Purchase request / procurement review stage |
| `/meem-global/finance` | Finance approval readiness — **no payment activation** |
| `/meem-global/warehouse` | Receiving step — **advisory visibility, not stock mutation** |
| `/meem-global/inventory` | Visibility marker — **no legal stock update claim** |
| `/meem-global/tasks` | Workflow-related task context |
| `/meem-global/workflows` | Purchase-to-stock entry in workflow catalog |
| `/meem-global/reports` | Purchase-to-stock report output + lineage posture |

**Say on finance:** “Approval readiness only — we are not running payments or ledger posting in this demo.”

---

## 7. Reports output (~30 sec)

**Route:** `/meem-global/reports` (and workflow report section)

**Say:**

> Report output summarizes stage, blockers, and evidence readiness. Lineage may be tenant-backed, inferred, or advisory depending on what persisted in staging schema.

---

## 8. ProCrow operator view (~1 min, platform staff only)

**Routes:**

- `/admin/tenants/cmpi2w8os0020vhqsm33i0gk1` (meem-global tenant id on staging)
- `/admin/go-no-go`

**Say:**

> ProCrow is where operators review staging readiness — CEM handoff, operating model, module depth, transaction workflow, persistence, and tenant membership access. Go/No-Go lists dependencies; nothing here approves production launch.

**Show:**

- CEM runtime handoff, operating model, module depth, transaction workflow, workflow persistence, tenant membership panels.
- Go/No-Go gates: M3.3 transaction workflow, M3.4 persistence, CyberCrow M1, SAREA M2, CEM M3.x stack.

**Skip this section** if the demo account is tenant-only (no platform staff).

---

## 9. Close with safety (~30 sec)

**Say:**

> What you saw is **staging/demo operational readiness** for the purchase-to-stock path: membership-gated Business Portal access, cross-module workflow UX, persistence visibility, and advisory CyberCrow/SAREA hooks. It is **not** production launch, payment activation, legal purchase order issuance, accounting posting, real inventory mutation, or certified compliance.

**Offer next steps:** M4B invite/onboarding, M3.4B approved persistence migration, or M3.6 UX refinement — per product priority.

---

## Quick reference — routes

```
/access
/meem-global/dashboard
/meem-global/workflows/purchase-to-stock
/meem-global/procurement
/meem-global/finance
/meem-global/warehouse
/meem-global/inventory
/meem-global/tasks
/meem-global/workflows
/meem-global/reports
/admin/tenants/[tenantId]   (platform staff)
/admin/go-no-go               (platform staff)
```
