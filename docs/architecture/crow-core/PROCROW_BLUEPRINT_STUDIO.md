# ProCrow Blueprint Studio

**Status:** CURRENT (internal preview)

## Route

`/admin/blueprint-studio` — `src/app/admin/blueprint-studio/page.tsx`

## Authority

**PLATFORM_ADMIN only** via `requireAuthoritativeCrowAuth` + `auth.role === "platform_admin"`. Denied: IMPLEMENTER-only, client owner, tenant member, metadata-only admin, email-only match.

## Handoff from Model Forge

**Compile Blueprint Preview** stores sanitized input and draft in `sessionStorage`. No Supabase, URL secrets, or hosted state.

## Modes

Overview, Organization, Personas, Workflows, Information, Authority, Experience, Trust, Validation, Decisions, Compare, Graph, Export

## Layout

Left: section navigation · Center: section or graph · Right: provenance / validation · Top: identity and readiness · Bottom: compilation timeline

## Import

Client-side JSON via `importBlueprintPreviewJson()` — schema version and secret-shaped field checks.

## Distinction

Separate from tenant-scoped `/blueprints/[blueprintId]/studio` (persistent runtime Blueprint). ProCrow Blueprint Studio is ephemeral preview only.
