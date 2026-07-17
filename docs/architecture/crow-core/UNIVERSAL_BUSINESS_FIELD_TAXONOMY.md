# Universal Business Field Taxonomy

## Sources

| Source | Version | Role |
|--------|---------|------|
| SSIC (Saudi National Classification) | Rev. 4 (2024) | Primary jurisdictional backbone |
| ISIC Rev. 4 | UN standard | International crosswalk |
| NAICS 2022 | US/English | Secondary synonym crosswalk |
| Crow industry archetypes | tenant-composition | Recommendation mapping |
| Crow specialist domains | model-forge | Specialist activity mapping |

## Friendly-name strategy

- Client sees `displayNameEn` / `displayNameAr`
- Official codes stored in `crosswalk` metadata only
- Categories group fields for browse; search is primary UX

## Coverage

- 39 broad categories
- 100+ specialist field definitions
- Aliases, misspellings, and Arabic terms for search

## Mapping method

Each `BusinessFieldDefinition` maps to `relatedIndustryArchetypeKey` when a Crow archetype exists. Unmapped specialist activities remain catalog-only with ProCrow review.

## Unsupported / ambiguous

Custom descriptions use `CUSTOM_UNRESOLVED` until ProCrow confirms mapping.

Implementation: `src/lib/business-field-catalog/`
