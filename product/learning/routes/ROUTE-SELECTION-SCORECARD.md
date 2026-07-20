# Route Selection Scorecard

| Field | Value |
|-------|-------|
| **Document ID** | GHV-LRN-ROUTE-SCORE-001 |
| **Version** | 1.0.0 |
| **Status** | RESEARCH BASELINE |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.LEARNING.1A |
| **Last updated** | 2026-07-21 |
| **Review date** | 2027-01-21 |
| **Related** | [ROUTE-CANDIDATE-REGISTER.md](./ROUTE-CANDIDATE-REGISTER.md) · [DEFERRED-AND-REJECTED-ROUTES.md](./DEFERRED-AND-REJECTED-ROUTES.md) · [LEARNING-RESEARCH-METHODOLOGY.md](../research/LEARNING-RESEARCH-METHODOLOGY.md) |
| **Limitations** | Scores are research judgments for 1A; not market guarantees; expert review still required |
| **Unresolved** | Calibration workshop with external reviewers |
| **Change history** | 1.0.0 — GHV.LEARNING.1A scoring pass |

## Purpose

Apply the locked 100-point selection model to every Horizon Route candidate. Outcomes are recommendation statuses only. **Never** use Route status `LOCKED` in this gate. Launch picks are **RECOMMENDED — NOT YET LOCKED** pending GHV.LEARNING.1D.

## 100-point weights (exact)

| Criterion | Points |
|-----------|--------|
| Saudi relevance | 12 |
| International relevance | 10 |
| Real-world task clarity | 10 |
| Evidence quality | 12 |
| Accessibility | 8 |
| Progression value | 10 |
| Cross-Wing potential | 8 |
| Long-term relevance | 7 |
| Freshness manageability | 5 |
| Lab feasibility | 6 |
| Arabic feasibility | 5 |
| Community / Live Sky fit | 3 |
| Safety / ethics | 4 |
| **Total** | **100** |

## Bands

| Score | Band |
|-------|------|
| 85–100 | Strong |
| 75–84 | Good |
| 65–74 | Possible |
| 50–64 | Weak |
| <50 | Reject |

## Recommendation status vocabulary

| Status | Meaning |
|--------|---------|
| RECOMMENDED FOR LAUNCH | Primary launch catalogue candidate (**NOT YET LOCKED**) |
| RECOMMENDED AS LAUNCH ALTERNATIVE | Swap-in if a primary drops |
| RECOMMENDED POST-LAUNCH | Solid Route after capacity exists |
| RESEARCH FURTHER | Promising but unresolved risks/freshness |
| DEFERRED | Valid idea; blocked by cost/prereq/timing |
| REJECTED | Do not pursue in current catalogue shape |

---

## Score detail (all 15 candidates)

Criterion columns: SA · INT · TASK · EVID · ACC · PROG · CW · LT · FRESH · LAB · AR · COMM · SAFE · **Σ**

### OPERATE

| ID | Title | SA | INT | TASK | EVID | ACC | PROG | CW | LT | FRESH | LAB | AR | COMM | SAFE | **Σ** | Band | Recommendation |
|----|-------|----|----|------|------|-----|------|----|----|-------|-----|----|------|------|------|------|----------------|
| RC-OPR-001 | Cloud Systems Operations Foundations | 11 | 9 | 9 | 11 | 7 | 9 | 6 | 6 | 4 | 5 | 4 | 3 | 4 | **88** | Strong | RECOMMENDED FOR LAUNCH |
| RC-OPR-002 | Linux & Network Operations Foundations | 10 | 9 | 9 | 10 | 7 | 8 | 5 | 6 | 4 | 5 | 4 | 2 | 3 | **82** | Good | RECOMMENDED AS LAUNCH ALTERNATIVE |
| RC-OPR-003 | Modern Workplace & Endpoint Operations | 10 | 7 | 8 | 9 | 7 | 7 | 5 | 5 | 3 | 5 | 4 | 2 | 4 | **76** | Good | RECOMMENDED POST-LAUNCH |

### BUILD

| ID | Title | SA | INT | TASK | EVID | ACC | PROG | CW | LT | FRESH | LAB | AR | COMM | SAFE | **Σ** | Band | Recommendation |
|----|-------|----|----|------|------|-----|------|----|----|-------|-----|----|------|------|------|------|----------------|
| RC-BLD-001 | Web Application Delivery Foundations | 10 | 10 | 9 | 11 | 7 | 9 | 6 | 6 | 3 | 5 | 4 | 3 | 4 | **87** | Strong | RECOMMENDED FOR LAUNCH |
| RC-BLD-002 | Automation & Scripting Foundations | 9 | 9 | 8 | 10 | 6 | 9 | 7 | 6 | 3 | 5 | 3 | 2 | 2 | **79** | Good | RECOMMENDED AS LAUNCH ALTERNATIVE |
| RC-BLD-003 | Mobile App Foundations | 8 | 8 | 6 | 6 | 4 | 5 | 4 | 5 | 2 | 2 | 2 | 2 | 2 | **56** | Weak | DEFERRED |

### ANALYZE

| ID | Title | SA | INT | TASK | EVID | ACC | PROG | CW | LT | FRESH | LAB | AR | COMM | SAFE | **Σ** | Band | Recommendation |
|----|-------|----|----|------|------|-----|------|----|----|-------|-----|----|------|------|------|------|----------------|
| RC-ANL-001 | Practical Data Analysis Foundations | 10 | 9 | 9 | 10 | 6 | 8 | 6 | 6 | 3 | 5 | 4 | 2 | 3 | **81** | Good | RECOMMENDED AS LAUNCH ALTERNATIVE |
| RC-ANL-002 | Data Engineering Foundations | 9 | 9 | 7 | 7 | 4 | 6 | 5 | 6 | 2 | 3 | 2 | 1 | 2 | **63** | Weak | DEFERRED |
| RC-ANL-003 | Responsible AI Literacy & Applied Analytics | 11 | 8 | 7 | 8 | 6 | 7 | 5 | 5 | 2 | 5 | 3 | 2 | 3 | **72** | Possible | RESEARCH FURTHER |

### PROTECT

| ID | Title | SA | INT | TASK | EVID | ACC | PROG | CW | LT | FRESH | LAB | AR | COMM | SAFE | **Σ** | Band | Recommendation |
|----|-------|----|----|------|------|-----|------|----|----|-------|-----|----|------|------|------|------|----------------|
| RC-PRT-001 | Defensive Security Operations Foundations | 11 | 9 | 9 | 11 | 6 | 9 | 6 | 6 | 3 | 5 | 4 | 3 | 4 | **86** | Strong | RECOMMENDED FOR LAUNCH |
| RC-PRT-002 | Identity & Access Security Foundations | 11 | 9 | 9 | 10 | 6 | 8 | 6 | 6 | 4 | 5 | 4 | 2 | 3 | **83** | Good | RECOMMENDED AS LAUNCH ALTERNATIVE |
| RC-PRT-003 | Secure Network Defense Foundations | 10 | 8 | 8 | 9 | 5 | 8 | 5 | 6 | 4 | 4 | 4 | 2 | 4 | **77** | Good | RECOMMENDED POST-LAUNCH |

### LEAD

| ID | Title | SA | INT | TASK | EVID | ACC | PROG | CW | LT | FRESH | LAB | AR | COMM | SAFE | **Σ** | Band | Recommendation |
|----|-------|----|----|------|------|-----|------|----|----|-------|-----|----|------|------|------|------|----------------|
| RC-LED-001 | Technology Delivery & Risk Foundations | 11 | 9 | 8 | 10 | 7 | 9 | 7 | 6 | 4 | 5 | 4 | 2 | 2 | **84** | Good | RECOMMENDED FOR LAUNCH |
| RC-LED-002 | Digital Service Management Foundations | 10 | 8 | 7 | 8 | 7 | 7 | 5 | 5 | 4 | 5 | 4 | 2 | 1 | **73** | Possible | RECOMMENDED POST-LAUNCH |
| RC-LED-003 | Cyber Risk Governance Foundations | 9 | 7 | 6 | 7 | 5 | 5 | 4 | 5 | 4 | 5 | 2 | 1 | 1 | **61** | Weak | REJECTED |

---

## Ranked summary

| Rank | ID | Σ | Band | Recommendation |
|------|----|---|------|----------------|
| 1 | RC-OPR-001 | 88 | Strong | RECOMMENDED FOR LAUNCH |
| 2 | RC-BLD-001 | 87 | Strong | RECOMMENDED FOR LAUNCH |
| 3 | RC-PRT-001 | 86 | Strong | RECOMMENDED FOR LAUNCH |
| 4 | RC-LED-001 | 84 | Good | RECOMMENDED FOR LAUNCH |
| 5 | RC-PRT-002 | 83 | Good | RECOMMENDED AS LAUNCH ALTERNATIVE |
| 6 | RC-OPR-002 | 82 | Good | RECOMMENDED AS LAUNCH ALTERNATIVE |
| 7 | RC-ANL-001 | 81 | Good | RECOMMENDED AS LAUNCH ALTERNATIVE |
| 8 | RC-BLD-002 | 79 | Good | RECOMMENDED AS LAUNCH ALTERNATIVE |
| 9 | RC-PRT-003 | 77 | Good | RECOMMENDED POST-LAUNCH |
| 10 | RC-OPR-003 | 76 | Good | RECOMMENDED POST-LAUNCH |
| 11 | RC-LED-002 | 73 | Possible | RECOMMENDED POST-LAUNCH |
| 12 | RC-ANL-003 | 72 | Possible | RESEARCH FURTHER |
| 13 | RC-ANL-002 | 63 | Weak | DEFERRED |
| 14 | RC-LED-003 | 61 | Weak | REJECTED |
| 15 | RC-BLD-003 | 56 | Weak | DEFERRED |

## Provisional launch set (discussion only — NOT YET LOCKED)

| Slot | Candidate | Score | Notes |
|------|-----------|-------|-------|
| OPERATE | RC-OPR-001 | 88 | Primary; alt RC-OPR-002 |
| BUILD | RC-BLD-001 | 87 | Primary; alt RC-BLD-002 |
| PROTECT | RC-PRT-001 | 86 | Primary; alt RC-PRT-002 |
| LEAD | RC-LED-001 | 84 | Primary; Cross-Wing glue |
| ANALYZE (alt / stretch) | RC-ANL-001 | 81 | Strong alternative if 5th Route capacity |

Portfolio still needs explicit Cross-Wing Route + Secure Extension design in later LEARNING gates — not assigned Product Codes here.

## Scoring notes (honest variation)

- **RC-OPR-001** leads on Evidence quality, Saudi/international demand, and lab feasibility with managed quotas.
- **RC-BLD-001** leads BUILD on task clarity and Evidence (shippable artifacts); freshness pressure from frameworks kept scores honest.
- **RC-PRT-001** anchors PROTECT; accessibility slightly lower due to cognitive load of triage.
- **RC-LED-001** tops LEAD on progression + Cross-Wing; safety/ethics score conservative to avoid soft-skills theater.
- **RC-BLD-003** penalized hard on lab feasibility and operational cost.
- **RC-ANL-002** deferred as too advanced for foundations launch despite strong market relevance.
- **RC-LED-003** rejected for catalogue overlap with PROTECT + LEAD delivery/risk, not for lack of national relevance.
- **RC-ANL-003** needs further research on freshness, Arabic model quality, and safety Evidence design.

## Explicit non-claims

No Product Codes. No `LOCKED` Route status. No certification promises. Scores do not authorize curriculum authoring lock.
