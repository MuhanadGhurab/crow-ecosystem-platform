import { prisma } from "@/lib/db";

const PLATFORM_ADVISORY_EMAIL = "platform-advisory@internal.crow";

export type SareaStudioMutationKind =
  | "profile_update"
  | "role_map_reassign"
  | "widget_visibility"
  | "navigation_keys";

/** Advisory studio audit via platform_notifications inbox (no new schema). */
export async function logSareaStudioMutation(input: {
  kind: SareaStudioMutationKind;
  summary: string;
  tenantSlug?: string;
  metadata?: Record<string, string>;
}) {
  try {
    await prisma.platformNotification.create({
      data: {
        eventType: "sarea_studio_mutation",
        recipientEmail: PLATFORM_ADVISORY_EMAIL,
        subject: `SAREA Studio · ${input.kind.replace(/_/g, " ")}`,
        body: input.summary,
        status: "logged",
        deliveryStatus: "logged",
        inboxStatus: "open",
        severity: "low",
        metadata: {
          studio: true,
          mutationKind: input.kind,
          ...(input.tenantSlug ? { tenantSlug: input.tenantSlug } : {}),
          ...input.metadata,
        },
      },
    });
  } catch {
    /* never block studio saves */
  }
}
