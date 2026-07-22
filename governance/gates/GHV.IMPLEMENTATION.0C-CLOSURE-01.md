# GHV.IMPLEMENTATION.0C-CLOSURE-01 — Server-Authoritative Route Guards, Required Browser Coverage and Local Cleanup Closure

| Field | Value |
|-------|-------|
| **Gate ID** | GHV.IMPLEMENTATION.0C-CLOSURE-01 |
| **Date** | 2026-07-22 |
| **Branch** | `feat/ghuravia-foundation` |
| **Starting HEAD** | `2e47d0b2ceb986a4abf38bd6637576bfccedc7d2` |
| **0C implementation commit** | `024b71f395d24bdc0d419d1046ec0879dc6a5100` |
| **0C documentation commit** | `2e47d0b2ceb986a4abf38bd6637576bfccedc7d2` |
| **Original 0C CI** | Actions `29879464258` · verify `88796880094` · **success** |
| **Original 0C docs CI** | Actions `29879640980` · verify `88797397265` · **success** |
| **Archive peel** | `b1b1a6c14d5f51307cbffae1b968f4ae1ec1c40c` |
| **Closure HEAD** | `248e8fba480e4b3ee6d0817169df5e183b7fff03` |
| **Closure Actions** | [`29881791351`](https://github.com/MuhanadGhurab/crow-ecosystem-platform/actions/runs/29881791351) · verify [`88804056076`](https://github.com/MuhanadGhurab/crow-ecosystem-platform/actions/runs/29881791351/job/88804056076) · **success** |

## Formal Gate treatment (before Closure)

```text
GHV.IMPLEMENTATION.0C:
BLOCKED — SERVER-AUTHORITATIVE ROUTE GUARDS
AND MANDATORY BROWSER VALIDATION CLOSURE REQUIRED

Product Code:
RETAINED

Architecture:
UNCHANGED

GHV.IMPLEMENTATION.0D:
BLOCKED
```

## Discovered defects (pre-Closure)

| Defect | Classification | Evidence |
|--------|----------------|----------|
| Client-only activation route enforcement | Security / authorization | [IMPLEMENTATION-0C-MANDATORY-VALIDATION-GAP-ANALYSIS.md](../implementation/IMPLEMENTATION-0C-MANDATORY-VALIDATION-GAP-ANALYSIS.md) |
| Incomplete mandatory browser matrix | Validation completeness | Original Playwright suite: 3 tests |
| Keyboard flow used `.click()` for terms/risk | Validation completeness | Gap analysis |
| axe scanned bootstrap/redirect substitutes | Accessibility evidence | Gap analysis |
| Disposable PostgreSQL left running after 0C | Local cleanup deviation | `ghuravia-ci-pg` on `55432` |
| Acceptance Matrix claimed unsupported PASS | Governance integrity | Historical claims retained below |

Product Scope impact: **NONE** · Architecture impact: **NONE** · Implementation rollback: **NO**

## Remediation

1. **Server-authoritative route guard** — `apps/web/lib/server/activation-route-guard.ts` (`server-only`) invokes shared `canAccessScreen` and `redirect()` before protected page render.
2. **Server/client page split** — protected routes load authorized `initialResource` on the server; client redirects remain convenience only.
3. **ACT-012 policy** — governed recovery states only; gate-lock `recoveryAvailable` no longer opens ACT-012.
4. **Local/test controls** — `POST /api/local/test-controls` (provider mode, challenge expire, session expire, version bump); prohibited outside local/test.
5. **Shared DB pool** — `apps/web/lib/server/db.ts` process-scoped pool (avoids Windows crash from per-request `sql.end()`).
6. **Browser matrix** — 19 mandatory scenarios in `apps/web/e2e/activation-flow.spec.ts`; keyboard-only user actions; refresh/resume; errors; route guards; actual-state axe.
7. **Evidence validator** — `npm run validate:browser-evidence`.
8. **Cleanup** — `npm run db:cleanup` / `db:stop` removes Gate-created disposable Postgres resources.
9. **Acceptance Matrix amendment** — historical unsupported claims retained; Closure PASS evidence recorded.

## Post-Closure treatment

```text
GHV.IMPLEMENTATION.0C:
PARTIAL — GHURAVIA ACTIVATION UX,
ACCESSIBILITY AND ONBOARDING ENTRY HARDENING COMPLETE
WITH NON-BLOCKING VALIDATION CONDITIONS

GHV.IMPLEMENTATION.0C-CLOSURE-01:
PASS — SERVER ROUTE GUARDS, REQUIRED BROWSER COVERAGE
AND LOCAL CLEANUP VERIFIED

GHV.IMPLEMENTATION.0D:
ELIGIBLE TO START
NOT STARTED
```

## Active treatment amendment — GHV.IMPLEMENTATION.0C-CLOSURE-02

CLOSURE-01 technical corrections (server route guards, keyboard core flow, refresh/resume, route-guard matrix, local cleanup) remain valid and are **not** invalidated.

Mandatory browser evidence remaining after CLOSURE-01 (idempotency Playwright scenarios; full 15-state axe coverage; validator limited to 19) is closed by [GHV.IMPLEMENTATION.0C-CLOSURE-02.md](./GHV.IMPLEMENTATION.0C-CLOSURE-02.md).

**Amended active treatment of this Gate:**

```text
GHV.IMPLEMENTATION.0C-CLOSURE-01:
PARTIAL — AMENDED BY 0C-CLOSURE-02 FOR
MANDATORY BROWSER EVIDENCE COMPLETION

Product impact: NONE
Architecture impact: NONE
Route-guard remediation invalidated: NO
Cleanup evidence invalidated: NO
Browser evidence corrected: YES
0C Product Code retained: YES
```

## Retained non-blocking conditions

- Moderate ADV-001 · Moderate ADV-002
- Assistive-technology user validation **NOT RUN**
- Native-Arabic expert/user validation **NOT RUN**
- Legal review of terms/risk copy **OPEN**
- Preview / real providers / Controlled Launch **BLOCKED / NOT READY**

## Final Verdict

```text
PASS — GHURAVIA IMPLEMENTATION 0C
MANDATORY UX VALIDATION CLOSURE COMPLETE
```

Remote CI: **VERIFIED** for Closure HEAD `248e8fb` · Actions `29881791351` · verify `88804056076` · conclusion **success**. Only job: `verify`. Deploy jobs: **0**. PostgreSQL service initialized · migration applied · Chromium installed · `npm run ci` including server route guards, browser matrix, and actual-state axe scans.

- [GHV.IMPLEMENTATION.0C.md](./GHV.IMPLEMENTATION.0C.md)
- [IMPLEMENTATION-0C-MANDATORY-VALIDATION-GAP-ANALYSIS.md](../implementation/IMPLEMENTATION-0C-MANDATORY-VALIDATION-GAP-ANALYSIS.md)
- [IMPLEMENTATION-0C-BROWSER-EVIDENCE-MATRIX.md](../implementation/IMPLEMENTATION-0C-BROWSER-EVIDENCE-MATRIX.md)
- [IMPLEMENTATION-0C-ACCEPTANCE-MATRIX.md](../implementation/IMPLEMENTATION-0C-ACCEPTANCE-MATRIX.md)
