# Public GitHub publishing guide

**Purpose:** Split **public portfolio repository** from **private enterprise engineering** without leaking secrets, customer internals, or provisioning logic.

---

## Strategy: two repositories (recommended)

| Repository | Audience | Contents |
|------------|----------|----------|
| **Public** `crow-ecosystem-platform` | Portfolio, CV, investors, contributors | Vision, UI, public docs, MIT license, sanitized demos |
| **Private** `crow-ecosystem` (this full repo) | You, production, MEEM internals | Seeds, customer docs, provisioning services, env-specific runbooks |

Use this guide when creating or updating the **public mirror**.

---

## Public repository SHOULD include

- [`README.md`](../README.md) — hero, engines, lifecycle, stack, philosophy
- [`LICENSE`](../LICENSE) — MIT (or your chosen license)
- [`CONTRIBUTING.md`](../CONTRIBUTING.md) · [`SECURITY.md`](../SECURITY.md)
- [`.env.example`](../.env.example) — placeholders only
- Public docs:
  - [`SECDEVOPS.md`](SECDEVOPS.md) · [`AI_PLATFORM.md`](AI_PLATFORM.md) · [`MULTI_TENANT.md`](MULTI_TENANT.md)
  - [`ARCHITECTURE.md`](ARCHITECTURE.md)
  - [`PLATFORM_ENGINES.md`](PLATFORM_ENGINES.md)
  - [`LIFECYCLE.md`](LIFECYCLE.md)
  - [`CEM.md`](CEM.md) · [`CYBERCROW.md`](CYBERCROW.md) · [`SAREA.md`](SAREA.md)
  - [`ROADMAP.md`](ROADMAP.md)
  - [`PHILOSOPHY.md`](PHILOSOPHY.md)
- `src/` — application code (review for hardcoded secrets first)
- `public/` — static assets
- `prisma/schema.prisma` — schema (review for sensitive comments)
- `docs/assets/screenshots/` — marketing captures
- Selected scripts: dev, demo, typecheck, build (exclude internal smoke with real IDs)

---

## Public repository MUST NOT include

| Category | Examples | Why |
|----------|----------|-----|
| Secrets | `.env`, `.env.local`, API keys | Credential leak |
| Customer internals | `docs/customers/MEEM_GLOBAL.md` with live IDs | Enterprise confidentiality |
| Master context | `docs/CYBERCROW_MASTER_CONTEXT.md` | CEO script + personal strategy |
| Provisioning deep dives | `GO_LIVE_PIPELINE.md`, `pipeline.service` comments with ops order | Attack surface |
| Production runbooks | `AZURE_DEPLOY.md` with real resource names | Infra exposure |
| Real IDs in docs | `cmpge193x…`, real Supabase project refs | Fingerprinting |
| Resend / Stripe setup with real keys | `RESEND_SETUP.md` if contains your inbox | Privacy |
| Archive noise | `archive/HTML_proc/`, `archive/ms-identity-node-main/` | Portfolio clutter (optional trim) |

---

## Pre-publish checklist

```bash
# 1. Confirm .env never tracked
git status   # .env must not appear

# 2. Search for secrets
rg -i "re_|sk_|service.role|password@" --glob "!node_modules" .

# 3. Search for real project refs (replace before public push)
rg "qnujbwfztmrmsvkugvot|cmpge193|mkkaweg4mer" .

# 4. Verify builds
npm run typecheck && npm run build

# 5. Demo mode safe for strangers
# AUTH_DISABLED=true USE_MOCK_DATA=true in public README quick start
```

---

## Sanitization rules

1. **Replace live MEEM IDs** with `mock-req-meem`, `mock-bp-meem`, `meem-global` in all public docs.
2. **Remove email overrides** — no personal Gmail in public `.env.example` comments.
3. **Generic Supabase** — `[PROJECT_REF]` placeholders only.
4. **Pricing** — keep illustrative SAR bands; remove customer-specific negotiation notes.
5. **Founder section** — professional title OK; personal vision doc stays private.

---

## GitHub presentation settings

| Setting | Recommendation |
|---------|----------------|
| Description | SecDevOps · governed AI · multi-tenant enterprise platform (Next.js, Prisma, Entra). |
| Topics | `secdevops` `devsecops` `cybersecurity` `multi-tenant` `nextjs` `typescript` `prisma` `artificial-intelligence` `microsoft-entra-id` `postgresql` |
| Website | Demo URL when live (optional) |
| License | MIT |
| Visibility | **Public** |

Suggested description (from [`GITHUB_SETUP.md`](GITHUB_SETUP.md)):

> SecDevOps · governed AI · multi-tenant platform — Crow Ecosystem (CEM, CyberCrow, SAREA). Next.js 15, Prisma, PostgreSQL, Microsoft Entra.

---

## Creating the public mirror (manual)

```powershell
# Example: export subset to new folder (adjust paths)
mkdir ..\crow-ecosystem-public
robocopy D:\CYBERCROW ..\crow-ecosystem-public /E /XD node_modules .next .git archive docs\customers docs\archive
# Then delete excluded files from mirror per table above
cd ..\crow-ecosystem-public
git init && git add . && git commit -m "Initial public portfolio release"
gh repo create crow-ecosystem-platform --public --source=. --push
```

Or use [`scripts/prepare-public-mirror.mjs`](../scripts/prepare-public-mirror.mjs) for a file list.

---

## What visitors should understand in 30 seconds

```text
SecDevOps + governed AI in practice.
Multi-tenant enterprise platform as the proof.
Crow Ecosystem — Where Organizations Become Intelligent.
```

Security and delivery first. Multi-tenant platform second. Cloud when earned.

---

## Maintainer

**Muhanad Ghurab** — rotate any key that was ever committed before first public push.
