/**
 * J3 — ProCrow request-to-tenant operator queue contract (read-only, derived readiness).
 * No task engine, no status mutations, no production guarantees.
 * Production remains F23-gated; tenant provisioning stays ProCrow-controlled.
 */

export type ProCrowQueueStage =
  | "intake"
  | "discovery"
  | "blueprint"
  | "proposal"
  | "client_review"
  | "approval"
  | "onboarding"
  | "tenant_readiness"
  | "runtime_trust"
  | "complete";

export type ProCrowQueuePriority = "critical" | "high" | "medium" | "low";

export type ProCrowQueueOwner =
  | "procrow"
  | "delivery"
  | "builder"
  | "client"
  | "tenant_admin"
  | "cybercrow"
  | "sarea";

export type ProCrowQueueItemStatus =
  | "new"
  | "needs_review"
  | "waiting_on_client"
  | "waiting_on_procrow"
  | "blocked"
  | "ready"
  | "in_progress"
  | "complete";

export type ProCrowQueueItemSource =
  | "request"
  | "blueprint"
  | "proposal"
  | "client_approval"
  | "review_note"
  | "onboarding"
  | "tenant"
  | "cybercrow"
  | "sarea"
  | "notification";

export type ProCrowOperatorQueueItem = {
  id: string;
  stage: ProCrowQueueStage;
  priority: ProCrowQueuePriority;
  status: ProCrowQueueItemStatus;
  owner: ProCrowQueueOwner;
  title: string;
  description: string;
  organizationName?: string;
  referenceCode?: string;
  requestId?: string;
  blueprintId?: string;
  tenantId?: string;
  /** Tenant slug when deep-linking CEM/CyberCrow routes */
  tenantSlug?: string;
  relatedRoute: string;
  actionLabel: string;
  /** Short operator-facing rationale (derived, advisory) */
  reason: string;
  createdAt?: string;
  updatedAt?: string;
  source: ProCrowQueueItemSource;
  tags: string[];
};

export type ProCrowOperatorQueueSummary = {
  total: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  waitingOnClient: number;
  waitingOnProCrow: number;
  blocked: number;
  readyForAction: number;
};

export type ProCrowOperatorQueueSnapshot = {
  generatedAt: Date;
  items: ProCrowOperatorQueueItem[];
  summary: ProCrowOperatorQueueSummary;
  stageBuckets: Record<ProCrowQueueStage, ProCrowOperatorQueueItem[]>;
  nextRecommendedActions: string[];
  safetyNotes: string[];
};
