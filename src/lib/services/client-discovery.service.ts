import "@/lib/server-only-guard";

import type { User } from "@supabase/supabase-js";
import type { Prisma } from "@prisma/client";
import { getCrowAuth, isPlatformStaff } from "@/lib/auth/roles";
import {
  CLIENT_DISCOVERY_PRICING_HONESTY_COPY,
  CLIENT_DISCOVERY_SECTION,
  type ClientDiscoveryDraft,
  type ClientDiscoveryIndustryTemplate,
  type ClientDiscoveryPageModel,
  type ClientDiscoveryStageTemplate,
  type ClientDiscoveryStatus,
  type ClientDiscoveryStep,
} from "@/lib/client-portal/client-discovery-contract";
import { CLIENT_PORTAL_EMPLOYEE_BAND_VALUES } from "@/lib/client-portal/client-company-profile-fields";
import { listDiscoveryTemplateKeys } from "@/lib/constants/industry-templates";
import { MODELED_SECTOR_CATALOG } from "@/lib/constants/sector-catalog";
import { CEM_MODULES, type CemModuleKey } from "@/lib/constants/modules";
import { prisma } from "@/lib/db";
import { isUseMockData } from "@/lib/mock/env";
import { isMockClientRequestId, getMockClientRequest } from "@/lib/mock/portal";
import { buildClientPortalDashboardSnapshot } from "@/lib/services/client-portal.service";
import { resolveCanClientEditCompanyProfile } from "@/lib/services/client-company-edit.service";
import { resolveCompanyLinkStatusForRequest } from "@/lib/services/client-profile.service";
import { clientCanAccessRequest } from "@/lib/services/client-request-link.service";
import { upsertDiscoveryAnswer } from "@/lib/services/discovery.service";
import { buildClientDiscoveryRecommendations } from "@/lib/services/client-discovery-recommendations";
import {
  PROCROW_DISCOVERY_CHANGE_SECTION_ALLOWLIST,
  PROCROW_DISCOVERY_CLIENT_ACCEPTED_MESSAGE,
  type ProCrowDiscoveryChangeRequest,
} from "@/lib/procrow/procrow-discovery-review-contract";
import { isAuthDisabled } from "@/lib/supabase/env";

const VALID_MODULE_KEYS = new Set(CEM_MODULES.map((m) => m.key));

const DISCOVERY_STEPS: ClientDiscoveryStep[] = [
  "company_size",
  "industry_template",
  "company_stage",
  "modules",
  "departments",
  "roles",
  "workflows",
  "security",
  "sarea",
  "review_submit",
];

function parseAnswerString(
  answers: { sectionKey: string; questionKey: string; valueJson: unknown }[],
  questionKey: string
): string | null {
  const row = answers.find(
    (a) => a.sectionKey === CLIENT_DISCOVERY_SECTION && a.questionKey === questionKey
  );
  if (!row) return null;
  const v = row.valueJson;
  if (typeof v === "string") return v.trim() || null;
  if (v === null || v === undefined) return null;
  return String(v);
}

function parseAnswerStringArray(
  answers: { sectionKey: string; questionKey: string; valueJson: unknown }[],
  questionKey: string
): string[] {
  const row = answers.find(
    (a) => a.sectionKey === CLIENT_DISCOVERY_SECTION && a.questionKey === questionKey
  );
  if (!row) return [];
  const v = row.valueJson;
  if (Array.isArray(v)) return v.map(String).filter(Boolean);
  if (typeof v === "string" && v.trim()) return v.split(",").map((s) => s.trim()).filter(Boolean);
  return [];
}

function parseClientProcrowFeedbackFromAnswers(
  answers: { sectionKey: string; questionKey: string; valueJson: unknown }[]
): {
  changeRequest: ProCrowDiscoveryChangeRequest | null;
} {
  const message = parseAnswerString(answers, "changeRequestMessage");
  if (!message) return { changeRequest: null };
  const sections = parseAnswerStringArray(answers, "changeRequestSections").filter(
    (s): s is ClientDiscoveryStep =>
      (PROCROW_DISCOVERY_CHANGE_SECTION_ALLOWLIST as readonly string[]).includes(s)
  );
  const requestedAt = parseAnswerString(answers, "changeRequestedAt");
  if (!requestedAt) return { changeRequest: null };
  return {
    changeRequest: {
      message,
      requestedSections: sections,
      requestedAt,
      requestedBy: parseAnswerString(answers, "changeRequestedBy"),
    },
  };
}

export async function ensureClientDiscoveryProfile(requestId: string) {
  return prisma.discoveryProfile.upsert({
    where: { requestId },
    create: { requestId, status: "NOT_STARTED" },
    update: {},
  });
}

export function buildDraftFromContext(
  requestId: string,
  request: {
    industry: string | null;
    employeeBand: string | null;
    requestedModules: { moduleKey: string }[];
    discoveryProfile: {
      updatedAt: Date;
      departments: { name: string }[];
      roles: { name: string }[];
      workflows: { name: string }[];
      answers: { sectionKey: string; questionKey: string; valueJson: unknown }[];
    } | null;
  }
): ClientDiscoveryDraft {
  const answers = request.discoveryProfile?.answers ?? [];
  const status =
    (parseAnswerString(answers, "status") as ClientDiscoveryStatus | null) ?? "not_started";

  const industryFromAnswer = parseAnswerString(answers, "industryTemplate");
  const industryTemplate = (industryFromAnswer ??
    request.industry ??
    null) as ClientDiscoveryIndustryTemplate | null;

  const stageRaw = parseAnswerString(answers, "companyStageTemplate");
  const companyStageTemplate = (stageRaw as ClientDiscoveryStageTemplate | null) ?? null;

  const moduleKeysFromAnswer = parseAnswerStringArray(answers, "selectedModules");
  const selectedModules =
    moduleKeysFromAnswer.length > 0
      ? moduleKeysFromAnswer
      : request.requestedModules.map((m) => m.moduleKey);

  const deptFromAnswer = parseAnswerStringArray(answers, "selectedDepartments");
  const selectedDepartments =
    deptFromAnswer.length > 0
      ? deptFromAnswer
      : (request.discoveryProfile?.departments.map((d) => d.name) ?? []);

  const rolesFromAnswer = parseAnswerStringArray(answers, "selectedRoles");
  const selectedRoles =
    rolesFromAnswer.length > 0
      ? rolesFromAnswer
      : (request.discoveryProfile?.roles.map((r) => r.name) ?? []);

  const wfFromAnswer = parseAnswerStringArray(answers, "selectedWorkflows");
  const selectedWorkflows =
    wfFromAnswer.length > 0
      ? wfFromAnswer
      : (request.discoveryProfile?.workflows.map((w) => w.name) ?? []);

  return {
    requestId,
    status,
    industryTemplate,
    companyStageTemplate,
    employeeBand: parseAnswerString(answers, "employeeBand") ?? request.employeeBand,
    expectedUsers: parseAnswerString(answers, "expectedUsers"),
    selectedDepartments,
    selectedRoles,
    selectedModules,
    selectedWorkflows,
    securityPreference: parseAnswerString(answers, "securityPreference"),
    sareaPreference: parseAnswerString(answers, "sareaPreference"),
    notes: parseAnswerString(answers, "notes"),
    submittedAt: parseAnswerString(answers, "submittedAt"),
    updatedAt: request.discoveryProfile?.updatedAt.toISOString() ?? null,
  };
}

export function computeClientDiscoveryMissingSteps(
  draft: ClientDiscoveryDraft
): ClientDiscoveryStep[] {
  const missing: ClientDiscoveryStep[] = [];
  if (!draft.employeeBand) missing.push("company_size");
  if (!draft.industryTemplate) missing.push("industry_template");
  if (!draft.companyStageTemplate) missing.push("company_stage");
  if (draft.selectedModules.length === 0) missing.push("modules");
  if (draft.selectedDepartments.length === 0) missing.push("departments");
  if (draft.selectedRoles.length === 0) missing.push("roles");
  if (draft.selectedWorkflows.length === 0) missing.push("workflows");
  if (!draft.securityPreference) missing.push("security");
  if (!draft.sareaPreference) missing.push("sarea");
  return missing;
}

/** @deprecated Use computeClientDiscoveryMissingSteps */
const computeMissingSteps = computeClientDiscoveryMissingSteps;

export async function buildClientDiscoveryPageModel(
  user: User,
  requestId: string
): Promise<ClientDiscoveryPageModel | null> {
  if (isUseMockData() && isMockClientRequestId(requestId)) {
    const mock = getMockClientRequest(requestId);
    if (!mock) return null;
    const snapshot = await buildClientPortalDashboardSnapshot(user);
    const draft: ClientDiscoveryDraft = {
      requestId,
      status: "in_progress",
      industryTemplate: "logistics",
      companyStageTemplate: "growth",
      employeeBand: "51-200",
      expectedUsers: null,
      selectedDepartments: ["Logistics Operations", "Finance"],
      selectedRoles: ["Operations manager"],
      selectedModules: ["logistics", "finance", "crm"],
      selectedWorkflows: ["Dispatch coordination"],
      securityPreference: "Standard baseline",
      sareaPreference: "Role-based dashboards",
      notes: null,
      submittedAt: null,
      updatedAt: null,
    };
    return {
      requestId,
      referenceCode: mock.referenceCode,
      organizationName: mock.organizationName,
      canEdit: false,
      editBlockedReason: "Discovery editing is disabled in demo mock mode.",
      draft,
      recommendations: buildClientDiscoveryRecommendations({
        industryTemplate: draft.industryTemplate,
        companyStageTemplate: draft.companyStageTemplate,
      }),
      missingSteps: [],
      nextStep: "review_submit",
      pricingHonestyCopy: CLIENT_DISCOVERY_PRICING_HONESTY_COPY,
      procrowChangeRequest: null,
      procrowAcceptedMessage: null,
    };
  }

  if (!user.email) return null;
  const canAccess = await clientCanAccessRequest(user.id, user.email, requestId).catch(() => false);
  if (!canAccess) return null;

  const request = await prisma.implementationRequest.findUnique({
    where: { id: requestId },
    include: {
      requestedModules: true,
      discoveryProfile: {
        include: {
          answers: true,
          departments: true,
          roles: true,
          workflows: true,
        },
      },
    },
  });
  if (!request) return null;

  const snapshot = await buildClientPortalDashboardSnapshot(user);
  const linkStatus = resolveCompanyLinkStatusForRequest(
    snapshot.authState,
    request.submittedByUserId,
    user.id
  );
  const editDecision = await resolveCanClientEditCompanyProfile(
    user,
    requestId,
    snapshot.authState,
    linkStatus
  );

  const draft = buildDraftFromContext(requestId, request);
  const answers = request.discoveryProfile?.answers ?? [];
  const { changeRequest } = parseClientProcrowFeedbackFromAnswers(answers);
  const missingSteps = computeMissingSteps(draft);
  const clientEditableStatuses = new Set([
    "not_started",
    "in_progress",
    "changes_requested",
  ]);
  const canEdit = editDecision.canEdit && clientEditableStatuses.has(draft.status);

  let editBlockedReason = editDecision.blockedReason;
  if (draft.status === "accepted_into_blueprint") {
    editBlockedReason = PROCROW_DISCOVERY_CLIENT_ACCEPTED_MESSAGE;
  } else if (draft.status === "submitted_for_procrow_review") {
    editBlockedReason =
      "Discovery is submitted for ProCrow review. Contact ProCrow if you need changes.";
  } else if (draft.status === "procrow_reviewing") {
    editBlockedReason = "ProCrow is reviewing your discovery. You cannot edit until changes are requested.";
  }

  const nextStep =
    draft.status === "submitted_for_procrow_review" ||
    draft.status === "procrow_reviewing" ||
    draft.status === "accepted_into_blueprint"
      ? null
      : (missingSteps[0] ?? "review_submit");

  return {
    requestId,
    referenceCode: request.referenceCode,
    organizationName: request.organizationName,
    canEdit,
    editBlockedReason,
    draft,
    recommendations: buildClientDiscoveryRecommendations({
      industryTemplate: draft.industryTemplate,
      companyStageTemplate: draft.companyStageTemplate,
    }),
    missingSteps,
    nextStep,
    pricingHonestyCopy: CLIENT_DISCOVERY_PRICING_HONESTY_COPY,
    procrowChangeRequest:
      draft.status === "changes_requested" ? changeRequest : null,
    procrowAcceptedMessage:
      draft.status === "accepted_into_blueprint"
        ? PROCROW_DISCOVERY_CLIENT_ACCEPTED_MESSAGE
        : null,
  };
}

export type ClientDiscoveryDraftInput = {
  requestId: string;
  industryTemplate?: string;
  companyStageTemplate?: string;
  employeeBand?: string;
  expectedUsers?: string;
  selectedModules?: string[];
  selectedDepartments?: string[];
  selectedRoles?: string[];
  selectedWorkflows?: string[];
  securityPreference?: string;
  sareaPreference?: string;
  notes?: string;
};

function validateIndustryTemplate(value: string | undefined): ClientDiscoveryIndustryTemplate | null {
  if (!value?.trim()) return null;
  const key = value.trim();
  if (key === "general") return "general";
  if (listDiscoveryTemplateKeys().includes(key as never)) return key as ClientDiscoveryIndustryTemplate;
  if (MODELED_SECTOR_CATALOG.some((s) => s.key === key)) return key as ClientDiscoveryIndustryTemplate;
  return null;
}

function validateStage(value: string | undefined): ClientDiscoveryStageTemplate | null {
  if (value === "startup" || value === "growth" || value === "enterprise") return value;
  return null;
}

function validateModules(keys: string[] | undefined): CemModuleKey[] {
  if (!keys?.length) return [];
  return keys.filter((k): k is CemModuleKey => VALID_MODULE_KEYS.has(k as CemModuleKey));
}

async function assertClientDiscoveryWrite(user: User, requestId: string) {
  if (isAuthDisabled()) {
    throw new Error("Discovery editing is disabled in local auth bypass mode.");
  }
  if (isPlatformStaff(getCrowAuth(user).role)) {
    throw new Error("Platform staff cannot edit client discovery from the Client Portal.");
  }
  if (!user.email) throw new Error("Sign in required.");
  const allowed = await clientCanAccessRequest(user.id, user.email, requestId);
  if (!allowed) throw new Error("You do not have access to this request.");

  const request = await prisma.implementationRequest.findUnique({
    where: { id: requestId },
    select: { submittedByUserId: true },
  });
  if (!request) throw new Error("Request not found.");

  const snapshot = await buildClientPortalDashboardSnapshot(user);
  const linkStatus = resolveCompanyLinkStatusForRequest(
    snapshot.authState,
    request.submittedByUserId,
    user.id
  );
  const edit = await resolveCanClientEditCompanyProfile(
    user,
    requestId,
    snapshot.authState,
    linkStatus
  );
  if (!edit.canEdit) {
    throw new Error(edit.blockedReason ?? "You cannot edit discovery for this request.");
  }
}

async function syncStructuredDiscovery(
  requestId: string,
  profileId: string,
  input: ClientDiscoveryDraftInput
) {
  if (input.selectedDepartments) {
    await prisma.discoveryDepartment.deleteMany({ where: { profileId } });
    if (input.selectedDepartments.length > 0) {
      await prisma.discoveryDepartment.createMany({
        data: input.selectedDepartments.slice(0, 40).map((name) => ({ profileId, name })),
      });
    }
  }
  if (input.selectedRoles) {
    await prisma.discoveryRole.deleteMany({ where: { profileId } });
    if (input.selectedRoles.length > 0) {
      await prisma.discoveryRole.createMany({
        data: input.selectedRoles.slice(0, 60).map((name) => ({ profileId, name })),
      });
    }
  }
  if (input.selectedWorkflows) {
    await prisma.discoveryWorkflow.deleteMany({ where: { profileId } });
    if (input.selectedWorkflows.length > 0) {
      await prisma.discoveryWorkflow.createMany({
        data: input.selectedWorkflows.slice(0, 40).map((name) => ({ profileId, name })),
      });
    }
  }
}

export async function saveClientDiscoveryDraft(
  user: User,
  input: ClientDiscoveryDraftInput
): Promise<void> {
  await assertClientDiscoveryWrite(user, input.requestId);
  const profile = await ensureClientDiscoveryProfile(input.requestId);

  const industry = validateIndustryTemplate(input.industryTemplate);
  const stage = validateStage(input.companyStageTemplate);
  const modules = validateModules(input.selectedModules);

  if (
    input.employeeBand &&
    !(CLIENT_PORTAL_EMPLOYEE_BAND_VALUES as readonly string[]).includes(input.employeeBand)
  ) {
    throw new Error("Invalid employee band.");
  }

  const requestUpdate: Prisma.ImplementationRequestUpdateInput = {};
  if (input.employeeBand) requestUpdate.employeeBand = input.employeeBand;
  if (industry && industry !== "general") requestUpdate.industry = industry;

  if (Object.keys(requestUpdate).length > 0) {
    await prisma.implementationRequest.update({
      where: { id: input.requestId },
      data: requestUpdate,
    });
  }

  if (modules.length > 0) {
    await prisma.requestedModule.deleteMany({ where: { requestId: input.requestId } });
    await prisma.requestedModule.createMany({
      data: modules.map((moduleKey) => ({ requestId: input.requestId, moduleKey })),
      skipDuplicates: true,
    });
  }

  await upsertDiscoveryAnswer(input.requestId, CLIENT_DISCOVERY_SECTION, "status", "in_progress");
  if (industry) {
    await upsertDiscoveryAnswer(
      input.requestId,
      CLIENT_DISCOVERY_SECTION,
      "industryTemplate",
      industry
    );
  }
  if (stage) {
    await upsertDiscoveryAnswer(
      input.requestId,
      CLIENT_DISCOVERY_SECTION,
      "companyStageTemplate",
      stage
    );
  }
  if (input.employeeBand) {
    await upsertDiscoveryAnswer(
      input.requestId,
      CLIENT_DISCOVERY_SECTION,
      "employeeBand",
      input.employeeBand
    );
  }
  if (input.expectedUsers !== undefined) {
    await upsertDiscoveryAnswer(
      input.requestId,
      CLIENT_DISCOVERY_SECTION,
      "expectedUsers",
      input.expectedUsers
    );
  }
  if (input.selectedModules) {
    await upsertDiscoveryAnswer(
      input.requestId,
      CLIENT_DISCOVERY_SECTION,
      "selectedModules",
      modules
    );
  }
  if (input.selectedDepartments) {
    await upsertDiscoveryAnswer(
      input.requestId,
      CLIENT_DISCOVERY_SECTION,
      "selectedDepartments",
      input.selectedDepartments.slice(0, 40)
    );
  }
  if (input.selectedRoles) {
    await upsertDiscoveryAnswer(
      input.requestId,
      CLIENT_DISCOVERY_SECTION,
      "selectedRoles",
      input.selectedRoles.slice(0, 60)
    );
  }
  if (input.selectedWorkflows) {
    await upsertDiscoveryAnswer(
      input.requestId,
      CLIENT_DISCOVERY_SECTION,
      "selectedWorkflows",
      input.selectedWorkflows.slice(0, 40)
    );
  }
  if (input.securityPreference !== undefined) {
    await upsertDiscoveryAnswer(
      input.requestId,
      CLIENT_DISCOVERY_SECTION,
      "securityPreference",
      input.securityPreference
    );
  }
  if (input.sareaPreference !== undefined) {
    await upsertDiscoveryAnswer(
      input.requestId,
      CLIENT_DISCOVERY_SECTION,
      "sareaPreference",
      input.sareaPreference
    );
  }
  if (input.notes !== undefined) {
    await upsertDiscoveryAnswer(input.requestId, CLIENT_DISCOVERY_SECTION, "notes", input.notes);
  }

  await syncStructuredDiscovery(input.requestId, profile.id, input);

  await prisma.discoveryProfile.update({
    where: { id: profile.id },
    data: { status: "IN_PROGRESS" },
  });
}

export async function submitClientDiscoveryForReview(
  user: User,
  requestId: string
): Promise<void> {
  await assertClientDiscoveryWrite(user, requestId);
  const request = await prisma.implementationRequest.findUnique({
    where: { id: requestId },
    include: {
      requestedModules: true,
      discoveryProfile: { include: { answers: true, departments: true, roles: true, workflows: true } },
    },
  });
  if (!request) throw new Error("Request not found.");

  const draft = buildDraftFromContext(requestId, request);
  if (
    draft.status !== "in_progress" &&
    draft.status !== "changes_requested" &&
    draft.status !== "not_started"
  ) {
    throw new Error("Discovery cannot be submitted in the current status.");
  }

  const missing = computeMissingSteps(draft);
  if (missing.length > 0) {
    throw new Error(`Complete required discovery steps before submit: ${missing.join(", ")}`);
  }

  const submittedAt = new Date().toISOString();
  await upsertDiscoveryAnswer(requestId, CLIENT_DISCOVERY_SECTION, "status", "submitted_for_procrow_review");
  await upsertDiscoveryAnswer(requestId, CLIENT_DISCOVERY_SECTION, "submittedAt", submittedAt);

  const profile = await ensureClientDiscoveryProfile(requestId);
  await prisma.discoveryProfile.update({
    where: { id: profile.id },
    data: { status: "IN_PROGRESS", summary: "Client discovery submitted for ProCrow review." },
  });

}

export function listClientDiscoveryIndustryOptions() {
  return [
    ...MODELED_SECTOR_CATALOG.map((s) => ({
      value: s.key,
      label: s.title,
      summary: s.summary,
    })),
    {
      value: "general" as const,
      label: "General / custom",
      summary: "ProCrow will refine recommendations during review.",
    },
  ];
}

export { discoveryStatusLabel } from "@/lib/client-portal/client-discovery-contract";

export { DISCOVERY_STEPS };

export type ClientDiscoveryAdminSummary = {
  status: ClientDiscoveryStatus;
  industryTemplate: string | null;
  companyStageTemplate: string | null;
  employeeBand: string | null;
  moduleCount: number;
  departmentCount: number;
  roleCount: number;
  workflowCount: number;
  submittedAt: string | null;
};

export async function getClientDiscoveryAdminSummary(
  requestId: string
): Promise<ClientDiscoveryAdminSummary | null> {
  const request = await prisma.implementationRequest.findUnique({
    where: { id: requestId },
    include: {
      requestedModules: true,
      discoveryProfile: {
        include: {
          answers: true,
          departments: true,
          roles: true,
          workflows: true,
        },
      },
    },
  });
  if (!request) return null;
  const draft = buildDraftFromContext(requestId, request);
  return {
    status: draft.status,
    industryTemplate: draft.industryTemplate,
    companyStageTemplate: draft.companyStageTemplate,
    employeeBand: draft.employeeBand,
    moduleCount: draft.selectedModules.length,
    departmentCount: draft.selectedDepartments.length,
    roleCount: draft.selectedRoles.length,
    workflowCount: draft.selectedWorkflows.length,
    submittedAt: draft.submittedAt,
  };
}
