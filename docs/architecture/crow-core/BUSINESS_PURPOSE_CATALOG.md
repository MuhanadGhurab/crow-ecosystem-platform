# Business Purpose Catalog

> **Status:** CURRENT — CROW.DISCOVERY.2  
> **Module:** `src/lib/client-enterprise-design/purposes/business-purpose-catalog.ts`

## Purpose

Business purpose is a first-class concept separate from industry field. Two organizations in the same industry may require different operating models based on what they are building and how they deliver value.

## Purpose families (20)

| Key | Client name |
| --- | ----------- |
| `sell_products` | Sell products |
| `deliver_professional_services` | Deliver professional services |
| `manage_cases` | Manage cases and matters |
| `deliver_projects` | Deliver projects |
| `operate_assets` | Operate assets |
| `run_field_services` | Run field services |
| `manage_memberships` | Manage memberships |
| `produce_content` | Produce content |
| `operate_live_services` | Operate live services |
| `manage_events` | Manage events |
| `provide_training` | Provide training |
| `manage_properties` | Manage properties |
| `rent_equipment` | Rent equipment |
| `operate_logistics` | Operate logistics |
| `manufacture_goods` | Manufacture goods |
| `manage_contractors` | Manage contractors |
| `run_customer_support` | Run customer support |
| `manage_research` | Manage research |
| `operate_multi_branch_services` | Operate multi-branch services |
| `build_a_marketplace` | Build a marketplace |

Each definition includes applicable industries, specialist domains, recommended capabilities, workflows, Work Personas, scale behavior, automation opportunities, and risk considerations.

## Industry and domain mapping

`industry-purpose-mappings.ts` maps every industry archetype and specialist domain to meaningful purpose recommendations. `assertIndustryPurposeCoverage()` enforces zero-gap coverage in tests.

## Authority

Purpose selections are **advisory** client Discovery answers. They do not provision software or grant authority.
