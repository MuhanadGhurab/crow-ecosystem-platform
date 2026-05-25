/**

 * Manual advisory notification digest — dry-run (console) or optional Resend send.

 *

 *   npm run notifications:digest:dry

 *   npm run notifications:digest:send

 *   npm run notifications:digest:meem:dry

 *   npm run notifications:digest:high:dry

 *

 * Filters (optional):

 *   --tenant=meem-global

 *   --severity=high|medium|low

 *   --category=subscription|usage|go-live

 *   --from=YYYY-MM-DD --to=YYYY-MM-DD

 *   --days=7

 */

import { PrismaClient } from "@prisma/client";



import {

  formatNotificationDigestHtml,

  formatNotificationDigestText,

  generateNotificationDigestWithPrisma,

  logDigestDeliveryWithPrisma,

  parseDigestCliArgs,

  resolveDigestRecipientEmail,

  type NotificationDigest,

} from "../src/lib/services/notification-digest-core";



const prisma = new PrismaClient();



function printDigestSummary(digest: NotificationDigest) {

  const filterParts: string[] = [];

  if (digest.filters.tenantSlug) filterParts.push(`tenant=${digest.filters.tenantSlug}`);

  if (digest.filters.severity) filterParts.push(`severity=${digest.filters.severity}`);

  if (digest.filters.category) filterParts.push(`category=${digest.filters.category}`);



  console.log("\n=== Notification digest (DRY / preview) ===\n");

  console.log(`Period:     ${digest.period}`);

  console.log(`Generated:  ${digest.generatedAt.toISOString()}`);

  console.log(`Window:     ${digest.from.toISOString()} → ${digest.to.toISOString()}`);

  if (filterParts.length > 0) {

    console.log(`Filters:    ${filterParts.join(", ")}`);

  }

  console.log("\nTotals:");

  console.log(`  Advisories in period:   ${digest.totals.advisoriesInPeriod}`);

  console.log(`  Open:                   ${digest.totals.openAdvisories}`);

  console.log(`  Reviewed:               ${digest.totals.reviewedCount}`);

  console.log(`  Dismissed:              ${digest.totals.dismissedCount}`);

  console.log(`  High priority (open):   ${digest.totals.highPriorityOpen}`);

  console.log(`  Tenants needing review: ${digest.totals.tenantsNeedingReview}`);

  console.log("\nBy category:");

  console.log(

    `  subscription=${digest.byCategory.subscription} usage=${digest.byCategory.usage} go_live=${digest.byCategory.go_live}`

  );

  console.log(

    `  plan_mismatch=${digest.byCategory.plan_mismatch} missing_subscription=${digest.byCategory.missing_subscription} enterprise=${digest.byCategory.enterprise_capability}`

  );

  console.log("\nMEEM:");

  console.log(

    JSON.stringify(

      {

        slug: digest.meem.tenantSlug,

        liveIdsSource: digest.meem.liveIdsSource,

        tenantId: digest.meem.tenantId,

        inPeriod: digest.meem.notificationCountInPeriod,

        openInPeriod: digest.meem.openCountInPeriod,

      },

      null,

      2

    )

  );

  if (digest.topTenants.length > 0) {

    console.log("\nTop tenants:");

    for (const t of digest.topTenants) {

      console.log(`  • ${t.displayName ?? t.tenantSlug ?? t.tenantId} open=${t.openCount} high=${t.highCount}`);

    }

  }

  console.log("\nAction links:");

  console.log(`  Notification center:  ${digest.actionLinks.notificationCenter}`);

  console.log(`  Admin overview:       ${digest.actionLinks.adminOverview}`);

  console.log(`  MEEM inbox:           ${digest.actionLinks.meemInbox}`);

  console.log(`  MEEM logistics audit: ${digest.actionLinks.meemLogisticsAudit}`);

  if (digest.actionLinks.meemPlanTab) {

    console.log(`  MEEM plan tab:        ${digest.actionLinks.meemPlanTab}`);

  }

  console.log("\n--- Full text digest ---\n");

  console.log(formatNotificationDigestText(digest));

}



async function sendDigestEmail(digest: NotificationDigest): Promise<boolean> {

  const apiKey = process.env.RESEND_API_KEY?.trim();

  const recipient = resolveDigestRecipientEmail();

  const subject = `Crow Ecosystem — advisory digest (${digest.period})`;

  const text = formatNotificationDigestText(digest);

  const html = formatNotificationDigestHtml(digest);



  if (!recipient) {

    console.warn(

      "\nNo digest recipient configured. Set PIPELINE_NOTIFY_EMAIL_OVERRIDE (or PLATFORM_NOTIFY_EMAIL / PLATFORM_ADMIN_EMAIL / NOTIFICATION_TEST_EMAIL).\n"

    );

    await logDigestDeliveryWithPrisma(prisma, {

      recipientEmail: "platform-advisory@internal.crow",

      subject,

      body: text.slice(0, 4000),

      status: "skipped",

      period: digest.period,

      errorMessage: "No recipient env configured",

    });

    return false;

  }



  if (!apiKey) {

    console.warn("\nResend not configured. Digest generated in dry/log-only mode.\n");

    await logDigestDeliveryWithPrisma(prisma, {

      recipientEmail: recipient,

      subject,

      body: text.slice(0, 4000),

      status: "skipped",

      period: digest.period,

      errorMessage: "RESEND_API_KEY not configured",

    });

    return false;

  }



  const from =

    process.env.NOTIFICATION_FROM_EMAIL?.trim() ?? "Crow Ecosystem <onboarding@resend.dev>";



  try {

    const res = await fetch("https://api.resend.com/emails", {

      method: "POST",

      headers: {

        Authorization: `Bearer ${apiKey}`,

        "Content-Type": "application/json",

      },

      body: JSON.stringify({

        from,

        to: [recipient],

        subject,

        text,

        html,

      }),

    });



    if (!res.ok) {

      const errText = await res.text();

      throw new Error(errText || `Resend HTTP ${res.status}`);

    }



    await logDigestDeliveryWithPrisma(prisma, {

      recipientEmail: recipient,

      subject,

      body: text.slice(0, 4000),

      status: "sent",

      period: digest.period,

    });

    console.log(`\n✓ Digest email sent to ${recipient}\n`);

    return true;

  } catch (err) {

    const message = err instanceof Error ? err.message : "Send failed";

    await logDigestDeliveryWithPrisma(prisma, {

      recipientEmail: recipient,

      subject,

      body: text.slice(0, 4000),

      status: "failed",

      period: digest.period,

      errorMessage: message,

    });

    console.error(`\n✗ Digest send failed: ${message}\n`);

    return false;

  }

}



async function main() {

  const { mode, window, filters } = parseDigestCliArgs(process.argv);



  try {

    const digest = await generateNotificationDigestWithPrisma(prisma, {

      ...window,

      ...filters,

    });



    printDigestSummary(digest);



    if (mode === "dry") {

      console.log("\n(dry-run — no email, no notification row mutation on advisory inbox)\n");

      return;

    }



    console.log("\n=== Send mode ===\n");

    const sent = await sendDigestEmail(digest);

    if (!sent) {

      if (!process.env.RESEND_API_KEY?.trim() || !resolveDigestRecipientEmail()) {

        console.log("Resend not configured. Digest generated in dry/log-only mode.");

        process.exit(0);

      }

      process.exit(1);

    }

  } finally {

    await prisma.$disconnect();

  }

}



main().catch((err) => {

  console.error(err);

  process.exit(1);

});


