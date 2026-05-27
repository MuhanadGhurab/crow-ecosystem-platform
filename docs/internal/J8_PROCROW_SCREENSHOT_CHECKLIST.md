# J8 — ProCrow screenshot checklist

**Purpose:** Capture portfolio screenshots after a successful demo rehearsal. **Do not** generate images in J8 unless explicitly requested — this is a checklist only.

**Mode:** Staging / mock · Platform Admin auth · Lighthouse tenant (`meem-global` preferred)

---

## Required captures

### 1. ProCrow Control Tower

| Field | Value |
|-------|-------|
| **Route** | `/admin/overview` |
| **Purpose** | Show internal control tower entry — map, dashboard, discipline links |
| **Ideal state** | Embedded operator queue visible; go/no-go + operator console cards; safety/staging note visible |
| **Do not show** | Cropped auth errors; subscription as “live billing” |
| **Caption** | “ProCrow Control Tower — operator home for customer-to-tenant flow and deployment discipline (staging/demo).” |

---

### 2. Operator queue

| Field | Value |
|-------|-------|
| **Route** | `/admin/queue` |
| **Purpose** | Derived request-to-tenant prioritization |
| **Ideal state** | At least one queue row with stage/priority labels |
| **Do not show** | Empty state without caption context |
| **Caption** | “Operator queue — derived stages from requests and client signals (read-only, no task engine).” |

---

### 3. Request detail

| Field | Value |
|-------|-------|
| **Route** | `/admin/requests/[requestId]` |
| **Purpose** | ProCrow-owned readiness for client + onboarding |
| **Ideal state** | Request with client/submitter linkage or onboarding hints |
| **Do not show** | PII you cannot publish; fake “approved for production” badges |
| **Caption** | “Request detail — operator view of client portal and onboarding readiness (advisory).” |

---

### 4. CyberCrow dashboard

| Field | Value |
|-------|-------|
| **Route** | `/[tenant]/cybercrow/dashboard` |
| **Purpose** | Trust cockpit on tenant |
| **Ideal state** | Trust strip + summary cards + next actions |
| **Do not show** | “Certified” or “production SOC” language |
| **Caption** | “CyberCrow trust cockpit — advisory security and evidence posture under ProCrow.” |

---

### 5. CyberCrow evidence / GRC / risk

| Field | Value |
|-------|-------|
| **Route** | `/[tenant]/cybercrow/evidence` **or** `/grc` **or** `/risk` |
| **Purpose** | Depth on trust governance |
| **Ideal state** | Unified J4 header + summary panel |
| **Do not show** | All three pages if one screenshot suffices |
| **Caption** | “CyberCrow evidence/GRC/risk — readiness mapping and review (not certification).” |

---

### 6. SAREA overview

| Field | Value |
|-------|-------|
| **Route** | `/sarea/overview` |
| **Purpose** | Experience Studio entry |
| **Ideal state** | Studio strip + profile summary |
| **Do not show** | “Autonomous UX AI” claims |
| **Caption** | “SAREA Experience Studio — ProCrow experience governance (RBAC controls access).” |

---

### 7. SAREA role mapping or preview

| Field | Value |
|-------|-------|
| **Route** | `/sarea/role-mapping` **or** `/sarea/preview` |
| **Purpose** | RBAC ↔ experience boundary |
| **Ideal state** | Mapping table or persona preview with tenant-backed/fallback note |
| **Do not show** | Misleading “live production CMS” |
| **Caption** | “SAREA role mapping / preview — persona and navigation adaptation (demo/staging).” |

---

### 8. Go/No-Go Center

| Field | Value |
|-------|-------|
| **Route** | `/admin/go-no-go` |
| **Purpose** | Deployment discipline and F23 gate |
| **Ideal state** | Demo readiness + F23 production decisions visible; gate grid |
| **Do not show** | Implied “deploy now” button |
| **Caption** | “Deployment go/no-go — advisory gates and F23 production deferral (no UI deploy).” |

---

### 9. Operator Console

| Field | Value |
|-------|-------|
| **Route** | `/admin/operator-console` |
| **Purpose** | Docs index + validation commands |
| **Ideal state** | Safety warnings + doc categories + command risk badges |
| **Do not show** | Fake “run all” execution UI |
| **Caption** | “Operator console — runbooks and npm verifiers (manual terminal execution only).” |

---

## Optional captures

| Route | When |
|-------|------|
| `/admin/tenants/[tenantId]` | Tenant control room story |
| `/[tenant]/cybercrow/security-events` | Security narrative extension |
| `/sarea/navigation` | Widget/navigation depth |
| `/client/onboarding` | Client bridge (I-track) |

---

## Post-capture

- Store under `docs/public/` or portfolio deck per team convention
- Redact PII and secrets
- Pair each image with **staging/demo** label in deck footnotes
- Cross-link [`J8_PROCROW_DEMO_REHEARSAL_PLAYBOOK.md`](J8_PROCROW_DEMO_REHEARSAL_PLAYBOOK.md) for talk track
