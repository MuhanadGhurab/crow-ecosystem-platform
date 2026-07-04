# Crow Current Implementation State

| Field | Value |
|-------|-------|
| **Title** | Current Implementation State |
| **Status** | CANONICAL |
| **Authority** | Verified repository evidence — CROW.GOVERNANCE.1 |
| **Last reviewed** | 2026-07-04 |
| **Supersedes** | Percentage claims in [`MILESTONES.md`](../internal/MILESTONES.md) as implementation truth |
| **Related decisions** | — |
| **Implementation state** | This document **is** implementation truth |

**Evidence date:** 2026-07-04 · **Branch:** `feat/first-tenant-golden-path` · **HEAD:** see git at review time

## Repository and branch state

| Item | Value |
|------|-------|
| Repository | `D:/CYBERCROW` / `MuhanadGhurab/crow-ecosystem-platform` |
| Branch | `feat/first-tenant-golden-path` |
| HEAD | `118073a`+ — CROW.PUBLIC.3 acceptance fixes |
| Remote sync | Push after PUBLIC.3 commits |
| Default branch | `main` at `a5620c3` |
| PR #10 | OPEN, DRAFT, unmerged — FTGP foundation |
| Working tree | Clean after PUBLIC.3 commits |

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

### Public routes — PARTIAL (CROW.PUBLIC.3)

| Status | Evidence |
|--------|----------|
| IMPLEMENTED | Bright canonical public surface with visual depth system (`public-v2-bright.css` bands, grid, ambient) |
| IMPLEMENTED | Public browse access policy — informational routes open without sign-in (`public-access-policy.ts`, `route-protection.ts`) |
| IMPLEMENTED | Educational vs conversion CTA separation on homepage, `/start`, journey pages |
| IMPLEMENTED | `/request` public explanation (Option A); logged-in redirect to client request preserved |
| REDIRECTED | Legacy marketing/story routes (unchanged from PUBLIC.2) |
| DEFERRED | `/case-studies` — honest placeholder; `/register` visual refresh |
| NOT AUTHORIZED | Production promotion of public redesign |

### Auth and account — PARTIAL

| Status | Evidence |
|--------|----------|
| IMPLEMENTED | Registration, email verification, phone OTP onboarding routes |
| IMPLEMENTED | Google OAuth, password recovery |
| IMPLEMENTED | Legal acceptance gates (C3) |
| PARTIAL | Dual-channel verification; FTGP authority boundaries tested |
| Evidence | `src/lib/auth/`, `src/lib/account/`, `docs/architecture/crow-core/c3/` |

### Request — PARTIAL

| Status | Evidence |
|--------|----------|
| IMPLEMENTED | `ImplementationRequest` model, client request wizard |
| IMPLEMENTED | `OrganizationContext` kinds in `src/lib/client-service-request/types.ts` |
| IMPLEMENTED | Request does not provision tenant (explicit authority contract) |
| PARTIAL | FTGP first-request designation and review transition in progress |
| Evidence | `prisma/schema.prisma`, `/client/requests/*`, `/admin/requests/*` |

### Discovery — PARTIAL

| Status | Evidence |
|--------|----------|
| IMPLEMENTED | `DiscoveryProfile`, answers, departments, roles, workflows models |
| IMPLEMENTED | Client and operator discovery routes |
| PARTIAL | FTGP discovery shell reconciliation, interview readiness |
| Evidence | `/discovery/*`, `/client/requests/*/discovery/*`, FTGP docs |

### Blueprint — PARTIAL

| Status | Evidence |
|--------|----------|
| IMPLEMENTED | `EnterpriseBlueprint`, versioning (C2), Studio, review cycles, approvals |
| IMPLEMENTED | ROI/SOW persistence, trace events |
| PARTIAL | Full commercial proposal workflow; scope freeze enforcement |
| Evidence | `/blueprints/*`, `src/lib/crow-core/blueprint-studio/` |

### ProCrow — PARTIAL

| Status | Evidence |
|--------|----------|
| IMPLEMENTED | Control tower, operator queue, blueprint studio, tenant command center |
| IMPLEMENTED | Go/no-go center, architecture lab |
| IMPLEMENTED | Platform admin guards (`requirePlatformConsole`) |
| PARTIAL | FTGP platform admin bootstrap, procrow owner-admin dual role |
| Evidence | `/admin/*`, `src/lib/platform/` |

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
| RISK | Preview/Production shared hosted backend — isolation not fully proven (C2.1 BLOCKED) |
| IMPLEMENTED | Controlled migration CLI, build-time migrate removed (C2.2) |
| Evidence | `prisma/migrations/`, `scripts/run-controlled-migration.ts` |

### Environments

| Environment | Status |
|-------------|--------|
| Local | Docker Postgres via `docker-compose.local.yml` |
| Preview / Staging | Vercel + Supabase hosted |
| FTGP Certification | Private Vercel certification environment (FTGP_1H) |
| Production | Live at crow-ecosystem-platform.vercel.app — **unchanged by this milestone** |

### PR and branch state

- **PR #10:** OPEN DRAFT — `feat/first-tenant-golden-path` → `main`
- **main:** `a5620c3` — docs(release): record R2 production stabilization
- FTGP work continues on feature branch; not merged

### Known technical debt

- Legacy `/portal/*` routes parallel `/client/*`
- Shared Preview/Production database fingerprint match (C2.1 blocker)
- Milestone ledger (`MILESTONES.md`) percentages not reliable as implementation truth
- Stripe fields coupled in schema but commercial domain incomplete
- JourneyKind in crow-story types; OrganizationContext in request types — separate (correct)

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
