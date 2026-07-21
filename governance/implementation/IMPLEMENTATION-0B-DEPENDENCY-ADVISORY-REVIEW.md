# Implementation 0B Dependency Advisory Review

| Field | Value |
|-------|-------|
| **Document ID** | GHV-IMP-0B-DEP-ADV-001 |
| **Gate** | GHV.IMPLEMENTATION.0B · amended by **GHV.IMPLEMENTATION.0B-CLOSURE-01** |
| **Date** | 2026-07-21 (original) · **2026-07-22 (amendment)** |
| **Tool** | `npm audit --json` (no `--force`) |
| **Predecessor** | [IMPLEMENTATION-0A-DEPENDENCY-ADVISORY-REVIEW.md](./IMPLEMENTATION-0A-DEPENDENCY-ADVISORY-REVIEW.md) |
| **Related** | [IMPLEMENTATION-0B-HIGH-ADVISORY-ANALYSIS.md](./IMPLEMENTATION-0B-HIGH-ADVISORY-ANALYSIS.md) · [IMPLEMENTATION-0B-SHARP-RUNTIME-REACHABILITY.md](./IMPLEMENTATION-0B-SHARP-RUNTIME-REACHABILITY.md) |

## Amendment notice (CLOSURE-01)

The original 0B review recorded **High: 2**, classified ADV-003 as **ACCEPT TEMPORARILY WITH OWNER**, and concluded **Blocking: 0**.

That conclusion conflicted with the governing stop rule:

```text
High runtime-reachable advisory remains: BLOCKED
```

Preview/Production prohibition **must not** make a High runtime-reachable advisory non-blocking. Original finding text for ADV-003 is preserved below under “Original finding (historical)”. Closure disposition supersedes temporary acceptance.

## Corrected policy rules

| Severity / class | Gate effect |
|------------------|-------------|
| Critical | **BLOCKING** |
| High runtime-reachable | **BLOCKING** |
| High reachability inconclusive | **BLOCKING** (treated as reachable) |
| High proven unreachable | MAY BE RETAINED TEMPORARILY WITH CI GUARD, OWNER, AND LATEST SAFE CLOSURE POINT |
| Moderate | REQUIRES TRIAGE AND OWNER |
| Untriaged | **BLOCKING** |

## Post-CLOSURE-01 totals

| Severity | Count |
|----------|------:|
| Critical | **0** |
| High | **0** |
| High runtime-reachable | **0** |
| Moderate | **6** |
| Low | **0** |
| Untriaged | **0** |
| Blocking | **0** |

## Advisory groups

### ADV-001 — esbuild (GHSA-67mh-4wv8-2f99) — Moderate

Unchanged from 0A. Transitive via `drizzle-kit` (`@esbuild-kit/*` → `esbuild`). Not a Production runtime Product path for the authorized activation slice. **ACCEPT TEMPORARILY WITH OWNER** → GHV.IMPLEMENTATION.0C or next hygiene Gate.

### ADV-002 — PostCSS (GHSA-qx2v-qp2m-jg93) — Moderate

Unchanged from 0A. Transitive via `next@16.2.10`. Force fix → Next 9.x rejected. **ACCEPT TEMPORARILY WITH OWNER** → controlled Next forward patch when Architecture-compatible.

### ADV-003 — sharp / libvips (GHSA-f88m-g3jw-g9cj) — High → **FIXED**

#### Original finding (historical)

| Field | Value |
|-------|-------|
| Packages | `sharp` &lt;0.35.0 (pulled by `next@16.2.10`) |
| Severity | High (npm reported 2 High nodes in chain) |
| Runtime reachable Product path | Next image / sharp native path; Preview/Production **not authorized**; local foundation only |
| npm suggested fix | Force-install `next@9.3.3` (**Architecture-breaking** — rejected) |
| Original classification | **ACCEPT TEMPORARILY WITH OWNER** (superseded — incorrect Blocking treatment) |

#### Closure disposition

| Field | Value |
|-------|-------|
| Disposition | **FIXED — SAFE COMPATIBLE UPDATE** |
| Remediation | npm `overrides.sharp = 0.35.3` + `@ghuravia/web` direct `sharp@0.35.3` |
| Evidence | [IMPLEMENTATION-0B-HIGH-ADVISORY-ANALYSIS.md](./IMPLEMENTATION-0B-HIGH-ADVISORY-ANALYSIS.md) |
| Reachability record | [IMPLEMENTATION-0B-SHARP-RUNTIME-REACHABILITY.md](./IMPLEMENTATION-0B-SHARP-RUNTIME-REACHABILITY.md) |
| CI | `validate:high-advisory-boundaries` |

## Rules applied (post-amendment)

- Critical → blocking if present
- High runtime-reachable or inconclusive → blocking until fixed, removed, or proven unreachable with CI guard
- High must not be accepted solely because Preview/Production is blocked
- Moderate → triage + owner required
- Untriaged → blocking
- No `npm audit fix --force`
- No silent ADR-level Next/React/Drizzle/TypeScript change

```text
Blocking advisories: 0
Accepted temporary Moderate risks: ADV-001 · ADV-002
ADV-003: FIXED
Next review: GHV.IMPLEMENTATION.0C dependency hygiene checkpoint (Moderate)
```
