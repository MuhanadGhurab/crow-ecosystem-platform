# Technical Spike Priority Matrix

| Field | Value |
|-------|-------|
| **Document ID** | GHV-ARC-VAL-SPK-PRI-001 |
| **Version** | 1.0.0 |
| **Status** | **VALIDATION PLAN · PRELIMINARY** |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.ARCHITECTURE.1A §43 |
| **Last updated** | 2026-07-21 |
| **Related** | [TECHNICAL-SPIKE-REGISTRY.md](./TECHNICAL-SPIKE-REGISTRY.md) |

## Scoring model (Gate §43)

| Criterion | Weight |
|-----------|------:|
| Foundational uncertainty (FU) | 15 |
| Security impact (SEC) | 12 |
| Data-integrity impact (DI) | 12 |
| Product Scope coverage (PSC) | 10 |
| Learning/Progression impact (LPI) | 10 |
| Irreversibility (IRR) | 8 |
| Architecture decision dependency (ADD) | 8 |
| Operational risk (OPR) | 7 |
| Cost risk (COST) | 5 |
| Accessibility/localization impact (AL) | 5 |
| Founder feasibility (FF) | 5 |
| Time to evidence (TTE) | 3 |
| **Total** | **100** |

Each criterion is rated **0–5**. Contribution = `(rating / 5) × weight`. Total score ∈ **0–100**.

## Classification bands

| Class | Meaning | Score guide (prelim.) |
|-------|---------|------------------------|
| **P0** | REQUIRED BEFORE STACK LOCK | ≥ 80 |
| **P1** | REQUIRED BEFORE IMPLEMENTATION | 65–79.9 |
| **P2** | REQUIRED BEFORE CONTROLLED LAUNCH | 50–64.9 |
| **P3** | POST-LAUNCH OR CONDITIONAL | < 50 |

Prioritization is **not** based only on what is easiest to build. Founder feasibility and time-to-evidence are weighted but cannot outrank security/integrity/foundational uncertainty.

**Classification note:** P0–P3 classes are **programme-assigned** using weighted scores as input. Band guides are indicative; a spike may be elevated (e.g. P0 before stack lock) when decision-critical even if its raw score sits slightly below a numeric cutoff.

## Scored matrix

| Spike | Title | FU | SEC | DI | PSC | LPI | IRR | ADD | OPR | COST | AL | FF | TTE | **Score** | **Class** |
|-------|-------|---:|----:|---:|----:|----:|----:|----:|----:|-----:|---:|---:|----:|----------:|-----------|
| SPK-ARC-001 | Repository and framework compatibility | 5 | 3 | 3 | 4 | 3 | 4 | 5 | 3 | 3 | 2 | 4 | 4 | **73.4** | **P0** |
| SPK-ARC-002 | Arabic RTL plus LTR technical islands | 3 | 2 | 2 | 4 | 2 | 3 | 3 | 2 | 2 | 5 | 3 | 3 | **54.8** | **P1** |
| SPK-ARC-003 | Authentication and activation-state authority | 5 | 5 | 4 | 5 | 2 | 4 | 5 | 3 | 3 | 2 | 3 | 3 | **79.0** | **P0** |
| SPK-ARC-004 | 92-screen routing and shell composition feasibility | 4 | 2 | 2 | 5 | 2 | 3 | 4 | 2 | 2 | 3 | 3 | 3 | **59.4** | **P1** |
| SPK-ARC-005 | Learning Graph representation and acyclicity | 5 | 2 | 5 | 4 | 5 | 4 | 5 | 3 | 3 | 2 | 3 | 3 | **78.2** | **P0** |
| SPK-ARC-006 | Mission save and resume | 3 | 2 | 4 | 4 | 4 | 3 | 3 | 3 | 2 | 2 | 3 | 3 | **62.0** | **P1** |
| SPK-ARC-007 | Evidence resumable upload and object-storage isolation | 4 | 5 | 4 | 4 | 4 | 4 | 4 | 3 | 3 | 2 | 3 | 3 | **76.4** | **P1** |
| SPK-ARC-008 | Malware and secret-scanning pipeline | 3 | 5 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 1 | 3 | 3 | **62.8** | **P2** |
| SPK-ARC-009 | Evidence approval to targeted progression recalculation | 4 | 3 | 5 | 4 | 5 | 4 | 4 | 3 | 2 | 1 | 3 | 3 | **74.0** | **P1** |
| SPK-ARC-010 | Progression event idempotency and reversal | 5 | 4 | 5 | 4 | 5 | 5 | 5 | 3 | 2 | 1 | 3 | 3 | **82.6** | **P0** |
| SPK-ARC-011 | Formula-version historical reproduction | 5 | 3 | 5 | 3 | 5 | 5 | 5 | 3 | 2 | 1 | 3 | 3 | **78.2** | **P0** |
| SPK-ARC-012 | Commercial webhook idempotency and entitlement reconciliation | 4 | 4 | 4 | 4 | 3 | 4 | 4 | 3 | 4 | 1 | 3 | 3 | **72.0** | **P1** |
| SPK-ARC-013 | Community moderation and Trust-state separation | 3 | 4 | 3 | 4 | 3 | 3 | 3 | 3 | 2 | 2 | 3 | 3 | **62.4** | **P1** |
| SPK-ARC-014 | Live Sky participant and spectator channels | 3 | 3 | 3 | 3 | 2 | 3 | 3 | 4 | 4 | 2 | 2 | 2 | **57.8** | **P2** |
| SPK-ARC-015 | Live Sky reconnect and duplicate-contribution prevention | 2 | 2 | 4 | 2 | 2 | 2 | 2 | 3 | 2 | 1 | 2 | 2 | **45.2** | **P3** |
| SPK-ARC-016 | Arabic search and mixed-language discovery | 3 | 1 | 2 | 3 | 2 | 2 | 2 | 2 | 3 | 5 | 2 | 2 | **46.6** | **P2** |
| SPK-ARC-017 | Accessibility and reduced-motion shell behavior | 2 | 1 | 1 | 3 | 1 | 2 | 2 | 2 | 2 | 5 | 3 | 3 | **39.8** | **P2** |
| SPK-ARC-018 | Notification failure isolation | 2 | 2 | 2 | 2 | 1 | 2 | 2 | 4 | 2 | 1 | 3 | 3 | **41.4** | **P3** |
| SPK-ARC-019 | Audit and privileged correction | 4 | 5 | 4 | 3 | 3 | 4 | 3 | 3 | 2 | 1 | 3 | 3 | **68.8** | **P1** |
| SPK-ARC-020 | Backup and targeted restore | 3 | 3 | 4 | 2 | 3 | 4 | 3 | 5 | 3 | 1 | 2 | 2 | **61.2** | **P2** |
| SPK-ARC-021 | Deployment-environment isolation | 5 | 5 | 4 | 3 | 2 | 4 | 5 | 5 | 3 | 1 | 3 | 3 | **76.8** | **P0** |
| SPK-ARC-022 | Observability and privacy-safe diagnostics | 2 | 4 | 2 | 2 | 1 | 2 | 2 | 5 | 3 | 1 | 3 | 3 | **48.6** | **P2** |
| SPK-ARC-023 | Performance of Adaptive Skyboard composition | 2 | 1 | 1 | 3 | 2 | 2 | 2 | 3 | 2 | 2 | 2 | 2 | **38.6** | **P3** |
| SPK-ARC-024 | Leaderboard population and privacy enforcement | 2 | 3 | 2 | 3 | 3 | 2 | 2 | 2 | 2 | 3 | 2 | 2 | **47.4** | **P2** |
| SPK-ARC-025 | Minor-user public-profile protection | 3 | 5 | 2 | 3 | 1 | 3 | 3 | 2 | 2 | 2 | 2 | 2 | **53.4** | **P2** |

## Classification summary

| Class | Count | Spikes |
|-------|------:|--------|
| P0 | **6** | SPK-ARC-001, SPK-ARC-003, SPK-ARC-005, SPK-ARC-010, SPK-ARC-011, SPK-ARC-021 |
| P1 | **8** | SPK-ARC-002, SPK-ARC-004, SPK-ARC-006, SPK-ARC-007, SPK-ARC-009, SPK-ARC-012, SPK-ARC-013, SPK-ARC-019 |
| P2 | **8** | SPK-ARC-008, SPK-ARC-014, SPK-ARC-016, SPK-ARC-017, SPK-ARC-020, SPK-ARC-022, SPK-ARC-024, SPK-ARC-025 |
| P3 | **3** | SPK-ARC-015, SPK-ARC-018, SPK-ARC-023 |
| **Total** | **25** | SPK-ARC-001…025 |

## Notes

* Scores are **preliminary** for planning; GHV.ARCHITECTURE.1E may re-score after harness design.
* No score authorizes Product Code or marks a spike RUN.
* Stack lock remains deferred to **GHV.ARCHITECTURE.1B** pending P0 evidence programmes.

## Change history

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | GHV.ARCHITECTURE.1A §43 — preliminary weighted scoring |
