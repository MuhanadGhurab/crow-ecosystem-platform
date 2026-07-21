# Implementation 0B Dependency Advisory Review

| Field | Value |
|-------|-------|
| **Document ID** | GHV-IMP-0B-DEP-ADV-001 |
| **Gate** | GHV.IMPLEMENTATION.0B |
| **Date** | 2026-07-21 |
| **Tool** | `npm audit` (no `--force`) |
| **Predecessor** | [IMPLEMENTATION-0A-DEPENDENCY-ADVISORY-REVIEW.md](./IMPLEMENTATION-0A-DEPENDENCY-ADVISORY-REVIEW.md) |

## Totals

| Severity | Count |
|----------|------:|
| Critical | **0** |
| High | **2** |
| Moderate | **5** |
| Low | **0** |
| Untriaged | **0** |
| Blocking | **0** |

## Advisory groups

### ADV-001 — esbuild (GHSA-67mh-4wv8-2f99) — Moderate

Unchanged from 0A. Transitive via `drizzle-kit`. Not Production-reachable. **ACCEPT TEMPORARILY WITH OWNER** → GHV.IMPLEMENTATION.0C or next hygiene Gate.

### ADV-002 — PostCSS (GHSA-qx2v-qp2m-jg93) — Moderate

Unchanged from 0A. Transitive via `next@16.2.10`. Force fix → Next 9.x rejected. **ACCEPT TEMPORARILY WITH OWNER** → controlled Next forward patch.

### ADV-003 — sharp / libvips (GHSA-f88m-g3jw-g9cj) — High

| Field | Value |
|-------|-------|
| Packages | `sharp` <0.35.0 (pulled by `next@16.2.10`) |
| Severity | High (npm reports 2 High nodes in chain) |
| Runtime reachable Product path | Next image / sharp native path; Preview/Production **not authorized**; local foundation only |
| npm suggested fix | Force-install `next@9.3.3` (**Architecture-breaking** — rejected) |
| Classification | **ACCEPT TEMPORARILY WITH OWNER** |
| Owner Gate | Controlled Next forward patch when Architecture-compatible sharp ≥0.35 is available without ADR rebase |
| Action | Keep `next@16.2.10`. No `npm audit fix --force`. |

## Rules applied

- No Critical → not blocked by Critical
- High fully triaged with temporary acceptance + owner → **Untriaged: 0** · **Blocking: 0**
- No `npm audit fix --force`
- No silent ADR-level Next/React/Drizzle/TypeScript change

```text
Blocking advisories: 0
Accepted temporary risks: ADV-001 · ADV-002 · ADV-003
Next review: GHV.IMPLEMENTATION.0C dependency hygiene checkpoint
```
