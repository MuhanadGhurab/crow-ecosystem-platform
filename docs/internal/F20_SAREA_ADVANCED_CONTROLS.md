# F20 — SAREA advanced controls (no paid infra)

**Date:** 25 May 2026  
**Audience:** Internal delivery / platform staff  
**Status:** Passed (validation recorded below)

---

## Objective

Deepen SAREA Studio with **advanced but safe** operational controls on top of F14 — without a layout builder, raw JSON editor, RBAC override, paid services, or schema changes.

**Philosophy:** RBAC controls access. SAREA controls experience.

---

## Part 1 — F14 audit (baseline)

| Area | F14 state | F20 gap addressed |
|------|-----------|-------------------|
| Role mapping | Reassign profile with `confirm=yes` | Recommended profile, alignment, RBAC/experience impact, richer success copy |
| Widgets | Visibility toggle only | Source area (CEM/CyberCrow/SAREA/Operations), human labels, order deferred |
| Navigation | Comma-separated keys | Validated keys only, mapped roles, visibility purpose |
| Preview | Lighthouse + cookie links | Experience source / impact panel per tenant |
| Admin `?tab=sarea` | 5/5 backed chips | Advisory health score, unmapped slugs, profile gaps, next actions |
| Audit trail | None | `platform_notifications` with `eventType: sarea_studio_mutation` |

**Read-only / unchanged**

- Role slug editing from studio (still avoided).
- Profile/role deletion.
- Cross-tenant profile assignment (server-enforced).
- Widget display order (no `displayOrder` on `WidgetRule`).
- `RoleExperienceMap.updatedAt` (not in schema — “last updated” deferred).

---

## Part 2 — Role mapping control

**Route:** `/sarea/role-mapping`

**Per mapping**

- Tenant slug, RBAC role slug, current SAREA profile
- Recommended persona/profile (from `PERSONA_ROLE_ALIASES`)
- Mapping alignment: aligned / review / unknown
- RBAC summary + experience impact (persona definitions)
- Materialization state + layout/widget/nav counts
- Preview link

**Safe mutation**

- `updateRoleMapProfileAction` — same tenant only, `confirm=yes`
- Audit log: before/after profile names and persona keys
- Success message clarifies RBAC unchanged

---

## Part 3 — Widget visibility control

**Route:** `/sarea/widgets`

**Per widget**

- Human label + `widgetKey`
- Source area badge (CEM, CyberCrow, SAREA, Operations)
- Visibility state + safe visibility edit
- Preview link when tenant slug present

**Deferred:** display order / dashboard zones — document on page; no schema change.

---

## Part 4 — Navigation profile control

**Route:** `/sarea/navigation`

**Per profile**

- Primary nav keys, mapped RBAC roles, visibility purpose, device note
- Comma-separated edit with **server validation** via `filterValidNavKeys` + `SAREA_NAV_KEYS`
- Unknown keys rejected; partial save with warning when some keys invalid

**Reminder:** Navigation does not grant module access.

---

## Part 5 — Preview impact / source view

**Route:** `/sarea/preview`

**Added:** `SareaPreviewImpactPanel` per lighthouse tenant

- Tenant, mapped roles, layout/widget/nav/device sources
- Tenant-backed vs fallback explanation
- Per-persona materialization row summary
- Before/after messaging guidance after studio edits (no diff engine)

---

## Part 6 — Tenant SAREA health (admin)

**Route:** `/admin/tenants/[tenantId]?tab=sarea`

**Added:** `getTenantSareaHealthDetail` + `SareaTenantHealthPanel`

- X/5 tenant-backed personas
- Advisory: Healthy · Needs review · Missing mapping · Fallback only
- Unmapped recommended RBAC slugs
- Profiles without widgets / navigation
- Next recommended actions + studio links

Advisory only — does not block tenant runtime.

---

## Part 7 — Auditability

**Implementation:** `logSareaStudioMutation` → `platform_notifications`

| Kind | Trigger |
|------|---------|
| `profile_update` | Profile rename / complexity |
| `role_map_reassign` | Role → profile change |
| `widget_visibility` | Widget visibility change |
| `navigation_keys` | Primary nav keys change |

- No secrets or raw sensitive payloads in metadata
- Failures swallowed so studio saves never block

**Future:** dedicated `CybercrowAuditLog` rows for SAREA if compliance requires immutable chain — not required for F20.

---

## Part 8 — Permission boundaries

Unchanged:

- `requirePlatformStaff` on studio pages
- `requireActionPlatformStaff` on mutations
- Same-tenant validation on role map profile change
- No client portal / tenant-user studio edits

---

## Part 9 — MEEM / Rimal validation

| Command | Purpose |
|---------|---------|
| `npm run sarea:meem-verify` | Five personas tenant-backed, mapping, preview |
| `npm run tenant:verify:rimal` | Construction isolation, five personas |
| `npm run request:pipeline:verify` | Pipeline integrity |

Record results in validation section below after run.

---

## Part 10 — Files touched (F20)

| File | Change |
|------|--------|
| `src/lib/sarea/studio-helpers.ts` | Widget area, nav validation, mapping alignment |
| `src/lib/services/sarea-studio-audit.service.ts` | Mutation audit via notifications |
| `src/lib/services/sarea-studio.service.ts` | Role map studio rows, tenant health detail |
| `src/lib/actions/sarea.ts` | Audit + nav validation + messages |
| `src/app/sarea/role-mapping/page.tsx` | Richer mapping cards |
| `src/app/sarea/widgets/page.tsx` | Source area + labels |
| `src/app/sarea/navigation/page.tsx` | Mapped roles + purpose |
| `src/app/sarea/preview/page.tsx` | Impact panel |
| `src/components/studio/sarea/sarea-role-map-assign.tsx` | Before/after context |
| `src/components/studio/sarea/sarea-tenant-health-panel.tsx` | Admin health UI |
| `src/components/studio/sarea/sarea-preview-impact-panel.tsx` | Preview source UI |
| `src/app/admin/tenants/[tenantId]/page.tsx` | Health panel on SAREA tab |

---

## Deferred (F21+)

- Widget display order / drag-and-drop
- `RoleExperienceMap` timestamps
- Immutable audit table for SAREA-only mutations
- Full before/after diff engine for preview
- Adaptive rule condition builder

---

## Validation (25 May 2026)

| Check | Result |
|-------|--------|
| `npm run typecheck` | **PASS** |
| `npm run lint` | **PASS** |
| `npm run build` | **PASS** (Next.js 15.5.18) |
| `npm run public:mirror-manifest` | **PASS** |
| `npm run sarea:meem-verify` | **PASS** — all five personas tenant-backed |
| `npm run tenant:verify:rimal` | **PASS** — construction isolation, no logistics leakage |
| `npm run request:pipeline:verify` | **PASS** — MEEM + Rimal lighthouse |

---

## F20 acceptance

**PASSED** when all validation commands pass and acceptance criteria in delivery brief are met.
