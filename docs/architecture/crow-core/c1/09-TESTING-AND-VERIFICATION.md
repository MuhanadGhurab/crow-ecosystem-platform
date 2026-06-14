# 09 — Testing and Verification

## Unit tests (tsx)

| Test file | Coverage |
|-----------|----------|
| `blueprint-version.service.test.ts` | Snapshot create/approve/immutability |
| `blueprint-diff.service.test.ts` | Section diff + impact |
| `blueprint-hash.service.test.ts` | Deterministic hash |
| `roi-calculator.test.ts` | Scenario formulas |
| `sow-generator.test.ts` | 22 sections + warnings |

Run: `npm run test:blueprint-studio`

## Verifier script

`scripts/verify-enterprise-blueprint-studio.ts`

Checks:

- C1 doc corpus (00–10 + persistence artifacts)
- Service modules and Studio UI routes
- No new Prisma migrations (baseline **13**)
- Path A + C documented
- Persistence-neutral crow-core
- Architecture Lab C1 mocks
- `requireActionDiscoveryWrite` on studio actions
- Internal doc states CONDITIONAL PASS

Run: `npm run enterprise-blueprint-studio:verify`

## Full validation suite (release gate)

1. `enterprise-blueprint-studio:verify`
2. `crow-core-foundation:verify`
3. `tenant-membership:verify` (if on branch)
4. `typecheck`, `lint`, `build`
5. `public:mirror-manifest`, `smoke:phase1`

Document results in `docs/internal/C1_ENTERPRISE_BLUEPRINT_STUDIO.md` Section 23.
