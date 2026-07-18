/**
 * M4D — Provider-neutral invite email contract.
 */

import type { InviteEmailDeliverySummary } from "@/lib/email/email-delivery-result";

export type BusinessPortalInviteEmailPayload = {
  recipientEmail: string;
  tenantName: string;
  invitedRole: "tenant_user" | "tenant_admin";
  inviteUrl: string;
  expiresAt: Date;
  invitedByDisplayName: string;
};

export type EmailProvider = {
  sendBusinessPortalInviteEmail(
    payload: BusinessPortalInviteEmailPayload
  ): Promise<InviteEmailDeliverySummary>;
};
