# Client Configuration Modes

## 1. Recommend Everything (default)

Crow recommends capabilities, responsibilities, and workflows. Client may opt in to **Let ProCrow choose the technical configuration**.

## 2. Guide Me

Adds controlled capability customization with recommendations shown first.

## 3. Expert Configuration

Exposes priority, model comparison, workflows, and advanced customization. Clearly labeled for IT/security specialists.

Clients can switch back to recommendations without losing field, purpose, or team selections.

## Persistence

Stored in `client_enterprise_design` draft JSON:

- `configurationMode`
- `letProcrowDecideTechnical`

No migration required.
