# GHURAVIA Architecture 1B — Spike Harness Root

| Field | Value |
|-------|-------|
| **Document ID** | GHV-SPK-1B-ROOT |
| **Version** | 1.0.0 |
| **Status** | **VALIDATION PLAN · DECISION PENDING** (P0 **TO EXECUTE**) |
| **Owner** | Founder (RAVEN) |
| **Date** | 2026-07-21 |
| **Source Gate** | GHV.ARCHITECTURE.1B |
| **Plan** | [ARCHITECTURE-1B-P0-SPIKE-SET.md](../../../architecture/ghuravia/validation/ARCHITECTURE-1B-P0-SPIKE-SET.md) |
| **Evidence index** | [SPIKE-EVIDENCE-INDEX.md](./SPIKE-EVIDENCE-INDEX.md) |

```text
NON-PRODUCT CODE
Spike root ONLY — no product src/, apps/, or learning/progression runtime
```

## Isolation rules (summary)

1. **Location:** All harness code lives under `spikes/ghuravia/architecture-1b/` only — per-spike subdirectories (`spk-arc-NNN/`).
2. **Product Code:** Do **not** modify `product/`, `product/learning`, progression formulas, or governed Product Code paths. Harnesses are throwaway or evidence-only.
3. **Inherited repo:** CyberCrow archive paths are **inventory inputs**, not approved stack — see SPK-ARC-001 reject/inherit table.
4. **Data:** Synthetic or anonymized fixtures only — no production learner data.
5. **Secrets:** No Production credentials in harness; Preview/Test isolation enforced (SPK-ARC-021).
6. **Deploy / DB:** Each spike declares permissions in its README; default deny until spike README authorizes scoped access.
7. **Cleanup:** Tear down temp DBs, buckets, and credentials after PASS/FAIL.
8. **Commits:** Docs + named harness only; spike evidence updates [SPIKE-EVIDENCE-INDEX.md](./SPIKE-EVIDENCE-INDEX.md) and registry status when runs complete.
9. **Standard:** Full field set in [TECHNICAL-SPIKE-STANDARD.md](../../../architecture/ghuravia/validation/TECHNICAL-SPIKE-STANDARD.md).

## P0 spikes (execution order)

| Order | ID | Harness path |
|------:|----|--------------|
| 1 | SPK-ARC-001 | `spk-arc-001/` |
| 2 | SPK-ARC-021 | `spk-arc-021/` |
| 3 | SPK-ARC-003 | `spk-arc-003/` |
| 4 | SPK-ARC-005 | `spk-arc-005/` |
| 5 | SPK-ARC-010 | `spk-arc-010/` |
| 6 | SPK-ARC-011 | `spk-arc-011/` |

P1 topics **SPK-ARC-002** (RTL) and **SPK-ARC-004** (92-screen routing) may appear as **supporting micro-spikes** inside `spk-arc-001/` only — they remain P1 in the registry.

## How to run

Each P0 spike is a self-contained Node/npm mini-project under its subdirectory:

```bash
cd spikes/ghuravia/architecture-1b/spk-arc-NNN
npm install
npm test          # or npm run spike — per-spike README
```

- Run spikes in **registry order** (001 → 021 → 003 → 005 → 010 → 011).
- Record outcomes in [SPIKE-EVIDENCE-INDEX.md](./SPIKE-EVIDENCE-INDEX.md) and [TECHNICAL-SPIKE-REGISTRY.md](../../../architecture/ghuravia/validation/TECHNICAL-SPIKE-REGISTRY.md).
- **Do not** add a `package.json` at repository root for spike work.

## Change history

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | GHV.ARCHITECTURE.1B spike root — isolation rules and P0 index |
