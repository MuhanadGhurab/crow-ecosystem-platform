import {
  CLIENT_OWNER_PROOF_REQUIRED_FOR_DISCOVERY_COMPLETION,
  FTGP_DISCOVERY_PROVENANCE,
} from "./ftgp-discovery-provenance.constants";
import { FTGP_PROCROW_REVIEW_TO_STATUS } from "./ftgp-procrow-review-transition.constants";
import {
  requiredClientQuestionsForCompletion,
  type FtgpDiscoveryQuestionDef,
} from "./ftgp-discovery-question-catalog";
import { sectionExcludedFromClientCompletion } from "./ftgp-discovery-system-marker.constants";

export const DISCOVERY_AUTO_COMPLETION_ON_SAVE = false;
export const DISCOVERY_COMPLETION_AUTHORIZED_DEFAULT = false;

export type DiscoveryCompletionPlanInput = {
  requestStatus: string;
  profileStatus: string;
  ownerBrowserProofVerified: boolean;
  explicitCompletionCommand: boolean;
  clientAnswers: ReadonlyArray<{
    sectionKey: string;
    questionKey: string;
    provenance: string;
  }>;
  implementerObservations: ReadonlyArray<{
    sectionKey: string;
    questionKey: string;
  }>;
  blockingValidationErrors: string[];
};

export type DiscoveryCompletionPlanResult = {
  allowed: boolean;
  refusal: string | null;
  missingRequiredClientQuestions: string[];
};

export function planDiscoveryCompletion(
  input: DiscoveryCompletionPlanInput
): DiscoveryCompletionPlanResult {
  const missingRequiredClientQuestions: string[] = [];

  if (input.requestStatus !== FTGP_PROCROW_REVIEW_TO_STATUS) {
    return {
      allowed: false,
      refusal: "invalid_request_status",
      missingRequiredClientQuestions,
    };
  }
  if (input.profileStatus !== "IN_PROGRESS") {
    return {
      allowed: false,
      refusal: "profile_not_in_progress",
      missingRequiredClientQuestions,
    };
  }
  if (!input.explicitCompletionCommand) {
    return {
      allowed: false,
      refusal: "explicit_completion_required",
      missingRequiredClientQuestions,
    };
  }
  if (
    CLIENT_OWNER_PROOF_REQUIRED_FOR_DISCOVERY_COMPLETION &&
    !input.ownerBrowserProofVerified
  ) {
    return {
      allowed: false,
      refusal: "owner_browser_proof_required",
      missingRequiredClientQuestions,
    };
  }
  if (input.blockingValidationErrors.length > 0) {
    return {
      allowed: false,
      refusal: "blocking_validation_errors",
      missingRequiredClientQuestions,
    };
  }

  const required = requiredClientQuestionsForCompletion();
  for (const q of required) {
    const satisfied = input.clientAnswers.some(
      (a) =>
        a.sectionKey === q.sectionKey &&
        a.questionKey === q.questionKey &&
        a.provenance === FTGP_DISCOVERY_PROVENANCE.CLIENT_PROVIDED
    );
    if (!satisfied) {
      missingRequiredClientQuestions.push(`${q.sectionKey}/${q.questionKey}`);
    }
  }

  if (missingRequiredClientQuestions.length > 0) {
    return {
      allowed: false,
      refusal: "required_client_questions_incomplete",
      missingRequiredClientQuestions,
    };
  }

  const systemMarkerUsedAsClient = input.clientAnswers.some((a) =>
    sectionExcludedFromClientCompletion(a.sectionKey)
  );
  if (systemMarkerUsedAsClient) {
    return {
      allowed: false,
      refusal: "system_marker_cannot_satisfy_client",
      missingRequiredClientQuestions,
    };
  }

  return {
    allowed: true,
    refusal: null,
    missingRequiredClientQuestions,
  };
}

export function clientAnswerCountsTowardCompletion(
  sectionKey: string,
  provenance: string
): boolean {
  if (sectionExcludedFromClientCompletion(sectionKey)) return false;
  return provenance === FTGP_DISCOVERY_PROVENANCE.CLIENT_PROVIDED;
}

export function requiredImplementerObservations(): readonly FtgpDiscoveryQuestionDef[] {
  return requiredClientQuestionsForCompletion().filter(() => false);
}
