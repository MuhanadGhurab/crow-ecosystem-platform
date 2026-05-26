# F23 — Production launch deferred gate

**Date:** 25 May 2026  
**Phase type:** Decision gate — **not** a production launch  
**Audience:** Product owner, engineering, operations, finance  
**Business rule:** Continue development **without new paid spend** until a real client and approved budget exist.

**F23 does not:** activate paid services, provision production-only infrastructure, enable live payments, create production customer data, or claim that Crow is “live in production” as a commercial SaaS.

---

## Executive summary

| Question | Answer |
|----------|--------|
| Is Crow technically demo/staging mature? | **Yes** — RC1 staging validated; F15–F22 depth on UX, CyberCrow, SAREA, portfolio |
| Is Crow financially/operationally launched as production? | **No** — **deferred by strategy** |
| Why defer? | No approved client budget, no production DB/auth separation sign-off, no paid PSP/edge/billing activation |
| What is safe now? | Demo / staging / portfolio mode (see §4) |
| When can production launch be reconsidered? | See §6 trigger conditions |

**F23 decision:** **PASSED AS A DECISION GATE** — outcome **B: Production launch deferred** (recommended; not blocked on engineering grounds).

---

## Part 1 — Production launch decision audit

Sources reviewed:

| Doc | What it contributes |
|-----|---------------------|
| [`F16_PRODUCTION_ENVIRONMENT_GOVERNANCE.md`](F16_PRODUCTION_ENVIRONMENT_GOVERNANCE.md) | Env separation, variable matrix, staging vs prod Supabase |
| [`F16_DEPLOYMENT_RUNBOOK.md`](F16_DEPLOYMENT_RUNBOOK.md) | Deploy sequence, rollback posture |
| [`F16_AUTH_SUPABASE_GOVERNANCE.md`](F16_AUTH_SUPABASE_GOVERNANCE.md) | OAuth, Site URL, role metadata |
| [`F16_HEALTH_SMOKE_CHECKLIST.md`](F16_HEALTH_SMOKE_CHECKLIST.md) | Post-deploy smoke paths |
| [`F16_BACKUP_RESTORE_POSTURE.md`](F16_BACKUP_RESTORE_POSTURE.md) | Backup/PITR expectations |
| [`F16_GO_NO_GO_MATRIX.md`](F16_GO_NO_GO_MATRIX.md) | G1–G14 go criteria; N1–N12 no-go triggers |
| [`F17_COST_CONTROLLED_AUTH_PAYMENT_READINESS.md`](F17_COST_CONTROLLED_AUTH_PAYMENT_READINESS.md) | Zero-cost bias; defer paid auth/payment |
| [`F19_SAUDI_PAYMENT_ARCHITECTURE.md`](F19_SAUDI_PAYMENT_ARCHITECTURE.md) | PSP matrix; live gateways deferred |
| [`F22_PORTFOLIO_PUBLIC_DEMO_POLISH.md`](F22_PORTFOLIO_PUBLIC_DEMO_POLISH.md) | Public story; no production launch claim |

### Ready (technical / documentary)

| Area | Status |
|------|--------|
| Staging deploy + pooler + auth | RC1 passed |
| F16 governance pack | Complete |
| Go/no-go matrix | Executable when prod env exists |
| Auth paths (email, Entra, Google) | Implemented; Google needs Supabase dashboard enable for live |
| CyberCrow SOC + evidence/GRC advisory | F15 + F21 |
| SAREA studio controls | F20 |
| Saudi payment **architecture** | F19 documented; adapters scaffolded |
| Public portfolio | F22 |
| Build pipeline | typecheck / lint / build / mirror scripts |
| Production auth guard | `AUTH_DISABLED` blocked in production builds |

### Documented but deferred (requires approval + often cost)

| Item | Blocker |
|------|---------|
| Separate production Supabase project | Cost + ops ownership |
| Canonical production domain + DNS | Cost + DNS ownership |
| Turnstile / WAF on public intake | Config + possible paid tier |
| Live Stripe / Saudi PSP | Merchant fees, KYC, budget |
| Apple Pay merchant (distinct from Sign in with Apple) | Apple Developer + PSP |
| PITR / backup tier upgrades | Supabase plan cost |
| SCIM / Entra group sync | Enterprise scope |
| Production billing enforcement | Product + legal + PSP |
| Real client tenant auto-provision | Client contract + data responsibility |

### Costs money (default: defer)

See §3 cost approval matrix.

### Must not happen without approval

- New paid Supabase project billed to personal/unclear account without sign-off
- `USE_MOCK_DATA=true` or `AUTH_DISABLED=true` on production host
- Live payment keys in Vercel Production
- Real customer PII in shared staging database
- Public marketing claiming “production certified” or “NCA compliant product”
- Automatic go-live for paying clients without F16 matrix execution on **production** deployment

---

## Part 2 — Production launch requirements

Production launch is allowed **only** when every section below is explicitly approved and verified on the **production** deployment (not staging alone).

### Environment

| # | Requirement | Verified by |
|---|-------------|-------------|
| E1 | Separate production Supabase project **or** written approval of shared-project strategy with isolation guarantees | Architecture sign-off |
| E2 | Production `DATABASE_URL` / `DIRECT_URL` on Vercel Production only | `validate:vercel-env` + operator checklist |
| E3 | Canonical HTTPS domain; `NEXT_PUBLIC_SITE_URL` matches | Browser + Supabase Site URL |
| E4 | Supabase redirect URLs include prod host + `/auth/callback` | Supabase dashboard |
| E5 | `AUTH_DISABLED=false` | `gate:production-auth` + Vercel env |
| E6 | `USE_MOCK_DATA=false` | Vercel env + smoke |
| E7 | Entra/Google OAuth apps use production callback (if enabled) | IdP consoles |

### Security

| # | Requirement | Verified by |
|---|-------------|-------------|
| S1 | Turnstile or equivalent on `/request` (policy) | Env + manual submit test |
| S2 | Secrets only in Vercel/env manager — never in git or public docs | `public:mirror-manifest` + review |
| S3 | `SUPABASE_SERVICE_ROLE_KEY` server-only | Code review + N10 from F16 |
| S4 | Route protection: admin, tenant, portal | F15.6 regression + prod smoke |
| S5 | Platform admin roles manually reviewed | Ops roster |

### Data

| # | Requirement | Verified by |
|---|-------------|-------------|
| D1 | Backup/restore policy approved | [`F16_BACKUP_RESTORE_POSTURE.md`](F16_BACKUP_RESTORE_POSTURE.md) |
| D2 | No destructive `db:reset` / seed on production | Runbook discipline |
| D3 | Customer data handling documented (retention, export, delete) | Legal/product |
| D4 | Demo/mock tenants not mixed with paying customer data | DB hygiene + naming |

### Payments

| # | Requirement | Verified by |
|---|-------------|-------------|
| P1 | Live card/wallet checkout **off** unless explicit approval | No live PSP env in prod |
| P2 | Manual invoice path acceptable for pilot if documented | Commercial sign-off |
| P3 | Saudi PSP provider chosen after comparison | F19 matrix + finance |
| P4 | No Stripe live / Mada / Tabby / Tamara without written approval | Env audit |

### Operations

| # | Requirement | Verified by |
|---|-------------|-------------|
| O1 | F16 health smoke on production URL | [`F16_HEALTH_SMOKE_CHECKLIST.md`](F16_HEALTH_SMOKE_CHECKLIST.md) |
| O2 | Rollback plan understood | [`F16_DEPLOYMENT_RUNBOOK.md`](F16_DEPLOYMENT_RUNBOOK.md) |
| O3 | Incident/support contact defined | Ops roster |
| O4 | Named owner of production Supabase + Vercel | [`F16_PRODUCTION_ENVIRONMENT_GOVERNANCE.md`](F16_PRODUCTION_ENVIRONMENT_GOVERNANCE.md) |
| O5 | F16 go/no-go matrix executed — **GO** or **CONDITIONAL GO** only | [`F16_GO_NO_GO_MATRIX.md`](F16_GO_NO_GO_MATRIX.md) |

**Current checklist status:** Requirements **documented**; production verification **not executed** because launch is deferred.

---

## Part 3 — Cost approval matrix

Default for all rows: **Defer** until client/budget exists unless noted.

| Item | Why it may be needed | When necessary | Current decision | Cost risk | Approval required | Recommended action |
|------|----------------------|----------------|------------------|-----------|-------------------|---------------------|
| Production Supabase project | Isolate customer data from staging | First paying client | **Defer** | Medium–high (plan + usage) | Yes | Keep existing staging project for demo |
| Supabase PITR / backup upgrade | RPO/RTO for customer data | Production with real data | **Defer** | Low–medium | Yes | Document in F16; enable at launch |
| Vercel Pro / team features | Seats, analytics, limits | Traffic or team scale | **Defer** | Low–medium | Yes | Hobby/team tier if sufficient today |
| Custom domain + DNS | Brand, OAuth stability | Public prod URL | **Defer** | Low (domain ~$10–50/yr) | Yes | Use staging URL until approved |
| Turnstile | Bot protection on `/request` | Public prod intake | **Defer** (config ready) | Free tier often sufficient | Yes if paid tier | Enable free tier when prod approved |
| WAF / edge security (paid) | DDoS, advanced rules | High-traffic public prod | **Defer** | Medium | Yes | Not required for portfolio |
| Apple Developer Program | Sign in with Apple; Apple Pay merchant | Apple auth or wallet | **Defer** | ~$99/yr | Yes | Google free; Apple when client needs |
| Google OAuth | Google Sign-In | Already F18 | **Approved (free)** | None | No | Enable in Supabase when desired |
| Microsoft Entra | Enterprise SSO | Client requires Entra | **Use existing** | Often free tier | Client IT | Already on staging path |
| Stripe (live) | Card subscriptions | SaaS billing enforcement | **Defer** | Transaction % | Yes | Test mode only if keys present |
| Moyasar / Tap / HyperPay | Saudi cards / Mada | Local payments | **Defer** | Setup + % fees | Yes | F19 architecture only |
| Tabby / Tamara (BNPL) | Installments | BNPL checkout | **Defer** | Merchant fees | Yes | F19 defer |
| Resend beyond free tier | Email volume | High notification volume | **Defer** | Low | Yes | Override inbox on staging OK |
| Payment merchant onboarding | KYC, legal entity | Any live PSP | **Defer** | Time + fees | Yes | Manual invoice for pilot |
| Dedicated support / on-call | SLA for client | Contractual SLA | **Defer** | People cost | Yes | Founder ops until scaled |

---

## Part 4 — Current safe operating mode

**Mode name:** Demo / staging / portfolio environment

### Allowed now

| Activity | Notes |
|----------|-------|
| Local development | `AUTH_DISABLED` / `USE_MOCK_DATA` for UI-only |
| Existing Vercel + Supabase staging | RC1-validated; no second project required |
| Demo walkthroughs | Mock slugs; [`DEMO_GUIDE.md`](../public/DEMO_GUIDE.md) |
| GitHub / portfolio / interviews | F22 materials; no secrets |
| Manual pipeline testing | Organic E2E scripts on staging |
| Google / Entra login testing | On staging with correct redirect URLs |
| Internal discovery → blueprint → tenant rehearsals | No real client data without contract |
| Continued feature phases **without paid infra** | Per F17/F19/F20/F21 pattern |

### Not allowed now

| Activity | Reason |
|----------|--------|
| Declaring commercial production launch | F23 deferral |
| Real customer production data in shared staging | Data responsibility |
| Live billing / webhooks charging money | F19 deferral |
| New paid Supabase/Vercel without budget line | Cost control |
| Production compliance certification claims | Advisory UI only |
| Auto-provision tenant for paying client without prod matrix | Operational risk |
| Enabling live Stripe/Mada/Tabby/Tamara keys on any public host | Explicit approval only |

---

## Part 5 — F23 go / no-go decision

| Outcome | Definition | This phase |
|---------|------------|------------|
| **A — Production launch approved** | Budget/client exists; all §2 requirements verified on prod | **Not selected** |
| **B — Production launch deferred** | Technically ready for showcase; launch gated on business approval | **Selected** |
| **C — Production launch blocked** | Critical engineering gaps prevent launch even if budget exists | **Not selected** |

### Decision record

- **Outcome:** **B — Production launch deferred by strategy**
- **Engineering posture:** Platform is **not blocked** — staging maturity and F16 pack support a future launch when triggers fire.
- **Business posture:** **No client budget / no production infra approval** → do not spend or claim production.
- **Relation to F16:** F16 **passed** as documentation + staging validation; F23 clarifies that F16 GO on **production** remains **future operator work**.

---

## Part 6 — Future trigger conditions

Re-open production launch when **all** of the following are true (minimum bar):

1. **Real client** — signed pilot or paid engagement (not portfolio demo only).
2. **Budget approved** — line items for Supabase prod, domain, edge protection, support time, and any PSP fees.
3. **Production database strategy approved** — separate project or approved isolation model.
4. **Data responsibility accepted** — retention, backup, incident response, DPA if required.
5. **Public intake protection approved** — Turnstile or equivalent on production `/request`.
6. **Payment policy approved** — manual invoice vs live PSP; provider chosen from F19 matrix.
7. **Support owner assigned** — named on-call for production incidents.
8. **Legal/compliance review** — no overstated NCA/ISO claims; advisory CyberCrow scope understood.
9. **F16 go/no-go executed** on production URL with **GO** or dated waivers only.

Until triggers fire: continue **cost-controlled** engineering on staging/local (e.g. product depth, portfolio, integrations) without activating §3 deferred spend.

---

## Part 7 — Validation (F23 phase)

| Command | Result |
|---------|--------|
| `npm run typecheck` | **PASS** |
| `npm run lint` | **PASS** |
| `npm run build` | **PASS** |
| `npm run public:mirror-manifest` | **PASS** (`docs/internal` excluded) |

No migrations · no seeds · no payment webhooks · no production env changes.

---

## Acceptance (F23 decision gate)

| # | Criterion | Met |
|---|-----------|-----|
| 1 | Production launch requirements documented | Yes — §2 |
| 2 | Cost approval matrix exists | Yes — §3 |
| 3 | Safe operating mode defined | Yes — §4 |
| 4 | Go/no-go decision documented | Yes — §5 |
| 5 | Future trigger conditions documented | Yes — §6 |
| 6 | Decision clear: deferred until budget/client | Yes |
| 7 | typecheck / lint / build | Run at end of phase |
| 8 | public mirror | Run at end of phase |
| 9 | No paid services activated | Yes |
| 10 | No forbidden scope | Yes — docs only |

**F23:** **PASSED AS A DECISION GATE** (outcome: **deferred by strategy**)

---

## Remaining risks (while deferred)

1. **Staging holds demo + rehearsal data** — risk of treating staging as “production” psychologically.
2. **OAuth redirect drift** — Site URL changes without checklist cause auth loops.
3. **Service role exposure** — any leak bypasses RLS; ongoing discipline required.
4. **Payment keys accidentally set** — audit Vercel env before any “prod” promotion.
5. **Overclaim in sales conversations** — use [`PORTFOLIO_BLURB.md`](../public/PORTFOLIO_BLURB.md) “what not to overclaim”.

---

## Related

- [`PRODUCTION_READINESS.md`](PRODUCTION_READINESS.md)
- [`RC1_STAGING_VALIDATION.md`](RC1_STAGING_VALIDATION.md)
- Public: [`ROADMAP.md`](../public/ROADMAP.md) (F23 gate — no launch claim)
