# Implementation 0C Dependency Advisory Review

| Field | Value |
|-------|-------|
| **Document ID** | GHV-IMP-0C-DEP-ADV-001 |
| **Gate** | GHV.IMPLEMENTATION.0C |
| **Date** | 2026-07-22 |
| **Tool** | `npm audit --json` (no `--force`) |
| **Predecessor** | [IMPLEMENTATION-0B-DEPENDENCY-ADVISORY-REVIEW.md](./IMPLEMENTATION-0B-DEPENDENCY-ADVISORY-REVIEW.md) (amended CLOSURE-01) |
| **Branch** | `feat/ghuravia-foundation` |

## 0C dependency additions (dev-only)

| Package | Version | Scope | Purpose |
|---------|---------|-------|---------|
| `@playwright/test` | ~1.61.1 | devDependency | Keyboard + route-guard e2e |
| `@axe-core/playwright` | ~4.12.1 | devDependency | Automated accessibility scan |

Neither package is a Production runtime path. Preview/Production remain **not authorized**.

## Totals

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

Unchanged from 0A/0B. Transitive via `drizzle-kit` (`@esbuild-kit/*` → `esbuild`). Not a Production runtime Product path. **ACCEPT TEMPORARILY WITH OWNER** → next hygiene Gate.

### ADV-002 — PostCSS (GHSA-qx2v-qp2m-jg93) — Moderate

Unchanged from 0A/0B. Transitive via `next@16.2.10`. Force fix → Next 9.x rejected. **ACCEPT TEMPORARILY WITH OWNER** → controlled Next forward patch when Architecture-compatible.

### ADV-003 — sharp / libvips — **FIXED** (inherited from 0B-CLOSURE-01)

| Field | Value |
|-------|-------|
| Remediation | npm `overrides.sharp = 0.35.3` + `@ghuravia/web` direct `sharp@0.35.3` |
| 0C checkpoint | **No regression** — sharp remains **0.35.3** |

## Policy rules (unchanged from 0B-CLOSURE-01)

| Severity / class | Gate effect |
|------------------|-------------|
| Critical | **BLOCKING** |
| High runtime-reachable | **BLOCKING** |
| High reachability inconclusive | **BLOCKING** |
| High proven unreachable | MAY BE RETAINED TEMPORARILY WITH CI GUARD, OWNER, AND LATEST SAFE CLOSURE POINT |
| Moderate | REQUIRES TRIAGE AND OWNER |
| Untriaged | **BLOCKING** |

## Predecessor verdicts retained

| Document | Verdict |
|----------|---------|
| IMPLEMENTATION-0B-DEPENDENCY-ADVISORY-REVIEW (post-CLOSURE-01) | Blocking **0** · ADV-003 **FIXED** |
| GHV.IMPLEMENTATION.0B Gate | **PARTIAL** — non-blocking Moderate conditions |

## Verdict

```text
PASS WITH CONDITIONS — BLOCKING ADVISORIES 0;
RETAINED MODERATE ADV-001 · ADV-002 WITH OWNER;
SHARP 0.35.3 FIXED STATE MAINTAINED;
NEW DEV-ONLY E2E/A11Y DEPS ADDED WITHOUT RUNTIME EXPOSURE
```

Next review: GHV.IMPLEMENTATION.0D dependency hygiene checkpoint (Moderate) or dedicated hygiene Gate.
