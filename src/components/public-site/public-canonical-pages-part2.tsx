import Link from "next/link";

import {
  PublicContentList,
  PublicContentPage,
  PublicContentSection,
} from "@/components/public-site/public-content-page";
import { publicRoutes } from "@/lib/public/routes";
import { PUBLIC_V2_MOTION_CLASS } from "@/lib/public-v2/motion";

function PlatformLinkCard({
  title,
  href,
  description,
  accent,
}: {
  title: string;
  href: string;
  description: string;
  accent: "cyan" | "violet" | "amber";
}) {
  const accentClass =
    accent === "cyan"
      ? "border-[color-mix(in_srgb,var(--pv2-cyan)_28%,var(--pv2-border))]"
      : accent === "violet"
        ? "border-[color-mix(in_srgb,var(--pv2-violet)_28%,var(--pv2-border))]"
        : "border-[color-mix(in_srgb,var(--pv2-amber)_28%,var(--pv2-border))]";

  return (
    <Link
      href={href}
      className={`pv2-card pv2-card-interactive block p-6 ${accentClass} ${PUBLIC_V2_MOTION_CLASS.button}`}
    >
      <h2 className="text-lg font-semibold text-[var(--pv2-text-primary)]">{title}</h2>
      <p className="mt-2 text-sm text-[var(--pv2-text-secondary)]">{description}</p>
      <span className="mt-4 inline-block text-sm font-medium text-[var(--pv2-cyan)]">Learn more →</span>
    </Link>
  );
}

export function PlatformOverviewPageContent() {
  return (
    <PublicContentPage
      eyebrow="One foundation"
      title="The Crow Platform"
      description="CEM, CyberCrow, SAREA, and ProCrow are one governed foundation — not four disconnected products. Runtime operates through the first three; lifecycle accountability operates through ProCrow."
    >
      <div className="pv2-platform-orbit">
        <p className="pv2-platform-hub">One governed organizational foundation</p>
        <PlatformLinkCard
          title="CEM"
          href={publicRoutes.platform.cem}
          description="Operational work engine — responsibilities, tasks, workflows, approvals, and outcomes."
          accent="cyan"
        />
        <PlatformLinkCard
          title="CyberCrow"
          href={publicRoutes.platform.cybercrow}
          description="Operational trust — identity, authorization enforcement, evidence, and auditability."
          accent="amber"
        />
        <PlatformLinkCard
          title="SAREA"
          href={publicRoutes.platform.sarea}
          description="Permitted experience adaptation — role-aware presentation that never grants permission."
          accent="violet"
        />
        <PlatformLinkCard
          title="ProCrow"
          href={publicRoutes.platform.procrow}
          description="Internal lifecycle governance — qualification, Blueprint review, readiness, and change control."
          accent="violet"
        />
      </div>
    </PublicContentPage>
  );
}

export function PlatformCemPageContent() {
  return (
    <PublicContentPage
      eyebrow="Operational work engine"
      title="CEM"
      description="CEM runs the organization's operational work — structured around responsibilities and workflows from the Blueprint, not around a generic ERP module grid."
    >
      <PublicContentSection title="What CEM runs">
        <PublicContentList
          items={[
            "Responsibilities and accountable ownership",
            "Tasks, cases, and workflow states",
            "Approvals, decisions, and capabilities",
            "Resources, outcomes, and operational records",
          ]}
        />
      </PublicContentSection>
      <PublicContentSection title="Capabilities, not modules">
        <p>
          Public pages describe capabilities that support the operating model. Module names may appear
          only where they clarify workflow support — never as the primary message.
        </p>
      </PublicContentSection>
      <Link href={publicRoutes.platform.overview} className={`pv2-link text-sm`}>
        ← Platform overview
      </Link>
    </PublicContentPage>
  );
}

export function PlatformCybercrowPageContent() {
  return (
    <PublicContentPage
      eyebrow="Operational trust"
      title="CyberCrow"
      description="CyberCrow is operational trust inside the tenant — not a generic cybersecurity product brochure."
    >
      <PublicContentSection title="Trust surfaces">
        <PublicContentList
          items={[
            "Identity trust and verification alignment",
            "Authorization enforcement — authoritative roles, not presentation",
            "Decision protection and approval integrity",
            "Evidence, auditability, and information boundaries",
            "Risk signals and incident visibility",
          ]}
        />
      </PublicContentSection>
      <PublicContentSection title="Entitlement bundles">
        <p>
          Shield, Sentinel, and Fortress may be referenced as entitlement and control bundles within
          CyberCrow — not as separate commercial products.
        </p>
      </PublicContentSection>
      <Link href={publicRoutes.security} className={`pv2-link text-sm`}>
        Security and governance assurance →
      </Link>
    </PublicContentPage>
  );
}

export function PlatformSareaPageContent() {
  return (
    <PublicContentPage
      eyebrow="Permitted presentation"
      title="SAREA"
      description="SAREA adapts how permitted work is presented — by role, Work Persona context, device, and complexity — without changing who is authorized to act."
    >
      <PublicContentSection title="Adaptation dimensions">
        <PublicContentList
          items={[
            "Role-aware navigation and priority emphasis",
            "Work Persona context — responsibility in operational settings",
            "Device-aware presentation",
            "Complexity adaptation and workflow visibility",
            "Executive, manager, specialist, frontline, and analyst experiences",
          ]}
        />
      </PublicContentSection>
      <div className="rounded-lg border border-[var(--pv2-amber)]/40 bg-[var(--pv2-amber-soft)] px-5 py-4">
        <p className="text-sm font-semibold text-[var(--pv2-text-primary)]">
          SAREA adapts presentation. It never grants permission.
        </p>
        <p className="mt-2 text-sm text-[var(--pv2-text-secondary)]">
          A Work Persona explains responsibility in context — it is not an authority-granting role.
        </p>
      </div>
    </PublicContentPage>
  );
}

export function PlatformProcrowPageContent() {
  return (
    <PublicContentPage
      eyebrow="Lifecycle governance"
      title="ProCrow"
      description="ProCrow is how Crow&apos;s intelligence becomes accountable — internal governance from qualification through go-live and continuous improvement."
    >
      <PublicContentSection title="Accountability surfaces">
        <PublicContentList
          items={[
            "Request qualification and Discovery quality",
            "Recommendation provenance and Model Forge",
            "Blueprint review and scope freeze",
            "Tenant readiness and Go-Live gates",
            "Lifecycle change control",
          ]}
        />
      </PublicContentSection>
      <p className="text-sm text-[var(--pv2-text-muted)]">
        ProCrow is not a fourth commercial customer product — it is Crow&apos;s governed operator
        accountability layer.
      </p>
    </PublicContentPage>
  );
}

export function SecurityPageContent() {
  return (
    <PublicContentPage
      eyebrow="Assurance"
      title="Security and Governance"
      description="Crow's security story spans tenant isolation, authoritative identity, audit evidence, and readiness controls — distinct from CyberCrow's in-tenant operational trust surfaces."
    >
      <PublicContentSection title="Platform assurance">
        <PublicContentList
          items={[
            "Tenant isolation and data boundaries",
            "Authoritative roles — separate from presentation",
            "Identity verification and account trust",
            "Audit evidence and approval controls",
            "Readiness controls before go-live",
            "Responsible compliance positioning — alignment, not certification claims",
          ]}
        />
      </PublicContentSection>
      <PublicContentSection title="Relationship to CyberCrow">
        <p>
          This page describes platform and service assurance.{" "}
          <Link href={publicRoutes.platform.cybercrow} className="pv2-link">
            CyberCrow
          </Link>{" "}
          describes operational trust inside the running tenant.
        </p>
      </PublicContentSection>
    </PublicContentPage>
  );
}

export function IndustriesPageContent() {
  const sectors = [
    { title: "Logistics", desc: "Fleet, warehouse, and fulfillment operating models." },
    { title: "Construction / EPC", desc: "Project-centric accountability and site workflows." },
    { title: "Services", desc: "Client delivery, utilization, and responsibility chains." },
    { title: "Retail / Operations", desc: "Store and supply-chain operational rhythm." },
    { title: "Public-sector-ready organizations", desc: "Governance-heavy operating models." },
    { title: "Startups / new ventures", desc: "Lean structure that scales with growth triggers." },
  ] as const;

  return (
    <PublicContentPage
      eyebrow="Operating models"
      title="Industries"
      description="Crow adapts through operating models and Blueprint domains — not through pre-packaged ERP module bundles."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sectors.map((s) => (
          <div key={s.title} className="pv2-card p-5">
            <h2 className="text-sm font-semibold text-[var(--pv2-text-primary)]">{s.title}</h2>
            <p className="mt-2 text-sm text-[var(--pv2-text-secondary)]">{s.desc}</p>
          </div>
        ))}
      </div>
      <p className="text-sm text-[var(--pv2-text-muted)]">
        Representative sectors only — no fabricated client logos or case studies.
      </p>
      <Link href={publicRoutes.newOrganization} className={`pv2-btn-primary mt-4 inline-flex ${PUBLIC_V2_MOTION_CLASS.button}`}>
        Build a New Organization
      </Link>
    </PublicContentPage>
  );
}

export function PricingPageContent() {
  return (
    <PublicContentPage
      eyebrow="Commercial model"
      title="How Crow Is Scoped Commercially"
      description="Crow is scoped around your organization and approved Blueprint — not generic SaaS tiers. Implementation is proposed after Blueprint scope freeze; ongoing service continues through a monthly tenant subscription."
    >
      <PublicContentSection title="Implementation">
        <p>
          After Blueprint scope freeze, Crow issues a Commercial Proposal and Implementation
          Agreement with an Implementation Payment Schedule aligned to approved build work.
        </p>
      </PublicContentSection>
      <PublicContentSection title="Monthly tenant subscription">
        <p>
          The operational tenant continues under a Monthly Tenant Subscription Agreement covering
          operational service, maintenance, support, governed lifecycle operations, and capability
          access through entitlements.
        </p>
      </PublicContentSection>
      <PublicContentSection title="Optional CroAI add-on">
        <p>
          CroAI is an optional tenant intelligence subscription addendum — permission-aware,
          tenant-scoped, auditable, and advisory by default. CroAI never grants authority and is not
          yet operational in runtime.
        </p>
      </PublicContentSection>
      <p className="text-sm text-[var(--pv2-text-muted)]">
        No public prices are published here — scope is determined through the governed lifecycle, not
        self-serve checkout.
      </p>
      <Link href={publicRoutes.request} className={`pv2-btn-primary mt-4 inline-flex ${PUBLIC_V2_MOTION_CLASS.button}`}>
        Discuss Your Organization
      </Link>
    </PublicContentPage>
  );
}

export function CaseStudiesDeferredPageContent() {
  return (
    <PublicContentPage
      eyebrow="Evidence"
      title="Case Studies"
      description="Crow does not publish fabricated proof. Case studies will appear when real client evidence is approved for public release."
    >
      <p className="text-sm text-[var(--pv2-text-secondary)]">
        Until then, explore how Crow works through the lifecycle and operating-model journey pages.
      </p>
      <Link href={publicRoutes.howCrowWorks} className={`pv2-btn-primary mt-6 inline-flex ${PUBLIC_V2_MOTION_CLASS.button}`}>
        How Crow Works
      </Link>
    </PublicContentPage>
  );
}
