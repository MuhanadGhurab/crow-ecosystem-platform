# Provider mocks

Identity, email delivery, and observability mocks are deterministic success/failure/timeout/duplicate simulations. They make no network calls.

- Authentication is not activation
- Delivery is not verification
- Telemetry is not audit or progression
- In-memory mock mailbox stores verification tokens for local/test only
- **No SMS / mobile mock** in the 0B activation formula
