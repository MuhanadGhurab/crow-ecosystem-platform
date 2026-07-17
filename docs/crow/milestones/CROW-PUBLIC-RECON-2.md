# CROW.PUBLIC.RECON.2 — Public-Only Main Reconciliation Execution

| Field | Value |
|-------|-------|
| **Status** | Complete — branch prepared; PR not opened |
| **Owner decision** | Proceed with public-only reconciliation path (CROW.PM.1A follow-on) |
| **Date** | 2026-07-17 |
| **Source branch (docs)** | `feat/first-tenant-golden-path` @ `c803d3f` |
| **Reconciliation branch** | `reconcile/public-experience-from-ftgp` @ `3ebc2a9` |
| **Base** | `main` @ `a5620c3` |
| **Public visual source** | `c51a60e` (CROW.PUBLIC.9 accept) / Production `33e48f5` |
| **PR** | **Not opened** — awaiting owner authorization |
| **PR #10** | OPEN DRAFT — **not merged** |

## Constraints honored

- No PR #10 merge
- No Production deploy
- No `main` push
- No migrations / hosted business writes
- No product feature work beyond public reconciliation + build-safety mocks
- No GitHub PR created (stop for owner decision)

---

## 1. Repository verification (Phase A)

| Item | Value |
|------|-------|
| Path | `D:/CYBERCROW` |
| Starting branch | `feat/first-tenant-golden-path` |
| Starting HEAD | `c803d3f` |
| `main` | `a5620c3` — legacy public |
| Production | https://crow-ecosystem-platform.vercel.app · `dpl_QeDhnxzp9eowKNxAg5XmJW8vuhsz` · source `33e48f5` |
| GAP-004 | Open / blocked |
| GAP-012 | Open — mitigated by this recon branch (not closed until merge + verified Production from `main`) |
| Stashes | Pre-existing local stashes present; not used for this milestone |

---

## 2. Branch strategy chosen

**Option 1 (executed):** Create public-only branch from `main` and surgically apply safe public files from `c51a60e`.

Deploy-safety (`vercel.json` remove `db:migrate:deploy`) included **in the same branch** (combined PR-A+PR-B), because any future Production deploy from this line must not auto-migrate while GAP-004 is open.

**Not chosen:** Option 3 (defer) — safe set proven. Option 4 (full PR #10) — rejected.

---

## 3. §11 owner-decision defaults applied

| # | Decision | Applied |
|---|----------|---------|
| 1 | Proceed public-only | **Yes** |
| 2 | vercel migrate removal | **Combined** into recon branch |
| 3 | Login/signup C3 auth refresh | **Deferred** — main auth pages unchanged |
| 4 | `request/page.tsx` | **Included** with `routes.client.requestNew` URL stub |
| 5 | Middleware FTGP host gate | **Omitted** from `middleware.ts` (file present for label/tests; env-inactive) |
| 6 | route-protection C3 API paths | **Excluded** — public policy delegation only |
| 7 | GAP-004 timing | Reconcile UI now; **do not** Production-deploy from `main` until owner authorizes |
| 8 | Production promotion | **Not** authorized |

---

## 4. File classification summary

### Included (~100 files)

| Class | Contents |
|-------|----------|
| **A** | `(public)/*`, `public-site/*`, `public-v2/*`, `src/lib/public*`, `public-v2-bright.css`, start/preview/experience redirects |
| **B** | Root `layout.tsx`, `globals.css`, brand shell/loader/mark, route-progress, certification label |
| **C** | Public test scripts + `verify-public-v2-bundle-containment.ts` |
| **D** | `public-auth-paths.ts` (loader bypass only); `request/page.tsx` (session redirect uses existing `getSessionUser`) |
| **E** | `vercel.json` without `db:migrate:deploy` |
| **F surgical** | `route-protection.ts` → public-access-policy; `routes.ts` → `requestNew` + `public.start` only |
| **Build safety** | `src/lib/mock/{blueprint,discovery,meem-global}.ts` — pre-existing `main` typecheck debt (schema fields); required for build |
| **Env-inactive helper** | `src/lib/ftgp/ftgp-certification-host-gate.ts` — **not** wired into `middleware.ts` |

### Excluded (must-not-pick)

Prisma schema/migrations · DB clients · hosted-data scripts · C3 auth entry/login-signup behavior · middleware FTGP wiring · Request/Discovery/Blueprint/tenant/membership/payment/subscription/CroAI/CEM/CyberCrow authority/ProCrow runtime · full `routes.ts` / PR #10

---

## 5. vercel / migration safety

| Question | Decision |
|----------|----------|
| Remove `db:migrate:deploy` from Production build? | **Yes** — included |
| Safe as deploy-safety change? | **Yes** — matches live Production build command |
| Prove no migrate on build | `vercel.json` buildCommand = `… db:generate && npm run build` (no migrate) |
| GAP-004 interaction | Removing auto-migrate **reduces** bleed risk if `main` is ever deployed; isolation still required before broad FTGP merge |

---

## 6. Validation (on recon branch `3ebc2a9`)

| Gate | Result |
|------|--------|
| `git diff --check` | PASS |
| `npm run typecheck` | PASS (after mock field fix) |
| `npm run lint` | PASS |
| `npm run build` | PASS (local DB `127.0.0.1:5433` unreachable during SSG — non-blocking) |
| `public-access-policy:test` | PASS |
| `public-route-architecture:test` | PASS |
| `public-v2-preview-readiness:test` | PASS |

### Deltas

| Delta | Value |
|-------|-------|
| Hosted-state | **None** |
| Migrations | **None** |
| Runtime/domain | **None** (auth pages, middleware behavior, persistence unchanged) |

---

## 7. Residual risks

1. Login/signup on recon branch still use **legacy main** auth UI (not Production visual shell) — deferred PR-C.
2. `/client/requests/new` is a URL stub — page may 404 on `main` until FTGP; anonymous `/request` browse works.
3. `ftgp-certification-host-gate.ts` present but **not** in middleware — certification alias behavior differs from FTGP branch until later.
4. GAP-004 remains blocked — do not treat recon merge as license to run hosted migrations.
5. Production remains pinned on feature-branch deploy until owner authorizes promotion **after** Preview certification of this PR.

---

## 8. Owner decision required (next)

**Open a draft PR?**

Suggested:

- Base: `main`
- Head: `reconcile/public-experience-from-ftgp`
- Title: `feat(public): reconcile accepted Production public experience onto main`
- Do **not** merge until Preview smoke + owner acceptance
- Do **not** Production-deploy without separate authorization phrase

---

## 9. Recommended next milestone

After owner opens/reviews the public-only PR:

1. Preview certification smoke (`scripts/smoke-crow-public-prod.ts` against Preview)
2. Owner merge authorization for recon PR only
3. Then separate Production promotion decision
4. Parallel: CROW.PM.2 or CROW.REQUEST.1 per roadmap

---

## Final verdict

**READY — PUBLIC-ONLY RECONCILIATION BRANCH PREPARED FOR OWNER PR DECISION**
