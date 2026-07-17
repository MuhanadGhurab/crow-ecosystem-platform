# ProCrow Tenant Studio

**Status:** CURRENT — draft composition UI; provisioning PLANNED.

## Route

`/admin/tenant-studio` (`routes.admin.tenantStudio`)

## Authority

- **Required:** authoritative `platform_admin` role (page-level guard).
- **Denied:** implementer (even with `platform.admin.view` nav visibility), client owner, tenant member, metadata-only roles, email-only matches.
- Nav entry uses `platform.admin.view` for discoverability; page enforces stricter PLATFORM_ADMIN check.

## Surfaces

1. **Catalog explorer** — industries, capabilities, workflows, roles, job families, permission bundles, SAREA patterns, CyberCrow packs, overlays.
2. **Composition workspace** — select archetype, overlays, optional capabilities, organization signals; load reference compositions.
3. **Blueprint preview** — departments, capability map, workflows, roles, permission recommendations, SAREA and CyberCrow recommendations, warnings, unresolved decisions, role↔workflow matrix.

## Constraints

- No tenant provisioning.
- No hosted mutations (no Prisma, no Supabase writes).
- No Candidate 07 or Discovery changes.
- Internal ProCrow surface — not exposed via public alias.

## Implementation

- Page: `src/app/admin/tenant-studio/page.tsx`
- UI: `src/components/procrow/tenant-studio-content.tsx`
- Registry: `src/lib/tenant-composition/registry.ts`
