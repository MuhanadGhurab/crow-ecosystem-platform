import Link from "next/link";
import { ComingSoonCards } from "@/components/public/coming-soon-cards";
import { PublicPageHeader } from "@/components/public/public-page-header";

export default function CaseStudiesPage() {
  return (
    <>
      <PublicPageHeader
        badge="Outcomes"
        title="Case studies"
        description="Implementation journeys from intake through discovery, blueprint pricing, and governed go-live — narratives publishing soon."
      />
      <div className="cc-public-section space-y-10">
        <p className="max-w-2xl text-sm text-slate-400">
          Full write-ups with metrics, engine breakdowns, and NCA posture notes are in production. Preview sectors
          below mirror the homepage coming-soon cards.
        </p>

        <ComingSoonCards />

        <div className="flex flex-wrap gap-4">
          <Link href="/clients" className="cc-btn-secondary text-sm">
            View clients →
          </Link>
          <Link href="/request" className="cc-btn-primary text-sm">
            Start your journey →
          </Link>
        </div>
      </div>
    </>
  );
}
