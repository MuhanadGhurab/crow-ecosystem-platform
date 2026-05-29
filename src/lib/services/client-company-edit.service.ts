import "@/lib/server-only-guard";

import type { User } from "@supabase/supabase-js";
import { getCrowAuth, isPlatformStaff } from "@/lib/auth/roles";
import {
  CLIENT_PROFILE_EDIT_BLOCKED_DEV,
  type CompanyLinkStatus,
} from "@/lib/client-portal/client-profile-contract";
import type { ClientPortalAuthState } from "@/lib/client-portal/client-portal-contract";
import {
  clientHasStrongRequestOwnership,
  mockDemoStrongOwnership,
} from "@/lib/services/client-approval.service";
import { getClientOrganizationAccessDecisionForRequest } from "@/lib/services/client-organization-link.service";
import { clientCanAccessRequest } from "@/lib/services/client-request-link.service";
import { isAuthDisabled } from "@/lib/supabase/env";
import { isUseMockData } from "@/lib/mock/env";

export type ClientCompanyEditDecision = {
  canEdit: boolean;
  blockedReason: string | null;
};

export async function resolveCanClientEditCompanyProfile(
  user: User,
  requestId: string,
  authState: ClientPortalAuthState,
  linkStatus: CompanyLinkStatus
): Promise<ClientCompanyEditDecision> {
  if (isAuthDisabled()) {
    return { canEdit: false, blockedReason: CLIENT_PROFILE_EDIT_BLOCKED_DEV };
  }

  if (authState === "platform_staff" || isPlatformStaff(getCrowAuth(user).role)) {
    return {
      canEdit: false,
      blockedReason:
        "Platform staff preview cannot edit company profile from the Client Portal.",
    };
  }

  if (linkStatus === "staff_preview") {
    return { canEdit: false, blockedReason: "Staff preview is read-only." };
  }

  const email = user.email;
  if (!email) {
    return {
      canEdit: false,
      blockedReason: "Sign in with your account email to edit company details.",
    };
  }

  const canAccess = await clientCanAccessRequest(user.id, email, requestId).catch(() => false);
  if (!canAccess) {
    return {
      canEdit: false,
      blockedReason: "You do not have access to edit this company profile.",
    };
  }

  const mockStrong =
    isUseMockData() && requestId === "mock-req-003" && mockDemoStrongOwnership(email);
  const strong = mockStrong || (await clientHasStrongRequestOwnership(user.id, requestId));
  if (strong) {
    return { canEdit: true, blockedReason: null };
  }

  const decision = await getClientOrganizationAccessDecisionForRequest(user, requestId).catch(
    () => null
  );
  if (decision?.canApproveScope) {
    return { canEdit: true, blockedReason: null };
  }

  if (linkStatus === "linked_via_contact_email") {
    return {
      canEdit: false,
      blockedReason:
        "Email-only linkage is review-only. Company edits require the account that submitted the request or verified organization ownership.",
    };
  }

  return {
    canEdit: false,
    blockedReason:
      "Company editing requires verified request ownership or an approved organization membership.",
  };
}
