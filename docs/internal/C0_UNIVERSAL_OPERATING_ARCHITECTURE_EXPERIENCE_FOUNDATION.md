# C0 — Universal Operating Architecture & Experience Foundation

**Branch:** `feat/c0-universal-operating-architecture` (from `main` @ `a5620c3`)  
**Status:** In progress on feature branch — **no merge to main**, **no M4D/PR #2 changes**  
**Last updated:** 14 Jun 2026

## Executive summary

C0 establishes Crow Core as the canonical architecture foundation: **15 architecture documents**, **persistence-neutral contracts** under `src/lib/crow-core/`, a protected **Architecture Lab** reference prototype at `/admin/architecture-lab`, and **`npm run crow-core-foundation:verify`**.

No Prisma migrations, no production auth changes, no live government integrations, no autonomous AI claims.

## Deliverables

| Deliverable | Location | Status |
|-------------|----------|--------|
| Architecture docs (15) | `docs/architecture/crow-core/` | Complete |
| TypeScript contracts | `src/lib/crow-core/` | Complete |
| Architecture Lab | `src/app/admin/architecture-lab/` | Complete |
| Verifier | `scripts/verify-crow-core-foundation.ts` | Complete |
| Transition map | Doc 13 | Complete |
| ADRs / open questions | Doc 14 | Complete |

## Constitutional rules (enforced by verifier)

- SAREA **never** grants permissions or membership
- Government identity ≠ Crow authorization
- Blueprint includes ROI (`RoiModel`) and SOW (`SowDraft`) types
- Traceability chain (`MaterialChange`, actor types including `ai_assistant`)
- 22-stage `ProcessLifecycleStage`
- Security dimensions beyond CIA (15 dimensions)
- Tenant resilience (`TenantQuota`, `AbuseSignal`, `DegradationPolicy`)
- CyberCrow: not SIEM, not autonomous SOC

## Leveraged prior art (not replaced)

- `crow-ux-principles.ts`, `crow-route-ownership.ts`, `crow-simplified-lifecycle.ts`
- `sarea-experience-mapping-contract.ts`, `portal-access-contract.ts`
- `cem-operating-model-contract.ts`, `procrow-control-tower-contract.ts`
- `verify-architecture-simplification.ts` (pattern for C0 verifier)

## Verification

Run on C0 branch:

```powershell
npm run crow-core-foundation:verify
```

Full section-21 suite documented in C0 plan; see `PROJECT_STATUS.md` after verification run.

## Next slices (not in C0)

C1 Blueprint versioning → C2 Traceability → C3 Process fabric → … → C10 Saudi adapters (flagged).

## Isolation guarantee

- `feat/m4d-invite-email-delivery` and PR #2 untouched
- Migration baseline: **13** SQL files (no new migrations in C0)
- No commits/pushes unless explicitly requested
