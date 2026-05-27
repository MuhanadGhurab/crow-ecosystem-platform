# J8 — ProCrow Demo Rehearsal (no paid infra)

**Status:** Passed (28 May 2026)  
**Audience:** Internal operators, portfolio demos, interview walkthroughs  
**Scope:** Demo rehearsal only — documentation, route audit, playbook, screenshot checklist, validation. **Not** a feature phase.

---

## 1. Objective

Deliver a **10-minute ProCrow control-tower demo path** that shows how Crow Ecosystem moves from customer request to disciplined tenant runtime — with ProCrow owning platform administration, CyberCrow governing trust, SAREA governing experience, and go/no-go / operator console enforcing deployment and validation discipline.

**Prove:**

- ProCrow owns Platform Admin (`/admin/*`)
- ProCrow controls customer-to-tenant flow (queue + request detail)
- CyberCrow handles trust / security / evidence / GRC / risk (advisory)
- SAREA handles experience orchestration (RBAC vs experience boundary)
- Go/No-Go keeps deployment controlled (F23-gated)
- Operator Console keeps docs and validation commands organized (manual execution only)

**Do not claim:** production launch, live payments, auto-provisioning, certified compliance, autonomous security/AI, legal audit readiness, SIEM replacement.

---

## 2. Demo storyline (summary)

> ProCrow is the **internal control tower** of Crow Ecosystem. It supervises the journey from customer request to safe tenant runtime. It does **not** automatically launch production, activate payments, or replace human review. It gives operators visibility, validation discipline, and trust/experience checks.

| Beat | Route | Message |
|------|-------|---------|
| 1 | `/admin/overview` | Control Tower — pipeline, queue embed, deployment discipline links |
| 2 | `/admin/queue` | Derived operator queue — no separate task engine |
| 3 | `/admin/requests/[requestId]` | Request detail — client approval / onboarding readiness |
| 4 | `/[tenant]/cybercrow/*` | Trust cockpit — evidence, GRC, risk (advisory) |
| 5 | `/sarea/overview` (+ preview / role-mapping) | Experience Studio — tenant-backed vs fallback |
| 6 | `/admin/go-no-go` | F23 gate, validation baseline, migration/payment safety |
| 7 | `/admin/operator-console` | Runbooks + npm verifiers — **manual terminal only** |
| Close | — | Control, safety, trust, operator clarity, disciplined deployment |

Full script: [`J8_PROCROW_DEMO_REHEARSAL_PLAYBOOK.md`](J8_PROCROW_DEMO_REHEARSAL_PLAYBOOK.md)

---

## 3. Route audit (Part 1)

See [`J8_PROCROW_DEMO_ROUTE_AUDIT.md`](J8_PROCROW_DEMO_ROUTE_AUDIT.md) for the full table: required vs optional routes, auth requirements, thin-data fallbacks, and manual smoke gaps.

**Open first:** `/admin/overview` (signed in as Platform Admin).

**10-minute core:** overview → queue → request detail → CyberCrow dashboard + one of evidence/GRC/risk → SAREA overview + role-mapping or preview → go/no-go → operator console.

**Optional / skip in short demos:** `/admin/notifications`, `/admin/tenants/[tenantId]`, client bridge (`/client/*`), `/proposal/[token]`, SAREA rules/layouts/device-rules, CyberCrow compliance/incidents/sessions.

---

## 4. Deliverables

| Artifact | Path |
|----------|------|
| Route audit | [`J8_PROCROW_DEMO_ROUTE_AUDIT.md`](J8_PROCROW_DEMO_ROUTE_AUDIT.md) |
| 10-minute playbook | [`J8_PROCROW_DEMO_REHEARSAL_PLAYBOOK.md`](J8_PROCROW_DEMO_REHEARSAL_PLAYBOOK.md) |
| Screenshot checklist | [`J8_PROCROW_SCREENSHOT_CHECKLIST.md`](J8_PROCROW_SCREENSHOT_CHECKLIST.md) |
| Practical runbook | [`PROCROW_DEMO_RUNBOOK.md`](PROCROW_DEMO_RUNBOOK.md) |
| Operator index updates | [`OPERATOR_DEMO_INDEX.md`](OPERATOR_DEMO_INDEX.md) · [`PROCROW_OPERATOR_INDEX.md`](PROCROW_OPERATOR_INDEX.md) |

---

## 5. Tiny UI polish (Part 6)

- Overview **demo path hint** (`procrow-demo-rehearsal-hint.tsx`) — links queue → go/no-go → operator console; staging/demo wording only.
- Existing J6/J7 cross-links on go/no-go ↔ operator console ↔ queue unchanged (no duplicate safety banners added).

---

## 6. Validation (Part 7)

Required (documented in runbook; run before demo or after J8 doc changes):

```bash
npm run mock:verify
npm run typecheck
npm run lint
npm run build
npm run public:mirror-manifest
npm run procrow:verify
npm run procrow-dashboard:verify
npm run procrow-queue:verify
npm run procrow-go-no-go:verify
npm run procrow-operator:verify
npm run procrow-demo:verify
npm run cybercrow:verify
npm run sarea:ux-verify
npm run client-portal:verify
npm run client-profile:verify
npm run client-review:verify
npm run client-approval:verify
npm run client-onboarding:verify
npm run client-demo:verify
npm run client-org:verify
npm run client-notes:verify
```

Optional: `npm run erp:verify` · `npm run runtime:verify` · `npm run request:pipeline:verify`

**Not run in J8:** migrations, destructive seeds, payment activation, tenant auto-provision.

---

## 7. Verification script

- `scripts/verify-procrow-demo-rehearsal.ts`
- `npm run procrow-demo:verify`
- Included in `npm run procrow:verify` chain

---

## 8. Recommended next phase

| Option | When |
|--------|------|
| **Pause** (recommended) | No interview/demo pressure — J1–J8 arc is demo-ready |
| **K1 — Tenant Runtime Demo Rehearsal** | Need a tenant-module depth walkthrough after ProCrow |
| **J9 — ProCrow Checkpoint & Pause** | Formal checkpoint doc only (no new UI) |

**Recommendation:** **Pause after J8** unless there is active demo or interview pressure.

---

## 9. Acceptance

J8 **PASSED** when all items in the user acceptance criteria are met (route audit, playbook, checklist, runbook, indexes, status/milestones, validation green, verifier, no forbidden scope).

**Validation run (28 May 2026):** `mock:verify`, `typecheck`, `lint`, `build`, `public:mirror-manifest`, full `procrow:verify` (J1–J8), and client guardrail scripts — all green. No migrations, seeds, or payment activation.
