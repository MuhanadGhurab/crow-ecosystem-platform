# Implementation 0A Dependency Advisory Review

| Field           | Value                                               |
| --------------- | --------------------------------------------------- |
| **Document ID** | GHV-IMP-0A-DEP-ADV-001                              |
| **Gate**        | GHV.IMPLEMENTATION.0A-CLOSURE-01                    |
| **Date**        | 2026-07-21                                          |
| **Tool**        | `npm audit` (no `--force`)                          |
| **Lockfile**    | committed `package-lock.json` @ bootstrap + closure |

## Totals

| Severity  | Count |
| --------- | ----: |
| Critical  | **0** |
| High      | **0** |
| Moderate  | **6** |
| Low       | **0** |
| Untriaged | **0** |
| Blocking  | **0** |

## Advisory groups

### ADV-001 — esbuild dev-server request smuggling (GHSA-67mh-4wv8-2f99)

| Field                          | Value                                                                                                                                                         |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Packages                       | `esbuild` ≤0.24.2 → `@esbuild-kit/core-utils` → `@esbuild-kit/esm-loader` → `drizzle-kit`                                                                     |
| Direct / transitive            | Transitive via direct `drizzle-kit` (devDependency of `@ghuravia/data`)                                                                                       |
| Severity                       | Moderate                                                                                                                                                      |
| Runtime reachable Product path | **No** — drizzle-kit/esbuild used for local migration tooling / generate only                                                                                 |
| Exploit preconditions          | Attacker page + local esbuild **development server** listening; not used in Production deploy (deploy prohibited)                                             |
| npm suggested fix              | Downgrade `drizzle-kit` to `0.18.1` (semver-major, **incorrect direction**)                                                                                   |
| Classification                 | **ACCEPT TEMPORARILY WITH OWNER**                                                                                                                             |
| Owner Gate                     | GHV.IMPLEMENTATION.0B or next dependency hygiene Gate                                                                                                         |
| Action                         | Do **not** `npm audit fix --force`. Retain drizzle-kit 0.31.x aligned with Drizzle ORM 0.45.2 until a forward-compatible kit release removes esbuild ≤0.24.2. |

### ADV-002 — PostCSS CSS stringify XSS (GHSA-qx2v-qp2m-jg93)

| Field                          | Value                                                                                                                               |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| Packages                       | `postcss` <8.5.10 → pulled by `next@16.2.10`                                                                                        |
| Direct / transitive            | Transitive via direct `next`                                                                                                        |
| Severity                       | Moderate                                                                                                                            |
| Runtime reachable Product path | Build/tooling path via Next CSS pipeline; Preview/Production **not authorized**; local-only foundation                              |
| Exploit preconditions          | Untrusted CSS content reaching PostCSS stringify in a context that reflects into HTML; foundation has no user-supplied CSS surfaces |
| npm suggested fix              | Downgrade `next` to `9.3.3` (**unsafe / Architecture-breaking** — rejected)                                                         |
| Classification                 | **ACCEPT TEMPORARILY WITH OWNER**                                                                                                   |
| Owner Gate                     | Controlled Next patch review when a **forward** `next@16.2.x`/`16.3.x` pin with fixed postcss is Architecture-compatible            |
| Action                         | Keep `next@16.2.10` (ADR-ARC-002 / Validation.1B pin). No force fix. Track upgrade when patch available without ADR rebase.         |

### Chain summaries (same root causes)

| Package                   | Role                      | Classification                          |
| ------------------------- | ------------------------- | --------------------------------------- |
| `@esbuild-kit/core-utils` | Transitive of drizzle-kit | ACCEPT TEMPORARILY WITH OWNER (ADV-001) |
| `@esbuild-kit/esm-loader` | Transitive of drizzle-kit | ACCEPT TEMPORARILY WITH OWNER (ADV-001) |
| `drizzle-kit`             | Direct devDependency      | ACCEPT TEMPORARILY WITH OWNER (ADV-001) |
| `next`                    | Direct runtime/framework  | ACCEPT TEMPORARILY WITH OWNER (ADV-002) |
| `postcss`                 | Transitive of next        | ACCEPT TEMPORARILY WITH OWNER (ADV-002) |

## Rules applied

- No Critical → closure not blocked by Critical
- No High → closure not blocked by High
- Moderate fully triaged → **Untriaged: 0**
- No `npm audit fix --force`
- No silent ADR-level Next/React/Drizzle/TypeScript change

## Closure disposition

```text
Blocking advisories:
0

Accepted temporary moderate risks:
2 root causes (6 npm nodes)

Next review:
GHV.IMPLEMENTATION.0B dependency hygiene checkpoint
```
