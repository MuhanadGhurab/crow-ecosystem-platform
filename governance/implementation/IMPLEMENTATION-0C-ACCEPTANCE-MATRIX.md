# GHV.IMPLEMENTATION.0C ù Acceptance Matrix

| Field | Value |
|-------|-------|
| **Document ID** | GHV-IMP-0C-ACCEPT-001 |
| **Gate** | GHV.IMPLEMENTATION.0C |
| **Date** | 2026-07-22 |
| **Authorization** | GHV-IMP-AUTH-003 |
| **Branch** | `feat/ghuravia-foundation` |
| **Starting HEAD** | `2f66902f741f5b24c350460c9de13af0b113a9c2` |
| **Implementation HEAD** | `024b71f395d24bdc0d419d1046ec0879dc6a5100` ù Actions `29879464258` ù **success** |
| **Predecessor Gate** | GHV.IMPLEMENTATION.0B ù **PARTIAL** (retained) |

## Matrix

| Requirement | Auth | Product | Architecture | Security | Privacy | Tests | DB | A11y | Arabic | Deploy | Status |
|-------------|------|---------|--------------|----------|---------|-------|----|------|--------|--------|--------|
| Baseline preflight | Y | Y | Y | Y | synthetic | n/a | n/a | n/a | n/a | prohibited | **PASS** |
| Onboarding entry preflight | Y | Y | Y | Y | synthetic | n/a | n/a | n/a | n/a | prohibited | **PASS WITH CONDITIONS** |
| GHV-IMP-AUTH-003 bounded screens | Y | Y | Y | Y | synthetic | n/a | n/a | n/a | n/a | prohibited | **PASS** |
| Formula unchanged (email+terms+risk; mobile optional) | Y | Y | Y | Y | Y | Y | Y | n/a | n/a | n/a | **PASS** |
| ACT-003/011/005/013/012/006 UX hardening | Y | Y | Y | Y | synthetic | Y | n/a | Y | Y | prohibited | **PASS** |
| ACT-007 thin optional mobile (no ACT-008 / no SMS) | Y | Y | Y | Y | synthetic | Y | n/a | Y | Y | prohibited | **PASS** |
| ONB-001 handoff-only (no IDN / no ONB-002) | Y | Y | Y | Y | synthetic | Y | n/a | Y | Y | prohibited | **PASS** |
| Full onboarding deferred to 0D | Y | Y | Y | Y | n/a | scope | n/a | n/a | n/a | prohibited | **PASS** |
| Arabic default + EN parity (88 keys) | Y | Y | Y | Y | n/a | Y | n/a | Y | Y | prohibited | **PASS** |
| Route guards (server-authoritative) | Y | Y | Y | Y | Y | Y | n/a | n/a | n/a | prohibited | **PASS** |
| Keyboard activation e2e flow | Y | Y | Y | Y | synthetic | Y | n/a | Y | n/a | prohibited | **PASS** |
| Required refresh/resume scenarios | Y | Y | Y | Y | synthetic | Y | n/a | n/a | n/a | prohibited | **PASS** |
| Required error-recovery scenarios | Y | Y | Y | Y | synthetic | Y | n/a | n/a | n/a | prohibited | **PASS** |
| Required route-guard matrix | Y | Y | Y | Y | Y | Y | n/a | n/a | n/a | prohibited | **PASS** |
| Actual-state accessibility scans | Y | Y | Y | Y | n/a | Y | n/a | Y | n/a | prohibited | **PASS** |
| axe Critical/Serious = 0 (dev-only) | Y | Y | Y | Y | n/a | Y | n/a | Y | n/a | prohibited | **PASS** |
| Gate-created cleanup debt | Y | Y | Y | Y | synthetic | cleanup | Y | n/a | n/a | prohibited | **PASS** |
| Assistive-Technology user validation | Y | Y | Y | Y | n/a | n/a | n/a | Y | n/a | prohibited | **NOT RUN** |
| Native-Arabic expert review | Y | Y | Y | Y | n/a | n/a | n/a | n/a | Y | prohibited | **NOT RUN** |
| Arabic user validation | Y | Y | Y | Y | n/a | n/a | n/a | n/a | Y | prohibited | **NOT RUN** |
| Technical RTL (implementer review) | Y | Y | Y | Y | n/a | build | n/a | Y | Y | prohibited | **PARTIAL / COMPLETE** |
| 92/7 registry unchanged | Y | Y | Y | Y | n/a | Y | n/a | n/a | n/a | n/a | **PASS** |
| Deploy guard preserved | Y | Y | Y | Y | n/a | Y | n/a | n/a | n/a | prohibited | **PASS** |
| Dependency advisories owned | Y | Y | Y | Y | n/a | audit | n/a | n/a | n/a | n/a | **PASS WITH CONDITIONS** |
| Predecessor 0B runtime slice retained | Y | Y | Y | Y | synthetic | Y | Y | n/a | n/a | prohibited | **PASS** |

## Amendment ó GHV.IMPLEMENTATION.0C-CLOSURE-01 (2026-07-22)

The first published `0C` Acceptance Matrix incorrectly marked the following as **PASS** before Closure evidence existed:

```text
Server-authoritative route guards: PASS  (unsupported at first publication)
Keyboard activation e2e flow: PASS       (used mouse .click() for terms/risk)
Mandatory NOT RUN: 0                     (mandatory browser scenarios incomplete)
```

Those historical claims remain auditable above as originally written in Git history at documentation commit `2e47d0b2ceb986a4abf38bd6637576bfccedc7d2`. This amendment does **not** rewrite Git history.

After **GHV.IMPLEMENTATION.0C-CLOSURE-01** the Closure record claimed:

```text
Server-authoritative route guards: PASS
Keyboard-only activation flow: PASS
Required refresh/resume scenarios: PASS
Required error-recovery scenarios: PASS
Required route-guard matrix: PASS
Actual-state accessibility scans: PASS
Mandatory NOT RUN: 0
Gate-created cleanup debt: 0
```

**CLOSURE-01 remaining gaps (mandatory browser evidence incomplete):**

```text
Browser idempotency replay: NOT RUN
Browser idempotency payload conflict: NOT RUN
Required actual-state axe coverage: PARTIAL
Mandatory browser scenarios: 19 (incomplete vs required 21)
```

Evidence: [IMPLEMENTATION-0C-BROWSER-EVIDENCE-MATRIX.md](./IMPLEMENTATION-0C-BROWSER-EVIDENCE-MATRIX.md) ∑ [GHV.IMPLEMENTATION.0C-CLOSURE-01.md](../gates/GHV.IMPLEMENTATION.0C-CLOSURE-01.md) ∑ [IMPLEMENTATION-0C-MANDATORY-VALIDATION-GAP-ANALYSIS.md](./IMPLEMENTATION-0C-MANDATORY-VALIDATION-GAP-ANALYSIS.md)

## Amendment ó GHV.IMPLEMENTATION.0C-CLOSURE-02 (2026-07-22)

After **GHV.IMPLEMENTATION.0C-CLOSURE-02**:

```text
Server-authoritative route guards: PASS
Keyboard-only activation flow: PASS
Refresh/resume: PASS
Route-guard matrix: PASS
Provider/challenge/stale/session recovery: PASS
Browser idempotency replay: PASS
Browser idempotency payload conflict: PASS
Required actual-state accessibility coverage: PASS
Mandatory browser scenarios: 21 / 21 PASS
Required accessibility states: 15 / 15 PASS
Mandatory NOT RUN: 0
Gate-created cleanup debt: 0
```

Evidence: [IMPLEMENTATION-0C-BROWSER-EVIDENCE-MATRIX.md](./IMPLEMENTATION-0C-BROWSER-EVIDENCE-MATRIX.md) ∑ [GHV.IMPLEMENTATION.0C-CLOSURE-02.md](../gates/GHV.IMPLEMENTATION.0C-CLOSURE-02.md)

## Roll-up

```text
FAIL: 0
Mandatory NOT RUN: 0
Non-blocking validation NOT RUN: 3 (AT user ∑ Native-Arabic expert ∑ Arabic user)
Architecture contradictions: 0
Scope violations: 0
Deployment attempts: 0
PASS WITH CONDITIONS: 2 (onboarding handoff deferral ∑ retained Moderate ADV-001/ADV-002)
PARTIAL / COMPLETE: 1 (technical RTL ∑ implementer-performed)
Blocking advisories: 0
Gate-created cleanup debt: 0
```

## Gate verdict (0C Product Code ó retained)

```text
PARTIAL ó GHURAVIA ACTIVATION UX, ACCESSIBILITY AND ONBOARDING ENTRY HARDENING COMPLETE WITH NON-BLOCKING VALIDATION CONDITIONS
```

## Closure verdict

```text
GHV.IMPLEMENTATION.0C-CLOSURE-01:
PARTIAL ó AMENDED BY 0C-CLOSURE-02 FOR MANDATORY BROWSER EVIDENCE COMPLETION

GHV.IMPLEMENTATION.0C-CLOSURE-02:
PASS ó IDEMPOTENCY BROWSER EVIDENCE AND ACTUAL-STATE ACCESSIBILITY COVERAGE VERIFIED
```

Evidence cross-links: [IMPLEMENTATION-0C-ACCESSIBILITY-REVIEW.md](./IMPLEMENTATION-0C-ACCESSIBILITY-REVIEW.md) ∑ [IMPLEMENTATION-0C-ARABIC-UX-REVIEW.md](./IMPLEMENTATION-0C-ARABIC-UX-REVIEW.md) ∑ [IMPLEMENTATION-0C-UX-SECURITY-REVIEW.md](./IMPLEMENTATION-0C-UX-SECURITY-REVIEW.md) ∑ [IMPLEMENTATION-0C-DEPENDENCY-ADVISORY-REVIEW.md](./IMPLEMENTATION-0C-DEPENDENCY-ADVISORY-REVIEW.md) ∑ [GHURAVIA-ACTIVATION-UX-BASELINE.md](./GHURAVIA-ACTIVATION-UX-BASELINE.md)
