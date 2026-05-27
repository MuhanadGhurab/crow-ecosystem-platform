import "server-only";

import { CLIENT_REVIEW_NOTE_EVENT_TYPES } from "@/lib/client-portal/client-review-notes-contract";
import { MEEM_TENANT_SLUG } from "@/lib/constants/meem";
import type {
  ProCrowClientPortalSignals,
  ProCrowControlTowerMode,
  ProCrowControlTowerSnapshot,
  ProCrowCustomerFlowSummary,
  ProCrowDeploymentReadinessSummary,
  ProCrowExperiencePostureSummary,
  ProCrowNotificationBrief,
  ProCrowOperatorQueueItem,
  ProCrowReadinessStatus,
  ProCrowTenantRuntimeSignals,
  ProCrowTrustPostureSummary,
} from "@/lib/procrow/procrow-control-tower-contract";
import { prisma } from "@/lib/db";
import { getCemCommandCenterSnapshot } from "@/lib/services/cem-command-center.service";
import { getOperatorConsoleSnapshot } from "@/lib/services/operator-console.service";
import { getPlatformNotificationInboxSummary } from "@/lib/services/platform-notification.service";
import { PIPELINE_EVENT_TYPES } from "@/lib/services/platform-notification-links";
import { routes } from "@/lib/routes";

type OperatorQueueBuckets = {
  pending_review: { requestId: string; referenceCode: string }[];
  blueprint_pending: { requestId: string; referenceCode: string }[];
  ready_go_live: { requestId: string; referenceCode: string }[];
  needs_review: { requestId: string; referenceCode: string }[];
};

async function loadBlueprintProposalRows() {
  try {
    return await prisma.enterpriseBlueprint.findMany({
      orderBy: { updatedAt: "desc" },
      take: 60,
      select: {
        id: true,
        requestId: true,
        proposalStatus: true,
        clientApprovedAt: true,
        proposalSentAt: true,
      },
    });
  } catch {
    return [];
  }
}

function buildOperatorQueue(input: {
  operatorBuckets: OperatorQueueBuckets;
  blueprints: Awaited<ReturnType<typeof loadBlueprintProposalRows>>;
  notificationHigh: number;
  tenantsAttention: { id: string; slug: string; name: string }[];
  openIncidents: number;
  mappingGap: boolean;
  openReviewNotesCount: number;
  openRequestChangesCount: number;
}): ProCrowOperatorQueueItem[] {
  const items: ProCrowOperatorQueueItem[] = [];
  let seq = 0;
  const nextId = (prefix: string) => `${prefix}-${++seq}`;

  for (const row of input.operatorBuckets.pending_review.slice(0, 6)) {
    items.push({
      id: nextId("req"),
      type: "new_request_review",
      label: "New request needs review",
      priority: "high",
      status: "pending_review",
      description: `Intake ${row.referenceCode} is waiting for ProCrow review before discovery.`,
      relatedRoute: routes.admin.request(row.requestId),
      owner: "procrow",
      actionLabel: "Open request",
      requestId: row.requestId,
    });
  }

  for (const row of input.operatorBuckets.blueprint_pending.slice(0, 5)) {
    items.push({
      id: nextId("bp"),
      type: "blueprint_review",
      label: "Blueprint needs review",
      priority: "medium",
      status: "blueprint_pending",
      description: `Blueprint workstream for ${row.referenceCode} needs operator-guided review.`,
      relatedRoute: routes.admin.request(row.requestId),
      owner: "procrow",
      actionLabel: "Review blueprint",
      requestId: row.requestId,
    });
  }

  const approvedSeen = new Set<string>();
  for (const bp of input.blueprints) {
    if (bp.proposalStatus === "DRAFT" && items.filter((i) => i.type === "proposal_send").length < 4) {
      items.push({
        id: nextId("prop"),
        type: "proposal_send",
        label: "Proposal ready / waiting to send",
        priority: "medium",
        status: "draft",
        description: "Commercial proposal is in draft — confirm readiness before client send.",
        relatedRoute: routes.admin.request(bp.requestId),
        owner: "builder",
        actionLabel: "Open proposal workspace",
        requestId: bp.requestId,
        blueprintId: bp.id,
      });
    }
    if (bp.proposalStatus === "SENT" && items.filter((i) => i.type === "proposal_client_wait").length < 4) {
      items.push({
        id: nextId("pwait"),
        type: "proposal_client_wait",
        label: "Proposal sent — waiting for client",
        priority: "low",
        status: "sent",
        description: "Proposal is with the client for review; monitor for approval or change requests.",
        relatedRoute: routes.admin.request(bp.requestId),
        owner: "client",
        actionLabel: "Monitor client portal",
        requestId: bp.requestId,
        blueprintId: bp.id,
      });
    }
    if (
      bp.clientApprovedAt &&
      bp.proposalStatus === "CLIENT_APPROVED" &&
      !approvedSeen.has(bp.requestId) &&
      items.filter((i) => i.type === "client_scope_approved").length < 6
    ) {
      approvedSeen.add(bp.requestId);
      items.push({
        id: nextId("cappr"),
        type: "client_scope_approved",
        label: "Client approved scope",
        priority: "medium",
        status: "client_approved",
        description: "Scope approval is on record — continue ProCrow-controlled onboarding review.",
        relatedRoute: routes.admin.request(bp.requestId),
        owner: "procrow",
        actionLabel: "Continue onboarding",
        requestId: bp.requestId,
        blueprintId: bp.id,
      });
    }
  }

  for (const row of input.operatorBuckets.ready_go_live.slice(0, 5)) {
    items.push({
      id: nextId("onb"),
      type: "onboarding_procrow_action",
      label: "Onboarding needs ProCrow action",
      priority: "medium",
      status: "ready_go_live",
      description: `${row.referenceCode} is in go-live readiness — operator-guided provisioning only.`,
      relatedRoute: routes.admin.request(row.requestId),
      owner: "procrow",
      actionLabel: "Review go-live checklist",
      requestId: row.requestId,
    });
  }

  for (const row of input.operatorBuckets.needs_review.slice(0, 4)) {
    items.push({
      id: nextId("blk"),
      type: "pipeline_blocked",
      label: "Pipeline item needs triage",
      priority: "high",
      status: "needs_review",
      description: `${row.referenceCode} is outside the happy path — manual ProCrow triage required.`,
      relatedRoute: routes.admin.request(row.requestId),
      owner: "procrow",
      actionLabel: "Triage request",
      requestId: row.requestId,
    });
  }

  for (const t of input.tenantsAttention) {
    items.push({
      id: nextId("tnt"),
      type: "tenant_runtime_review",
      label: "Tenant runtime readiness needs review",
      priority: "medium",
      status: "attention",
      description: `${t.name} (${t.slug}) health signals suggest operator review — advisory only.`,
      relatedRoute: routes.admin.tenant(t.id),
      owner: "procrow",
      actionLabel: "Open tenant",
      tenantSlug: t.slug,
    });
  }

  if (input.openIncidents > 0) {
    items.push({
      id: nextId("cc"),
      type: "cybercrow_trust_review",
      label: "CyberCrow incidents need review",
      priority: "high",
      status: "open_incidents",
      description: `${input.openIncidents} open incident(s) across tenants — operator review, not autonomous triage.`,
      relatedRoute: routes.tenant(MEEM_TENANT_SLUG).cybercrow.incidents,
      owner: "procrow",
      actionLabel: "Review incidents",
      tenantSlug: MEEM_TENANT_SLUG,
    });
  }

  if (input.mappingGap) {
    items.push({
      id: nextId("sarea"),
      type: "sarea_experience_review",
      label: "SAREA mapping needs review",
      priority: "medium",
      status: "mapping_gap",
      description: "Role experience maps look thin versus profiles — verify persona coverage in SAREA studio.",
      relatedRoute: routes.sarea.roleMapping,
      owner: "procrow",
      actionLabel: "Open role mapping",
    });
  }

  if (input.openRequestChangesCount > 0) {
    items.push({
      id: nextId("chg"),
      type: "client_request_changes",
      label: "Client requested changes",
      priority: "high",
      status: "open",
      description: `${input.openRequestChangesCount} open change request(s) from the client portal — operator-guided triage.`,
      relatedRoute: routes.admin.notifications,
      owner: "client",
      actionLabel: "Review inbox",
    });
  }

  if (input.openReviewNotesCount > 0) {
    items.push({
      id: nextId("note"),
      type: "client_review_notes",
      label: "Client review notes",
      priority: "medium",
      status: "open",
      description: `${input.openReviewNotesCount} open review note(s) — advisory context for scope and delivery.`,
      relatedRoute: routes.admin.notifications,
      owner: "client",
      actionLabel: "Open notifications",
    });
  }

  if (input.notificationHigh > 0) {
    items.push({
      id: nextId("notif"),
      type: "notification_high_priority",
      label: "High-priority notifications",
      priority: "high",
      status: "open",
      description: `${input.notificationHigh} advisory item(s) in the operator inbox need review.`,
      relatedRoute: routes.admin.notifications,
      owner: "procrow",
      actionLabel: "Open inbox",
    });
  }

  items.push({
    id: nextId("val"),
    type: "validation_go_no_go",
    label: "Validation / go-no-go discipline",
    priority: "medium",
    status: "advisory",
    description: "Run validation playbook and deployment checks before any production discussion — F23-gated.",
    relatedRoute: routes.admin.tenants,
    owner: "procrow",
    actionLabel: "Review readiness",
  });

  const pri = { high: 0, medium: 1, low: 2 } as const;
  items.sort((a, b) => pri[a.priority] - pri[b.priority]);
  return items.slice(0, 24);
}

export async function getProCrowControlTowerSnapshot(): Promise<ProCrowControlTowerSnapshot> {
  const empty: ProCrowControlTowerSnapshot = {
    mode: "limited_data",
    generatedAt: new Date(),
    dataLive: false,
    customerFlow: {
      totalRequests: 0,
      pendingReview: 0,
      discoveryBlueprint: 0,
      proposalReady: 0,
      proposalSentWaitingClient: 0,
      clientApprovedScope: 0,
      onboardingInProgress: 0,
      tenantPending: 0,
      blockedItems: 0,
      needsReview: 0,
    },
    clientPortal: {
      requestsWithSubmitter: 0,
      clientOrganizationLinks: 0,
      approvedScopeBlueprints: 0,
      openReviewNotesCount: 0,
      openRequestChangesCount: 0,
      onboardingAttentionRequests: 0,
      profileLinkageReadiness: "limited_data",
      advisoryNote: "Connect staging data to surface client portal signals.",
    },
    tenantRuntime: {
      tenantCount: 0,
      tenantsNeedingHealthReview: 0,
      tenantsWithModules: 0,
      avgEnabledModules: 0,
      runtimeCohesionNote: "Runtime cohesion is evaluated per tenant in the tenant workspace — no autonomous fixes.",
      cohesionReadiness: "limited_data",
      provisioningInFlight: 0,
    },
    trustPosture: {
      cyberCrowInitializedCount: 0,
      liveTenantCount: 0,
      evidenceReadyCount: 0,
      riskItemsNeedReview: 0,
      auditSignalStatus: "limited_data",
      grcStatus: "limited_data",
      openIncidents: 0,
      securityEvents: 0,
      advisoryNote: "CyberCrow posture is advisory — not a substitute for a dedicated enterprise SIEM and not certified compliance.",
      primaryTenantSlugForCyberCrow: null,
    },
    experiencePosture: {
      sareaProfilesReady: 0,
      tenantBackedProfiles: 0,
      fallbackProfiles: 0,
      mappingNeedsReview: false,
      navigationProfiles: 0,
      widgetRules: 0,
      previewReadiness: "limited_data",
      advisoryNote: "SAREA adapts experience; RBAC still controls access.",
    },
    deploymentReadiness: {
      productionGated: true,
      f23GateStatus: "deferred",
      validationBaseline: "needs_review",
      goNoGoState: "limited_data",
      blockedReason: null,
      noPaidInfra: true,
      noAutoProvisioning: true,
      nextOperatorAction: "Keep staging/demo posture; run deploy-readiness checks before any production conversation.",
    },
    operatorQueue: [],
    notifications: {
      highPriorityOpen: 0,
      pipelineOpenRecent: 0,
      advisoryNote: "Notification inbox is the operator source of truth for client-driven events.",
    },
    nextActions: ["Review operator queue", "Confirm staging/demo posture"],
  };

  try {
    const [
      cem,
      operator,
      notificationSummary,
      blueprintRows,
      counts,
    ] = await Promise.all([
      getCemCommandCenterSnapshot(),
      getOperatorConsoleSnapshot(),
      getPlatformNotificationInboxSummary(),
      loadBlueprintProposalRows(),
      Promise.all([
        prisma.implementationRequest.count(),
        prisma.implementationRequest.count({ where: { status: "PENDING_REVIEW" } }),
        prisma.implementationRequest.count({
          where: { status: { in: ["UNDER_DISCOVERY", "BLUEPRINT_BUILD"] } },
        }),
        prisma.implementationRequest.count({
          where: { status: { in: ["TENANT_PROVISIONING", "SECURITY_INIT", "SAREA_INIT"] } },
        }),
        prisma.enterpriseBlueprint.count({ where: { proposalStatus: "DRAFT" } }),
        prisma.enterpriseBlueprint.count({ where: { proposalStatus: "SENT" } }),
        prisma.enterpriseBlueprint.count({
          where: { proposalStatus: "CLIENT_APPROVED", clientApprovedAt: { not: null } },
        }),
        prisma.implementationRequest.count({ where: { submittedByUserId: { not: null } } }),
        prisma.clientOrganizationRequestLink.count(),
        prisma.platformNotification.count({
          where: {
            inboxStatus: "open",
            eventType: CLIENT_REVIEW_NOTE_EVENT_TYPES.reviewNote,
          },
        }),
        prisma.platformNotification.count({
          where: {
            inboxStatus: "open",
            eventType: CLIENT_REVIEW_NOTE_EVENT_TYPES.requestChanges,
          },
        }),
        prisma.sareaExperienceProfile.count({ where: { tenantId: null } }),
        prisma.sareaExperienceProfile.count({ where: { tenantId: { not: null } } }),
        prisma.roleExperienceMap.count(),
        prisma.platformNotification.count({
          where: {
            inboxStatus: "open",
            createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
            eventType: { in: [...PIPELINE_EVENT_TYPES] },
          },
        }),
      ]),
    ]);

    const [
      totalRequests,
      pendingReview,
      discoveryBlueprint,
      onboardingInProgress,
      proposalDraftCount,
      proposalSentCount,
      clientApprovedScope,
      requestsWithSubmitter,
      clientOrganizationLinks,
      openReviewNotesCount,
      openRequestChangesCount,
      fallbackProfiles,
      tenantBackedProfiles,
      roleMapCount,
      pipelineOpenRecent,
    ] = counts;

    const { pipeline, cybercrow, sarea, tenants, platformHealth } = cem;

    const tenantPending = operator.buckets.ready_go_live.length;
    const blockedItems = operator.buckets.needs_review.length;
    const needsReview = blockedItems;

    const proposalReady = proposalDraftCount;

    const tenantsAttention = tenants
      .filter((t) => t.health.healthScore === "attention")
      .slice(0, 5)
      .map((t) => ({
        id: t.id,
        slug: t.slug,
        name: t.organization?.displayName ?? t.slug,
      }));

    const tenantsNeedingHealthReview = tenants.filter(
      (t) => t.health.healthScore === "attention" || t.health.healthScore === "watch"
    ).length;

    const tenantsWithModules = tenants.filter((t) => t.posture.enabledModuleCount > 0).length;
    const avgEnabledModules =
      tenants.length > 0
        ? tenants.reduce((s, t) => s + t.posture.enabledModuleCount, 0) / tenants.length
        : 0;

    let cohesionReadiness: ProCrowReadinessStatus = "healthy";
    if (tenants.length === 0) cohesionReadiness = "limited_data";
    else if (tenantsNeedingHealthReview > tenants.length / 2) cohesionReadiness = "needs_review";

    const profileTotal = sarea.profileCount;
    const mappingNeedsReview =
      profileTotal > 0 && roleMapCount < Math.max(1, Math.floor(profileTotal * 0.75));

    let profileLinkageReadiness: ProCrowReadinessStatus = "limited_data";
    if (clientOrganizationLinks > 0 || requestsWithSubmitter > 0) {
      profileLinkageReadiness = requestsWithSubmitter > 0 ? "healthy" : "needs_review";
    }

    const trust: ProCrowTrustPostureSummary = {
      cyberCrowInitializedCount: cybercrow.tenantsWithBaseline,
      liveTenantCount: cybercrow.liveTenantCount,
      evidenceReadyCount: cybercrow.tenantsWithBaseline,
      riskItemsNeedReview: cybercrow.openIncidentCount,
      auditSignalStatus:
        cybercrow.totalAuditCount > 0
          ? cybercrow.openIncidentCount > 0
            ? "needs_review"
            : "healthy"
          : "limited_data",
      grcStatus:
        cybercrow.complianceControlCount === 0
          ? "limited_data"
          : cybercrow.compliancePct !== null && cybercrow.compliancePct >= 80
            ? "healthy"
            : "needs_review",
      openIncidents: cybercrow.openIncidentCount,
      securityEvents: cybercrow.securityEventCount,
      advisoryNote:
        "Trust signals are operator-guided readiness indicators — not machine-led anomaly classification or certified audit outcomes.",
      primaryTenantSlugForCyberCrow: tenants[0]?.slug ?? MEEM_TENANT_SLUG,
    };

    const experience: ProCrowExperiencePostureSummary = {
      sareaProfilesReady: profileTotal,
      tenantBackedProfiles,
      fallbackProfiles,
      mappingNeedsReview,
      navigationProfiles: sarea.navigationProfileCount ?? 0,
      widgetRules: sarea.widgetRuleCount,
      previewReadiness: profileTotal > 0 ? (mappingNeedsReview ? "needs_review" : "healthy") : "limited_data",
      advisoryNote:
        "Experience posture reflects studio coverage — RBAC remains the access gate; SAREA shapes presentation.",
    };

    const deployment: ProCrowDeploymentReadinessSummary = {
      productionGated: true,
      f23GateStatus: "deferred",
      validationBaseline: operator.platformWarnings.length > 0 ? "needs_review" : "healthy",
      goNoGoState: blockedItems > 0 ? "operator_owned" : "limited_data",
      blockedReason: blockedItems > 0 ? `${blockedItems} pipeline item(s) need triage before progression.` : null,
      noPaidInfra: true,
      noAutoProvisioning: true,
      nextOperatorAction:
        "Confirm validation playbook status; production remains F23-gated with no paid infra activation in staging.",
    };

    const operatorBuckets = {
      pending_review: operator.buckets.pending_review.map((c) => ({
        requestId: c.requestId,
        referenceCode: c.referenceCode,
      })),
      blueprint_pending: operator.buckets.blueprint_pending.map((c) => ({
        requestId: c.requestId,
        referenceCode: c.referenceCode,
      })),
      ready_go_live: operator.buckets.ready_go_live.map((c) => ({
        requestId: c.requestId,
        referenceCode: c.referenceCode,
      })),
      needs_review: operator.buckets.needs_review.map((c) => ({
        requestId: c.requestId,
        referenceCode: c.referenceCode,
      })),
    };

    const operatorQueue = buildOperatorQueue({
      operatorBuckets,
      blueprints: blueprintRows,
      notificationHigh: notificationSummary.highPriorityCount,
      tenantsAttention,
      openIncidents: cybercrow.openIncidentCount,
      mappingGap: mappingNeedsReview,
      openReviewNotesCount,
      openRequestChangesCount,
    });

    const nextActions: string[] = [];
    if (operatorQueue[0]) nextActions.push(operatorQueue[0].actionLabel + ": " + operatorQueue[0].label);
    if (pendingReview > 0) nextActions.push(`Review ${pendingReview} intake item(s) in the request queue.`);
    if (notificationSummary.highPriorityCount > 0) {
      nextActions.push("Clear high-priority advisories in the notification inbox.");
    }
    if (nextActions.length === 0) {
      nextActions.push("Scan customer flow and tenant health for drift — staging remains advisory.");
    }

    const notifBrief: ProCrowNotificationBrief = {
      highPriorityOpen: notificationSummary.highPriorityCount,
      pipelineOpenRecent,
      advisoryNote:
        "Subscription and pipeline notifications are advisory; triage in the operator inbox — no auto billing actions.",
    };

    const mode: ProCrowControlTowerMode = pipeline.live ? "staging_portfolio" : "limited_data";

    return {
      mode,
      generatedAt: new Date(),
      dataLive: true,
      customerFlow: {
        totalRequests,
        pendingReview,
        discoveryBlueprint,
        proposalReady,
        proposalSentWaitingClient: proposalSentCount,
        clientApprovedScope,
        onboardingInProgress,
        tenantPending,
        blockedItems,
        needsReview,
      },
      clientPortal: {
        requestsWithSubmitter,
        clientOrganizationLinks,
        approvedScopeBlueprints: clientApprovedScope,
        openReviewNotesCount,
        openRequestChangesCount,
        onboardingAttentionRequests: tenantPending,
        profileLinkageReadiness,
        advisoryNote:
          "Client portal signals aggregate auth linkage and notifications — they do not replace verified ownership checks on each request.",
      },
      tenantRuntime: {
        tenantCount: tenants.length,
        tenantsNeedingHealthReview,
        tenantsWithModules,
        avgEnabledModules: Math.round(avgEnabledModules * 10) / 10,
        runtimeCohesionNote:
          "Runtime cohesion is reviewed per tenant (modules, BI, workflows) — use tenant detail for depth.",
        cohesionReadiness,
        provisioningInFlight: platformHealth.tenantsProvisioning,
      },
      trustPosture: trust,
      experiencePosture: experience,
      deploymentReadiness: deployment,
      operatorQueue,
      notifications: notifBrief,
      nextActions: nextActions.slice(0, 5),
    };
  } catch {
    return empty;
  }
}
