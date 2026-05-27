import "@/lib/server-only-guard";

import type { User } from "@supabase/supabase-js";
import { getCrowAuth, isPlatformStaff } from "@/lib/auth/roles";
import {
  CLIENT_PORTAL_APPROVAL_BLOCKED_REASON,
  type ClientPortalAuthState,
} from "@/lib/client-portal/client-portal-contract";
import {
  CLIENT_COMPANY_EDIT_BLOCKED_REASON,
  CLIENT_PROFILE_EDIT_BLOCKED_DEV,
  type ClientAccountLinkState,
  type ClientCompanyPageModel,
  type ClientProfilePageModel,
  type ClientProfileReadiness,
  type ClientProfileStatus,
  type ClientProfileSummary,
  type CompanyLinkStatus,
  type CompanyProfileReadiness,
  type CompanyProfileSummary,
} from "@/lib/client-portal/client-profile-contract";
import { moduleLabel, securityPackageLabel } from "@/lib/catalog-labels";
import { isUseMockData } from "@/lib/mock/env";
import { MOCK_CLIENT_REQUESTS } from "@/lib/mock/portal";
import { MOCK_PIPELINE_REQUESTS } from "@/lib/mock/pipeline";
import type { ImplementationRequestStatus } from "@/lib/types/platform";
import { buildClientPortalDashboardSnapshot } from "@/lib/services/client-portal.service";
import { listClientRequests } from "@/lib/services/client-request-link.service";
import { isAuthDisabled } from "@/lib/supabase/env";

type ProfileMetadata = {
  full_name?: string;
  phone?: string;
  job_title?: string;
  preferred_language?: string;
};

function profileMetadata(user: User): ProfileMetadata {
  return (user.user_metadata ?? {}) as ProfileMetadata;
}

function authProviderLabel(user: User): string | null {
  const provider = user.app_metadata?.provider as string | undefined;
  if (provider) return provider;
  const identities = user.identities;
  if (identities?.length) {
    return identities.map((i) => i.provider).filter(Boolean).join(", ") || null;
  }
  return user.email ? "email" : null;
}

function buildProfileReadiness(
  fields: { key: string; label: string; value: string | null | undefined }[]
): ClientProfileReadiness {
  const missingFields: string[] = [];
  const completedFields: string[] = [];
  for (const f of fields) {
    const filled = Boolean(f.value && String(f.value).trim());
    if (filled) completedFields.push(f.label);
    else missingFields.push(f.label);
  }
  const total = fields.length;
  const completenessPercent =
    total === 0 ? 0 : Math.round((completedFields.length / total) * 100);

  const riskNotes: string[] = [];
  if (missingFields.includes("Phone")) {
    riskNotes.push("ProCrow may need a phone number for scheduling discovery calls.");
  }
  if (missingFields.includes("Display name")) {
    riskNotes.push("A display name helps ProCrow personalize communications.");
  }

  const nextActions: string[] = [];
  if (missingFields.length > 0) {
    nextActions.push("Complete your profile fields below to improve readiness.");
  } else {
    nextActions.push("Profile basics are complete. Review your company profile next.");
  }

  return {
    completenessPercent,
    missingFields,
    completedFields,
    riskNotes,
    nextActions,
  };
}

function buildCompanyReadiness(row: {
  companyName: string;
  industry: string | null;
  employeeBand: string | null;
  region: string | null;
  primaryContactName: string | null;
  primaryContactEmail: string | null;
  selectedModules: string[];
  securityRequirements: string[];
  linkStatus: CompanyLinkStatus;
}): CompanyProfileReadiness {
  const fieldChecks = [
    { label: "Company name", ok: Boolean(row.companyName) },
    { label: "Industry", ok: Boolean(row.industry) },
    { label: "Employee band", ok: Boolean(row.employeeBand) },
    { label: "Region", ok: Boolean(row.region) },
    { label: "Primary contact name", ok: Boolean(row.primaryContactName) },
    { label: "Primary contact email", ok: Boolean(row.primaryContactEmail) },
    { label: "Selected modules", ok: row.selectedModules.length > 0 },
    { label: "Security requirements", ok: row.securityRequirements.length > 0 },
  ];

  const missingFields = fieldChecks.filter((f) => !f.ok).map((f) => f.label);
  const completedFields = fieldChecks.filter((f) => f.ok).map((f) => f.label);
  const total = fieldChecks.length;
  const completenessPercent = Math.round((completedFields.length / total) * 100);

  const riskNotes: string[] = [];
  if (missingFields.length > 0) {
    riskNotes.push("ProCrow may request additional company details during discovery.");
  }
  if (row.linkStatus === "staff_preview") {
    riskNotes.push("Staff preview — company data is shown only when safely linked to your sign-in.");
  }

  const nextActions: string[] = [];
  if (row.linkStatus === "not_linked") {
    nextActions.push("Submit an implementation request or sign in with your primary contact email.");
  } else if (missingFields.length > 0) {
    nextActions.push("Work with ProCrow to complete company details during discovery.");
  } else {
    nextActions.push("Company profile is well populated for the linked request.");
  }

  return {
    completenessPercent,
    missingFields,
    completedFields,
    companyLinkStatus: row.linkStatus,
    riskNotes,
    nextActions,
  };
}

function profileStatusFromReadiness(percent: number): ClientProfileStatus {
  if (percent >= 100) return "complete";
  if (percent > 0) return "incomplete";
  return "incomplete";
}

function resolveAccountLinkState(
  authState: ClientPortalAuthState,
  requestCount: number,
  hasEmail: boolean
): ClientAccountLinkState {
  if (authState === "platform_staff") return "staff_preview";
  if (authState === "authenticated_linked") return "authenticated_linked";
  if (authState === "authenticated_unlinked" && hasEmail && requestCount === 0) {
    return "no_request_submitted";
  }
  if (authState === "authenticated_unlinked" && hasEmail) {
    return "request_submitted_unlinked";
  }
  return "no_request_submitted";
}

function resolveCompanyLinkStatus(
  authState: ClientPortalAuthState,
  rows: { submittedByUserId: string | null }[],
  userId: string
): CompanyLinkStatus {
  if (authState === "platform_staff") return "staff_preview";
  if (rows.length === 0) return "not_linked";
  if (rows.some((r) => r.submittedByUserId === userId)) return "linked_via_submitted_by_user";
  return "linked_via_contact_email";
}

export function buildClientProfileSummary(user: User): ClientProfileSummary {
  const meta = profileMetadata(user);
  const displayName = meta.full_name?.trim() || user.email || null;
  const phone = meta.phone?.trim() || null;
  const title = meta.job_title?.trim() || null;
  const preferredLanguage = meta.preferred_language?.trim() || null;
  const email = user.email ?? null;

  const readiness = buildProfileReadiness([
    { key: "displayName", label: "Display name", value: displayName },
    { key: "email", label: "Email", value: email },
    { key: "phone", label: "Phone", value: phone },
    { key: "title", label: "Job title", value: title },
  ]);

  const profileStatus = profileStatusFromReadiness(readiness.completenessPercent);
  const canEdit = !isAuthDisabled() && !isPlatformStaff(getCrowAuth(user).role);
  const editBlockedReason = isAuthDisabled()
    ? CLIENT_PROFILE_EDIT_BLOCKED_DEV
    : isPlatformStaff(getCrowAuth(user).role)
      ? "Staff accounts use platform settings — profile editing here is for client accounts."
      : null;

  return {
    displayName,
    email,
    phone,
    title,
    preferredLanguage,
    authProvider: authProviderLabel(user),
    profileStatus,
    canEdit,
    editBlockedReason,
    readiness,
  };
}

async function buildCompanyFromRows(
  user: User,
  authState: ClientPortalAuthState
): Promise<{ company: CompanyProfileSummary | null; requests: ClientCompanyPageModel["requestSummaries"] }> {
  if (isUseMockData()) {
    const mockReq = MOCK_CLIENT_REQUESTS[0];
    const pipeline = MOCK_PIPELINE_REQUESTS.find((p) => p.id === mockReq?.id);
    if (!mockReq) return { company: null, requests: [] };

    const modules =
      pipeline && "modules" in pipeline
        ? (pipeline as { modules: string[] }).modules.map((m) => moduleLabel(m))
        : ["Operations", "Finance"];

    const industry =
      pipeline && "industry" in pipeline
        ? String((pipeline as { industry: string }).industry)
        : "Retail";
    const employeeBand =
      pipeline && "employeeBand" in pipeline
        ? String((pipeline as { employeeBand: string }).employeeBand)
        : "201-500";

    const readiness = buildCompanyReadiness({
      companyName: mockReq.organizationName,
      industry,
      employeeBand,
      region: "SA",
      primaryContactName: "Demo sponsor",
      primaryContactEmail: user.email ?? "client.demo@alnoor.test",
      selectedModules: modules,
      securityRequirements: ["Standard security baseline"],
      linkStatus: "linked_via_contact_email",
    });

    const company: CompanyProfileSummary = {
      companyName: mockReq.organizationName,
      industry,
      employeeBand,
      region: "SA",
      primaryContactName: "Demo sponsor",
      primaryContactEmail: user.email ?? null,
      selectedModules: modules,
      securityRequirements: ["Standard security baseline"],
      requestCount: MOCK_CLIENT_REQUESTS.length,
      latestRequestStatus: mockReq.status,
      latestRequestReference: mockReq.referenceCode,
      profileStatus: profileStatusFromReadiness(readiness.completenessPercent),
      canEdit: false,
      editBlockedReason: CLIENT_COMPANY_EDIT_BLOCKED_REASON,
      readiness,
    };

    return {
      company,
      requests: MOCK_CLIENT_REQUESTS.map((r) => ({
        requestId: r.id,
        referenceCode: r.referenceCode,
        organizationName: r.organizationName,
        status: r.status,
      })),
    };
  }

  if (!user.email) return { company: null, requests: [] };

  try {
    const rows = await listClientRequests(user.id, user.email);
    if (rows.length === 0) return { company: null, requests: [] };

    const linkStatus = resolveCompanyLinkStatus(authState, rows, user.id);
    const primary = rows[0];
    const contact = primary.contacts.find((c) => c.isPrimary) ?? primary.contacts[0];
    const selectedModules = primary.requestedModules.map((m) => moduleLabel(m.moduleKey));
    const securityRequirements = primary.requestedSecurityPkgs.map((p) =>
      securityPackageLabel(p.packageKey)
    );

    const readiness = buildCompanyReadiness({
      companyName: primary.organizationName,
      industry: primary.industry,
      employeeBand: primary.employeeBand,
      region: primary.countryCode || null,
      primaryContactName: contact?.fullName ?? null,
      primaryContactEmail: contact?.email ?? null,
      selectedModules,
      securityRequirements,
      linkStatus,
    });

    const company: CompanyProfileSummary = {
      companyName: primary.organizationName,
      industry: primary.industry,
      employeeBand: primary.employeeBand,
      region: primary.countryCode || null,
      primaryContactName: contact?.fullName ?? null,
      primaryContactEmail: contact?.email ?? null,
      selectedModules,
      securityRequirements,
      requestCount: rows.length,
      latestRequestStatus: primary.status as ImplementationRequestStatus,
      latestRequestReference: primary.referenceCode,
      profileStatus: profileStatusFromReadiness(readiness.completenessPercent),
      canEdit: false,
      editBlockedReason: CLIENT_COMPANY_EDIT_BLOCKED_REASON,
      readiness,
    };

    return {
      company,
      requests: rows.map((r) => ({
        requestId: r.id,
        referenceCode: r.referenceCode,
        organizationName: r.organizationName,
        status: r.status as ImplementationRequestStatus,
      })),
    };
  } catch {
    return { company: null, requests: [] };
  }
}

export async function buildClientProfilePageModel(user: User): Promise<ClientProfilePageModel> {
  const snapshot = await buildClientPortalDashboardSnapshot(user);
  const profile = buildClientProfileSummary(user);
  const accountLinkState = resolveAccountLinkState(
    snapshot.authState,
    snapshot.requests.length,
    Boolean(user.email)
  );

  return {
    authState: snapshot.authState,
    accountLinkState,
    profile,
    approvalBlockedReason: CLIENT_PORTAL_APPROVAL_BLOCKED_REASON,
  };
}

export async function buildClientCompanyPageModel(user: User): Promise<ClientCompanyPageModel> {
  const snapshot = await buildClientPortalDashboardSnapshot(user);
  const { company, requests } = await buildCompanyFromRows(user, snapshot.authState);
  const accountLinkState = resolveAccountLinkState(
    snapshot.authState,
    snapshot.requests.length,
    Boolean(user.email)
  );

  return {
    authState: snapshot.authState,
    accountLinkState,
    company,
    requestSummaries: requests,
    approvalBlockedReason: CLIENT_PORTAL_APPROVAL_BLOCKED_REASON,
  };
}

export type ClientProfileDashboardHints = {
  profileCompleteness: number;
  companyCompleteness: number | null;
  accountLinkState: ClientAccountLinkState;
  profileMissingCount: number;
  companyMissingCount: number | null;
};

export async function buildClientProfileDashboardHints(
  user: User
): Promise<ClientProfileDashboardHints> {
  const snapshot = await buildClientPortalDashboardSnapshot(user);
  const profile = buildClientProfileSummary(user);
  const { company } = await buildCompanyFromRows(user, snapshot.authState);

  return {
    profileCompleteness: profile.readiness.completenessPercent,
    companyCompleteness: company?.readiness.completenessPercent ?? null,
    accountLinkState: resolveAccountLinkState(
      snapshot.authState,
      snapshot.requests.length,
      Boolean(user.email)
    ),
    profileMissingCount: profile.readiness.missingFields.length,
    companyMissingCount: company?.readiness.missingFields.length ?? null,
  };
}
