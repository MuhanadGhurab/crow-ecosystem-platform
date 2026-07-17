# Crow Cloud Feature Enablement Matrix

**Phase:** CLOUD.0  
**Branch:** `feat/first-tenant-golden-path`  
**Legend:** `ENABLE_NOW` | `ENABLE_AFTER_STAGING` | `ENABLE_FOR_FIRST_TENANT` | `DEFER_UNTIL_SCALE` | `BLOCKED_BY_EXTERNAL_PROVIDER`

---

## Database

| Feature | Recommendation | Business purpose | Security | Cost | Prerequisite | Environment |
|---------|----------------|------------------|----------|------|--------------|-------------|
| Automatic backups | **ENABLE_NOW** (verify) | Recovery before any shared-DB migration | Critical for rollback | Included in Pro | Pro plan | Production |
| PITR | **ENABLE_AFTER_STAGING** | Fine-grained recovery for authority migration | Reduces blast radius of bad DDL | **Paid add-on** — not covered by Spend Cap | Operator budget approval; backup verified | Production first |
| Core Postgres extensions | **ENABLE_NOW** (current set) | UUID, crypto, stats | Minimal surface if unused extensions stay off | Low | None | All |
| `pg_cron` | **DEFER_UNTIL_SCALE** | Scheduled jobs (retention, cleanup) | Job injection if misconfigured | Compute time | Staging validation | Staging → Prod |
| Connection pooling | **ENABLE_NOW** | Serverless Vercel ↔ Postgres | Pooler credentials scoped per env | Included | Per-env pooler URL | All |
| RLS on public tables | **ENABLE_AFTER_STAGING** | Defense-in-depth vs PostgREST exposure | **97 tables without RLS today (ERROR)** | Low | Policy design; app uses service role | Staging test → Prod |
| Vault (`supabase_vault`) | **DEFER_UNTIL_SCALE** | Secret storage in DB | Prefer Vercel/env secrets first | Low | Key management policy | Production |
| Database Webhooks | **DEFER_UNTIL_SCALE** | Event-driven integrations | SSRF / secret leakage if misconfigured | Invocations + egress | Isolated staging | Staging |
| Read replicas | **DEFER_UNTIL_SCALE** | Read scaling | Replication lag awareness | **Billable** | Traffic metrics | Production |
| Analytics replication | **DEFER_UNTIL_SCALE** | BI / reporting | Data copy governance | Billable | Warehouse target | Production |

---

## Auth

| Feature | Recommendation | Business purpose | Security | Cost | Prerequisite | Environment |
|---------|----------------|------------------|----------|------|--------------|-------------|
| Email/password | **ENABLE_NOW** | C3 account registration | Rate limits + CAPTCHA needed at scale | MAU included in Pro | Custom SMTP for prod scale | All (isolated pools) |
| Google OAuth | **ENABLE_AFTER_STAGING** | Enterprise SSO path | Redirect URI per environment | MAU | Separate OAuth clients per env | Staging → Prod |
| Magic links | **DEFER_UNTIL_SCALE** | Passwordless | Phishing / redirect risks | Email volume | SMTP | Staging |
| Custom SMTP (Resend) | **ENABLE_AFTER_STAGING** | Production email verification | Sender domain reputation | Resend + Supabase | Domain verification | Staging → Prod |
| Password recovery | **ENABLE_NOW** | C3 flow exists | Audit events in place | Email sends | SMTP configured | Staging → Prod |
| Leaked password protection | **ENABLE_AFTER_STAGING** | HIBP check | **Currently disabled (WARN)** | Auth add-on tier | Dashboard toggle | Staging → Prod |
| MFA | **ENABLE_FOR_FIRST_TENANT** | Operator / tenant admin hardening | TOTP required for platform admins | MAU | Auth UX | Staging → Prod |
| CAPTCHA | **ENABLE_AFTER_STAGING** | Bot registration defense | Reduces credential stuffing | Provider fees | hCaptcha/Turnstile keys | Preview/Staging |
| Auth rate limits | **ENABLE_AFTER_STAGING** | Abuse prevention | Default limits may be insufficient | Included | Tuned per env | All |
| Session timeouts | **ENABLE_AFTER_STAGING** | Session hijack mitigation | Balance UX vs security | None | Policy decision | Staging → Prod |
| Phone / SMS | **BLOCKED_BY_EXTERNAL_PROVIDER** | Optional C3 phone verification | SMS fraud cost | Twilio/etc. | Provider contract | N/A until provider |
| Auth hooks | **DEFER_UNTIL_SCALE** | Custom JWT claims / audit | Hook compromise = auth bypass | Edge invocations | Isolated staging | Staging |

---

## Storage

| Feature | Recommendation | Business purpose | Security | Cost | Prerequisite | Environment |
|---------|----------------|------------------|----------|------|--------------|-------------|
| Private request-attachment bucket | **ENABLE_FOR_FIRST_TENANT** | Implementation request files | RLS + signed URLs mandatory | Storage + egress | Bucket policies | Staging → Prod |
| Discovery evidence bucket | **ENABLE_FOR_FIRST_TENANT** | Discovery uploads | Tenant isolation policies | Storage | RLS design | Staging |
| Blueprint / export bucket | **DEFER_UNTIL_SCALE** | Document export | Signed URL TTL | Storage | — | Staging |
| Tenant document strategy | **ENABLE_FOR_FIRST_TENANT** | Tenant runtime docs | Per-tenant prefix + RLS | Grows with tenants | Template policies | Staging |
| Signed URLs | **ENABLE_FOR_FIRST_TENANT** | Secure download | Short TTL; no public buckets for PII | Low | Storage buckets | Staging |
| File size / MIME restrictions | **ENABLE_FOR_FIRST_TENANT** | Abuse prevention | Blocks malware vectors | None | Bucket config | Staging |
| Malware scanning boundary | **DEFER_UNTIL_SCALE** | Enterprise compliance | External scanner integration | Third-party | ClamAV or vendor | Production |

**Current state:** Zero storage buckets configured.

---

## Functions and events

| Feature | Recommendation | Business purpose | Security | Cost | Prerequisite | Environment |
|---------|----------------|------------------|----------|------|--------------|-------------|
| Edge Functions | **DEFER_UNTIL_SCALE** | Webhooks, lightweight workers | Secret management in edge | Per invocation | Use Next.js server actions first | Staging |
| Realtime | **DEFER_UNTIL_SCALE** | Live UI updates | Channel auth required | Connection minutes | Product need (CEM queues) | Staging |
| Database Webhooks | **DEFER_UNTIL_SCALE** | DB → external systems | Validate URLs | Egress | — | Staging |
| Notification workers | **ENABLE_NOW** (app-layer) | Email via Resend/Mailpit | Already server-side | Resend | `EMAIL_PROVIDER` | App on Vercel |
| Email delivery | **ENABLE_AFTER_STAGING** | C3 verification | Resend domain auth | Per email | Staging cutover | Staging → Prod |
| Future SMS | **BLOCKED_BY_EXTERNAL_PROVIDER** | Phone OTP | Cost abuse | SMS provider | Provider | N/A |
| Audit event forwarding | **DEFER_UNTIL_SCALE** | SIEM integration | PII in logs | Log drain cost | Retention policy | Production |
| External integrations | **ENABLE_FOR_FIRST_TENANT** | Saudi / ERP cards | Assessment-first (doc 12) | Varies | Blueprint approval | Tenant |

**Current state:** Zero Edge Functions deployed. App uses Prisma + Next.js server layer for email.

---

## Immediate vs deferred summary

### Enable now (verify / already in use)

- Pro automatic backups (**verify** in Dashboard)
- Connection pooling
- Core extensions in use
- Email/password Auth (environment-isolated)
- App-layer email (Resend/Mailpit)
- Controlled migration gates (operational)

### Enable after persistent staging exists

- PITR (Production)
- Custom SMTP production cutover
- Google OAuth per environment
- CAPTCHA + Auth rate limit tuning
- Leaked password protection
- RLS policy rollout (staging proof first)
- Move Vercel Preview off Production DB

### Enable for first tenant golden path

- Private Storage buckets with RLS
- MFA for platform operators
- Discovery / request attachment storage
- External integration assessment cards (flagged)

### Defer until scale

- Read replicas, analytics replication
- Edge Functions (unless specific webhook need)
- Realtime (unless CEM live queue justifies)
- `pg_cron`, Vault secrets in DB
- Malware scanning integration

### Blocked by external provider

- SMS / phone verification at scale (until Twilio or equivalent contracted)

---

## Related documents

- `CROW_SUPABASE_PRO_FOUNDATION.md`
- `CROW_ENVIRONMENT_SEPARATION_PLAN.md`
- `CROW_CLOUD_COST_GUARDRAILS.md`
- `CROW_SUPABASE_SECURITY_AUDIT.md`
