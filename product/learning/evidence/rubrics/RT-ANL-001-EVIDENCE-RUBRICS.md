# RT-ANL-001 — Reserve Evidence Rubrics

| Field | Value |
|-------|-------|
| **Document ID** | GHV-LRN-RUB-ANL-001 |
| **Version** | 1.0.0 |
| **Status** | RESERVE RUBRIC BLUEPRINT — LAUNCH RESERVE — CAPACITY CONDITIONAL |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.LEARNING.1C |
| **Last updated** | 2026-07-21 |
| **Related** | [EVIDENCE-ANCHOR-REGISTRY.md](../EVIDENCE-ANCHOR-REGISTRY.md) · [RT-ANL-001-RESERVE-MISSION-BLUEPRINTS.md](../../missions/routes/RT-ANL-001-RESERVE-MISSION-BLUEPRINTS.md) · [RT-ANL-001-RESERVE-CAPSTONE-BLUEPRINT.md](../../capstones/RT-ANL-001-RESERVE-CAPSTONE-BLUEPRINT.md) |
| **Limitations** | Reserve rubric only — not committed launch; no XP; not LOCKED; expert **NOT RUN** |
| **Unresolved** | Capacity + Change Control; scoring bands (PROGRESSION.1); dual-path calibration |
| **Change history** | 1.0.0 (2026-07-21) — LEARNING.1C reserve rubric blueprints |

```text
╔══════════════════════════════════════════════════════════════╗
║  RESERVE RUBRIC BLUEPRINT                                    ║
║  LAUNCH RESERVE — CAPACITY CONDITIONAL                       ║
║  NO XP. Expert: NOT RUN. Pilot: NOT RUN. Not LOCKED.         ║
╚══════════════════════════════════════════════════════════════╝
```

---

## Scope

Rubrics for **RT-ANL-001-EVD-01…04** and Capstone pack — active **only if** Route is capacity-activated via Change Control.

---

## Shared review principles

| Principle | Requirement |
|-----------|-------------|
| **Synthetic only** | Real personal datasets → fail |
| **Reproducibility** | Seed ID + re-runnable steps |
| **Uncertainty** | Overclaim → revise/fail |
| **A11y** | Charts need alt text / text description |
| **AI disclosure** | Required on narrative analysis |
| **No XP** | Rubric outcomes do not encode reward formulas |

---

## RT-ANL-001-EVD-01 — Prepared dataset note

| Dimension | Accept when… | Revise when… | Fail when… |
|-----------|--------------|--------------|------------|
| **Reproducibility** | Seed ID + prep steps allow re-run | Steps incomplete | No seed / unreproducible |
| **Quality honesty** | Issues profiled before/during cleaning | Silent overcleaning | Fabricated clean data |
| **Safety** | Synthetic dataset only | Ambiguous origin | Real PII / personal data |

**Primary Missions:** RT-ANL-001-STG-02-MSN-02

---

## RT-ANL-001-EVD-02 — Analysis artifact

| Dimension | Accept when… | Revise when… | Fail when… |
|-----------|--------------|--------------|------------|
| **Method quality** | Descriptive methods fit question; assumptions stated | Methods OK but assumptions missing | Wrong method without reflection |
| **Re-runnable** | Notebook or sheet steps re-executable | Partial steps | Screenshot-only with no logic |
| **AI disclosure** | Present when AI assist used | Missing | Concealed wholesale generation |

**Primary Missions:** RT-ANL-001-STG-03-MSN-01

---

## RT-ANL-001-EVD-03 — Visualization pack

| Dimension | Accept when… | Revise when… | Fail when… |
|-----------|--------------|--------------|------------|
| **Interpretation** | Charts support the question | Decorative only | Misleading charts |
| **Alt text** | Text descriptions present | Weak alt text | Missing a11y text |
| **Uncertainty** | Limits/uncertainty communicated | Soft overclaim | Hard overclaim / causal theatre |
| **Privacy** | No real PII | Borderline labels | Real personal data |

**Primary Missions:** RT-ANL-001-STG-04-MSN-01 · RT-ANL-001-STG-04-MSN-02

---

## RT-ANL-001-EVD-04 — Decision report

| Dimension | Accept when… | Revise when… | Fail when… |
|-----------|--------------|--------------|------------|
| **Decision usefulness** | Insight tied to scenario decision | Insight vague | No decision orientation |
| **Limits** | Non-claims explicit | Limits thin | Overconfident claims |
| **Reproducibility link** | Points to prep/analysis seeds | Weak link | Unrelated narrative |

**Primary Missions:** RT-ANL-001-STG-05-MSN-01

---

## Capstone pack (RT-ANL-001-CAP-01)

| Required | Acceptance note |
|----------|-----------------|
| Route capacity-activated | **Hard gate** |
| EVD-01…04 accepted | All four required |
| Reproducible end-to-end story | Prep → analysis → viz+uncertainty → decision |

---

## Explicit non-scores

- No XP weights  
- No “data scientist” title grant  
- Not a committed launch Evidence load until Change Control  
