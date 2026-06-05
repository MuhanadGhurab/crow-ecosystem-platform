# M3.5 — Purchase-to-Stock Manual Smoke Test

**Date:** 5 Jun 2026  
**Deployment:** https://crow-ecosystem-platform.vercel.app  
**Commit tested:** `531a9e0` — feat(tenant): harden Business Portal membership access  
**Supabase project:** `wbwnsndcxrgyqwppurms` (hosted/staging)  
**Method:** HTTP route smoke (unauthenticated) + staging membership precheck + local verifier batch. Interactive Google OAuth walkthrough with live credentials was **not** executed in this agent pass (requires human browser).

---

## Environment tested

| Item | Value |
|------|--------|
| Vercel production URL | https://crow-ecosystem-platform.vercel.app |
| Deploy commit | `531a9e0` (includes M3.3, M3.4, M4) |
| `/api/health` | `{"ok":true,"db":"ok","deployReady":true}` |
| Supabase project | `wbwnsndcxrgyqwppurms` |
| Tenant slug | `meem-global` |
| Tenant id (staging) | `cmpi2w8os0020vhqsm33i0gk1` |

**Precheck (git):** `main...origin/main` clean; M3.3 (`5808cec`), M3.4 (`2854164`), M4 (`531a9e0`) committed and pushed.

---

## Account used

| Field | Value |
|-------|--------|
| Email | mkkzero@gmail.com |
| Supabase user id | `307eb72c-57f2-41b7-96c6-2cc20763a49f` |
| Tenant role | `tenant_admin` (owner-level Business Portal access) |
| Membership row | `cmq0tfr690001vhhsg6j49ms8` on `tenant_memberships` |
| Auth metadata | `crow_role: tenant_admin`, `tenant_slugs: ['meem-global']` |

Grant executed on staging via `CYBERCROW_SCRIPT_PRISMA=1` + `--env-file=.env.staging` before this smoke pass.

---

## Tenant tested

**meem-global** — Meem Global staging tenant with CEM Business Portal surfaces, purchase-to-stock workflow prototype, and M4 membership gate.

---

## Access smoke

| Route | HTTP (unauthenticated) | Expected when signed in as tenant admin | Result |
|-------|------------------------|----------------------------------------|--------|
| `/access` | 200 | Business Portal card for `meem-global`; ProCrow only if platform staff | **Pass** (HTTP); **Manual follow-up** (OAuth UI) |
| `/meem-global/dashboard` | 307 → `/login?next=…` | Dashboard loads; CEM framing; no block panel | **Pass** (gated); **Manual follow-up** |
| `/login` | 200 | Google + email sign-in | **Pass** |

**Authenticated walkthrough:** **Not run** in this pass. Code + `tenant-membership:verify` confirm access gateway uses proven tenant slugs and M4 guard on `/[tenant]/*`.

**Operator manual steps:**

1. Sign out; Incognito.
2. Sign in as mkkzero@gmail.com.
3. Open `/access` — confirm Business Portal entry for meem-global.
4. Open `/meem-global/dashboard` — confirm load without `business_portal_blocked`.

---

## Client-only block

| Check | Result |
|-------|--------|
| Client-only account available | **No** — not executed |
| `/access` without tenant membership | **Code + verifier** — client role does not sync Business Portal eligibility (`portal-access-lite`, `portal-access.service`) |
| `/meem-global/*` for non-member | **Code** — `requireTenantBusinessPortalAccess` redirects to `/access?reason=business_portal_blocked` |

**Recommendation:** Create a dedicated client-only smoke account (client role, no `tenant_memberships` row) for future M3.5 reruns.

---

## Wrong tenant slug

| Route | HTTP (unauthenticated) | Authenticated non-member expectation | Result |
|-------|------------------------|--------------------------------------|--------|
| `/wrong-tenant/dashboard` | 307 → login | Block or safe redirect; no tenant data leakage | **Pass** (gated unauthenticated); **Manual follow-up** when signed in |

When authenticated without membership for `wrong-tenant`, M4 guard should redirect to `/access?reason=business_portal_blocked&tenant=wrong-tenant`. `getTenantBySlug` returns null → `notFound()` for unknown slugs on module pages.

---

## Purchase-to-stock route

| Route | HTTP (unauthenticated) | Expected (tenant admin) | Result |
|-------|------------------------|-------------------------|--------|
| `/meem-global/workflows/purchase-to-stock` | 307 → login | Workflow title, stage timeline, disclaimers, next actions, tasks, reports, persistence panel, CyberCrow evidence, SAREA role experience | **Pass** (gated); **Manual follow-up** |

**Code verification:** Page composes `CemTransactionStageTimeline`, `CemTransactionTasksPanel`, `CemTransactionReportPanel`, `CemTransactionEvidencePanel`, `CemTransactionSareaPanel`, `CemWorkflowPersistencePanel`, and amber disclaimer list from snapshot.

**Safe copy checks (code):** Disclaimers and panels state advisory/staging posture; evidence panel explicitly denies certified compliance; finance link says “not payment execution or ledger posting”; warehouse says “not production stock mutation.”

---

## Module link

| Route | HTTP | `TenantCemPurchaseToStockLink` wired | Result |
|-------|------|--------------------------------------|--------|
| `/meem-global/procurement` | 307 | Yes (`moduleKey="procurement"`) | **Pass** (gated + code) |
| `/meem-global/finance` | 307 | Yes | **Pass** |
| `/meem-global/warehouse` | 307 | Yes | **Pass** |
| `/meem-global/inventory` | 307 | Yes | **Pass** |
| `/meem-global/tasks` | 307 | Yes | **Pass** |
| `/meem-global/workflows` | 307 | Yes | **Pass** |
| `/meem-global/reports` | 307 | Yes | **Pass** |

`npm run cem-transaction:verify` confirms all module pages import the purchase-to-stock deep link component.

---

## Reports

Purchase-to-stock report output is rendered on the workflow page via `CemTransactionReportPanel` with persisted/inferred/advisory lineage labels from `auditCemWorkflowPersistenceForTenantSlug`. Reports hub (`/meem-global/reports`) includes purchase-to-stock link and module depth context.

**Result:** **Pass** (code + verifiers); **Manual follow-up** for live lineage labels after OAuth sign-in.

---

## CyberCrow evidence

`CemTransactionEvidencePanel` on purchase-to-stock shows evidence hooks with readiness states and copy: “Advisory evidence posture only — not regulator attestation or certified compliance.”

**Result:** **Pass** (code); **Manual follow-up** for live UI screenshot.

---

## SAREA experience

`CemTransactionSareaPanel` shows role-scoped experience impact (widgets/focus per role) — advisory experience shaping, not permission grants.

**Result:** **Pass** (code); **Manual follow-up** for live UI screenshot.

---

## ProCrow visibility

| Surface | Platform staff account | Result |
|---------|---------------------|--------|
| `/admin/tenants/[tenantId]` — CEM handoff, operating model, module depth, transaction workflow, persistence, membership panels | **Not run** | **Documented not executed** |
| `/admin/go-no-go` — M3.3/M3.4/M3.1/M3.2/M3 gates | **Not run** (307 → login) | **Pass** (gated); gates present in `procrow-go-no-go.service.ts` |

**Go/No-Go dependencies confirmed in code:**

- `cem-transaction-workflow-m33` (M3.3)
- `cem-workflow-persistence-m34` (M3.4)
- `cem-runtime-handoff-m3`, `cem-operating-model-m31`, `cem-module-depth-m32`
- `cybercrow-tenant-trust-m1`, `sarea-blueprint-experience-m2`

**Gap:** No dedicated `tenant-membership-m4` gate key in Go/No-Go service yet; M4 membership preview lives on ProCrow tenant workbench (`AdminTenantMembershipAccessPanel`).

**Operator follow-up:** Sign in as platform staff → open `/admin/tenants/cmpi2w8os0020vhqsm33i0gk1` overview → confirm CEM + membership panels → open `/admin/go-no-go` → confirm dependency cards and safe wording.

---

## Issues found

1. **Authenticated OAuth walkthrough not automated** — agent cannot complete Google sign-in for mkkzero@gmail.com.
2. **Client-only block test not executed** — no dedicated client-only smoke account in this pass.
3. **ProCrow tenant/go-no-go UI not executed** — no platform staff session in this pass.
4. **Go/No-Go missing explicit M4 membership gate key** — workbench panel exists; dedicated gate item optional follow-up.
5. **GitHub CI `postgres-smoke` / `smoke:phase1`** — pre-existing failure (`server-only` guard without `CYBERCROW_SCRIPT_PRISMA` in CI); Vercel deploy health is green.

---

## Validation commands (5 Jun 2026)

| Command | Result |
|---------|--------|
| `npm run purchase-smoke:verify` | **Pass** |
| `npm run tenant-membership:verify` | **Pass** |
| `npm run cem-transaction:verify` | **Pass** |
| `npm run cem-workflow-persistence:verify` | **Pass** |
| `npm run cem-module-depth:verify` | **Pass** |
| `npm run cem-operating-model:verify` | **Pass** |
| `npm run cem-handoff:verify` | **Pass** |
| `npm run access-gateway:verify` | **Pass** |
| `npm run typecheck` | **Pass** |
| `npm run lint` | **Pass** |
| `npm run build` | **Pass** (prisma warning: missing `client_organization_request_links` in local `.env` DB during SSG; build completes) |
| `npm run public:mirror-manifest` | **Pass** |
| Vercel `/api/health` | **Pass** (`deployReady: true`, `db: ok`) |

---

## Tiny fixes applied

**Verifier only** — `scripts/verify-purchase-to-stock-smoke-docs.ts` updated to allow negated safety wording (do-not-claim lists) while still blocking positive forbidden claims. No product code changes.

---

## Final decision

**CONDITIONAL PASS**

M3.5 documentation and verifier wiring are complete. Unauthenticated HTTP smoke confirms auth gating on all Business Portal and ProCrow routes. Staging membership for mkkzero@gmail.com on meem-global is in place. Local verifiers (`tenant-membership:verify`, `cem-transaction:verify`, `cem-workflow-persistence:verify`, etc.) pass.

**Upgrade to full PASS after operator completes:**

- OAuth sign-in walkthrough (Parts 1, 3, 4)
- Client-only block test (Part 2) or dedicated smoke account
- ProCrow tenant + go/no-go panels (Part 5) with platform staff account
- Screenshot pack per [`M3_5_SCREENSHOT_CHECKLIST.md`](M3_5_SCREENSHOT_CHECKLIST.md)

**Recommended next:** **M4B** — Tenant Membership Invite / Onboarding Flow · **M3.4B** — Approved Workflow Persistence Migration · **M3.6** — Purchase-to-Stock UX Refinement
