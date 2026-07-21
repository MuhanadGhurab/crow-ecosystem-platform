# Learning Architecture Review Scorecard

| Field | Value |
|-------|-------|
| **Document ID** | GHV-LRN-ARCH-SCORE-001 |
| **Version** | 1.0.0 |
| **Status** | ARCHITECTURE REVIEW EVIDENCE — NOT FINAL SELECTION |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.LEARNING.1B |
| **Last updated** | 2026-07-21 |
| **Related** | [ROUTE-ARCHITECTURE-STANDARD.md](./ROUTE-ARCHITECTURE-STANDARD.md) · Route / CXW / SEX architecture files · [EXPERT-REVIEW-REQUIREMENTS.md](./EXPERT-REVIEW-REQUIREMENTS.md) |
| **Limitations** | Founder architecture-review scores only; expert review **NOT RUN**; scores inform architecture quality — they do not auto-select or LOCK catalogue |
| **Unresolved** | External calibration after expert review |
| **Change history** | 1.0.0 (2026-07-21) — LEARNING.1B Architecture Review Scorecard |

## Purpose

Evaluate every launch Route / CXW / SEX architecture against the Gate **100-point** weight model.

```text
Scores = architecture-review evidence only.
Not final catalogue selection. No LOCKED status. No XP numbers.
Expert review: NOT RUN.
```

## 100-point weights (exact — from Gate)

| Criterion | Weight |
|-----------|-------:|
| Capability clarity | 12 |
| Prerequisite coherence | 10 |
| Stage progression | 10 |
| Evidence integration | 12 |
| Capstone coherence | 10 |
| Shared-capability reuse | 8 |
| Nest accessibility | 7 |
| Cross-Wing compatibility | 7 |
| Tooling feasibility | 6 |
| Arabic-first feasibility | 5 |
| Safety and integrity | 6 |
| Freshness maintainability | 4 |
| Founder delivery feasibility | 3 |
| **Total** | **100** |

## Score legend (criterion columns)

| Abbrev | Criterion | Max |
|--------|-----------|----:|
| CAP | Capability clarity | 12 |
| PRE | Prerequisite coherence | 10 |
| STG | Stage progression | 10 |
| EVD | Evidence integration | 12 |
| CST | Capstone coherence | 10 |
| SHR | Shared-capability reuse | 8 |
| NST | Nest accessibility | 7 |
| CXW | Cross-Wing compatibility | 7 |
| TOL | Tooling feasibility | 6 |
| AR | Arabic-first feasibility | 5 |
| SAF | Safety and integrity | 6 |
| FR | Freshness maintainability | 4 |
| FD | Founder delivery feasibility | 3 |

---

## Score detail

| ID | CAP | PRE | STG | EVD | CST | SHR | NST | CXW | TOL | AR | SAF | FR | FD | **Σ** |
|----|----:|----:|----:|----:|----:|----:|----:|----:|----:|---:|----:|---:|---:|------:|
| **RT-OPR-001** | 11 | 9 | 9 | 11 | 9 | 7 | 6 | 5 | 5 | 4 | 6 | 3 | 1 | **86** |
| **RT-BLD-001** | 11 | 9 | 9 | 11 | 9 | 7 | 6 | 6 | 5 | 4 | 5 | 3 | 2 | **87** |
| **RT-PRT-001** | 11 | 9 | 8 | 11 | 9 | 7 | 6 | 6 | 4 | 4 | 6 | 3 | 1 | **85** |
| **RT-LED-001** | 11 | 9 | 9 | 10 | 9 | 7 | 6 | 5 | 5 | 4 | 4 | 3 | 2 | **84** |
| **RT-ANL-001** | 10 | 8 | 8 | 10 | 8 | 6 | 6 | 4 | 5 | 4 | 5 | 3 | 3 | **80** |
| **CXW-001** | 11 | 8 | 8 | 11 | 9 | 7 | 5 | 7 | 5 | 4 | 5 | 3 | 2 | **85** |
| **SEX-001** | 11 | 9 | 8 | 11 | 8 | 7 | 6 | 5 | 5 | 4 | 6 | 3 | 1 | **84** |

### Row-sum verification

| ID | Arithmetic check | Σ |
|----|------------------|----:|
| RT-OPR-001 | 11+9+9+11+9+7+6+5+5+4+6+3+1 | **86** |
| RT-BLD-001 | 11+9+9+11+9+7+6+6+5+4+5+3+2 | **87** |
| RT-PRT-001 | 11+9+8+11+9+7+6+6+4+4+6+3+1 | **85** |
| RT-LED-001 | 11+9+9+10+9+7+6+5+5+4+4+3+2 | **84** |
| RT-ANL-001 | 10+8+8+10+8+6+6+4+5+4+5+3+3 | **80** |
| CXW-001 | 11+8+8+11+9+7+5+7+5+4+5+3+2 | **85** |
| SEX-001 | 11+9+8+11+8+7+6+5+5+4+6+3+1 | **84** |

All rows sum to the stated totals. Criterion weights sum to **100**.

---

## Brief notes (architecture review — not expert review)

| ID | Note |
|----|------|
| **RT-OPR-001** | Strong Evidence/safety; CW score moderate (SEX attach primary, not CXW source). Founder load on cloud labs keeps FD low. |
| **RT-BLD-001** | Highest architecture score; strong CXW source readiness; AI integrity watch remains. |
| **RT-PRT-001** | Strong Evidence/safety; tooling slightly harder; ethics hard-stops help SAF. |
| **RT-LED-001** | Clear Stages; Evidence more narrative → EVD/SAF slightly lower; text-first helps AR/TOL. |
| **RT-ANL-001** | Reserve — capable architecture but CXW/founder/capacity drag; not launch-committed. |
| **CXW-001** | High EVD/CST/CXW; Nest access and prereq load slightly lower until Bridges finalize. |
| **SEX-001** | Strong host attachment + safety; Capstone narrower than CXW (CST 8); not a PROTECT substitute. |

## Portfolio status after scoring (1B vocabulary)

| Construct | Architecture status after 1B |
|-----------|------------------------------|
| P0 Routes (OPR/BLD/PRT/LED) | ARCHITECTURE RECOMMENDED — PENDING MISSION BLUEPRINT AND FINAL LOCK |
| RT-ANL-001 | ARCHITECTURE RECOMMENDED — LAUNCH RESERVE |
| CXW-001 | ARCHITECTURE RECOMMENDED (subject to CXW architecture challenge outcome doc) |
| SEX-001 | ARCHITECTURE RECOMMENDED WITH CONDITIONS (host Route + lab safety) |

**Never** write final `LOCKED` from these scores alone.

## Expert review

```text
NOT RUN
```

Scores above are **Founder (RAVEN)** architecture-review judgments pending domains in [EXPERT-REVIEW-REQUIREMENTS.md](./EXPERT-REVIEW-REQUIREMENTS.md).
