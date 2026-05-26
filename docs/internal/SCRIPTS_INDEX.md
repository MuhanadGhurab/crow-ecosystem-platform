# Scripts Index

High-value scripts used during development, validation, and staging-safe operations.

Risk levels:
- **Low**: read-only validation or local dev
- **Medium**: environment checks/manifests, no data mutation expected
- **High**: potential write/seed/migration path (not part of docs-only phases)

---

## Core dev/build

| Script | Purpose | When to run | Environment | Writes? | Risk |
|---|---|---|---|---|---|
| `npm run dev` | Start local dev server | active development | local | no | Low |
| `npm run typecheck` | TypeScript compile checks | before push | local/staging-safe | no | Low |
| `npm run lint` | Lint checks | before push | local/staging-safe | no | Low |
| `npm run build` | Production build validation | before push/deploy | local/staging-safe | no | Low |

---

## Public boundary

| Script | Purpose | When to run | Environment | Writes? | Risk |
|---|---|---|---|---|---|
| `npm run public:mirror-manifest` | Generate public mirror include manifest | docs/public changes, release checks | local | writes manifest file | Medium |

---

## Mock/demo integrity

| Script | Purpose | When to run | Environment | Writes? | Risk |
|---|---|---|---|---|---|
| `npm run mock:verify` | Validate mock files/imports/chain integrity | any mock-related change | local/staging-safe | no | Low |

---

## Staging confidence

| Script | Purpose | When to run | Environment | Writes? | Risk |
|---|---|---|---|---|---|
| `npm run simulate:vercel-build:staging` | Simulate Vercel-like staging build flow | pre-release confidence | staging env vars | no (migration deploy read-only if no pending) | Medium |
| `npm run meem:ids:staging` | Print MEEM staging IDs and references | staging validation | staging | no | Low |
| `npm run tenant:verify:rimal` | Validate Rimal tenant integrity | staging validation | staging | no | Low |
| `npm run request:pipeline:verify` | Verify request->discovery->blueprint pipeline | staging validation | staging | no | Low |
| `npm run request:e2e:dry` | Dry-run organic request checks (template/model consistency) | routine validation | local | no | Low |

---

## Notifications and onboarding (selected)

| Script | Purpose | When to run | Environment | Writes? | Risk |
|---|---|---|---|---|---|
| `npm run notifications:check` | Basic notification health check | notification debugging | env-dependent | no | Low |
| `npm run notifications:digest:dry` | Dry-run digest generation | digest verification | staging-safe | no send by default | Low |
| `npm run onboard:tenant` | Onboard tenant from blueprint flow | controlled operator action | staging/ops | yes | High |

---

## Important notes

- Docs-only phases should avoid high-risk write scripts.
- Always run the validation baseline before push:
  - `mock:verify`
  - `typecheck`
  - `lint`
  - `build`
  - `public:mirror-manifest`
