<p align="center">
  <strong>Crow Ecosystem Platform</strong><br/>
  <em>Where Organizations Become Intelligent.</em>
</p>

<p align="center">
  <a href="https://github.com/MuhanadGhurab"><img src="https://img.shields.io/badge/GitHub-MuhanadGhurab-181717?style=flat-square&logo=github" alt="GitHub" /></a>
  <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js" alt="Next.js 15" /></a>
  <a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" /></a>
  <a href="https://www.prisma.io"><img src="https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma" alt="Prisma" /></a>
  <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white" alt="Tailwind" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="MIT License" /></a>
</p>

---

**Crow Ecosystem Platform** is an adaptive **enterprise orchestration ecosystem** built around Discovery, Enterprise Blueprinting, **CEM**, **CyberCrow**, and **SAREA** — for organizations that need governed delivery from first request to live operations, not a module catalog dropped on day one.

Validated across multiple tenant scenarios on staging, including **logistics**, **construction**, and **aviation-style** onboarding paths (public-safe summary — see [`docs/public/ARCHITECTURE.md`](docs/public/ARCHITECTURE.md)).

**Portfolio / CV one-liner:**  
*Crow Ecosystem Platform — adaptive enterprise orchestration combining CEM operations, CyberCrow trust and evidence readiness, and SAREA role-based experience across a governed Discovery → Blueprint → tenant lifecycle.*

**Repository:** [`MuhanadGhurab/crow-ecosystem-platform`](https://github.com/MuhanadGhurab/crow-ecosystem-platform) · **Documentation:** [`docs/public/`](docs/public/) · **Demo guide:** [`docs/public/DEMO_GUIDE.md`](docs/public/DEMO_GUIDE.md) · **CV blurb:** [`docs/public/PORTFOLIO_BLURB.md`](docs/public/PORTFOLIO_BLURB.md)

---

## Platform engines

| Engine | Name | Role |
|--------|------|------|
| **CEM** | Crow Enterprise Manager | Operations — modules, workflows, tenant workspace |
| **CyberCrow** | Security & Trust Orchestration | Identity posture, audit, evidence readiness, advisory GRC mapping |
| **SAREA** | Smart Adaptive Role Experience Architecture | Persona-aware layouts, navigation, and widgets |

| Guide | Link |
|-------|------|
| Overview | [`docs/public/PLATFORM_ENGINES.md`](docs/public/PLATFORM_ENGINES.md) |
| CEM | [`docs/public/CEM.md`](docs/public/CEM.md) |
| CyberCrow | [`docs/public/CYBERCROW.md`](docs/public/CYBERCROW.md) |
| SAREA | [`docs/public/SAREA.md`](docs/public/SAREA.md) |

```text
RBAC controls access.  SAREA controls experience.
```

---

## Platform lifecycle

```text
Request  →  Discovery  →  Blueprint  →  Provision  →  Go-Live  →  Continuous Improvement
```

The **Blueprint** is the contract for what gets built — architecture intent, readiness, and engine configuration.

Details: [`docs/public/LIFECYCLE.md`](docs/public/LIFECYCLE.md)

---

## Architecture highlights

- **Multi-tenant architecture** — isolated workspaces under `/{tenant-slug}/…`
- **Blueprint-driven provisioning** — readiness before go-live
- **Adaptive RBUX** — RBAC for authorization; SAREA for experience
- **CyberCrow trust orchestration** — security visible on the tenant, not hidden in ops
- **PostgreSQL + Prisma** — structured organizational memory
- **Next.js + Tailwind** — public, admin, discovery, blueprint, portal, tenant surfaces
- **Supabase Auth + Microsoft Entra readiness** — enterprise SSO path

Conceptual architecture: [`docs/public/ARCHITECTURE.md`](docs/public/ARCHITECTURE.md)

---

## Visual showcase

| Surface | Preview |
|---------|---------|
| Homepage | [`homepage-hero.png`](docs/public/assets/screenshots/homepage-hero.png) |
| Architecture & pipeline | [`architecture.png`](docs/public/assets/screenshots/architecture.png) · [`ARCHITECTURE.md`](docs/public/ARCHITECTURE.md) |
| Sign-in · pricing · engines | [`screenshots README`](docs/public/assets/screenshots/README.md) (F13 gallery + F22 refresh targets) |

**Visual identity:** dark enterprise UI · cyan CEM · violet CyberCrow · rose SAREA · north-star motif.

![Crow Ecosystem homepage](docs/public/assets/screenshots/homepage-hero.png)

![Platform architecture](docs/public/assets/screenshots/architecture.png)

![CEM operator console](docs/public/assets/screenshots/admin-operator-console.png)

![Blueprint readiness](docs/public/assets/screenshots/blueprint-readiness.png)

---

## Tech stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router), React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | Supabase Auth · Microsoft Entra ID |
| Notifications | Resend (pipeline events, optional) |

---

## Current status

| | |
|--|--|
| **Stage** | Active development · portfolio-ready showcase · staging-validated reference |
| **Focus** | Public docs, demo guide, screenshot discipline — no production launch claim |
| **Cost** | No paid infrastructure activated; development continues without new cloud spend |
| **Cloud** | Production launch (F23) only when budget and client exist; public demo uses mock or local stack |

Public roadmap: [`docs/public/ROADMAP.md`](docs/public/ROADMAP.md)

---

## Philosophy

```text
Discovery understands.
Blueprint defines.
CEM runs.
CyberCrow protects.
SAREA adapts.
```

[`docs/public/PHILOSOPHY.md`](docs/public/PHILOSOPHY.md)

---

## Quick start (public-safe UI demo)

```bash
git clone https://github.com/MuhanadGhurab/crow-ecosystem-platform.git
cd crow-ecosystem-platform
cp .env.example .env
```

In `.env` for a **no-database** walkthrough:

```env
AUTH_DISABLED=true
USE_MOCK_DATA=true
```

```bash
npm install
npm run dev
```

Open `http://localhost:3000` · Optional demo path: `npm run demo:meem` (mock IDs only).

Full setup: [`docs/public/SETUP.md`](docs/public/SETUP.md) · [`.env.example`](.env.example)

---

## Documentation

| Audience | Path |
|----------|------|
| **Public** | [`docs/public/`](docs/public/) |
| **Contributing** | [`CONTRIBUTING.md`](CONTRIBUTING.md) |
| **Security** | [`SECURITY.md`](SECURITY.md) |

---

## Maintainer

**Muhanad Ghurab** — platform architect · SecDevOps · governed AI · multi-tenant enterprise systems

- GitHub: [@MuhanadGhurab](https://github.com/MuhanadGhurab)
- Questions or feedback: [open an issue](https://github.com/MuhanadGhurab/crow-ecosystem-platform/issues) or [start a discussion](https://github.com/MuhanadGhurab/crow-ecosystem-platform/discussions) on GitHub

---

## License

[MIT](LICENSE) — commercial deployments and terms are separate from this open-source presentation.

---

<p align="center">
  <strong>Crow Ecosystem Platform</strong><br/>
  <em>Where Organizations Become Intelligent.</em>
</p>
