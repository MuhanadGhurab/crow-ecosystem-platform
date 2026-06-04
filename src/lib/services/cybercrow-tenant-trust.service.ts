import "server-only";

import {
  CYBERCROW_CEM_RELATIONSHIP_NOTE,
  CYBERCROW_SAREA_RELATIONSHIP_NOTE,
  CYBERCROW_TENANT_TRUST_DISCLAIMERS,
  type CyberCrowAccessReviewReadiness,
  type CyberCrowEvidenceReadiness,
  type CyberCrowGrcReadiness,
  type CyberCrowIdentityReadiness,
  type CyberCrowRiskReadiness,
  type CyberCrowTenantTrustSnapshot,
  type CyberCrowTenantTrustStatus,
} from "@/lib/cybercrow/cybercrow-tenant-trust-contract";
import {
  CYBERCROW_ACCESS_REVIEW_AREAS,
  ENTRA_NOT_LIVE_COPY,
  ENTRA_READINESS_MAPPING_LABEL,
} from "@/lib/constants/cybercrow-identity-readiness";
import {
  CYBERCROW_GRC_OPERATOR_CHECKLIST,
  CYBERCROW_GRC_SAFE_TERMS,
} from "@/lib/constants/cybercrow-grc-readiness";
import { SUBSCRIPTION_TIERS } from "@/lib/constants/subscriptions";
import { prisma } from "@/lib/db";
import { getCybercrowDashboardMetrics } from "@/lib/services/cybercrow-dashboard.service";
import {
  getEvidenceCatalog,
  getEvidenceGaps,
} from "@/lib/services/cybercrow-evidence-grc.service";
import { getCybercrowIdentityTelemetrySummary } from "@/lib/services/cybercrow-identity-telemetry.service";
import { getSocWorkflowSummary } from "@/lib/services/cybercrow-soc-workflow.service";
import {
  getCybercrowGrcSummary,
  listTenantGrcFindings,
} from "@/lib/services/cybercrow-tenant.service";
import { getTenantById, getTenantWorkspaceSummary } from "@/lib/services/tenant.service";
import { getTenantIdentityCounts } from "@/lib/services/tenant-identity.service";
import { listSareaProfilesForTenant } from "@/lib/services/sarea.service";

function entraLikelyFromPlan(planKey: string | null | undefined): boolean {
  if (!planKey) return false;
  const plan = SUBSCRIPTION_TIERS.find((p) => p.key === planKey);
  return plan?.authMode === "entra_id";
}

function deriveTrustStatus(input: {
  cybercrowInitialized: boolean;
  roleCount: number;
  profileCount: number;
  evidenceGapCount: number;
  openIncidentCount: number;
  pendingReviewEvents: number;
  openGrcFindings: number;
  accessReviewPending: boolean;
}): CyberCrowTenantTrustStatus {
  if (!input.cybercrowInitialized && input.profileCount === 0 && input.roleCount === 0) {
    return "not_started";
  }
  if (input.roleCount === 0 || input.profileCount === 0) {
    return "blocked";
  }
  if (
    input.openIncidentCount > 2 ||
    input.pendingReviewEvents > 5 ||
    input.openGrcFindings > 3
  ) {
    return "in_review";
  }
  if (input.evidenceGapCount > 4 || input.accessReviewPending) {
    return "needs_review";
  }
  if (
    input.cybercrowInitialized &&
    input.evidenceGapCount <= 2 &&
    !input.accessReviewPending &&
    input.openIncidentCount === 0
  ) {
    return "ready_for_go_no_go";
  }
  if (input.cybercrowInitialized) {
    return "advisory_ready";
  }
  return "needs_review";
}

function goNoGoDependencyLabel(status: CyberCrowTenantTrustStatus): string {
  switch (status) {
    case "ready_for_go_no_go":
      return "CyberCrow tenant trust: ready (advisory) — operator still owns ProCrow Go/No-Go";
    case "advisory_ready":
      return "CyberCrow tenant trust: advisory ready — confirm access review before Go/No-Go";
    case "blocked":
      return "CyberCrow tenant trust: blocked — identity or roles incomplete";
    case "in_review":
      return "CyberCrow tenant trust: in review — incidents, events, or GRC findings open";
    case "needs_review":
      return "CyberCrow tenant trust: needs review — evidence or access gaps";
    default:
      return "CyberCrow tenant trust: not started — initialize baseline and map identity";
  }
}

export async function buildCyberCrowTenantTrustSnapshotForTenantId(
  tenantId: string
): Promise<CyberCrowTenantTrustSnapshot | null> {
  const tenant = await getTenantById(tenantId);
  if (!tenant) return null;

  const [
    workspace,
    identityCounts,
    metrics,
    soc,
    grcSummary,
    evidenceGaps,
    catalog,
    identityTelemetry,
    grcFindings,
    sareaProfiles,
  ] = await Promise.all([
    getTenantWorkspaceSummary(tenantId),
    getTenantIdentityCounts(tenantId),
    getCybercrowDashboardMetrics(tenantId),
    getSocWorkflowSummary(tenantId),
    getCybercrowGrcSummary(tenantId),
    getEvidenceGaps(tenantId, tenant.slug),
    getEvidenceCatalog(tenantId),
    getCybercrowIdentityTelemetrySummary(tenantId),
    listTenantGrcFindings(tenantId),
    listSareaProfilesForTenant(tenantId),
  ]);

  const request = tenant.blueprint?.request;
  const entraPlanned = entraLikelyFromPlan(tenant.planKey);

  const privilegedRolesNeedReview =
    identityCounts.roles > 0 && identityCounts.profiles < identityCounts.roles;

  const accessReviewPending =
    privilegedRolesNeedReview ||
    identityCounts.departments === 0 ||
    sareaProfiles.length < 3;

  const trustStatus = deriveTrustStatus({
    cybercrowInitialized: workspace.cybercrowInitialized,
    roleCount: identityCounts.roles,
    profileCount: identityCounts.profiles,
    evidenceGapCount: evidenceGaps.length,
    openIncidentCount: metrics.openIncidentCount,
    pendingReviewEvents: soc.pendingReviewEvents,
    openGrcFindings: grcSummary.openFindings,
    accessReviewPending,
  });

  const domainLabel = tenant.organization?.displayName
    ? `Organization: ${tenant.organization.displayName}`
    : "Tenant domain pending — confirm in discovery";

  const identity: CyberCrowIdentityReadiness = {
    identityModel:
      identityCounts.profiles > 0
        ? "CEM profiles with tenant-scoped roles"
        : "Identity source not configured yet.",
    tenantDomain: domainLabel,
    authProviderMode: entraPlanned
      ? "Entra ID planned (Enterprise tier mapping)"
      : "Local CEM accounts — native auth mode",
    entraReadiness: entraPlanned
      ? `${ENTRA_READINESS_MAPPING_LABEL} — ${ENTRA_NOT_LIVE_COPY}`
      : `${ENTRA_READINESS_MAPPING_LABEL} — advisory unless Enterprise / IdP path selected`,
    userSource:
      identityCounts.profiles > 0
        ? `${identityCounts.profiles} profile(s) in tenant runtime`
        : "User provisioning not configured",
    roleSource:
      identityCounts.roles > 0
        ? `${identityCounts.roles} CEM role(s); validate privileged assignments`
        : "No tenant roles defined yet",
    accessReviewStatus: accessReviewPending
      ? "Access review needed before Go/No-Go"
      : "Access review checklist in progress — operator confirmation",
    mfaPosture: "MFA posture advisory — configure in IdP when Entra is enabled; not enforced by CyberCrow",
    privilegedAccessPosture: privilegedRolesNeedReview
      ? "Privileged roles need confirmation"
      : "Review tenant_admin and module admin assignments",
    notes: identityTelemetry.hasStoredTelemetry
      ? "Identity telemetry tables have rows — use for posture hints only."
      : null,
  };

  const grc: CyberCrowGrcReadiness = {
    policyMapping:
      grcSummary.controlCount > 0
        ? `${grcSummary.controlCount} control row(s) — advisory mapping`
        : "Policy/control mapping pending — run CyberCrow baseline",
    controlMapping: `${CYBERCROW_GRC_SAFE_TERMS.grcMapping} (${grcSummary.compliantCount}/${grcSummary.controlCount} compliant · ${grcSummary.openFindings} open finding(s))`,
    evidenceMapping: `${catalog.filter((c) => c.status === "available").length} available · ${evidenceGaps.length} gap(s)`,
    riskRegisterReadiness:
      metrics.openIncidentCount > 0
        ? `${metrics.openIncidentCount} open incident(s) — human-governed`
        : "Risk register posture derived from controls and events",
    auditTrailReadiness: `${workspace.auditLogCount} CyberCrow audit log row(s)`,
    compliancePosture: `${CYBERCROW_GRC_SAFE_TERMS.compliancePosture} · ${metrics.compliancePct}% rule-based score`,
    disclaimers: CYBERCROW_TENANT_TRUST_DISCLAIMERS,
  };

  const riskLevel =
    metrics.riskScore >= 80 ? "low" : metrics.riskScore >= 60 ? "medium" : "elevated";

  const risk: CyberCrowRiskReadiness = {
    riskLevel,
    mainRisks: [
      ...(metrics.openIncidentCount > 0
        ? [`${metrics.openIncidentCount} open incident(s)`]
        : []),
      ...(soc.pendingReviewEvents > 0
        ? [`${soc.pendingReviewEvents} security event(s) awaiting review`]
        : []),
      ...(evidenceGaps.length > 0 ? [`${evidenceGaps.length} evidence gap(s)`] : []),
      ...(grcFindings.length > 0 ? [`${grcFindings.length} open GRC finding(s)`] : []),
    ].slice(0, 5),
    mitigations: [
      "Review security events before escalating to incidents",
      "Close evidence gaps on the Evidence console",
      "Confirm access review checklist with ProCrow",
    ],
    openQuestions: accessReviewPending
      ? ["Have privileged roles been validated?", "Are SAREA profiles aligned to CEM roles?"]
      : ["Any exceptions documented before Go/No-Go?"],
    recommendedActions: [],
  };

  const evidence: CyberCrowEvidenceReadiness = {
    evidenceSources: [
      "CyberCrow audit logs",
      "Security events & incidents",
      "Compliance evidence catalog",
      ...(identityTelemetry.hasStoredTelemetry ? ["Identity telemetry (advisory)"] : []),
    ],
    missingEvidence: evidenceGaps.slice(0, 6).map((g) => g.title),
    operatorChecklist: [...CYBERCROW_GRC_OPERATOR_CHECKLIST],
    readinessNotes: CYBERCROW_GRC_SAFE_TERMS.evidenceReadiness,
  };

  const accessReview: CyberCrowAccessReviewReadiness = {
    status: identity.accessReviewStatus,
    checklist: [...CYBERCROW_ACCESS_REVIEW_AREAS],
    privilegedRolesNeedReview,
    notes: privilegedRolesNeedReview
      ? "Role count exceeds validated profile coverage — confirm assignments."
      : null,
  };

  const blockers: string[] = [];
  const warnings: string[] = [];
  if (trustStatus === "blocked") {
    blockers.push("Tenant identity incomplete — roles or profiles missing.");
  }
  if (!workspace.cybercrowInitialized) {
    warnings.push("CyberCrow baseline not initialized — run provisioning checklist.");
  }
  if (entraPlanned) {
    warnings.push(ENTRA_NOT_LIVE_COPY);
  }
  if (evidenceGaps.length > 0) {
    warnings.push(`${evidenceGaps.length} evidence gap(s) — advisory before external review.`);
  }

  const recommendedActions = [
    ...risk.mitigations,
    ...(accessReviewPending
      ? ["Complete access review checklist before ProCrow Go/No-Go"]
      : []),
    ...(trustStatus === "not_started"
      ? ["Initialize CyberCrow baseline for tenant"]
      : []),
  ];

  const nextProCrowAction =
    trustStatus === "ready_for_go_no_go"
      ? "Include CyberCrow trust snapshot in Go/No-Go packet — ProCrow still decides."
      : trustStatus === "blocked"
        ? "Resolve identity/role gaps before staging handoff."
        : "Review CyberCrow dashboard and access review checklist with delivery lead.";

  return {
    tenantSlug: tenant.slug,
    tenantName: tenant.organization.displayName,
    requestId: request?.id ?? null,
    blueprintId: tenant.blueprint?.id ?? null,
    trustStatus,
    identity,
    grc,
    risk,
    evidence,
    accessReview,
    recommendedActions,
    blockers,
    warnings,
    nextProCrowAction,
    sareaDependencies: [
      "CEM roles and departments for persona mapping",
      "SAREA experience profiles aligned to RBAC",
      "Module visibility vs role assignments",
      "Access boundaries validated (not enforced by SAREA)",
    ],
    goNoGoDependencies: [goNoGoDependencyLabel(trustStatus)],
    cemRelationshipNote: CYBERCROW_CEM_RELATIONSHIP_NOTE,
    sareaRelationshipNote: CYBERCROW_SAREA_RELATIONSHIP_NOTE,
    disclaimers: CYBERCROW_TENANT_TRUST_DISCLAIMERS,
  };
}

/** Preparation preview when tenant slug does not exist yet (request-only). */
export async function buildCyberCrowTrustPreparationPreviewForRequest(
  requestId: string
): Promise<CyberCrowTenantTrustSnapshot> {
  const request = await prisma.implementationRequest.findUnique({
    where: { id: requestId },
    include: {
      requestedSecurityPkgs: true,
      requestedPlans: true,
      discoveryProfile: {
        select: {
          answers: { select: { sectionKey: true, questionKey: true, valueJson: true } },
        },
      },
      enterpriseBlueprint: { select: { id: true, tenant: { select: { slug: true, id: true } } } },
    },
  });

  const orgName = request?.organizationName ?? "Request";
  const planKey = request?.requestedPlans[0]?.planKey;
  const entraPlanned = entraLikelyFromPlan(planKey);
  const securityPkgs = request?.requestedSecurityPkgs.map((p) => p.packageKey).join(", ") ?? "none";
  const tenantSlug = request?.enterpriseBlueprint?.tenant?.slug ?? null;

  if (tenantSlug && request?.enterpriseBlueprint?.tenant?.id) {
    const live = await buildCyberCrowTenantTrustSnapshotForTenantId(
      request.enterpriseBlueprint.tenant.id
    );
    if (live) return live;
  }

  return {
    tenantSlug,
    tenantName: orgName,
    requestId,
    blueprintId: request?.enterpriseBlueprint?.id ?? null,
    trustStatus: "not_started",
    identity: {
      identityModel: "Identity source not configured yet.",
      tenantDomain: "Domain pending until tenant provisioned",
      authProviderMode: entraPlanned ? "Entra ID planned from package tier" : "Local accounts expected at provision",
      entraReadiness: `${ENTRA_READINESS_MAPPING_LABEL} — ${ENTRA_NOT_LIVE_COPY}`,
      userSource: "User provisioning not configured",
      roleSource: "CEM roles mapped after tenant provision",
      accessReviewStatus: "Review needed before Go/No-Go",
      mfaPosture: "Advisory only — configure in IdP later",
      privilegedAccessPosture: "Privileged roles need confirmation after provision",
      notes: null,
    },
    grc: {
      policyMapping: "Map discovery security preferences to control domains",
      controlMapping: CYBERCROW_GRC_SAFE_TERMS.grcMapping,
      evidenceMapping: "Evidence expectations from security package and modules",
      riskRegisterReadiness: "Risk register after CyberCrow baseline",
      auditTrailReadiness: "Audit trail after tenant provision",
      compliancePosture: CYBERCROW_GRC_SAFE_TERMS.compliancePosture,
      disclaimers: CYBERCROW_TENANT_TRUST_DISCLAIMERS,
    },
    risk: {
      riskLevel: "unknown",
      mainRisks: ["Tenant not provisioned — trust posture not measurable"],
      mitigations: ["Complete discovery and blueprint review", "Confirm security package: " + securityPkgs],
      openQuestions: [
        "Which IdP path (local vs Entra mapping)?",
        "Which roles need access review at provision?",
      ],
      recommendedActions: [
        "Capture identity questions in ProCrow request review",
        "Set GRC/evidence expectations from discovery package",
      ],
    },
    evidence: {
      evidenceSources: ["Discovery answers", "Client approvals", "Future CyberCrow catalog"],
      missingEvidence: ["Tenant-scoped evidence not available until provision"],
      operatorChecklist: [...CYBERCROW_GRC_OPERATOR_CHECKLIST],
      readinessNotes: "Pre-provision preview only",
    },
    accessReview: {
      status: "Review needed before Go/No-Go",
      checklist: [...CYBERCROW_ACCESS_REVIEW_AREAS],
      privilegedRolesNeedReview: true,
      notes: "Validate expected roles when tenant is staged",
    },
    recommendedActions: [
      "Confirm identity model with client before staging",
      "Document expected privileged roles",
      "Align security package with GRC mapping plan",
    ],
    blockers: tenantSlug ? [] : ["Tenant not created — CyberCrow trust is preparation-only"],
    warnings: [ENTRA_NOT_LIVE_COPY],
    nextProCrowAction: "Complete discovery → blueprint → staging tenant before CyberCrow trust review",
    sareaDependencies: [
      "Roles and departments from blueprint",
      "Persona mapping after tenant provision",
      "Module visibility from enabled modules",
    ],
    goNoGoDependencies: [
      "CyberCrow tenant trust: not started (no tenant) — advisory preparation only",
    ],
    cemRelationshipNote: CYBERCROW_CEM_RELATIONSHIP_NOTE,
    sareaRelationshipNote: CYBERCROW_SAREA_RELATIONSHIP_NOTE,
    disclaimers: CYBERCROW_TENANT_TRUST_DISCLAIMERS,
  };
}

export type CyberCrowTrustGoNoGoDependency = {
  status: "ready" | "warning" | "blocked";
  label: string;
  advisoryNote: string;
};

/** Platform-level Go/No-Go dependency card (no per-tenant evaluation on global page). */
export function buildCyberCrowTrustGoNoGoDependency(): CyberCrowTrustGoNoGoDependency {
  return {
    status: "warning",
    label: "CyberCrow tenant trust readiness (M1)",
    advisoryNote:
      "Per-tenant trust snapshots live on ProCrow tenant workbench and tenant CyberCrow dashboard. Run npm run cybercrow-trust:verify after M1 changes. Not certified compliance.",
  };
}
