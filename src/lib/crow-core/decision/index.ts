/**
 * C0 — Approval and decision service (human-in-the-loop; no autonomous high-risk approval).
 */

import type { ActorRef, ApprovalStatus, TenantScopeId } from "../common";

export type ApprovalPattern =
  | "single_approver"
  | "sequential"
  | "parallel"
  | "quorum"
  | "escalation"
  | "advisory_only";

export type ApprovalRequest = {
  requestId: string;
  tenantId: TenantScopeId;
  pattern: ApprovalPattern;
  subject: string;
  requestedBy: ActorRef;
  approvers: readonly ActorRef[];
  status: ApprovalStatus;
  relatedBlueprintVersion: string | null;
  relatedChangeId: string | null;
  createdAtIso: string;
};

export type Decision = {
  decisionId: string;
  requestId: string;
  decidedBy: ActorRef;
  outcome: "approved" | "rejected" | "deferred" | "escalated";
  rationale: string;
  decidedAtIso: string;
  evidenceRefs: readonly string[];
};

export type DecisionAssistance = {
  assistanceId: string;
  requestId: string;
  generatedBy: ActorRef;
  summary: string;
  risks: readonly string[];
  recommendations: readonly string[];
  /** AI-generated assistance must not auto-approve. */
  isAdvisoryOnly: true;
  humanApproverRequired: true;
};

export const DECISION_SERVICE_RULES = [
  "No autonomous approval of payments, terminations, privileged access, contracts, or policy changes.",
  "AI assistance is labeled and never substitutes for human approver on material changes.",
] as const;
