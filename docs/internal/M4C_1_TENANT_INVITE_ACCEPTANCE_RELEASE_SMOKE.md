# M4C.1 — Tenant Invite Acceptance Release & Smoke

**Date:** 6 Jun 2026  
**Branch tested:** `feat/m4c-tenant-invite-acceptance`  
**Commit tested:** `cffaf95` — feat(tenant): add tenant invite acceptance token flow  
**PR:** https://github.com/MuhanadGhurab/crow-ecosystem-platform/pull/1  
**Release path:** **PATH A** — feature branch / PR preview (M4C **not merged to `main`**)

---

## Precheck / git state

| Check | Result |
|-------|--------|
| Branch | `feat/m4c-tenant-invite-acceptance` (tracks `origin/feat/m4c-tenant-invite-acceptance`) |
| Working tree | Clean at smoke start |
| M4C implementation commit | `cffaf95` present locally and on remote branch |
| `main` tip | `4046fcd` — M4C **schema proposal doc only**; no acceptance implementation on production |

**M4C file inventory (confirmed):**

- `prisma/schema.prisma` — `TenantMembershipInvite` model
- `prisma/migrations/20260605120000_tenant_membership_invite/migration.sql`
- `src/lib/tenant/tenant-invite-acceptance-contract.ts`
- `src/lib/services/tenant-invite-token.service.ts`
- `src/lib/actions/tenant-invite-acceptance.ts`
- `src/app/tenant-invite/[token]/page.tsx`
- `src/components/tenant/tenant-invite-acceptance-panel.tsx`
- `src/components/admin/admin-tenant-membership-invite-panel.tsx` (ProCrow panel)
- `docs/internal/M4C_TENANT_INVITE_ACCEPTANCE_TOKEN_EMAIL_DELIVERY.md`
- `scripts/verify-tenant-invite-acceptance.ts`

---

## Part 1 — Pre-deploy validation (local)

All commands run on `cffaf95` before release smoke.

| Command | Result |
|---------|--------|
| `npx prisma validate` | **PASS** |
| `npm run db:generate` | **PASS** |
| `npm run tenant-invite-acceptance:verify` | **PASS** |
| `npm run tenant-invite:verify` | **PASS** |
| `npm run tenant-membership:verify` | **PASS** |
| `npm run access-gateway:verify` | **PASS** |
| `npm run auth-landing:verify` | **PASS** |
| `npm run typecheck` | **PASS** |
| `npm run lint` | **PASS** |
| `npm run build` | **PASS** (exit 0) |
| `npm run public:mirror-manifest` | **PASS** |

**Known non-blocking build warning:** During static generation, Prisma logged that table `public.client_organization_request_links` does not exist in the **local** dev database. Build exited 0; same class of warning documented in prior milestones.

---

## Part 2 — Deploy / migration observation

### CI (PR #1, run `27014125579`)

| Check | Result |
|-------|--------|
| `verify` | **SUCCESS** |
| `production-gate` | **SUCCESS** |
| `Vercel – crow-ecosystem-platform` | **SUCCESS** (preview **Ready**) |
| `Vercel Preview Comments` | **SUCCESS** |
| `postgres-smoke` | **FAILURE** |
| `Vercel – crow-ecosystem-platform-hsod` | **FAILURE** (secondary project; not primary deploy gate) |

**Preview URL (M4C code):**  
https://crow-ecosystem-platform-git-feat-7e40c6-muhanadghurabs-projects.vercel.app

**Production URL (`main`, no M4C):**  
https://crow-ecosystem-platform.vercel.app

### Migration `20260605120000_tenant_membership_invite`

| Observation | Result |
|-------------|--------|
| Vercel build on preview | **Ready** — implies `prisma generate` + `next build` succeeded |
| `db:migrate:deploy` log captured in this pass | **Not captured** — preview deploy logs not inspected line-by-line in agent pass |
| Migration on production DB | **Not applicable** — M4C not on `main` |
| Migration on preview/staging DB | **Assumed applied** if preview build runs standard `db:migrate:deploy` hook; **not independently verified** via SQL or deploy log scrape |

**postgres-smoke failure (pre-existing, not M4C-specific):**

- Job fails in `npm run smoke:phase1` with `server-only` throw from `src/lib/server-only-guard.ts`
- **Reproduces on `main`** — same failure when checked out locally
- Root cause: `scripts/run-smoke-phase1.mjs` does not set `CYBERCROW_SCRIPT_PRISMA=1` (unlike `scripts/run-with-script-prisma.mjs`)
- Documented previously in [`M3_5_PURCHASE_TO_STOCK_MANUAL_SMOKE.md`](M3_5_PURCHASE_TO_STOCK_MANUAL_SMOKE.md)
- **Not treated as M4C regression**; optional one-line CI fix deferred (no commit in M4C.1 pass)

---

## Part 3 — Health check

| Environment | URL | Result |
|-------------|-----|--------|
| Production (`main`) | `GET /api/health` | `{"ok":true,"db":"ok","deployReady":true}` — **PASS** (no M4C routes) |
| PR preview (M4C) | `GET /api/health` on preview host | **Blocked** — Vercel Deployment Protection returns auth wall, not JSON |

Preview health requires operator bypass token or signed-in Vercel session.

---

## Part 4 — ProCrow invite creation smoke

**Status:** **Not executed** in agent pass.

| Requirement | Agent pass |
|-------------|------------|
| `/admin/tenants/[meem-global-tenant-id]` panel visible | **Manual follow-up** |
| Role options `tenant_user` / `tenant_admin` only | **Code + `tenant-invite-acceptance:verify`** |
| Copy-link mode; no false email-sent claim | **Code + verifier** |
| M4B break-glass separated | **Code** — immediate grant path preserved in panel |
| Create invite → one-time URL → pending list | **Manual follow-up** |
| `tokenHash` stored, not raw token | **Code + verifier** |

**Staging context (from M3.5):** tenant slug `meem-global`; staging tenant id `cmpi2w8os0020vhqsm33i0gk1` (production/staging IDs may differ — confirm in ProCrow tenant detail).

**Operator manual steps:**

1. Sign in as platform staff.
2. Open `/admin/tenants/<meem-global-id>`.
3. Create invite for a test email (`tenant_user`).
4. Copy one-time `/tenant-invite/[token]` URL.
5. Confirm pending row in list; no raw token in DB UI.

---

## Part 5 — Invited user acceptance smoke

**Status:** **Not executed** in agent pass (requires preview bypass + test account + copied token).

**Expected flow (from implementation):**

1. Incognito → open `/tenant-invite/[token]`.
2. Signed out → sign in / sign up with **matching** invited email; `next` preserves invite URL.
3. Accept → `TenantMembership` activated; invite status `accepted`; metadata sync via existing safe helper.
4. Land on `/access` or link thereto; Business Portal for `meem-global`; `/meem-global/dashboard` loads.

---

## Part 6 — Negative smoke tests

| Case | Agent pass | Expected (code/verifier) |
|------|------------|--------------------------|
| Wrong email | **Not executed** | Email mismatch blocks accept (`tenant-invite-acceptance:verify`) |
| Reuse accepted token | **Not executed** | Accepted invite cannot accept again |
| Revoked invite | **Not executed** | Revoked state blocks accept; ProCrow revoke action wired |
| Expired invite | **Not executed** | Expiry lifecycle in contract; staging row simulation optional |
| Client-only account without membership | **Not executed** | M4 guard blocks `/meem-global/*` without membership |
| Role safety | **Verifier** | Only `tenant_user` / `tenant_admin` in invite contract |

---

## Part 7 — Business Portal confirmation

**Status:** **Not executed** (depends on Part 5).

Post-acceptance operator checks: `/access`, `/meem-global/dashboard`, `/meem-global/workflows/purchase-to-stock` — no ProCrow / platform_admin / client approval rights for `tenant_user`.

---

## Part 8 — ProCrow post-acceptance confirmation

**Status:** **Not executed** (depends on Part 5).

Expected: invite `accepted` in list; membership visible; DB-backed access source; no unsafe role grants.

---

## Issues found

1. **M4C not on production** — merge to `main` required before production smoke of invite acceptance.
2. **Preview Deployment Protection** — blocks unauthenticated `/api/health` and manual browser smoke without bypass.
3. **postgres-smoke CI red** — pre-existing `CYBERCROW_SCRIPT_PRISMA` omission in `run-smoke-phase1.mjs`; not introduced by M4C.
4. **Secondary Vercel project `crow-ecosystem-platform-hsod` failed** — out of scope for primary release gate; primary preview **Ready**.
5. **Manual E2E not run** — Parts 4–8 require human operator with platform staff + test invitee accounts.

---

## Fixes applied (M4C.1)

**None committed.** No release-blocker code changes applied in this pass. Optional CI fix documented: add `CYBERCROW_SCRIPT_PRISMA: "1"` to `scripts/run-smoke-phase1.mjs` env (matches `run-with-script-prisma.mjs` pattern).

---

## Verification after fixes

No code changes in M4C.1 pass — Part 1 verifier batch stands as final automated evidence.

---

## Remaining gaps

1. Merge PR #1 (or approved promotion) to deploy M4C + migration to production/staging target.
2. Operator manual smoke Parts 4–8 on preview or post-merge URL (with Vercel bypass if needed).
3. Confirm migration applied via Vercel build logs or `prisma migrate status` against target DB.
4. Optional: fix `postgres-smoke` CI (one-line env) on separate hygiene commit.
5. M4D for actual email delivery (out of M4C.1 scope).

---

## Recommended next phase

| Option | Rationale |
|--------|-----------|
| **M4D — Tenant Invite Email Delivery Provider** | Natural follow-on after copy-link acceptance is operator-verified |
| **M3.6 — Purchase-to-Stock UX Refinement** | Parallel product track if invite smoke waits on merge |
| **M4E — Tenant Membership Management UX** | Broader membership admin after acceptance path proven |

**Immediate operator action before declaring full PASS:** complete Parts 4–8 on preview (or production after merge) and append results to this doc.

---

## Final M4C.1 decision

**CONDITIONAL PASS — NOT READY FOR PRODUCTION PROMOTION**

| Criterion | Status |
|-----------|--------|
| Local / CI verify + preview deploy Ready | **Met** |
| Migration independently verified | **Not met** (logs/SQL not captured) |
| Preview/production health with M4C | **Partial** — prod green without M4C; preview auth-blocked |
| End-to-end invite create → accept → portal | **Not met** — manual smoke deferred |
| Negative cases | **Not met** — verifier-only |
| Docs updated | **Met** (this doc + status/milestones) |

**Summary:** M4C implementation is **automated-verifier green** and **preview-deploy Ready** on the feature branch. M4C.1 **does not** meet full acceptance until an operator completes manual smoke on a deployment that includes M4C (preview with bypass, or `main` after approved merge) and migration application is confirmed.
