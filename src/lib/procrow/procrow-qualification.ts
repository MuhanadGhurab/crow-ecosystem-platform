/**
 * CROW.PROCROW.1 — product-layer ProCrow qualification outcomes (brief notes JSON; no migration).
 * Does not create tenant membership, platform roles, Blueprint, or payment.
 */

export const PROCROW_QUALIFICATION_OUTCOMES = [
  "needs_qualification_review",
  "needs_more_information",
  "qualified_for_discovery",
  "declined",
] as const;

export type ProcrowQualificationOutcome = (typeof PROCROW_QUALIFICATION_OUTCOMES)[number];

export type ProcrowQualification = {
  outcome: ProcrowQualificationOutcome;
  operatorNote: string | null;
  recordedAt: string;
  recordedByPlatformAccountId: string;
};

export const PROCROW_QUALIFICATION_OUTCOME_LABELS: Record<ProcrowQualificationOutcome, string> = {
  needs_qualification_review: "Needs qualification review",
  needs_more_information: "Needs more information",
  qualified_for_discovery: "Qualified for Discovery",
  declined: "Declined",
};

export function isProcrowQualificationOutcome(
  value: unknown,
): value is ProcrowQualificationOutcome {
  return (
    typeof value === "string" &&
    (PROCROW_QUALIFICATION_OUTCOMES as readonly string[]).includes(value)
  );
}

export function parseProcrowQualification(raw: unknown): ProcrowQualification | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  if (!isProcrowQualificationOutcome(o.outcome)) return null;
  if (typeof o.recordedAt !== "string" || typeof o.recordedByPlatformAccountId !== "string") {
    return null;
  }
  return {
    outcome: o.outcome,
    operatorNote: typeof o.operatorNote === "string" ? o.operatorNote : null,
    recordedAt: o.recordedAt,
    recordedByPlatformAccountId: o.recordedByPlatformAccountId,
  };
}

/** Discovery may start only after explicit qualification outcome. */
export function isQualifiedForDiscovery(
  qualification: ProcrowQualification | null | undefined,
): boolean {
  return qualification?.outcome === "qualified_for_discovery";
}
