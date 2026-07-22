# IMPLEMENTATION-0D — Personalization Catalogue Preflight

| Field | Value |
|-------|-------|
| **Document ID** | GHV-IMP-0D-PREFLIGHT-PERSONALIZATION |
| **Gate** | GHV.IMPLEMENTATION.0D |
| **Date** | 2026-07-22 |
| **Branch** | `feat/ghuravia-foundation` |
| **Starting HEAD** | `0416e8f23fee4dd8efaacaa6a6ab5b64295ae66b` |

## Inputs

* `product/wireframes/identity/CROW-PERSONALIZATION-FLOW.md`
* `product/wireframes/identity/IDENTITY-WIREFRAMES.md`
* `governance/scope/SCOPE-BASELINE.md` §3.4 Wingprint
* Constitution: Visual Identity ≠ Knowledge

## Foundation personalization catalogue v0.1.0

Illustrative wireframe names are adopted as **foundation catalogue IDs** for Controlled-Launch Product Code. Names do not imply learning Routes or Skill classes.

### Base Crow (`base_crow`)

| Option ID | Notes |
|-----------|-------|
| `crow.classic` | Default safe silhouette |
| `crow.rounded` | Alternate silhouette |

### Colors (`color_palette`)

| Option ID | Notes |
|-----------|-------|
| `color.ink_sand` | Default — contrast-safe |
| `color.dusk_teal` | Contrast-safe |
| `color.ember_slate` | Contrast-safe |

### Style (`style_posture`)

| Option ID | Notes |
|-----------|-------|
| `style.calm` | Default |
| `style.alert` | Non-ranking posture |
| `style.playful` | Non-ranking posture |

### Habitat (`habitat`)

| Option ID | Label | Status |
|-----------|-------|--------|
| `habitat.coastal_shelf` | Coastal shelf | Unlocked |
| `habitat.mountain_roost` | Mountain roost | Unlocked |
| `habitat.city_antenna` | City antenna | Unlocked |
| `habitat.desert_wadi` | Desert wadi | Unlocked |
| `habitat.locked_later` | Locked later | Locked — Explainable Lock + preview only |

### Character (`character`)

| Option ID | Label | Status |
|-----------|-------|--------|
| `character.curious_scout` | Curious Scout | Unlocked |
| `character.steady_builder` | Steady Builder | Unlocked |
| `character.careful_guardian` | Careful Guardian | Unlocked |
| `character.locked_later` | Locked later | Locked — Explainable Lock + preview only |

### Cultural accessories (`accessory`) — optional

| Option ID | Status |
|-----------|--------|
| `accessory.none` | Default / skip |
| `accessory.pattern_soft` | Optional expression |
| `accessory.locked_later` | Locked — never blocks Origin |

## Quick-start defaults (contrast-safe)

```text
base_crow:     crow.classic
color_palette: color.ink_sand
style_posture: style.calm
habitat:       habitat.coastal_shelf
character:     character.curious_scout
accessory:     accessory.none
```

Banner required: user can customize anytime (Wingprint later — Path C not implemented in 0D UI).

## Minimum personalization complete

Minimum for Origin entry:

```text
valid base_crow + color_palette + style_posture
+ valid unlocked habitat
+ valid unlocked character
```

Accessories never required. Locked cosmetics never required. Incomplete cosmetics never block Origin.

## Prohibitions

Personalization must never produce:

```text
XP · Mastery · Rank · Prestige · Trust
Learning readiness · Horizon recommendation · Route recommendation
Commercial entitlement
```

## Catalogue version

Writes declare `personalizationCatalogueVersion: "0.1.0"`. Mismatch → governed conflict.

## Preflight verdict

```text
PASS — FOUNDATION PERSONALIZATION CATALOGUE AUTHORIZED
```
