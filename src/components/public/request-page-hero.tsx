import { CLIENT_REQUEST_JOURNEY_STEPS } from "@/lib/constants/public-client-ux";

export function RequestPageHero() {
  return (
    <section className="relative overflow-hidden border-b border-cyan-500/10">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_-10%,rgba(139,92,246,0.22),transparent_50%),radial-gradient(ellipse_60%_50%_at_90%_10%,rgba(34,211,238,0.14),transparent_45%)]"
        aria-hidden
      />
      <div className="cc-safe-x relative mx-auto max-w-6xl py-12 sm:py-16 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_300px] lg:items-start">
          <div>
            <span className="cc-star-badge">Signed-in submission</span>
            <h1 className="mt-5 font-display text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
              Submit your
              <span className="mt-1 block bg-gradient-to-r from-violet-400 via-cyan-300 to-teal-300 bg-clip-text text-transparent">
                enterprise request
              </span>
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg">
              This form links to your account. Track status, proposals, and onboarding in the Client Portal
              after you submit.
            </p>
            <p className="mt-3 text-sm text-slate-500">
              Status becomes <strong className="font-medium text-slate-400">Submitted for review</strong> while
              ProCrow validates scope — no payment or tenant provisioning from this page.
            </p>
          </div>

          <aside className="cc-glass-card !p-5 lg:sticky lg:top-24 lg:!p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">After you submit</p>
            <ol className="mt-4 space-y-3">
              {CLIENT_REQUEST_JOURNEY_STEPS.map((item, i) => (
                <li key={item} className="flex gap-3 text-sm text-slate-300">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white/[0.06] font-mono text-[10px] font-bold text-cc-star">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="leading-snug">{item}</span>
                </li>
              ))}
            </ol>
          </aside>
        </div>
      </div>
    </section>
  );
}
