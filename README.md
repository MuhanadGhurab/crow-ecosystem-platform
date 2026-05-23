<p align="center">
  <strong>Crow Ecosystem Platform</strong><br/>
  <em>Where Organizations Become Intelligent.</em>
</p>

<p align="center">
  <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js" alt="Next.js 15" /></a>
  <a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" /></a>
  <a href="https://www.prisma.io"><img src="https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma" alt="Prisma" /></a>
  <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white" alt="Tailwind" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="MIT License" /></a>
</p>

---

**Crow Ecosystem** is an adaptive **enterprise orchestration platform** for organizations that need governed delivery — not another module catalog dropped on day one.

Organizations are understood through **Discovery**, defined in a **Blueprint** (architecture + commercial contract), then provisioned as a live multi-tenant workspace with three engines: **CEM**, **CyberCrow**, and **SAREA**.

> Documentation: **[public architecture & guides](docs/public/)** · Internal operator docs stay in [`docs/internal/`](docs/internal/) (not required for contributors exploring the platform story).

---

## Ecosystem overview

| Engine | Role | Guide |
|--------|------|-------|
| **CEM** | Crow Enterprise Manager — operations, modules, workflows | [`docs/public/CEM.md`](docs/public/CEM.md) |
| **CyberCrow** | Trust orchestration — security, audit, identity posture | [`docs/public/CYBERCROW.md`](docs/public/CYBERCROW.md) |
| **SAREA** | Adaptive experience — persona layouts & navigation | [`docs/public/SAREA.md`](docs/public/SAREA.md) |

Full overview: [`docs/public/PLATFORM_ENGINES.md`](docs/public/PLATFORM_ENGINES.md)

```text
RBAC controls access.  SAREA controls experience.
```

---

## Platform lifecycle

The pipeline is the product:

```text
Request  →  Discovery  →  Blueprint  →  Provision  →  Go-Live  →  Operations
```

The **Blueprint is the contract** for what gets built — architecture, pricing intent, readiness, and engine configuration.

Details: [`docs/public/LIFECYCLE.md`](docs/public/LIFECYCLE.md)

---

## Architecture highlights

- **Multi-tenant** workspaces under `/{tenant-slug}/…`
- **Adaptive RBUX** — authorization vs experience, deliberately separated
- **CyberCrow trust orchestration** — visible security, not bolt-on ops
- **Blueprint-driven provisioning** — readiness before go-live
- **PostgreSQL + Prisma** — structured organizational memory
- **Next.js 15 + Tailwind** — public, admin, discovery, blueprint, portal, tenant surfaces

Conceptual architecture: [`docs/public/ARCHITECTURE.md`](docs/public/ARCHITECTURE.md)

Also: [`SecDevOps`](docs/public/SECDEVOPS.md) · [`Governed AI`](docs/public/AI_PLATFORM.md) · [`Multi-tenant model`](docs/public/MULTI_TENANT.md)

---

## Visual showcase

| Surface | Preview |
|---------|---------|
| Homepage & public marketing | [`docs/public/assets/screenshots/README.md`](docs/public/assets/screenshots/README.md) |
| Pipeline & blueprint | Add captures to `docs/public/assets/screenshots/` |
| Tenant dashboard | CEM + SAREA runtime |
| CyberCrow console | Trust & audit narrative |

Visual identity: dark enterprise UI · cyan CEM · violet CyberCrow · rose SAREA · north-star motif.

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
| Notifications | Resend (pipeline events) |

---

## Public roadmap

Strategic direction — no internal completion metrics:

- Discovery Engine evolution
- Blueprint provisioning maturity
- CyberCrow trust orchestration
- SAREA adaptive UX
- Azure production readiness

Full public roadmap: [`docs/public/ROADMAP.md`](docs/public/ROADMAP.md)

---

## Philosophy

```text
Discovery understands.
Blueprint defines.
CEM runs.
CyberCrow protects.
SAREA adapts.
```

Expanded: [`docs/public/PHILOSOPHY.md`](docs/public/PHILOSOPHY.md)

---

## Quick start (UI demo)

```bash
git clone https://github.com/MuhanadGhurab/crow-ecosystem-platform.git
cd crow-ecosystem-platform
cp .env.example .env
# AUTH_DISABLED=true  USE_MOCK_DATA=true
npm install
npm run dev
```

Open `http://localhost:3000` · Demo: `npm run demo:meem`

---

## Documentation map

| Audience | Path |
|----------|------|
| **Public** (GitHub, contributors, clients) | [`docs/public/`](docs/public/) |
| **Internal** (operators, founder — not for public mirror) | [`docs/internal/`](docs/internal/) |

| Doc | Topic |
|-----|--------|
| [`CONTRIBUTING.md`](CONTRIBUTING.md) | How to contribute |
| [`SECURITY.md`](SECURITY.md) | Responsible disclosure |

---

## Founder

**Muhanad Ghurab** — platform architect. SecDevOps · governed AI · multi-tenant enterprise systems.

---

## License

[MIT](LICENSE)

---

<p align="center">
  <strong>Crow Ecosystem Platform</strong><br/>
  <em>Where Organizations Become Intelligent.</em>
</p>
