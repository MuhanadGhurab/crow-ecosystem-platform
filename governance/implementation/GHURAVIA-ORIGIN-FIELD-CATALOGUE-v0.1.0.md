# GHURAVIA Origin Field Catalogue v0.1.0

| Field | Value |
|-------|-------|
| **Document ID** | GHV-ORIGIN-CATALOGUE-v0.1.0 |
| **Version** | 0.1.0 |
| **Status** | AUTHORIZED — MINIMAL FOUNDATION |
| **Gate** | GHV.IMPLEMENTATION.0D |
| **Date** | 2026-07-22 |
| **Authority** | Implementation catalogue — not a Product / Learning / Progression unlock |

## Purpose

Define the **minimal** Origin field set for local Product Code. Exact marketing copy and future content-Gate refinement remain open; this catalogue bounds safe synthetic storage for 0D.

## Conceptual categories (locked)

| Category ID | Conceptual name | Storage role |
|-------------|-----------------|--------------|
| `broad_region_context` | Broad Region Context | Optional catalogue selection |
| `experience_background_context` | Experience / Background Context | Optional catalogue selection |
| `initial_goals_context` | Initial Goals Context | Optional multi-select from catalogue |
| `review_later_preference` | Review-Later Preference | Governed boolean / status path |

## Catalogue options v0.1.0 (synthetic placeholders)

### Broad Region Context (`broad_region_context`)

Illustrative broad regions — **not** nationality, residency, or GPS:

| Option ID | Label (EN) | Label (AR) |
|-----------|------------|------------|
| `region.gulf` | Gulf / Arabian Peninsula | الخليج / شبه الجزيرة العربية |
| `region.levant` | Levant | بلاد الشام |
| `region.north_africa` | North Africa | شمال أفريقيا |
| `region.wider_mena` | Wider MENA | المنطقة الأوسع |
| `region.global_other` | Global / Other | عالمي / أخرى |
| `region.prefer_not` | Prefer not to say | أفضل عدم التحديد |

### Experience / Background Context (`experience_background_context`)

| Option ID | Label (EN) | Label (AR) |
|-----------|------------|------------|
| `exp.exploring` | Just exploring | أستكشف فقط |
| `exp.early_career` | Early career / learning | بداية مسار / أتعلم |
| `exp.switching` | Switching paths | أغيّر مساري |
| `exp.building` | Building skills intentionally | أبني مهاراتي بوعي |
| `exp.prefer_not` | Prefer not to say | أفضل عدم التحديد |

### Initial Goals Context (`initial_goals_context`)

Multi-select; max 3; empty allowed when review-later:

| Option ID | Label (EN) | Label (AR) |
|-----------|------------|------------|
| `goal.foundations` | Build digital foundations | بناء أسس رقمية |
| `goal.confidence` | Grow confidence | تعزيز الثقة |
| `goal.explore_horizons` | Explore future Horizons later | استكشاف الآفاق لاحقاً |
| `goal.community` | Join a respectful community | الانضمام لمجتمع محترم |
| `goal.prefer_not` | Prefer not to say | أفضل عدم التحديد |

### Review-Later Preference

| Status | Meaning |
|--------|---------|
| `NOT_STARTED` | No Origin progress |
| `DRAFT` | Partial catalogue selections saved |
| `REVIEW_LATER` | User deferred detail; soft reminder recorded; Nest Intro handoff allowed |
| `COMPLETE` | User confirmed Origin for Nest Intro handoff |

## Permanence and privacy rules

```text
Optional
Private by default
Non-scoring
Non-ranking
Non-diagnostic
Non-commercial
Non-Trust
Non-Progression
Non-eligibility
Editable later
```

Origin may store future adaptation **inputs** but must **not** execute adaptation decisions in 0D. No AI model may be called.

## Prohibited fields (hard ban)

```text
Legal name
National identifier
Passport or residency number
Precise address or GPS
Exact date of birth
Religion
Tribe
Ethnicity
Medical information
Income
Employer name
School name
Immigration status
Political opinion
Unrestricted free text
```

## Inference prohibitions

Do **not** infer from Origin:

```text
Nationality · Residency · Skill · Trust · Readiness
Career fit · Horizon · Route · Prestige · Rank
```

## Persistence safety

Origin response values must **not** enter:

```text
Public profiles
Trust
Progression
Commercial entitlement
General telemetry
Audit payload bodies
Provider calls
```

Audit metadata only: action, changed field category, catalogue version, prior status, resulting status, actor, authority, reason, correlation ID.

## Version conflict

Writes must declare `originCatalogueVersion: "0.1.0"`. Mismatch → governed conflict (no silent coerce).

## Catalogue verdict

```text
PASS — MINIMAL ORIGIN FIELD CATALOGUE v0.1.0 AUTHORIZED
```
