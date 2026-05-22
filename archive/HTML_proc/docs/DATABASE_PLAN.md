# Database plan — CyberCrow (draft entities)

> There is no real database in the static UI yet. The structures below are targets for a future API.

## Core entities

### users

- `id` — UUID
- `email` — unique
- `name_ar` / `name_en` (optional)
- `role` — FK to user roles
- `company_id` — nullable for global admins
- `password_hash` — server only
- `created_at`, `updated_at`

### companies

- `id`
- `name_ar`, `name_legal`, `vat_number` (later)
- `industry`, `employee_band`, `notes`
- `created_at`

### erp_requests

- `id` — UUID for the request
- `company_id` — FK
- `status` — enum (`draft`, `submitted`, `under_review`, `accepted`, `rejected`)
- `plan_id` — FK → subscription_plans
- `security_layer_id` — FK → security_layers
- `user_estimate` — approximate user count
- `timeline` — text or structured value
- `estimated_monthly_sar` — computed number revalidated on the server
- `created_at`, `updated_at`

### erp_modules

- `id`, `slug`, `name_en`, `name_ar`, `icon` (optional UI cue), `monthly_addon_sar`, `is_active`

### selected_modules

- `id`
- `erp_request_id` — FK
- `erp_module_id` — FK
- unique composite index `(erp_request_id, erp_module_id)`

### subscription_plans

- `id`, `name_en`, `name_ar`, `icon` (optional), `base_monthly_sar`, `description_en`, `description_ar`

### security_layers

- `id`, `name_en`, `icon` (optional), `monthly_addon_sar`, `description_en`, `description_ar`

### audit_logs

- `id`
- `actor_user_id` — nullable for system jobs
- `entity_type` — e.g. `erp_request`
- `entity_id`
- `action_ar` — Arabic description of the event
- `metadata_json` — extra detail
- `created_at`

### request_status_history

- `id`
- `erp_request_id` — FK
- `from_status`, `to_status`
- `changed_by_user_id`
- `note_ar` — optional
- `created_at`

## Integration notes

- The server must return the **final price** after business rules are applied.
- Audit logs are **server-written only**; any UI today is illustrative until APIs land.
