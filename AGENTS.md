# AGENTS.md

## Cursor Cloud specific instructions

Crow Ecosystem Platform is a single **Next.js 15 (App Router) + React 19** web app (TypeScript, Tailwind, Prisma/PostgreSQL, Supabase Auth). There is one service: the Next.js server. For local development it can run in a **mock / no-database mode**, which is how the Cloud environment is set up.

### Node version (important gotcha)
- The repo requires **Node 24.x** (`.nvmrc`, `package.json#engines`). The `dev` and `start` scripts invoke `node --use-system-ca`, a flag that only exists on Node **22.15+/24**; the VM's default `/exec-daemon/node` is v22.14.0 and will fail with `bad option: --use-system-ca`.
- Node 24 is installed via `nvm` and set as the nvm default. `~/.bashrc` prepends the Node 24 bin so **login/interactive shells resolve Node 24**. Non-login `bash -c` calls still resolve the system Node 22 (fine for `npm install`, `lint`, `typecheck`, but NOT for `npm run dev`/`start`).
- Therefore **run the dev server in a login shell** (e.g. a `tmux ... new-session ... bash -l` session, as the tooling does by default). If you ever see `bad option: --use-system-ca`, you are on Node 22 — start a login shell or run `source ~/.nvm/nvm.sh && nvm use 24` first.

### Environment / mode
- `.env` is created from `.env.example` with `AUTH_DISABLED=true` and `USE_MOCK_DATA=true` appended (mock, no Postgres/Supabase needed). `.env` is gitignored.
- In this mode `requireAuth()` returns a dev platform-admin bypass user (`src/lib/auth/session.ts`), so authenticated surfaces (e.g. `/admin/requests`) render with mock data. `getSessionUser()` returns `null`, so public pages show their signed-out state.
- Some routes need a real DB/tenant and will 404/500/redirect in mock mode (e.g. `/client` 500, `/discovery` 404 without a request id). This is expected; use the mock-backed surfaces below.

### Run / verify (standard scripts, see `package.json`)
- Dev server: `npm run dev` → http://localhost:3000 (must be a login shell — see Node note). `predev` runs `scripts/free-port.mjs`, which kills anything already on port 3000.
- Lint: `npm run lint`. Typecheck: `npm run typecheck`. Build (prod): `npm run build`.
- Many `*:verify` scripts (see `package.json`) are `tsx` doc/architecture checks; ones with `--env-file=.env.staging` need staging DB credentials not present in mock mode.

### Good mock-mode surfaces to exercise
- Public: `/`, `/start`, `/request`, `/new-organization`, `/transform-existing`, `/login`, `/signup`, `/access`.
- Operator console (dev bypass + mock data): `/admin/requests` → open a request e.g. `/admin/requests/mock-req-001`.

### Full stack (optional, not set up here)
Set real `DATABASE_URL`/`DIRECT_URL` + Supabase keys, then `npm run db:push` and `npm run db:seed`, and set `AUTH_DISABLED=false` / `USE_MOCK_DATA=false`. See `docs/public/SETUP.md`.
