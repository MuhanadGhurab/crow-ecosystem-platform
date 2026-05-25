import Link from "next/link";
import { routes } from "@/lib/routes";

type FilterState = {
  tenant?: string;
  category?: string;
  severity?: string;
  status?: string;
  from?: string;
  to?: string;
};

export function NotificationInboxFilters({
  baseHref,
  filters,
  hasActiveFilters,
}: {
  baseHref: string;
  filters: FilterState;
  hasActiveFilters: boolean;
}) {
  const fromValue = filters.from?.slice(0, 10) ?? "";
  const toValue = filters.to?.slice(0, 10) ?? "";

  return (
    <form method="get" action={baseHref} className="mt-4 flex flex-wrap items-end gap-3">
      {filters.tenant && <input type="hidden" name="tenant" value={filters.tenant} />}
      {filters.category && <input type="hidden" name="category" value={filters.category} />}
      {filters.severity && <input type="hidden" name="severity" value={filters.severity} />}
      {filters.status && <input type="hidden" name="status" value={filters.status} />}

      <label className="flex flex-col gap-1 text-xs text-slate-500">
        <span className="font-medium uppercase tracking-wider">From</span>
        <input
          type="date"
          name="from"
          defaultValue={fromValue}
          className="rounded-cc-sm border border-white/10 bg-white/5 px-2 py-1 text-sm text-slate-200"
        />
      </label>
      <label className="flex flex-col gap-1 text-xs text-slate-500">
        <span className="font-medium uppercase tracking-wider">To</span>
        <input
          type="date"
          name="to"
          defaultValue={toValue}
          className="rounded-cc-sm border border-white/10 bg-white/5 px-2 py-1 text-sm text-slate-200"
        />
      </label>
      <button
        type="submit"
        className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-200 hover:bg-cyan-500/20"
      >
        Apply dates
      </button>
      {(fromValue || toValue) && (
        <Link
          href={buildHrefWithoutDates(baseHref, filters)}
          className="text-xs text-slate-400 hover:text-slate-200"
        >
          Clear dates
        </Link>
      )}
      {hasActiveFilters && (
        <Link
          href={routes.admin.notifications}
          className="text-xs text-slate-400 hover:text-slate-200"
        >
          Reset all filters
        </Link>
      )}
    </form>
  );
}

function buildHrefWithoutDates(baseHref: string, filters: FilterState): string {
  const next = new URLSearchParams();
  if (filters.tenant) next.set("tenant", filters.tenant);
  if (filters.category) next.set("category", filters.category);
  if (filters.severity) next.set("severity", filters.severity);
  if (filters.status) next.set("status", filters.status);
  const q = next.toString();
  return q ? `${baseHref}?${q}` : baseHref;
}
