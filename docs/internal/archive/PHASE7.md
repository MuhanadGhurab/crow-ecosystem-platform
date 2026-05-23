# Phase 7 — Align with architecture diagram

**North star:** [`ARCHITECTURE_DIAGRAM.md`](ARCHITECTURE_DIAGRAM.md)  
**Status:** Complete (May 2026)  
**Prerequisite:** Phases 1–6 complete

Phase 7 turns the founder diagram from documentation into **product behavior**: readiness gates, engine runtime, commercial steps, and industry acceleration.

---

## Sprint map (diagram-driven)

| Sprint | Diagram target | Deliverable | Status |
|--------|----------------|-------------|--------|
| **7.1** | Step 11 + bottom checklist | Go-live readiness page + `BlueprintGoLiveChecklist` seed/eval | Done |
| **7.2** | Layer 08 + SAREA engine | Tenant dashboard adapts by role/persona | Done |
| **7.3** | Layer 07 + CyberCrow engine | Policy guard on sensitive CEM actions | Done |
| **7.4** | Layer 03 industry templates | First template pack (logistics) | Done |
| **7.5** | Steps 4–6 + layer 05 | Pricing estimate + proposal status + client approval link | Done |
| **7.6** | Step 13 + layer 10 | Tenant health summary on admin | Done |

---

## 7.1 — Go-live readiness

- [x] `go-live-checklist.ts`, `readiness.service.ts`, `/blueprints/[id]/readiness`
- [x] Manual toggles for performance + support sign-off
- [ ] Optional: block provision until required items pass (deferred — feature flag)

---

## 7.2 — SAREA runtime

- [x] `sarea-runtime.service.ts` — nav/widgets/density per role + persona
- [x] Tenant layout + dashboard adaptation
- [x] Persona badge in header

---

## 7.3 — CyberCrow enforcement

- [x] `cybercrow-policy.service.ts` — `assertCybercrowPolicy` + audit on deny
- [x] Tenant invite, HR write, CRM write
- [x] `cem.roles.manage` — assign/remove CEM roles on `/[tenant]/users` + audit (`ROLE_ASSIGNED` / `ROLE_REMOVED`)
- [x] Discovery roles/workflows structure guarded (platform staff)
- [x] `/[tenant]/settings` — MFA + IdP from discovery identity answers

---

## 7.4 — Industry template (logistics)

- [x] `discovery-templates/logistics.json`
- [x] `discovery-template.service.ts` + apply on organization step
- [x] Industry dropdown on `/request`

---

## 7.5 — Commercial layer

- [x] `pricing.service.ts` — estimate from plan + modules + security + employee band
- [x] `estimatedMonthlySar` on request (set on create + template apply)
- [x] Blueprint `proposalStatus`, `proposalToken`, sent/approved timestamps
- [x] `/proposal/[token]` — client approve/decline
- [x] Blueprint overview — send proposal + client link
- [x] Admin request detail — estimate + proposal status

**Migration:** `prisma/migrations/20260519180000_phase7_commercial_proposal/` (also applied via `prisma db push`)

---

## 7.6 — Continuous improvement v0

- [x] `tenant-health.service.ts`
- [x] Admin tenant list — health column (incidents, members, last audit)
- [x] `/admin/tenants/[id]` — Workspace health card
- [ ] Weekly digest notification (deferred)

---

## Verification checklist (double-checked)

| Check | Command / path |
|-------|----------------|
| TypeScript | `npm run typecheck` |
| Production build | `npm run build` |
| JSX hygiene | `npm run audit:src` |
| Readiness UI | `/blueprints/[blueprintId]/readiness` |
| SAREA runtime | Same tenant, different roles → nav/widgets differ |
| Policy deny | `tenant_user` invite on `/[tenant]/users` → audit `POLICY_DENIED` |
| Logistics template | Request industry=logistics → discovery Apply template |
| Commercial | Admin request shows SAR estimate; blueprint Send proposal → `/proposal/[token]` |
| Tenant health | `/admin/tenants` health labels |

---

## Definition of done (Phase 7)

- [x] Traces to [`ARCHITECTURE_DIAGRAM.md`](ARCHITECTURE_DIAGRAM.md)
- [x] `npm run typecheck` && `npm run build` pass
- [x] [`PLATFORM_STATUS.md`](PLATFORM_STATUS.md) updated
