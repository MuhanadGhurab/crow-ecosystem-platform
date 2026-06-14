# C1.1 — Blueprint Studio Authorization Matrix

**Status:** Design-only — **no new permissions deployed in C1.1**  
**Baseline:** C0/C1 contracts + existing `requireActionDiscoveryWrite()` / admin gates  
**Enforcement layer (C2):** Server actions + dedicated `blueprint-studio-auth` guards

---

## Roles

| Role | Description |
|------|-------------|
| `platform_admin` | Crow operator with full internal access |
| `implementer` | ProCrow delivery — primary Blueprint author/reviewer |
| `sales` | Commercial engagement; limited slice edit |
| `auditor_readonly` | Read trace + approved artifacts; no mutation |
| `client` | Client portal user — client-safe projection only |
| `tenant_admin` | Business Portal admin for linked tenant |
| `tenant_user` | Business Portal member — minimal blueprint visibility |

**Invariant:** SAREA configuration never grants Blueprint or commercial access.

---

## Legend

| Symbol | Meaning |
|--------|---------|
| ✅ | Allowed |
| 🔒 | Allowed with scope restriction |
| ❌ | Denied |
| ⚠️ | Advisory / propose only |
| 📋 | Read via client-safe projection |

---

## Matrix

| Action | platform_admin | implementer | sales | auditor_readonly | client | tenant_admin | tenant_user |
|--------|----------------|-------------|-------|------------------|--------|--------------|-------------|
| List Blueprint (tenant-scoped) | ✅ | ✅ | 🔒 own engagements | 🔒 assigned tenants | 📋 linked only | 📋 own tenant | ❌ |
| Read internal Blueprint | ✅ | ✅ | 🔒 commercial slice | ✅ | ❌ | ❌ | ❌ |
| Read client-safe Blueprint | ✅ | ✅ | ✅ | ✅ | 📋 | 📋 | ❌ |
| Create draft | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Edit organizational slice | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Edit operations slice | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Edit security slice | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Edit SAREA slice | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Edit integrations slice | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Edit commercial slice | ✅ | ✅ | ⚠️ propose | ❌ | ❌ | ❌ | ❌ |
| Compare versions | ✅ | ✅ | 🔒 client-safe diff | ✅ | 📋 redacted diff | ❌ | ❌ |
| Generate ROI | ✅ | ✅ | ⚠️ view only | ✅ read | ❌ | ❌ | ❌ |
| Edit ROI assumptions | ✅ | ✅ | ⚠️ propose | ❌ | ❌ | ❌ | ❌ |
| Approve ROI assumptions | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Generate SOW | ✅ | ✅ | ⚠️ trigger with approval | ✅ read | ❌ | ❌ | ❌ |
| Edit SOW (manual sections) | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Submit internal review | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Submit client review | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Request changes (client) | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Approve Blueprint (internal) | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Approve Blueprint (client advisory) | ❌ | ❌ | ❌ | ❌ | ⚠️ advisory signal | ❌ | ❌ |
| Archive Blueprint | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Create next version | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Propose configuration | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View trace evidence (full) | ✅ | ✅ | 🔒 no security internals | ✅ | 📋 client events only | ❌ | ❌ |
| Override security controls | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

---

## New permissions required for C2 (flagged — not implemented)

| Permission key | Purpose | PO approval |
|----------------|---------|-------------|
| `blueprint.studio.read` | Internal Studio read | Required |
| `blueprint.studio.write` | Draft save | Required |
| `blueprint.studio.approve` | Internal approval | Required |
| `blueprint.studio.roi.approve` | ROI assumption approval | Required |
| `blueprint.studio.sow.write` | Manual SOW edit | Required |
| `blueprint.studio.trace.read` | Full trace timeline | Required |
| `blueprint.client.review` | Client-safe read + request changes | Required |

**C1.1 does not broaden permissions.** Existing `discovery.write` remains interim guard until C2 migration.

---

## Client-safe projection rules

Server-side filter before any `client` or `tenant_admin` read:

**Excluded fields:**

- Internal security weaknesses / privileged-role design
- Internal pricing margin, cost breakdown, discount logic
- Implementation-only operator notes
- Full trace payloads with internal actor metadata
- CyberCrow evidence attachments marked internal

**Included (redacted):**

- Organizational summary (no internal HR identifiers)
- High-level operational scope
- Client-facing security commitments (no control IDs)
- Experience/SAREA personas (published only)
- Integration list (no credentials)
- Commercial package summary (no margin)

**Enforcement:** `getClientSafeBlueprintProjection(blueprintId, actor)` — not UI-only hiding.

---

## Segregation of duties

| Rule | Enforcement |
|------|-------------|
| Approver ≠ sole author (configurable) | Service check on `BlueprintApproval` |
| AI cannot approve | `actorType !== 'ai'` on approval mutations |
| Sales cannot approve internal security | Role guard on `approve` |
| Client approval does not unlock runtime | Separate `ConfigurationReleaseBinding` (C0) |

---

## Cross-tenant isolation

Every query MUST include:

```text
WHERE tenantId = :actorTenantId
  OR blueprintId IN (SELECT id FROM EnterpriseBlueprint WHERE tenantId = :actorTenantId)
```

`listEnterpriseBlueprints` **must be fixed in C2** to require tenant scope (current gap documented in threat model).
