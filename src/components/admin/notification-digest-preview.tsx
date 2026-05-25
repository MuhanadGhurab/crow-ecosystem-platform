import {
  formatNotificationDigestText,
  generateDailyNotificationDigest,
  generateNotificationDigest,
  generateWeeklyNotificationDigest,
  type NotificationDigest,
  type NotificationDigestFilterOverrides,
} from "@/lib/services/notification-digest.service";

function formatFilterNote(filters: NotificationDigestFilterOverrides): string | null {
  const parts: string[] = [];
  if (filters.tenantSlug) parts.push(`tenant=${filters.tenantSlug}`);
  if (filters.severity) parts.push(`severity=${filters.severity}`);
  if (filters.category) parts.push(`category=${filters.category}`);
  return parts.length > 0 ? parts.join(", ") : null;
}

function DigestPreviewCard({ title, digest }: { title: string; digest: NotificationDigest }) {
  const filterNote = formatFilterNote(digest.filters);

  return (
    <section className="cc-glass-card space-y-3">
      <h3 className="font-display text-sm font-semibold text-cyan-400">{title}</h3>
      {filterNote && (
        <p className="text-xs text-slate-500">
          Filters: <span className="font-mono text-cyan-400/90">{filterNote}</span>
        </p>
      )}
      <dl className="grid gap-2 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-xs text-slate-500">Window</dt>
          <dd className="font-mono text-slate-300">
            {digest.from.toLocaleDateString()} — {digest.to.toLocaleDateString()}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-slate-500">Generated</dt>
          <dd className="text-slate-300">{digest.generatedAt.toLocaleString()}</dd>
        </div>
        <div>
          <dt className="text-xs text-slate-500">Open advisories</dt>
          <dd className="text-slate-200">{digest.totals.openAdvisories}</dd>
        </div>
        <div>
          <dt className="text-xs text-slate-500">High priority (open)</dt>
          <dd className="text-amber-200">{digest.totals.highPriorityOpen}</dd>
        </div>
        <div>
          <dt className="text-xs text-slate-500">MEEM in window</dt>
          <dd className="text-slate-200">
            {digest.meem.notificationCountInPeriod} ({digest.meem.openCountInPeriod} open) · IDs{" "}
            {digest.meem.liveIdsSource}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-slate-500">Tenants needing review</dt>
          <dd className="text-slate-200">{digest.totals.tenantsNeedingReview}</dd>
        </div>
      </dl>
      <pre className="max-h-48 overflow-auto rounded-lg bg-black/30 p-3 text-xs text-slate-400 whitespace-pre-wrap">
        {formatNotificationDigestText(digest)}
      </pre>
    </section>
  );
}

export async function NotificationDigestPreview({
  filters = {},
  windowFrom,
  windowTo,
}: {
  filters?: NotificationDigestFilterOverrides;
  windowFrom?: Date;
  windowTo?: Date;
}) {
  let daily: NotificationDigest | null = null;
  let weekly: NotificationDigest | null = null;
  let custom: NotificationDigest | null = null;
  let error: string | null = null;

  const hasCustomWindow = Boolean(windowFrom || windowTo);

  try {
    if (hasCustomWindow) {
      const to = windowTo ?? new Date();
      const from =
        windowFrom ?? new Date(to.getTime() - 7 * 24 * 60 * 60 * 1000);
      custom = await generateNotificationDigest({
        from,
        to,
        ...filters,
        period: "custom",
      });
    } else {
      [daily, weekly] = await Promise.all([
        generateDailyNotificationDigest(filters),
        generateWeeklyNotificationDigest(filters),
      ]);
    }
  } catch {
    error = "Could not generate digest preview. Check database connectivity.";
  }

  if (error) {
    return (
      <section className="cc-glass-card">
        <h3 className="font-display text-sm font-semibold text-cyan-400">Digest preview</h3>
        <p className="mt-2 text-sm text-amber-200">{error}</p>
      </section>
    );
  }

  const filterNote = formatFilterNote(filters);
  const dateNote =
    hasCustomWindow && (windowFrom || windowTo)
      ? `${windowFrom?.toLocaleDateString() ?? "…"} — ${windowTo?.toLocaleDateString() ?? "…"}`
      : null;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display text-base font-semibold text-slate-200">Digest preview</h2>
        <p className="mt-1 text-xs text-slate-500">
          Read-only summary of advisory notifications
          {(filterNote || dateNote) && (
            <>
              {" "}
              (matches inbox filters
              {filterNote ? (
                <>
                  : <span className="font-mono text-slate-400">{filterNote}</span>
                </>
              ) : null}
              {dateNote ? (
                <>
                  {filterNote ? "; " : ": "}
                  dates <span className="font-mono text-slate-400">{dateNote}</span>
                </>
              ) : null}
              )
            </>
          )}
          . Send manually via{" "}
          <code className="text-slate-400">npm run notifications:digest:dry</code> or{" "}
          <code className="text-slate-400">notifications:digest:send</code> — no send button here.
        </p>
      </div>
      {custom ? (
        <DigestPreviewCard title="Filtered digest (URL date range)" digest={custom} />
      ) : (
        daily &&
        weekly && (
          <>
            <DigestPreviewCard title="Daily digest (last 24h)" digest={daily} />
            <DigestPreviewCard title="Weekly digest (last 7d)" digest={weekly} />
          </>
        )
      )}
    </div>
  );
}
