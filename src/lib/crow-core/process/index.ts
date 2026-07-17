/**
 * C0 — Universal process lifecycle and CEM process fabric contracts.
 */

import type { ActorRef, TenantScopeId, VersionLabel } from "../common";

/** 22-stage universal process lifecycle (C0 canonical). */
export const PROCESS_LIFECYCLE_STAGES = [
  "intake",
  "qualification",
  "discovery",
  "blueprint_draft",
  "commercial_review",
  "client_approval",
  "implementation_planning",
  "configuration",
  "security_review",
  "experience_mapping",
  "pilot",
  "verification",
  "go_no_go",
  "release",
  "deployment",
  "onboarding",
  "steady_operations",
  "monitoring",
  "change_request",
  "incident_response",
  "audit_review",
  "closure",
] as const;

export type ProcessLifecycleStage = (typeof PROCESS_LIFECYCLE_STAGES)[number];

export type ProcessLifecycleStageMeta = {
  stage: ProcessLifecycleStage;
  label: string;
  ownerRole: string;
  entryCriteria: readonly string[];
  exitCriteria: readonly string[];
};

export type ProcessDefinition = {
  key: string;
  label: string;
  version: VersionLabel;
  departmentKeys: readonly string[];
  stages: readonly ProcessLifecycleStage[];
  slaHours: number | null;
};

export type ProcessVersion = {
  definitionKey: string;
  version: VersionLabel;
  blueprintVersion: VersionLabel | null;
  effectiveFromIso: string | null;
};

export type WorkflowInstance = {
  instanceId: string;
  tenantId: TenantScopeId;
  processKey: string;
  processVersion: VersionLabel;
  currentStage: ProcessLifecycleStage;
  startedAtIso: string;
  owner: ActorRef;
};

export type WorkItem = {
  workItemId: string;
  instanceId: string;
  title: string;
  assignee: ActorRef | null;
  status: "open" | "in_progress" | "blocked" | "done" | "cancelled";
  dueAtIso: string | null;
};

export type Handoff = {
  fromWorkItemId: string;
  toWorkItemId: string;
  fromRole: string;
  toRole: string;
  handoffAtIso: string;
  notes: string | null;
};

export type TimelineEvent = {
  eventId: string;
  instanceId: string;
  stage: ProcessLifecycleStage;
  actor: ActorRef;
  summary: string;
  timestampIso: string;
};

export type SLA = {
  key: string;
  targetHours: number;
  breachAction: string;
};
