# Discovery Question Model

| Field | Value |
|-------|-------|
| **Title** | Discovery question metadata and field type system |
| **Status** | CANONICAL design — CROW.DISCOVERY.FIELD.1 |
| **Authority** | [`DISCOVERY-FIELD-ARCHITECTURE.md`](DISCOVERY-FIELD-ARCHITECTURE.md) |
| **Date** | 2026-07-18 |

## Purpose

Define a **single logical question model** so client and operator Discovery surfaces share keys, validation, Blueprint mapping, and ProCrow review flags — without implementing UI or migrations in this milestone.

## Field type system

| Type key | Description | MVP? |
|----------|-------------|------|
| `short_text` | Single-line text | Yes |
| `long_text` | Multi-line narrative | Yes |
| `single_select` | One option from list | Yes |
| `multi_select` | Many options from list | Yes |
| `boolean` | Yes/no | Yes |
| `number` | Numeric | Yes |
| `date` | Calendar date | Yes |
| `email` | Email string | Yes (usually from account) |
| `phone` | Phone string | Yes (usually from account) |
| `url` | Link reference | Yes |
| `file_reference` | Named/URI evidence pointer (not binary upload) | Yes (text/url only) |
| `person_reference` | Named person / role holder | Later |
| `team_reference` | Named team | Later |
| `role_persona_candidate` | Work persona / role candidate | MVP (text or select) |
| `workflow_reference` | Named workflow | MVP (text list OK) |
| `system_tool_reference` | Named system/tool | MVP (text list OK) |
| `location_reference` | Named location/branch | MVP |
| `risk_rating` | Ordered risk scale | MVP |
| `priority_rating` | Ordered priority | MVP |
| `maturity_rating` | Ordered maturity | Later |
| `matrix_table` | 2D structured answers | Later |
| `repeatable_group` | List of structured objects | MVP (limited) |
| `conditional_group` | Nested fields when condition true | MVP |
| `evidence_reference` | Evidence index entry | MVP |
| `approval_decision_reference` | Decision/approval chain note | MVP |

**Deferred product:** real file upload pipelines, virus scanning, ACL-bound storage.

## Question metadata schema (logical)

Each question definition should include:

| Metadata | Required | Notes |
|----------|----------|-------|
| `fieldKey` | Yes | Stable snake_case id |
| `label` | Yes | Client-friendly |
| `helperText` | Yes | Plain language |
| `fieldType` | Yes | From type system |
| `version` | Yes | e.g. `discovery-fields-v1` |
| `layer` | Yes | L1–L10 |
| `category` | Yes | Taxonomy category |
| `requiredCondition` | Yes | Expression or enum: `always` \| `never` \| `if_journey_NEW` \| … |
| `journeyApplicability` | Yes | `NEW` \| `TRANSFORM` \| `BOTH` |
| `organizationContextApplicability` | Yes | list or `ALL` |
| `industryApplicability` | Yes | `ALL` or pack ids |
| `visibilityCondition` | Yes | Depends on prior answers |
| `validation` | Yes | min/max/length/enum/regex |
| `mapsToOperatingModel` | Yes | section id(s) |
| `mapsToBlueprintSection` | Yes | Studio section or Blueprint domain |
| `riskSensitivity` | Yes | `low` \| `medium` \| `high` |
| `evidenceRequirement` | Yes | `none` \| `optional` \| `recommended` \| `required_later` |
| `clientVisible` | Yes | boolean |
| `operatorVisible` | Yes | boolean |
| `procrowReviewFlag` | Yes | `none` \| `review` \| `blocking_if_missing` |
| `ownerOnly` | No | internal notes |
| `options` | If select | catalog reference |
| `repeatable` | If group | max items |
| `schemaReadyPersistence` | Yes | `discovery_answer` \| `brief_overlay` \| `entity_row` \| `future_table` |

## Example question definitions (documentation-only)

```json
{
  "fieldKey": "journey_kind",
  "label": "What are you trying to do?",
  "helperText": "Build a new organization, or transform an existing one.",
  "fieldType": "single_select",
  "version": "discovery-fields-v1",
  "layer": "L2",
  "category": "journey_and_organization_context",
  "requiredCondition": "always",
  "journeyApplicability": "BOTH",
  "organizationContextApplicability": "ALL",
  "industryApplicability": "ALL",
  "visibilityCondition": "always",
  "validation": { "enum": ["NEW", "TRANSFORM"] },
  "mapsToOperatingModel": ["intent"],
  "mapsToBlueprintSection": "overview",
  "riskSensitivity": "low",
  "evidenceRequirement": "none",
  "clientVisible": true,
  "operatorVisible": true,
  "procrowReviewFlag": "blocking_if_missing",
  "schemaReadyPersistence": "brief_overlay"
}
```

```json
{
  "fieldKey": "top_pain_points",
  "label": "What hurts most today?",
  "helperText": "List the top operational problems you want Crow to address.",
  "fieldType": "long_text",
  "version": "discovery-fields-v1",
  "layer": "L8",
  "category": "current_state_pain_points",
  "requiredCondition": "if_journey_TRANSFORM",
  "journeyApplicability": "TRANSFORM",
  "organizationContextApplicability": "ALL",
  "industryApplicability": "ALL",
  "visibilityCondition": "journey_kind == TRANSFORM",
  "validation": { "minLength": 20 },
  "mapsToOperatingModel": ["current_state", "risks"],
  "mapsToBlueprintSection": "operations",
  "riskSensitivity": "medium",
  "evidenceRequirement": "optional",
  "clientVisible": true,
  "operatorVisible": true,
  "procrowReviewFlag": "review",
  "schemaReadyPersistence": "discovery_answer"
}
```

```json
{
  "fieldKey": "compliance_drivers",
  "label": "Which compliance or trust drivers matter?",
  "helperText": "Examples: NCA alignment interest, customer contracts, internal audit, regulated data.",
  "fieldType": "multi_select",
  "version": "discovery-fields-v1",
  "layer": "L5",
  "category": "compliance_legal",
  "requiredCondition": "always",
  "journeyApplicability": "BOTH",
  "organizationContextApplicability": "ALL",
  "industryApplicability": "ALL",
  "visibilityCondition": "stage >= trust_and_risk",
  "validation": { "minItems": 1 },
  "mapsToOperatingModel": ["trust"],
  "mapsToBlueprintSection": "security-trust",
  "riskSensitivity": "high",
  "evidenceRequirement": "recommended",
  "clientVisible": true,
  "operatorVisible": true,
  "procrowReviewFlag": "review",
  "schemaReadyPersistence": "discovery_answer"
}
```

## Operating model section ids (logical)

| Id | Meaning |
|----|---------|
| `intent` | Why / goals |
| `organization` | Identity, structure, locations |
| `responsibilities` | Roles, personas, RACI-like notes |
| `workflows` | Processes and handoffs |
| `systems` | Tools and integrations |
| `trust` | Security, compliance, identity |
| `commercial` | Offerings and commercial posture |
| `current_state` | As-is (Transform) |
| `target_state` | To-be |
| `transition` | How to move |
| `risks` | Constraints and risks |
| `evidence` | Evidence index |

## Versioning rules

1. `fieldKey` is immutable once published in MVP  
2. Label/helper may change without key change  
3. Breaking enum changes require new key or explicit migration plan  
4. Unknown keys on read must be ignored (forward compatible)  
5. Question catalog version string travels with DiscoveryProfile summary metadata (future)

## Alignment with existing code (do not rewrite now)

| Existing | Relationship |
|----------|----------------|
| `ClientServiceRequestBrief` | Seeds L1–L3; Discovery extends |
| `DiscoveryAnswer` | Preferred MVP persistence for most keys |
| FTGP question catalog | Candidate seed set; reconcile into this model in build milestone |
| Business field catalog | Options source for industry/field questions |
| ProCrow qualification | Gate to enter Discovery — not a discovery field |

## Authority note

Recording answers is **not** authorization. ProCrow review flags guide humans; they do not auto-approve Blueprint or provision tenants.
