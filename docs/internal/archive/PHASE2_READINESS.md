# Phase 2+ readiness

Phase 1 pipeline is complete. Before auth, billing, or public exposure, confirm:

## Health checks (run locally)

```powershell
cd d:\CYBERCROW
npx prisma generate
npm run typecheck
npm run lint
npm run build
npm run dev
```

## Phase 1 smoke test

See [PHASE1_PIPELINE.md](./PHASE1_PIPELINE.md) — full flow from `/request` through tenant dashboard.

## Known gaps (intentional)

| Area | Status |
|------|--------|
| Authentication / RBAC | **Phase 2** — Supabase Auth + `app_metadata` roles ([PHASE2_AUTH.md](./PHASE2_AUTH.md)) |
| Route protection (`/admin`, `/discovery`, `/[tenant]`) | Middleware + layout guards |
| Discovery sub-pages (departments, roles, …) | Placeholders |
| CEM / CyberCrow module UIs | Placeholders |
| Stripe / billing | Not implemented |
| Prisma migrations | Using `db push`; add `prisma migrate` for production |
| Email notifications | Not implemented |

## Phase 2 (done)

See [PHASE2_AUTH.md](./PHASE2_AUTH.md) for setup, bootstrap admin, and smoke tests.

## Phase 3 (done)

See [PHASE3.md](./PHASE3.md) — admin hubs, tenant services, workspace polish, action auth guards.

## Recommended Phase 4 order

1. **TenantMembership** Prisma model + Supabase user sync on provision
2. CEM module UIs with tenant-scoped data
3. Optional: RLS on Supabase if using Data API later
4. Billing (Stripe) / email notifications

## Code layout (Phase 1)

| Layer | Path |
|-------|------|
| Pure helpers | `src/lib/discovery-answers.ts`, `src/lib/catalog-labels.ts`, `src/lib/slugify.ts` |
| DB services | `src/lib/services/*.service.ts` |
| Server actions | `src/lib/actions/*.ts` |
| UI | `src/components/admin`, `discovery`, `blueprint` |

No invalid `motion` JSX tags remain — use standard `div` / semantic HTML only.
