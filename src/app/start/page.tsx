import { Suspense } from "react";

import { StartPageClient } from "@/components/crow-story/start-page-client";

export const metadata = {
  title: "Start — Crow",
  description: "Choose whether to build a new organization or transform an existing one.",
};

export default function StartPage() {
  return (
    <Suspense
      fallback={
        <div className="cc-safe-x mx-auto max-w-2xl px-4 py-16 text-slate-400">Loading…</div>
      }
    >
      <StartPageClient />
    </Suspense>
  );
}
