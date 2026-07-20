# Vercel Pre-Push Verification

| Field | Value |
|-------|-------|
| **Date** | 2026-07-21 |
| **Gate ID** | GHV.REPOSITORY-TRANSITION.1B |
| **Status** | VERIFIED for first controlled push |
| **Owner** | Founder (RAVEN) |
| **Related** | [GATE-REGISTER.md](../../governance/gates/GATE-REGISTER.md) · [TECHNICAL-VALIDATION-REGISTER.md](../validation/TECHNICAL-VALIDATION-REGISTER.md) |

## GitHub repository

| Item | Value |
|------|-------|
| Repository | `MuhanadGhurab/crow-ecosystem-platform` |
| Visibility | Public |
| Default branch | `main` @ `f97a835` |
| Branch protection | Visible — required checks `verify`, `production-gate`, `postgres-smoke`; force-push disabled |
| Remote GHURAVIA branch before push | 404 Not Found (expected) |

## Vercel project identity

| Item | Value |
|------|-------|
| Project name | `crow-ecosystem-platform` |
| Project ID | `prj_lsHQMiMZskg8CzRVd4EHfiAo8o7h` |
| Team / organization | `team_JsNIQlTitYCs1yjig631FnF5` (`muhanadghurab's projects`) |
| Git repository | `MuhanadGhurab/crow-ecosystem-platform` |
| Production branch | **`main`** (confirmed via Vercel API `link.productionBranch`) |
| Framework preset | Next.js |
| Root directory | Repository root (API `rootDirectory: null` → `.`) |
| Node.js | 24.x |
| Install command | `npm ci` |
| Build command (project setting) | Legacy CyberCrow: `node scripts/vercel-build-guard.mjs && npm run db:generate && npm run db:migrate:deploy && npm run build` |
| Output directory | Next.js default |
| Production ignore-build command | `node scripts/safety/vercel-production-deploy-guard.mjs` |
| Deployment protection | SSO protection: `all_except_custom_domains`; git fork protection enabled |

**Note:** Project-level build settings still reference archived CyberCrow scripts. They must not run for `feat/ghuravia-foundation` because automatic deployment is disabled for that branch via root `vercel.json`.

## CLI and authentication

| Item | Value |
|------|-------|
| CLI method | Temporary `npx --yes vercel@latest` |
| CLI version | 56.4.0 |
| Existing CLI session | PRESENT (`vercel whoami` → `muhanadghurab`) |
| `VERCEL_TOKEN` name present | NO |
| Token values | Not displayed |
| `package.json` / lockfile created | NO |

## Historical Vercel Git integration

On archive commit `b1b1a6c`, GitHub check runs included Vercel app checks (`Vercel Agent Review`, `Vercel Preview Comments`) with conclusion `success`. Branch pushes historically triggered Vercel Preview activity.

## Environment-variable name matrix

Values are Encrypted / not displayed. Names only.

### Required names

| Variable | Production | Preview (generic) | Preview `feat/ghuravia-foundation` | Development |
|----------|------------|-------------------|--------------------------------------|-------------|
| `DATABASE_URL` | Present | Absent | Absent | Absent |
| `DIRECT_URL` | Present | Absent | Absent | Absent |

### Preview branch overrides observed (legacy CyberCrow)

| Branch scope | Notable names (not values) |
|--------------|----------------------------|
| `feat/first-tenant-golden-path` | `DATABASE_URL`, `DIRECT_URL`, `ALLOW_SHARED_DEMO_BACKEND`, `CROW_DATA_CLASSIFICATION`, `CROW_RUNTIME_MODE` |
| `feat/c3-account-registration-email-verification` | Multiple `C3_*`, `CROW_*`, fingerprints, email provider names |
| Preview (unscoped) | `BUSINESS_PORTAL_INVITE_FROM_EMAIL`, `GOOGLE_SSO_ENABLED` |

### Shared Production + Preview names (presence only)

`NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `AUTH_DISABLED`, `USE_MOCK_DATA`

### Production-only examples

`DATABASE_URL`, `DIRECT_URL`, `DATABASE_ENVIRONMENT`, `BACKEND_ISOLATION`, fingerprint variables, several `C3_*` / `CROW_*` flags

## Production / Preview isolation conclusion

```text
PARTIAL — Environment names inventoried; isolation requires later value-level professional verification
```

Rationale:

- `DATABASE_URL` / `DIRECT_URL` are Production-scoped and absent from generic Preview and from `feat/ghuravia-foundation` Preview — distinguishable for database connection names.
- Some sensitive-named variables appear in both Production and Preview scopes; values were not compared.
- Missing Preview database variables are **not** a blocker for a deployment-disabled governance push, but they **block** future Preview runtime validation (`GHV.ARCHITECTURE.1`).

## Branch deployment guard

| Item | Value |
|------|-------|
| File | `vercel.json` (repository root) |
| Configuration | `git.deploymentEnabled["feat/ghuravia-foundation"] = false` |
| `main` deployments | Not disabled by this file |
| Applicability | Root directory is repo root → root `vercel.json` is evaluated |
| JSON validation | Required before commit |

## Unresolved Preview database readiness

- Generic Preview: `DATABASE_URL` / `DIRECT_URL` **absent**
- GHURAVIA branch Preview overrides: **absent** (intentionally not added in this Gate)
- Future blocker for Preview technical validation gates

## First-push decision

```text
PROCEED — Push feat/ghuravia-foundation after local guard commit, expecting no Vercel Preview or Production deployment
```
