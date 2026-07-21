# GHV.IMPLEMENTATION.0A — Local Product Code Authorization

| Field | Value |
|-------|-------|
| **Gate ID** | GHV.IMPLEMENTATION.0A |
| **Date** | 2026-07-21 |
| **Authorization** | GHV-IMP-AUTH-001 |
| **Branch** | `feat/ghuravia-foundation` |
| **Starting HEAD** | `d74ab043ff1c855f2b61e883d5b157f8db2d9d56` |
| **Baseline** | GHURAVIA Product Code Bootstrap Baseline v0.1.0 |

## Verdict

```text
PASS — LIMITED PRODUCT CODE AUTHORIZED
AND FOUNDATION BOOTSTRAPPED WITH CI VERIFIED
```

Formal closure: [GHV.IMPLEMENTATION.0A-CLOSURE-01.md](./GHV.IMPLEMENTATION.0A-CLOSURE-01.md) · Remote CI VERIFIED (Actions run `29872538651`).

Original substantive bootstrap wording retained as historical:

```text
PASS — GHURAVIA PRODUCT CODE AUTHORIZED AND FOUNDATION WORKSPACE BOOTSTRAPPED
```

## Authorization and completed scope

```text
GHV-IMP-AUTH-001 GRANTED — LIMITED TO GHV.IMPLEMENTATION.0A BOOTSTRAP SCOPE
```

- Created bounded Product Code roots: `apps/`, `packages/`, `workers/`, and `scripts/`.
- Established the root npm workspace and the authorized foundation packages.
- Preserved package boundaries, local-only configuration and secrets controls, provider mocks, the 92/7 route registry, and the non-deploying CI workflow.
- Created the activation, audit, and outbox foundation migration; local migrate and reset passed on disposable PostgreSQL, which was then torn down.
- Confirmed `npm run ci` passes locally.

## Runtime baseline

| Component | Version |
|-----------|---------|
| Node | 24.15.0 |
| Next.js | 16.2.10 |
| React | 19.2.8 |
| Drizzle ORM | 0.45.2 |
| TypeScript | 6.0.3 |

TypeScript 6.0.3 is the documented compatibility pin, deviating from the Validation.1B candidate 7.0.2. This is an accepted condition, not an architecture change.

## Acceptance outcome

| Measure | Result |
|---------|--------|
| Mandatory acceptance items | PASS |
| Mandatory items not run | 0 |
| Scope violations | 0 |
| Architecture contradictions | 0 |
| Deployment attempts | 0 |
| Conditional results | 1 — TypeScript compatibility pin |

The detailed evidence is recorded in [IMPLEMENTATION-0A-ACCEPTANCE-MATRIX.md](../implementation/IMPLEMENTATION-0A-ACCEPTANCE-MATRIX.md).

## Restrictions retained

```text
Providers: MOCKS ONLY
Preview: BLOCKED
Staging: BLOCKED
Controlled Launch: NOT READY
Production: NOT AUTHORIZED
```

`vercel.json` keeps `feat/ghuravia-foundation` deployment disabled. This Gate does not authorize real providers, Preview, Staging, Controlled Launch, Production, cloud databases, or non-synthetic data.

## Invariants unchanged

- Master Screen Registry remains **92 ACTIVE / 7 shells**.
- Architecture Gate verdicts are unchanged.
- Architecture Design Baseline remains governed design only; it is not external proof or deployment authorization.

## Next Gate

```text
GHV.IMPLEMENTATION.0B:
BLOCKED PENDING CLOSURE-RECORD RECONCILIATION
```

See [GHV.IMPLEMENTATION.0A-CLOSURE-01.md](./GHV.IMPLEMENTATION.0A-CLOSURE-01.md) and [IMPLEMENTATION-0A-CLOSURE-RECORD-RECONCILIATION.md](../implementation/IMPLEMENTATION-0A-CLOSURE-RECORD-RECONCILIATION.md).

