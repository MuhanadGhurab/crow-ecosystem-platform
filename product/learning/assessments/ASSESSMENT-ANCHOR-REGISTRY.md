# Assessment Anchor Registry

| Field | Value |
|-------|-------|
| **Document ID** | GHV-LRN-ASM-REG-001 |
| **Version** | 1.0.0 |
| **Status** | BLUEPRINT RECOMMENDED — PENDING EXPERT REVIEW |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.LEARNING.1C |
| **Last updated** | 2026-07-21 |
| **Related** | [ASSESSMENT-ANCHOR-STANDARD.md](./ASSESSMENT-ANCHOR-STANDARD.md) · [MISSION-BLUEPRINT-REGISTRY.md](../missions/MISSION-BLUEPRINT-REGISTRY.md) · [MISSION-EVIDENCE-TRACEABILITY.md](../missions/MISSION-EVIDENCE-TRACEABILITY.md) · [ROUTE-PROVEN-STANDARD.md](../proven/ROUTE-PROVEN-STANDARD.md) |
| **Expert review** | **NOT RUN** |
| **Pilot** | **NOT RUN** |
| **Limitations** | Qualitative anchors only — no numeric pass scores; no XP; not LOCKED |
| **Change history** | 1.0.0 (2026-07-21) — GHV.LEARNING.1C Assessment Anchor Registry |

## Purpose

Register every launch **Assessment Anchor** (`*-ASM-*`) invented for GHV.LEARNING.1C from Mission Blueprint packs. Anchors normalize Stage / construct gates even where a pack embeds assessment as a Mission category row.

```text
Exact total: 33 assessment anchors
No numeric passing values · No XP · Expert: NOT RUN · Pilot: NOT RUN
```

---

## Exact count model (authoritative)

| Bucket | Rule | Count |
|--------|------|------:|
| **P0 Routes** | **5** ASM per Route (STG-01…STG-05) × **4** Routes (OPR · BLD · PRT · LED) | **20** |
| **CXW-001** | **4** ASM (STG-01…STG-04) | **4** |
| **SEX-001** | **4** ASM (STG-01…STG-04) | **4** |
| **RT-ANL-001** reserve | **3** ASM (STG-02 · STG-03 · STG-05) | **3** |
| **BRG-PRT-BLD-01** | **1** Bridge assessment anchor | **1** |
| **Live** | **1** conceptual Live Sky assessment anchor | **1** |
| **TOTAL** | — | **33** |

**Arithmetic check:** 20 + 4 + 4 + 3 + 1 + 1 = **33**.

### Design notes

1. **P0 STG-05 ASM** is registered even when a Mission map emphasizes EPM / Capstone prep on STG-05 — the Stage still requires a governed assessment anchor for Proven eligibility.
2. **PRT / LED** packs may label ethics or retrospective rows as ASSESSMENT Missions; this registry still assigns canonical `*-STG-NN-ASM-01` IDs for Stage gates (do not renumber Evidence / Capstone IDs from 1B).
3. **ANL** uses three anchors for representative reserve depth (not five).
4. **Live** ASM is conceptual — realtime not implemented in 1C.
5. Pass states remain qualitative (`STANDARD_MET` / `STANDARD_NOT_YET_MET`, etc.). Numeric thresholds → **GHV.PROGRESSION.1**.

---

## Registry rows (exact 33)

| # | Canonical ID | Owner | Type | Status | Document | Review status | Expert-review dependency | Launch status |
|---|--------------|-------|------|--------|----------|---------------|--------------------------|---------------|
| 1 | RT-OPR-001-STG-01-ASM-01 | RT-OPR-001 | Stage assessment anchor | ARCHITECTURE BLUEPRINT | [RT-OPR-001-MISSION-BLUEPRINTS.md](../missions/routes/RT-OPR-001-MISSION-BLUEPRINTS.md) | PENDING EXPERT REVIEW | EXP-OPR · EXP-INT | CONTROLLED LAUNCH — not LOCKED |
| 2 | RT-OPR-001-STG-02-ASM-01 | RT-OPR-001 | Stage assessment anchor | ARCHITECTURE BLUEPRINT | [RT-OPR-001-MISSION-BLUEPRINTS.md](../missions/routes/RT-OPR-001-MISSION-BLUEPRINTS.md) | PENDING EXPERT REVIEW | EXP-OPR · EXP-INT | CONTROLLED LAUNCH — not LOCKED |
| 3 | RT-OPR-001-STG-03-ASM-01 | RT-OPR-001 | Stage assessment anchor | ARCHITECTURE BLUEPRINT | [RT-OPR-001-MISSION-BLUEPRINTS.md](../missions/routes/RT-OPR-001-MISSION-BLUEPRINTS.md) | PENDING EXPERT REVIEW | EXP-OPR · EXP-INT | CONTROLLED LAUNCH — not LOCKED |
| 4 | RT-OPR-001-STG-04-ASM-01 | RT-OPR-001 | Stage assessment anchor | ARCHITECTURE BLUEPRINT | [RT-OPR-001-MISSION-BLUEPRINTS.md](../missions/routes/RT-OPR-001-MISSION-BLUEPRINTS.md) | PENDING EXPERT REVIEW | EXP-OPR · EXP-INT | CONTROLLED LAUNCH — not LOCKED |
| 5 | RT-OPR-001-STG-05-ASM-01 | RT-OPR-001 | Stage assessment anchor | ARCHITECTURE BLUEPRINT | [RT-OPR-001-MISSION-BLUEPRINTS.md](../missions/routes/RT-OPR-001-MISSION-BLUEPRINTS.md) | PENDING EXPERT REVIEW | EXP-OPR · EXP-INT | CONTROLLED LAUNCH — not LOCKED |
| 6 | RT-BLD-001-STG-01-ASM-01 | RT-BLD-001 | Stage assessment anchor | ARCHITECTURE BLUEPRINT | [RT-BLD-001-MISSION-BLUEPRINTS.md](../missions/routes/RT-BLD-001-MISSION-BLUEPRINTS.md) | PENDING EXPERT REVIEW | EXP-BLD · EXP-INT | CONTROLLED LAUNCH — not LOCKED |
| 7 | RT-BLD-001-STG-02-ASM-01 | RT-BLD-001 | Stage assessment anchor | ARCHITECTURE BLUEPRINT | [RT-BLD-001-MISSION-BLUEPRINTS.md](../missions/routes/RT-BLD-001-MISSION-BLUEPRINTS.md) | PENDING EXPERT REVIEW | EXP-BLD · EXP-A11Y · EXP-INT | CONTROLLED LAUNCH — not LOCKED |
| 8 | RT-BLD-001-STG-03-ASM-01 | RT-BLD-001 | Stage assessment anchor | ARCHITECTURE BLUEPRINT | [RT-BLD-001-MISSION-BLUEPRINTS.md](../missions/routes/RT-BLD-001-MISSION-BLUEPRINTS.md) | PENDING EXPERT REVIEW | EXP-BLD · EXP-INT | CONTROLLED LAUNCH — not LOCKED |
| 9 | RT-BLD-001-STG-04-ASM-01 | RT-BLD-001 | Stage assessment anchor | ARCHITECTURE BLUEPRINT | [RT-BLD-001-MISSION-BLUEPRINTS.md](../missions/routes/RT-BLD-001-MISSION-BLUEPRINTS.md) | PENDING EXPERT REVIEW | EXP-BLD · EXP-INT | CONTROLLED LAUNCH — not LOCKED |
| 10 | RT-BLD-001-STG-05-ASM-01 | RT-BLD-001 | Stage assessment anchor | ARCHITECTURE BLUEPRINT | [RT-BLD-001-MISSION-BLUEPRINTS.md](../missions/routes/RT-BLD-001-MISSION-BLUEPRINTS.md) | PENDING EXPERT REVIEW | EXP-BLD · EXP-INT | CONTROLLED LAUNCH — not LOCKED |
| 11 | RT-PRT-001-STG-01-ASM-01 | RT-PRT-001 | Stage assessment anchor (ethics gate) | ARCHITECTURE BLUEPRINT | [RT-PRT-001-MISSION-BLUEPRINTS.md](../missions/routes/RT-PRT-001-MISSION-BLUEPRINTS.md) | PENDING EXPERT REVIEW | EXP-PRT · EXP-INT | CONTROLLED LAUNCH — not LOCKED |
| 12 | RT-PRT-001-STG-02-ASM-01 | RT-PRT-001 | Stage assessment anchor | ARCHITECTURE BLUEPRINT | [RT-PRT-001-MISSION-BLUEPRINTS.md](../missions/routes/RT-PRT-001-MISSION-BLUEPRINTS.md) | PENDING EXPERT REVIEW | EXP-PRT · EXP-INT | CONTROLLED LAUNCH — not LOCKED |
| 13 | RT-PRT-001-STG-03-ASM-01 | RT-PRT-001 | Stage assessment anchor | ARCHITECTURE BLUEPRINT | [RT-PRT-001-MISSION-BLUEPRINTS.md](../missions/routes/RT-PRT-001-MISSION-BLUEPRINTS.md) | PENDING EXPERT REVIEW | EXP-PRT · EXP-INT | CONTROLLED LAUNCH — not LOCKED |
| 14 | RT-PRT-001-STG-04-ASM-01 | RT-PRT-001 | Stage assessment anchor | ARCHITECTURE BLUEPRINT | [RT-PRT-001-MISSION-BLUEPRINTS.md](../missions/routes/RT-PRT-001-MISSION-BLUEPRINTS.md) | PENDING EXPERT REVIEW | EXP-PRT · EXP-INT | CONTROLLED LAUNCH — not LOCKED |
| 15 | RT-PRT-001-STG-05-ASM-01 | RT-PRT-001 | Stage assessment anchor | ARCHITECTURE BLUEPRINT | [RT-PRT-001-MISSION-BLUEPRINTS.md](../missions/routes/RT-PRT-001-MISSION-BLUEPRINTS.md) | PENDING EXPERT REVIEW | EXP-PRT · EXP-INT | CONTROLLED LAUNCH — not LOCKED |
| 16 | RT-LED-001-STG-01-ASM-01 | RT-LED-001 | Stage assessment anchor | ARCHITECTURE BLUEPRINT | [RT-LED-001-MISSION-BLUEPRINTS.md](../missions/routes/RT-LED-001-MISSION-BLUEPRINTS.md) | PENDING EXPERT REVIEW | EXP-LED · EXP-INT | CONTROLLED LAUNCH — not LOCKED |
| 17 | RT-LED-001-STG-02-ASM-01 | RT-LED-001 | Stage assessment anchor | ARCHITECTURE BLUEPRINT | [RT-LED-001-MISSION-BLUEPRINTS.md](../missions/routes/RT-LED-001-MISSION-BLUEPRINTS.md) | PENDING EXPERT REVIEW | EXP-LED · EXP-INT | CONTROLLED LAUNCH — not LOCKED |
| 18 | RT-LED-001-STG-03-ASM-01 | RT-LED-001 | Stage assessment anchor | ARCHITECTURE BLUEPRINT | [RT-LED-001-MISSION-BLUEPRINTS.md](../missions/routes/RT-LED-001-MISSION-BLUEPRINTS.md) | PENDING EXPERT REVIEW | EXP-LED · EXP-INT | CONTROLLED LAUNCH — not LOCKED |
| 19 | RT-LED-001-STG-04-ASM-01 | RT-LED-001 | Stage assessment anchor | ARCHITECTURE BLUEPRINT | [RT-LED-001-MISSION-BLUEPRINTS.md](../missions/routes/RT-LED-001-MISSION-BLUEPRINTS.md) | PENDING EXPERT REVIEW | EXP-LED · EXP-INT | CONTROLLED LAUNCH — not LOCKED |
| 20 | RT-LED-001-STG-05-ASM-01 | RT-LED-001 | Stage assessment anchor | ARCHITECTURE BLUEPRINT | [RT-LED-001-MISSION-BLUEPRINTS.md](../missions/routes/RT-LED-001-MISSION-BLUEPRINTS.md) | PENDING EXPERT REVIEW | EXP-LED · EXP-INT | CONTROLLED LAUNCH — not LOCKED |
| 21 | CXW-001-STG-01-ASM-01 | CXW-001 | Construct Stage assessment | ARCHITECTURE BLUEPRINT | [CXW-001-MISSION-BLUEPRINTS.md](../missions/cross-wing/CXW-001-MISSION-BLUEPRINTS.md) | PENDING EXPERT REVIEW | EXP-CXW · EXP-INT | CONTROLLED LAUNCH — not LOCKED |
| 22 | CXW-001-STG-02-ASM-01 | CXW-001 | Construct Stage assessment | ARCHITECTURE BLUEPRINT | [CXW-001-MISSION-BLUEPRINTS.md](../missions/cross-wing/CXW-001-MISSION-BLUEPRINTS.md) | PENDING EXPERT REVIEW | EXP-CXW · EXP-INT | CONTROLLED LAUNCH — not LOCKED |
| 23 | CXW-001-STG-03-ASM-01 | CXW-001 | Construct Stage assessment (pre-INT) | ARCHITECTURE BLUEPRINT | [CXW-001-MISSION-BLUEPRINTS.md](../missions/cross-wing/CXW-001-MISSION-BLUEPRINTS.md) | PENDING EXPERT REVIEW | EXP-CXW · EXP-INT | CONTROLLED LAUNCH — not LOCKED |
| 24 | CXW-001-STG-04-ASM-01 | CXW-001 | Construct Stage assessment (release-risk) | ARCHITECTURE BLUEPRINT | [CXW-001-MISSION-BLUEPRINTS.md](../missions/cross-wing/CXW-001-MISSION-BLUEPRINTS.md) | PENDING EXPERT REVIEW | EXP-CXW · EXP-LED · EXP-INT | CONTROLLED LAUNCH — not LOCKED |
| 25 | SEX-001-STG-01-ASM-01 | SEX-001 | Extension Stage assessment | ARCHITECTURE BLUEPRINT | [SEX-001-MISSION-BLUEPRINTS.md](../missions/secure-extensions/SEX-001-MISSION-BLUEPRINTS.md) | PENDING EXPERT REVIEW | EXP-SEX · EXP-OPR · EXP-INT | CONTROLLED LAUNCH — not LOCKED |
| 26 | SEX-001-STG-02-ASM-01 | SEX-001 | Extension Stage assessment | ARCHITECTURE BLUEPRINT | [SEX-001-MISSION-BLUEPRINTS.md](../missions/secure-extensions/SEX-001-MISSION-BLUEPRINTS.md) | PENDING EXPERT REVIEW | EXP-SEX · EXP-INT | CONTROLLED LAUNCH — not LOCKED |
| 27 | SEX-001-STG-03-ASM-01 | SEX-001 | Extension Stage assessment | ARCHITECTURE BLUEPRINT | [SEX-001-MISSION-BLUEPRINTS.md](../missions/secure-extensions/SEX-001-MISSION-BLUEPRINTS.md) | PENDING EXPERT REVIEW | EXP-SEX · EXP-INT | CONTROLLED LAUNCH — not LOCKED |
| 28 | SEX-001-STG-04-ASM-01 | SEX-001 | Extension Stage assessment | ARCHITECTURE BLUEPRINT | [SEX-001-MISSION-BLUEPRINTS.md](../missions/secure-extensions/SEX-001-MISSION-BLUEPRINTS.md) | PENDING EXPERT REVIEW | EXP-SEX · EXP-INT | CONTROLLED LAUNCH — not LOCKED |
| 29 | RT-ANL-001-STG-02-ASM-01 | RT-ANL-001 | Reserve Stage assessment | RESERVE BLUEPRINT | [RT-ANL-001-RESERVE-MISSION-BLUEPRINTS.md](../missions/routes/RT-ANL-001-RESERVE-MISSION-BLUEPRINTS.md) | PENDING EXPERT REVIEW | EXP-ANL · EXP-INT | LAUNCH RESERVE — CAPACITY CONDITIONAL |
| 30 | RT-ANL-001-STG-03-ASM-01 | RT-ANL-001 | Reserve Stage assessment | RESERVE BLUEPRINT | [RT-ANL-001-RESERVE-MISSION-BLUEPRINTS.md](../missions/routes/RT-ANL-001-RESERVE-MISSION-BLUEPRINTS.md) | PENDING EXPERT REVIEW | EXP-ANL · EXP-INT | LAUNCH RESERVE — CAPACITY CONDITIONAL |
| 31 | RT-ANL-001-STG-05-ASM-01 | RT-ANL-001 | Reserve Stage assessment | RESERVE BLUEPRINT | [RT-ANL-001-RESERVE-MISSION-BLUEPRINTS.md](../missions/routes/RT-ANL-001-RESERVE-MISSION-BLUEPRINTS.md) | PENDING EXPERT REVIEW | EXP-ANL · EXP-INT | LAUNCH RESERVE — CAPACITY CONDITIONAL |
| 32 | BRG-PRT-BLD-01-ASM-01 | BRG-PRT-BLD-01 | Bridge assessment anchor | ARCHITECTURE BLUEPRINT | [BRG-PRT-BLD-01-APPSEC-BRIDGE.md](../missions/bridges/BRG-PRT-BLD-01-APPSEC-BRIDGE.md) | PENDING EXPERT REVIEW | EXP-PRT · EXP-CXW · EXP-INT | Feeds CXW eligibility — not LOCKED |
| 33 | LIV-MSN-001-ASM-01 | LIV-MSN-001 | Live Sky conceptual assessment | ARCHITECTURE BLUEPRINT | [LAUNCH-TEAM-LIVE-SKY-BLUEPRINT.md](../missions/live/LAUNCH-TEAM-LIVE-SKY-BLUEPRINT.md) | PENDING EXPERT REVIEW | EXP-INT · EXP-ID | Conceptual only — realtime not in 1C |

---

## Cross-checks

| Check | Result |
|-------|--------|
| Row count | **33** |
| P0 ASM (20) | **Yes** |
| CXW + SEX (8) | **Yes** |
| ANL + Bridge + Live (5) | **Yes** |
| Numeric pass scores | **None** |
| Expert / Pilot | **NOT RUN** / **NOT RUN** |
