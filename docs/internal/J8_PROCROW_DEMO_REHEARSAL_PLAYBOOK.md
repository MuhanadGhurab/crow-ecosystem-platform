# J8 — ProCrow 10-minute demo rehearsal playbook

**Audience:** Internal demo, portfolio review, interview operator walkthrough  
**Mode:** Staging / mock / portfolio — **no production**, **no paid infra**, **no live payments**

**Prerequisites:** [`PROCROW_DEMO_RUNBOOK.md`](PROCROW_DEMO_RUNBOOK.md) · Platform Admin session · optional `npm run meem:ids:staging`

---

## Browser tabs (recommended)

Open before presenting (left → right):

1. `/admin/overview` (present tab)
2. `/admin/queue`
3. `/admin/requests` (pick one row ID for detail)
4. `/meem-global/cybercrow/dashboard` (or your lighthouse tenant)
5. `/meem-global/cybercrow/evidence`
6. `/sarea/overview`
7. `/sarea/role-mapping` or `/sarea/preview`
8. `/admin/go-no-go`
9. `/admin/operator-console`

Keep `/client` closed unless asked — use I8 playbook for client-only demos.

---

## Script (10 minutes)

### 0:00–1:00 — ProCrow definition

**Stay on:** `/admin/overview` (header + safety note)

**Say:**  
“ProCrow is Crow’s **internal control tower**. It does not replace ERP modules or client-facing portals. It supervises how a customer request becomes a **disciplined** tenant runtime — with human operators in the loop. We are in **staging/demo mode**: advisory signals, no automatic production launch, no live payments, no auto-provisioning from a button click.”

**Do not claim:** Production go-live, certified compliance, autonomous AI, billing enforcement.

---

### 1:00–2:00 — Control Tower

**Click:** Scroll control tower map + dashboard — pipeline counts, embedded **operator queue** panel.

**Say:**  
“This is the operator’s home: customer-to-tenant visibility, trust and experience links, and deployment discipline entry points. Counts may be mock-backed — the value is **operator clarity**, not fake precision.”

**Optional click:** `Open go/no-go center` or `Open operator console` cards (preview only — return to overview).

**Fallback:** If counts are zero, say “empty pipeline is fine — queue rules still apply when data exists.”

---

### 2:00–3:00 — Operator queue

**Go to:** `/admin/queue`

**Say:**  
“This queue is **derived** from requests, blueprints, client review, and onboarding signals. There is no separate task engine — ProCrow prioritizes what an operator should look at next, without auto-executing provisioning.”

**Click:** One row → open request detail (next beat).

**Do not claim:** Automated workflow engine, SLA guarantees, auto tenant creation.

---

### 3:00–4:00 — Request detail

**Go to:** `/admin/requests/[requestId]`

**Say:**  
“Here ProCrow owns **readiness** for the customer-to-tenant path: client portal signals, proposal scope, onboarding posture. Approval and provisioning remain **operator-guided** and **F23-gated** for production.”

**Point at:** Client linkage / onboarding hints if visible.

**Fallback:** Tour table structure without deep data; reference J3 operator queue doc.

---

### 4:00–5:30 — CyberCrow (trust cockpit)

**Go to:** `/[tenant]/cybercrow/dashboard` then **one** of evidence, GRC, or risk.

**Say:**  
“CyberCrow is **ProCrow’s trust and security layer** on the tenant — evidence readiness, GRC mapping, risk review, audit visibility. It is **advisory**: not a SIEM, not autonomous detection, not a certification badge.”

**Show:** Trust strip, summary cards, operator next actions.

**Do not claim:** Regulator-certified status, pen-tested production, 24/7 SOC automation.

**Fallback:** If tenant 404, run `meem:ids:staging` and use MEEM URLs from runbook.

---

### 5:30–6:45 — SAREA (Experience Studio)

**Go to:** `/sarea/overview` → `/sarea/role-mapping` **or** `/sarea/preview`

**Say:**  
“SAREA is the **experience studio** under ProCrow. **RBAC controls access**; SAREA controls navigation, widgets, and persona adaptation. Some packs are tenant-backed; others show honest **fallback** demo personas.”

**Do not claim:** SAREA replaces RBAC, drag-drop production CMS, autonomous personalization.

---

### 6:45–8:00 — Deployment go/no-go

**Go to:** `/admin/go-no-go`

**Say:**  
“Before anyone treats staging as production, this center shows **advisory readiness**: validation baseline, F23 production gate, migration and payment guardrails. Passing a gate here does **not** run migrations or deploy — operators run npm scripts in the terminal with explicit approval.”

**Point at:** F23 production decision vs demo readiness decision.

**Do not claim:** One-click deploy, “ready for production” because UI is green.

---

### 8:00–9:00 — Operator console

**Go to:** `/admin/operator-console`

**Say:**  
“This is the **discipline index**: internal runbooks and the npm verifier catalog. Same command list as go/no-go, with richer metadata. **Nothing executes from the browser** — copy commands to your terminal after review.”

**Optional:** Mention `npm run procrow:verify` as the ProCrow stack regression batch.

---

### 9:00–10:00 — Close

**Return to:** `/admin/overview` or stay on operator console.

**Say:**  
“ProCrow gives Crow **control, safety, and operator clarity** across trust, experience, and deployment — without overclaiming production launch. Next step for engineering is running the validation batch in [`PROCROW_DEMO_RUNBOOK.md`](PROCROW_DEMO_RUNBOOK.md); next step for the business is **human go/no-go** under F23, not a UI button.”

**Safe closing line:**  
“We demo **governance and discipline** in portfolio mode — not live commercial launch.”

---

## Forbidden claims (quick reference)

- Commercial production go-live approved / live for paying customers
- Live payments or checkout enabled
- Automatic tenant provisioning from client approval
- Certified compliance (SOC2, ISO, NCA certification, etc.)
- Autonomous security detection or AI-driven remediation
- Legal audit readiness or substitute for auditor deliverables
- SIEM / SOC replacement
- One-click deployment from ProCrow UI

---

## Safe wording (use freely)

- Internal control tower
- Operator-guided
- Advisory readiness
- ProCrow-controlled
- F23-gated production
- Staging / demo / portfolio mode
- No paid infra activated
- Deployment discipline
- Trust and experience governance
- Manual terminal execution

---

## Related docs

| Doc | Use |
|-----|-----|
| [`J8_PROCROW_DEMO_ROUTE_AUDIT.md`](J8_PROCROW_DEMO_ROUTE_AUDIT.md) | Route tiers and gaps |
| [`J8_PROCROW_SCREENSHOT_CHECKLIST.md`](J8_PROCROW_SCREENSHOT_CHECKLIST.md) | Capture list |
| [`PROCROW_OPERATOR_INDEX.md`](PROCROW_OPERATOR_INDEX.md) | Full operator map |
| [`I8_CLIENT_PORTAL_DEMO_PLAYBOOK.md`](I8_CLIENT_PORTAL_DEMO_PLAYBOOK.md) | Client-only path |
| [`H1_DEMO_REHEARSAL_PLAYBOOK.md`](H1_DEMO_REHEARSAL_PLAYBOOK.md) | Full product breadth |
