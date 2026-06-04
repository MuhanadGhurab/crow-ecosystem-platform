/**
 * K2.7 — Runtime preparation readiness copy (staging tenant prep, not production go-live).
 */

import type { ClientDiscoveryStatus } from "@/lib/client-portal/client-discovery-contract";
import { CLIENT_DISCOVERY_SECTION } from "@/lib/client-portal/client-discovery-contract";

export const RUNTIME_PREP_F23_NOTE =
  "Production remains F23-gated and requires ProCrow Go/No-Go review. Final go-live is not activated from this screen." as const;

export const RUNTIME_PREP_BLOCKED_TITLE = "Runtime preparation blocked" as const;

export const RUNTIME_PREP_READINESS_HEADING = "Runtime preparation readiness" as const;

export const RUNTIME_PREP_READINESS_LEAD =
  "Grouped validation across modules, structure, RBAC, workflows, CyberCrow, and SAREA before staging tenant runtime preparation — not production launch." as const;

export const RUNTIME_PREP_GATE_READY = "Ready for runtime preparation" as const;

export const RUNTIME_PREP_GATE_BLOCKED = "Resolve blockers below" as const;

export const RUNTIME_PREP_TENANT_PREPARED_LABEL = "Staging tenant runtime prepared" as const;

export function blueprintApprovalCheckDetail(status: string, hasTenant: boolean): string {
  if (status === "APPROVED") {
    return "Blueprint approved for runtime preparation.";
  }
  if (hasTenant) {
    return "Staging tenant runtime already prepared for this blueprint.";
  }
  return `Blueprint must be approved before runtime preparation. Current status: ${status}.`;
}

export function blueprintApprovalBlocker(status: string): string {
  if (status === "APPROVED") {
    return "Blueprint must be approved before runtime preparation.";
  }
  return `Blueprint must be approved before runtime preparation. Current status: ${status}.`;
}

export function parseClientDiscoveryStatusFromAnswers(
  answers: { sectionKey: string; questionKey: string; valueJson: unknown }[]
): ClientDiscoveryStatus | null {
  const row = answers.find(
    (a) => a.sectionKey === CLIENT_DISCOVERY_SECTION && a.questionKey === "status"
  );
  if (!row) return null;
  const v = row.valueJson;
  if (typeof v !== "string") return null;
  const s = v.trim();
  const allowed: ClientDiscoveryStatus[] = [
    "not_started",
    "in_progress",
    "submitted_for_procrow_review",
    "procrow_reviewing",
    "accepted_into_blueprint",
    "changes_requested",
  ];
  return allowed.includes(s as ClientDiscoveryStatus) ? (s as ClientDiscoveryStatus) : null;
}

export function clientDiscoveryStatusMessage(status: ClientDiscoveryStatus): string {
  switch (status) {
    case "not_started":
      return "Client discovery has not started.";
    case "in_progress":
      return "Client discovery is still in progress.";
    case "submitted_for_procrow_review":
      return "Client discovery is waiting for ProCrow review.";
    case "procrow_reviewing":
      return "Client discovery is waiting for ProCrow review.";
    case "accepted_into_blueprint":
      return "Client discovery has been accepted into the blueprint.";
    case "changes_requested":
      return "Client discovery changes were requested.";
    default:
      return "Client discovery must be completed and reviewed before runtime preparation.";
  }
}

export type ClientDiscoveryRuntimeGate = {
  passed: boolean;
  detail: string;
};

/** Hard gate for runtime preparation — does not auto-accept client submit without ProCrow acceptance. */
export function evaluateClientDiscoveryRuntimeGate(input: {
  answers: { sectionKey: string; questionKey: string; valueJson: unknown }[];
  discoveryProfileStatus: string | null | undefined;
}): ClientDiscoveryRuntimeGate {
  const clientStatus = parseClientDiscoveryStatusFromAnswers(input.answers);

  if (clientStatus === "accepted_into_blueprint") {
    return {
      passed: true,
      detail: clientDiscoveryStatusMessage(clientStatus),
    };
  }

  if (clientStatus) {
    return {
      passed: false,
      detail: clientDiscoveryStatusMessage(clientStatus),
    };
  }

  if (input.discoveryProfileStatus === "COMPLETED" || input.discoveryProfileStatus === "APPROVED") {
    return {
      passed: true,
      detail:
        "ProCrow discovery marked complete. Client-led discovery status is not recorded on this checklist — confirm review before runtime preparation.",
    };
  }

  return {
    passed: false,
    detail:
      "Client discovery must be accepted into the blueprint before runtime preparation.",
  };
}

export const CLIENT_DISCOVERY_REVIEW_CHECK_LABEL = "Client discovery reviewed" as const;
