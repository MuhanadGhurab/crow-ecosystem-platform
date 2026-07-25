/** Living Mission domain types — GHV.IMPLEMENTATION.0F / GHV-IMP-AUTH-006 */

export const WORLD_DIMENSIONS = [
  "SERVICE_HEALTH",
  "SYSTEM_UNDERSTANDING",
  "EVIDENCE_INTEGRITY",
  "RISK_EXPOSURE",
  "STAKEHOLDER_TRUST",
  "TECHNICAL_DEBT",
  "TIME_PRESSURE",
] as const;

export type WorldDimension = (typeof WORLD_DIMENSIONS)[number];

export type WorldState = Record<WorldDimension, number>;

export type EvidenceSignalFamily =
  | "DEPENDENCY_MAPPING"
  | "SYSTEMS_THINKING"
  | "DIAGNOSTIC_SEQUENCE"
  | "SERVICE_RECOVERY"
  | "EVIDENCE_PRESERVATION"
  | "RISK_CONTROL"
  | "EXPERIMENTATION"
  | "STRUCTURAL_REASONING"
  | "INTEROPERABILITY"
  | "COMMUNICATION"
  | "DECISION_SPEED"
  | "UNCERTAINTY_HANDLING"
  | "TECHNICAL_DEBT_AWARENESS"
  | "VALIDATION_DISCIPLINE";

export type HorizonId = "OPERATE" | "BUILD" | "ANALYZE" | "PROTECT" | "LEAD";

export type EvidenceSignalDef = {
  signalId: string;
  family: EvidenceSignalFamily;
  capabilityTag: string;
  horizon: HorizonId;
  lineageHints: readonly string[];
  direction: "SUPPORTING" | "CONFLICTING" | "NEUTRAL";
  strength: 1 | 2 | 3;
  explanationKey: string;
};

export type ChoiceEffect = {
  world: Partial<WorldState>;
  signals: readonly EvidenceSignalDef[];
  nextNodeId: string | null;
  outcomeId?: string;
  echoCandidate?: boolean;
};

export type MissionChoice = {
  choiceId: string;
  labelAr: string;
  labelEn: string;
  effect: ChoiceEffect;
};

export type MissionNode = {
  nodeId: string;
  sceneId: string;
  titleAr: string;
  titleEn: string;
  bodyAr: string;
  bodyEn: string;
  choices: readonly MissionChoice[];
};

export type MissionScene = {
  sceneId: string;
  titleAr: string;
  titleEn: string;
  order: number;
};

export type MissionOutcome = {
  outcomeId: string;
  titleAr: string;
  titleEn: string;
  summaryAr: string;
  summaryEn: string;
};

export type MissionTemplate = {
  missionId: string;
  version: string;
  rulesetVersion: string;
  titleAr: string;
  titleEn: string;
  classification: "ALPHA_FIXTURE";
  initialWorld: WorldState;
  entryNodeId: string;
  scenes: readonly MissionScene[];
  nodes: readonly MissionNode[];
  outcomes: readonly MissionOutcome[];
  echoCandidateNodeIds: readonly string[];
};

export type RunKind = "CANONICAL" | "ECHO";

export type MissionRunStatus = "IN_PROGRESS" | "COMPLETED" | "ABANDONED";

export type EmittedSignal = EvidenceSignalDef & {
  sourceNodeId: string;
  sourceChoiceId: string;
  validityStatus: "OBSERVED";
  rulesetVersion: string;
};

export type MissionRunState = {
  runId: string;
  learnerRef: string;
  missionId: string;
  missionVersion: string;
  rulesetVersion: string;
  kind: RunKind;
  status: MissionRunStatus;
  currentNodeId: string | null;
  world: WorldState;
  worldHash: string;
  signals: readonly EmittedSignal[];
  choiceHistory: readonly {
    nodeId: string;
    choiceId: string;
    priorHash: string;
    resultingHash: string;
  }[];
  outcomeId: string | null;
  parentRunId: string | null;
  echoForkNodeId: string | null;
  version: number;
};

export type SelectChoiceCommand = {
  type: "SELECT_CHOICE";
  nodeId: string;
  choiceId: string;
  idempotencyKey: string;
  correlationId: string;
  actorRef: string;
  expectedVersion: number;
};

export type MissionCommand =
  | {
      type: "START_RUN";
      idempotencyKey: string;
      correlationId: string;
      actorRef: string;
    }
  | SelectChoiceCommand
  | {
      type: "COMPLETE_DEBRIEF";
      reflectionAr?: string;
      interestHint?: "OPERATE" | "BUILD" | "UNSURE";
      idempotencyKey: string;
      correlationId: string;
      actorRef: string;
      expectedVersion: number;
    }
  | {
      type: "DISMISS_SUGGESTION";
      suggestionId: string;
      idempotencyKey: string;
      correlationId: string;
      actorRef: string;
      expectedVersion: number;
    }
  | {
      type: "OVERRIDE_ROUTE";
      routeId: string;
      idempotencyKey: string;
      correlationId: string;
      actorRef: string;
      expectedVersion: number;
    };

export type CrowprintConfidence = "INSUFFICIENT" | "EMERGING" | "DEVELOPING";

export type CrowprintSnapshot = {
  rulesetVersion: string;
  confidence: CrowprintConfidence;
  observedStrengths: readonly string[];
  emergingPattern: string;
  developmentArea: string;
  topSupportingDecisions: readonly {
    nodeId: string;
    choiceId: string;
    family: string;
  }[];
  contradictions: readonly string[];
  explanationAr: string;
  explanationEn: string;
  correctionRoute: string;
};

export type SuggestionStatus =
  "GENERATED" | "PRESENTED" | "DISMISSED" | "EXPIRED" | "SUPERSEDED";

export type LineageSuggestion = {
  suggestionId: string;
  lineageId: string;
  taxonomyVersion: string;
  status: SuggestionStatus;
  reasonFamily: "SUGGESTION";
  primaryReason: "SYSTEM_SUGGESTED";
  reasonCodes: readonly string[];
  signalCategories: readonly string[];
  explanationAr: string;
  explanationEn: string;
  generatedAtIso: string;
  reviewOrExpiry: string;
  correctionRoute: string;
};

export type FlightLogEntry = {
  missionId: string;
  missionVersion: string;
  completedAtIso: string | null;
  majorDecisions: readonly { nodeId: string; choiceId: string }[];
  majorConsequences: readonly string[];
  outcomeId: string | null;
  signalFamilies: readonly string[];
  crowprintSummary: string;
  suggestionSummary: string;
  unresolvedUncertainty: string;
  reflection: string | null;
  recommendedRouteId: string | null;
  echoAvailable: boolean;
};

export type RouteRecommendation = {
  recommendedRouteId: string;
  explanationAr: string;
  explanationEn: string;
  alternativeRouteId: string;
  overridable: true;
  enrolled: false;
};
