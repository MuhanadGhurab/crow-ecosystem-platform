# Crow Current Implementation State

| Field | Value |
|-------|-------|
| **Title** | Current Implementation State |
| **Status** | CANONICAL |
| **Authority** | Verified repository evidence — CROW.GOVERNANCE.1 |
| **Last reviewed** | 2026-07-19 (CROW.DEVFLOW.5B — Preview DB URL still absent for FTGP) |
| **Supersedes** | Percentage claims in [`MILESTONES.md`](../internal/MILESTONES.md) as implementation truth |
| **Related decisions** | — |
| **Implementation state** | This document **is** implementation truth |

**Evidence date:** 2026-07-18 · **Branch:** `feat/first-tenant-golden-path`

## Repository and branch state

| Item | Value |
|------|-------|
| Repository | `D:/CYBERCROW` / `MuhanadGhurab/crow-ecosystem-platform` |
| Branch | `feat/first-tenant-golden-path` |
| HEAD | FTGP tip · **CROW.DEVFLOW.5** pilot · **5A/5B** Preview flags on FTGP; Preview DB URL **still absent** (E2E blocked) · DEVFLOW.4 · Alpha Mode · Discovery D0–D7 accepted · GAP-015 **Mitigated** · `main` @ `f97a835` protected |
| Runtime class | **Alpha development + demo sandbox** — FTGP Preview flags set; Preview build still fails without branch-scoped `DATABASE_URL`; Request/Discovery persistence still off |
| Default branch | `main` at `f97a835` (protected; PR #25 guard-on-main) |
| Production live | `dpl_QeDhnxzp9eowKNxAg5XmJW8vuhsz` — **not** a commercial Production claim under Alpha Mode |
| GitHub Project | [Crow Ecosystem Delivery OS](https://github.com/users/MuhanadGhurab/projects/2) (#2 private) |
| Seed Issues | #15–#24 · #15 GAP-015 (**Mitigated**) · #16 GAP-004 (**future commercial gate**; Alpha Mode recorded) · #18 Discovery (**local-first accepted**; OPEN) |
| PR #10 | OPEN, DRAFT, CONFLICTING — **draft archive (owner accepted)**; not a merge vehicle |
| Working tree | Post CROW.DEVFLOW.5B (docs) |

## Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15, React 19 |
| Language | TypeScript 5.8 |
| ORM | Prisma 6.19 |
| Auth | Supabase Auth (SSR) |
| Database | PostgreSQL (Supabase hosted; local Docker for dev) |
| Deployment | Vercel |
| Payments (scaffold) | Stripe SDK (advisory, not live by default) |

## Domain implementation map

### Public routes — ACCEPTED on certification (CROW.PUBLIC.9 / CROW.PUBLIC.10)

| Status | Evidence |
|--------|----------|
| **ACCEPTED** | CROW.PUBLIC.9 semi-dark locked public experience — owner accepted on certification (`c51a60e` visual, CROW.PUBLIC.10, 2026-07-07) |
| **ACCEPTED (prior)** | CROW.PUBLIC.3/4 — route architecture and browse/sign-in model (`b90ac88`) |
| IMPLEMENTED | Signature hero (`pv2-signature-hero`); amber journey + purple transform CTAs; `data-pv2-locked-design` |
| UNCHANGED | Public browse policy (`public-access-policy.ts`); auth and client-process gates |
| **DEPLOYED & REVIEWED** | Production — CROW.PUBLIC.PROD + owner live review (POSTPROD.1, 2026-07-07) |
| **Production URL** | https://crow-ecosystem-platform.vercel.app |
| **Certification URL** | https://crow-ftgp-certification-iipjrwhxd-muhanadghurabs-projects.vercel.app/ |

### Auth and account — PARTIAL

| Status | Evidence |
|--------|----------|
| IMPLEMENTED | Registration, email verification, phone OTP onboarding routes |
| IMPLEMENTED | Google OAuth, password recovery |
| IMPLEMENTED | Legal acceptance gates (C3) |
| PARTIAL | Dual-channel verification; FTGP authority boundaries tested |
| Evidence | `src/lib/auth/`, `src/lib/account/`, `docs/architecture/crow-core/c3/` |

### Request — PARTIAL (CROW.REQUEST.2 aligned locally)

| Status | Evidence |
|--------|----------|
| IMPLEMENTED | Authenticated wizard; submit → `PENDING_REVIEW`; request ≠ tenant authority contract |
| IMPLEMENTED | **JourneyKind** on brief notes JSON (NEW/TRANSFORM) — GAP-008 mitigated |
| IMPLEMENTED | Org context labels aligned with Build New / Transform |
| IMPLEMENTED | **Client-process phone gate** (constitution) — `/client/*` + submit require `phoneVerifiedAt`; real OTP; enrollment activation may remain email-only |
| IMPLEMENTED | Product status mapping (no DB enum migration) |
| IMPROVED | ProCrow intake queue language (Submitted / Needs review / Qualification) |
| DEFERRED | Server-persisted DRAFT; hosted Preview certify (GAP-004) |
| Evidence | [`milestones/CROW-REQUEST-2.md`](milestones/CROW-REQUEST-2.md), `/client/requests/*`, Issue #17 |

### Discovery — PARTIAL (D0–D7 local-first **owner-accepted** · hosted pending)

| Status | Evidence |
|--------|----------|
| IMPLEMENTED | Client/operator Discovery; qualification gate; D0–D3 adaptive Stages 1–3 (localStorage) |
| IMPLEMENTED | **CROW.DISCOVERY.4** — local Operating Model input draft + preview |
| IMPLEMENTED | **CROW.DISCOVERY.5** — ProCrow modeling review; `readyForModeling` may be true locally |
| IMPLEMENTED | **CROW.DISCOVERY.6** — Blueprint handoff package; `readyForBlueprintHandoff` may be true; draft/generation false |
| IMPLEMENTED | **CROW.DISCOVERY.7** — Stages 4–7 depth (trust/risk, build/transform intent, evidence refs-only, ProCrow review prep) |
| **ACCEPTED** | **CROW.DISCOVERY.LOCAL-FIRST.ACCEPT.1** — D0–D7 local-first MVP scope owner-accepted (no hosted / Blueprint / Production / main) |
| CERT PACKAGE | MVP-CERT.1 superseded by LOCAL-FIRST.ACCEPT.1 for acceptance status |
| IMPLEMENTED | Blueprint **complete path quarantined** by default |
| BLOCKED | Production-safe hosted Discovery persistence (GAP-004 commercial gate); Blueprint generation / `completeDiscovery` |
| PENDING | Dual client tracks; optional further demo persistence (request/discovery); Blueprint drafting |
| IMPLEMENTED | **CROW.DEVFLOW.5** — guarded demo feedback → `PlatformNotification` (`alpha_demo_feedback`); UI `/alpha-feedback` |
| BLOCKED | **CROW.DEVFLOW.5A/5B** — Preview alpha flags on FTGP; Preview `DATABASE_URL`/`DIRECT_URL` **not** present for FTGP (CLI); builds ERROR; E2E unverified |
| Evidence | [`milestones/CROW-DISCOVERY-LOCAL-FIRST-ACCEPT-1.md`](milestones/CROW-DISCOVERY-LOCAL-FIRST-ACCEPT-1.md), [`milestones/CROW-DEVFLOW-1.md`](milestones/CROW-DEVFLOW-1.md), Issue #18 |

### Blueprint — PARTIAL

| Status | Evidence |
|--------|----------|
| IMPLEMENTED | `EnterpriseBlueprint`, versioning (C2), Studio, review cycles, approvals |
| IMPLEMENTED | ROI/SOW persistence, trace events |
| PARTIAL | Full commercial proposal workflow; scope freeze enforcement |
| Evidence | `/blueprints/*`, `src/lib/crow-core/blueprint-studio/` |

### ProCrow — PARTIAL (CROW.PROCROW.1 qualification UX · 1A pushed)

| Status | Evidence |
|--------|----------|
| IMPLEMENTED | Control tower, operator queue, blueprint studio, tenant command center |
| IMPLEMENTED | Go/no-go center, architecture lab |
| IMPLEMENTED | Platform admin guards (`requirePlatformConsole`) |
| IMPLEMENTED | **Qualification outcomes** in brief notes JSON; Discovery start gated on `qualified_for_discovery` |
| IMPLEMENTED | Request workspace qualification panel + product status overlay (no DB enum migration) |
| BASELINED | CROW.PROCROW.1A — pushed to `origin/feat/first-tenant-golden-path` @ `cecd450` |
| PARTIAL | FTGP platform admin bootstrap, procrow owner-admin dual role |
| DEFERRED | Hosted Preview certify (GAP-004) |
| Evidence | `/admin/*`, `src/lib/procrow/`, [`milestones/CROW-PROCROW-1.md`](milestones/CROW-PROCROW-1.md), [`milestones/CROW-PROCROW-1A.md`](milestones/CROW-PROCROW-1A.md), Issue #19 |

### Tenant runtime — PARTIAL

| Status | Evidence |
|--------|----------|
| IMPLEMENTED | MEEM and Rimal demo tenants, CEM modules (HR, finance, CRM, etc.) |
| IMPLEMENTED | Tenant membership, invites, acceptance flow |
| PARTIAL | My Attention/Work/Decisions/Evidence/Outcomes workspace model |
| PLANNED | First real tenant golden path completion |
| Evidence | `/[tenant]/*`, `prisma/schema.prisma` Tenant models |

### Commercial layer — PLANNED

| Status | Evidence |
|--------|----------|
| PARTIAL | Pricing templates, proposal review UI, scope approval |
| PARTIAL | Stripe scaffold — checkout API, webhook, status |
| NOT IMPLEMENTED | Full commercial instrument model, live billing, enforcement |
| Evidence | [`STRIPE_BILLING.md`](../internal/STRIPE_BILLING.md), `src/lib/billing/` |

### Subscription layer — PLANNED

| Status | Evidence |
|--------|----------|
| PARTIAL | `TenantSubscription`, `SubscriptionPlan`, `BillingRecord` schema |
| NOT IMPLEMENTED | Entitlement versioning, grace/suspension enforcement |
| Evidence | `prisma/schema.prisma` lines ~1593–1665 |

### CroAI — PLANNED

No CroAI runtime code in repository. See [`08-CROAI-CONSTITUTION.md`](08-CROAI-CONSTITUTION.md).

### CyberCrow — PARTIAL

| Status | Evidence |
|--------|----------|
| IMPLEMENTED | Audit logs, security events, incidents, GRC, risk, evidence UI |
| IMPLEMENTED | Tenant trust readiness verifiers |
| Evidence | `/[tenant]/cybercrow/*`, Cybercrow Prisma models |

### SAREA — PARTIAL

| Status | Evidence |
|--------|----------|
| IMPLEMENTED | Experience profiles, role mapping, navigation, widgets, preview |
| IMPLEMENTED | Composition-only boundary in contracts |
| Evidence | `/sarea/*`, `SareaExperienceProfile` models |

### Public website reset — PARTIAL

A1/A1.1 homepage visual reset passed. Approved v2 direction documented but not fully implemented.

### Story experiment — FROZEN

Cinematic scroll-story at `/experience/architects-map`. Homepage includes preview link. Status: FROZEN per [`09-PUBLIC-EXPERIENCE.md`](09-PUBLIC-EXPERIENCE.md).

### Database — PARTIAL (Alpha Mode)

| Status | Evidence |
|--------|----------|
| IMPLEMENTED | Extensive Prisma schema (~80+ models) |
| RISK | Preview/Production isolation **not proven** — GAP-004 = **future commercial gate** (CROW.DEVFLOW.1); `PREVIEW_DATABASE_ISOLATION_PROVEN_COUNT=0` |
| POLICY | Existing Supabase = **demo/dev sandbox** conceptually under Alpha Mode — not production-safe claim |
| IMPLEMENTED | Controlled migration CLI; build-time migrate removed; `vercel.json` = generate + build only |
| PACKAGE | **CROW.GAP004A.ACCEPT.1** — fail-closed Preview DB-disabled; DEVFLOW.4 gate/guard pure (no DB open) · [`milestones/CROW-DEVFLOW-4.md`](milestones/CROW-DEVFLOW-4.md) |
| Evidence | `prisma/migrations/`, `scripts/run-controlled-migration.ts`, `scripts/safety/check-db-isolation-env.mjs` |

### Environments

| Environment | Status |
|-------------|--------|
| Local | Docker Postgres via `docker-compose.local.yml` |
| Preview / live review | Vercel Preview = **fast review channel** (Alpha Mode) · `CrowAlphaRuntimeBanner` in root layout |
| Supabase (shared) | Demo/dev sandbox data only — not commercial Production |
| FTGP Certification | Private Vercel certification environment (FTGP_1H) |
| Vercel Production domain | Live pin `dpl_QeDhnxzp9eowKNxAg5XmJW8vuhsz` — **not** commercial Production claim under Alpha Mode |

### PR and branch state

- **PR #10:** OPEN DRAFT — `feat/first-tenant-golden-path` → `main` — **untouched**
- **PR #14:** **MERGED** — public-only recon squash onto `main` @ `e8cb812` (RECON.4)
- **PR #2:** OPEN DRAFT — invite email delivery (separate track)
- **main:** `e8cb812` — accepted public experience + deploy-safe `vercel.json`
- FTGP work continues on feature branch; not merged

### Project management / delivery system — IMPLEMENTED (GitHub)

| Status | Evidence |
|--------|----------|
| **IMPLEMENTED** | Labels, Phase 0–12 milestones, Project #2, seed Issues #15–#24 |
| **NOT DONE** | Project views (manual UI) |
| Evidence | [`milestones/CROW-PM-2.md`](milestones/CROW-PM-2.md), [`15-GITHUB-PROJECTS-SETUP-PLAN.md`](15-GITHUB-PROJECTS-SETUP-PLAN.md) |

### Public reconciliation — MERGED + AUTO DEPLOY ACCEPTED (RECON.5)

| Status | Evidence |
|--------|----------|
| **IMPLEMENTED (`main`)** | Accepted public experience + no `db:migrate:deploy` in buildCommand |
| **AUTO DEPLOY** | `dpl_8xT92RFHmsNRR5tihFwkd5aLNFQS` accepted as main-aligned Production artifact |
| **LIVE DOMAIN** | Still `dpl_QeDhnxzp9eowKNxAg5XmJW8vuhsz` (smoke passed); Instant Promote separate |
| Evidence | [`milestones/CROW-PUBLIC-RECON-5.md`](milestones/CROW-PUBLIC-RECON-5.md) |

### Production deployment policy — DOCUMENTED

| Status | Evidence |
|--------|----------|
| **IMPLEMENTED (docs + repo + Vercel + GitHub)** | Release authority; Ignored Build Step; guard on `main`; skip proven; GitHub protection; authorized deploy procedure **owner-accepted** (GAP-015 **Mitigated**) |
| **NOT APPLIED** | Option B auto-deploy disable; dashboard migrate removal; any Production deploy (needs `CROW.PRODUCTION.DEPLOY`) |
| Evidence | [`milestones/CROW-GAP015-ACCEPT-1.md`](milestones/CROW-GAP015-ACCEPT-1.md), [`gaps/GAP-015-AUTHORIZED-PRODUCTION-DEPLOY-PROCEDURE.md`](gaps/GAP-015-AUTHORIZED-PRODUCTION-DEPLOY-PROCEDURE.md), `npm run vercel-production-deploy-guard:test` |

### Known technical debt

- Legacy `/portal/*` routes parallel `/client/*`
- Shared Preview/Production database fingerprint match (C2.1 blocker)
- Milestone ledger (`MILESTONES.md`) percentages not reliable as implementation truth
- Stripe fields coupled in schema but commercial domain incomplete
- JourneyKind in crow-story types; OrganizationContext in request types — separate (correct)
- Production vs `main` public gap mitigated on git; GAP-015 **Mitigated** (owner-accepted procedure); intentional Production still requires `CROW.PRODUCTION.DEPLOY`

## Classification legend

| Label | Meaning |
|-------|---------|
| IMPLEMENTED | Exists in code/schema with evidence |
| PARTIAL | Scaffold or demo depth; not production-complete |
| PLANNED | Documented intent only |
| FROZEN | Retained but not future direction |
| DEPRECATED | Superseded; may still exist in code |
| RETIRED | Removed or inactive |

## Related documents

- [`GAP-LEDGER.md`](GAP-LEDGER.md)
- [`docs/internal/PROJECT_STATUS.md`](../internal/PROJECT_STATUS.md) (historical detail)
