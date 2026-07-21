import type {
  ActivationCommand,
  ActivationState,
} from "@ghuravia/contracts/schemas";
export type Activation = {
  id: string;
  state: ActivationState;
  version: number;
  commandKeys: readonly string[];
};
export type DomainResult = {
  aggregate: Activation;
  events: readonly string[];
  auditIntent: {
    action: string;
    actorRef: string;
    reason?: string;
    authority?: string;
  };
};
const transitions: Record<
  ActivationState,
  readonly ActivationCommand["type"][]
> = {
  ACCOUNT_CLAIMED: ["REQUEST_EMAIL_VERIFICATION"],
  EMAIL_VERIFICATION_PENDING: ["VERIFY_EMAIL"],
  EMAIL_VERIFIED: ["ACCEPT_TERMS"],
  TERMS_ACCEPTED: ["ACCEPT_ACCOUNT_RISK"],
  ACCOUNT_RISK_ACCEPTED: ["ACTIVATE"],
  ACTIVATION_RECOVERY_REQUIRED: ["PRIVILEGED_CORRECTION"],
  RISK_REVIEW_REQUIRED: ["PRIVILEGED_CORRECTION"],
  ACTIVATED: ["SUSPEND", "CLOSE"],
  SUSPENDED: ["PRIVILEGED_CORRECTION", "CLOSE"],
  CLOSED: [],
};
const target: Record<ActivationCommand["type"], ActivationState> = {
  REQUEST_EMAIL_VERIFICATION: "EMAIL_VERIFICATION_PENDING",
  VERIFY_EMAIL: "EMAIL_VERIFIED",
  ACCEPT_TERMS: "TERMS_ACCEPTED",
  ACCEPT_ACCOUNT_RISK: "ACCOUNT_RISK_ACCEPTED",
  ACTIVATE: "ACTIVATED",
  SUSPEND: "SUSPENDED",
  CLOSE: "CLOSED",
  PRIVILEGED_CORRECTION: "ACTIVATION_RECOVERY_REQUIRED",
};
export function applyActivationCommand(
  current: Activation,
  command: ActivationCommand,
  expectedVersion: number,
): DomainResult {
  if (expectedVersion !== current.version)
    throw new Error("CONFLICT: optimistic version mismatch");
  if (current.commandKeys.includes(command.idempotencyKey))
    return {
      aggregate: current,
      events: [],
      auditIntent: { action: "IDEMPOTENT_REPLAY", actorRef: command.actorRef },
    };
  if (
    command.type === "PRIVILEGED_CORRECTION" &&
    (!command.authority || !command.reason || !command.actorRef)
  )
    throw new Error(
      "FORBIDDEN: correction requires actor, authority, and reason",
    );
  if (!transitions[current.state].includes(command.type))
    throw new Error("INVALID_TRANSITION");
  const next = {
    ...current,
    state: target[command.type],
    version: current.version + 1,
    commandKeys: [...current.commandKeys, command.idempotencyKey],
  };
  return {
    aggregate: next,
    events: [`activation.${next.state.toLowerCase()}`],
    auditIntent: {
      action: command.type,
      actorRef: command.actorRef,
      reason: command.reason,
      authority: command.authority,
    },
  };
}
export function commercialEventCannotProgress(event: {
  kind: "payment" | "subscription" | "purchase";
}): { xp: 0; mastery: 0; trust: 0; prestige: 0 } {
  void event;
  return { xp: 0, mastery: 0, trust: 0, prestige: 0 };
}
export function evidenceOutcome(
  scannerAvailable: boolean,
  passed: boolean,
): "quarantine" | "accepted" {
  return scannerAvailable && passed ? "accepted" : "quarantine";
}
export const publicProfile = (input: { displayName: string }) => ({
  displayName: input.displayName,
});
