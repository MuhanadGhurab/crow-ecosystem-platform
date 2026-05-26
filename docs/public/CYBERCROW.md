# CyberCrow — trust orchestration

**CyberCrow** is the security and trust engine of Crow Ecosystem — NCA-aware framing, identity posture, audit visibility, and compliance narrative on the tenant.

---

## Promise

> **CyberCrow protects the organization.**

Security is not a bolt-on project after ERP go-live. It is orchestrated from Discovery through Blueprint and visible on the tenant after provision.

---

## Design principles

### Trust is visible

Executives and auditors see posture, events, and audit trails in `/{slug}/cybercrow/*` — not hidden in ops tickets.

### Identity continuity

**Microsoft Entra ID** integrates with the platform auth story — client portal through tenant operations with one identity where configured.

### RBAC for auditors

Dedicated read-only auditor paths: CyberCrow visibility without silent write access to CEM operations.

### NCA-aligned narrative

Marketing and console copy frame **NCA ECC awareness** — detailed control mapping stays in security surfaces, not overstated on public homepage.

---

## Typical surfaces (public)

| Route pattern | Purpose |
|---------------|---------|
| `/{slug}/cybercrow/dashboard` | Posture summary |
| `/{slug}/cybercrow/audit-logs` | Tenant audit trail |
| `/{slug}/cybercrow/security-events` | Event stream |
| `/{slug}/cybercrow/compliance` | Compliance framing |
| `/{slug}/cybercrow/identity` | Identity provider narrative |
| `/{slug}/cybercrow/evidence` | Evidence readiness catalog (advisory; no file vault) |
| `/{slug}/cybercrow/grc` | GRC control mapping and report readiness (advisory) |
| `/admin/audit` | Platform-wide notification and audit strip |

---

## Relationship to CEM and SAREA

| Question | Owner |
|----------|-------|
| Is this action allowed? | RBAC + CyberCrow policy |
| Did it happen? | CyberCrow audit |
| How does the user see risk? | SAREA widgets + CyberCrow console |

CyberCrow **does not** replace SAREA layout work. It **does** ensure security events and policy boundaries are real.

---

## Evidence and GRC (advisory)

The evidence and GRC surfaces help operators see **what is documented**, **what is missing**, and **how controls map to NCA-oriented framing** — they do **not** certify the organization, replace a GRC platform, or ingest uploaded audit files in the current scope.

## Demo honesty

Some metrics surfaces may show **demo data** until Entra session store and production telemetry are connected. Public demos label mock posture where applicable.

---

## Founder scope

**Crow engineering** owns CyberCrow orchestration narrative, auditor UI paths, platform audit integration, and Entra ops story in the codebase. Customer CISO acceptance is separate from implementation.

See [`PLATFORM_ENGINES.md`](PLATFORM_ENGINES.md) · [`ROADMAP.md`](ROADMAP.md).
