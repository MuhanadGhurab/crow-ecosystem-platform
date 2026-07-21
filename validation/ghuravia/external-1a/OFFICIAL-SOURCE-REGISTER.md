# Official Source Register

| Field | Value |
|-------|-------|
| **Gate ID** | GHV.VALIDATION.1A |
| **Document ID** | GHV-VAL-1A-OSR-001 |
| **Date** | 2026-07-21 |
| **Owner** | Founder (RAVEN) |
| **Branch HEAD** | `6845688c0fd97680075f1d83ae1cd87b5a2d1352` |
| **Retrieval date** | 2026-07-21 |
| **Evidence class** | **[DOC-ONLY]** — documentation references only; **no sandbox evidence** |

## Purpose

Primary **official documentation sources** for technologies referenced by the GHURAVIA Architecture Design Baseline. This register supports validation planning, adapter contract review, and official API semantics. **Citing these sources does not close any external validation condition.**

## Limitations (global)

```text
• Documentation review ≠ live compatibility proof on chosen providers
• Version pins in architecture may differ from latest docs — verify against Platform Stack baseline
• No provider credentials available — sandbox execution NOT POSSIBLE at workspace open
• Preview DATABASE_URL / DIRECT_URL absent — database runtime validation NOT ESTABLISHED
• OAuth/OIDC and webhook HMAC patterns vary by vendor — adapter ports must wrap vendor-specific details
```

## Technology register

### PostgreSQL (relational datastore family)

| Field | Value |
|-------|-------|
| **Primary domain** | https://www.postgresql.org/ |
| **Documentation** | https://www.postgresql.org/docs/ |
| **Architecture ADR** | ADR-005 (host deferred · PostgreSQL-family pattern) |
| **Validation use** | COND-032 · datastore host selection · migration semantics |
| **Sandbox evidence** | **NONE** — host not selected; Preview DB absent |

### Node.js (runtime)

| Field | Value |
|-------|-------|
| **Primary domain** | https://nodejs.org/ |
| **Documentation** | https://nodejs.org/docs/latest/api/ |
| **Architecture context** | Platform Stack v1.0.0 · spike harness runtime |
| **Validation use** | Runtime compatibility reference for adapter implementations |
| **Sandbox evidence** | **NONE** at Validation.1A — historical spike harness only |

### Next.js (application framework)

| Field | Value |
|-------|-------|
| **Primary domain** | https://nextjs.org/ |
| **Documentation** | https://nextjs.org/docs |
| **Architecture context** | Route Handlers · App Router · ADR-015 deny-by-default |
| **Validation use** | Routing · middleware · server/client boundary patterns |
| **Sandbox evidence** | **NONE** — architecture spikes only |

### Drizzle ORM (data access layer)

| Field | Value |
|-------|-------|
| **Primary domain** | https://orm.drizzle.team/ |
| **Documentation** | https://orm.drizzle.team/docs/overview |
| **Architecture context** | Data access pattern · migration tooling references |
| **Validation use** | Schema migration semantics · PostgreSQL dialect |
| **Sandbox evidence** | **NONE** — no Preview database connection |

### Vercel (deployment / hosting reference)

| Field | Value |
|-------|-------|
| **Primary domain** | https://vercel.com/ |
| **Documentation** | https://vercel.com/docs |
| **Architecture ADR** | ADR-036 (topology conceptual · external proof deferred) |
| **Validation use** | COND-022 · Preview/Production isolation · environment variables |
| **Sandbox evidence** | **NONE** — Preview NOT ESTABLISHED; TECH-018 OPEN |

### S3-compatible object storage API

| Field | Value |
|-------|-------|
| **Primary domain (API reference)** | https://docs.aws.amazon.com/AmazonS3/latest/API/Welcome.html |
| **Architecture ADR** | ADR-020 · SPK-ARC-007 |
| **Validation use** | COND-011 · quarantine bucket isolation · presigned URL semantics |
| **Sandbox evidence** | **NONE** — provider not selected; credentials NOT AVAILABLE |
| **Note** | S3 API is the **compatibility contract**; vendor may be AWS S3, R2, MinIO, etc. |

### Identity providers — OIDC / OAuth 2.0 patterns

| Field | Value |
|-------|-------|
| **OAuth 2.0** | https://oauth.net/2/ |
| **OpenID Connect** | https://openid.net/connect/ |
| **OIDC spec** | https://openid.net/specs/openid-connect-core-1_0.html |
| **Architecture ADR** | ADR-013 (IdP adapter port · provider deferred) |
| **Validation use** | COND-009 · session boundary · token exchange semantics |
| **Sandbox evidence** | **NONE** — IdP vendor not selected |

### Webhook HMAC verification patterns

| Field | Value |
|-------|-------|
| **Reference (general)** | Vendor-specific — e.g. Stripe signing: https://docs.stripe.com/webhooks/signatures |
| **Architecture ADR** | ADR-029 · SPK-ARC-012 (commercial webhook idempotency) |
| **Validation use** | Payment processor · entitlement reconcile · replay protection |
| **Sandbox evidence** | **NONE** — processor TBD |
| **Note** | Architecture locks **pattern** (HMAC/signature verify · idempotency · fail-safe reconcile); exact header names and algorithms are vendor-specific |

## Supplementary official sources (domain-specific validation)

| Domain | Source | URL |
|--------|--------|-----|
| Web Content Accessibility (WCAG) | W3C WAI | https://www.w3.org/WAI/standards-guidelines/wcag/ |
| Arabic / RTL (HTML) | W3C i18n | https://www.w3.org/International/questions/qa-html-dir |
| OWASP (security reference) | OWASP Foundation | https://owasp.org/ |

## Usage rules

1. Prefer **official domains** listed above over third-party tutorials for normative behavior.
2. Record **retrieval date** when citing a specific doc version in domain reports.
3. Mark all citations in domain reports as **[DOC-ONLY]** unless backed by sandbox execution evidence.
4. Do not treat documentation alignment as **PASS** for COND-009…022, 028, or 032.

## Change history

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | Initial register @ GHV.VALIDATION.1A |
