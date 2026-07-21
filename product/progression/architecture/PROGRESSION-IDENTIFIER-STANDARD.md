# Progression Identifier Standard

| Field | Value |
|-------|-------|
| **Document ID** | GHV-PRG-ID-001 |
| **Version** | 1.0.0 |
| **Status** | ARCHITECTURE RECOMMENDED |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PROGRESSION.1A |
| **Last updated** | 2026-07-21 |
| **Related docs** | [PROGRESSION-SYSTEM-SEPARATION.md](./PROGRESSION-SYSTEM-SEPARATION.md) · [PROGRESSION-LEDGER-MODEL.md](./PROGRESSION-LEDGER-MODEL.md) · [../../learning/architecture/LEARNING-IDENTIFIER-STANDARD.md](../../learning/architecture/LEARNING-IDENTIFIER-STANDARD.md) · [../README.md](../README.md) |
| **Limitations** | FORMULA PENDING · SIMULATION NOT RUN · CALIBRATION NOT RUN · TECHNICAL VALIDATION NOT RUN · Product Code BLOCKED |
| **Expert review** | N/A for architecture |
| **Formula** | PENDING |
| **Change history** | 1.0.0 — GHV.PROGRESSION.1A: lock canonical progression identifiers |

---

## Principle

Canonical progression identifiers are **stable and semantic**. Display-name or language changes must not change IDs. Identifiers must remain independent of UI copy and must **never contain a subscription-plan name** (Open Flight, Flight Pass, Wing Pass, Expedition Pass, or future plan names).

Progression IDs compose with Learning IDs where referenced (e.g. `MST-RT-OPR-001` uses Route ID `RT-OPR-001` from the Learning Identifier Standard) without renaming Learning constructs.

---

## System identifiers

Exact total: **10** `PGS-*` system IDs.

| System | Canonical ID |
|--------|--------------|
| Flight XP | `PGS-XP` |
| Momentum League | `PGS-MOM` |
| Maturity Rank | `PGS-MAT` |
| Route / Capability Mastery | `PGS-MST` |
| Breadth | `PGS-BRD` |
| Trust Standing | `PGS-TRU` |
| Professional Titles | `PGS-TTL` |
| Prestige Classes | `PGS-PRS` |
| Achievements and Crests | `PGS-ACH` |
| Leaderboards and Standings | `PGS-LDB` |

Access Plan is commercial and has **no** `PGS-*` identifier in this standard.

---

## Maturity Ranks

Exact total: **7** Maturity Rank IDs.

| Order (ascending maturity) | Canonical ID | Display name (working) |
|----------------------------|--------------|------------------------|
| 1 | `MAT-HATCHLING` | Hatchling |
| 2 | `MAT-FLEDGLING` | Fledgling |
| 3 | `MAT-SCOUT` | Scout |
| 4 | `MAT-PATHFINDER` | Pathfinder |
| 5 | `MAT-SPECIALIST` | Specialist |
| 6 | `MAT-VANGUARD` | Vanguard |
| 7 | `MAT-RAVEN` | Raven |

Thresholds for advancement: **FORMULA PENDING** (1B). Order is architectural; numeric cutoffs are not defined here.

---

## Momentum Leagues

Exact total: **6** Momentum League IDs.

| Order (ascending league) | Canonical ID | Display name (working) |
|--------------------------|--------------|------------------------|
| 1 | `MOM-IRON` | Iron |
| 2 | `MOM-BRONZE` | Bronze |
| 3 | `MOM-SILVER` | Silver |
| 4 | `MOM-GOLD` | Gold |
| 5 | `MOM-PLATINUM` | Platinum |
| 6 | `MOM-DIAMOND` | Diamond |

Season placement formulas and durations: **PENDING**.

---

## Prestige Classes

Exact total: **3** Prestige Class IDs (names authoritative in Scope Baseline).

| Canonical ID | Display name (authoritative) |
|--------------|------------------------------|
| `PRS-ASCENDANT` | Ascendant Raven |
| `PRS-APEX` | Apex Raven |
| `PRS-OBSIDIAN` | Obsidian Raven |

---

## Mastery Records

| Pattern | Meaning | Example shape |
|---------|---------|---------------|
| `MST-<CAPABILITY-ID>` | Capability Mastery record | `MST-<CAPABILITY-ID>` where capability ID comes from Learning/shared capability registries |
| `MST-<ROUTE-ID>` | Route Mastery record | `MST-RT-OPR-001` |

Do not invent new Route IDs here. Use Learning Identifier Standard Route IDs (`RT-*`, `CXW-*`, `SEX-*`).

---

## Breadth Records

| Pattern | Meaning |
|---------|---------|
| `BRD-HRZ-<HORIZON-ID>` | Breadth standing linked to a Horizon (e.g. `BRD-HRZ-OPR`) |
| `BRD-MULTI-<NUMBER>` | Multi-path / multi-Horizon breadth marker |

Horizon IDs align with Learning: `OPR`, `BLD`, `ANL`, `PRT`, `LED` (as used in `HRZ-*`).

`<NUMBER>` is a stable catalogue ordinal — not a score threshold.

---

## Trust Records

| Pattern | Meaning |
|---------|---------|
| `TRU-REC-<NUMBER>` | Trust Standing / Trust case record identifier |

`<NUMBER>` is a stable record ordinal within the Trust catalogue/ledger, not a Trust “score value.”

---

## Professional Titles

| Pattern | Meaning |
|---------|---------|
| `TTL-<DOMAIN>-<NUMBER>` | Professional Title definition / award type |

Final Professional Title catalogue remains **deferred**. Domains are semantic labels (not Access Plan names). Numbers are catalogue ordinals.

---

## Achievements

| Pattern | Meaning |
|---------|---------|
| `ACH-<CATEGORY>-<NUMBER>` | Achievement definition |

Categories are governed achievement families (e.g. learning, team, Live Sky, service). Exact category registry may expand later without changing this pattern.

---

## Crests

Exact total: **6** Crest ID families.

| Pattern | Family |
|---------|--------|
| `CRS-BASE-<NUMBER>` | Base / visual foundation Crests |
| `CRS-ACH-<NUMBER>` | Achievement-linked Crests |
| `CRS-HRZ-<NUMBER>` | Horizon-linked Crests |
| `CRS-FUS-<NUMBER>` | Fusion / combination Crests |
| `CRS-EVT-<NUMBER>` | Event-linked Crests |
| `CRS-PRS-<NUMBER>` | Prestige-linked Crests |

---

## Seasons

| Pattern | Meaning |
|---------|---------|
| `MOM-SEASON-<YEAR>-<NUMBER>` | Momentum season identifier |

Example shape: `MOM-SEASON-2026-01`. Exact season duration and calendar: **PENDING** (must not be invented in 1A).

---

## Prohibited ID practices

1. Embedding subscription-plan names or SKUs in any progression ID.
2. Reusing Learning Mission/Evidence IDs as Mastery IDs without the `MST-` prefix pattern.
3. Encoding numeric thresholds, XP amounts, or percentages inside identifier tokens.
4. Changing a canonical ID when only the display language changes.
5. Using popularity or payment references as ID namespaces.

---

## Exact totals

| Construct | Exact total |
|-----------|------------:|
| `PGS-*` system IDs | **10** |
| `MAT-*` Maturity Ranks | **7** |
| `MOM-*` Momentum Leagues | **6** |
| `PRS-*` Prestige Classes | **3** |
| Crest families (`CRS-*`) | **6** |
| Mastery record patterns | **2** |
| Breadth record patterns | **2** |
| Season pattern | **1** (`MOM-SEASON-<YEAR>-<NUMBER>`) |
