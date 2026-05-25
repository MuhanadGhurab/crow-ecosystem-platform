import { prisma } from "@/lib/db";

export type PipelineNotificationEvent =
  | "request_received"
  | "discovery_started"
  | "blueprint_ready"
  | "tenant_provisioned";

const TEMPLATES: Record<
  PipelineNotificationEvent,
  (ctx: Record<string, string>) => { subject: string; body: string }
> = {
  request_received: (ctx) => ({
    subject: `Crow Ecosystem — request ${ctx.referenceCode} received`,
    body: `Hello ${ctx.contactName},\n\nWe received your implementation request for ${ctx.organizationName} (${ctx.referenceCode}). Our team will review it shortly.\n\n— Crow Ecosystem`,
  }),
  discovery_started: (ctx) => ({
    subject: `Discovery started — ${ctx.referenceCode}`,
    body: `Discovery has started for ${ctx.organizationName} (${ctx.referenceCode}).\n\nSign in to continue the discovery workspace.\n\n— Crow Ecosystem`,
  }),
  blueprint_ready: (ctx) => ({
    subject: `Blueprint ready for review — ${ctx.organizationName}`,
    body: `Discovery is complete and an enterprise blueprint draft is ready for ${ctx.organizationName} (${ctx.referenceCode ?? "reference pending"}).\n\nReview and approve in the Crow Admin Console.\n\n— Crow Ecosystem`,
  }),
  tenant_provisioned: (ctx) => ({
    subject: `Go-live advisory — tenant /${ctx.tenantSlug}`,
    body: `Your Crow tenant workspace is provisioned.\n\nOrganization: ${ctx.organizationName}\nURL path: /${ctx.tenantSlug}\n\nCyberCrow and SAREA have been initialized. Platform staff: review go-live checklist in admin.\n\n— Crow Ecosystem`,
  }),
};

/** Log notification and send via Resend when RESEND_API_KEY is configured. Never throws. */
export async function notifyPipelineEvent(
  event: PipelineNotificationEvent,
  recipientEmail: string,
  context: Record<string, string>
) {
  const email = recipientEmail.trim().toLowerCase();
  if (!email) return;

  const overrideTo = process.env.PIPELINE_NOTIFY_EMAIL_OVERRIDE?.trim().toLowerCase();
  const sendTo = overrideTo || email;

  const { subject, body } = TEMPLATES[event](context);

  const isGoLiveSignal = event === "blueprint_ready" || event === "tenant_provisioned";

  const row = await prisma.platformNotification.create({
    data: {
      eventType: event,
      recipientEmail: email,
      subject,
      body,
      status: "logged",
      metadata: {
        ...context,
        ...(isGoLiveSignal ? { advisory: true } : {}),
        ...(overrideTo ? { sendToOverride: sendTo } : {}),
      },
    },
  });

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    const skipReason = "RESEND_API_KEY not configured";
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[notification] skipped ${event} → ${email}: configure RESEND_API_KEY (see docs/internal/RESEND_SETUP.md)`
      );
    }
    await prisma.platformNotification.update({
      where: { id: row.id },
      data: { status: "skipped", errorMessage: skipReason },
    });
    return;
  }

  const from = process.env.NOTIFICATION_FROM_EMAIL ?? "Crow Ecosystem <onboarding@resend.dev>";

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [sendTo],
        subject,
        text: body,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText || `Resend HTTP ${res.status}`);
    }

    await prisma.platformNotification.update({
      where: { id: row.id },
      data: { status: "sent" },
    });
  } catch (err) {
    await prisma.platformNotification.update({
      where: { id: row.id },
      data: {
        status: "failed",
        errorMessage: err instanceof Error ? err.message : "Send failed",
      },
    });
  }
}

export async function listPlatformNotifications(limit = 50) {
  return prisma.platformNotification.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}
