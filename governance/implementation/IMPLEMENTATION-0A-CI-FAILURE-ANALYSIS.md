# Implementation 0A CI Failure Analysis

| Field                     | Value                                               |
| ------------------------- | --------------------------------------------------- |
| **Document ID**           | GHV-IMP-0A-CI-FAIL-001                              |
| **Gate**                  | GHV.IMPLEMENTATION.0A-CLOSURE-01                    |
| **Date**                  | 2026-07-21                                          |
| **Bootstrap commit**      | `9a0bfd7e780b7b13b48c9324dd9715d5aadb114e`          |
| **Workflow run**          | `29871868486`                                       |
| **Job**                   | `verify`                                            |
| **Conclusion**            | `failure`                                           |
| **Failed step**           | `npm run ci`                                        |
| **First failing command** | `npm run format:check`                              |
| **Failing file**          | `packages/contracts/generated/screen-registry.json` |

## Root cause

`scripts/governance/validate-routes.mjs` previously wrote the generated registry using `JSON.stringify(body, null, 2)`, which expands short arrays onto multiple lines:

```json
"excludedAliases": [
  "ACT-004"
]
```

Repository Prettier (default JSON rules) canonicalizes short arrays to a single line:

```json
"excludedAliases": ["ACT-004"]
```

The committed artifact therefore failed `prettier --check` on Linux CI (and locally after `npm ci`). The defect is formatting drift between the generator and Prettier, not screen-count corruption.

Secondary defect: the old `validate:routes` **mutated** the working tree during CI. CI must validate drift without rewriting tracked files.

## Platform notes

| Platform               | Observation                                        |
| ---------------------- | -------------------------------------------------- |
| Windows (local)        | Failure reproducible after clean `npm ci`          |
| Linux (GitHub Actions) | Same failure at `format:check` before later stages |

## Impact

```text
Product behavior impact:
NONE

Architecture impact:
NONE

Screen baseline impact:
NONE

CI reproducibility impact:
YES
```

## Correction strategy

1. Shared generator formats output through Prettier API.
2. Local `generate:screen-registry` writes the committed artifact.
3. CI `validate:routes` / `validate:generated` compare committed bytes to canonical output without writing.
4. Preserve 92 ACTIVE / 7 shells / ACT-004 excluded / ACT-013 present.
