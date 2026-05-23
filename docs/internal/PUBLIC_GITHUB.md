# Public GitHub publishing guide

**Purpose:** Split **public** ([`../public/`](../public/)) from **internal** ([`./`](.)) documentation.

---

## Structure

| Folder | Audience | Public repo |
|--------|----------|-------------|
| [`../public/`](../public/) | Portfolio, contributors, clients | **Include** |
| [`./`](.) | Founder, operators, delivery | **Exclude** |

---

## Include in public mirror

- [`../../README.md`](../../README.md)
- [`../public/`](../public/) — all public docs + screenshots
- [`../README.md`](../README.md)
- `src/`, `prisma/schema.prisma`, `.env.example`, LICENSE, CONTRIBUTING, SECURITY

---

## Exclude from public mirror

| Category | Examples |
|----------|----------|
| Internal docs | [`MASTER_CONTEXT.md`](MASTER_CONTEXT.md), [`PHASE_STATUS.md`](PHASE_STATUS.md), [`MEEM_E2E.md`](MEEM_E2E.md) |
| Customers | [`customers/MEEM_GLOBAL.md`](customers/MEEM_GLOBAL.md) |
| Commercial / ops | [`COMMERCIALS.md`](COMMERCIALS.md), [`GO_LIVE_OPERATIONS.md`](GO_LIVE_OPERATIONS.md) |
| Infra | [`AZURE_DEPLOY.md`](AZURE_DEPLOY.md), [`RESEND_SETUP.md`](RESEND_SETUP.md) |
| Archive | [`archive/`](archive/) |

---

## Pre-publish checklist

```bash
git status   # .env must not appear
rg -i "re_|sk_|service.role|password@" --glob "!node_modules" .
npm run typecheck && npm run build
```

---

## Mirror manifest

```bash
npm run public:mirror-manifest
```

---

## GitHub description

SecDevOps · governed AI · multi-tenant platform (Crow Ecosystem). Next.js 15, Prisma, PostgreSQL, Microsoft Entra.
