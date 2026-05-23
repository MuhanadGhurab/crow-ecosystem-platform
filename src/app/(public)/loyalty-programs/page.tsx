import Link from "next/link";
import { PublicPageHeader } from "@/components/public/public-page-header";

export default function LoyaltyProgramsPage() {
  return (
    <>
      <PublicPageHeader
        badge="Growth"
        title="Loyalty programs"
        description="Customer engagement modules integrated with CEM operations and SAREA role-aware experiences."
      />
      <div className="cc-public-section space-y-8">
        <section className="cc-glass-card max-w-3xl space-y-4">
          <p className="text-sm leading-relaxed text-slate-300">
            Loyalty and retention live inside your CEM tenant — not as a separate product. After go-live,
            modules for points, tiers, and campaigns appear under your organization slug alongside CRM,
            sales, and logistics.
          </p>
          <ul className="list-inside list-disc space-y-2 text-sm text-slate-400">
            <li>Configure modules during discovery and blueprint pricing</li>
            <li>SAREA adapts dashboards for store managers vs loyalty ops roles</li>
            <li>CyberCrow protects customer PII and campaign audit trails</li>
          </ul>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="/modules" className="cc-btn-primary text-sm">
              Explore CEM modules
            </Link>
            <Link href="/request" className="cc-btn-secondary text-sm">
              Start implementation request
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
