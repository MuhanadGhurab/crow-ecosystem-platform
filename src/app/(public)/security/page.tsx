import Link from "next/link";
import { PublicPageHeader } from "@/components/public/public-page-header";
import { CyberCrowSecurityTrustPanel } from "@/components/trust/cybercrow-security-trust-panel";
import { SECURITY_PACKAGES } from "@/lib/constants/security-packages";
import { PLATFORM_IDENTITIES } from "@/lib/constants/platform";
import {
  COMPLIANCE_ALIGNMENT_DISCLAIMER,
  COMPLIANCE_ALIGNMENT_STATEMENT,
} from "@/lib/legal/compliance-positioning";

const NCA_BLOCKS = [
  {
    title: "NCA-aware readiness",
    body: "CyberCrow packages map to essential cybersecurity controls — RBAC, audit trails, incident workflows, and evidence suitable for regulated Saudi & GCC enterprises. This is alignment and operator workflow support, not certification.",
  },
  {
    title: "Microsoft Entra ID",
    body: "Enterprise tiers support Entra ID SSO at intake and provision — identity coherence from request through tenant CyberCrow console.",
  },
  {
    title: "Auditor-ready narrative",
    body: "Compliance, GRC, and audit-log surfaces support read-only auditor walkthroughs — baseline protection through Fortress-grade monitoring and evidence catalogs.",
  },
] as const;

const CYBERCROW_CAPABILITIES = [
  {
    title: "Audit logs",
    body: "Append-only CyberCrow audit trail for security-relevant actions — linked from incidents, events, and evidence gaps for operator review.",
  },
  {
    title: "Incidents",
    body: "Structured incident records with status, severity, and evidence-ready checklists — human-owned workflows, not autonomous remediation.",
  },
  {
    title: "Evidence readiness",
    body: "Evidence catalog and gap model: which controls have file-backed or narrative evidence, what is missing, and suggested next steps for operators.",
  },
  {
    title: "GRC mapping",
    body: "Control readiness by domain — maps NCA-aligned controls to evidence counts and advisory labels (ready for review, needs evidence, advisory only).",
  },
  {
    title: "Risk posture",
    body: "Rule-based risk score and summaries that incorporate open incidents, unreviewed events, and GRC findings — advisory posture, not a certified rating.",
  },
] as const;

const NOT_CLAIMS = [
  "Not a SIEM or SOC platform replacement — no full log ingestion, correlation engine, or 24/7 managed detection.",
  "Not guaranteed compliance or certification — readiness language and operator workflows only.",
  "Not autonomous AI threat detection — no marketed “AI SOC”; signals and scores are rule-based and human-reviewed.",
] as const;

export default function SecurityPage() {
  return (
    <div className="cc-entity-cybercrow min-h-screen">
      <PublicPageHeader
        badge="CyberCrow · Security & trust positioning"
        title="Security packages"
        description="CyberCrow is your trust and security posture layer — evidence readiness, audit visibility, and GRC/risk advisory. Designed with reference to recognized standards; not a SIEM replacement or compliance certificate."
      />
      <div className="cc-public-section space-y-14">
        <section className="cc-glass-card border-violet-500/15 p-5 sm:p-6">
          <p className="text-sm font-medium text-violet-200">{COMPLIANCE_ALIGNMENT_STATEMENT}</p>
          <p className="mt-2 text-sm text-slate-400">{COMPLIANCE_ALIGNMENT_DISCLAIMER}</p>
        </section>

        <CyberCrowSecurityTrustPanel />
        <div className="grid gap-4 md:grid-cols-3">
          {NCA_BLOCKS.map((block) => (
            <article key={block.title} className="cc-glass-card border-violet-500/15 p-5 sm:p-6">
              <span className="cc-nca-badge">{block.title}</span>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">{block.body}</p>
            </article>
          ))}
        </div>

        <section>
          <h2 className="font-display text-xl font-semibold text-white sm:text-2xl">
            What CyberCrow includes
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-400">
            Tenant CyberCrow consoles (after provision) combine these operator-facing areas — depth varies
            by package tier. All are designed for governance teams, not as a substitute for your existing
            security stack.
          </p>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CYBERCROW_CAPABILITIES.map((cap) => (
              <li
                key={cap.title}
                className="cc-glass-card cc-engine-card--cybercrow border-violet-500/15 p-5"
              >
                <h3 className="font-display text-base font-semibold text-white">{cap.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{cap.body}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="cc-public-band rounded-2xl border border-rose-500/15 bg-rose-950/10 p-6 sm:p-8">
          <h2 className="font-display text-lg font-semibold text-white">What this is not</h2>
          <p className="mt-2 text-sm text-slate-400">
            Honest scope boundaries — choose Crow packages for orchestrated readiness inside CEM, not as
            a standalone security product category.
          </p>
          <ul className="mt-5 space-y-3">
            {NOT_CLAIMS.map((line) => (
              <li key={line} className="flex gap-3 text-sm leading-relaxed text-slate-300">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-400/80" aria-hidden />
                {line}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <p className="mb-6 text-sm text-violet-200/90">
            <span className="cc-entity-badge cc-entity-badge--cybercrow !inline-flex !py-0.5">
              CyberCrow
            </span>{" "}
            — {PLATFORM_IDENTITIES.cybercrow.tagline}
          </p>

          <div className="grid gap-6 md:grid-cols-3">
            {SECURITY_PACKAGES.map((p) => (
              <article
                key={p.key}
                className="cc-glass-card cc-engine-card--cybercrow flex flex-col border-violet-500/20 p-6"
              >
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-violet-500/30 bg-violet-500/10 font-display text-sm font-bold text-violet-200"
                  aria-hidden
                >
                  {p.nameEn
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .slice(0, 2)}
                </span>
                <h2 className="mt-3 font-display text-lg font-semibold text-white">{p.nameEn}</h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-400">{p.descriptionEn}</p>
                <p className="mt-4 font-semibold text-violet-300">
                  +{p.monthlyAddonSar.toLocaleString()} SAR/mo
                </p>
              </article>
            ))}
          </div>
        </section>

        <div className="flex flex-wrap gap-3">
          <Link href="/request" className="cc-btn-primary">
            Configure in implementation request →
          </Link>
          <Link href="/pricing" className="cc-btn-secondary">
            View subscription tiers
          </Link>
        </div>
      </div>
    </div>
  );
}
