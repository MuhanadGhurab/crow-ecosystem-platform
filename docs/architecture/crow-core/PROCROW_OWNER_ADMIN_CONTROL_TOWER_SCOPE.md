# PROCROW owner-admin control tower scope

**Task:** PROCROW.ADMIN.1  
**Audience:** Project owner personal ProCrow identity (sole `PLATFORM_ADMIN`)

This document defines the **future** ProCrow owner-admin experience. It does not claim unimplemented features are working. Status labels:

- **CURRENT** — implemented and authoritative today
- **PARTIAL** — some surfaces exist; scope incomplete
- **PLANNED** — designed intent; not built
- **CONCEPT** — directional UX; not scheduled

## Role distinctions

| Actor | Scope |
|-------|-------|
| Human ProCrow owner admin | Platform-wide lifecycle, requests, tenants, CyberCrow operations, evidence |
| Tenant security administrators | Tenant-scoped security runtime and policies |
| Tenant-scoped CyberCrow runtime | Per-tenant modules (Shield, Sentinel, Fortress) |
| Platform-wide CyberCrow operations | Cross-tenant security posture and operator tooling |

---

## Platform command center

| Capability | Status |
|------------|--------|
| Platform health overview | PARTIAL |
| Environment health (preview / certification / production) | PARTIAL |
| Deployment state and provenance | PARTIAL |
| Migration state (applied / pending) | PLANNED |
| Background jobs | PLANNED |
| Integration health | PLANNED |
| Operational alerts | CONCEPT |

## Client and lifecycle operations

| Capability | Status |
|------------|--------|
| Implementation requests queue | PARTIAL |
| Request ownership oversight | PARTIAL |
| Discovery oversight | PARTIAL |
| Blueprint governance | PLANNED |
| Pricing and proposals | PLANNED |
| Tenant provisioning | PLANNED |
| Go-live gates | PARTIAL |
| Tenant lifecycle | PLANNED |

## Tenant administration

| Capability | Status |
|------------|--------|
| Tenant creation | PLANNED |
| Tenant status | PARTIAL |
| Tenant configuration | PLANNED |
| Branches / departments | PLANNED |
| Tenant users | PARTIAL |
| Memberships | PARTIAL |
| Role assignments | PARTIAL |
| Permission policies | PARTIAL |

## CEM oversight

| Capability | Status |
|------------|--------|
| Runtime modules | PLANNED |
| Workflow status | PLANNED |
| Approval chains | PLANNED |
| Operational health | CONCEPT |
| Module enablement | PLANNED |
| Cross-module dependencies | CONCEPT |

## CyberCrow control center

| Capability | Status |
|------------|--------|
| CyberCrow package selection | PLANNED |
| Crow Shield | PLANNED |
| Crow Sentinel | PLANNED |
| Crow Fortress | PLANNED |
| Tenant security-runtime status | PLANNED |
| Identity controls | PARTIAL |
| RBAC posture | PARTIAL |
| SSO integration status | PLANNED |
| Audit pipeline | PARTIAL |
| Security events | PLANNED |
| Incidents | PLANNED |
| Evidence readiness | PARTIAL |
| GRC mapping | CONCEPT |
| Risk posture | CONCEPT |
| Control-health state | CONCEPT |

## SAREA administration

| Capability | Status |
|------------|--------|
| Role experiences | PLANNED |
| Dashboard composition | PLANNED |
| Navigation policies | PLANNED |
| Complexity levels | CONCEPT |
| Device-aware experience | CONCEPT |
| Tenant experience configuration | PLANNED |

## Evidence and governance

| Capability | Status |
|------------|--------|
| Audit events (platform account) | CURRENT |
| Administrative actions log | PARTIAL |
| Role change evidence | CURRENT |
| Lifecycle transitions | PARTIAL |
| Deployment evidence | PARTIAL |
| Compliance evidence | PLANNED |
| Operator reports | PARTIAL |

## Innovation and operator experience (future homepage)

Designed as an engaging control tower, not a static link list:

| Concept | Status |
|---------|--------|
| Real-time platform status | CONCEPT |
| Tenant map | CONCEPT |
| Security posture overview | CONCEPT |
| Lifecycle pipeline | PARTIAL |
| Attention-required queue | PARTIAL |
| Guided provisioning | PLANNED |
| Global command palette | CONCEPT |
| Operator timeline | CONCEPT |
| Evidence drawer | CONCEPT |
| Safe action previews | PARTIAL |
| Dry-run before execution | CURRENT (operator scripts) |

## Current authoritative surfaces (owner admin)

These routes resolve authority via `PlatformInternalRoleAssignment`, not email:

- `/access` — ProCrow gateway card (**PROVEN** on certification, PROCROW.ADMIN.2C)
- `/admin/overview` — primary command surface (**PROVEN**)
- Nested admin surfaces under `/admin/*` (requests, discovery, tenants, etc.) — **PARTIAL**
- `/admin/users`, `/admin/roles` — **NOT IMPLEMENTED** (documented intent only)
- Platform Admin–only server actions — **PARTIAL**

After PROCROW.ADMIN.2 transfer and PROCROW.ADMIN.2C manual acceptance, the designated personal Gmail holder receives authoritative ProCrow access through database role resolution on the **certification** runtime. Live Production (`main`) remains without FTGP feature code until PR #10 merge.

---
