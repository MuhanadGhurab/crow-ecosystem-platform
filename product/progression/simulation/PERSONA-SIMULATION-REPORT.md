# Persona Simulation Report

| Field | Value |
|-------|-------|
| **Document ID** | GHV-PRG-SIM-PER-RPT-001 |
| **Version** | 0.1.0 |
| **Status** | SIMULATION CANDIDATE · PENDING GHV.PROGRESSION.1C CALIBRATION |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PROGRESSION.1B |
| **Run ID** | RUN-001 |
| **Seed** | n/a (deterministic persona streams) |
| **Formula versions** | all registered IDs at **0.1.0** |
| **Input** | [../../analysis/progression-simulation/persona-events.csv](../../analysis/progression-simulation/persona-events.csv) |
| **Output** | [../../analysis/progression-simulation/persona-results.csv](../../analysis/progression-simulation/persona-results.csv) |
| **Limitations** | SYNTHETIC ONLY · NOT CALIBRATED · NOT REAL-USER EVIDENCE · NOT PRODUCT CODE |

## Purpose

Run all 15 deterministic personas through candidate formulas and compare expected vs actual outcomes.

## Aggregate result

| Metric | Value |
|--------|------:|
| Personas | 15 |
| PASS | **15** |
| FAIL | **0** |
| Formula revisions required | **0** |

## Persona results

| ID | Expected behaviour (summary) | Actual | PASS/FAIL | Formula issue | Revision |
|----|------------------------------|--------|-----------|---------------|----------|
| PER-001 | New learner: modest XP/Level; no Route-Proven; no Prestige | XP 280 · L2 · Silver · Hatchling · RP=0 · Prestige NOT_ELIGIBLE | PASS | none | none |
| PER-002 | Steady worker: Route-Proven possible; Gold Momentum; no Prestige auto-grant | XP 850 · L4 · Gold · Pathfinder · RP=1 · NOT_ELIGIBLE | PASS | none | none |
| PER-003 | High activity, low Evidence: high XP allowed; **no** Route-Proven / Title / Prestige | XP 740 · L4 · Silver · Hatchling · RP=0 · NOT_ELIGIBLE | PASS | none | none |
| PER-004 | Low activity, high Evidence: strong Mastery / Route-Proven possible | XP 1015 · L5 · Gold · Pathfinder · RP=1 · NOT_ELIGIBLE | PASS | none | none |
| PER-005 | Experienced Evidence portfolio: high Maturity; Ascendant **nomination** only | XP 1135 · L5 · Gold · Vanguard · RP=1 · ELIGIBLE_ASCENDANT_NOMINATION | PASS | none | none |
| PER-006 | Paid Expedition, no learning: **zero** progression | XP 0 · L1 · Iron · Hatchling · RP=0 · NOT_ELIGIBLE | PASS | none | none |
| PER-007 | Merit Grant learner with Evidence: progression from Merit events only — no plan boost | XP 1075 · L5 · Gold · Specialist · RP=1 · NOT_ELIGIBLE | PASS | none | none |
| PER-008 | Returning after inactivity: history preserved; return Momentum allowed | XP 620 · L4 · Gold · Scout · RP=0 · NOT_ELIGIBLE | PASS | none | none |
| PER-009 | Minor Arabic-first: progress visible; no Prestige; privacy-safe board rules apply | XP 485 · L3 · Gold · Scout · RP=0 · NOT_ELIGIBLE | PASS | none | none |
| PER-010 | Compressed accessibility schedule: Momentum not collapsed solely by schedule shape | XP 330 · L3 · Bronze · Scout · RP=0 · NOT_ELIGIBLE | PASS | none | none |
| PER-011 | Team passenger: Team success ≠ full individual Mastery / Route-Proven | XP 250 · L2 · Bronze · Hatchling · RP=0 · NOT_ELIGIBLE | PASS | none | none |
| PER-012 | Strong Team contributor: contribution recognition + Route-Proven possible | XP 1265 · L5 · Gold · Specialist · RP=1 · NOT_ELIGIBLE | PASS | none | none |
| PER-013 | Integrity review: Mastery blocked while concern active; audit path remains | XP 400 · L3 · Gold · Scout · RP=0 · NOT_ELIGIBLE | PASS | none | none |
| PER-014 | Popularity without Evidence: no Trust elevation from reactions; no Mastery | XP 255 · L2 · Bronze · Hatchling · RP=0 · NOT_ELIGIBLE | PASS | none | none |
| PER-015 | Prestige candidate: PEI may open Ascendant nomination; **no auto-grant** | XP 1490 · L5 · Gold · Vanguard · RP=1 · ELIGIBLE_ASCENDANT_NOMINATION | PASS | none | none |

## Required Gate checks (persona-level)

| Check | Result |
|-------|--------|
| High-activity / low-Evidence → no Route-Proven | **PASS** (PER-003) |
| Low-activity / high-Evidence → Route-Proven possible | **PASS** (PER-004) |
| Payment alone → zero progression | **PASS** (PER-006) |
| Prestige never auto-granted | **PASS** (PER-005, PER-015 nomination only) |
| Trust remains non-numeric / non-public | **PASS** (state labels only) |
| RT-ANL-001 absent from launch streams | **PASS** (no ANL events in persona-events) |

## Status

```text
SIMULATION CANDIDATE — PENDING GHV.PROGRESSION.1C CALIBRATION
NOT CALIBRATED
NOT REAL-USER EVIDENCE
```

## Change history

| Version | Date | Change |
|---------|------|--------|
| 0.1.0 | 2026-07-21 | RUN-001 complete — 15/15 PASS · no formula revisions |
