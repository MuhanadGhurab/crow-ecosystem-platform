# F14 — SAREA Studio visibility & safe controls

**Date:** 25 May 2026  
**Audience:** Internal delivery / platform staff  
**Status:** Passed (validation recorded below)

---

## Objective

Make SAREA Studio **inspectable**, **understandable**, and **safely adjustable** for platform staff — without a layout builder, raw JSON editor, RBAC override, or public redesign.

**Philosophy:** RBAC controls access. SAREA controls experience (presentation, navigation, widgets, density).

---

## Part 1 — Studio audit

| Route | Backing | Read / edit | Notes |
|-------|---------|-------------|-------|
| `/sarea/overview` | Prisma aggregates + materialization service | Read-only overview | Hub (no `/sarea` index page). Health counts, lighthouse chips, RBAC banners. |
| `/sarea/profiles` | `SareaExperienceProfile` + relations | **Safe edit:** display name, complexity in `configJson` | Materialization badge per row; purpose from persona definitions. |
| `/sarea/role-mapping` | `RoleExperienceMap` + profiles | **Safe edit:** reassign map to another profile on same tenant (`confirm=yes`) | MEEM + Rimal materialization panels. Role slug **not** editable in UI (avoids RBAC confusion). |
| `/sarea/layouts` | `DashboardLayout` | **Safe edit:** layout name | Linked to profile/tenant. |
| `/sarea/widgets` | `WidgetRule` | **Safe edit:** visibility (`visible` / `hidden` / `optional`) | No custom widget builder. |
| `/sarea/navigation` | `NavigationProfile` | **Safe edit:** primary nav keys (comma-separated) | Experience-level; RBAC still enforces routes. |
| `/sarea/device-rules` | `DeviceExperienceRule` | **Safe edit:** device type, compact flag | Advisory device behavior JSON. |
| `/sarea/rules` | `AdaptiveUiRule` | **Safe edit:** density level, rule key | No condition engine. |
| `/sarea/preview` | Cookie API + materialization | Read-only + preview links | MEEM + Rimal tenant-backed labels; fallback noted on buttons. |
| `/admin/tenants/[id]?tab=sarea` | Tenant profiles + materialization | Read-only health summary | 5/5 backed score, next actions, per-persona preview links. |

**Tenant-backed vs fallback**

- **Tenant-backed:** profile has layout + widgets + navigation counts (materialization service).
- **Partial:** some studio rows missing.
- **Recommended fallback:** global/recommended persona definitions used until tenant profile exists.
- **Not materialized:** no usable studio rows for persona.

**MEEM / Rimal in studio**

- Lighthouse slugs: `meem` (logistics), `rimal-construction` (construction).
- Visible on overview, role-mapping, preview, and admin tenant SAREA tab.
- No internal tenant IDs on public preview URLs.

**Deferred to F15+**

- Drag-and-drop layout builder (Level 4–5).
- Adaptive automation engine (Level 6).
- Raw `configJson` editor.
- Profile/role **deletion**.
- Role slug editing from studio (removed from F14 UI; use provisioning scripts).
- Widget reorder API if not already in schema.
- Dedicated description/notes DB columns (purpose remains definition-driven).

---

## Part 2–10 — What was improved

### Overview (`/sarea/overview`)

- Health summary: tenant-backed / partial / fallback / not materialized counts.
- Tenants needing review (lighthouse + others).
- Lighthouse tenant chips with links to admin `?tab=sarea`.
- RBAC + studio flow banners.

### Profiles

- Per-persona cards: tenant, state badge, purpose, role/layout/widget/nav/device counts, preview link.
- Safe edits: name + complexity select.

### Role mapping

- Chain visibility: role → profile → materialization → preview.
- Controlled profile reassignment with confirmation.
- Dual lighthouse materialization panels.

### Widgets / navigation / device-rules / layouts

- RBAC reminders; richer read-only context retained.
- Existing safe inline edits unchanged.

### Preview

- MEEM + Rimal sections with materialization + per-persona preview (fallback labeled).
- Source attribution (layout, nav/widgets, device).
- Persona reference cards with RBAC notes.

### Admin tenant SAREA tab

- Health score (X/5 tenant-backed).
- Next recommended actions when review needed.
- Per-profile counts + preview links.
- Links to studio role-mapping and preview.

---

## Part 11 — Permission boundaries

| Actor | Studio access |
|-------|----------------|
| Platform staff | View all studio routes; safe edits via server actions |
| Implementer | Same guard as platform staff if `requirePlatformStaff` / `requireActionPlatformStaff` applies |
| Tenant admin | No SAREA studio routes (layout uses platform staff gate) |
| Tenant / portal user | No studio editing |

- `src/app/sarea/layout.tsx` → `requirePlatformStaff()`.
- `src/lib/actions/sarea.ts` → `requireActionPlatformStaff()` on every mutation.
- Role map profile change validates **same tenant** only; does not change RBAC permissions.

---

## Part 12 — MEEM / Rimal validation

Run after F14 changes:

```powershell
Set-Location D:\CYBERCROW
npm run sarea:meem-verify
npm run tenant:verify:rimal
npm run request:pipeline:verify
```

**25 May 2026 results:** all passed (staging `.env.staging`).

| Command | Result |
|---------|--------|
| `npm run typecheck` | Pass |
| `npm run lint` | Pass |
| `npm run build` | Pass |
| `npm run public:mirror-manifest` | Pass |
| `npm run sarea:meem-verify` | Pass — 5/5 tenant-backed |
| `npm run tenant:verify:rimal` | Pass |
| `npm run request:pipeline:verify` | Pass |

---

## Safe editing inventory (F14)

| Entity | Allowed | Not allowed |
|--------|---------|-------------|
| Experience profile | `name`, `complexity` in `configJson` | Delete, raw JSON, RBAC |
| Dashboard layout | `name` | Delete, structure builder |
| Widget rule | `visibility` | Delete, component editor |
| Navigation profile | `primaryKeys` | Delete, drag-and-drop |
| Device rule | `deviceType`, `compact` in JSON | Full responsive engine |
| Adaptive rule | `ruleKey`, density `level` | Condition engine |
| Role map | Reassign `profileId` (same tenant, confirm) | Change role slug in UI, create/delete roles |

---

## Key implementation files

- `src/lib/services/sarea-studio.service.ts` — health summary, studio list helpers, lighthouse materialization
- `src/lib/services/sarea.service.ts` — `updateExperienceProfileConfig`, `updateRoleMapProfile`
- `src/lib/actions/sarea.ts` — server actions + revalidation paths
- `src/components/studio/sarea/sarea-rbac-banner.tsx`
- `src/components/studio/sarea/sarea-materialization-badge.tsx`
- `src/components/studio/sarea/sarea-role-map-assign.tsx`
- Studio pages under `src/app/sarea/*/page.tsx`
- `src/app/admin/tenants/[tenantId]/page.tsx` — SAREA tab

---

## Validation commands (F14 gate)

```powershell
Set-Location D:\CYBERCROW
npm run typecheck
npm run lint
npm run build
npm run public:mirror-manifest
npm run sarea:meem-verify
npm run tenant:verify:rimal
npm run request:pipeline:verify
```

Optional: `npm run simulate:vercel-build:staging` — if Windows Prisma EPERM only, note workaround when `npm run build` passes.

---

## Acceptance

**F14 — PASSED** (25 May 2026): audit documented, studio surfaces improved, permissions preserved, safe edits only, MEEM/Rimal/pipeline scripts pass, typecheck/lint/build/mirror pass. No forbidden scope added.
