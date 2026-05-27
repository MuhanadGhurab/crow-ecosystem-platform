/**
 * J7 — ProCrow Operator Docs & Validation Console (metadata contract).
 *
 * Documentation index and validation command metadata only.
 * Does not execute shell commands or expose internal markdown publicly.
 */

import {
  buildProCrowValidationCommandIndex,
  type ProCrowValidationCommand,
  type ProCrowValidationRiskLevel,
} from "@/lib/procrow/procrow-go-no-go-contract";

export type ProCrowOperatorDocCategory =
  | "start_here"
  | "portal_architecture"
  | "client_portal"
  | "procrow"
  | "cybercrow"
  | "sarea"
  | "tenant_runtime"
  | "validation"
  | "deployment"
  | "git_safety"
  | "demo"
  | "phase_history";

export type ProCrowOperatorDocAudience = "operator" | "delivery" | "phase_history";

export type ProCrowOperatorDocRiskLevel = "reference" | "runbook" | "gate" | "history";

export type ProCrowOperatorDocItem = {
  key: string;
  title: string;
  category: ProCrowOperatorDocCategory;
  description: string;
  /** Repo-relative path — internal only, not served as public routes. */
  path: string;
  audience: ProCrowOperatorDocAudience;
  whenToUse: string;
  riskLevel: ProCrowOperatorDocRiskLevel;
  relatedPhase?: string;
  relatedRoutes?: string[];
  tags: string[];
};

export type ProCrowValidationCommandCategory =
  | "baseline"
  | "client_portal"
  | "procrow_stack"
  | "cybercrow_sarea"
  | "runtime_product"
  | "deployment_sensitive";

/** Console-facing risk labels (maps from J6 index). */
export type ProCrowOperatorValidationRiskLevel =
  | "read_only"
  | "local_only"
  | "db_write"
  | "deployment_sensitive"
  | "do_not_run_casually";

export type ProCrowValidationCommandItem = {
  key: string;
  command: string;
  label: string;
  category: ProCrowValidationCommandCategory;
  riskLevel: ProCrowOperatorValidationRiskLevel;
  purpose: string;
  proves: string;
  requiredForDemo: boolean;
  requiredForPush: boolean;
  requiredForProduction: boolean;
  relatedDoc?: string;
  notes?: string;
};

export type ProCrowOperatorConsoleSnapshot = {
  generatedAt: string;
  docs: ProCrowOperatorDocItem[];
  validationCommands: ProCrowValidationCommandItem[];
  recommendedReading: ProCrowOperatorDocItem[];
  recommendedCommands: ProCrowValidationCommandItem[];
  safetyWarnings: string[];
  nextActions: string[];
};

const INTERNAL_DOCS_PREFIX = "docs/internal/";

export const PROCROW_OPERATOR_DOC_INDEX: ProCrowOperatorDocItem[] = [
  {
    key: "procrow-operator-index",
    title: "ProCrow operator index",
    category: "start_here",
    description: "Master index for ProCrow routes, runbooks, and verification commands.",
    path: `${INTERNAL_DOCS_PREFIX}PROCROW_OPERATOR_INDEX.md`,
    audience: "operator",
    whenToUse: "First stop when orienting to ProCrow admin surfaces.",
    riskLevel: "reference",
    relatedPhase: "J7",
    relatedRoutes: ["/admin/overview"],
    tags: ["index", "procrow"],
  },
  {
    key: "j7-operator-console",
    title: "J7 — Operator docs & validation console",
    category: "start_here",
    description: "Phase doc for this console — audit, model, and verification.",
    path: `${INTERNAL_DOCS_PREFIX}J7_OPERATOR_DOCS_VALIDATION_CONSOLE.md`,
    audience: "operator",
    whenToUse: "After J6 when you need doc + command guidance in one place.",
    riskLevel: "reference",
    relatedPhase: "J7",
    relatedRoutes: ["/admin/operator-console"],
    tags: ["j7", "validation"],
  },
  {
    key: "j6-go-no-go",
    title: "J6 — Deployment go/no-go center",
    category: "deployment",
    description: "Advisory gate state, validation baseline, migration/payment guardrails.",
    path: `${INTERNAL_DOCS_PREFIX}J6_DEPLOYMENT_GO_NO_GO_CENTER.md`,
    audience: "operator",
    whenToUse: "Before demo or push — understand release gate posture (not command encyclopedia).",
    riskLevel: "gate",
    relatedPhase: "J6",
    relatedRoutes: ["/admin/go-no-go"],
    tags: ["deployment", "f23"],
  },
  {
    key: "f23-production-gate",
    title: "F23 — Production launch deferred gate",
    category: "deployment",
    description: "Commercial production launch criteria and explicit deferral.",
    path: `${INTERNAL_DOCS_PREFIX}F23_PRODUCTION_LAUNCH_DEFERRED_GATE.md`,
    audience: "operator",
    whenToUse: "Any production launch or paid-infra conversation.",
    riskLevel: "gate",
    tags: ["f23", "production"],
  },
  {
    key: "validation-playbook",
    title: "Validation playbook",
    category: "validation",
    description: "How and when to run validation scripts across the repo.",
    path: `${INTERNAL_DOCS_PREFIX}VALIDATION_PLAYBOOK.md`,
    audience: "operator",
    whenToUse: "Before merge, demo rehearsal, or staging push.",
    riskLevel: "runbook",
    tags: ["npm", "verify"],
  },
  {
    key: "git-safety",
    title: "Git safety guide",
    category: "git_safety",
    description: "Commit hygiene, forbidden paths, staging discipline.",
    path: `${INTERNAL_DOCS_PREFIX}GIT_SAFETY_GUIDE.md`,
    audience: "operator",
    whenToUse: "Before every commit — never use git add .",
    riskLevel: "runbook",
    tags: ["git"],
  },
  {
    key: "client-portal-runbook",
    title: "Client portal runbook",
    category: "client_portal",
    description: "Operator flow for client portal, approval, and onboarding boundaries.",
    path: `${INTERNAL_DOCS_PREFIX}CLIENT_PORTAL_RUNBOOK.md`,
    audience: "operator",
    whenToUse: "Client portal demos, approval reviews, onboarding checks.",
    riskLevel: "runbook",
    relatedRoutes: ["/client", "/admin/requests"],
    tags: ["client"],
  },
  {
    key: "operator-demo-index",
    title: "Operator demo index",
    category: "demo",
    description: "Curated demo paths and portfolio surfaces.",
    path: `${INTERNAL_DOCS_PREFIX}OPERATOR_DEMO_INDEX.md`,
    audience: "operator",
    whenToUse: "Preparing a stakeholder or internal demo.",
    riskLevel: "runbook",
    tags: ["demo"],
  },
  {
    key: "h1-demo-playbook",
    title: "H1 — Demo rehearsal playbook",
    category: "demo",
    description: "Product polish and rehearsal sequencing.",
    path: `${INTERNAL_DOCS_PREFIX}H1_DEMO_REHEARSAL_PLAYBOOK.md`,
    audience: "operator",
    whenToUse: "Structured demo rehearsal after validation passes.",
    riskLevel: "runbook",
    relatedPhase: "H1",
    tags: ["demo"],
  },
  {
    key: "i8-client-demo",
    title: "I8 — Client portal demo playbook",
    category: "demo",
    description: "Client-facing demo script and guardrails.",
    path: `${INTERNAL_DOCS_PREFIX}I8_CLIENT_PORTAL_DEMO_PLAYBOOK.md`,
    audience: "operator",
    whenToUse: "Client portal-specific demos.",
    riskLevel: "runbook",
    relatedPhase: "I8",
    tags: ["client", "demo"],
  },
  {
    key: "i1-portal-architecture",
    title: "I1 — Crow portal architecture / ProCrow model",
    category: "portal_architecture",
    description: "Four-portal model and ProCrow ownership boundaries.",
    path: `${INTERNAL_DOCS_PREFIX}I1_CROW_PORTAL_ARCHITECTURE_PROCROW_MODEL.md`,
    audience: "delivery",
    whenToUse: "Architecture questions across ProCrow, client, tenant, public.",
    riskLevel: "reference",
    relatedPhase: "I1",
    tags: ["architecture"],
  },
  {
    key: "i11-client-checkpoint",
    title: "I11 — Client portal checkpoint (pause)",
    category: "client_portal",
    description: "Checkpoint status for client portal track.",
    path: `${INTERNAL_DOCS_PREFIX}I11_CLIENT_PORTAL_CHECKPOINT_PAUSE.md`,
    audience: "phase_history",
    whenToUse: "Understanding I-track completion state — not daily ops.",
    riskLevel: "history",
    relatedPhase: "I11",
    tags: ["client", "history"],
  },
  {
    key: "g10-runtime-cohesion",
    title: "G10 — Cross-module runtime cohesion",
    category: "tenant_runtime",
    description: "Runtime cohesion chains and operator signals.",
    path: `${INTERNAL_DOCS_PREFIX}G10_CROSS_MODULE_INTELLIGENCE_RUNTIME_COHESION.md`,
    audience: "operator",
    whenToUse: "Runtime / module cohesion questions on tenant surfaces.",
    riskLevel: "reference",
    relatedPhase: "G10",
    tags: ["runtime"],
  },
  {
    key: "f30-portfolio-tag",
    title: "F30 — Final portfolio release tag",
    category: "deployment",
    description: "Portfolio release tagging discipline.",
    path: `${INTERNAL_DOCS_PREFIX}F30_FINAL_PORTFOLIO_RELEASE_TAG.md`,
    audience: "phase_history",
    whenToUse: "Portfolio packaging milestones.",
    riskLevel: "history",
    tags: ["portfolio"],
  },
  {
    key: "f31-hygiene",
    title: "F31 — Workspace hygiene & release cleanliness",
    category: "git_safety",
    description: "Workspace cleanliness before release tags.",
    path: `${INTERNAL_DOCS_PREFIX}F31_WORKSPACE_HYGIENE_RELEASE_CLEANLINESS.md`,
    audience: "operator",
    whenToUse: "Pre-release hygiene sweep.",
    riskLevel: "runbook",
    tags: ["hygiene"],
  },
  {
    key: "project-status",
    title: "Project status",
    category: "start_here",
    description: "Current delivery status and acceptance checkpoints.",
    path: `${INTERNAL_DOCS_PREFIX}PROJECT_STATUS.md`,
    audience: "delivery",
    whenToUse: "What phase passed and what is paused.",
    riskLevel: "reference",
    tags: ["status"],
  },
  {
    key: "milestones",
    title: "Milestones",
    category: "phase_history",
    description: "Full milestone map including J-track.",
    path: `${INTERNAL_DOCS_PREFIX}MILESTONES.md`,
    audience: "phase_history",
    whenToUse: "Historical phase context.",
    riskLevel: "history",
    tags: ["milestones"],
  },
  {
    key: "j1-procrow-ux",
    title: "J1 — ProCrow portal UX unification",
    category: "procrow",
    description: "Unified ProCrow admin UX patterns.",
    path: `${INTERNAL_DOCS_PREFIX}J1_PROCROW_PORTAL_UX_UNIFICATION.md`,
    audience: "phase_history",
    whenToUse: "ProCrow shell / header conventions.",
    riskLevel: "history",
    relatedPhase: "J1",
    relatedRoutes: ["/admin/overview"],
    tags: ["j1"],
  },
  {
    key: "j2-control-tower",
    title: "J2 — Control tower dashboard depth",
    category: "procrow",
    description: "Control tower dashboard and snapshot model.",
    path: `${INTERNAL_DOCS_PREFIX}J2_PROCROW_CONTROL_TOWER_DASHBOARD_DEPTH.md`,
    audience: "phase_history",
    whenToUse: "Overview dashboard behavior.",
    riskLevel: "history",
    relatedPhase: "J2",
    relatedRoutes: ["/admin/overview"],
    tags: ["j2"],
  },
  {
    key: "j3-operator-queue",
    title: "J3 — Request-to-tenant operator queue",
    category: "procrow",
    description: "Derived operator queue — read-only stages.",
    path: `${INTERNAL_DOCS_PREFIX}J3_PROCROW_REQUEST_TO_TENANT_OPERATOR_QUEUE.md`,
    audience: "operator",
    whenToUse: "Prioritizing request-to-tenant work.",
    riskLevel: "reference",
    relatedPhase: "J3",
    relatedRoutes: ["/admin/queue"],
    tags: ["j3", "queue"],
  },
  {
    key: "j4-cybercrow-ux",
    title: "J4 — CyberCrow evidence / GRC UX depth",
    category: "cybercrow",
    description: "Trust cockpit UX under ProCrow ownership.",
    path: `${INTERNAL_DOCS_PREFIX}J4_CYBERCROW_EVIDENCE_GRC_UX_DEPTH.md`,
    audience: "operator",
    whenToUse: "CyberCrow demo or verifier failures.",
    riskLevel: "reference",
    relatedPhase: "J4",
    tags: ["j4", "cybercrow"],
  },
  {
    key: "j5-sarea-ux",
    title: "J5 — SAREA studio UX depth",
    category: "sarea",
    description: "Experience studio operator surfaces.",
    path: `${INTERNAL_DOCS_PREFIX}J5_SAREA_STUDIO_UX_DEPTH.md`,
    audience: "operator",
    whenToUse: "SAREA studio demos or sarea:ux-verify.",
    riskLevel: "reference",
    relatedPhase: "J5",
    relatedRoutes: ["/sarea/overview"],
    tags: ["j5", "sarea"],
  },
];

const COMMAND_CATEGORY: Record<string, ProCrowValidationCommandCategory> = {
  "npm run mock:verify": "baseline",
  "npm run typecheck": "baseline",
  "npm run lint": "baseline",
  "npm run build": "baseline",
  "npm run public:mirror-manifest": "baseline",
  "npm run procrow:verify": "procrow_stack",
  "npm run procrow-dashboard:verify": "procrow_stack",
  "npm run procrow-queue:verify": "procrow_stack",
  "npm run procrow-go-no-go:verify": "procrow_stack",
  "npm run procrow-operator:verify": "procrow_stack",
  "npm run cybercrow:verify": "cybercrow_sarea",
  "npm run sarea:ux-verify": "cybercrow_sarea",
  "npm run erp:verify": "runtime_product",
  "npm run sector:verify": "runtime_product",
  "npm run runtime:verify": "runtime_product",
  "npm run request:pipeline:verify": "runtime_product",
  "npm run simulate:vercel-build:staging": "deployment_sensitive",
  "npm run db:migrate:deploy": "deployment_sensitive",
  "npm run db:generate": "baseline",
  "npm run db:seed:sectors": "deployment_sensitive",
  "npm run db:seed:meem": "deployment_sensitive",
};

const COMMAND_PROVES: Record<string, string> = {
  "npm run mock:verify": "Mock/demo boundaries and pipeline chain integrity are intact.",
  "npm run typecheck": "TypeScript compiles without type errors.",
  "npm run lint": "ESLint passes on the codebase.",
  "npm run build": "Next.js production build succeeds.",
  "npm run public:mirror-manifest": "Public mirror manifest paths are consistent.",
  "npm run client-portal:verify": "Client portal skeleton and guardrails hold.",
  "npm run procrow:verify": "ProCrow J1–J7 verifier chain wiring and copy guards.",
  "npm run procrow-go-no-go:verify": "Go/no-go center files and forbidden-claim guards.",
  "npm run procrow-operator:verify": "Operator console contract, UI, and manual-execution guards.",
  "npm run cybercrow:verify": "CyberCrow trust surfaces meet J4 depth checks.",
  "npm run sarea:ux-verify": "SAREA studio surfaces meet J5 depth checks.",
  "npm run db:migrate:deploy": "Pending migrations apply cleanly to the target DB (when approved).",
};

const COMMAND_RELATED_DOC: Record<string, string> = {
  "npm run mock:verify": `${INTERNAL_DOCS_PREFIX}VALIDATION_PLAYBOOK.md`,
  "npm run procrow:verify": `${INTERNAL_DOCS_PREFIX}PROCROW_OPERATOR_INDEX.md`,
  "npm run client-portal:verify": `${INTERNAL_DOCS_PREFIX}CLIENT_PORTAL_RUNBOOK.md`,
  "npm run db:migrate:deploy": `${INTERNAL_DOCS_PREFIX}F23_PRODUCTION_LAUNCH_DEFERRED_GATE.md`,
  "npm run simulate:vercel-build:staging": `${INTERNAL_DOCS_PREFIX}J6_DEPLOYMENT_GO_NO_GO_CENTER.md`,
};

function mapRiskLevel(cmd: ProCrowValidationCommand): ProCrowOperatorValidationRiskLevel {
  if (cmd.caution?.toLowerCase().includes("never run casually")) {
    return "do_not_run_casually";
  }
  switch (cmd.riskLevel as ProCrowValidationRiskLevel) {
    case "read_only":
      return "read_only";
    case "writes_local":
      return "local_only";
    case "db_write":
      return "db_write";
    case "deployment_sensitive":
      return "deployment_sensitive";
    default:
      return "read_only";
  }
}

function inferCategory(command: string): ProCrowValidationCommandCategory {
  if (COMMAND_CATEGORY[command]) return COMMAND_CATEGORY[command];
  if (command.includes("client-")) return "client_portal";
  if (command.includes("cybercrow") || command.includes("sarea")) return "cybercrow_sarea";
  if (command.includes("procrow")) return "procrow_stack";
  return "runtime_product";
}

/** Maps the shared J6 validation index into J7 console items (single source of command list). */
export function buildProCrowOperatorValidationCommands(): ProCrowValidationCommandItem[] {
  return buildProCrowValidationCommandIndex().map((cmd) => ({
    key: cmd.command,
    command: cmd.command,
    label: cmd.name,
    category: inferCategory(cmd.command),
    riskLevel: mapRiskLevel(cmd),
    purpose: cmd.purpose,
    proves: COMMAND_PROVES[cmd.command] ?? `Guards ${cmd.name} expectations documented in repo verifiers.`,
    requiredForDemo: cmd.requiredForDemo,
    requiredForPush: cmd.requiredForPush,
    requiredForProduction: cmd.requiredForProduction,
    relatedDoc: COMMAND_RELATED_DOC[cmd.command],
    notes: cmd.caution,
  }));
}
