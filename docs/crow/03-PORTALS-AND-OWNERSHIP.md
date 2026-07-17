# Portals and Ownership

| Field | Value |
|-------|-------|
| **Title** | Portals and Ownership |
| **Status** | CANONICAL |
| **Authority** | Owner decision — CROW.GOVERNANCE.1 |
| **Last reviewed** | 2026-07-04 |
| **Supersedes** | Partial overlap with [`I1_CROW_PORTAL_ARCHITECTURE_PROCROW_MODEL.md`](../internal/I1_CROW_PORTAL_ARCHITECTURE_PROCROW_MODEL.md) — specialist detail retained |
| **Related decisions** | [ADR-010](decisions/ADR-010-procrow-governs-design-to-runtime-accountability.md) |
| **Implementation state** | All four portals have routes; maturity varies |

## Four primary portals

### A. Public Portal

**Purpose:** Explain Crow, demonstrate value, guide visitors into the correct journey.

**Functions:** Explain Crow, Build New / Transform Existing, lifecycle, Blueprint preview, SAREA role lens, runtime preview, CEM/CyberCrow/SAREA/ProCrow, trust, Start Designing, account creation, sign-in, Request journey entry.

**Must not expose:** Private tenant data, internal ProCrow controls, privileged recommendation logic, real client records, fake live dashboards, authority-management functions.

**Route prefix:** `(public)/`, `/register`, `/request`, `/experience/*` (frozen story)

### B. Client and Proposal Portal

**Purpose:** Move client from Request through Discovery, Blueprint, commercial agreement, onboarding, subscription management.

**Client questions answered:** What does Crow need from me? What stage are we in? What was recommended and why? What requires my decision? What is commercially due? What happens next?

**Route prefix:** `/client/*`, `/account/*` (client-facing account surfaces)

**Implementation:** PARTIAL — profile, company, requests, proposals, blueprint review, onboarding tracker (I1–I11 arc).

### C. ProCrow Portal

**Purpose:** Govern design, review, commercial scope, tenant construction, readiness, Go-Live, lifecycle.

**Public definition:** *ProCrow is how Crow's intelligence becomes accountable.*

**Route prefix:** `/admin/*`, `/blueprints/*` (operator), `/discovery/*` (operator paths)

**Implementation:** PARTIAL — control tower, operator queue, blueprint studio, tenant command center, go/no-go.

### D. Enterprise Runtime Portal

**Purpose:** Run the approved organization through work-first, role-aware, permitted operational workspaces.

**Primary workspace model:**

- My Attention · My Work · My Decisions · My Evidence · My Outcomes

**Supporting capabilities:** People, Operations, Projects, Customers, Inventory, Procurement, Finance, HR, Logistics, Assets, Documents, Reporting, Integrations.

Modules support the operating model — they do not define the entire experience.

**Route prefix:** `/[tenant]/*`

**Implementation:** PARTIAL — MEEM/Rimal demo depth; My-* workspace model not fully realized.

## Portal ownership matrix

| Function | Authoritative portal owner |
|----------|---------------------------|
| Public marketing and journey entry | Public Portal |
| Account registration and verification | Public Portal (+ account routes) |
| Request submission | Client Portal (authenticated) |
| Discovery sessions and answers | Client Portal (client) / ProCrow (review) |
| Blueprint draft and versioning | ProCrow (composition) / Client (review) |
| Commercial proposal and agreement | Client Portal |
| Implementation payment schedule | Client Portal |
| Monthly subscription agreement | Client Portal |
| Tenant build orchestration | ProCrow |
| Readiness gates and Go-Live | ProCrow |
| Operational work execution | Enterprise Runtime |
| Authorization enforcement | CyberCrow (within Runtime + platform) |
| Role-aware presentation | SAREA (within Runtime) |
| Platform-wide governance | ProCrow |
| CroAI assistance (planned) | Enterprise Runtime (tenant-scoped) |

## Related documents

- [`00-CROW-CONSTITUTION.md`](00-CROW-CONSTITUTION.md)
- [`02-CANONICAL-LIFECYCLE.md`](02-CANONICAL-LIFECYCLE.md)
- [`I1_CROW_PORTAL_ARCHITECTURE_PROCROW_MODEL.md`](../internal/I1_CROW_PORTAL_ARCHITECTURE_PROCROW_MODEL.md)
