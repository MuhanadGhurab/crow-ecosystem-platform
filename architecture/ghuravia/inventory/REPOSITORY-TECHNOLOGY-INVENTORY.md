# Repository Technology Inventory

| Field | Value |
|-------|-------|
| **Document ID** | GHV-ARCH-1A-INV |
| **Version** | 0.1.0 |
| **Status** | **VALIDATION PLAN** |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.ARCHITECTURE.1A |
| **Last updated** | 2026-07-21 |
| **Limitations** | Inventory only · **NOT RUN** as technical validation · presence ≠ approval · CyberCrow inheritance **REJECTED** as automatic GHURAVIA stack |

```text
DISCOVERED ≠ APPROVED
INHERITED ≠ GHURAVIA CANDIDATE
NO STACK LOCK
```

## Purpose

Record what exists in the docs-first `feat/ghuravia-foundation` tree so later Gates can decide with evidence. Do **not** treat any inherited CyberCrow technology as approved for GHURAVIA.

## Status vocabulary

| Status | Meaning |
|--------|---------|
| DISCOVERED | Found in tree; no decision |
| INHERITED | Originated from CyberCrow / shared repo identity |
| GHURAVIA CANDIDATE | May be evaluated later with evidence |
| VALIDATION REQUIRED | Must be proven or rejected before use |
| REJECTED FOR GHURAVIA | Must not be assumed for launch architecture |
| DEFERRED | Explicitly postponed |

---

## A. Absent runtime (GHURAVIA Product Code)

| Name | Path | Status | Notes |
|------|------|--------|-------|
| Node package manifest | `package.json` | DISCOVERED (absent) | No Product Code root |
| Lockfiles | `pnpm-lock.yaml` / `package-lock.json` / `yarn.lock` / `bun.lock*` | DISCOVERED (absent) | No installable app graph |
| Monorepo tooling | `turbo.json` / `nx.json` | DISCOVERED (absent) | — |
| TypeScript / Next / Vite configs | `tsconfig*` / `next.config*` / `vite.config*` | DISCOVERED (absent) | — |
| Nest CLI | `nest-cli.json` | DISCOVERED (absent) | — |
| ORM / schema trees | `prisma/` / `drizzle/` | DISCOVERED (absent) | Schemas prohibited in 1A |
| App trees | `src/` / `apps/` / `packages/` | DISCOVERED (absent) | Docs-first foundation |
| Containers / IaC | `Dockerfile*` / `docker-compose*` / `terraform/` / `pulumi/` / `kubernetes/` / `helm/` | DISCOVERED (absent) | — |
| CI workflows | `.github/workflows/` | DISCOVERED (absent or empty) | VALIDATION REQUIRED before runtime CI |

**Decision implication:** GHURAVIA has **no** approved Node/Prisma/Next runtime in-repo. Stack selection is **DECISION PENDING** (1B).

---

## B. Deployment and platform identity (inherited)

| Name | Version evidence | Path | Current use | Origin | Lifecycle | Suitability question | Security / lock | Decision status |
|------|------------------|------|-------------|--------|-----------|----------------------|-----------------|-----------------|
| Vercel deploy guard | Committed JSON (no app version) | `vercel.json` | Disables automatic deploy for `feat/ghuravia-foundation` | INHERITED (repo platform) | Active governance control | Keep as safety control until intentional Preview enablement? | Misconfiguration could re-enable deploy | **INHERITED** · **VALIDATION REQUIRED** before any Preview runtime |
| Vercel project linkage | Local only | `.vercel/` | Project/org binding for CLI | INHERITED | Present | Is Vercel the future host, or only current identity? | Secrets must not enter git | **INHERITED** · **DEFERRED** (1B/1D) |
| Preview `DATABASE_URL` / `DIRECT_URL` | Absent (ops inventory) | env (not committed) | N/A | INHERITED gap | Absent | TECH-018 blocker for Preview runtime | DB access prohibited in 1A | **DISCOVERED** · **VALIDATION REQUIRED** · **DEFERRED** |

`vercel.json` content (governance only):

```json
"git.deploymentEnabled.feat/ghuravia-foundation": false
```

This is **not** an application architecture approval.

---

## C. Infrastructure stubs

| Name | Path | Current use | Origin | Lifecycle | Decision status |
|------|------|-------------|--------|-----------|-----------------|
| Environments stub | `infrastructure/environments/README.md` | Placeholder — notes GitHub/Vercel/DB identities unchanged | INHERITED stub | Dormant docs | **INHERITED** · **DEFERRED** |
| Security stub | `infrastructure/security/README.md` | Placeholder for infra security controls | INHERITED stub | Dormant docs | **INHERITED** · **VALIDATION REQUIRED** (1C/1D) |
| Observability stub | `infrastructure/observability/README.md` | Placeholder | INHERITED stub | Dormant docs | **INHERITED** · **DEFERRED** |
| Recovery stub | `infrastructure/recovery/README.md` | Placeholder | INHERITED stub | Dormant docs | **INHERITED** · **DEFERRED** |

No Terraform/K8s/Helm content found under these paths.

---

## D. Analytical (non-runtime) artifacts

| Name | Path | Current use | Origin | Lifecycle | Decision status |
|------|------|-------------|--------|-----------|-----------------|
| Progression simulation (stdlib Python) | `analysis/progression-simulation/` | Synthetic formula / integrity analysis | GHURAVIA Progression Gates | Active **analysis only** | **GHURAVIA CANDIDATE** (analysis) · **REJECTED FOR GHURAVIA** as Product runtime |
| Calibration / CSVs / summaries | same | Evidence for Progression Design lock | GHURAVIA | Analytical outputs | Same as above |

Markings already in package README: **NOT PRODUCT CODE** · **NOT APPROVED FOR PRODUCTION**.

---

## E. Documentation and governance trees

| Name | Path | Current use | Origin | Decision status |
|------|------|-------------|--------|-----------------|
| GHURAVIA architecture program | `architecture/ghuravia/` | This Gate's validation plan | GHURAVIA | **GHURAVIA CANDIDATE** (docs) |
| Product / Learning / Progression baselines | `product/` | Locked design baselines | GHURAVIA | Input baselines — not tech stack |
| Governance registers / gates | `governance/` | Decisions, risks, CRs, gates | GHURAVIA | Process authority |
| Ops / validation docs | `docs/operations/` · `docs/validation/` | Pre-push, TECH register | Mixed | **VALIDATION REQUIRED** items remain NOT RUN |
| Architecture docs placeholder | `docs/architecture/README.md` | Explicit “no stack selection” | Foundation | Superseded in role by `architecture/ghuravia/` |
| `docs/crow/` historical tree | *(not present in current working tree)* | Expected historical CyberCrow docs per transition narrative | INHERITED / archive | Treat archive tag `cybercrow-final-snapshot-20260720` as historical source · **REJECTED FOR GHURAVIA** as stack approval · **DEFERRED** for selective reference |

---

## F. Explicit non-approvals

| Claim | Status |
|-------|--------|
| Inherited CyberCrow Node/Next/Prisma stack (archive) | **REJECTED FOR GHURAVIA** as automatic selection |
| Vercel presence ⇒ chosen application platform | **REJECTED** assumption · **DECISION PENDING** 1B |
| Analysis Python ⇒ product backend language | **REJECTED FOR GHURAVIA** (runtime) |
| Stub infra READMEs ⇒ designed controls | **VALIDATION REQUIRED** · not implemented |

---

## G. Suitability summary for 1B

| Question | Inventory answer |
|----------|------------------|
| Is there an in-repo GHURAVIA app runtime? | **No** |
| What must stay until deliberate unlock? | Deploy guard · Product Code block · no DB access in planning Gates |
| What needs spikes? | Hosting, identity, storage, payments, email, realtime — see system context |
| What is safe to keep as-is? | Docs, governance, analytical scripts, deploy disablement |

## Change history

| Version | Date | Change |
|---------|------|--------|
| 0.1.0 | 2026-07-21 | Initial inventory under GHV.ARCHITECTURE.1A |
