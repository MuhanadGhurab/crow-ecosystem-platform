/**
 * Client Profile + Company Profile read models (I4).
 * Extends I3 portal contract with readiness summaries — no schema migrations.
 */

import type { ClientPortalAuthState } from "@/lib/client-portal/client-portal-contract";
import type { ImplementationRequestStatus } from "@/lib/types/platform";

export type ClientProfileStatus = "complete" | "incomplete" | "not_available";

export type CompanyLinkStatus =
  | "not_linked"
  | "linked_via_contact_email"
  | "linked_via_submitted_by_user"
  | "staff_preview";

export type ClientAccountLinkState =
  | "no_request_submitted"
  | "request_submitted_unlinked"
  | "authenticated_linked"
  | "procrow_verification_required"
  | "staff_preview";

export type ClientProfileReadiness = {
  completenessPercent: number;
  missingFields: string[];
  completedFields: string[];
  riskNotes: string[];
  nextActions: string[];
};

export type ClientProfileSummary = {
  displayName: string | null;
  email: string | null;
  phone: string | null;
  title: string | null;
  preferredLanguage: string | null;
  authProvider: string | null;
  profileStatus: ClientProfileStatus;
  canEdit: boolean;
  editBlockedReason: string | null;
  readiness: ClientProfileReadiness;
};

export type CompanyProfileReadiness = {
  completenessPercent: number;
  missingFields: string[];
  completedFields: string[];
  companyLinkStatus: CompanyLinkStatus;
  riskNotes: string[];
  nextActions: string[];
};

export type CompanyProfileSummary = {
  companyName: string | null;
  industry: string | null;
  employeeBand: string | null;
  region: string | null;
  primaryContactName: string | null;
  primaryContactEmail: string | null;
  selectedModules: string[];
  securityRequirements: string[];
  requestCount: number;
  latestRequestStatus: ImplementationRequestStatus | null;
  latestRequestReference: string | null;
  profileStatus: ClientProfileStatus;
  canEdit: boolean;
  editBlockedReason: string | null;
  readiness: CompanyProfileReadiness;
};

export type ClientProfilePageModel = {
  authState: ClientPortalAuthState;
  accountLinkState: ClientAccountLinkState;
  profile: ClientProfileSummary;
  approvalBlockedReason: string;
};

export type ClientCompanyPageModel = {
  authState: ClientPortalAuthState;
  accountLinkState: ClientAccountLinkState;
  company: CompanyProfileSummary | null;
  requestSummaries: { requestId: string; referenceCode: string; organizationName: string; status: ImplementationRequestStatus }[];
  approvalBlockedReason: string;
};

export const CLIENT_PROFILE_EDIT_BLOCKED_DEV =
  "Profile editing is disabled in local auth bypass mode.";

export const CLIENT_COMPANY_EDIT_BLOCKED_REASON =
  "Company details are managed through your implementation request and ProCrow discovery. Client-side company editing requires a future data contract (I5+).";

export const CLIENT_PROFILE_METADATA_KEYS = [
  "full_name",
  "phone",
  "job_title",
  "preferred_language",
] as const;
