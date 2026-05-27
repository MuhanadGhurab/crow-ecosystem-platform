# I8 — Client portal demo playbook (~10 minutes)

**Audience:** Internal demo, portfolio walkthrough, client-journey rehearsal.  
**Mode:** Staging / mock — **no production**, **no paid infra**, **no live payments**, **no e-sign**, **no auto tenant provisioning**.

**Demo identity:** `client.demo@alnoor.test` (mock portal user)  
**Lighthouse request:** `mock-req-003` · **Proposal / blueprint:** `mock-bp-001`

Use this script in order. Say “staging / mock” explicitly at the start.

---

## 1) Sign in — `/login`

| | |
|---|---|
| **Route** | `/login` → Client Portal |
| **Talk track** | Client Portal is for **authenticated** buyers after intake — separate from the public token link. |
| **Proof point** | Sign in as demo client; land on `/client`. |
| **Do not claim** | SSO production, Entra mandatory, customer self-serve billing. |
| **Fallback** | If auth disabled locally, note layout still renders under mock session rules. |

---

## 2) Client home — `/client`

| | |
|---|---|
| **Route** | `/client` |
| **Talk track** | Dashboard shows linked requests, proposals, onboarding snapshot, and **honest staging** trust strip. |
| **Proof point** | Stat cards, next actions, onboarding tile, trust strip (approval on linked proposal only). |
| **Do not claim** | Production go-live, payments, legal signature, compliance certification. |
| **Fallback** | Walk nav only: Requests → Proposals → Onboarding. |

---

## 3) Profile — `/client/profile`

| | |
|---|---|
| **Route** | `/client/profile` |
| **Talk track** | Account identity and completeness — **not** where scope approval happens. |
| **Proof point** | Linking status, completeness meter, security note (approval on proposal when verified). |
| **Do not claim** | Profile edit unlocks production tenant. |
| **Fallback** | Read linking status card only. |

---

## 4) Company — `/client/company`

| | |
|---|---|
| **Route** | `/client/company` |
| **Talk track** | Organization context derived from linked request — read-only in this MVP. |
| **Proof point** | Company completeness, modules list, next actions to requests/proposals/onboarding. |
| **Do not claim** | Multi-org membership, CRM sync, verified legal entity registry. |
| **Fallback** | Show empty-state path if unlinked user. |

---

## 5) Requests — `/client/requests` → detail

| | |
|---|---|
| **Routes** | `/client/requests` → `/client/requests/mock-req-003` |
| **Talk track** | Request timeline + review materials; proposal link when ready. |
| **Proof point** | Status badge, review card, onboarding summary, “how approval works” guide (not an action here). |
| **Do not claim** | Client can approve from request page. |
| **Fallback** | List view only if detail 404. |

---

## 6) Proposals — `/client/proposals` → detail

| | |
|---|---|
| **Routes** | `/client/proposals` → `/client/proposals/mock-bp-001` |
| **Talk track** | **Only here** (authenticated + ownership) can the client record **scope approval** for staging. |
| **Proof point** | `ClientProposalApprovalPanel`, commercial summary, onboarding summary after approve. |
| **Do not claim** | Legally binding signature, payment capture, instant tenant activation. |
| **Fallback** | Show panel read-only if already approved in mock data. |

---

## 7) Blueprint — `/client/blueprints/mock-bp-001`

| | |
|---|---|
| **Route** | `/client/blueprints/mock-bp-001` |
| **Talk track** | Blueprint readiness view mirrors operator packaging — client sees modules, security add-ons, next step to proposal. |
| **Proof point** | Readiness label, module list, link to proposal / onboarding. |
| **Do not claim** | Blueprint deploys infrastructure automatically. |
| **Fallback** | Skip if blueprint id differs in env — use proposal page modules list. |

---

## 8) Onboarding tracker — `/client/onboarding`

| | |
|---|---|
| **Route** | `/client/onboarding` |
| **Talk track** | **Derived** readiness steps after approval — ProCrow still owns provisioning; no auto-tenant. |
| **Proof point** | 12-step tracker, production-gated note, request picker when multiple links. |
| **Do not claim** | Tracker provisions tenant or activates billing. |
| **Fallback** | Show empty state → submit request CTA. |

---

## 9) Public token page (non-authoritative) — `/proposal/[token]`

| | |
|---|---|
| **Route** | `/proposal/<demo-token>` (from blueprint mock if needed) |
| **Talk track** | Email link is **informational** — sign in to Client Portal to approve scope. |
| **Proof point** | `ProposalTokenApprovalNotice` only — **no** approve/decline buttons on public page. |
| **Do not claim** | Token URL is sufficient for legal approval or payment. |
| **Fallback** | Describe I6 design doc if token not handy. |

---

## 10) ProCrow operator handoff (optional) — `/admin/requests/[requestId]`

| | |
|---|---|
| **Route** | `/admin/requests/mock-req-003` (operator session) |
| **Talk track** | After client scope approval, status syncs for operator review — still **no** auto-provision. |
| **Proof point** | Admin onboarding readiness panel + request status. |
| **Do not claim** | Admin click deploys production. |
| **Fallback** | Verbal handoff only. |

---

## Close (30 seconds)

- Reiterate: **staging portfolio**, mock-backed client journey.  
- Scope approval = **authenticated proposal** + ownership check.  
- `/proposal/[token]` = **read-only** + sign-in guidance.  
- Next engineering phases: organization membership model, deprecate `approveProposalByToken`, deeper ProCrow automation (all gated).

**Verification before demo:** `npm run client-demo:verify` and full I8 validation suite in [`I8_CLIENT_PORTAL_POLISH_DEMO_REHEARSAL.md`](I8_CLIENT_PORTAL_POLISH_DEMO_REHEARSAL.md).
