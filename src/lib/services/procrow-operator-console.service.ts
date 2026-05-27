import "server-only";

import {
  PROCROW_OPERATOR_DOC_INDEX,
  buildProCrowOperatorValidationCommands,
  type ProCrowOperatorConsoleSnapshot,
  type ProCrowOperatorDocItem,
  type ProCrowValidationCommandItem,
} from "@/lib/procrow/procrow-operator-console-contract";
import { PROCROW_F23_PRODUCTION_GATE_ACTIVE } from "@/lib/procrow/procrow-go-no-go-contract";

function pickRecommendedReading(docs: ProCrowOperatorDocItem[]): ProCrowOperatorDocItem[] {
  const keys = [
    "procrow-operator-index",
    "j7-operator-console",
    "j6-go-no-go",
    "f23-production-gate",
    "validation-playbook",
    "git-safety",
    "client-portal-runbook",
  ];
  return keys
    .map((k) => docs.find((d) => d.key === k))
    .filter((d): d is ProCrowOperatorDocItem => d != null);
}

function pickRecommendedCommands(commands: ProCrowValidationCommandItem[]): ProCrowValidationCommandItem[] {
  const priority = [
    "npm run mock:verify",
    "npm run typecheck",
    "npm run lint",
    "npm run build",
    "npm run public:mirror-manifest",
    "npm run procrow:verify",
    "npm run procrow-operator:verify",
  ];
  return priority
    .map((cmd) => commands.find((c) => c.command === cmd))
    .filter((c): c is ProCrowValidationCommandItem => c != null);
}

/**
 * Returns operator docs + validation metadata only.
 * Does not read markdown from disk, execute commands, or access secrets.
 */
export async function getProCrowOperatorConsoleSnapshot(): Promise<ProCrowOperatorConsoleSnapshot> {
  const generatedAt = new Date().toISOString();
  const docs = [...PROCROW_OPERATOR_DOC_INDEX];
  const validationCommands = buildProCrowOperatorValidationCommands();

  const safetyWarnings: string[] = [
    "This operator console does not execute npm or shell commands — run all scripts manually in your terminal or CI.",
    "DB-write commands (migrate deploy, seeds) require explicit approval and environment confirmation.",
    "Deployment-sensitive commands (staging build simulation, migrate deploy) need target-env review before run.",
    PROCROW_F23_PRODUCTION_GATE_ACTIVE
      ? "Production commercial launch remains F23-gated — passing verifiers does not approve production or certify compliance."
      : "Confirm F23 production gate status before any commercial launch path.",
    "Live payments remain deferred; pricing is advisory — no checkout activation from ProCrow.",
    "Tenant auto-provisioning from client approval is disabled — onboarding stays ProCrow-controlled.",
    "Internal markdown paths listed here are not public routes — do not expose docs/internal via the web app.",
    "Validate before commit and push; follow GIT_SAFETY_GUIDE — never use git add .",
    "What not to claim: production-ready, launch approved, compliance certified, autonomous validation, or customer/legal overclaims.",
  ];

  const nextActions: string[] = [
    "Read start-here docs (operator index, validation playbook, git safety).",
    "Open /admin/go-no-go for advisory gate posture; use /admin/operator-console for full doc + command index.",
    "Run recommended validation commands locally; record pass/fail in your ticket.",
    "If client flows changed, run the client-portal:* verifier batch.",
    "Before schema work, read F23 and obtain written migration approval.",
  ];

  return {
    generatedAt,
    docs,
    validationCommands,
    recommendedReading: pickRecommendedReading(docs),
    recommendedCommands: pickRecommendedCommands(validationCommands),
    safetyWarnings,
    nextActions,
  };
}
