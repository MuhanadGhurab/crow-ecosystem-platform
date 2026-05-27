/**
 * J2 — ProCrow Control Tower dashboard contract (typed snapshot, advisory only).
 * No production guarantees, no autonomous operation, no compliance certification semantics.
 */

export type ProCrowControlTowerMode = "staging_portfolio" | "limited_data";

export type ProCrowReadinessStatus =
  | "healthy"
  | "needs_review"
  | "limited_data"
  | "blocked"
  | "not_enabled";

export type ProCrowQueuePriority = "high" | "medium" | "low";

export type ProCrowQueueOwner = "procrow" | "delivery" | "builder" | "client";

export type ProCrowOperatorQueueItemType =
  | "new_request_review"
  | "blueprint_review"
  | "proposal_send"
  | "proposal_client_wait"
  | "client_scope_approved"
  | "client_request_changes"
  | "client_review_notes"
  | "onboarding_procrow_action"
  | "tenant_runtime_review"
  | "cybercrow_trust_review"
  | "sarea_experience_review"
  | "validation_go_no_go"
  | "notification_high_priority"
  | "pipeline_blocked";

export type ProCrowOperatorQueueItem = {
  id: string;
  type: ProCrowOperatorQueueItemType;
  label: string;
  priority: ProCrowQueuePriority;
  status: string;
  description: string;
  relatedRoute: string;
  owner: ProCrowQueueOwner;
  actionLabel: string;
  /** Optional context for deep links */
  requestId?: string;
  tenantSlug?: string;
  blueprintId?: string;
};

export type ProCrowCustomerFlowSummary = {
  totalRequests: number;
  pendingReview: number;
  discoveryBlueprint: number;
  proposalReady: number;
  proposalSentWaitingClient: number;
  clientApprovedScope: number;
  onboardingInProgress: number;
  tenantPending: number;
  blockedItems: number;
  /** Advisory rollup — worst bucket count outside happy path */
  needsReview: number;
};

export type ProCrowClientPortalSignals = {
  requestsWithSubmitter: number;
  clientOrganizationLinks: number;
  approvedScopeBlueprints: number;
  openReviewNotesCount: number;
  openRequestChangesCount: number;
  onboardingAttentionRequests: number;
  profileLinkageReadiness: ProCrowReadinessStatus;
  advisoryNote: string;
};

export type ProCrowTenantRuntimeSignals = {
  tenantCount: number;
  tenantsNeedingHealthReview: number;
  tenantsWithModules: number;
  avgEnabledModules: number;
  runtimeCohesionNote: string;
  cohesionReadiness: ProCrowReadinessStatus;
  provisioningInFlight: number;
};

export type ProCrowTrustPostureSummary = {
  cyberCrowInitializedCount: number;
  liveTenantCount: number;
  evidenceReadyCount: number;
  riskItemsNeedReview: number;
  auditSignalStatus: ProCrowReadinessStatus;
  grcStatus: ProCrowReadinessStatus;
  openIncidents: number;
  securityEvents: number;
  advisoryNote: string;
  /** First tenant slug for safe deep link, or null */
  primaryTenantSlugForCyberCrow: string | null;
};

export type ProCrowExperiencePostureSummary = {
  sareaProfilesReady: number;
  tenantBackedProfiles: number;
  fallbackProfiles: number;
  mappingNeedsReview: boolean;
  navigationProfiles: number;
  widgetRules: number;
  previewReadiness: ProCrowReadinessStatus;
  advisoryNote: string;
};

export type ProCrowDeploymentReadinessSummary = {
  productionGated: true;
  f23GateStatus: "deferred" | "advisory_only";
  validationBaseline: ProCrowReadinessStatus;
  goNoGoState: "operator_owned" | "limited_data";
  blockedReason: string | null;
  noPaidInfra: true;
  noAutoProvisioning: true;
  nextOperatorAction: string;
};

export type ProCrowNotificationBrief = {
  highPriorityOpen: number;
  pipelineOpenRecent: number;
  advisoryNote: string;
};

export type ProCrowControlTowerSnapshot = {
  mode: ProCrowControlTowerMode;
  generatedAt: Date;
  dataLive: boolean;
  customerFlow: ProCrowCustomerFlowSummary;
  clientPortal: ProCrowClientPortalSignals;
  tenantRuntime: ProCrowTenantRuntimeSignals;
  trustPosture: ProCrowTrustPostureSummary;
  experiencePosture: ProCrowExperiencePostureSummary;
  deploymentReadiness: ProCrowDeploymentReadinessSummary;
  operatorQueue: ProCrowOperatorQueueItem[];
  notifications: ProCrowNotificationBrief;
  nextActions: string[];
};
