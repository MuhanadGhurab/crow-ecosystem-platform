# Work Persona Model

**Status:** CURRENT (catalog); runtime assignment PLANNED

## Location

`src/lib/model-forge/work-personas/work-persona-catalog.ts`

## Separation

| Concept | Grants permissions? |
|---------|---------------------|
| Job title | No |
| Role archetype | No (suggestion) |
| Work Persona | **No** (`grantsPermissions: false`, `authoritative: false`) |
| Permission assignment | Yes (tenant build time) |

## Building blocks

18 reusable blocks + 10 field-specific reference personas (gaming, legal, production, research, etc.)

## Scaling

`suggestPersonaMerge()` / `suggestPersonaSplit()` — advisory granularity by `TenantScaleProfile`
