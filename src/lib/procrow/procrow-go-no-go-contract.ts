/**
 * J6 — ProCrow Deployment Go/No-Go Center (advisory contract).
 *
 * Read-only metadata for operator visibility. Not an automatic deployment
 * or compliance certification surface.
 */

export type ProCrowGoNoGoDecision =
  | "go"
  | "conditional_go"
  | "no_go"
  | "blocked"
  | "not_evaluated";

export type ProCrowGateCategory =
  | "validation"
  | "git_hygiene"
  | "database"
  | "payments"
  | "deployment"
  | "client_portal"
  | "tenant_runtime"
  | "cybercrow"
  | "sarea"
  | "procrow"
  | "public_boundary"
  | "production_gate";

export type ProCrowGateStatus =
  | "pass"
  | "needs_review"
  | "blocked"
  | "not_run"
  | "advisory";

export type ProCrowValidationRiskLevel =
  | "read_only"
  | "writes_local"
  | "db_write"
  | "deployment_sensitive";

export type ProCrowGateItem = {
  key: string;
  category: ProCrowGateCategory;
  label: string;
  status: ProCrowGateStatus;
  description: string;
  evidence?: string;
  relatedCommand?: string;
  relatedDoc?: string;
  risk?: string;
  operatorAction: string;
};

export type ProCrowValidationCommand = {
  name: string;
  command: string;
  purpose: string;
  riskLevel: ProCrowValidationRiskLevel;
  requiredForDemo: boolean;
  requiredForPush: boolean;
  requiredForProduction: boolean;
  /** Human note — e.g. "never run casually" */
  caution?: string;
};

export type ProCrowGoNoGoDocRef = {
  label: string;
  path: string;
  /** Relative to docs/internal/ */
  internalPath: string;
};

export type ProCrowGoNoGoSnapshot = {
  generatedAt: string;
  mode: "staging_demo" | "portfolio" | "operator_review";
  /** Advisory aggregate for demo/staging posture (validation not executed in-app). */
  decision: ProCrowGoNoGoDecision;
  /** Production commercial launch — remains no-go while F23 gate is active. */
  productionLaunchDecision: ProCrowGoNoGoDecision;
  summary: string;
  gates: ProCrowGateItem[];
  validationCommands: ProCrowValidationCommand[];
  blockers: string[];
  warnings: string[];
  nextActions: string[];
  docs: ProCrowGoNoGoDocRef[];
  safetyNotes: string[];
};

/** F23 remains the explicit production commercial launch gate (documented; not auto-satisfied). */
export const PROCROW_F23_PRODUCTION_GATE_ACTIVE = true as const;

export const PROCROW_GO_NO_GO_DOC_REFS: ProCrowGoNoGoDocRef[] = [
  { label: "F23 — Production launch deferred gate", internalPath: "F23_PRODUCTION_LAUNCH_DEFERRED_GATE.md", path: "docs/internal/F23_PRODUCTION_LAUNCH_DEFERRED_GATE.md" },
  { label: "Validation playbook", internalPath: "VALIDATION_PLAYBOOK.md", path: "docs/internal/VALIDATION_PLAYBOOK.md" },
  { label: "Git safety guide", internalPath: "GIT_SAFETY_GUIDE.md", path: "docs/internal/GIT_SAFETY_GUIDE.md" },
  { label: "J6 — Deployment Go/No-Go Center", internalPath: "J6_DEPLOYMENT_GO_NO_GO_CENTER.md", path: "docs/internal/J6_DEPLOYMENT_GO_NO_GO_CENTER.md" },
  { label: "Client portal runbook", internalPath: "CLIENT_PORTAL_RUNBOOK.md", path: "docs/internal/CLIENT_PORTAL_RUNBOOK.md" },
];

/**
 * Operator validation baseline — commands are not executed by the Go/No-Go service.
 * Risk levels describe what happens if the operator runs them locally / in CI.
 */
export function buildProCrowValidationCommandIndex(): ProCrowValidationCommand[] {
  const ro = "read_only" as const;
  const wl = "writes_local" as const;
  const dw = "db_write" as const;
  const ds = "deployment_sensitive" as const;

  return [
    { name: "Mock mode integrity", command: "npm run mock:verify", purpose: "Portfolio / demo data boundary checks.", riskLevel: ro, requiredForDemo: true, requiredForPush: true, requiredForProduction: true },
    { name: "TypeScript", command: "npm run typecheck", purpose: "Compile-time type safety.", riskLevel: ro, requiredForDemo: true, requiredForPush: true, requiredForProduction: true },
    { name: "ESLint", command: "npm run lint", purpose: "Static analysis and style gates.", riskLevel: ro, requiredForDemo: true, requiredForPush: true, requiredForProduction: true },
    { name: "Production build", command: "npm run build", purpose: "Next.js production bundle validation.", riskLevel: wl, requiredForDemo: false, requiredForPush: true, requiredForProduction: true },
    { name: "Public mirror manifest", command: "npm run public:mirror-manifest", purpose: "Public portfolio mirror metadata consistency.", riskLevel: ro, requiredForDemo: true, requiredForPush: true, requiredForProduction: true },
    { name: "Client portal skeleton", command: "npm run client-portal:verify", purpose: "I3 client portal guardrails.", riskLevel: ro, requiredForDemo: true, requiredForPush: true, requiredForProduction: true },
    { name: "Client profile / company", command: "npm run client-profile:verify", purpose: "Client profile MVP checks.", riskLevel: ro, requiredForDemo: true, requiredForPush: true, requiredForProduction: true },
    { name: "Client proposal review", command: "npm run client-review:verify", purpose: "Review flow wiring.", riskLevel: ro, requiredForDemo: true, requiredForPush: true, requiredForProduction: true },
    { name: "Client approval flow", command: "npm run client-approval:verify", purpose: "Approval discipline (no auto-provision).", riskLevel: ro, requiredForDemo: true, requiredForPush: true, requiredForProduction: true },
    { name: "Client onboarding tracker", command: "npm run client-onboarding:verify", purpose: "Onboarding tracker UX and copy.", riskLevel: ro, requiredForDemo: true, requiredForPush: true, requiredForProduction: true },
    { name: "Client demo polish", command: "npm run client-demo:verify", purpose: "Demo-mode copy and boundaries.", riskLevel: ro, requiredForDemo: true, requiredForPush: true, requiredForProduction: true },
    { name: "Client organization linkage", command: "npm run client-org:verify", purpose: "Org linkage guardrails.", riskLevel: ro, requiredForDemo: true, requiredForPush: true, requiredForProduction: true },
    { name: "Client review notes", command: "npm run client-notes:verify", purpose: "Review notes surface checks.", riskLevel: ro, requiredForDemo: true, requiredForPush: true, requiredForProduction: true },
    { name: "ProCrow portal UX", command: "npm run procrow:verify", purpose: "ProCrow + CyberCrow + SAREA + go/no-go + operator console verifier chain.", riskLevel: ro, requiredForDemo: true, requiredForPush: true, requiredForProduction: true },
    { name: "ProCrow control tower", command: "npm run procrow-dashboard:verify", purpose: "Admin overview / dashboard depth.", riskLevel: ro, requiredForDemo: true, requiredForPush: true, requiredForProduction: true },
    { name: "ProCrow operator queue", command: "npm run procrow-queue:verify", purpose: "J3 queue contracts and copy.", riskLevel: ro, requiredForDemo: true, requiredForPush: true, requiredForProduction: true },
    { name: "ProCrow go/no-go verifier", command: "npm run procrow-go-no-go:verify", purpose: "J6 center wiring and forbidden-claim guards.", riskLevel: ro, requiredForDemo: true, requiredForPush: true, requiredForProduction: true },
    { name: "ProCrow operator console", command: "npm run procrow-operator:verify", purpose: "J7 docs + validation console wiring and manual-execution guards.", riskLevel: ro, requiredForDemo: true, requiredForPush: true, requiredForProduction: true },
    { name: "CyberCrow UX depth", command: "npm run cybercrow:verify", purpose: "Trust / evidence / GRC advisory surfaces.", riskLevel: ro, requiredForDemo: true, requiredForPush: true, requiredForProduction: true },
    { name: "SAREA studio UX depth", command: "npm run sarea:ux-verify", purpose: "Experience studio depth checks.", riskLevel: ro, requiredForDemo: true, requiredForPush: true, requiredForProduction: true },
    { name: "ERP module catalog", command: "npm run erp:verify", purpose: "ERP module registry consistency.", riskLevel: ro, requiredForDemo: false, requiredForPush: false, requiredForProduction: true },
    { name: "Sector catalog", command: "npm run sector:verify", purpose: "Sector template catalog integrity.", riskLevel: ro, requiredForDemo: false, requiredForPush: false, requiredForProduction: true },
    { name: "Runtime cohesion", command: "npm run runtime:verify", purpose: "Cross-module runtime wiring checks.", riskLevel: ro, requiredForDemo: false, requiredForPush: true, requiredForProduction: true },
    { name: "Request pipeline", command: "npm run request:pipeline:verify", purpose: "Discovery pipeline (uses .env.staging).", riskLevel: wl, requiredForDemo: false, requiredForPush: false, requiredForProduction: true, caution: "Requires staging env file; not read-only against configured DB." },
    { name: "Simulate Vercel staging build", command: "npm run simulate:vercel-build:staging", purpose: "Local staging-oriented build guard.", riskLevel: ds, requiredForDemo: false, requiredForPush: true, requiredForProduction: true, caution: "Deployment-sensitive — review Vercel/staging env before running." },
    { name: "Prisma migrate deploy", command: "npm run db:migrate:deploy", purpose: "Apply pending migrations to the target database.", riskLevel: dw, requiredForDemo: false, requiredForPush: false, requiredForProduction: true, caution: "DB-write — requires explicit approval; never run casually." },
    { name: "Prisma generate", command: "npm run db:generate", purpose: "Regenerate Prisma client from schema (no DDL).", riskLevel: ro, requiredForDemo: true, requiredForPush: true, requiredForProduction: true },
    { name: "Seed sector templates", command: "npm run db:seed:sectors", purpose: "Writes sector template seed data.", riskLevel: dw, requiredForDemo: false, requiredForPush: false, requiredForProduction: false, caution: "DB-write — staging/local only unless explicitly approved." },
    { name: "Seed Meem demo tenant", command: "npm run db:seed:meem", purpose: "Demo tenant seed path.", riskLevel: dw, requiredForDemo: false, requiredForPush: false, requiredForProduction: false, caution: "DB-write — destructive capacity; operator-approved only." },
  ];
}
