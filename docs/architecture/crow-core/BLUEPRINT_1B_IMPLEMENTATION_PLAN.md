# BLUEPRINT.1B Implementation Plan

> **Status:** PROPOSED — OWNER REVIEW REQUIRED  
> **Prerequisite:** Owner approval of BLUEPRINT.1A migration package

## Scope

Apply persistence boundary designed in 1A without automatic provisioning or authority grants.

## Phases

### 1B.1 — Schema apply (staging first)

1. Owner review `proposals/BLUEPRINT_1A_PROPOSED_MIGRATION.sql`
2. Resolve `tenantId` pre-provision decision
3. Apply migration on certification/staging only
4. Run `BLUEPRINT_1A_VERIFICATION.sql`
5. Confirm `cloud-data-api-containment:verify`

### 1B.2 — Prisma repository implementation

- Implement `BlueprintRepository`, `BlueprintVersionRepository`, `BlueprintReviewRepository`, `BlueprintAuditRepository` against Prisma
- Wire `BlueprintLifecycleService` with optimistic concurrency
- Server-side hash pipeline on version create

### 1B.3 — Authority alignment

- Align route guards with `authority-matrix.ts`
- Keep IMPLEMENTER denied unless owner explicitly expands
- Request-owner access via `submittedByUserId`

### 1B.4 — Routes (schema-dependent)

- `/admin/blueprints/*` — persistent lifecycle UI
- `/client/requests/[requestId]/blueprint` — client projection + review
- Keep `/admin/blueprint-studio` ephemeral

### 1B.5 — Studio handoff

- "Persist version" from Blueprint Studio → `createImmutableVersion`
- No auto-share with client

### 1B.6 — Regression gates

All 1A gates plus integration tests against staging DB.

## Explicit non-goals for 1B

- Tenant provisioning
- Authority / membership application
- Discovery or Candidate 07 changes
- Production deploy until certification sign-off

## Deliverables checklist

- [ ] Migration applied (staging)
- [ ] Verification SQL pass
- [ ] Prisma repositories
- [ ] Lifecycle service wired to API
- [ ] Client + admin UI (minimal viable review)
- [ ] Certification deployment with persistence enabled
