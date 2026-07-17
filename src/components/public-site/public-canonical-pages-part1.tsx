import Link from "next/link";
import type { ReactNode } from "react";

import {
  PublicAccessCallout,
  PublicContentList,
  PublicContentPage,
  PublicContentSection,
  PublicLifecycleRail,
} from "@/components/public-site/public-content-page";
import { PublicClientJourneySteps } from "@/components/public-site/public-client-journey-steps";
import { buildSignupHandoffUrl } from "@/lib/public/journey-handoff";
import { publicRoutes } from "@/lib/public/routes";
import { PUBLIC_V2_MOTION_CLASS } from "@/lib/public-v2/motion";
import { PUBLIC_V2_JOURNEY_CTA_CLASS } from "@/lib/public-v2/tokens";

function GateCard({
  title,
  summary,
  stages,
  boundaries,
}: {
  title: string;
  summary: string;
  stages: readonly string[];
  boundaries?: readonly string[];
}) {
  return (
    <section className="pv2-card pv2-card-interactive p-6 sm:p-8">
      <h2 className="text-lg font-semibold text-[var(--pv2-text-primary)]">{title}</h2>
      <p className="pv2-body mt-3">{summary}</p>
      <PublicContentList items={stages} />
      {boundaries?.length ? (
        <div className="mt-4 rounded-lg border border-[var(--pv2-amber)]/30 bg-[var(--pv2-amber-soft)] px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--pv2-text-muted)]">
            Governance boundaries
          </p>
          <ul className="mt-2 space-y-1 text-sm text-[var(--pv2-text-secondary)]" role="list">
            {boundaries.map((b) => (
              <li key={b}>· {b}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}

function CtaRow({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap gap-3 pt-4">{children}</div>;
}

export function HowCrowWorksPageContent() {
  return (
    <PublicContentPage
      mood="teal"
      eyebrow="Service lifecycle"
      title="How Crow Works"
      description="Crow is one governed design-to-runtime service. Clients enter through Build New or Transform Existing, then move through qualification, discovery, blueprint, commercial agreement, build, and runtime — with ProCrow accountability throughout."
      introExtra={
        <PublicAccessCallout>
          You can read every public page without signing in. Account creation is required only when you
          begin the secure client process — Request, Discovery, Blueprint review, or Client Portal entry.
        </PublicAccessCallout>
      }
    >
      <PublicClientJourneySteps highlight={["browse", "choose", "signin", "request"]} compact />

      <PublicLifecycleRail
        gates={[
          { title: "Request", summary: "Qualification & structured intake" },
          { title: "Discovery", summary: "Operating context & recommendations" },
          { title: "Blueprint", summary: "Reviewed organizational design" },
          { title: "Build", summary: "Tenant from approved Blueprint" },
          { title: "Runtime", summary: "CEM · CyberCrow · SAREA" },
        ]}
      />

      <GateCard
        title="Request"
        summary="Structured intake after account verification. A request does not create a tenant or grant operational authority."
        stages={[
          "Explore and choose Build New or Transform Existing",
          "Account creation and identity verification",
          "Structured request — organization context, not ERP module shopping",
          "ProCrow qualification — fit, scope, and readiness to proceed",
        ]}
        boundaries={["Request does not create a tenant", "Payment does not grant authority"]}
      />

      <GateCard
        title="Discovery"
        summary="Crow and ProCrow learn how the organization works today or should work tomorrow. Discovery informs recommendations — it does not finalize design or grant roles."
        stages={[
          "Operating context — people, responsibilities, workflows, trust",
          "Current systems and constraints (transform path)",
          "Essential capabilities and growth triggers (new path)",
          "Discovery summary with provenance on recommendations",
        ]}
        boundaries={[
          "Discovery does not grant authority",
          "Recommendations are not automatically final",
        ]}
      />

      <GateCard
        title="Blueprint"
        summary="The Enterprise Blueprint is the reviewed organizational design source. Tenant build requires an approved Blueprint — not a module checklist."
        stages={[
          "Operating-model composition",
          "Enterprise Blueprint domains — intent through implementation",
          "ProCrow review and client review cycles",
          "Blueprint scope freeze before commercial proposal",
        ]}
        boundaries={["Blueprint requires review", "Tenant build requires approved Blueprint"]}
      />

      <PublicContentSection title="Commercial sequence (after scope freeze)">
        <p>
          Commercial work follows Blueprint scope freeze — not before. Crow scopes implementation
          around the approved organization design.
        </p>
        <PublicContentList
          items={[
            "Blueprint Scope Freeze",
            "Commercial Proposal",
            "Agreement Acceptance",
            "Initial Payment",
            "Tenant Build",
          ]}
        />
        <p className="text-sm text-[var(--pv2-text-muted)]">
          Payment status remains separate from identity, tenant membership, authorization, and role
          assignment. Initial payment enables build work — it does not grant runtime authority.
        </p>
      </PublicContentSection>

      <GateCard
        title="Build"
        summary="Crow provisions the operational tenant from the approved Blueprint — CEM, CyberCrow, SAREA configuration, and readiness gates."
        stages={[
          "Tenant build from approved Blueprint",
          "Readiness and onboarding checks",
          "Go-Live gates with ProCrow accountability",
        ]}
        boundaries={["Go-live requires readiness checks"]}
      />

      <GateCard
        title="Runtime"
        summary="Ongoing operations through CEM, CyberCrow trust enforcement, and SAREA presentation adaptation — with monthly tenant subscription continuity."
        stages={[
          "CEM — responsibilities, tasks, workflows, approvals, outcomes",
          "CyberCrow — identity trust, authorization, audit evidence",
          "SAREA — role-aware presentation (never permission)",
          "Continuous improvement under governed lifecycle change control",
        ]}
        boundaries={[
          "SAREA never grants permission",
          "CroAI never grants authority — advisory, tenant-scoped, optional add-on",
        ]}
      />

      <CtaRow>
        <Link href={publicRoutes.start} className={`pv2-btn-secondary ${PUBLIC_V2_MOTION_CLASS.button}`}>
          Start Designing
        </Link>
        <Link href={publicRoutes.enterpriseBlueprint} className={`pv2-btn-secondary ${PUBLIC_V2_MOTION_CLASS.button}`}>
          Enterprise Blueprint
        </Link>
      </CtaRow>
    </PublicContentPage>
  );
}

export function NewOrganizationPageContent() {
  const steps = [
    "Idea",
    "Purpose",
    "Business Model",
    "Expected Scale",
    "Essential Capabilities",
    "Responsibilities",
    "Work Personas",
    "Core Workflows",
    "Trust Requirements",
    "Growth Triggers",
    "Enterprise Blueprint",
  ] as const;

  return (
    <PublicContentPage
      mood="teal"
      eyebrow="Build New"
      title="Build a New Organization"
      description="For a new idea, startup, division, or operation that needs structure before scale — Crow designs the operating model first, then the system."
    >
      <PublicContentSection title="Journey">
        <PublicContentList items={steps} />
      </PublicContentSection>

      <PublicContentSection title="Scale and responsibility preview">
        <p>
          Representative preview only — not final AI generation. Crow maps expected scale to
          essential responsibilities and lean Work Personas before Blueprint review.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {[
            { scale: "Founding team", resp: "Core approvals, shared accountability" },
            { scale: "Early operations", resp: "Defined workflows, trust boundaries" },
            { scale: "Growth trigger", resp: "Expanded roles, governed capabilities" },
          ].map((row) => (
            <div key={row.scale} className="rounded-lg border border-[var(--pv2-border)] bg-[var(--pv2-surface-raised)] p-4">
              <p className="text-xs font-semibold text-[var(--pv2-cyan)]">{row.scale}</p>
              <p className="mt-1 text-sm text-[var(--pv2-text-secondary)]">{row.resp}</p>
            </div>
          ))}
        </div>
      </PublicContentSection>

      <CtaRow>
        <Link href={buildSignupHandoffUrl("NEW")} className={`${PUBLIC_V2_JOURNEY_CTA_CLASS} ${PUBLIC_V2_MOTION_CLASS.button}`}>
          Start Building New
        </Link>
        <Link href={publicRoutes.howCrowWorks} className={`pv2-btn-secondary ${PUBLIC_V2_MOTION_CLASS.button}`}>
          How Crow Works
        </Link>
      </CtaRow>
    </PublicContentPage>
  );
}

export function TransformExistingPageContent() {
  return (
    <PublicContentPage
      mood="purple"
      eyebrow="Transform Existing"
      title="Transform an Existing Organization"
      description="Crow maps how your organization works today, preserves what must continue, and designs a governed transition to a target operating model."
    >
      <PublicContentSection title="Journey">
        <PublicContentList
          items={[
            "Current Organization",
            "Current Teams",
            "Current Systems",
            "Current Workflows",
            "Problems and Constraints",
            "Preserved Elements",
            "Target Operating Model",
            "Transition Blueprint",
            "Pilot",
            "Migration",
          ]}
        />
      </PublicContentSection>

      <PublicContentSection title="Triple Blueprint model">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { title: "Current Operating Map", desc: "Honest picture of teams, systems, and workflows today." },
            { title: "Target Operating Blueprint", desc: "Where the organization should operate after transformation." },
            { title: "Transition Blueprint", desc: "Phased path — pilot, migration, and preserved elements." },
          ].map((card) => (
            <div key={card.title} className="rounded-lg border border-[var(--pv2-violet)]/25 bg-[var(--pv2-violet-soft)] p-4">
              <h3 className="text-sm font-semibold text-[var(--pv2-text-primary)]">{card.title}</h3>
              <p className="mt-2 text-sm text-[var(--pv2-text-secondary)]">{card.desc}</p>
            </div>
          ))}
        </div>
      </PublicContentSection>

      <CtaRow>
        <Link href={buildSignupHandoffUrl("TRANSFORM")} className={`${PUBLIC_V2_JOURNEY_CTA_CLASS} ${PUBLIC_V2_MOTION_CLASS.button}`}>
          Start Transforming
        </Link>
        <Link href={publicRoutes.howCrowWorks} className={`pv2-btn-secondary ${PUBLIC_V2_MOTION_CLASS.button}`}>
          How Crow Works
        </Link>
      </CtaRow>
    </PublicContentPage>
  );
}

export function EnterpriseBlueprintPageContent() {
  const domains = [
    { title: "Intent", desc: "Purpose, scope, and organizational direction." },
    { title: "Organization and Responsibilities", desc: "Teams, accountability, and Work Personas." },
    { title: "Workflows and Capabilities", desc: "How work moves — not a module catalog." },
    { title: "Trust and Experience", desc: "Authorization posture and SAREA presentation intent." },
    { title: "Runtime and Integrations", desc: "CEM, CyberCrow, and connected systems." },
    { title: "Implementation", desc: "Build sequence, readiness, and go-live gates." },
  ] as const;

  const provenance = [
    "Client Provided",
    "Crow Recommended",
    "ProCrow Reviewed",
    "Client Approved",
    "System Generated",
  ] as const;

  return (
    <PublicContentPage
      mood="purple"
      eyebrow="Design source"
      title="Enterprise Blueprint"
      description="The Blueprint is the reviewed organizational design from which the tenant is built — not a list of ERP modules."
    >
      <div className="pv2-blueprint-frame">
        <div className="pv2-blueprint-frame-header">
          <p className="text-sm font-semibold text-[var(--pv2-violet)]">Enterprise Blueprint artifact</p>
          <span className="pv2-provenance-chip">Reviewed before build</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {domains.map((d) => (
            <div key={d.title} className="pv2-card p-5">
              <h2 className="text-sm font-semibold text-[var(--pv2-violet)]">{d.title}</h2>
              <p className="mt-2 text-sm text-[var(--pv2-text-secondary)]">{d.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <PublicContentSection title="Provenance" variant="frame">
        <p>Every Blueprint element carries provenance — accountability, not anonymous configuration.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {provenance.map((p) => (
            <span key={p} className="pv2-provenance-chip">
              {p}
            </span>
          ))}
        </div>
      </PublicContentSection>

      <PublicContentSection title="Approval before build">
        <p>
          Blueprint approval precedes tenant build. Commercial proposal follows Blueprint scope
          freeze — implementation is scoped to the approved organization design.
        </p>
      </PublicContentSection>

      <CtaRow>
        <Link href={publicRoutes.howCrowWorks} className={`pv2-btn-secondary ${PUBLIC_V2_MOTION_CLASS.button}`}>
          See the full lifecycle
        </Link>
      </CtaRow>
    </PublicContentPage>
  );
}
