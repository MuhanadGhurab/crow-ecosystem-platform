# Build vs Buy Register

| Field | Value |
|-------|-------|
| **Document ID** | GHV-ARCH-1A-OPT-BVB-001 |
| **Version** | 1.0.0 |
| **Status** | **VALIDATION PLAN · NOT RUN · DECISION PENDING** |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.ARCHITECTURE.1A §39 |
| **Last updated** | 2026-07-21 |
| **Related spikes** | SPK-ARC-001 … SPK-ARC-025 (category-linked below) |
| **Related** | Platform shape options (sibling docs) · Saudi readiness plan |

```text
VALIDATION PLAN
NOT RUN
DECISION PENDING
NO brand selection without evidence
Repository inheritance ≠ approval
CANDIDATE / HYBRID / BUILD — all DECISION PENDING
```

## 1. Purpose

Compare build vs managed vs hybrid candidates per category. **Do not select brands** unless repository evidence or a later validated comparison supports them. CyberCrow historical stack is **not** auto-approved for GHURAVIA.

## 2. Category register

| Category | Build candidate | Managed candidate | Hybrid candidate | Security | Privacy | Cost | Ops burden | Portability | Lock-in | Local/Saudi requirement | Launch recommendation (1A) | Spike |
|----------|-----------------|-------------------|------------------|----------|---------|------|------------|-------------|---------|-------------------------|----------------------------|-------|
| Authentication | Custom authn | Managed IdP / auth service | Passkeys + managed IdP | High impact | Session/PII | MOD–HIGH | High if build | Token standards help | IdP lock risk | Arabic UX; optional Nafath later | **DECISION PENDING** — candidate only | SPK-ARC-003 |
| Email | Self-host MTA | Transactional ESP | App templates + ESP | Spoof/DKIM | Content | LOW–MOD | High if self | Provider switch cost | Medium | Deliverability in KSA | Prefer managed later after compare | SPK-ARC-018 |
| Mobile verification | DIY SMS gateway | OTP provider | Adapter + provider | OTP security | Phone | MOD–HIGH | Medium | Adapter | Medium | Local carriers | Optional path; adapter | SPK-ARC-003 |
| Payments | Not realistic DIY acquire | Payment PSP | Entitlement core + PSP | PCI | Financial | MOD | Medium | Adapter mandatory | Medium–High | VAT; Saudi PSP readiness | **Entitlement core build; PSP buy** (brand TBD) | SPK-ARC-012 |
| Object storage | Self-host | Cloud object store | App metadata + cloud objects | Isolation | Region | HIGH growth | Medium | Exit via copy | Medium | Residency question | Metadata build; store managed TBD | SPK-ARC-007 |
| Malware scanning | DIY signatures (weak) | Managed scanner | Pipeline + managed engine | Critical | File contents | MOD–HIGH | High if DIY | Engine swap | Medium | Upload safety | Managed engine preferred direction | SPK-ARC-008 |
| Realtime | Custom WS | Managed realtime | HTTP commands + managed push | Abuse | Presence data | HIGH burst | High if DIY | Protocol choice | Medium–High | Latency | Pattern undecided; no brand | SPK-ARC-014 · 015 |
| Queues | DIY DB poll | Managed queue | Domain outbox + managed | Poison msgs | Payload | MOD | Medium | Outbox helps | Medium | — | Outbox pattern lean | SPK-ARC-009 · 018 |
| Search | DB `LIKE`/FTS | Managed search | Dual-read fallback | Filter bugs | Over-expose risk | MOD–HIGH | Medium | Reindex cost | Medium | Arabic | Fallback first; managed if needed | SPK-ARC-016 |
| Notifications | DIY | Multi-channel platform | Event bus + providers | Fail isolation | Consent | MOD | Medium | Templates portable | Medium | AR/EN | Event-first build | SPK-ARC-018 |
| Analytics | DIY events | Product analytics SaaS | First-party events + SaaS | PII leak | High | MOD | Low–Med | Export | Medium | Privacy | Analytics ≠ progression authority | SPK-ARC-022 |
| Observability | DIY logs | Managed APM/logs | OTel + managed backend | Log PII | Medium | MOD–HIGH | Medium | OTel helps | Medium | — | Standards-first | SPK-ARC-022 |
| Content management | Git/docs | Headless CMS | Catalogue in DB + CMS for marketing | Publish authz | — | LOW–MOD | Medium | Export | Low–Med | AR content | Learning catalogue governed in-product | SPK-ARC-005 |
| Feature flags | Config files | Flag service | Flags + audit | Misconfig | — | LOW–MOD | Low | Export | Medium | — | Optional later | SPK-ARC-021 |
| Support tooling | Email-only | Helpdesk SaaS | Tickets + audited admin | Over-access | Support PII | MOD | Low | Export | Medium | Arabic support | Deferred brand | SPK-ARC-022 |

## 3. Selection rules

1. No ACCEPTED brand in Architecture 1A.
2. Evidence required: spike results, cost, residency, security review.
3. Adapter boundaries preferred for reversible decisions.
4. Build where GHURAVIA invariants demand authority (activation, entitlement core, progression events, Learning Graph truth).

## 4. Limitations

```text
REGISTER ONLY · NOT RUN · DECISION PENDING · NO BRAND LOCK
```

## 5. Change history

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | GHV.ARCHITECTURE.1A §39 — build-vs-buy register |
