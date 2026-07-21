# RT-BLD-001 — Evidence Rubrics (Blueprint)

| Field | Value |
|-------|-------|
| **Document ID** | GHV-LRN-RUB-BLD-001 |
| **Version** | 1.0.0 |
| **Status** | RUBRIC BLUEPRINT — PENDING EXPERT REVIEW |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.LEARNING.1C |
| **Date** | 2026-07-21 |
| **Route** | RT-BLD-001 |
| **Related** | [EVIDENCE-ANCHOR-REGISTRY.md](../EVIDENCE-ANCHOR-REGISTRY.md) · [LAUNCH-EVIDENCE-VALUE-MATRIX.md](../LAUNCH-EVIDENCE-VALUE-MATRIX.md) · [RT-BLD-001-MISSION-BLUEPRINTS.md](../../missions/routes/RT-BLD-001-MISSION-BLUEPRINTS.md) · [RT-BLD-001-CAPSTONE-BLUEPRINT.md](../../capstones/RT-BLD-001-CAPSTONE-BLUEPRINT.md) |
| **Limitations** | Short blueprint rubrics only — **not LOCKED**; no XP/Mastery scores; framework-neutral criteria |
| **Expert review** | **NOT RUN** |
| **Pilot** | **NOT RUN** |
| **Change history** | 1.0.0 (2026-07-21) — GHV.LEARNING.1C rubric blueprint |

```text
RUBRIC BLUEPRINT — PENDING EXPERT REVIEW
Expert: NOT RUN · Pilot: NOT RUN · No XP · No LOCKED
```

## Purpose

Provide **short qualitative rubrics** for RT-BLD-001 Evidence anchors **EVD-01…04** and Capstone **CAP-01**, using a **subset** of the Launch Evidence Value Matrix dimensions.

## Qualitative levels (shared)

| Level | Meaning |
|-------|---------|
| **Incomplete** | Missing required elements; secrets/PII; or not seed-bound |
| **Developing** | Present but weak originality, unclear, or checklist-only |
| **Meets** | Reviewable with smoke checklist; seed-bound; safe; demonstrates Stage outcomes |
| **Strong** | Clear, portable, AI-disclosed, meaningful delta beyond scaffold |

Acceptance: **Meets** or **Strong** on required dimensions (expert thresholds pending).

## Dimension subset

1. **Authenticity**  
2. **Relevance**  
3. **Reviewability**  
4. **Privacy**  
5. **Plagiarism / originality**  
6. **AI-assist integrity**  
7. **Accessibility** *(scored for EVD-02 and Capstone; Watch elsewhere)*  
8. **Professional value** (qualitative only)

---

## RT-BLD-001-EVD-01 — Repository Evidence

| Dimension | Incomplete | Developing | Meets | Strong |
|-----------|------------|------------|-------|--------|
| **Authenticity** | No unique seed / empty history | Thin commits | Original commits + feature seed | Inspectable history with clear messages |
| **Relevance** | Unrelated repo | Scaffold only | Delivers STG-01/03 path artifacts | Meaningful delivery delta |
| **Reviewability** | Huge binary dump | Hard to navigate | Link/bundle + smoke path | Indexed README to key commits |
| **Privacy** | Secrets committed | Env leakage risk | No secrets; allowlist mindset | Explicit secret-scan note |
| **Plagiarism** | Untouched public template | Minimal rename | Delta beyond scaffold | Distinct feature for seed |
| **AI-assist** | Undeclared codegen | Vague disclosure | Disclosure present | Explain-your-diff Mission done |
| **Professional value** | None | Thin | Credible junior delivery sample | Strong portfolio repo |

**Accept if:** Meets+ on Authenticity, Privacy, Plagiarism; AI disclosure if assist used.

---

## RT-BLD-001-EVD-02 — Accessibility note

| Dimension | Incomplete | Developing | Meets | Strong |
|-----------|------------|------------|-------|--------|
| **Authenticity** | Generic paste | Not tied to UI | Tied to learner UI | Before/after on learner screens |
| **Relevance** | Fashion CSS only | Weak semantics | Semantic + practical fixes | RTL/keyboard notes where relevant |
| **Reviewability** | Vague essay | Unstructured | Checklist + observations | Clear fix list |
| **Privacy** | Real user data | Risky mock PII | Synthetic content | Explicit no-PII note |
| **Plagiarism** | Copied a11y essay | Template fill | Specific to project | Original observations |
| **AI-assist** | Undeclared | Weak disclosure | Disclosure present | Learner-verified fixes |
| **Accessibility** | Ignores basics | Mentions only | Applies basic patterns | Practical + documented |
| **Professional value** | None | Thin | Credible a11y hygiene | Portfolio-worthy note |

**Accept if:** Meets+ on Authenticity, Accessibility, Relevance.

---

## RT-BLD-001-EVD-03 — Tests Evidence

| Dimension | Incomplete | Developing | Meets | Strong |
|-----------|------------|------------|-------|--------|
| **Authenticity** | Fake/screenshot-only claim | Unclear how run | Re-runnable locally or in lab | Seed-linked test run |
| **Relevance** | Unrelated suite | Token test | Basic tests match feature path | Env distinction noted (local vs preview) |
| **Reviewability** | Opaque log dump | Hard to interpret | Output/checklist with pass criteria | Short how-to-rerun |
| **Privacy** | Secrets in fixtures | Risky fixtures | Clean fixtures | Explicit scrub |
| **Plagiarism** | Copied suite wholesale | Minimal change | Tests for learner feature | Meaningful assertions |
| **AI-assist** | Undeclared | Weak disclosure | Disclosure + learner run proof | Explains what tests cover |
| **Professional value** | None | Thin | Basic quality signal | Clear regression value |

**Accept if:** Meets+ on Authenticity, Reviewability, Relevance.

---

## RT-BLD-001-EVD-04 — Delivery documentation

| Dimension | Incomplete | Developing | Meets | Strong |
|-----------|------------|------------|-------|--------|
| **Authenticity** | Empty README | Generic boilerplate | Personalized delivery note + preview | Seed cited; how-to-run clear |
| **Relevance** | Off-topic docs | Partial | README + delivery note for sandbox ship | Includes basic feedback/monitoring note |
| **Reviewability** | Missing preview | Broken links | Sandbox preview + docs | Smoke path for reviewer |
| **Privacy** | Real PII / secrets | Risky examples | Safe demo data | Explicit safety note |
| **Plagiarism** | Copied README | Template-only | Project-specific | Clear ownership voice |
| **AI-assist** | Undeclared | Incomplete | Disclosure required | Disclosure + learner edits |
| **Professional value** | None | Thin | Usable delivery doc | Strong public candidate |

**Accept if:** Meets+ on Relevance, Privacy, Reviewability.

---

## RT-BLD-001-CAP-01 — Capstone pack

Pack: working feature · repo history · PR/MR Evidence · README · delivery note · AI disclosure · (tests + a11y as applicable).

| Dimension | Incomplete | Developing | Meets | Strong |
|-----------|------------|------------|-------|--------|
| **Authenticity** | Ineligible / no seed | Partial ship | Eligibility + unique feature seed | Full end-to-end trail |
| **Relevance** | Framework fashion show | Thin feature | Small accessible web product delivered | Matches capability statement |
| **Reviewability** | Unreviewable | Scattered | PR Evidence + smoke path | Indexed Capstone pack |
| **Privacy** | Secrets/PII | Weak hygiene | Clean sandbox artifacts | Portfolio-sanitized |
| **Plagiarism** | Scaffold-only | Weak delta | Original feature for seed | Distinct explain-your-diff |
| **AI-assist** | Undeclared | Incomplete | Full disclosure + execution | Verified learner ownership |
| **Accessibility** | Ignored | Token mention | Basic accessible patterns evidenced | A11y note + practical fixes |
| **Professional value** | None | Thin | Credible ship sample | Strong portfolio Capstone |

**Accept if:** Meets+ on Authenticity, Relevance, Privacy, AI-assist, Accessibility; EVD-01…04 already accepted.

## Review capacity note

Smoke checklist + short human review; Capstone slightly longer — capacity pending expert review. Prefer framework-neutral criteria over framework fashion.

## Explicit non-goals

- No XP / Mastery formulas  
- No single-framework scoring bias  
- No CXW secure-SDLC depth required here  
- No LOCKED claim  

## Unresolved

1. Expert calibration (EXP-BLD · EXP-A11Y · EXP-INT · EXP-AR)  
2. Starter stack pin impact on smoke scripts  
3. Pilot scoring consistency  
4. Bilingual rubric freeze  
