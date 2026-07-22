# GHV.IMPLEMENTATION.0C-CLOSURE-01 — Mandatory Validation Gap Analysis

| Field | Value |
|-------|-------|
| **Document ID** | GHV-IMP-0C-GAP-001 |
| **Gate** | GHV.IMPLEMENTATION.0C-CLOSURE-01 |
| **Date** | 2026-07-22 |
| **Branch** | `feat/ghuravia-foundation` |
| **Documentation HEAD** | `2e47d0b2ceb986a4abf38bd6637576bfccedc7d2` |
| **Implementation HEAD** | `024b71f395d24bdc0d419d1046ec0879dc6a5100` |
| **Implementation Actions** | `29879464258` · verify `88796880094` · **success** |
| **Final documentation Actions** | `29879640980` · verify `88797397265` · **success** |
| **Predecessor Gate** | GHV.IMPLEMENTATION.0C — **PARTIAL** (retained) |

## Purpose

Record the mandatory correctness and validation gaps discovered after the submitted `GHV.IMPLEMENTATION.0C` gate report. This analysis is the evidence basis for `GHV.IMPLEMENTATION.0C-CLOSURE-01`.

## Predecessor verdicts (retained)

| Gate | Verdict |
|------|---------|
| GHV.IMPLEMENTATION.0B | **PARTIAL** — FOUNDATION RUNTIME AND ACTIVATION VERTICAL SLICE COMPLETE WITH NON-BLOCKING MODERATE DEPENDENCY CONDITIONS |
| GHV.IMPLEMENTATION.0B-CLOSURE-01 | **PARTIAL** — SECURITY CLOSURE COMPLETE WITH NON-BLOCKING MODERATE DEPENDENCY CONDITIONS |
| GHV.IMPLEMENTATION.0C | **PARTIAL** — GHURAVIA ACTIVATION UX, ACCESSIBILITY AND ONBOARDING ENTRY HARDENING COMPLETE WITH NON-BLOCKING VALIDATION CONDITIONS |

Remote CI success on the implementation and documentation commits proves only that the committed checks passed. It does not prove that every mandatory `0C` scenario was implemented or tested.

## Route-guard defect

### Current behavior

```text
Client Component mounts
→ GET /api/activation
→ canAccessScreen()
→ router.replace()
```

### Classification

| Control | Status |
|---------|--------|
| Client-side UX guard | **PRESENT** |
| Server-authoritative page guard | **NOT PROVEN** |
| Protected route rejection before page render | **NOT PROVEN** |

The activation access policy may be correct as a pure function, but enforcement occurs only after the protected page client bundle mounts and fetches activation state. Unauthorized users may receive protected screen markup before the client redirect completes.

## Browser-test gaps

The Playwright suite at implementation HEAD contains **3** tests in `apps/web/e2e/activation-flow.spec.ts`:

| Test | Coverage | Gap |
|------|----------|-----|
| Keyboard activation flow to onboarding entry | End-to-end happy path | Still uses `.click()` for terms and account-risk acceptance — not genuinely keyboard-only |
| Route guard blocks terms before email verification | ACT-005 only | Single guard case; no matrix for other protected routes |
| axe critical/serious violations are zero on activation screens | Loop over routes after bootstrap | Scans without establishing authorized states; redirect substitutes for actual screen states |

### Mandatory scenarios not automated

| Category | Missing scenarios |
|----------|-------------------|
| Refresh / resume | After verification requested · after email verified · after terms accepted · after activation complete |
| Provider failure / timeout | Deterministic failure · stable idempotency retry |
| Challenge lifecycle | Expired challenge · superseded challenge |
| Version / idempotency | Stale aggregate version · idempotency replay · idempotency payload conflict |
| Session | Session expiry |
| Route guards | ACT-013 · ACT-006 · ACT-007 · ONB-001 · ACT-012 without recoverable condition |
| Accessibility | Actual-state axe scans (authorized major states, not bootstrap/redirect substitutes) |

## Acceptance Matrix impact

The submitted [IMPLEMENTATION-0C-ACCEPTANCE-MATRIX.md](./IMPLEMENTATION-0C-ACCEPTANCE-MATRIX.md) incorrectly marked the following before supporting evidence existed:

| Requirement | Submitted claim | Actual state |
|-------------|-----------------|--------------|
| Route guards (server-authoritative) | **PASS** | Client UX guard only; server page guard **NOT PROVEN** |
| Keyboard activation e2e flow | **PASS** | Flow uses mouse `.click()` on terms/risk |
| Mandatory NOT RUN | **0** | Mandatory browser scenarios incomplete |

These claims require correction during Closure. Git history must not be rewritten.

## Cleanup deviation

| Item | Finding |
|------|---------|
| Disposable PostgreSQL left running after `0C` | **YES** — `ghuravia-ci-pg` container on port **55432** |
| Committed to repository | **NO** |
| Cloud resource | **NO** |
| Data class | Synthetic only |
| Required action | **LOCAL CLEANUP AND EVIDENCE** |

Gate-created local resources must be stopped and removed before Closure completes. Operator-owned resources that predate `0C` must not be classified as Gate cleanup debt.

## Formal gate treatment (pre-Closure)

```text
GHV.IMPLEMENTATION.0C:
BLOCKED — SERVER-AUTHORITATIVE ROUTE GUARDS
AND MANDATORY BROWSER VALIDATION CLOSURE REQUIRED

0C Product Code:
RETAINED

Activation UX Baseline:
IMPLEMENTED
FORMAL CLOSURE PENDING

GHV.IMPLEMENTATION.0D:
BLOCKED
```

## Impact result

```text
Product Scope impact:
NONE

Architecture impact:
NONE

Security and authorization impact:
YES — ROUTE ENFORCEMENT MUST BE CLOSED

Validation completeness impact:
YES

Implementation rollback required:
NO
```

## Preserved delivered scope

The following remain implemented and must not be rolled back:

```text
ACT-003 · ACT-011 · ACT-005 · ACT-013 · ACT-012 · ACT-006 · ACT-007 · ONB-001
```

Arabic-first localization · English parity · shared activation shell · Explainable Locks · stable error catalogues · idempotency model · stale-conflict UX · synthetic session · mock mailbox · Playwright and axe tooling · activation formula unchanged · mobile **OPTIONAL ASSURANCE** · mocks only · no Preview/Staging/Production.

## Closure requirements (summary)

1. Server-authoritative route enforcement before protected page render.
2. Client redirects retained as UX convenience only.
3. Complete mandatory browser scenario matrix (keyboard-only, refresh/resume, error recovery, route guards, actual-state axe).
4. Acceptance Matrix correction with auditable amendment notice.
5. Local PostgreSQL cleanup evidence (`ghuravia-ci-pg` / port 55432).
6. Full local and remote CI on Closure HEAD.

## Evidence cross-links

| Document | Role |
|----------|------|
| [GHV.IMPLEMENTATION.0C.md](../gates/GHV.IMPLEMENTATION.0C.md) | Submitted gate record |
| [IMPLEMENTATION-0C-ACCEPTANCE-MATRIX.md](./IMPLEMENTATION-0C-ACCEPTANCE-MATRIX.md) | Matrix requiring correction |
| [IMPLEMENTATION-0C-UX-SECURITY-REVIEW.md](./IMPLEMENTATION-0C-UX-SECURITY-REVIEW.md) | Prior review (route guards claimed **PASS**) |
| [GHV.IMPLEMENTATION.0C-AUTHORIZATION.md](./GHV.IMPLEMENTATION.0C-AUTHORIZATION.md) | GHV-IMP-AUTH-003 scope |
