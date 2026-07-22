# LINEAGE ID AND VERSIONING POLICY

| Field | Value |
|-------|-------|
| **Document** | Lineage ID and Versioning Policy |
| **Taxonomy version** | v1.0.0 |
| **Gate** | GHV.CROW-IDENTITY.1B |
| **Status** | **LOCKED** for Core Crow Lineage taxonomy IDs |
| **Date** | 2026-07-22 |

## Immutable ID pattern

```text
CRW-<HORIZON>-<NN>
```

| Horizon code | Horizon | ID range |
|--------------|---------|----------|
| OPR | Operate | CRW-OPR-01..05 |
| BLD | Build | CRW-BLD-01..05 |
| ANL | Analyze | CRW-ANL-01..05 |
| PRT | Protect | CRW-PRT-01..05 |
| LED | Lead | CRW-LED-01..05 |

Source semantic keys `O1`–`O5`, `B1`–`B5`, `A1`–`A5`, `P1`–`P5`, `L1`–`L5` remain stable shorthand aliases for documentation; repository authority is the `CRW-*` ID.

## Change operations

| Operation | Meaning | Allowed when | Effect on ID | Effect on English name | Version impact |
|-----------|---------|--------------|--------------|------------------------|----------------|
| **ADD** | Introduce a new Lineage | Founder Gate; must not break 5×5 unless Gate explicitly expands model | New unused ID | New LOCKED English name | Minor or Major per Gate |
| **RENAME** | Change English (or approved Arabic) display label without changing meaning | Collision/cultural/linguistic Gate evidence | **ID unchanged** | New LOCKED label; prior label recorded as alias/history | Patch or Minor |
| **CLARIFY** | Refine definition, responsibilities, collisions, or evidence examples without changing protected center | Taxonomy maintenance Gate / amendment | **ID unchanged** | Usually unchanged | Patch |
| **DEPRECATE** | Mark Lineage unsuitable for new awards/enrollment while retaining history | Founder Gate | **ID retained** | Label retained with DEPRECATED marker | Minor |
| **SUPERSEDE** | Replace a deprecated Lineage with a successor for new work | Founder Gate | Old ID retained historical; successor may be ADD or clarified existing | Mapping table required | Minor or Major |
| **SPLIT** | Divide one Lineage into two+ because protected centers cannot stay distinct | Founder Gate with collision proof | Parent may DEPRECATE; children ADD | New names for children | Major |
| **MERGE** | Combine two Lineages whose centers cannot be sustained separately | Founder Gate with collision proof | Survivors: one ID continues; other DEPRECATE/SUPERSEDE | Surviving name LOCKED; merged name historical | Major |

## Hard rules

1. Never reuse a retired `CRW-*` ID for a different meaning.
2. Never silently invent Product Code IDs outside this registry.
3. Arabic label changes that remain CONTROLLED PROVISIONAL do not require English ID changes.
4. Evolved Roles are **out of scope** — no Evolved Role IDs under this policy until a future Gate.
5. Cross-Wing Major codes (`XW-*`) are **not** Core Crow Lineage IDs and are not activated here.
6. Visual glyph/asset versioning is deferred to GHV.CROW-IDENTITY.1D and must reference taxonomy version, not replace it.

## Taxonomy versioning

| Component | Scheme | Current |
|-----------|--------|---------|
| Taxonomy baseline | SemVer | **v1.0.0** |
| Registry document | Tracks taxonomy SemVer | v1.0.0 |
| Gate record | Gate ID + verdict | GHV.CROW-IDENTITY.1B |

- **PATCH** — wording/collision clarification; no ID/name meaning change.
- **MINOR** — ADD within approved model, DEPRECATE, non-breaking RENAME, Arabic status upgrades.
- **MAJOR** — SPLIT/MERGE, Horizon model change, meaning change under same ID (discouraged; prefer SUPERSEDE).

## Source

Handoff §7 ID candidates · DEC-293..DEC-295 · CORE-CROW-LINEAGE-REGISTRY.md.
