# R1A — UI Consolidation, Invite UX Readiness & CI Fix

**Date:** 6 Jun 2026  
**Branch:** `feat/m4c-tenant-invite-acceptance`  
**Scope:** Consolidate local A1.2 UI WIP, fix `postgres-smoke` CI, redesign ProCrow **Tenant Workforce Activation** for operator smoke readiness. No migrations, seeds, payments, auth weakening, or email provider.

---

## Decision

**R1A: PASSED** — local UI WIP classified and kept; postgres-smoke root cause fixed and validated locally; Tenant Workforce Activation UI ready for manual M4C.1.1 smoke; full verifier suite + build green. PR #1 not merged; operator browser smoke still pending.

---

## Local UI WIP classification

| Bucket | Files | Notes |
|--------|-------|-------|
| **A1.2A — Public homepage / shell** | `src/app/(public)/page.tsx`, `src/app/globals.css`, `src/lib/constants/homepage.ts`, `src/components/public/coming-soon-cards.tsx`, `hero-section.tsx`, `homepage-built-for.tsx`, `homepage-how-it-works.tsx`, `homepage-runtime-engines.tsx`, `homepage-three-workspaces.tsx`, `homepage-trust-proof.tsx`, `public-header-nav.tsx`, **new:** `homepage-card-arrow.tsx`, `homepage-discovery-blueprint.tsx`, `homepage-explore-row.tsx`, `homepage-final-cta.tsx`, `homepage-roadmap.tsx`, `homepage-section-header.tsx` | No Hesi clone — clean SaaS sections, floating nav, card system (`cc-home-*`), discovery/blueprint/roadmap rows |
| **A1.2B — Client Portal shell** | `src/app/client/page.tsx`, `client-portal-page-header.tsx`, `client-portal-shell.tsx`, **new:** `client-portal-nav-links.tsx`, `src/lib/constants/client-portal-nav.ts` | Shell nav, spacing, card layout aligned with public visual system |
| **ProCrow invite UX (R1A)** | `admin-tenant-membership-invite-panel.tsx`, `crow-workforce-activation.ts`, `admin/tenants/[tenantId]/page.tsx` | Operator-friendly Business Portal invite flow |
| **CI / verifier** | `scripts/run-smoke-phase1.mjs`, `scripts/verify-architecture-simplification.ts` | `CYBERCROW_SCRIPT_PRISMA`; tenant page title casing tolerance |

**Accidental / revert:** none identified.  
**Unrelated:** none identified.

### A1.2 scope decision

Split as **A1.2A** (public) + **A1.2B** (client shell). Both are visual/IA only — no backend, auth, or database changes. Uncommitted on branch; commit when product owner requests.

### Build stabilization (A1.2)

`globals.css` — removed invalid `@apply group` from `.cc-home-card` (Tailwind/PostCSS build error). Arrow hover uses `.cc-home-card:hover .cc-home-card-arrow` instead of `group-hover`.

---

## postgres-smoke root cause and fix

| Item | Detail |
|------|--------|
| **Symptom** | CI job `postgres-smoke` failed when `scripts/run-phase1-smoke.ts` imported `@/lib/db` |
| **Root cause** | Server-only Prisma guard requires `CYBERCROW_SCRIPT_PRISMA=1` for CLI scripts (same pattern as `run-with-script-prisma.mjs`) |
| **Fix** | `scripts/run-smoke-phase1.mjs` — set `CYBERCROW_SCRIPT_PRISMA: "1"` in spawned env |
| **Local validation** | `npm run smoke:phase1` — **PASSED** (full Phase 1 pipeline on local Postgres) |
| **CI validation** | Pending next push / CI run on PR #1 |

No migrations, seeds, auth changes, or `.env` edits.

---

## Tenant Workforce Activation UX

**Route:** `/admin/tenants/[tenantId]` · workbench section **Tenant workforce activation**

**Panel:** `admin-tenant-membership-invite-panel.tsx`

| Area | Implementation |
|------|----------------|
| Header | Title + purpose copy + **Manual copy-link mode** status chip |
| Primary card | **Business Portal Invite** — access summary, honest subtitle (email delivery not active) |
| Create form | Email, role (`tenant_user` / `tenant_admin`), expiry (default 7 days), optional note, **Create invite link** |
| After create | Copyable URL, **Copy and send manually**, one-time raw link warning |
| Invite history | Pending / accepted / revoked / expired badges; email, role, created/expires; revoke for pending |
| Safety notes | Business Portal only; no ProCrow; no platform admin; no client approval; no production/payment |
| Break-glass | M4B immediate grant in collapsed `<details>` **Advanced / Break-glass membership grant** |

Constants: `src/lib/constants/crow-workforce-activation.ts`

Token security, acceptance flow, and actions unchanged.

---

## Route fix confirmation

`tenant-invite` remains in `RESERVED_PATH_SEGMENTS` (`src/lib/auth/route-protection.ts`). Public route `/tenant-invite/[token]` is not captured as a tenant slug.

---

## Verification results

| Command | Result |
|---------|--------|
| `npm run architecture-simplification:verify` | PASSED |
| `npm run public-homepage:verify` | PASSED |
| `npm run tenant-invite-acceptance:verify` | PASSED |
| `npm run tenant-invite:verify` | PASSED |
| `npm run tenant-membership:verify` | PASSED |
| `npm run access-gateway:verify` | PASSED |
| `npm run auth-landing:verify` | PASSED |
| `npm run typecheck` | PASSED |
| `npm run lint` | PASSED |
| `npm run build` | PASSED (after `cc-home-card` CSS fix) |
| `npm run public:mirror-manifest` | PASSED |
| `npm run smoke:phase1` | PASSED (local) |

---

## Remaining blockers

1. **CI confirmation** — `postgres-smoke` must pass on GitHub after push (fix is in place; not yet observed in remote CI).
2. **M4C.1.1 operator browser smoke** — deferred until product owner runs manual checklist on preview (`meem-global`, copy-link invite, accept, Business Portal access).
3. **Uncommitted work** — A1.2 + R1A changes local only; PR #1 not updated until commit/push requested.
4. **PR #1 merge** — still blocked on CI green + operator smoke; do not merge until owner approves.

---

## Recommended next phase

**M4C.1.1 — Invite Acceptance Operator Smoke Completion** on Vercel preview with deployment-protection bypass. Then commit R1A + A1.2, push branch, confirm CI green, and re-evaluate PR #1 merge.
