# F28 — Demo Data / Mock Mode Excellence (no paid infra)

**Date:** 26 May 2026  
**Owner:** Muhanad  
**Status:** PASSED

---

## Objective

Harden demo/mock mode so staging and Vercel builds remain stable when `USE_MOCK_DATA` is enabled or when DB-backed paths are unavailable.

Constraints preserved:
- No paid infrastructure
- No external APIs
- No fake production claims
- No schema migrations

---

## 1) Mock mode audit

Mapped entry points:
- `src/lib/mock/env.ts`
- `src/lib/mock/pipeline.ts`
- `src/lib/mock/discovery.ts`
- `src/lib/mock/blueprint.ts`
- `src/lib/mock/meem-global.ts`
- `isUseMockData()` consumers in tenant/admin/portal/public health routes
- `MOCK_*` consumers across proposal, admin requests, portal requests, pricing, and workspace summaries

High-risk findings:
- Mock chain integrity depended on implicit assumptions (request -> discovery -> blueprint linkage) with no dedicated preflight check.
- Build failures can occur from missing tracked support files (example pattern seen in prior SAREA helper incident).
- Tenant mock typing had a service-level cast (`mock as TenantBySlug`) that reduced compile-time protection.

---

## 2) Type alignment decisions

Implemented:
- Added explicit Prisma payload typing for MEEM tenant mock in `src/lib/mock/meem-global.ts`:
  - `meemTenantInclude` + `MeemMockTenant`
  - `getMeemMockTenant()` now returns `MeemMockTenant | null`
- Removed cast in `src/lib/services/tenant.service.ts`:
  - from `mock as TenantBySlug` to direct typed return

Alignment policy retained:
- Use explicit `null` for unavailable relations (`tenant`, `proposalToken`, `blueprintId`, etc.).
- Keep mock data advisory/demo scoped (no fake production IDs or claims).

---

## 3) Build safety script

Added lightweight integrity guard:
- `scripts/verify-mock-mode-integrity.ts`
- npm command: `npm run mock:verify`

Checks covered:
- Required mock files exist
- Required discovery template JSON files exist
- Required SAREA/CyberCrow support files exist
- Critical mock module imports resolve
- Mock request -> discovery -> blueprint chain consistency
- Demo tenant assumptions:
  - MEEM tenant availability
  - Rimal module list excludes logistics/warehouse leakage

No heavy dependencies added.
No external APIs used.
No paid services required.

---

## 4) Demo tenant consistency

Validated:
- MEEM remains logistics lighthouse (`meem-global`) with dedicated mock profile and blueprint chain.
- Rimal remains construction-scoped via `RIMAL_MODULE_KEYS` without logistics/warehouse bleed.
- Mock mode remains explicitly demo-oriented and environment-signaled (`USE_MOCK_DATA`).

---

## 5) Route/import reliability

Guarded by F28 checks for existence of:
- Discovery template packs (`aviation`, `construction`, `healthcare`, `logistics`, `retail`)
- `src/lib/sarea/studio-helpers.ts`
- `src/lib/services/sarea-materialization.service.ts`
- `src/lib/services/discovery-completion-gate.service.ts`
- `src/lib/services/cybercrow-seed.service.ts`
- `src/components/studio/sarea/sarea-tenant-health-panel.tsx`

This specifically targets the class of Vercel failures caused by missing tracked support modules.

---

## 6) Vercel failure lessons (applied)

- If a support module is required by server routes/UI composition, verify file existence as part of preflight.
- Prefer typed payload construction over service-level casting for mock objects consumed by include-heavy pages.
- Keep mock relation chains deterministic and validated in CI-safe scripts.

---

## 7) Remaining gaps

- Optional: run `npm run simulate:vercel-build:staging` as a “Vercel-like” local confidence check.
  - Treat Windows-only Prisma file lock/EPERM errors as local noise **only if** `npm run build` is already green.

- The working tree may contain unrelated changes (outside F28). Any future commit for F28 must remain scoped to:
  - `scripts/verify-mock-mode-integrity.ts`
  - `package.json`
  - `src/lib/mock/meem-global.ts`
  - `src/lib/services/tenant.service.ts`
  - `docs/internal/F28_DEMO_DATA_MOCK_MODE_EXCELLENCE.md`
  - `docs/internal/PROJECT_STATUS.md`
  - `docs/internal/MILESTONES.md`

---

## 8) Operator checklist before deploy

1. Run `npm run mock:verify`
2. Run `npm run typecheck`
3. Run `npm run lint`
4. Run `npm run build`
5. Run `npm run public:mirror-manifest`
6. Run `npm run meem:ids:staging`
7. Run `npm run tenant:verify:rimal`
8. Run `npm run request:pipeline:verify`
9. Run `npm run request:e2e:dry`

---

## Final acceptance decision

**PASSED** if:
- `npm run mock:verify` passes
- `npm run typecheck`, `npm run lint`, `npm run build`, and `npm run public:mirror-manifest` pass
- No paid infrastructure, external APIs, or schema changes were introduced

This phase is **PASSED** based on the final validation results and the integrity guardrail now living in the repo as `mock:verify`.

