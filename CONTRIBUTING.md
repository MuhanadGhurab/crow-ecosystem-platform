# Contributing to Crow Ecosystem Platform

Thank you for your interest in this repository. It showcases **SecDevOps**, **governed AI**, and a **multi-tenant enterprise platform** (Crow Ecosystem) — public architecture and UI suitable for portfolio and contributors.

## Before you start

1. Read [`docs/PUBLIC_GITHUB.md`](docs/PUBLIC_GITHUB.md) — understand what is intentionally public vs private.
2. Read [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) and [`docs/LIFECYCLE.md`](docs/LIFECYCLE.md) — the pipeline is the product.
3. Never commit secrets, `.env`, real tenant IDs, or customer-specific data.

## Development setup

```bash
cp .env.example .env
npm install
npm run dev
```

**UI-only (no Postgres):** set `AUTH_DISABLED=true` and `USE_MOCK_DATA=true` in `.env`.

**Full stack:** configure `DATABASE_URL` and Supabase keys per `.env.example`, then `npm run db:push` and `npm run db:seed`.

## Quality bar

```bash
npm run typecheck
npm run lint
npm run build
```

## What we welcome

- Documentation clarity (public-safe only)
- UI polish on public, discovery, blueprint, and tenant shells
- Accessibility and responsive fixes
- Diagrams and screenshots in `docs/assets/screenshots/`
- Bug fixes that do not expose provisioning or security internals

## What stays private

Do not open PRs that add:

- Production credentials or real customer seeds
- Detailed provisioning service internals intended for private ops
- Unsanitized MEEM or enterprise customer identifiers in public docs

## Pull request guidelines

1. One focused change per PR
2. Describe *why* — especially lifecycle or engine boundaries (CEM / CyberCrow / SAREA)
3. Include screenshots for UI changes when possible
4. Ensure `npm run typecheck` and `npm run build` pass

## Code of conduct

Be professional and respectful. This is an enterprise platform initiative — clarity and honesty over hype.

## Questions

Open a GitHub Discussion or Issue for architecture questions. For security concerns, see [`SECURITY.md`](SECURITY.md).
