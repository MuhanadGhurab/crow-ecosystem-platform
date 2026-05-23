/**
 * Summarize recent platformNotification rows.
 * Usage: npm run notifications:check
 */
import { config } from "dotenv";
import { PrismaClient } from "@prisma/client";

config();
const prisma = new PrismaClient();

try {
  const rows = await prisma.platformNotification.findMany({
    orderBy: { createdAt: "desc" },
    take: 12,
    select: {
      eventType: true,
      recipientEmail: true,
      status: true,
      errorMessage: true,
      createdAt: true,
    },
  });

  console.log("\n=== Recent notifications ===\n");
  if (!rows.length) {
    console.log("(none — run smoke:phase1 or submit a request)\n");
    process.exit(0);
  }

  const counts = { sent: 0, skipped: 0, failed: 0, logged: 0, other: 0 };
  for (const r of rows) {
    counts[r.status] = (counts[r.status] ?? 0) + 1;
    const err = r.errorMessage ? ` — ${r.errorMessage.slice(0, 48)}` : "";
    console.log(`${r.status.padEnd(7)} ${r.eventType.padEnd(20)} → ${r.recipientEmail}${err}`);
  }
  console.log("\nCounts (last 12):", counts);
  console.log("");
} finally {
  await prisma.$disconnect();
}
