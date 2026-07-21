# Architecture Principles

| Field | Value |
|-------|-------|
| **Document ID** | GHV-ARCH-1A-PRIN |
| **Version** | 0.1.0 |
| **Status** | **VALIDATION PLAN** |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.ARCHITECTURE.1A §8 |
| **Last updated** | 2026-07-21 |
| **Limitations** | Principles guide validation · **NOT** stack lock · exceptions require Founder decision + evidence · Technical Validation **NOT RUN** |

```text
PRINCIPLES FOR VALIDATION PLANNING
NOT TECHNICALLY VALIDATED
NOT PRODUCTION READY
```

## Exceptions process

1. Record proposed exception with affected principle IDs.
2. State risk, reversible cost, and compensating control.
3. Require Founder (RAVEN) decision entry before Product Code uses the exception.
4. Prefer time-boxed validation spikes over silent shortcuts.

---

## P-01 — Product baseline before technology

| Field | Content |
|-------|---------|
| **Meaning** | Locked Product, Learning, and Progression baselines constrain architecture; tools do not rewrite product rules. |
| **Implication** | Stack and schema work follow screen/state/capability contracts (92 screens, activation formula, anti-pay-to-win). |
| **Prohibited shortcut** | Picking a framework first and bending journeys to fit. |
| **Evidence** | Traceability from CAP/screen/flow → domain → spike acceptance. |
| **Related baseline** | Product Definition · Learning · Progression locks |
| **Exceptions** | Temporary spikes may use throwaway tech **outside** Product Code paths. |

## P-02 — Evidence before Mastery

| Field | Content |
|-------|---------|
| **Meaning** | Mastery and Route-Proven outcomes require governed Evidence acceptance paths. |
| **Implication** | Award paths must check Evidence state; no client-only mastery grants. |
| **Prohibited shortcut** | UI toggles or payment events awarding Mastery. |
| **Evidence** | QAS-002/003 · Evidence domain validation (1C). |
| **Related baseline** | Learning Evidence classes · Horizon Proven |
| **Exceptions** | Synthetic analysis only in `analysis/` — never production awards. |

## P-03 — Entitlement separate from progression

| Field | Content |
|-------|---------|
| **Meaning** | Commercial access and Merit Grants do not create progression value. |
| **Implication** | Separate stores and APIs for entitlement vs XP/Momentum/Achievements. |
| **Prohibited shortcut** | Webhook that increments XP or unlocks Crests. |
| **Evidence** | QAS-007 · pay-to-win tests · commercial domain map. |
| **Related baseline** | Constitution anti-pay-to-win · Progression Design |
| **Exceptions** | None for launch; any dual-write requires Founder rejection review. |

## P-04 — Secure by default

| Field | Content |
|-------|---------|
| **Meaning** | Deny-by-default authz, least privilege, secrets never in client or git. |
| **Implication** | Server-authoritative activation and privileged actions; no public admin surfaces. |
| **Prohibited shortcut** | Client-trusted role flags; committed `.env` secrets. |
| **Evidence** | Authz matrix · QAS-014/020 · security spikes. |
| **Related baseline** | Trust / Admin shells · SECURITY.md posture |
| **Exceptions** | Local-only fixtures with fake secrets — never real credentials. |

## P-05 — Privacy by design

| Field | Content |
|-------|---------|
| **Meaning** | Collect minimum data; separate Crow public identity from private identity. |
| **Implication** | Public profiles omit exact age and private contacts; retention classified. |
| **Prohibited shortcut** | Dumping raw PII into analytics or public APIs. |
| **Evidence** | QAS-019 · privacy classification in context doc. |
| **Related baseline** | Scope / Trust baselines |
| **Exceptions** | Legal-required retention with documented purpose. |

## P-06 — Arabic-first, bilingual-capable

| Field | Content |
|-------|---------|
| **Meaning** | Arabic RTL is a first-class layout and content requirement; English is supported. |
| **Implication** | i18n and RTL in architecture, not a late theme. |
| **Prohibited shortcut** | LTR-only MVP with “Arabic later.” |
| **Evidence** | QAS-010 · localization attribute targets. |
| **Related baseline** | Product Definition localization |
| **Exceptions** | Internal admin tools may be English-first if explicitly scoped. |

## P-07 — Accessibility as architecture

| Field | Content |
|-------|---------|
| **Meaning** | Accessibility is a system constraint (semantics, motion, contrast), not polish. |
| **Implication** | Component and motion systems provide non-motion equivalents. |
| **Prohibited shortcut** | Color-only status; motion-only feedback. |
| **Evidence** | QAS-011 · a11y scenarios in 1B/1D. |
| **Related baseline** | Product experience principles |
| **Exceptions** | Decorative motion with reduced-motion fallback mandatory. |

## P-08 — Explainable user state

| Field | Content |
|-------|---------|
| **Meaning** | Users can understand why they are pending, locked, restricted, or entitled. |
| **Implication** | Server states map to governed screens (e.g., ACT-003/011/012/013). |
| **Prohibited shortcut** | Opaque errors; silent entitlement loss. |
| **Evidence** | Activation recovery scenarios · Explainable Lock caps. |
| **Related baseline** | Screen/state architecture · Activation family |
| **Exceptions** | Abuse-sensitive detail withheld with appeal path (P-12). |

## P-09 — Modular boundaries before service extraction

| Field | Content |
|-------|---------|
| **Meaning** | Clear module ownership precedes network-split services. |
| **Implication** | Prefer modular monolith for validation (see shape options). |
| **Prohibited shortcut** | Microservices on day one without extraction triggers. |
| **Evidence** | Domain catalogue · shape scoring · spikes. |
| **Related baseline** | Founder-operable launch |
| **Exceptions** | Externals (email, payments, object storage) remain providers. |

## P-10 — Transactional integrity for sensitive decisions

| Field | Content |
|-------|---------|
| **Meaning** | Activation, Evidence acceptance, entitlement grants, trust restrictions commit consistently. |
| **Implication** | Define consistency class per domain; no partial silent success. |
| **Prohibited shortcut** | Fire-and-forget writes for awards or activation. |
| **Evidence** | Transaction map (1C) · QAS-004/006/007. |
| **Related baseline** | Activation formula · Evidence rules |
| **Exceptions** | Explicit eventual reconciliation with durable outbox. |

## P-11 — Idempotent event processing

| Field | Content |
|-------|---------|
| **Meaning** | Retries and duplicates must not double-apply progression or commercial effects. |
| **Implication** | Idempotency keys / event IDs on sensitive handlers. |
| **Prohibited shortcut** | Naive “increment on message.” |
| **Evidence** | QAS-002/004/008. |
| **Related baseline** | Progression event model |
| **Exceptions** | Non-sensitive telemetry may be at-least-once with care. |

## P-12 — Auditable corrections

| Field | Content |
|-------|---------|
| **Meaning** | Privileged corrections record who/why/what/before-after. |
| **Implication** | Admin/moderator paths emit audit records. |
| **Prohibited shortcut** | Silent DB edits. |
| **Evidence** | QAS-020 · Audit domain. |
| **Related baseline** | Admin / Trust shells |
| **Exceptions** | Emergency break-glass with post-hoc audit within defined SLA. |

## P-13 — Local recalculation over global destructive recomputation

| Field | Content |
|-------|---------|
| **Meaning** | Formula or Evidence changes recompute affected subgraphs, not wipe-all ledgers. |
| **Implication** | Versioned formulas; scoped invalidation. |
| **Prohibited shortcut** | Truncate-and-rebuild production ledgers. |
| **Evidence** | QAS-003/013. |
| **Related baseline** | Progression formula versioning |
| **Exceptions** | Offline synthetic rebuilds in analysis only. |

## P-14 — Minimal data duplication

| Field | Content |
|-------|---------|
| **Meaning** | Prefer references and projections with clear source of truth. |
| **Implication** | Domain catalogue names owned records; caches are disposable. |
| **Prohibited shortcut** | Copying PII into every read model. |
| **Evidence** | Data ownership review (1C). |
| **Related baseline** | Privacy principles |
| **Exceptions** | Documented projections for latency with refresh rules. |

## P-15 — Vendor-neutral domain logic

| Field | Content |
|-------|---------|
| **Meaning** | Core learning/progression/trust rules live in GHURAVIA-owned modules. |
| **Implication** | Providers adapt at edges; domain APIs stay stable. |
| **Prohibited shortcut** | Encoding product rules only inside a SaaS workflow. |
| **Evidence** | Context substitution strategies · spikes. |
| **Related baseline** | Learning / Progression ownership |
| **Exceptions** | Commodity infra (DNS, object store) without product rules. |

## P-16 — Replaceable external providers

| Field | Content |
|-------|---------|
| **Meaning** | Email, payments, storage, notifications must be swappable behind interfaces. |
| **Implication** | Adapter pattern; no hard vendor IDs in domain events. |
| **Prohibited shortcut** | Direct SDK calls from UI or formula engines. |
| **Evidence** | Provider outage scenarios · substitution spikes. |
| **Related baseline** | Integration Gateway domain |
| **Exceptions** | Temporary single-provider launch with documented switch cost. |

## P-17 — Graceful degradation

| Field | Content |
|-------|---------|
| **Meaning** | Non-critical dependencies fail without inventing progress or blocking core journeys needlessly. |
| **Implication** | Feature flags / degraded modes for search, notifications, Live Sky spectators. |
| **Prohibited shortcut** | Global 500 when search is down. |
| **Evidence** | QAS-015/017/018. |
| **Related baseline** | Quality attribute baseline |
| **Exceptions** | Hard-fail when integrity would otherwise be violated (P-10). |

## P-18 — Safe retries

| Field | Content |
|-------|---------|
| **Meaning** | Retries are bounded, backoff-aware, and idempotent where effects exist. |
| **Implication** | Upload and webhook handlers designed for retry. |
| **Prohibited shortcut** | Infinite client loops creating duplicate Evidence. |
| **Evidence** | QAS-002/007. |
| **Related baseline** | Evidence / Payments domains |
| **Exceptions** | Manual operator replay with audit. |

## P-19 — Observable operations

| Field | Content |
|-------|---------|
| **Meaning** | Critical paths emit logs/metrics/traces sufficient for founder operation. |
| **Implication** | Correlation IDs on activation, payments, Evidence, Live Sky. |
| **Prohibited shortcut** | Shipping without failure visibility. |
| **Evidence** | Observability stubs → 1D plan · spike dashboards. |
| **Related baseline** | Infrastructure observability placeholder |
| **Exceptions** | High-cardinality PII forbidden in logs (P-05). |

## P-20 — Controlled deployment

| Field | Content |
|-------|---------|
| **Meaning** | Deploys are intentional; Preview/Production separated; guards respected. |
| **Implication** | Keep `feat/ghuravia-foundation` deploy disabled until Preview readiness. |
| **Prohibited shortcut** | Removing vercel guard to “try something.” |
| **Evidence** | `vercel.json` inventory · TECH-018. |
| **Related baseline** | REPOSITORY-TRANSITION deploy posture |
| **Exceptions** | Founder-approved one-off with rollback plan. |

## P-21 — No hidden production dependency

| Field | Content |
|-------|---------|
| **Meaning** | Runtime must not rely on undocumented personal accounts, local-only tools, or untracked secrets. |
| **Implication** | All prod dependencies listed in architecture/ops registers. |
| **Prohibited shortcut** | Founder’s laptop as queue or cron. |
| **Evidence** | Dependency register · spike env matrices. |
| **Related baseline** | Governance dependency register |
| **Exceptions** | Explicit break-glass documented and time-limited. |

## P-22 — Progressive complexity

| Field | Content |
|-------|---------|
| **Meaning** | Launch architecture stays operable; complexity earned by validated need. |
| **Implication** | Extraction triggers in domain catalogue before splits. |
| **Prohibited shortcut** | Distributed saga mesh for launch. |
| **Evidence** | Shape options · Option D rejection for launch. |
| **Related baseline** | Founder-operable principle P-23 |
| **Exceptions** | Compliance-forced isolation with evidence. |

## P-23 — Founder-operable launch architecture

| Field | Content |
|-------|---------|
| **Meaning** | One founder must run, observe, and recover launch systems without a platform team. |
| **Implication** | Prefer few deployables, clear runbooks, low moving parts. |
| **Prohibited shortcut** | Multi-cluster mesh “for scale.” |
| **Evidence** | Shape scoring · operability attributes. |
| **Related baseline** | Scope controlled launch |
| **Exceptions** | Managed SaaS ok if operable and replaceable (P-16). |

## P-24 — Technical decisions require evidence

| Field | Content |
|-------|---------|
| **Meaning** | Stack and pattern choices need spikes, inventories, or measured scenarios—not fashion. |
| **Implication** | 1A plans questions; 1B–1E gather evidence before lock. |
| **Prohibited shortcut** | “We already had X in CyberCrow.” |
| **Evidence** | Inventory statuses · spike results (NOT RUN). |
| **Related baseline** | This Gate’s mission |
| **Exceptions** | Reversible low-cost choices may be provisional with sunset date. |

## P-25 — Irreversible choices receive stronger validation

| Field | Content |
|-------|---------|
| **Meaning** | Data model, identity primary keys, ledger semantics, and public API contracts need stronger proof. |
| **Implication** | Extra spikes and dual-write/migrate plans before lock. |
| **Prohibited shortcut** | Shipping irreversible IDs from a weekend prototype. |
| **Evidence** | 1C/1E acceptance · formula versioning. |
| **Related baseline** | Progression reproducibility · activation identity |
| **Exceptions** | None without Founder + recorded compensating migration path. |

---

## Change history

| Version | Date | Change |
|---------|------|--------|
| 0.1.0 | 2026-07-21 | Capture 25 Gate §8 principles for GHV.ARCHITECTURE.1A |
