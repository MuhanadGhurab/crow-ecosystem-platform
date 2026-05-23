# SecDevOps

How **security and delivery** are engineered in this repository — not as a checklist PDF, but as **product surfaces and pipeline discipline**.

**Author focus:** Muhanad Ghurab — cybersecurity-oriented platform engineering.

---

## Philosophy

```text
Security visible early  →  Trust orchestrated at provision  →  Audit by default  →  Cloud when earned
```

Most ERP projects bolt security on after go-live. Here, **CyberCrow** is a first-class engine from Discovery through tenant runtime.

---

## Identity & access

| Layer | Implementation |
|-------|----------------|
| Authentication | Supabase Auth |
| Enterprise SSO | Microsoft Entra ID (Azure AD) |
| Authorization | `crow_role`, tenant slugs, permission matrix |
| Client → tenant | Same Entra identity can promote from portal sponsor to tenant user |
| Auditor mode | Read-only CyberCrow + platform audit — no silent CEM writes |

**SecDevOps win:** One identity story end-to-end; RBAC enforced in middleware and route guards, not only in UI.

---

## CyberCrow — trust orchestration

CyberCrow is the **SecDevOps surface** on each tenant:

- Security posture dashboard
- Audit logs (tenant + platform admin)
- Security events stream
- Compliance / GRC narrative (NCA ECC framing)
- Identity provider visibility (`/cybercrow/identity`)

Pipeline initialization events (e.g. tenant CyberCrow seed) appear in platform audit — provable, not hand-waved.

See [`CYBERCROW.md`](CYBERCROW.md).

---

## Delivery security (DevOps)

| Control | Purpose |
|---------|---------|
| `.env` gitignored | No secrets in VCS |
| `vercel-build-guard.mjs` | Block localhost `DATABASE_URL` on cloud builds |
| Migrate baseline scripts | Safe Prisma deploy when DB started from `db push` |
| `AUTH_DISABLED` prod guard | Fail closed in production configs |
| `npm run typecheck` / `build` / CI | Regression gate before merge |
| Local-first E2E | Prove pipeline on Postgres before Azure spend |

**Principle:** *Earn the cloud* — infrastructure follows proven product truth.

---

## Pipeline audit trail

Lifecycle notifications are **always logged** to `platformNotification`:

- `request_received`
- `discovery_started`
- `blueprint_ready`
- `tenant_provisioned`

Optional email via Resend. Audit UI at `/admin/audit` — SecDevOps visibility for operators and auditor roles.

---

## NCA & compliance narrative

Public positioning: **NCA-aware ecosystem** — CyberCrow packages and console copy frame Saudi expectations.

**Honest scope:** Marketing does not claim certification. Control mapping and evidence depth live in CyberCrow surfaces, not homepage hype.

---

## What stays private

- Detailed provisioning service order
- Production Azure resource names
- Customer-specific security baselines
- Internal penetration test results

Public repo shows **patterns**; private ops hold **production truth**.

---

## Related

- [`AI_PLATFORM.md`](AI_PLATFORM.md) — AI within CyberCrow policy boundaries
- [`MULTI_TENANT.md`](MULTI_TENANT.md) — tenant isolation model
- [`../SECURITY.md`](../SECURITY.md) — responsible disclosure
