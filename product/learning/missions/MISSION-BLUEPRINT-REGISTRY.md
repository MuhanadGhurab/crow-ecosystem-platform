# Mission Blueprint Registry

| Field | Value |
|-------|-------|
| **Document ID** | GHV-LRN-MSN-REG-001 |
| **Version** | 1.0.0 |
| **Status** | BLUEPRINT RECOMMENDED — PENDING EXPERT REVIEW |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.LEARNING.1C |
| **Last updated** | 2026-07-21 |
| **Related** | [MISSION-BLUEPRINT-STANDARD.md](./MISSION-BLUEPRINT-STANDARD.md) · Pack files under `missions/` · [ASSESSMENT-ANCHOR-REGISTRY.md](../assessments/ASSESSMENT-ANCHOR-REGISTRY.md) · [CAPSTONE-BLUEPRINT-REGISTRY.md](../capstones/CAPSTONE-BLUEPRINT-REGISTRY.md) |
| **Expert review** | **NOT RUN** |
| **Pilot** | **NOT RUN** |
| **Limitations** | Registry of blueprints only — no PUBLISHED / LOCKED Mission content; no XP |
| **Change history** | 1.0.0 (2026-07-21) — GHV.LEARNING.1C Mission Blueprint Registry |

## Purpose

Authoritative **exact** inventory of Mission Blueprint packs under GHV.LEARNING.1C.

```text
Expert review: NOT RUN
Pilot: NOT RUN
No XP · No LOCKED Routes · No approximate (~) totals
```

---

## Exact totals by construct (authoritative)

| Construct | Mission Blueprints | Status class |
|-----------|-------------------:|--------------|
| **RT-OPR-001** | **14** | ARCHITECTURE BLUEPRINT |
| **RT-BLD-001** | **14** | ARCHITECTURE BLUEPRINT |
| **RT-PRT-001** | **14** | ARCHITECTURE BLUEPRINT |
| **RT-LED-001** | **14** | ARCHITECTURE BLUEPRINT |
| **RT-ANL-001** (reserve) | **8** | RESERVE BLUEPRINT |
| **BRG-PRT-BLD-01** | **4** | ARCHITECTURE BLUEPRINT |
| **CXW-001** (includes `CXW-001-INT-01`) | **10** | ARCHITECTURE BLUEPRINT |
| **SEX-001** | **8** | ARCHITECTURE BLUEPRINT |
| **Live** (`LIV-MSN-001`) | **1** | ARCHITECTURE BLUEPRINT |
| **TOTAL Mission Blueprints** | **87** | — |

**Arithmetic check:** 14 + 14 + 14 + 14 + 8 + 4 + 10 + 8 + 1 = **87**.

---

## Pack registry (exact rows)

| Canonical ID pattern / pack ID | Owner | Type | Status | Document path | Review status | Expert-review dependency | Launch status |
|--------------------------------|-------|------|--------|---------------|---------------|--------------------------|---------------|
| `RT-OPR-001-STG-*-MSN-*` · `*-ASM-*` · `*-EPM-*` · `RT-OPR-001-CAP-01-MSN-01` | RT-OPR-001 | Route Mission pack | ARCHITECTURE BLUEPRINT | [missions/routes/RT-OPR-001-MISSION-BLUEPRINTS.md](./routes/RT-OPR-001-MISSION-BLUEPRINTS.md) | PENDING EXPERT REVIEW | EXP-OPR · EXP-ID · EXP-INT | CONTROLLED LAUNCH — not LOCKED |
| `RT-BLD-001-STG-*-MSN-*` · `*-ASM-*` · `*-EPM-*` · `RT-BLD-001-CAP-01-MSN-01` | RT-BLD-001 | Route Mission pack | ARCHITECTURE BLUEPRINT | [missions/routes/RT-BLD-001-MISSION-BLUEPRINTS.md](./routes/RT-BLD-001-MISSION-BLUEPRINTS.md) | PENDING EXPERT REVIEW | EXP-BLD · EXP-A11Y · EXP-ID · EXP-INT | CONTROLLED LAUNCH — not LOCKED |
| `RT-PRT-001-STG-*-MSN-*` (incl. ethics gate) | RT-PRT-001 | Route Mission pack | ARCHITECTURE BLUEPRINT | [missions/routes/RT-PRT-001-MISSION-BLUEPRINTS.md](./routes/RT-PRT-001-MISSION-BLUEPRINTS.md) | PENDING EXPERT REVIEW | EXP-PRT · EXP-INT · EXP-ID | CONTROLLED LAUNCH — not LOCKED |
| `RT-LED-001-STG-*-MSN-*` | RT-LED-001 | Route Mission pack | ARCHITECTURE BLUEPRINT | [missions/routes/RT-LED-001-MISSION-BLUEPRINTS.md](./routes/RT-LED-001-MISSION-BLUEPRINTS.md) | PENDING EXPERT REVIEW | EXP-LED · EXP-ID · EXP-INT | CONTROLLED LAUNCH — not LOCKED |
| `RT-ANL-001-STG-*-MSN-*` | RT-ANL-001 | Reserve Mission pack | RESERVE BLUEPRINT | [missions/routes/RT-ANL-001-RESERVE-MISSION-BLUEPRINTS.md](./routes/RT-ANL-001-RESERVE-MISSION-BLUEPRINTS.md) | PENDING EXPERT REVIEW | EXP-ANL · EXP-ID (activation-gated) | LAUNCH RESERVE — CAPACITY CONDITIONAL |
| `BRG-PRT-BLD-01-MSN-01…04` | BRG-PRT-BLD-01 | Bridge Mission pack | ARCHITECTURE BLUEPRINT | [missions/bridges/BRG-PRT-BLD-01-APPSEC-BRIDGE.md](./bridges/BRG-PRT-BLD-01-APPSEC-BRIDGE.md) | PENDING EXPERT REVIEW | EXP-PRT · EXP-CXW · EXP-BLD | Feeds CXW-001 — not LOCKED |
| `CXW-001-MSN-01…09` · `CXW-001-INT-01` | CXW-001 | Cross-Wing Mission pack | ARCHITECTURE BLUEPRINT | [missions/cross-wing/CXW-001-MISSION-BLUEPRINTS.md](./cross-wing/CXW-001-MISSION-BLUEPRINTS.md) | PENDING EXPERT REVIEW | EXP-CXW · EXP-BLD · EXP-PRT · EXP-LED · EXP-INT | CONTROLLED LAUNCH — not LOCKED |
| `SEX-001-MSN-01…08` | SEX-001 | Secure Extension Mission pack | ARCHITECTURE BLUEPRINT | [missions/secure-extensions/SEX-001-MISSION-BLUEPRINTS.md](./secure-extensions/SEX-001-MISSION-BLUEPRINTS.md) | PENDING EXPERT REVIEW | EXP-SEX · EXP-OPR · EXP-INT | CONTROLLED LAUNCH (extends RT-OPR-001) — not LOCKED |
| `LIV-MSN-001` | Live / Team Sky | Live Sky Mission blueprint | ARCHITECTURE BLUEPRINT | [missions/live/LAUNCH-TEAM-LIVE-SKY-BLUEPRINT.md](./live/LAUNCH-TEAM-LIVE-SKY-BLUEPRINT.md) | PENDING EXPERT REVIEW | EXP-ID · EXP-INT · EXP-OPR (ops narrative) | BLUEPRINT — realtime **not** implemented in 1C |

---

## Cross-checks

| Check | Result |
|-------|--------|
| Pack Mission sum | **87** |
| Capstones (separate registry) | **7** — not double-counted as extra Mission packs beyond Capstone Missions already inside Route/CXW/SEX counts |
| Evidence anchors (1B, unchanged) | **24** |
| Assessment anchors (1C registry) | **33** |
| Any status LOCKED / PUBLISHED | **No** |
| XP / Mastery numbers | **None** |
| Expert review | **NOT RUN** |
| Pilot | **NOT RUN** |

## Explicit non-goals

* No Mission marked publication-ready.
* No renumbering of 1B Evidence or Capstone IDs.
* No approximate language in authoritative totals.
