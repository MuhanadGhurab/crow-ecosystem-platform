# FTGP 1F — Discovery Interview Readiness

**Phase:** FTGP.1F (planning artifact within FTGP.1E)  
**Date:** 2026-06-23  
**Branch:** `feat/first-tenant-golden-path`  
**Status:** Internal preparation only — no client answers captured

---

## 1. Interview purpose

Establish authoritative organizational, operational, security, and module requirements for the first tenant golden path, sufficient to later generate an Enterprise Blueprint without improvising scope.

---

## 2. Roles

| Role | Fingerprint | Responsibilities |
|------|-------------|----------------|
| Client owner | `876863fe8c15c5c3` | Authenticated ownership-scoped answers; review own submissions; approve accuracy |
| IMPLEMENTER facilitator | `f82bef0cddd75238` | Facilitate interview; internal observations; Discovery progress per permission matrix |
| Platform Admin | `b3ee2ec185cf9893` | Governance oversight; no automatic client or IMPLEMENTER substitution |

---

## 3. Owner proof gate

```text
CANDIDATE_07_OWNER_AUTHENTICATED_CLIENT_PROOF=UNAVAILABLE
```

Artifact-backed proof: `npm run ftgp-client-owner-browser-proof:execute` then `:verify`. See [FTGP_1H_CLIENT_OWNER_BROWSER_PROOF.md](./FTGP_1H_CLIENT_OWNER_BROWSER_PROOF.md).

**Allowed before owner proof:** read-only structure review, template preparation, zero-write dry runs, permission verification.

**Blocked before owner proof:** saving client answers, client confirmation, Discovery completion, proposal/Blueprint acceptance.

---

## 4. Question groups

FTGP.1G reconciled the catalog to **17 groups** with stable keys in `src/lib/ftgp/ftgp-discovery-question-catalog.ts` (version `ftgp-first-tenant-discovery-v1.0.0`). Group **17 — Constraints, risks, budget, and timeline** is distinct from company-size fields in group 05. See [FTGP_1G_INTERNAL_DISCOVERY_INTERVIEW_PREPARATION.md](./FTGP_1G_INTERNAL_DISCOVERY_INTERVIEW_PREPARATION.md).

### Required groups (completion-weighted)

1. Organization identity  
2. Industry and business model  
3. Branches and locations  
4. Departments and reporting structure  
5. Roles and user populations  
6. Core operational workflows  
7. Approval chains  
8. Current systems and integrations  
9. Security and compliance requirements  
10. Data classification  
14. CEM module requirements  
15. CyberCrow trust requirements  
16. SAREA experience requirements  
17. Constraints, risks, budget, and timeline  

### Optional groups (completion-weighted)

11. Infrastructure preferences  
12. Reporting and analytics needs  
13. Data classification (supplemental) — *group 11 data classification questions may satisfy regulated industries*

---

## 5. Answer provenance model

| Type | Section | Actor | Stored via |
|------|---------|-------|------------|
| Client-provided answer | `client_discovery` | Owner session | `writeDiscoveryAnswerAudited` provenance `client_owner` |
| IMPLEMENTER internal observation | platform discovery sections | IMPLEMENTER | provenance `implementer_internal` |
| System-derived | `org_intelligence`, `ftgp_lifecycle_audit` | Audited services | provenance `system_derived` |

```text
DISCOVERY_ANSWER_PROVENANCE_MODEL=PASS
DISCOVERY_CLIENT_INTERNAL_CONTENT_SEPARATION=PASS
```

---

## 6. Save and draft behavior

- Client drafts: `saveClientDiscoveryDraftAction` after owner proof; ownership-scoped.
- IMPLEMENTER platform discovery: `requireActionDiscoveryWrite` + `canEditDiscovery(UNDER_DISCOVERY)`.
- No browser-direct Supabase table mutation.
- All writes require `IN_PROGRESS` profile and `UNDER_DISCOVERY` request status.

---

## 7. Audit expectations

Each authorized answer write should record:

- correlation ID  
- provenance (`client_owner` | `implementer_internal` | `system_derived`)  
- actor platform account reference (server-side only)  
- timestamp  

Lifecycle transitions remain separate audited events (`ftgp_lifecycle_audit`).

---

## 8. Completion gate

Discovery completion requires:

- Owner authenticated proof  
- Required question groups satisfied per `discovery-completion-gate.service` / client portal contract  
- Explicit authorization for `completeDiscoveryAndCreateBlueprint` (not in FTGP.1E scope)  
- No automatic completion on answer save  

```text
DISCOVERY_COMPLETION_RULES_EXPLICIT=PASS
```

---

## 9. Handoff toward Blueprint

After authorized completion:

1. `evaluateDiscoveryBlueprintGate` advisory review  
2. Separate authorization for Blueprint creation  
3. No pricing/proposal without subsequent golden-path phase  

---

## 10. Sensitive-data exclusions

Do not capture in repository documentation:

- Customer free text  
- Email addresses  
- Full platform account IDs  
- Company legal names from request intake  

---

## 11. Verification commands

```bash
npm run ftgp-discovery-shell:analyze
npm run ftgp-discovery-session:dry-run
npm run ftgp-discovery-answer-write:audit
npm run ftgp-discovery-invariant:audit
npm run ftgp-discovery-readiness:test
```

---

## 12. Next authorization

1. Obtain **authenticated client owner browser proof** for fingerprint `876863fe8c15c5c3`.  
2. Then authorize first client Discovery answer capture (single controlled write phase).  
3. Do not merge PR #10 or promote Production without separate authorization.
