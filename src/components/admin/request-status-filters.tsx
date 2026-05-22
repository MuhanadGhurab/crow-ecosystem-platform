import Link from "next/link";
import type { ImplementationRequestStatus } from "@/lib/types/platform";

const FILTERS: { status: ImplementationRequestStatus | null; label: string }[] = [
  { status: null, label: "All" },
  { status: "PENDING_REVIEW", label: "Pending review" },
  { status: "UNDER_DISCOVERY", label: "Under discovery" },
  { status: "BLUEPRINT_BUILD", label: "Blueprint build" },
];

export function RequestStatusFilters({ active }: { active?: string }) {
  return (
    <div className="cc-scroll-chips mb-6">
      <div className="flex gap-2">
        {FILTERS.map((f) => {
          const href = f.status ? `/admin/requests?status=${f.status}` : "/admin/requests";
          const isActive = (f.status ?? "") === (active ?? "");
          return (
            <Link
              key={f.label}
              href={href}
              className={`inline-flex min-h-[36px] items-center rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                isActive
                  ? "border-cyan-500/40 bg-cyan-500/15 text-cyan-200"
                  : "border-white/10 bg-white/[0.04] text-slate-300 hover:border-white/20"
              }`}
            >
              {f.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
