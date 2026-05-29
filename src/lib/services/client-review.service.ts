import "@/lib/server-only-guard";

import type { User } from "@supabase/supabase-js";
import type { BlueprintStatus, ProposalStatus } from "@prisma/client";
import { getCrowAuth, isPlatformStaff } from "@/lib/auth/roles";
import {
  CLIENT_PROPOSAL_NOT_READY_MESSAGE,
  CLIENT_REVIEW_APPROVAL_BLOCKED_REASON,
  CLIENT_REVIEW_PROCROW_COUNTERPARTS,
  CLIENT_REVIEW_READ_ONLY_NOTICE,
  CLIENT_REVIEW_SECURITY_NOTES,
  type ClientBlueprintReviewModel,
  type ClientProposalReviewModel,
  type ClientProposalReviewSummary,
  type ClientProposalsListModel,
  type ClientRequestReviewLinks,
  type ClientReviewAccessState,
} from "@/lib/client-portal/client-review-contract";
import { industryLabel, moduleLabel, planLabel, securityPackageLabel } from "@/lib/catalog-labels";
import { isUseMockData } from "@/lib/mock/env";
import {
  getMockEnterpriseBlueprint,
  getMockProposalApprovalOverrides,
  getMockProposalByToken,
  MOCK_BLUEPRINT_ID,
  MOCK_PROPOSAL_TOKEN,
} from "@/lib/mock/blueprint";
import { MOCK_CLIENT_REQUESTS } from "@/lib/mock/portal";
import { MOCK_PIPELINE_REQUESTS, MOCK_PRICING_ESTIMATE } from "@/lib/mock/pipeline";
import { routes } from "@/lib/routes";
import { clientCanAccessRequest, listClientRequests } from "@/lib/services/client-request-link.service";
import {
  formatSar,
  getRequestPricingEstimate,
  proposalStatusLabel,
} from "@/lib/services/commercial.service";
import { getEnterpriseBlueprint } from "@/lib/services/blueprint.service";
import { prisma } from "@/lib/db";
import { getClientApprovalEligibility } from "@/lib/services/client-approval.service";
import type { ClientApprovalEligibility } from "@/lib/client-portal/client-approval-contract";

const BLUEPRINT_READINESS: Record<string, string> = {
  DRAFT: "Draft",
  IN_REVIEW: "In review",
  APPROVED: "Approved",
  ARCHIVED: "Archived",
};

function procrowProposalStatus(status: ProposalStatus): string {
  switch (status) {
    case "DRAFT":
      return "ProCrow is preparing your commercial proposal.";
    case "SENT":
      return "ProCrow sent the proposal — review scope and approve in the Client Portal when your account is verified.";
    case "CLIENT_APPROVED":
      return "Client scope approval is on record. ProCrow is reviewing onboarding and provisioning readiness.";
    case "DECLINED":
      return "This proposal was declined in ProCrow records.";
    default:
      return "ProCrow is managing proposal status.";
  }
}

function procrowBlueprintStatus(status: BlueprintStatus): string {
  const label = BLUEPRINT_READINESS[status] ?? status;
  return `Blueprint is ${label.toLowerCase()}. ProCrow owns readiness, security baseline, and go-live planning.`;
}

function formatEstimateRange(monthlySar: number | null): string | null {
  if (monthlySar == null || Number.isNaN(monthlySar)) return null;
  return `${formatSar(monthlySar)}/mo (advisory estimate, excl. VAT)`;
}

function answerString(
  answers: { sectionKey: string; questionKey: string; valueJson: unknown }[],
  sectionKey: string,
  questionKey: string
): string | null {
  const hit = answers.find((a) => a.sectionKey === sectionKey && a.questionKey === questionKey);
  if (!hit) return null;
  const v = hit.valueJson;
  if (typeof v === "string") return v;
  return null;
}

function operatingModelFromAnswers(
  answers: { sectionKey: string; questionKey: string; valueJson: unknown }[],
  planKey: string | undefined
): string {
  const raw = answerString(answers, "organization", "operatingModel");
  if (raw === "multi_branch") return "Multi-branch operating model";
  if (raw === "single_hq") return "Single headquarters";
  if (raw === "franchise") return "Franchise / distributed outlets";
  if (planKey) return `${planLabel(planKey)} operating model`;
  return "Enterprise operating model";
}

function blueprintMissingInputs(row: {
  discoveryProfile: {
    departments: { name: string }[];
    roles: { name: string }[];
    workflows: { name: string }[];
    status: string;
  } | null;
  modules: { moduleKey: string }[];
}): string[] {
  const missing: string[] = [];
  const dp = row.discoveryProfile;
  if (!dp || dp.status !== "COMPLETED") missing.push("Discovery completion");
  if (!dp || dp.departments.length === 0) missing.push("Department structure");
  if (!dp || dp.roles.length === 0) missing.push("Role definitions");
  if (row.modules.length === 0) missing.push("Confirmed modules");
  return missing;
}

async function resolveAccessForRequest(
  user: User,
  requestId: string
): Promise<ClientReviewAccessState> {
  const { role } = getCrowAuth(user);
  if (isPlatformStaff(role)) return "platform_staff_preview";
  if (!user.email) return "login_required";

  const allowed = await clientCanAccessRequest(user.id, user.email, requestId).catch(() => false);
  if (!allowed) return "not_linked";
  return "allowed";
}

async function resolveAccessForBlueprint(
  user: User,
  blueprintId: string
): Promise<{ access: ClientReviewAccessState; requestId: string | null }> {
  if (isUseMockData() && blueprintId === MOCK_BLUEPRINT_ID) {
    const { role } = getCrowAuth(user);
    if (isPlatformStaff(role)) return { access: "platform_staff_preview", requestId: "mock-req-003" };
    if (!user.email) return { access: "login_required", requestId: null };
    return { access: "allowed", requestId: "mock-req-003" };
  }

  const blueprint = await prisma.enterpriseBlueprint
    .findUnique({
      where: { id: blueprintId },
      select: { requestId: true },
    })
    .catch(() => null);

  if (!blueprint) return { access: "not_found", requestId: null };

  const access = await resolveAccessForRequest(user, blueprint.requestId);
  return { access, requestId: blueprint.requestId };
}

function approvalStateFromEligibility(
  eligibility: ClientApprovalEligibility
): "blocked" | "eligible" | "approved" {
  if (eligibility.proposalState === "approved") return "approved";
  if (eligibility.canApprove) return "eligible";
  return "blocked";
}

function procrowNoteForEligibility(eligibility: ClientApprovalEligibility): string {
  if (eligibility.proposalState === "approved") {
    return "Your scope approval is on record. ProCrow is reviewing onboarding and provisioning readiness. This is not production go-live or payment authorization.";
  }
  if (eligibility.canApprove) {
    return "You can approve commercial scope for ProCrow review on this page when your team is ready. Approval is not a contract signature or payment commitment.";
  }
  return "ProCrow manages proposal status and blueprint readiness. Scope approval requires verified request ownership (submitter account), not email-only linkage.";
}

function proposalNextActionsForEligibility(
  eligibility: ClientApprovalEligibility,
  blueprintId: string
): string[] {
  if (eligibility.proposalState === "approved") {
    const actions = [
      "Track ProCrow onboarding review on your request page.",
      `View blueprint: ${routes.client.blueprint(blueprintId)}`,
      "Tenant runtime is not created automatically.",
    ];
    if (eligibility.requestId) {
      actions.unshift(`View request: ${routes.client.request(eligibility.requestId)}`);
    }
    return actions;
  }
  if (eligibility.canApprove) {
    return [
      "Review modules and advisory estimate with stakeholders.",
      "Use “Approve scope for ProCrow review” when your team is aligned.",
      `View blueprint: ${routes.client.blueprint(blueprintId)}`,
    ];
  }
  return [
    "Align internally on modules and security packages before workshops.",
    `View blueprint: ${routes.client.blueprint(blueprintId)}`,
    eligibility.blockedMessage ?? CLIENT_REVIEW_APPROVAL_BLOCKED_REASON,
  ];
}

function blueprintProcrowNotes(
  blueprintStatus: BlueprintStatus,
  proposalStatus: ProposalStatus | null
): string {
  if (proposalStatus === "CLIENT_APPROVED") {
    return "Client scope approval is on record. ProCrow is reviewing onboarding and provisioning readiness.";
  }
  return procrowBlueprintStatus(blueprintStatus);
}

function mapProposalSummary(
  blueprintId: string,
  requestId: string,
  orgName: string,
  referenceCode: string,
  status: ProposalStatus,
  planLabel: string | null,
  estimatedRange: string | null,
  moduleCount: number,
  sentAt: Date | string | null,
  eligibility: ClientApprovalEligibility
): ClientProposalReviewSummary {
  return {
    proposalId: blueprintId,
    requestId,
    referenceCode,
    organizationName: orgName,
    status,
    title: `Commercial proposal — ${orgName}`,
    summary:
      status === "SENT"
        ? "ProCrow shared a commercial scope and advisory monthly estimate for your review."
        : "Commercial proposal materials linked to your implementation request.",
    planLabel,
    estimatedRange,
    moduleCount,
    blueprintId,
    sentAt: sentAt ? (typeof sentAt === "string" ? sentAt : sentAt.toISOString()) : null,
    approvalState: approvalStateFromEligibility(eligibility),
    approvalBlockedReason: eligibility.blockedMessage ?? CLIENT_REVIEW_APPROVAL_BLOCKED_REASON,
    procrowStatus: procrowProposalStatus(status),
    reviewRoute: routes.client.proposal(blueprintId),
    blueprintRoute: routes.client.blueprint(blueprintId),
  };
}

export async function buildClientProposalsListModel(user: User): Promise<ClientProposalsListModel> {
  const { role } = getCrowAuth(user);
  const staff = isPlatformStaff(role);

  if (staff) {
    return {
      accessState: "platform_staff_preview",
      proposals: [],
      securityNotes: CLIENT_REVIEW_SECURITY_NOTES,
      nextActions: [
        "Staff preview — proposals appear only for requests linked to a client sign-in email.",
      ],
      approvalBlockedReason: CLIENT_REVIEW_APPROVAL_BLOCKED_REASON,
    };
  }

  if (!user.email) {
    return {
      accessState: "login_required",
      proposals: [],
      securityNotes: CLIENT_REVIEW_SECURITY_NOTES,
      nextActions: ["Sign in to review proposals linked to your organization."],
      approvalBlockedReason: CLIENT_REVIEW_APPROVAL_BLOCKED_REASON,
    };
  }

  const proposals: ClientProposalReviewSummary[] = [];

  if (isUseMockData()) {
    const mockRow = MOCK_PIPELINE_REQUESTS.find((p) => p.blueprintId === MOCK_BLUEPRINT_ID);
    if (mockRow) {
      const eligibility = await getClientApprovalEligibility(user, MOCK_BLUEPRINT_ID);
      const mockStatus = eligibility.proposalStatus ?? "SENT";
      proposals.push(
        mapProposalSummary(
          MOCK_BLUEPRINT_ID,
          mockRow.id,
          mockRow.organizationName,
          mockRow.referenceCode,
          mockStatus,
          planLabel(mockRow.planKey),
          formatEstimateRange(MOCK_PRICING_ESTIMATE.totalMonthlySar),
          3,
          new Date().toISOString(),
          eligibility
        )
      );
    }
    return {
      accessState: proposals.length > 0 ? "allowed" : "not_linked",
      proposals,
      securityNotes: CLIENT_REVIEW_SECURITY_NOTES,
      nextActions:
        proposals.length > 0
          ? [
              "Open a proposal to review scope and advisory pricing.",
              "Approve scope on the proposal detail page when your account has verified ownership.",
            ]
          : ["Submit a request or sign in with your primary contact email to link proposals."],
      approvalBlockedReason: CLIENT_REVIEW_APPROVAL_BLOCKED_REASON,
    };
  }

  try {
    const rows = await listClientRequests(user.id, user.email);
    for (const r of rows) {
      const bp = r.enterpriseBlueprint;
      if (!bp || bp.proposalStatus === "DRAFT") continue;

      const plan = r.requestedPlans[0]?.planKey;
      let estimatedRange: string | null = null;
      if (r.estimatedMonthlySar != null) {
        estimatedRange = formatEstimateRange(Number(r.estimatedMonthlySar));
      } else {
        const est = await getRequestPricingEstimate(r.id).catch(() => null);
        estimatedRange = est ? formatEstimateRange(est.totalMonthlySar) : null;
      }

      const eligibility = await getClientApprovalEligibility(user, bp.id);
      proposals.push(
        mapProposalSummary(
          bp.id,
          r.id,
          r.organizationName,
          r.referenceCode,
          bp.proposalStatus as ProposalStatus,
          plan ? planLabel(plan) : null,
          estimatedRange,
          r.requestedModules.length,
          bp.proposalSentAt,
          eligibility
        )
      );
    }
  } catch {
    /* DB unavailable */
  }

  const accessState: ClientReviewAccessState =
    proposals.length > 0 ? "allowed" : "not_linked";

  return {
    accessState,
    proposals,
    securityNotes: CLIENT_REVIEW_SECURITY_NOTES,
    nextActions:
      proposals.length > 0
        ? [
            "Review each proposal summary before discovery workshops continue.",
            "Blueprint scope is available from the same request when ProCrow publishes it.",
          ]
        : [
            "No commercial proposals are linked to this account yet.",
            "Use the same email as your primary request contact, or submit a new request.",
          ],
    approvalBlockedReason: CLIENT_REVIEW_APPROVAL_BLOCKED_REASON,
  };
}

export async function getClientProposalReviewModel(
  user: User,
  proposalId: string
): Promise<{ access: ClientReviewAccessState; model: ClientProposalReviewModel | null }> {
  if (isUseMockData() && proposalId === MOCK_BLUEPRINT_ID) {
    const access = await resolveAccessForBlueprint(user, proposalId);
    if (access.access !== "allowed" && access.access !== "platform_staff_preview") {
      return { access: access.access, model: null };
    }

    const mock = getMockProposalByToken(MOCK_PROPOSAL_TOKEN);
    if (!mock) return { access: "not_found", model: null };

    const { blueprint, estimate, planLabel: pl, modules, securityPackages } = mock;
    const org = blueprint.request.organizationName;
    const eligibility = await getClientApprovalEligibility(user, proposalId);

    return {
      access: access.access,
      model: {
        proposalId,
        requestId: blueprint.requestId,
        referenceCode: blueprint.request.referenceCode,
        organizationName: org,
        status: eligibility.proposalStatus ?? blueprint.proposalStatus,
        title: `Commercial proposal — ${org}`,
        summary:
          "Scope covers selected CEM modules, security packages, and SAREA experience configuration at go-live.",
        planLabel: pl,
        estimatedRange: formatEstimateRange(estimate?.totalMonthlySar ?? null),
        estimatedMonthlySar: estimate?.totalMonthlySar ?? null,
        modules,
        securityLayer: securityPackages,
        blueprintId: proposalId,
        blueprintStatus: blueprint.status,
        sentAt: blueprint.proposalSentAt?.toISOString() ?? null,
        approvalState: approvalStateFromEligibility(eligibility),
        approvalBlockedReason:
          eligibility.blockedMessage ?? CLIENT_REVIEW_APPROVAL_BLOCKED_REASON,
        procrowStatus: procrowProposalStatus(eligibility.proposalStatus ?? blueprint.proposalStatus),
        procrowNote: procrowNoteForEligibility(eligibility),
        securityNotes: CLIENT_REVIEW_SECURITY_NOTES,
        nextActions: proposalNextActionsForEligibility(eligibility, proposalId),
        procrowCounterpart: CLIENT_REVIEW_PROCROW_COUNTERPARTS.proposal,
        approvalEligibility: eligibility,
      },
    };
  }

  const { access, requestId } = await resolveAccessForBlueprint(user, proposalId);
  if (access !== "allowed" && access !== "platform_staff_preview") {
    return { access, model: null };
  }
  if (!requestId) return { access: "not_found", model: null };

  const blueprint = await getEnterpriseBlueprint(proposalId);
  if (!blueprint) return { access: "not_found", model: null };

  const estimate = await getRequestPricingEstimate(blueprint.requestId).catch(() => null);
  const planKey = blueprint.request.requestedPlans[0]?.planKey;
  const pl = planKey ? planLabel(planKey) : "—";
  const modules = blueprint.request.requestedModules.map((m) => ({
    key: m.moduleKey,
    label: moduleLabel(m.moduleKey),
  }));
  const securityLayer = blueprint.request.requestedSecurityPkgs.map((p) => ({
    key: p.packageKey,
    label: securityPackageLabel(p.packageKey),
  }));

  const eligibility = await getClientApprovalEligibility(user, proposalId);

  return {
    access,
    model: {
      proposalId,
      requestId: blueprint.requestId,
      referenceCode: blueprint.request.referenceCode,
      organizationName: blueprint.request.organizationName,
      status: blueprint.proposalStatus,
      title: `Commercial proposal — ${blueprint.request.organizationName}`,
      summary:
        "Commercial scope summary from your linked request — modules, security add-ons, and advisory monthly estimate.",
      planLabel: pl,
      estimatedRange: estimate
        ? formatEstimateRange(estimate.totalMonthlySar)
        : blueprint.request.estimatedMonthlySar
          ? formatEstimateRange(Number(blueprint.request.estimatedMonthlySar))
          : null,
      estimatedMonthlySar:
        (estimate?.totalMonthlySar ?? Number(blueprint.request.estimatedMonthlySar)) || null,
      modules,
      securityLayer,
      blueprintId: proposalId,
      blueprintStatus: blueprint.status,
      sentAt: blueprint.proposalSentAt?.toISOString() ?? null,
      approvalState: approvalStateFromEligibility(eligibility),
      approvalBlockedReason:
        eligibility.blockedMessage ?? CLIENT_REVIEW_APPROVAL_BLOCKED_REASON,
      procrowStatus: procrowProposalStatus(blueprint.proposalStatus),
      procrowNote: procrowNoteForEligibility(eligibility),
      securityNotes: CLIENT_REVIEW_SECURITY_NOTES,
      nextActions: proposalNextActionsForEligibility(eligibility, proposalId),
      procrowCounterpart: CLIENT_REVIEW_PROCROW_COUNTERPARTS.proposal,
      approvalEligibility: eligibility,
    },
  };
}

export async function getClientBlueprintReviewModel(
  user: User,
  blueprintId: string
): Promise<{ access: ClientReviewAccessState; model: ClientBlueprintReviewModel | null }> {
  if (isUseMockData() && blueprintId === MOCK_BLUEPRINT_ID) {
    const access = await resolveAccessForBlueprint(user, blueprintId);
    if (access.access !== "allowed" && access.access !== "platform_staff_preview") {
      return { access: access.access, model: null };
    }

    const blueprint = getMockEnterpriseBlueprint(MOCK_BLUEPRINT_ID);
    if (!blueprint) return { access: "not_found", model: null };

    const answers = blueprint.request.discoveryProfile?.answers ?? [];
    const departments = ["Operations", "Finance", "HR"];
    const roles = ["Executive sponsor", "Operations manager"];
    const workflows = ["Procurement approval", "Monthly close"];

    return {
      access: access.access,
      model: {
        blueprintId,
        requestId: blueprint.requestId,
        referenceCode: blueprint.request.referenceCode,
        organizationName: blueprint.request.organizationName,
        status: blueprint.status,
        operatingModel: operatingModelFromAnswers(
          answers,
          blueprint.request.requestedPlans[0]?.planKey
        ),
        sector: industryLabel(blueprint.request.industry),
        recommendedModules: blueprint.request.requestedModules.map((m) => moduleLabel(m.moduleKey)),
        departments,
        roles,
        workflows,
        readinessLabel: BLUEPRINT_READINESS[blueprint.status] ?? blueprint.status,
        missingInputs: ["Final discovery sign-off (demo)"],
        procrowNotes: blueprintProcrowNotes(blueprint.status, blueprint.proposalStatus),
        proposalId: blueprintId,
        proposalStatus: blueprint.proposalStatus,
        approvalBlockedReason: CLIENT_REVIEW_APPROVAL_BLOCKED_REASON,
        securityNotes: CLIENT_REVIEW_SECURITY_NOTES,
        nextActions: [
          "Review recommended modules with your project team.",
          "Open the commercial proposal when ProCrow marks it sent.",
          CLIENT_REVIEW_READ_ONLY_NOTICE,
        ],
        procrowCounterpart: CLIENT_REVIEW_PROCROW_COUNTERPARTS.blueprint,
      },
    };
  }

  const { access, requestId } = await resolveAccessForBlueprint(user, blueprintId);
  if (access !== "allowed" && access !== "platform_staff_preview") {
    return { access, model: null };
  }
  if (!requestId) return { access: "not_found", model: null };

  const blueprint = await getEnterpriseBlueprint(blueprintId);
  if (!blueprint) return { access: "not_found", model: null };

  const discovery = await prisma.discoveryProfile
    .findUnique({
      where: { requestId },
      include: { departments: true, roles: true, workflows: true },
    })
    .catch(() => null);

  const missing = blueprintMissingInputs({
    discoveryProfile: discovery,
    modules: blueprint.modules,
  });

  return {
    access,
    model: {
      blueprintId,
      requestId,
      referenceCode: blueprint.request.referenceCode,
      organizationName: blueprint.request.organizationName,
      status: blueprint.status,
      operatingModel: operatingModelFromAnswers(
        blueprint.request.discoveryProfile?.answers ?? [],
        blueprint.request.requestedPlans[0]?.planKey
      ),
      sector: industryLabel(blueprint.request.industry),
      recommendedModules: blueprint.request.requestedModules.map((m) => moduleLabel(m.moduleKey)),
      departments: discovery?.departments.map((d) => d.name) ?? [],
      roles: discovery?.roles.map((r) => r.name) ?? [],
      workflows: discovery?.workflows.map((w) => w.name) ?? [],
      readinessLabel: BLUEPRINT_READINESS[blueprint.status] ?? blueprint.status,
      missingInputs: missing,
      procrowNotes: blueprintProcrowNotes(blueprint.status, blueprint.proposalStatus),
      proposalId: blueprint.proposalStatus !== "DRAFT" ? blueprintId : null,
      proposalStatus: blueprint.proposalStatus,
      approvalBlockedReason: CLIENT_REVIEW_APPROVAL_BLOCKED_REASON,
      securityNotes: CLIENT_REVIEW_SECURITY_NOTES,
      nextActions: [
        missing.length > 0
          ? `ProCrow is waiting on: ${missing.join(", ")}.`
          : "Discovery inputs look complete from a client view.",
        blueprint.proposalStatus !== "DRAFT"
          ? "Review the commercial proposal for pricing alignment."
          : "Commercial proposal not sent yet.",
      ],
      procrowCounterpart: CLIENT_REVIEW_PROCROW_COUNTERPARTS.blueprint,
    },
  };
}

/** Resolve blueprint id for a public proposal token when the proposal was sent to the client. */
export async function resolveClientProposalFromToken(
  token: string
): Promise<{ proposalId: string; requestId: string; proposalStatus: ProposalStatus } | null> {
  if (isUseMockData() && token === MOCK_PROPOSAL_TOKEN) {
    return {
      proposalId: MOCK_BLUEPRINT_ID,
      requestId: "mock-req-003",
      proposalStatus: "SENT",
    };
  }

  const row = await prisma.enterpriseBlueprint
    .findFirst({
      where: { proposalToken: token },
      select: { id: true, requestId: true, proposalStatus: true },
    })
    .catch(() => null);

  if (!row || row.proposalStatus === "DRAFT") return null;

  return {
    proposalId: row.id,
    requestId: row.requestId,
    proposalStatus: row.proposalStatus,
  };
}

function buildRequestReviewLinksFromBlueprint(bp: {
  id: string;
  status: BlueprintStatus;
  proposalStatus: ProposalStatus;
  proposalToken: string | null;
} | null): ClientRequestReviewLinks {
  if (!bp) {
    return {
      proposalId: null,
      proposalHref: null,
      proposalPublicHref: null,
      proposalNotReadyMessage: CLIENT_PROPOSAL_NOT_READY_MESSAGE,
      blueprintHref: null,
      proposalStatus: null,
      blueprintStatus: null,
      proposalLabel: null,
      blueprintLabel: null,
    };
  }

  const blueprintHref = routes.client.blueprint(bp.id);
  const blueprintLabel = BLUEPRINT_READINESS[bp.status] ?? bp.status;

  if (bp.proposalStatus === "DRAFT") {
    return {
      proposalId: bp.id,
      proposalHref: null,
      proposalPublicHref: null,
      proposalNotReadyMessage: CLIENT_PROPOSAL_NOT_READY_MESSAGE,
      blueprintHref,
      proposalStatus: bp.proposalStatus,
      blueprintStatus: bp.status,
      proposalLabel: proposalStatusLabel(bp.proposalStatus),
      blueprintLabel,
    };
  }

  return {
    proposalId: bp.id,
    proposalHref: routes.client.proposal(bp.id),
    proposalPublicHref: bp.proposalToken ? routes.public.proposal(bp.proposalToken) : null,
    proposalNotReadyMessage: null,
    blueprintHref,
    proposalStatus: bp.proposalStatus,
    blueprintStatus: bp.status,
    proposalLabel: proposalStatusLabel(bp.proposalStatus),
    blueprintLabel,
  };
}

export async function buildClientRequestReviewLinks(
  user: User,
  requestId: string
): Promise<{ access: ClientReviewAccessState; links: ClientRequestReviewLinks | null }> {
  if (isUseMockData() && MOCK_CLIENT_REQUESTS.some((r) => r.id === requestId)) {
    const pipeline = MOCK_PIPELINE_REQUESTS.find((p) => p.id === requestId);
    const bpId = pipeline?.blueprintId ?? null;
    const overrides = getMockProposalApprovalOverrides();
    const hasProposal =
      pipeline &&
      (("proposalToken" in pipeline && pipeline.proposalToken) ||
        pipeline.blueprintId === MOCK_BLUEPRINT_ID);
    const proposalStatus = hasProposal ? overrides.proposalStatus : null;
    const mockLinks = buildRequestReviewLinksFromBlueprint(
      bpId && proposalStatus
        ? {
            id: bpId,
            status: "IN_REVIEW",
            proposalStatus,
            proposalToken: MOCK_PROPOSAL_TOKEN,
          }
        : null
    );
    return {
      access: "allowed",
      links: mockLinks,
    };
  }

  const access = await resolveAccessForRequest(user, requestId);
  if (access !== "allowed" && access !== "platform_staff_preview") {
    return { access, links: null };
  }

  const row = await prisma.implementationRequest
    .findUnique({
      where: { id: requestId },
      include: {
        enterpriseBlueprint: {
          select: {
            id: true,
            status: true,
            proposalStatus: true,
            proposalToken: true,
          },
        },
      },
    })
    .catch(() => null);

  if (!row) return { access: "not_found", links: null };

  return {
    access,
    links: buildRequestReviewLinksFromBlueprint(row.enterpriseBlueprint),
  };
}
