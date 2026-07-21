# Testing and CI

## Commands

```bash
npm ci
npm run format:check
npm run lint
npm run typecheck
npm test
npm run test:invariants
npm run validate:routes
npm run validate:generated
npm run validate:boundaries
npm run validate:secrets
npm run validate:deployment-guard
npm run build
npm run ci
```

Local regeneration of the screen-registry artifact (not used by CI):

```bash
npm run generate:screen-registry
```

CI validates drift; it does not rewrite tracked generated files.

## Lint policy (GHV.IMPLEMENTATION.0A-CLOSURE-01)

| Rule                                 | Policy                                                      |
| ------------------------------------ | ----------------------------------------------------------- |
| Errors                               | **0 allowed**                                               |
| Warnings                             | **0 preferred**                                             |
| Temporary warnings                   | Must be enumerated, owned, and time-bounded                 |
| Current warning count                | **0** (anonymous default-export warning removed in closure) |
| Owner Gate for stricter/future rules | GHV.IMPLEMENTATION.0B                                       |
| Weakening lint to obtain green CI    | **Prohibited**                                              |

## Generated artifact policy

```text
Authoritative Screen Registry
→ Deterministic Generator (Prettier-formatted)
→ Committed JSON
→ Drift Validation in CI (no mutation)
```

Totals must remain: **92 ACTIVE · 7 shells · ACT-004 excluded · ACT-013 present**.

## Deployment

CI is read-only (`permissions: contents: read`), has no deploy job, uses no Production secrets, and does not call providers. Branch deploy guard remains active.
