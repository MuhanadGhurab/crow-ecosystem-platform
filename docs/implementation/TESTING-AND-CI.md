# Testing and CI

## Commands

```bash
npm ci
npm run db:migrate   # requires GHURAVIA_* local/test env
npm run format:check
npm run lint
npm run typecheck
npm test
npm run test:invariants
npm run test:integration
npm run db:validate
npm run validate:routes
npm run validate:generated
npm run validate:boundaries
npm run validate:secrets
npm run validate:deployment-guard
npm run build
npm run ci
```

## CI (GitHub Actions)

- Service: `postgres:16-alpine` (ephemeral)
- Env: `GHURAVIA_RUNTIME_MODE=automated_test`, synthetic DB URL `ghuravia_test_ci`, session secret
- Steps: `npm ci` → `db:migrate` → `npm run ci` (includes integration tests)
- `permissions: contents: read` · no deploy · no provider secrets

## Lint policy

| Rule                              | Policy          |
| --------------------------------- | --------------- |
| Errors                            | **0 allowed**   |
| Warnings                          | **0 preferred** |
| Weakening lint to obtain green CI | **Prohibited**  |

## Generated artifact policy

Totals must remain: **92 ACTIVE · 7 shells · ACT-004 excluded · ACT-013 present**.

## Deployment

CI is read-only. Branch deploy guard remains active (`feat/ghuravia-foundation`: false).
