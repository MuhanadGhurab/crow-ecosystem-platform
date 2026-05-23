<p align="center">
  <strong>Muhanad Ghurab</strong><br/>
  <em>SecDevOps · AI-assisted platforms · Multi-tenant enterprise systems</em>
</p>

<p align="center">
  <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js" alt="Next.js 15" /></a>
  <a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" /></a>
  <a href="https://www.prisma.io"><img src="https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma" alt="Prisma" /></a>
  <img src="https://img.shields.io/badge/SecDevOps-NCA%20%2B%20Entra-violet?style=flat-square" alt="SecDevOps" />
  <img src="https://img.shields.io/badge/AI-Governed%20extras-teal?style=flat-square" alt="AI" />
  <img src="https://img.shields.io/badge/Multi--tenant-PostgreSQL-blue?style=flat-square" alt="Multi-tenant" />
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="MIT License" /></a>
</p>

---

This repository is a **portfolio engineering workspace** for **Muhanad Ghurab** — focused on how security, DevOps discipline, and governed AI fit into real enterprise software.

**Primary story:** **SecDevOps + AI** — identity, audit, compliance narrative, CI/build guards, local-first cloud discipline, and **assistive AI scoped in Blueprint** (not hype-first).

**Implementation story:** **Crow Ecosystem** — a multi-tenant adaptive platform (CEM · CyberCrow · SAREA) that proves those practices in production-shaped code.

---

## 1. SecDevOps

Security and delivery are **orchestrated in the product**, not pasted on after launch.

| Practice | In this repo |
|----------|----------------|
| **Identity & SSO** | Supabase Auth + **Microsoft Entra ID** — one identity from client portal to tenant |
| **RBAC** | Platform + tenant roles, route guards, auditor read-only paths |
| **Trust layer (CyberCrow)** | Tenant security console, audit logs, GRC narrative, NCA-aware framing |
| **Pipeline audit** | Lifecycle events logged (`request_received` → `tenant_provisioned`) |
| **Build & deploy guards** | Vercel localhost DB block, migration baseline scripts, `AUTH_DISABLED` prod checks |
| **Truth before scale** | Local Postgres E2E before Azure — **earn the cloud** |
| **Responsible disclosure** | [`SECURITY.md`](SECURITY.md) |

Deep dive: [`docs/SECDEVOPS.md`](docs/SECDEVOPS.md)

```text
Shift-left security  +  visible trust  +  governed delivery  =  SecDevOps that ships
```

---

## 2. AI (governed, not bolted on)

AI is **optional commercial scope** captured in Discovery and priced in Blueprint — assistive, auditable, tenant-bound.

| Capability (examples) | Where it lives |
|------------------------|----------------|
| OCR document intelligence | Logistics / workflows |
| Route optimization | Dispatch & logistics hub |
| Anomaly detection | Security + operations pipeline |
| Demand forecast | Inventory signals |

**Rules in this codebase:**

- AI extras are **line items**, not implied in every base tier  
- Outputs stay **assistive** — human approval for financial, HR, compliance actions  
- AI features that touch sensitive data stay **inside CyberCrow policy and audit trails**  
- No shadow copilots bypassing tenant isolation  

Deep dive: [`docs/AI_PLATFORM.md`](docs/AI_PLATFORM.md)

---

## 3. Multi-tenant platform — Crow Ecosystem

The **reference implementation** of the above: a governed B2B platform from first request to live tenant.

| Engine | Role |
|--------|------|
| **CEM** | Operations — modules, workflows, tenant workspace |
| **CyberCrow** | SecDevOps surface — trust, audit, identity posture |
| **SAREA** | Adaptive UX — RBAC controls access, SAREA controls experience |

**Lifecycle (the product):**

```text
Request  →  Discovery  →  Blueprint  →  Proposal  →  Go-live  →  Operations
```

Each customer gets an isolated workspace under `/{tenant-slug}/…` on PostgreSQL + Prisma.

Deep dive: [`docs/MULTI_TENANT.md`](docs/MULTI_TENANT.md) · [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)

> **Golden rule:** Discovery understands → Blueprint defines → CEM runs → CyberCrow protects → SAREA adapts.

---

## Tech stack

| Layer | Technology |
|-------|------------|
| App | Next.js 15 · React 19 · TypeScript · Tailwind |
| Data | PostgreSQL · Prisma (multi-tenant schema) |
| Auth | Supabase Auth · Microsoft Entra ID |
| Notifications | Resend (pipeline events) |
| Target cloud | Azure (primary) · local-first until earned |

---

## Quick start (UI demo)

```bash
git clone https://github.com/YOUR_USER/cybercrow.git
cd cybercrow
cp .env.example .env
# AUTH_DISABLED=true  USE_MOCK_DATA=true
npm install
npm run dev
```

Demo: `npm run demo:meem` — multi-tenant logistics narrative (mock path).

Full stack: PostgreSQL + Supabase — [`.env.example`](.env.example).

---

## Documentation

| Doc | Topic |
|-----|--------|
| [`docs/SECDEVOPS.md`](docs/SECDEVOPS.md) | **SecDevOps practices & CyberCrow** |
| [`docs/AI_PLATFORM.md`](docs/AI_PLATFORM.md) | **Governed AI extras** |
| [`docs/MULTI_TENANT.md`](docs/MULTI_TENANT.md) | **Multi-tenant architecture** |
| [`docs/CYBERCROW.md`](docs/CYBERCROW.md) | CyberCrow trust engine |
| [`docs/LIFECYCLE.md`](docs/LIFECYCLE.md) | Delivery pipeline |
| [`docs/ROADMAP.md`](docs/ROADMAP.md) | Public roadmap |
| [`docs/PUBLIC_GITHUB.md`](docs/PUBLIC_GITHUB.md) | Publish vs private split |

---

## About

**Muhanad Ghurab** — IT specialist with a **cybersecurity focus**. Platform architect for Crow Ecosystem: SecDevOps narrative, Entra identity, multi-tenant delivery, and lighthouse enterprise demos.

Sensitive customer seeds, provisioning internals, and production runbooks stay **private by design**.

---

## License

[MIT](LICENSE)

---

<p align="center">
  <strong>SecDevOps · AI · Multi-tenant</strong><br/>
  <em>Crow Ecosystem — Where Organizations Become Intelligent.</em>
</p>
