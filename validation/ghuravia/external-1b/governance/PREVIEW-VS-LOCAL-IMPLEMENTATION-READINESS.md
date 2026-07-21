# Preview vs Local Implementation Readiness

| Tier | Disposition |
|---|---|
| Local implementation | **MAY PROCEED WITH CONDITIONS** after GHV.IMPLEMENTATION.0A |
| Preview | **BLOCKED** |
| Controlled launch | **NOT READY** |

Local evidence supports a controlled local bootstrap recommendation only: local runtime, workspace topology, ephemeral PostgreSQL, migration/rollback rehearsal, synthetic secrets, provider mocks, and deployment guard. Preview remains blocked by BLK-VAL-001, 002, 003, and 010; real provider paths add relevant secondary blocks.
