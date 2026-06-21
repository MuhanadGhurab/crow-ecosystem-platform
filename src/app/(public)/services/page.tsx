import Link from "next/link";
import { PublicPageHeader } from "@/components/public/public-page-header";
import { FULL_PLATFORM_LIFECYCLE, PIPELINE_STATE_OWNERSHIP } from "@/lib/constants/platform";

const SERVICES = [
  {
    title: "Implementation intake",
    body: "Structured implementation requests with plan, CEM modules, and CyberCrow security selection — the commercial front door to discovery.",
    href: "/request",
  },
  {
    title: "Discovery & blueprint",
    body: "Crow delivery teams capture organizational truth, price the deal on the Enterprise Blueprint, and send client proposals for approval.",
    href: "/architecture",
  },
  {
    title: "Go-live & managed engines",
    body: "Governed provision seeds CEM operations, CyberCrow security posture, and SAREA adaptive experience on a single tenant slug.",
    href: "/security",
  },
] as const;

export default function ServicesPage() {
  return (
    <>
      <PublicPageHeader
        badge="Delivery"
        title="Services"
        description="Implementation, discovery, commercial blueprinting, and post-launch engine operations — delivered by Crow platform and department teams."
      />
      <div className="cc-public-section space-y-10">
        <div className="grid gap-6 md:grid-cols-3">
          {SERVICES.map((svc) => (
            <article key={svc.title} className="cc-glass-card flex flex-col">
              <h2 className="font-display text-lg font-semibold text-white">{svc.title}</h2>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-400">{svc.body}</p>
              <Link href={svc.href} className="mt-4 text-sm font-medium text-cyan-400 hover:text-cyan-300">
                Learn more →
              </Link>
            </article>
          ))}
        </div>

        <section>
          <h2 className="font-display text-lg font-semibold text-white">Delivery lifecycle</h2>
          <p className="mt-2 max-w-3xl text-sm text-slate-400">
            No request, discovery submission, or proposal approval automatically activates billing
            or production runtime.
          </p>
          <div className="cc-scroll-chips mt-4">
            <ol className="flex gap-2">
              {FULL_PLATFORM_LIFECYCLE.map((label, index) => (
                <li key={label}>
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-slate-300">
                    <span className="font-mono font-bold text-cc-star">{String(index + 1).padStart(2, "0")}</span>
                    {label}
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <ul className="mt-6 space-y-3 text-sm text-slate-400">
            {PIPELINE_STATE_OWNERSHIP.map((row) => (
              <li key={row.phase}>
                <span className="font-medium text-slate-300">{row.phase}:</span> {row.owner}
              </li>
            ))}
          </ul>
        </section>

        <Link href="/request" className="cc-btn-primary inline-block">
          Request your ecosystem →
        </Link>
      </div>
    </>
  );
}
