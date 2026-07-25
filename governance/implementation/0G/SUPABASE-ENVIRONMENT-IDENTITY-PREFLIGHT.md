# Supabase Environment Identity Preflight — GHV.IMPLEMENTATION.0G

| Field | Value |
|-------|-------|
| **Status** | COMPLETE |
| **Date** | 2026-07-25 |
| **Gate** | GHV.IMPLEMENTATION.0G |
| **Auth** | GHV-IMP-AUTH-007 |
| **Preferred model** | **A — dedicated non-production Supabase project** |

## Environments

| Purpose | Display name | Project-ref suffix | Region | Branch status | DB host fingerprint | Data classification | Prod / non-prod |
|---------|--------------|--------------------|--------|---------------|---------------------|---------------------|-----------------|
| Legacy CyberCrow / shared | `supabase-aureolin-bucket` | `…urms` (`wbwnsndcxrgyqwppurms`) | `eu-central-2` | Branching API unavailable / not used | `db.wbwnsndcxrgyqwppurms…` (IPv6) | Contains legacy Production-like application data | **PRODUCTION-LIKE — FORBIDDEN for GHURAVIA Preview** |
| **GHURAVIA Black Signal Preview** | `ghuravia-black-signal-preview` | `…xqpt` (`xmuawtodfuavwebxrqpt`) | `eu-central-2` | Dedicated project (not a data-clone branch) | Pooler `aws-1-eu-central-2.pooler.supabase.com` + ref in username | **demo_only / synthetic** | **NON-PRODUCTION** |

## Isolation proof summary

| Check | Result |
|-------|--------|
| Preview project-ref ≠ Production project-ref | **PASS** (`…xqpt` ≠ `…urms`) |
| Preview host / pooler username contains Preview ref | **PASS** |
| Forbidden fingerprint denylist includes Production ref | **PASS** (`wbwnsndcxrgyqwppurms`) |
| `--with-data` Preview branch | **NOT USED** |
| Certification database | **NOT MODIFIED** |
| Real customer data in Preview | **PROHIBITED / none seeded** |

## Migration target

- Authority: repository Drizzle SQL (`0000`–`0004`) via `scripts/preview/db-migrate-preview.mjs`
- Target: Preview project isolated `postgres` database (dedicated project; empty before migrate)
- Production project: **not selected**

## Secrets

No database passwords, API keys, full connection strings, or service-role keys are committed. Redacted fingerprints only.
