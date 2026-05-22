import Link from "next/link";
import { PublicPageHeader } from "@/components/public/public-page-header";
import { SECURITY_PACKAGES } from "@/lib/constants/security-packages";
import { PLATFORM_IDENTITIES } from "@/lib/constants/platform";

const NCA_BLOCKS = [
  {
    title: "NCA ECC alignment",
    body: "CyberCrow packages map to essential cybersecurity controls — RBAC, audit trails, incident workflows, and evidence suitable for regulated Saudi & GCC enterprises.",
  },
  {
    title: "Microsoft Entra ID",
    body: "Enterprise tiers support Entra ID SSO at intake and provision — identity coherence from request through tenant CyberCrow console.",
  },
  {
    title: "Auditor-ready posture",
    body: "Compliance, GRC, and audit-log surfaces are designed for read-only auditor narrative — baseline protection through Fortress-grade monitoring.",
  },
] as const;

export default function SecurityPage() {
  return (
    <div className="cc-entity-cybercrow min-h-screen">
      <PublicPageHeader
        badge="CyberCrow · NCA-aware"
        title="Security packages"
        description={PLATFORM_IDENTITIES.cybercrow.description}
      />
      <div className="cc-public-section">
        <div className="mb-10 grid gap-4 md:grid-cols-3">
          {NCA_BLOCKS.map((block) => (
            <article key={block.title} className="cc-glass-card border-violet-500/15">
              <span className="cc-nca-badge">{block.title}</span>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">{block.body}</p>
            </article>
          ))}
        </div>

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
              className="cc-glass-card cc-engine-card--cybercrow flex flex-col border-violet-500/20"
            >
              <span className="text-3xl">{p.icon}</span>
              <h2 className="mt-3 font-display text-lg font-semibold text-white">{p.nameEn}</h2>
              <p className="mt-2 text-sm text-slate-400">{p.descriptionEn}</p>
              <p className="mt-4 font-semibold text-violet-300">
                +{p.monthlyAddonSar.toLocaleString()} SAR/mo
              </p>
            </article>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
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
