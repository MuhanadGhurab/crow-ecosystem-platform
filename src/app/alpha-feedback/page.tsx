import type { Metadata } from "next";
import Link from "next/link";
import { DemoFeedbackForm } from "@/components/runtime/DemoFeedbackForm";
import { DEMO_FEEDBACK_SENSITIVE_WARNING } from "@/lib/demo-feedback/demo-feedback-contract";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Alpha Demo Feedback · Crow",
  description: "Demo/test feedback only — not production.",
  robots: { index: false, follow: false },
};

/**
 * CROW.DEVFLOW.5 — Dedicated alpha demo feedback entry.
 * Public path for Preview friends/testers. Hosted write fail-closed without demo backend flags.
 */
export default function AlphaFeedbackPage() {
  return (
    <main className="min-h-[70vh] bg-slate-950 px-4 py-10 text-slate-100">
      <div className="mx-auto max-w-xl">
        <p className="text-xs uppercase tracking-wide text-amber-400/90">
          Crow Alpha Development
        </p>
        <h1 className="mt-2 font-display text-2xl font-semibold text-amber-50">
          Send demo feedback
        </h1>
        <p className="mt-2 text-sm text-slate-300">{DEMO_FEEDBACK_SENSITIVE_WARNING}</p>
        <p className="mt-1 text-sm text-slate-400">
          Not production. Do not enter real customer or sensitive data. This does not create a
          client Request, Discovery session, Blueprint, or tenant.
        </p>
        <div className="mt-8">
          <DemoFeedbackForm />
        </div>
        <p className="mt-8 text-center text-xs text-slate-500">
          <Link href={routes.public.home} className="underline hover:text-slate-300">
            Back to Crow
          </Link>
        </p>
      </div>
    </main>
  );
}
