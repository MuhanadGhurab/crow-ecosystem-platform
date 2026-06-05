# M2 — SAREA Blueprint-to-Experience Mapping

**Date:** 29 May 2026  
**Mode:** Advisory experience mapping — RBAC unchanged, no permission grants.

---

## Audit (existing surfaces)

| Area | Status |
|------|--------|
| SAREA studio routes (overview, profiles, role-mapping, preview, nav, widgets) | Existed — extended with blueprint mapping summary |
| Persona materialization / role maps | Tenant-backed vs fallback — reused |
| CyberCrow M1 trust service | Consumed for boundary warnings |
| L6 accepted discovery | Gates `needs_blueprint` status |
| Tenant runtime dashboard | SAREA runtime context existed — added Business Portal note |

**Core rule:** RBAC controls access. CyberCrow validates trust boundaries. SAREA shapes experience.

---

## Deliverables

| Item | Path |
|------|------|
| Contract | `src/lib/sarea/sarea-experience-mapping-contract.ts` |
| Templates | `src/lib/constants/sarea-blueprint-experience-templates.ts` |
| Service | `src/lib/services/sarea-experience-mapping.service.ts` |
| ProCrow panel | `src/components/admin/admin-sarea-experience-mapping-panel.tsx` |
| Studio summary | `src/components/sarea/sarea-blueprint-experience-summary.tsx` |
| Go/No-Go panel | `src/components/procrow/procrow-sarea-experience-go-no-go-panel.tsx` |
| Tenant note | `src/components/tenant/tenant-sarea-experience-note.tsx` |
| Verifier | `npm run sarea-blueprint:verify` |

---

## Integration

- **ProCrow tenant / request / go-no-go** — mapping status, personas, CyberCrow dependency
- **SAREA studio** — blueprint-to-experience summary per route
- **Tenant dashboard / modules** — SAREA adaptation copy (no permission changes)

---

## CyberCrow & Go/No-Go

- Mapping reads M1 trust snapshot when tenant exists
- Warning when CyberCrow trust blocked or needs review
- Go/No-Go gate `sarea-blueprint-experience-m2` (advisory)

---

## Remaining gaps

- No drag-and-drop builder
- No automatic profile materialization from mapping service
- Studio snapshot defaults to lighthouse tenant (MEEM/RIMAL)

---

## Recommended next

- **M3 — CEM Runtime Handoff & Business Portal Operational Readiness**, or  
- **M2.1 — SAREA Tenant Profile Materialization Workflow**
