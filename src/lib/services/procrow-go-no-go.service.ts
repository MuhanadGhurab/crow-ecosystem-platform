import "server-only";

import {
  PROCROW_F23_PRODUCTION_GATE_ACTIVE,
  PROCROW_GO_NO_GO_DOC_REFS,
  type ProCrowGateItem,
  type ProCrowGoNoGoDecision,
  type ProCrowGoNoGoSnapshot,
  buildProCrowValidationCommandIndex,
} from "@/lib/procrow/procrow-go-no-go-contract";

function buildDefaultGates(): ProCrowGateItem[] {
  const d = (partial: ProCrowGateItem): ProCrowGateItem => partial;

  return [
    d({
      key: "f23-production-launch-gate",
      category: "production_gate",
      label: "F23 production launch gate",
      status: "advisory",
      description:
        "Production commercial launch remains F23-gated — advisory readiness only in this workspace. No production launch approval is implied by this center.",
      evidence: "Strategy gate documented under F23; operator sign-off still required for any production path.",
      relatedDoc: "docs/internal/F23_PRODUCTION_LAUNCH_DEFERRED_GATE.md",
      operatorAction:
        "Confirm client/budget approval, production environment approval, migration approval, backup/rollback plan, payment decision, security review, manual smoke tests, and explicit go/no-go sign-off before any production launch discussion.",
    }),
    d({
      key: "validation-baseline-not-in-app",
      category: "validation",
      label: "Validation baseline (operator-run)",
      status: "not_run",
      description:
        "npm validation scripts are not executed inside the Go/No-Go Center. Pass/fail for mock:verify, typecheck, lint, build, and ProCrow verifiers must be confirmed locally or in CI.",
      relatedDoc: "docs/internal/VALIDATION_PLAYBOOK.md",
      operatorAction: "Run the validation command checklist locally (see below). Record outcomes in your release notes or ticket.",
    }),
    d({
      key: "git-hygiene-discipline",
      category: "git_hygiene",
      label: "Git hygiene & release discipline",
      status: "advisory",
      description: "Follow internal git safety guidance — no forbidden secrets, no casual migration deploy from UI, no deploy automation trigger from ProCrow.",
      relatedDoc: "docs/internal/GIT_SAFETY_GUIDE.md",
      operatorAction: "Review GIT_SAFETY_GUIDE before push; keep .env* and build artifacts out of commits.",
    }),
    d({
      key: "database-migration-caution",
      category: "database",
      label: "Migrations & database writes",
      status: "advisory",
      description:
        "Migrations change remote schema when pointed at a live database. Vercel or CI may invoke db:migrate:deploy only when explicitly configured — treat every migration as requiring explicit approval. Prisma generate does not apply DDL. Destructive seeds are out of scope for casual runs.",
      evidence: "Example: additive migrations (e.g. I9) were explicitly approved before push.",
      relatedCommand: "npm run db:migrate:deploy",
      relatedDoc: "docs/internal/VALIDATION_PLAYBOOK.md",
      risk: "db_write",
      operatorAction:
        "Use prisma migrate status / review _prisma_migrations when investigating drift. Do not run migrate deploy without written approval and rollback posture.",
    }),
    d({
      key: "payments-deferred",
      category: "payments",
      label: "Payments & checkout",
      status: "advisory",
      description:
        "Live payments remain disabled/deferred under current business constraints. Pricing surfaces are advisory. No checkout activation unless explicitly approved.",
      relatedDoc: "docs/internal/F23_PRODUCTION_LAUNCH_DEFERRED_GATE.md",
      operatorAction: "Do not enable live PSP keys or production billing without F23-style approvals.",
    }),
    d({
      key: "tenant-provisioning-controlled",
      category: "tenant_runtime",
      label: "Tenant auto provisioning",
      status: "advisory",
      description:
        "No automatic tenant provisioning from client approval — onboarding remains ProCrow-controlled. Tenant runtime readiness is separate from production commercial launch.",
      operatorAction: "Provision tenants only through approved operator flows; keep staging/demo boundaries clear.",
    }),
    d({
      key: "client-portal-guardrails",
      category: "client_portal",
      label: "Client portal & onboarding control",
      status: "advisory",
      description:
        "Client approval and onboarding remain operator-visible; the portal does not replace legal sign-off or production launch authority.",
      relatedDoc: "docs/internal/CLIENT_PORTAL_RUNBOOK.md",
      operatorAction: "Run client-portal:* verifiers before demo or push when client flows changed.",
    }),
    d({
      key: "no-paid-infra-default",
      category: "deployment",
      label: "No paid infrastructure activation",
      status: "advisory",
      description:
        "This workspace assumes staging/demo/portfolio mode — no paid infra activation is implied by passing local validation.",
      operatorAction: "Verify Vercel/Supabase tiers and env targets before any paid resource change.",
    }),
    d({
      key: "cybercrow-readiness-signal",
      category: "cybercrow",
      label: "CyberCrow trust surfaces",
      status: "not_run",
      description: "CyberCrow UX depth verifier must be run by an operator or CI — advisory GRC/evidence copy is not a compliance certification.",
      relatedCommand: "npm run cybercrow:verify",
      operatorAction: "Run npm run cybercrow:verify after CyberCrow-affecting changes.",
    }),
    d({
      key: "cybercrow-tenant-trust-m1",
      category: "cybercrow",
      label: "CyberCrow tenant trust readiness (M1)",
      status: "needs_review",
      description:
        "Per-tenant identity, GRC, evidence, risk, and access-review snapshots are advisory — not certified compliance, not legal audit evidence, not live Entra sync. ProCrow owns final Go/No-Go.",
      relatedCommand: "npm run cybercrow-trust:verify",
      operatorAction:
        "Review tenant trust on ProCrow tenant workbench; run npm run cybercrow-trust:verify after M1 trust model changes.",
    }),
    d({
      key: "sarea-blueprint-experience-m2",
      category: "sarea",
      label: "SAREA blueprint-to-experience mapping (M2)",
      status: "needs_review",
      description:
        "Persona, navigation, and widget recommendations are advisory. RBAC controls access; SAREA shapes experience — no permission grants or autonomous personalization.",
      relatedCommand: "npm run sarea-blueprint:verify",
      operatorAction:
        "Review SAREA mapping on tenant workbench and studio; run npm run sarea-blueprint:verify after M2 changes.",
    }),
    d({
      key: "cem-operating-model-m31",
      category: "tenant_runtime",
      label: "CEM core operating model integration (M3.1)",
      status: "needs_review",
      description:
        "CEM operating model maps tenant modules, workflows, tasks, and reports as one staging operating spine. Advisory until ProCrow tenant workbench review — not production launch. CyberCrow observability and SAREA experience hooks are described, not certified.",
      relatedCommand: "npm run cem-operating-model:verify",
      operatorAction:
        "Review CEM Core Operating Model panel on ProCrow tenant workbench; confirm cross-module flows on Business Portal dashboard; run npm run cem-operating-model:verify after M3.1 changes.",
    }),
    d({
      key: "cem-module-depth-m32",
      category: "tenant_runtime",
      label: "CEM module depth pass (M3.2)",
      status: "needs_review",
      description:
        "Module depth panels on HR–Reports expose operational records, cross-module flows, tasks, reports, CyberCrow trust, and SAREA experience per ERP area. Advisory staging depth — not a production transaction engine. Does not auto-pass Go/No-Go.",
      relatedCommand: "npm run cem-module-depth:verify",
      operatorAction:
        "Review CEM module depth summary on ProCrow tenant workbench; walk Business Portal module pages for depth panels; run npm run cem-module-depth:verify after M3.2 changes.",
    }),
    d({
      key: "cem-transaction-workflow-m33",
      category: "tenant_runtime",
      label: "CEM transaction workflow prototype (M3.3)",
      status: "needs_review",
      description:
        "Purchase-to-stock connects department request, procurement, finance approval, warehouse receiving, inventory visibility, tasks, reports, CyberCrow evidence, and SAREA role views. Staging prototype — not payments, accounting posting, legal PO, or production stock mutation. Warning until tenant-backed persistence and a completed demo flow are verified.",
      relatedCommand: "npm run cem-transaction:verify",
      operatorAction:
        "Review transaction workflow panel on ProCrow tenant workbench; walk /workflows/purchase-to-stock on a seeded tenant; run npm run cem-transaction:verify after M3.3 changes.",
    }),
    d({
      key: "cem-runtime-handoff-m3",
      category: "tenant_runtime",
      label: "CEM runtime handoff & Business Portal staging readiness (M3)",
      status: "needs_review",
      description:
        "CEM runtime handoff confirms the staging Business Portal is operationally usable — modules, org structure, tasks, workflows, and reports visibility. It does not approve production launch. CyberCrow trust and SAREA experience mapping remain dependencies.",
      relatedCommand: "npm run cem-handoff:verify",
      operatorAction:
        "Review CEM handoff panel on ProCrow tenant workbench; open Business Portal dashboard for staging walkthrough; run npm run cem-handoff:verify after M3 changes.",
    }),
    d({
      key: "sarea-readiness-signal",
      category: "sarea",
      label: "SAREA experience studio",
      status: "not_run",
      description: "SAREA UX verifier is operator-run; studio readiness is separate from production launch.",
      relatedCommand: "npm run sarea:ux-verify",
      operatorAction: "Run npm run sarea:ux-verify after SAREA-affecting changes.",
    }),
    d({
      key: "procrow-stack-readiness",
      category: "procrow",
      label: "ProCrow stack verifiers",
      status: "not_run",
      description: "Portal, control tower, operator queue, and go/no-go wiring are guarded by npm scripts — not evaluated inside this page.",
      relatedCommand: "npm run procrow:verify",
      operatorAction: "Run npm run procrow:verify before merge when ProCrow surfaces change.",
    }),
    d({
      key: "public-boundary",
      category: "public_boundary",
      label: "Public / portfolio boundary",
      status: "not_run",
      description: "Public mirror manifest checks portfolio packaging — does not authorize production launch.",
      relatedCommand: "npm run public:mirror-manifest",
      operatorAction: "Run npm run public:mirror-manifest when public assets or mirror metadata change.",
    }),
  ];
}

function deriveDemoDecision(gates: ProCrowGateItem[]): ProCrowGoNoGoDecision {
  const blocked = gates.filter((g) => g.status === "blocked").length;
  if (blocked > 0) return "blocked";
  const needsReview = gates.filter((g) => g.status === "needs_review").length;
  if (needsReview > 0) return "conditional_go";
  const notRun = gates.filter((g) => g.status === "not_run").length;
  if (notRun > 0) return "conditional_go";
  return "go";
}

/**
 * Returns advisory go/no-go metadata only. Does not run shell commands,
 * read secrets, deploy, or migrate.
 */
export async function getProCrowGoNoGoSnapshot(): Promise<ProCrowGoNoGoSnapshot> {
  const generatedAt = new Date().toISOString();
  const gates = buildDefaultGates();
  const validationCommands = buildProCrowValidationCommandIndex();

  const productionLaunchDecision: ProCrowGoNoGoDecision = PROCROW_F23_PRODUCTION_GATE_ACTIVE ? "no_go" : "not_evaluated";

  const blockers: string[] = [];
  if (productionLaunchDecision === "no_go") {
    blockers.push(
      "Production commercial launch remains no-go under F23 until explicit client/budget, environment, migration, backup, payment, security, smoke-test, and sign-off criteria are met (see F23 doc)."
    );
  }

  const warnings: string[] = [
    "Validation script outcomes are not evaluated in-app — conditional go for demo/staging assumes you run the checklist locally or in CI.",
    "db:migrate:deploy, db:seed:*, and simulate:vercel-build:staging can mutate data or stress deployment paths — never run casually.",
  ];

  const decision = deriveDemoDecision(gates);

  const nextActions: string[] = [
    "Run npm run mock:verify && npm run typecheck && npm run lint && npm run build && npm run public:mirror-manifest.",
    "Run npm run procrow:verify (includes portal, dashboard, queue, CyberCrow, SAREA, and go/no-go verifier).",
    "Open docs/internal/F23_PRODUCTION_LAUNCH_DEFERRED_GATE.md before any production launch conversation.",
    "If schema changed, obtain explicit migration approval before npm run db:migrate:deploy against shared or production targets.",
  ];

  const safetyNotes: string[] = [
    "No automatic deployment, migration execution, payment activation, or tenant auto provisioning from this UI.",
    "No compliance certification, autonomous AI security claims, or production-ready assertions — advisory operator readiness only.",
    "No paid infrastructure activation is implied by this center.",
  ];

  const summary =
    decision === "conditional_go"
      ? "Conditional go for demo/staging — validation baseline must be operator-run locally or in CI. Production commercial launch remains F23-gated (no-go until explicit approvals)."
      : "Review gate list — address blocked or needs_review items before treating the workspace as demo-safe.";

  return {
    generatedAt,
    mode: "staging_demo",
    decision,
    productionLaunchDecision,
    summary,
    gates,
    validationCommands,
    blockers,
    warnings,
    nextActions,
    docs: PROCROW_GO_NO_GO_DOC_REFS,
    safetyNotes,
  };
}
