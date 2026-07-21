# Gate Verdict Consistency Check — Specification

| Field | Value |
|-------|-------|
| **Document ID** | GHV-GOV-SPEC-VER-001 |
| **Version** | 1.0.0 |
| **Status** | **ACTIVE — SPECIFICATION ONLY** |
| **Owner** | Founder (RAVEN) |
| **Date** | 2026-07-21 |
| **Source Gate** | GHV.ARCHITECTURE.1E-AMENDMENT-01 |
| **Related** | [GATE-VERDICT-PRESERVATION-POLICY.md](./GATE-VERDICT-PRESERVATION-POLICY.md) · [ARCHITECTURE-GATE-VERDICT-REFERENCE-AUDIT.md](../../architecture/ghuravia/governance/ARCHITECTURE-GATE-VERDICT-REFERENCE-AUDIT.md) |

## Purpose

Define a **future documentation validation check** that detects Gate verdict drift across active governance documents. This specification does **not** require Product Code or dependency installation in Amendment-01.

A documentation-only script may be added later under an approved governance-validation area if it introduces **no runtime dependency**.

---

## Inputs

The check reads:

| Source | Path | Role |
|--------|------|------|
| Authoritative Gate records | `governance/gates/GHV.*.md` (excluding amendment-only files for primary verdict) | **Source of truth** |
| Gate Register | `governance/gates/GATE-REGISTER.md` | Active programme summary |
| Baseline Manifest | `governance/releases/BASELINE-MANIFEST.md` | Baseline + Gate row references |
| Project Status | `PROJECT_STATUS.md` | Programme status block |
| Amendment records | `governance/gates/GHV.*-AMENDMENT-*.md` | Allowed verdict exceptions |
| Optional | `architecture/ghuravia/governance/GHURAVIA-ARCHITECTURE-BASELINE-MANIFEST.md` | Architecture roll-up |

---

## Gate ID scope (Architecture programme example)

```text
GHV.ARCHITECTURE.1A
GHV.ARCHITECTURE.1A-AMENDMENT-01
GHV.ARCHITECTURE.1B
GHV.ARCHITECTURE.1C
GHV.ARCHITECTURE.1D
GHV.ARCHITECTURE.1E
GHV.ARCHITECTURE.1E-AMENDMENT-01
```

Extend pattern to other programme Gates as needed.

---

## Normalized verdict model

Each Gate maps to a normalized tuple:

```text
(gate_id, verdict_class, verdict_phrase, amendment_id?)
```

| `verdict_class` | Allowed values |
|-----------------|----------------|
| Primary | `PASS` · `PARTIAL` · `BLOCKED` · `NOT STARTED` |
| Amended modifier | `AMENDED` · `AMENDED FOR PREDECESSOR VERDICT PRESERVATION` · etc. |

**Normalization rules:**

1. Strip decorative casing; preserve semantic tokens (`PARTIAL`, `PASS`, `AMENDED`, `NOT STARTED`).
2. `PASS — AMENDED` and `PASS — AMENDED BY …` normalize to `(PASS, AMENDED)`.
3. Phrases containing **WITH NON-BLOCKING CONDITIONS** or **ACCEPTED WITH CONDITIONS** map to **PARTIAL** unless an explicit amendment says otherwise.
4. Spike `6/6 PASS`, preflight `PASS`, ADR `decision accepted` — **excluded** from Gate verdict extraction (FALSE POSITIVE filter).

---

## Comparison algorithm

For each `gate_id` in scope:

1. **Load authoritative verdict** from Gate report Verdict field (or amendment amended formal verdict if amendment supersedes display).
2. **Load register verdict** from Gate Register table Verdict column.
3. **Load manifest verdict** from Baseline Manifest Gate summary rows.
4. **Load project status verdict** from PROJECT_STATUS Accepted Previous Gates list.
5. **Compare** normalized `verdict_class` across sources.
6. **Allow explicit amendment linkage** when register/manifest cites `GHV.*-AMENDMENT-NN` and amendment record defines amended formal verdict.
7. **Reject unauthorized upgrades** — e.g. authoritative `PARTIAL` vs register `PASS` without amendment.
8. **Reject unauthorized downgrades** — e.g. authoritative `PASS` vs register `PARTIAL` without amendment.
9. **Distinguish Gate verdict from programme status** — e.g. `COMPLETE AT GOVERNED DESIGN LEVEL` must not imply all Gates are PASS.

---

## Failure conditions (report and exit non-zero)

| Code | Condition |
|------|-----------|
| `MISSING_GATE_RECORD` | Gate ID in Register has no `governance/gates/GHV.*.md` report |
| `DUPLICATE_ACTIVE_GATE_ID` | Same Gate ID with conflicting active verdict rows in one manifest |
| `CONTRADICTORY_VERDICT` | Normalized verdict mismatch across authoritative vs active summary |
| `UNAUTHORIZED_UPGRADE` | PARTIAL → PASS without governed amendment |
| `UNAUTHORIZED_DOWNGRADE` | PASS → PARTIAL/BLOCKED without governed amendment |
| `PROGRAMME_VERDICT_COLLAPSE` | Programme completion language used as substitute for Gate PASS |
| `MISSING_AMENDMENT_LINK` | Verdict changed in register but no amendment record cited |

---

## Success conditions

```text
All in-scope Gate IDs:
  authoritative record exists
  register verdict matches (or amendment-linked)
  manifest Gate rows match (or amendment-linked)
  PROJECT_STATUS Accepted Gates match (or amendment-linked)
  no unauthorized upgrade/downgrade
  programme status separated from Gate verdict
```

---

## Output format

```text
GATE VERDICT CONSISTENCY CHECK
Date: <ISO date>
Branch: <branch>
HEAD: <commit>

PASS: <count>
FAIL: <count>

Failures:
  [CONTRADICTORY_VERDICT] GHV.ARCHITECTURE.1B
    authoritative: PARTIAL
    GATE-REGISTER.md: PASS
    suggested action: CORRECT TO PARTIAL or link Amendment-01

Warnings:
  [FALSE_POSITIVE_SKIPPED] spikes/ghuravia/.../RESULT.md PASS (spike test)
```

---

## Execution context (future)

| Requirement | Value |
|-------------|-------|
| Product Code | **NOT REQUIRED** |
| Database | **NOT REQUIRED** |
| Cloud / provider | **NOT REQUIRED** |
| Dependencies | **NONE** if implemented as shell + grep/awk documentation tooling |
| When to run | Before each programme Gate transition; after any Gate amendment merge |

---

## Reference implementation hints (non-normative)

Acceptable future implementations:

* `git grep` + structured markdown table parser (documentation-only)
* CI workflow step on `governance/gates/` and `PROJECT_STATUS.md` diff
* Manual checklist derived from this spec for Founder review

**Out of scope for Amendment-01:** shipping a script in Product Code paths or adding `package.json`.

---

## Related controls

| Control | Document |
|---------|----------|
| Policy | [GATE-VERDICT-PRESERVATION-POLICY.md](./GATE-VERDICT-PRESERVATION-POLICY.md) |
| Audit template | [ARCHITECTURE-GATE-VERDICT-REFERENCE-AUDIT.md](../../architecture/ghuravia/governance/ARCHITECTURE-GATE-VERDICT-REFERENCE-AUDIT.md) |
| Amendment example | [GHV.ARCHITECTURE.1E-AMENDMENT-01.md](./GHV.ARCHITECTURE.1E-AMENDMENT-01.md) |

## Change history

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | Initial consistency-check specification |
