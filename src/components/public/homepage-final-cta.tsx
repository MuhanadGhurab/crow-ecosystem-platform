import Link from "next/link";
import { PublicRequestGateNote } from "@/components/public/public-request-gate-note";

export function HomepageFinalCta() {
  return (
    <section className="cc-home-section !pb-20 sm:!pb-28">
      <div className="cc-hero-panel mx-auto max-w-3xl px-6 py-12 text-center sm:px-10 sm:py-14">
        <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
          Ready to start your enterprise request?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm text-slate-400 sm:text-base">
          Understand Crow on the public site, then sign in to submit and track your ERP request in the
          Client Portal.
        </p>
        <div className="mx-auto mt-6 max-w-lg">
          <PublicRequestGateNote />
        </div>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <Link href="/request" className="cc-btn-hero-light min-w-[14rem]">
            Start Enterprise Request
            <span
              className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-950 text-white"
              aria-hidden
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M7 17L17 7M17 7H9M17 7v8"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </Link>
          <Link href="/pricing" className="cc-btn-secondary min-w-[14rem]">
            See plans
          </Link>
        </div>
      </div>
    </section>
  );
}
