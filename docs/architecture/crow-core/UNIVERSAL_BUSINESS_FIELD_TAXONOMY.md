# Universal Business Field Taxonomy

## Sources

| Source | Version | Role |
|--------|---------|------|
| SSIC (Saudi National Classification for Economic Activities) | Rev. 4 (2024) | Primary jurisdictional backbone |
| ISIC Rev. 4 | UN standard | International crosswalk |
| NAICS 2022 | US/English synonym crosswalk | Secondary alias support |

## Implementation

- Module: `src/lib/business-field-catalog/`
- **39** broad client-facing categories
- **90+** searchable field definitions with aliases and crosswalk metadata
- Classification codes stored as metadata on each field — never shown as primary labels

## Mapping method

1. SSIC section → broad category
2. Activity → `BusinessFieldDefinition` with friendly English/Arabic names
3. Map to existing Crow `IndustryArchetype` keys for recommendation engine compatibility
4. Approximate mappings flagged in crosswalk registry

## Friendly-name strategy

Client sees `displayNameEn` / `displayNameAr`. Official codes appear only under expandable advanced details.

## Unsupported mappings

Highly regulated sub-activities roll up to parent fields with `regulatedNote`. Custom descriptions route to ProCrow review.
