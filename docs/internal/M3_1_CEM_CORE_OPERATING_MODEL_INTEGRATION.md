# M3.1 — CEM Core Operating Model Integration

**Date:** 5 Jun 2026  
**Mode:** Read-only derived operating model — staging/demo spine visibility; production remains F23 / Go-No-Go gated.

---

## Core audit (CEM / Business Portal)

| Route | Data backing | Operating model role |
|-------|--------------|----------------------|
| `/[tenant]/dashboard` | **Strong** | CEM ops + cohesion + **M3.1 operating model panel** (flows, links, modules) |
| `/[tenant]/modules` | **Strong** | Enabled modules grid; M3 handoff notes |
| `/[tenant]/departments` | **Moderate** | Tenant-backed when seeded |
| `/[tenant]/roles` | **Moderate** | Structure visible; no permission editor |
| `/[tenant]/users` | **Moderate** | Profiles; no auto-provision |
| `/[tenant]/tasks` | **Strong** | Task data + approval readiness; **cross-link to workflows/reports** |
| `/[tenant]/workflows` | **Strong** | Workflow definitions; task linkage via ops snapshot |
| `/[tenant]/reports` | **Strong** | BI readiness; module/task/workflow feed copy |
| `/[tenant]/hr` … `/sales` | **Mixed** | ERP hubs + readiness panels; **M3.1 module operating context** on all eight ERP routes |
| `/admin/tenants/[tenantId]` | **Strong** | **CEM Core Operating Model panel** (above M3 handoff) |
| `/admin/go-no-go` | **Strong** | M3.1 operating model dependency + gate `cem-operating-model-m31` |

**Linkage findings:**

| Question | Result |
|----------|--------|
| Tasks link to workflows? | **Partial** — `cem-operations-intelligence` exposes `taskCount` per workflow; cross-link UI surfaces advisory copy when snapshot missing links |
| Workflows link to departments/roles/modules? | **Inferred** — derived from tenant modules + org counts; not full schema FK graph |
| Reports summarize task/workflow/module data? | **Partial** — BI readiness layer + operating model `reportOutputs` on flows |
| Module pages share structure? | **Yes (M3.1)** — `TenantModuleOperatingContext` on HR, Finance, Procurement, Logistics, Inventory, Warehouse, CRM, Sales |
| Operational events / audit derivable? | **Advisory** — CyberCrow trust snapshot + task/workflow counts; no SIEM replacement |

**Future schema work:** explicit task→workflow FK in UI, department/role ownership on tasks, report lineage table, operational event stream.

---

## Deliverables

| Item | Path |
|------|------|
| Contract | `src/lib/cem/cem-operating-model-contract.ts` |
| Go/No-Go helper | `src/lib/cem/cem-operating-model-go-no-go.ts` |
| Core flows | `src/lib/constants/cem-core-operating-flows.ts` |
| Service | `src/lib/services/cem-operating-model.service.ts` |
| Dashboard panel | `src/components/tenant/tenant-cem-operating-model-panel.tsx` |
| Module context | `src/components/tenant/tenant-module-operating-context.tsx` |
| Cross-link copy | `src/components/tenant/tenant-operating-model-cross-link.tsx` |
| ProCrow panel | `src/components/admin/admin-cem-operating-model-panel.tsx` |
| Go/No-Go panel | `src/components/procrow/procrow-cem-operating-model-go-no-go-panel.tsx` |
| Verifier | `npm run cem-operating-model:verify` |

---

## Operating model contract

- **Statuses:** `not_started` → `model_detected` → `partially_connected` → `operational_spine_ready` | `needs_data` | `needs_review`
- **Entities:** tenant, department, role, user, module, workflow, task, approval, report, event
- **Module roles:** system_of_record, workflow_source, task_source, approval_source, reporting_source, supporting_module
- **Links:** strength `strong` | `partial` | `inferred` | `missing`
- **Disclaimers:** operational model readiness only; staging/demo data; not production launch; ProCrow Go-No-Go required

---

## Service behavior

- `buildCemOperatingModelSnapshotForTenantId(tenantId)` — read-only derived snapshot
- `buildCemOperatingModelSnapshotForTenantSlug(slug)` — slug wrapper via `getTenantBySlug`
- `selectModuleOperatingContext(snapshot, moduleKey)` — per-module flows + role assignment
- Sources: tenant record, `getCemOperationsSnapshot`, optional CyberCrow M1 + SAREA M2 snapshots
- Builds entities, links, flows (from constants + readiness), module roles, blockers, recommended actions
- **No** user creation, task/workflow mutation, module activation, provisioning, payments, or external APIs

---

## Core operating flows (advisory)

1. **Employee onboarding** — HR → users/roles → SAREA → tasks → reports → CyberCrow access review  
2. **Purchase-to-stock** — procurement → finance approval → inventory/warehouse → reports → evidence  
3. **Sales-to-delivery** — CRM/sales → inventory → logistics → finance → reports  
4. **Task/workflow execution** — workflow template → tasks → role/department → completion → reports  
5. **Incident / exception** — issue → task escalation → manager review → CyberCrow audit → report  

Flow `readiness` is computed from enabled modules + ops counts — not faked as fully wired.

---

## Integration surfaces

| Surface | Change |
|---------|--------|
| Business Portal dashboard | Operating model panel: flows, module roles, links, CyberCrow/SAREA hooks |
| ERP module pages (8) | Standard module operating context block |
| Tasks / workflows / reports | Cross-link panels describing spine relationships |
| ProCrow tenant workbench | CEM Core Operating Model panel |
| ProCrow Go/No-Go | M3.1 dependency panel + gate `cem-operating-model-m31` |

---

## CyberCrow / SAREA hooks

> CEM runs operations. Workflows create tasks. CyberCrow observes trust and evidence around those actions. SAREA adapts dashboard/nav/widgets from the operating model — **RBAC controls access**; SAREA does not grant permissions. CyberCrow does not certify compliance.

---

## Verification

```bash
npm run cem-operating-model:verify
npm run cem-handoff:verify
npm run tenant-demo:verify
npm run runtime:verify
npm run erp:verify
npm run cybercrow-trust:verify
npm run sarea-blueprint:verify
npm run access-gateway:verify
npm run procrow-workbench:verify
npm run typecheck
npm run lint
npm run build
npm run public:mirror-manifest
```

No migrations, seeds, payments, or tenant auto-provisioning in this phase.

---

## Remaining gaps

- ERP module pages remain thin vs full ERP depth (M3.2 target)
- Task→workflow ownership not persisted as first-class FK in all paths
- Report lineage is advisory, not query-backed
- Go/No-Go does not auto-pass from operating model status
- No Entra/Graph sync; no permission editor

---

## Recommended next

- **M3.2 — CEM Module Depth Pass** (deepen HR/finance/procurement chains), or  
- **M4 — Tenant Membership & Business Portal Access Hardening**
