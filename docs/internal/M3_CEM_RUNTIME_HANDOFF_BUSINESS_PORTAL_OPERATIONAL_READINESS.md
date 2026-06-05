# M3 — CEM Runtime Handoff & Business Portal Operational Readiness

**Date:** 5 Jun 2026  
**Mode:** Read-only operational readiness — staging/demo handoff only; production remains F23 / Go-No-Go gated.

---

## Audit (CEM / Business Portal)

| Route | Strength | Notes |
|-------|----------|-------|
| `/[tenant]/dashboard` | **Strong** | CEM ops panel, cohesion, CyberCrow/SAREA signals, Business Portal handoff note |
| `/[tenant]/modules` | **Strong** | Enabled modules grid, cohesion, SAREA + operational readiness notes |
| `/[tenant]/departments` | **Moderate** | Tenant-backed when seeded; empty = ops pending |
| `/[tenant]/roles` | **Moderate** | Role structure visible; no permission editor |
| `/[tenant]/users` | **Moderate** | Profiles / invitation state; no auto-provision |
| `/[tenant]/tasks` | **Strong** | Task approval readiness, MEEM mock fallback, operational note |
| `/[tenant]/workflows` | **Strong** | Workflow definitions + approval linkage |
| `/[tenant]/reports` | **Strong** | BI readiness layer, MEEM hub, operational note |
| `/[tenant]/hr` … `/sales` | **Thin/demo-limited** | ERP module hubs when enabled; depth varies by G-series packs |
| `/admin/tenants/[tenantId]` | **Strong** | CEM ops, CyberCrow M1, SAREA M2, **M3 handoff panel** |
| `/admin/go-no-go` | **Strong** | M1/M2/M3 dependency panels + gate checklist |

**Operational handoff meaning:** ProCrow prepares tenant runtime → CyberCrow validates trust posture → SAREA shapes experience → CEM surfaces modules/org/tasks/workflows/reports for **staging** tenant users. Go/No-Go + F23 still gate production.

---

## Deliverables

| Item | Path |
|------|------|
| Contract | `src/lib/cem/cem-runtime-handoff-contract.ts` |
| Go/No-Go helper | `src/lib/cem/cem-runtime-go-no-go.ts` |
| Constants | `src/lib/constants/cem-operational-readiness.ts` |
| Service | `src/lib/services/cem-runtime-handoff.service.ts` |
| ProCrow tenant panel | `src/components/admin/admin-cem-runtime-handoff-panel.tsx` |
| Go/No-Go panel | `src/components/procrow/procrow-cem-runtime-go-no-go-panel.tsx` |
| Business Portal note | `src/components/tenant/tenant-business-portal-handoff-note.tsx` |
| Area notes | `src/components/tenant/tenant-cem-operational-readiness-note.tsx` |
| Verifier | `npm run cem-handoff:verify` |

---

## Handoff contract

- **Statuses:** `not_started` → area-specific needs → `ready_for_staging_handoff` or `blocked`
- **Operational areas:** modules, departments, roles, users, tasks, workflows, reports + ERP module routes (thin when enabled)
- **Dependencies:** CyberCrow trust (M1), SAREA mapping (M2)
- **Disclaimers:** staging only, no payment/subscription, Go/No-Go required

---

## Service behavior

- `buildCemRuntimeHandoffSnapshotForTenantId(tenantId)` — derived from tenant + CEM ops + optional M1/M2 snapshots
- Classifies each area: `ready` | `warning` | `thin` | `blocked` | `not_applicable`
- No user creation, module activation, provisioning, or external APIs

---

## Integration

| Surface | Change |
|---------|--------|
| ProCrow tenant workbench | CEM Runtime Handoff panel on overview tab |
| ProCrow Go/No-Go | M3 dependency panel + gate `cem-runtime-handoff-m3` |
| Business Portal dashboard | Staging handoff note + portal distinction |
| Modules / tasks / workflows / reports | Operational readiness notes |

---

## Portal distinction

| Portal | Purpose |
|--------|---------|
| **Client Portal** | Request, discovery, proposal, onboarding |
| **Business Portal** | Day-to-day operations (CEM) after ProCrow prepares runtime |
| **ProCrow** | Internal governance, tenant prep, Go/No-Go |

---

## CyberCrow / SAREA / CEM

> CEM runs operations; CyberCrow reviews trust around operations; SAREA shapes the role-based experience.

---

## Remaining gaps

- ERP module pages remain demo-limited vs full ERP depth
- No tenant employee auto-creation or Entra sync
- No permission editor or RBAC bypass
- Go/No-Go does not auto-pass from M3 readiness
- Production path still F23-deferred

---

## Recommended next

- **M4 — Tenant Membership & Business Portal Access Hardening**, or  
- **M3.1 — CEM Module Depth Pass**
