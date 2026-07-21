import { claimPendingOutbox, completeOutbox, createDb } from "@ghuravia/data";
import { loadConfig } from "@ghuravia/config";
import { emailDeliveryMock } from "@ghuravia/provider-mocks";

/** Local-only thin outbox runner. It does not contact cloud providers. */
export async function runOnce(): Promise<"idle" | "processed"> {
  const config = loadConfig();
  const { db, sql } = createDb(config.GHURAVIA_DATABASE_URL);
  try {
    const batch = await claimPendingOutbox(db, 20);
    if (batch.length === 0) return "idle";
    for (const event of batch) {
      const correlationId =
        typeof event.payload.correlationId === "string"
          ? event.payload.correlationId
          : event.eventId;
      const result = emailDeliveryMock("success", correlationId);
      await completeOutbox(db, event.eventId, result.outcome === "success");
    }
    return "processed";
  } finally {
    await sql.end({ timeout: 5 });
  }
}
