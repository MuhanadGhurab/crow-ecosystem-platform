# Crow Current Implementation State

| Field | Value |
|-------|-------|
| **Title** | Current Implementation State |
| **Status** | CANONICAL |
| **Authority** | Verified repository evidence — CROW.GOVERNANCE.1 |
| **Last reviewed** | 2026-07-18 (CROW.GAP004.ALT1) |
| **Supersedes** | Percentage claims in [`MILESTONES.md`](../internal/MILESTONES.md) as implementation truth |
| **Related decisions** | — |
| **Implementation state** | This document **is** implementation truth |

**Evidence date:** 2026-07-17 · **Branch:** `feat/first-tenant-golden-path`

## Repository and branch state

| Item | Value |
|------|-------|
| Repository | `D:/CYBERCROW` / `MuhanadGhurab/crow-ecosystem-platform` |
| Branch | `feat/first-tenant-golden-path` |
| HEAD | `d1bdc12` content — CROW.GAP004.ALT1 (GAP-004A plan) |
| Default branch | `main` at `e8cb812` |
| Production live | `dpl_QeDhnxzp9eowKNxAg5XmJW8vuhsz` |
| GitHub Project | [Crow Ecosystem Delivery OS](https://github.com/users/MuhanadGhurab/projects/2) (#2 private) |
| Seed Issues | #15–#24 · #16 GAP-004 (**blocked**; GAP-004A planned) · #18 Discovery cert OPEN |
| PR #10 | OPEN, DRAFT, CONFLICTING — **draft archive (owner accepted)**; not a merge vehicle |
| Working tree | Clean after CROW.GAP004.ALT1 |

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

### Discovery — PARTIAL (D0–D6 local-first · cert package · hosted pending)

| Status | Evidence |
|--------|----------|
| IMPLEMENTED | Client/operator Discovery; qualification gate; D0–D3 adaptive Stages 1–3 (localStorage) |
| IMPLEMENTED | **CROW.DISCOVERY.4** — local Operating Model input draft + preview |
| IMPLEMENTED | **CROW.DISCOVERY.5** — ProCrow modeling review; `readyForModeling` may be true locally |
| IMPLEMENTED | **CROW.DISCOVERY.6** — Blueprint handoff package; `readyForBlueprintHandoff` may be true; draft/generation false |
| CERT PACKAGE | **CROW.DISCOVERY.MVP-CERT.1** — local-first certification + owner checklist (acceptance not auto-applied) |
| IMPLEMENTED | Blueprint **complete path quarantined** by default |
| PENDING | Owner acceptance; GAP-004/015; Stages 4–7 depth; dual tracks; hosted persistence; Blueprint drafting |
| Evidence | [`milestones/CROW-DISCOVERY-MVP-CERT-1.md`](milestones/CROW-DISCOVERY-MVP-CERT-1.md), [`discovery/DISCOVERY-MVP-LOCAL-FIRST-CERTIFICATION.md`](discovery/DISCOVERY-MVP-LOCAL-FIRST-CERTIFICATION.md), Issue #18 |

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

### Database — PARTIAL

| Status | Evidence |
|--------|----------|
| IMPLEMENTED | Extensive Prisma schema (~80+ models) |
| RISK | Preview/Production isolation **not proven** — operator Preview/Production share `wbwnsndcxrgyqwppurms` (`PREVIEW_DATABASE_ISOLATION_PROVEN_COUNT=0`) |
| IMPLEMENTED | Controlled migration CLI; build-time migrate removed; `vercel.json` = generate + build only |
| PACKAGE | **CROW.GAP004.ALT1** — GAP-004A Preview DB-disabled safety mode **plan** · [`gaps/GAP-004A-PREVIEW-DB-DISABLED-SAFETY-MODE.md`](gaps/GAP-004A-PREVIEW-DB-DISABLED-SAFETY-MODE.md) · isolation still unproven |
| Evidence | `prisma/migrations/`, `scripts/run-controlled-migration.ts`, `scripts/safety/check-db-isolation-env.mjs` |

### Environments

| Environment | Status |
|-------------|--------|
| Local | Docker Postgres via `docker-compose.local.yml` |
| Preview / Staging | Vercel + Supabase hosted |
| FTGP Certification | Private Vercel certification environment (FTGP_1H) |
| Production | Live — accepted public UI on pin `dpl_QeDhnxzp9eowKNxAg5XmJW8vuhsz`; auto Production-target from #14 `dpl_8xT92RFHmsNRR5tihFwkd5aLNFQS` **accepted** (RECON.5); domain not reassigned this milestone |

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
| **NOT DONE** | Project views (manual UI); Option B Vercel settings |
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
| **IMPLEMENTED (docs)** | Release authority, main-merge Option C interim, Instant Promote gates, GAP-004 migration holds |
| **NOT APPLIED** | Vercel Option B settings (disable/gate main→Production auto-deploy) |
| Evidence | [`16-PRODUCTION-DEPLOYMENT-POLICY.md`](16-PRODUCTION-DEPLOYMENT-POLICY.md), [`milestones/CROW-PROD-POLICY-1.md`](milestones/CROW-PROD-POLICY-1.md) |

### Known technical debt

- Legacy `/portal/*` routes parallel `/client/*`
- Shared Preview/Production database fingerprint match (C2.1 blocker)
- Milestone ledger (`MILESTONES.md`) percentages not reliable as implementation truth
- Stripe fields coupled in schema but commercial domain incomplete
- JourneyKind in crow-story types; OrganizationContext in request types — separate (correct)
- Production vs `main` public gap mitigated on git (`main` @ `e8cb812`); Production domain pin/auto-deploy policy still open (GAP-012 partial)

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
