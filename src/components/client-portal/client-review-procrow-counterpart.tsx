import type { ClientPortalProcrowCounterpart } from "@/lib/client-portal/client-portal-contract";

export function ClientReviewProcrowCounterpart({
  counterpart,
}: {
  counterpart: ClientPortalProcrowCounterpart;
}) {
  return (
    <section className="cc-glass-card space-y-2 text-sm">
      <h2 className="font-semibold text-white">What ProCrow manages</h2>
      <p className="text-xs font-semibold uppercase tracking-wider text-teal-400/80">
        {counterpart.area}
      </p>
      <p className="text-slate-400">
        <span className="text-slate-500">ProCrow: </span>
        {counterpart.procrowOwns}
      </p>
      <p className="text-slate-400">
        <span className="text-slate-500">You see here: </span>
        {counterpart.clientPortalShows}
      </p>
      <p className="text-xs text-slate-500">
        Internal counterpart: {counterpart.adminRoute} (ProCrow staff only).
      </p>
    </section>
  );
}
