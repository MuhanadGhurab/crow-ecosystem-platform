# Authorization Architecture

| Field | Value |
|-------|-------|
| **Document ID** | GHV-ARCH-1C-ID-AUTHZ-001 |
| **Version** | 1.0.0 |
| **Status** | **ACCEPTED** |
| **Owner** | Founder (RAVEN) |
| **Date** | 2026-07-21 |
| **Source Gate** | GHV.ARCHITECTURE.1C |
| **ADR** | ADR-ARC-015 |

```text
Hybrid RBAC + contextual policy
Deny by default
Product Code: BLOCKED
```

## 1. Purpose

Define how the platform decides whether an authenticated actor may perform an action. Authorization is distinct from Authentication, Activation, Entitlement, and Trust.

## 2. Model

**Hybrid RBAC + contextual policy (ADR-ARC-015):**

| Layer | Function |
|-------|----------|
| Roles | Coarse grants: `learner`, `reviewer`, `moderator`, `admin`, `support` |
| Context | Resource ownership, activation, assurance level, case assignment |
| Policy | Deny-by-default evaluation: `(role grants) AND (context predicates)` |

## 3. Evaluation order

```text
1. Deny lists / account blocks
2. Activation gate (if resource requires active account)
3. Role membership
4. Contextual predicates (ownership, SoD, assurance)
5. Default DENY
```

## 4. Separation enforcement

| Check | Where evaluated | Never inferred from |
|-------|-----------------|---------------------|
| Can upload Evidence | AuthZ + activation | Session alone |
| Can review Evidence | AuthZ + scan release | Owner flag |
| Can view Trust | AuthZ + moderator role | Public profile |
| Can alter progression | AuthZ + privileged path | Reviewer role alone |
| Commercial feature | Entitlement service | Progression standing |

## 5. Segregation of duties

| Pair | Rule |
|------|------|
| Evidence submitter / approver | Same user cannot approve own Evidence |
| Moderator / subject | Cannot decide own case |
| Privileged correction | Dual control for break-glass |

## 6. Policy storage

- Policies versioned in application configuration or database table with audit on change.
- No client-side policy evaluation for security decisions.

## 7. Arabic-first / a11y

- Access-denied responses must be human-readable in Arabic; avoid leaking internal role names.

## 8. Evidence

- SPK-ARC-007 (upload access), SPK-ARC-013 (moderation views), SPK-ARC-019 (privileged correction authority).

## 9. Non-claims

```text
Policy engine vendor not selected
Fine-grained ABAC for all resources deferred to implementation gate
```
