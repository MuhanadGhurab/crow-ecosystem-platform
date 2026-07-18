/**
 * M4D — Application entry for Business Portal invite email delivery.
 */

import type { InviteEmailDeliverySummary } from "@/lib/email/email-delivery-result";
import type { BusinessPortalInviteEmailPayload } from "@/lib/email/email-provider";
import {
  isBusinessPortalInviteEmailConfigured,
  resolveEmailProviderConfig,
} from "@/lib/email/email-provider-config";
import { createConfiguredEmailProvider } from "@/lib/email/providers/configured-provider";

export { isBusinessPortalInviteEmailConfigured };

export async function sendBusinessPortalInviteEmail(
  payload: BusinessPortalInviteEmailPayload
): Promise<InviteEmailDeliverySummary> {
  const config = resolveEmailProviderConfig();
  if (!config) {
    return {
      outcome: "provider_unconfigured",
      operatorMessage:
        "Email delivery is not configured. Copy and send the invite link manually.",
    };
  }

  const provider = createConfiguredEmailProvider(config);
  return provider.sendBusinessPortalInviteEmail(payload);
}
