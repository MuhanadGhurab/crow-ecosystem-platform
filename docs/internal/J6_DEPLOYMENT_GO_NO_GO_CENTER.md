# J6 — ProCrow Deployment Go/No-Go Center (no paid infra)

**Status:** Passed (27 May 2026)  
**Audience:** Internal operators / engineering  
**Scope:** Visibility, checklist discipline, and **advisory** release readiness — **not** automatic deployment, not CI/CD replacement, not compliance certification.

---

## 1. Deployment / validation audit (Part 1)

### 1.1 Documentation corpus

| Area | Documents reviewed |
|------|-------------------|
| Production gate | `F23_PRODUCTION_LAUNCH_DEFERRED_GATE.md` — commercial launch explicitly deferred; approvals listed |
| Validation | `VALIDATION_PLAYBOOK.md` — script expectations and gates |
| Git safety | `GIT_SAFETY_GUIDE.md` — commit hygiene, forbidden paths |
| Project state | `PROJECT_STATUS.md`, `MILESTONES.md` — J-series arc |
| Operator / demo | `OPERATOR_DEMO_INDEX.md`, `PROCROW_OPERATOR_INDEX.md` |
| Client flow | `CLIENT_PORTAL_RUNBOOK.md` |
| Portfolio / hygiene | `F30_FINAL_PORTFOLIO_RELEASE_TAG.md`, `F31_WORKSPACE_HYGIENE_RELEASE_CLEANLINESS.md` |

### 1.2 Scripts (`package.json`)

**Baseline (read-only / local compile):** `mock:verify`, `typecheck`, `lint`, `build`, `public:mirror-manifest`.

**ProCrow stack verifiers:** `procrow:verify` (chains J1–J6 including `procrow-go-no-go:verify`), `procrow-dashboard:verify`, `procrow-queue:verify`, `cybercrow:verify`, `sarea:ux-verify`.

**Client portal guardrails:** `client-portal:verify`, `client-profile:verify`, `client-review:verify`, `client-approval:verify`, `client-onboarding:verify`, `client-demo:verify`, `client-org:verify`, `client-notes:verify`.

**Runtime / product:** `erp:verify`, `sector:verify`, `runtime:verify`, `request:pipeline:verify`.

**Deployment-sensitive / DB-write (never casual):** `simulate:vercel-build:staging`, `db:migrate:deploy`, `db:seed:sectors`, `db:seed:meem` — see command index in contract `buildProCrowValidationCommandIndex()`.

**Safe posture:** `db:generate` — generates client only; does not apply DDL.

### 1.3 Deployment config

- `vercel.json` — hosting / routing; no go/no-go logic.
- `scripts/vercel-build-guard.mjs` — build-time guardrails.
- `scripts/migrate-deploy.mjs` — **only when explicitly invoked** in approved pipelines; not triggered from ProCrow UI.

### 1.4 Surfaces before J6

- `/admin/overview`, `/admin/queue`, `/admin/notifications` — existing ProCrow shell.
- CyberCrow / SAREA readiness copy on respective studio pages (J4/J5).

### 1.5 Gap addressed by J6

Operators lacked a **single admin surface** summarizing: F23 posture, validation baseline, dangerous commands, migration/payment/provisioning cautions, and next actions — without running anything in-browser.

---

## 2. Data model result

**File:** `src/lib/procrow/procrow-go-no-go-contract.ts`

- `ProCrowGoNoGoDecision`, `ProCrowGateCategory`, `ProCrowGateStatus`, `ProCrowGateItem`, `ProCrowValidationCommand`, `ProCrowGoNoGoSnapshot`.
- `PROCROW_F23_PRODUCTION_GATE_ACTIVE` — documents that production commercial launch remains gated (boolean constant; not a runtime “unlock”).
- `PROCROW_GO_NO_GO_DOC_REFS` — internal doc links only.
- `buildProCrowValidationCommandIndex()` — full command list with `riskLevel` and `requiredForDemo` / `requiredForPush` / `requiredForProduction`.

---

## 3. Service result

**File:** `src/lib/services/procrow-go-no-go.service.ts` (`server-only`)

- `getProCrowGoNoGoSnapshot()` returns static/advisory gates + validation index + blockers/warnings/nextActions.
- **Does not:** execute shell commands, read `.env`, call Prisma, deploy, or migrate.

---

## 4. UI / route result

**Components:** `src/components/procrow/`

- `procrow-go-no-go-center.tsx` — layout shell.
- `procrow-go-no-go-decision-badge.tsx`, `procrow-gate-status-card.tsx`, `procrow-validation-command-list.tsx`, `procrow-deployment-safety-checklist.tsx`, `procrow-release-blockers-panel.tsx`, `procrow-go-no-go-overview-link.tsx`.

**Route:** `src/app/admin/go-no-go/page.tsx` — **admin-only** (`/admin/go-no-go`), `ProCrowPageHeader`, embedded center.

**Nav:** `src/app/admin/layout.tsx` + `src/lib/routes.ts` (`admin.goNoGo`).

---

## 5. Admin overview / queue linkage

- **Overview:** `procrow-go-no-go-overview-link` on `/admin/overview` — compact card / link to go/no-go.
- **Queue:** `/admin/queue` — textual pointer to go/no-go as operator next step where relevant; **no** queue mutation.

---

## 6. Validation command index

Authoritative list: `buildProCrowValidationCommandIndex()` in the contract.

**Groupings:**

| Group | Examples |
|-------|----------|
| Baseline | `mock:verify`, `typecheck`, `lint`, `build`, `public:mirror-manifest` |
| Client portal | `client-*:verify` scripts |
| ProCrow | `procrow:verify`, `procrow-dashboard:verify`, `procrow-queue:verify`, `cybercrow:verify`, `sarea:ux-verify`, `procrow-go-no-go:verify` |
| Runtime / product | `erp:verify`, `sector:verify`, `runtime:verify`, `request:pipeline:verify` |
| Deployment-sensitive | `simulate:vercel-build:staging`, `db:migrate:deploy`, destructive seeds |

---

## 7. F23 production gate visibility

Copy in UI and service states clearly:

- Production commercial launch remains **F23-gated**.
- Requires: client/budget approval, production environment approval, migration approval, backup/rollback plan, payment decision, security review, manual smoke tests, **explicit go/no-go sign-off**.
- **No** wording: production ready, launch approved, compliance certified, automated release approval.

---

## 8. Migration / database safety

- Migrations **change remote schema** when applied against a live DB.
- Vercel (or CI) **may** run `db:migrate:deploy` only when **explicitly** wired — treat as deployment-sensitive.
- **No** migration execution from ProCrow UI.
- **No** destructive seeds in default path; seeds flagged as `db_write` in index.
- **`prisma generate` / `db:generate`** — client only; no DDL.
- **I9** referenced as pattern: additive migration, explicitly approved before push.

---

## 9. Payments / tenant provisioning safety

**Payments:** Live payments disabled/deferred; pricing advisory; no checkout activation without approval.

**Tenants:** No auto-provisioning from client approval; onboarding ProCrow-controlled; tenant runtime readiness ≠ production launch.

---

## 10. Verification

**Script:** `scripts/verify-procrow-go-no-go.ts`  
**Command:** `npm run procrow-go-no-go:verify`

Checks: required files, admin nav, overview/queue references, forbidden phrases in J6 UI files, no `service_role` in go/no-go UI, `procrow:verify` includes this script.

---

## 11. Remaining gaps

- In-app pass/fail for `npm run *` is **intentionally** not implemented — operators run scripts locally/CI; center remains **metadata + discipline**.
- No integration with external status APIs (forbidden scope).
- **J7** can add Operator Docs & Validation Console for deeper doc/script cross-linking if desired.

---

## 12. Recommended next phase

**Primary:** **J7 — Operator Docs & Validation Console** — consolidate runbooks and validation UX.  
**Alternative:** **J7 — ProCrow Demo Rehearsal** — rehearsal checklist tied to `OPERATOR_DEMO_INDEX.md`.

---

## Acceptance checklist (J6)

1. Deployment/validation audit documented — **this file + Part 1**.  
2. Go/no-go data model — **contract**.  
3. Read-only service — **service**.  
4. Go/no-go UI — **components + page**.  
5. Dedicated `/admin/go-no-go` — **yes** (admin-protected).  
6. Overview/queue linkage — **yes**.  
7. Validation command index — **contract**.  
8. F23 surfaced — **service + UI**.  
9. Migration/DB safety — **service + UI**.  
10. Payment/provisioning safety — **service + UI**.  
11. Verifier + npm script — **yes**.  
12. Operator index / project status / milestones — **updated**.  
13. Validation commands — run per `VALIDATION_PLAYBOOK` before demo/push.  
14. No migrations, payments, production launch, auth weakening, auto-provision, forbidden scope from J6.  
15. No compliance/AI/customer/legal overclaims in J6 surfaces.
