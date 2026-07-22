# IMPLEMENTATION-0D — Dependency Advisory Review

| Field | Value |
|-------|-------|
| **Document ID** | GHV-IMP-0D-DEP-REVIEW |
| **Gate** | GHV.IMPLEMENTATION.0D · GHV.IMPLEMENTATION.0D-CLOSURE-01 |
| **Date** | 2026-07-22 |
| **Method** | `npm ci` · `npm audit --json` · `validate:high-advisory-boundaries` · `npm ls sharp` |

## Checkpoint

```text
Critical: 0
High: 0
High runtime-reachable: 0
Moderate: 6
Untriaged: 0
Blocking: 0
sharp: 0.35.3
```

## Retained predecessor conditions

| Advisory | Treatment |
|----------|-----------|
| **ADV-001** | esbuild through drizzle-kit — ACCEPT TEMPORARILY WITH OWNER |
| **ADV-002** | PostCSS through Next.js — ACCEPT TEMPORARILY WITH OWNER |
| ADV-003 | FIXED earlier (`sharp@0.35.3`) — preserved |

## Runtime dependency change in 0D / CLOSURE-01

```text
New runtime dependency introduced: NO
Lockfile-only installs: YES (npm ci)
npm audit fix / force: NOT USED
```

## Notes

- Predecessor Moderate conditions are preserved, not erased.
- CLOSURE-01 does not authorize dependency upgrades except reviewed Gate-scoped changes (none required here).
- Blocking advisory count remains **0**.
