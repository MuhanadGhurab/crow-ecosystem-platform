# VALIDATION.md — Silhouette & 48 px correction

| Field | Value |
|-------|-------|
| Gate | GHV.CROW-IDENTITY.1F |
| Correction | Review derivatives only |
| Method | rembg subject alpha -> binary fill -> canonical framing -> NN 48x48 |
| Cinematic masters modified | **0** |
| Blind reveal map modified | **NO** |
| PASS count | **15 / 15** |
| FAIL count | **0 / 15** |

## Method notes

1. Subject isolation uses rembg (u2net) alpha — **not** a brightness/highlight threshold.
2. Alpha is binarized, morphologically closed, largest component kept, holes filled.
3. Subjects are placed on a shared canvas (1536x1024) with shared ground line and margins.
4. Silhouette presentation: pure black subject on neutral-light background.
5. 48x48 derivatives are binary-safe nearest-neighbor rescales of the corrected silhouette subject.
6. Each mask was algorithmically validated and spot-checked visually (solid black crow on light field; complete body; no environment).

## 15-row validation table

| Candidate | Complete subject | Beak | Attached wings | Tail | Two legs | No background | Solid black | 48 x 48 exact | Family readable | Lineage distinction | Verdict |
|-----------|------------------|------|----------------|------|----------|---------------|-------------|---------------|-----------------|---------------------|---------|
| O1-A | YES | YES | YES | YES | YES | YES | YES | YES | YES | YES | PASS — REVIEW READY |
| O1-B | YES | YES | YES | YES | YES | YES | YES | YES | YES | YES | PASS — REVIEW READY |
| O1-C | YES | YES | YES | YES | YES | YES | YES | YES | YES | YES | PASS — REVIEW READY |
| O2-A | YES | YES | YES | YES | YES | YES | YES | YES | YES | YES | PASS — REVIEW READY |
| O2-B | YES | YES | YES | YES | YES | YES | YES | YES | YES | YES | PASS — REVIEW READY |
| O2-C | YES | YES | YES | YES | YES | YES | YES | YES | YES | YES | PASS — REVIEW READY |
| O3-A | YES | YES | YES | YES | YES | YES | YES | YES | YES | YES | PASS — REVIEW READY |
| O3-B | YES | YES | YES | YES | YES | YES | YES | YES | YES | YES | PASS — REVIEW READY |
| O3-C | YES | YES | YES | YES | YES | YES | YES | YES | YES | YES | PASS — REVIEW READY |
| O4-A | YES | YES | YES | YES | YES | YES | YES | YES | YES | YES | PASS — REVIEW READY |
| O4-B | YES | YES | YES | YES | YES | YES | YES | YES | YES | YES | PASS — REVIEW READY |
| O4-C | YES | YES | YES | YES | YES | YES | YES | YES | YES | YES | PASS — REVIEW READY |
| O5-A | YES | YES | YES | YES | YES | YES | YES | YES | YES | YES | PASS — REVIEW READY |
| O5-B | YES | YES | YES | YES | YES | YES | YES | YES | YES | YES | PASS — REVIEW READY |
| O5-C | YES | YES | YES | YES | YES | YES | YES | YES | YES | YES | PASS — REVIEW READY |

## Blind mapping confirmation

Copied from `boards/BLIND-REVEAL-MAP.md` (unchanged):

| Lineage | X | Y | Z |
|---------|---|---|---|
| O1 Rhythm Keeper | B | A | C |
| O2 Flow Navigator | C | A | B |
| O3 Recovery Smith | A | C | B |
| O4 Automation Conductor | B | C | A |
| O5 Service Steward | C | B | A |

## Untouched assets (confirmed)

- cinematic-source-v0.1.png (15/15 hash-stable)
- cinematic-4k-v0.1.png
- portrait-v0.1.png
- candidate.json
- prompt.md
- lineage-mark-study-v0.1.png
- boards/BLIND-REVEAL-MAP.md
- A/B/C identity and lineage ordering
