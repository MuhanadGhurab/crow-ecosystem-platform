import { fingerprintDatabaseUrl } from "./database-fingerprint";
import { EXPECTED_DATABASE_FINGERPRINT } from "./ftgp-request-review-transition-manifest";
import {
  CANDIDATE_07_FINGERPRINT,
  CANDIDATE_07_OWNER_FINGERPRINT,
  ownerFingerprint,
  resolveDesignatedFirstClientAccountId,
} from "./ftgp-first-client-resolution";
import { implementerTargetFingerprint } from "./ftgp-implementer-grant-manifest";
import { requestFingerprint } from "./ftgp-procrow-review-transition-manifest";

export const FTGP_PROCROW_REVIEW_TRANSITION_EXECUTE_PHRASE =
  "EXECUTE PROCROW REVIEW FOR DESIGNATED FTGP REQUEST";

export type ReviewTransitionExecuteGateResult = {
  allowed: boolean;
  refusal: string | null;
  message: string;
};

export function validateFtgpReviewTransitionExecuteGates(input: {
  requestId: string;
  actorAccountId: string;
  correlationId: string;
  manifestCorrelationId: string;
  operatorAuthorizationFlag: boolean;
}): ReviewTransitionExecuteGateResult {
  if (!input.operatorAuthorizationFlag) {
    return {
      allowed: false,
      refusal: "execute_not_authorized",
      message: "FTGP_FIRST_REQUEST_TRANSITION_EXECUTE_AUTHORIZED must be true",
    };
  }

  const phrase = process.env.FTGP_PROCROW_REVIEW_TRANSITION_EXECUTE_PHRASE?.trim();
  if (phrase !== FTGP_PROCROW_REVIEW_TRANSITION_EXECUTE_PHRASE) {
    return {
      allowed: false,
      refusal: "execute_phrase_invalid",
      message: "Valid FTGP ProCrow review transition execute phrase required",
    };
  }

  const envRequest = process.env.FTGP_FIRST_REQUEST_ID?.trim();
  if (!envRequest || envRequest !== input.requestId) {
    return {
      allowed: false,
      refusal: "request_mismatch",
      message: "Execute request must match operator env immutable request ID",
    };
  }

  if (requestFingerprint(input.requestId) !== CANDIDATE_07_FINGERPRINT) {
    return {
      allowed: false,
      refusal: "request_fingerprint_mismatch",
      message: "Request fingerprint must match FTGP-REQUEST-CANDIDATE-07",
    };
  }

  const clientId = resolveDesignatedFirstClientAccountId();
  if (!clientId) {
    return {
      allowed: false,
      refusal: "client_not_designated",
      message: "FTGP_FIRST_CLIENT_ACCOUNT_ID required",
    };
  }

  const actorEnv = process.env.FTGP_IMPLEMENTER_TARGET_ACCOUNT_ID?.trim();
  if (!actorEnv || actorEnv !== input.actorAccountId) {
    return {
      allowed: false,
      refusal: "actor_mismatch",
      message: "Actor must match FTGP_IMPLEMENTER_TARGET_ACCOUNT_ID",
    };
  }

  const envCorrelation = process.env.FTGP_PROCROW_REVIEW_TRANSITION_CORRELATION_ID?.trim();
  if (!envCorrelation || envCorrelation !== input.manifestCorrelationId) {
    return {
      allowed: false,
      refusal: "correlation_mismatch",
      message: "Correlation ID must match manifest and operator env",
    };
  }

  const dbUrl = process.env.DIRECT_URL?.trim() || process.env.DATABASE_URL?.trim() || "";
  if (dbUrl) {
    const fp = fingerprintDatabaseUrl(dbUrl);
    if (fp.targetHash !== EXPECTED_DATABASE_FINGERPRINT) {
      return {
        allowed: false,
        refusal: "database_fingerprint_mismatch",
        message: `Expected fingerprint ${EXPECTED_DATABASE_FINGERPRINT}`,
      };
    }
  }

  const expectedActorFp = "f82bef0cddd75238";
  if (implementerTargetFingerprint(input.actorAccountId) !== expectedActorFp) {
    return {
      allowed: false,
      refusal: "actor_fingerprint_mismatch",
      message: `Actor fingerprint must be ${expectedActorFp}`,
    };
  }

  if (ownerFingerprint(clientId) !== CANDIDATE_07_OWNER_FINGERPRINT) {
    return {
      allowed: false,
      refusal: "owner_fingerprint_mismatch",
      message: "Designated client fingerprint mismatch",
    };
  }

  return { allowed: true, refusal: null, message: "execute gates passed" };
}
