# J5 — SAREA Studio UX Depth (no paid infra)

**Status:** Passed (27 May 2026)  
**Audience:** Internal delivery / operators  
**Constraint:** UX depth and readiness clarity only — not an RBAC editor, not a drag/drop builder, not autonomous personalization, not production tenant customization claims.

---

## 1. SAREA surface audit (pre-J5)

| Route | Prior state | Gap |
|-------|-------------|-----|
| `/sarea/overview` | ProCrow framing, RBAC banner, stats, materialization grid, studio link grid | No unified J5 header/strip; operator next actions scattered; duplicate materialization tiles |
| `/sarea/profiles` | Materialization badges, safe edits | Weak per-profile “what it shapes” / next action |
| `/sarea/role-mapping` | Role maps, lighthouse panels, assign UI | RBAC vs SAREA buried in compact banner |
| `/sarea/preview` | Cookie preview, impact panels, persona reference | Safety note present but not in shared boundary component |
| `/sarea/navigation` | Nav keys per profile, safe edits | Experience vs permission boundary easy to miss |
| `/sarea/widgets` | Visibility toggles only | Already states no drag/drop ordering — needed clearer “not a builder” wording |

**Also inspected (unchanged behavior):** `sarea-studio.service.ts`, `sarea.service.ts`, `sarea-materialization.service.ts`, preview cookie/API, `SareaRbacBanner`, ProCrow control tower SAREA panel (overview/profiles/role-mapping/preview only).

**Real vs mock:** Profile/nav/widget rows are **live DB** when provisioned; preview uses **tenant-backed rows** when materialized else **recommended fallback** definitions. No external APIs.

**RBAC vs SAREA:** `SareaRbacBanner` already correct — J5 centralizes scope in `SareaScopeNote` + `SareaExperienceBoundaryNote` per area.

---

## 2. UX model

**File:** `src/lib/constants/sarea-ux-depth.ts`

- `SareaUXArea` — overview, profiles, role_mapping, preview, navigation, widgets  
- `SareaProfileReadinessStatus` — tenant_backed, fallback, needs_mapping, needs_review, incomplete  
- `SareaExperienceScope` — dashboard, navigation, widgets, workflow_visibility, report_density, task_focus, executive_summary, frontline_simplification  
- `SareaOperatorAction` — review_profiles, map_roles, preview_experience, validate_navigation, validate_widgets, compare_rbac_boundary, document_exception, confirm_tenant_backed_state  
- `SAREA_IDENTITY`, `SAREA_SCOPE`, `SAREA_COPY` — ProCrow Experience Studio ownership, explicit “what it is not”, RBAC boundary, tenant-backed vs fallback wording

---

## 3. Shared components

| Component | Role |
|-----------|------|
| `sarea-page-header.tsx` | Area label, ProCrow capability framing, overview link |
| `sarea-scope-note.tsx` | What SAREA is / is not (two columns) |
| `sarea-experience-boundary-note.tsx` | RBAC vs SAREA variant per page (default, mapping, preview, navigation, widgets) |
| `sarea-studio-strip.tsx` | Nav among six J5 studio routes |
| `sarea-profile-summary.tsx` | Tenant-backed / fallback / mapping readiness cards |
| `sarea-readiness-card.tsx` | Status-styled metric |
| `sarea-operator-next-actions.tsx` | Linked operator actions |

**Studio shell:** `SareaStudioPage` accepts optional `area`, `showStudioStrip`, and `operatorActions` — sub-pages use J5 header + strip without duplicating hero markup.

Existing F14/F20 panels (`SareaAcceptanceHub`, materialization panels, edit rows) retained.

---

## 4. Page depth results

### Overview

- `SareaPageHeader` + `SareaStudioStrip`  
- `SareaScopeNote` (compact) + existing RBAC/flow banners  
- `SareaProfileSummary` replaces duplicate materialization stat grid  
- `SareaOperatorNextActions` for profiles, mapping, preview, navigation, widgets  
- Lighthouse tenant chips and studio link grid preserved  

### Profiles

- `area="profiles"` header + strip  
- `SareaExperienceBoundaryNote` + operator next actions (map roles, preview, confirm tenant-backed on overview)  
- Materialization badges unchanged (real states from service)  

### Role mapping

- `area="role_mapping"` + mapping boundary note  
- Operator next actions: preview, RBAC boundary on overview, review profiles  

### Preview

- `area="preview"` + preview boundary note  
- Operator next actions: mapping, navigation, widgets validation  
- Existing lighthouse preview links and persona reference retained  

### Navigation

- `area="navigation"` + navigation boundary note (“visibility is not permission control”)  
- Operator next actions: preview, map roles, compare RBAC boundary  

### Widgets

- `area="widgets"` + widgets boundary note  
- Explicit copy: visibility only — **not a drag-and-drop page builder**  
- Operator next actions: preview, review profiles, RBAC boundary  

---

## 5. ProCrow control tower linkage

**File:** `src/components/procrow/procrow-control-tower-dashboard.tsx`

Added deep links to **Navigation** and **Widgets** alongside existing Overview, Profiles, Role mapping, Preview.

No new queries — link-only change.

---

## 6. Tenant runtime / reports linkage

**Deferred (sufficient):** G9 reports hub and G10 runtime cohesion already surface SAREA/CyberCrow experience posture with links to studio routes from prior F/G work. J5 did not add banner spam on tenant dashboards.

**Optional follow-up (J6+):** Single contextual link from tenant dashboard “experience posture” chip → `/sarea/preview` when mapping needs review.

---

## 7. Verification

| Command | Purpose |
|---------|---------|
| `npm run sarea:ux-verify` | J5 guards (files, copy, forbidden phrases on J5 components only) |
| `npm run procrow:verify` | J1–J5 aggregate |

**Forbidden phrase scan:** Limited to `src/components/sarea/*` and targeted page phrases — avoids false positives from negative context in legacy `SareaRbacBanner`.

---

## 8. Validation (27 May 2026)

Run with project gate:

- `npm run mock:verify`
- `npm run typecheck`
- `npm run lint`
- `npm run build`
- `npm run public:mirror-manifest`
- `npm run procrow:verify` (includes `sarea:ux-verify`)
- `npm run sarea:ux-verify`
- Client portal verifiers as applicable

No migrations, destructive seeds, payments, or auto-provisioning.

---

## 9. Remaining gaps

- Layouts, device rules, and adaptive rules remain on overview link grid but outside J5 six-route scope strip (intentional).  
- No unified “unmapped roles” count on overview (would need service extension).  
- Preview remains cookie-based — not live per-user personalization.  
- Widget display order not persisted (documented on widgets page).  

---

## 10. Recommended next phase

**Primary:** **J6 — Deployment Go/No-Go Center** — operator-facing deployment readiness under ProCrow, aligned with control tower deployment panel.

**Alternative:** **J6 — ProCrow Demo Rehearsal** — end-to-end walkthrough script tying queue, CyberCrow, and SAREA studio.

**Pause:** Valid if no internal demo pressure; v0.30 baseline remains safe.
