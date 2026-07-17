# Discovery Field Taxonomy

| Field | Value |
|-------|-------|
| **Title** | Enterprise discovery field taxonomy |
| **Status** | CANONICAL design — CROW.DISCOVERY.FIELD.1 |
| **Authority** | [`DISCOVERY-FIELD-ARCHITECTURE.md`](DISCOVERY-FIELD-ARCHITECTURE.md) |
| **Date** | 2026-07-18 |

## How to read this document

- **Categories** group related fields  
- **Example fields** are illustrative keys (snake_case) — not a frozen product UI  
- **MVP / Later / Deferred** tags guide first Discovery implementation  

Legend: **M** = MVP · **L** = Later · **D** = Deferred (uploads, integrations, AI, or migration)

---

## L1 — Universal Core

| Category | Example fields | Tier |
|----------|----------------|------|
| Organization identity | `organization_display_name`, `organization_name_ar`, `legal_entity_type`, `country_primary` | M |
| Purpose / mission | `plain_language_purpose`, `primary_purpose_key`, `secondary_purpose_keys` | M |
| Journey | `journey_kind` (`NEW` \| `TRANSFORM`) | M (from Request) |
| Organization context | `organization_context` | M (from Request) |
| Industry / sector | `primary_business_field_key`, `industry_template`, `sector_notes` | M |
| Scale | `current_team_range`, `expected_users`, `growth_intention` | M |
| Contact / owner | `primary_contact_name`, `primary_contact_role` (email/phone from account) | M |
| Goals | `plain_language_goal`, `success_definition_90_days` | M |

---

## L2 — Journey Fields

### Build New (`journey_kind = NEW`)

| Category | Example fields | Tier |
|----------|----------------|------|
| Intent | `idea_stage`, `launch_horizon`, `greenfield_constraints` | M |
| Target model | `target_operating_shape`, `must_have_capabilities` | M |
| Growth | `initial_locations_plan`, `hiring_plan_notes` | L |

### Transform Existing (`journey_kind = TRANSFORM`)

| Category | Example fields | Tier |
|----------|----------------|------|
| Current org | `current_org_summary`, `what_must_be_preserved` | M |
| Pain | `top_pain_points`, `failed_attempts_notes` | M |
| Target | `target_state_summary`, `transition_preference` (`pilot` \| `phased` \| `big_bang`) | M |
| Migration | `legacy_systems_list`, `migration_constraints` | L |

---

## L3 — Organization Context Fields

| Context | Emphasize | Tier |
|---------|-----------|------|
| `NEW_BUSINESS` | greenfield capabilities, founding team, first customers | M |
| `NEW_DIVISION` | parent org relationship, shared vs independent systems, reporting line | M |
| `EXISTING_ORGANIZATION` | current structure, branches, inherited processes | M |
| `MODERNIZATION` | tech debt, compliance drivers, change readiness | M |

Example context-specific fields:

- `parent_organization_name` (NEW_DIVISION) — M  
- `shared_services_dependency` (NEW_DIVISION) — L  
- `branch_count_estimate` (EXISTING) — M  
- `modernization_drivers` (MODERNIZATION) — M  

---

## L4 — Operating Model Fields

| Subcategory | Example fields | Tier |
|-------------|----------------|------|
| Locations | `locations_summary`, `branch_topology`, `multi_country` | M |
| People / teams | `departments_planned`, `team_structure_notes` | M |
| Roles / responsibilities | `key_roles`, `responsibility_map_notes`, `work_persona_candidates` | M |
| Workflows / processes | `core_workflows`, `workflow_families`, `handoff_pain_points` | M |
| Decisions / approvals | `approval_model_summary`, `decision_rights_notes` | M |
| Systems / tools | `current_systems_inventory`, `must_keep_systems`, `must_replace_systems` | M |
| Data / records | `critical_records`, `data_owners_notes` | L |
| Capabilities | `essential_capabilities`, `recommended_capabilities` | M (from preliminary rec) |
| Resources | `resource_constraints`, `capacity_notes` | L |

---

## L5 — Trust / Security / Compliance

| Subcategory | Example fields | Tier |
|-------------|----------------|------|
| Identity | `idp_preference`, `mfa_required`, `sso_notes` | M |
| Authorization | `role_separation_needed`, `privileged_access_notes` | L |
| Data sensitivity | `data_classification_model`, `pii_present`, `regulated_data_types` | M |
| Audit / evidence | `audit_expectation`, `retention_expectations` | L |
| Regulations | `compliance_drivers`, `nca_alignment_interest` | M |
| Risk | `top_risks`, `segregation_of_duties_needed` | M |
| CyberCrow expectations | `cybercrow_trust_expectations` | L |
| Hosting | `hosting_constraints`, `data_residency_notes` | L |

---

## L6 — Commercial / Service

| Subcategory | Example fields | Tier |
|-------------|----------------|------|
| Offerings | `products_services_summary`, `delivery_model` | M |
| Customers | `customer_segments`, `beneficiary_types` | L |
| Revenue | `revenue_model_notes` | L |
| Support / SLA | `support_model`, `sla_expectations` | L |
| Commercial readiness | `budget_guardrails_notes`, `commercial_urgency` | L |

Payment processing remains **out of Discovery** — commercial fields are design inputs only.

---

## L7 — Industry Extension Packs (Later)

Packs add fields without changing stages. Initial pack candidates:

| Pack | Example fields |
|------|----------------|
| Construction | project sites, subcontractors, variation orders |
| Healthcare | care settings, clinical vs admin workflows, privacy regimes |
| Education | campuses, academic calendar, student records sensitivity |
| Logistics | fleets, hubs, SLAs, tracking systems |
| Retail | stores, channels, inventory velocity |
| Professional services | engagements, utilization, knowledge base |
| Government-related | citizen services, records retention, clearance |
| Manufacturing | plants, BOM/quality, shift models |
| Technology / SaaS | tenants, environments, release cadence |
| Cybersecurity services | client trust boundaries, evidence packs |

**Tier:** all L7 = **L** (after general MVP)

---

## L8 — Transformation Fields

| Subcategory | Example fields | Tier |
|-------------|----------------|------|
| Current state | `current_operating_map_notes` | M (Transform) |
| Pain / gaps | `process_gaps`, `org_friction_notes` | M |
| Legacy | `legacy_system_risk`, `data_migration_complexity` | L |
| Change readiness | `sponsor_strength`, `change_capacity`, `training_needs` | L |
| Target / transition | `pilot_scope`, `transition_blueprint_notes` | M |

---

## L9 — Evidence Fields

| Subcategory | Example fields | Tier |
|-------------|----------------|------|
| Document refs | `org_chart_ref`, `policy_ref`, `process_note_ref` | M (text URL/name refs) |
| Inventories | `system_inventory_ref`, `integration_list_ref` | L |
| Compliance artifacts | `compliance_artifact_ref` | L |
| File uploads | binary storage, virus scan, ACL | **D** |

MVP evidence = **named references + notes**, not a new upload product.

---

## L10 — Blueprint-Ready Mapping Categories

Every MVP field declares a Blueprint domain (see question model):

| Blueprint domain (constitution) | Typical taxonomy categories |
|---------------------------------|----------------------------|
| Intent | purpose, goals, journey, commercial intent |
| Organization and Responsibilities | identity, locations, teams, roles, responsibilities |
| Workflows and Capabilities | workflows, capabilities, systems |
| Trust and Experience | L5 + SAREA persona hints |
| Runtime and Integrations | systems, integrations, hosting |
| Implementation | constraints, transition, risks, timeline |

Studio section keys (implementation): `overview`, `organization`, `operations`, `security-trust`, `experience-sarea`, `integrations`, `commercial`, `roi`, `sow`, `versions-evidence`.

---

## Category index (minimum set)

1. organization identity  
2. purpose / mission  
3. journey and organization context  
4. industry / sector  
5. products / services / operations  
6. customers / beneficiaries  
7. locations / branches  
8. people / teams  
9. roles / responsibilities  
10. workflows / processes  
11. decisions / approvals  
12. systems / tools  
13. data / records  
14. security / trust  
15. compliance / legal  
16. commercial model  
17. current-state pain points  
18. future-state goals  
19. integrations  
20. reports / KPIs  
21. risks / constraints  
22. change readiness  
23. evidence / documents  

---

## MVP field groups (recommended for first Discovery build)

1. **Context carry-forward** from Request (journey, org context, field, purpose, scale, goal)  
2. **Organization shape** (name, locations, departments estimate, operating shape)  
3. **Operating core** (roles, workflows, systems inventory summary, approvals summary)  
4. **Trust core** (identity preference, MFA, sensitivity, compliance drivers, top risks)  
5. **Journey branch** (NEW target shape **or** TRANSFORM current/pain/target)  
6. **Evidence refs** (optional text references)  
7. **ProCrow review surface** (missing info, contradictions, readiness signal)

Industry packs, deep commercial, file uploads, and AI enrichment are **out of MVP**.
