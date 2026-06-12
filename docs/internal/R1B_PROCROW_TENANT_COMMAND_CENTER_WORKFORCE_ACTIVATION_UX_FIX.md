# R1B — ProCrow Tenant Command Center & Workforce Activation UX Fix

**Date:** 6 Jun 2026  
**Branch:** `feat/m4c-tenant-invite-acceptance`  
**Scope:** Redesign `/admin/tenants/[tenantId]` into a Tenant Command Center so operators can find and run Business Portal Invite without hunting. No migrations, seeds, payments, email provider, auth weakening, or token security changes.

---

## Decision

**R1B: PASSED** — Tenant page redesigned as command center; Business Portal Invite visible at top via primary action bar and dedicated Workforce Activation tab; break-glass separated to Advanced; security boundaries preserved; full verifier suite + build green. M4C.1.1 remains **UX BLOCKED / NOT FULL PASS** until operator retests manual smoke on preview. PR #1 not merged.

---

## Why M4C.1.1 failed (UX classification)

M4C.1.1 operator smoke was attempted on tenant `meem-global` (`cmpi2w8os0020vhqsm33i0gk1`). Backend/token invite flow and automated verifiers were green, but the **operator journey failed**:

| UX problem | Impact |
|------------|--------|
| Business Portal Invite buried low on a long stacked tenant page | Operator could not find invite action quickly |
| Equal visual weight across many cards/sections | No clear “do this first” guidance |
| No step-by-step lifecycle framing | Invite creation felt disconnected from tenant prep |
| Break-glass grant adjacent to normal invite | Recovery path competed with standard workforce activation |
| Feature-dump layout vs command center | Page not understandable in ~10 seconds |

**Product decision:** M4C.1.1 is **NOT FULL PASS** — **UX BLOCKED** until R1B ships and operator retests.

---

## Layout changes

### 1. Tenant command header

**Component:** `src/components/admin/tenant-command-center-header.tsx`  
**Constants:** `src/lib/constants/tenant-command-center.ts`

- Title: **Tenant Command Center**
- Subtitle: prepare runtime, activate workforce, monitor Business Portal readiness
- Shows tenant name (prominent), slug, status, runtime state, Business Portal readiness, membership count, created/updated context
- Status chips with consistent meaning (no paragraph walls)

### 2. Primary action bar

**Component:** `src/components/admin/tenant-command-center-action-bar.tsx`

| Action | Behavior |
|--------|----------|
| **Create Business Portal Invite** (primary) | Sets `?tab=workforce`, smooth-scrolls to `#tenant-workforce-activation`, focuses `#m4c-invite-email` |
| Open Business Portal | Links to tenant dashboard when slug present |
| View Access Gateway | `/access` |
| Review Go/No-Go | `/admin/go-no-go` |
| View Request / Blueprint | When linked request/blueprint IDs exist |

Invite CTA is **above the fold** without scrolling on typical viewports.

### 3. Lifecycle stepper

**Component:** `src/components/admin/tenant-lifecycle-stepper.tsx`

Steps: Request → Discovery → Blueprint → Runtime Preparation → **Workforce Activation** (current) → Business Portal Operations

Explains where invite creation fits in the tenant lifecycle (not decorative-only).

### 4. Main workspace tabs

**Component:** `src/components/admin/tenant-control-room-nav.tsx`

| Tab | Purpose |
|-----|---------|
| Overview | Short readiness + next actions |
| Runtime Readiness | Lifecycle pipeline + runtime prep |
| **Workforce Activation** | Business Portal Invite (M4C.1.1 focus) |
| Business Portal / CEM | Operating model + CEM runtime copy |
| CyberCrow & SAREA | Trust readiness + experience panels |
| Evidence & Logs | Audit / evidence |
| Advanced | Plan, org model, break-glass, grant form |

Default tab: **Overview** (includes prominent invite CTA via next-actions card). Legacy tab query params map to new tabs (`plan`/`organization` → `advanced`, etc.).

### 5. Overview tab

**Component:** `src/components/admin/tenant-command-center-overview.tsx`

- Tenant readiness summary (runtime, workforce, portal access)
- **Next actions** card with buttons: create invite, confirm acceptance, open portal, review Go/No-Go
- Membership access panel + concise ProCrow/CEM relationship copy

### 6. Workforce Activation tab

- **Section:** `Tenant Workforce Activation` (`TENANT_WORKFORCE_ACTIVATION_TITLE`)
- **Panel:** `admin-tenant-membership-invite-panel.tsx` at top with `id="tenant-workforce-activation"`
- Email, role (`tenant_user` / `tenant_admin`), 7-day expiry, optional note
- Manual copy-link chip + honest “email delivery not active” warning
- Invite history table: email, role, status, created, expires, **accepted at**, revoke for pending
- Short safety disclaimers (Business Portal only; no ProCrow/platform/client approval/production)

**Hash deep-link:** `#tenant-workforce-activation` + `TenantCommandCenterWorkforceFocus` client helper.

### 7. Advanced / break-glass

**Component:** `src/components/admin/admin-tenant-membership-break-glass-panel.tsx`

- Moved out of invite panel into **Advanced** tab only
- Amber-styled “Advanced / Break-glass membership grant”
- Copy: recovery/testing only; normal path is Business Portal Invite
- M4B immediate grant form (optional Supabase invite API checkbox) unchanged in behavior

---

## How Business Portal Invite is accessed now

1. Land on `/admin/tenants/[tenantId]` → see command header + **Create Business Portal Invite** in action bar.
2. Click primary CTA → **Workforce Activation** tab + scroll + email focus.
3. Or open **Workforce Activation** tab directly from nav.
4. Or use **Overview → Next actions → Create Business Portal invite**.

Test tenant: `/admin/tenants/cmpi2w8os0020vhqsm33i0gk1` (`meem-global`).

---

## Security boundaries preserved

| Rule | Status |
|------|--------|
| `tenant-invite` in `RESERVED_PATH_SEGMENTS` | Unchanged |
| Invite roles: `tenant_user` / `tenant_admin` only | Unchanged |
| No `platform_admin`, ProCrow, or client approval in invite UI | Unchanged |
| No email-domain auto-join / public self-join | Unchanged |
| Exact invited email on acceptance | Unchanged |
| `tokenHash` storage only; manual copy-link mode | Unchanged |
| No email provider added | Unchanged |
| Auth / token security not weakened | Unchanged |

---

## Files touched (implementation)

| Area | Files |
|------|-------|
| Page composition | `src/app/admin/tenants/[tenantId]/page.tsx` |
| Command center UI | `tenant-command-center-*.tsx`, `tenant-lifecycle-stepper.tsx` |
| Nav / tabs | `tenant-control-room-nav.tsx` |
| Invite panel | `admin-tenant-membership-invite-panel.tsx` |
| Break-glass | `admin-tenant-membership-break-glass-panel.tsx` |
| Constants | `src/lib/constants/tenant-command-center.ts` |
| Verifiers (tolerance) | `scripts/verify-procrow-workbench-ux.ts`, `scripts/verify-architecture-simplification.ts` |

---

## Verification results

Run 6 Jun 2026 on branch `feat/m4c-tenant-invite-acceptance` (R1B local, uncommitted):

| Command | Result |
|---------|--------|
| `npm run tenant-invite-acceptance:verify` | **PASS** |
| `npm run tenant-invite:verify` | **PASS** |
| `npm run tenant-membership:verify` | **PASS** |
| `npm run access-gateway:verify` | **PASS** |
| `npm run auth-landing:verify` | **PASS** |
| `npm run architecture-simplification:verify` | **PASS** |
| `npm run public-homepage:verify` | **PASS** |
| `npm run procrow-workbench:verify` | **PASS** |
| `npm run typecheck` | **PASS** |
| `npm run lint` | **PASS** |
| `npm run build` | **PASS** (local Prisma warning: `client_organization_request_links` missing — non-blocking) |
| `npm run public:mirror-manifest` | **PASS** |
| `npm run smoke:phase1` | **PASS** |

No migrations, seeds, payments, or email provider changes.

---

## Remaining blockers

1. **M4C.1.1 operator browser smoke** Parts 2–9 not re-run after R1B — retest required on preview (Vercel bypass) with platform staff session.
2. **PR #1 not merged** — do not merge until UX retest passes.
3. **Staging migration SQL** on `wbwnsndcxrgyqwppurms` — still not independently verified in this pass.
4. **Uncommitted R1B work** — commit/push when operator requests.

---

## Recommended next phase

| Priority | Phase |
|----------|-------|
| 1 | Operator M4C.1.1 retest on `meem-global` using new command center UX |
| 2 | Commit/push R1B when requested; confirm CI green |
| 3 | Merge PR #1 only after M4C.1.1 FULL PASS |
| 4 | **M4D** — Tenant Invite Email Delivery Provider (after copy-link path verified) |

---

## M4C.1.1 status after R1B

M4C.1.1 remains **UX BLOCKED / NOT FULL PASS**. R1B removes the UX blocker for *finding* the invite flow; it does **not** substitute for completed operator acceptance smoke. See [`M4C_1_1_INVITE_ACCEPTANCE_OPERATOR_SMOKE_COMPLETION.md`](M4C_1_1_INVITE_ACCEPTANCE_OPERATOR_SMOKE_COMPLETION.md).
