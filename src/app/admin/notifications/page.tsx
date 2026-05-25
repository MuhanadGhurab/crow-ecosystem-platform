import Link from "next/link";

import { NotificationDigestPreview } from "@/components/admin/notification-digest-preview";
import { NotificationInboxFilters } from "@/components/admin/notification-inbox-filters";
import { NotificationInboxRow } from "@/components/admin/notification-inbox-row";

import { PageHeader } from "@/components/ui/page-header";

import { StatCard } from "@/components/ui/stat-card";

import { MEEM_TENANT_SLUG } from "@/lib/constants/meem";

import { routes } from "@/lib/routes";

import { parseDigestFilterOverrides } from "@/lib/services/notification-digest.service";

import {

  getPlatformNotificationInboxSummary,

  listPlatformNotificationInbox,

  type PlatformNotificationCategory,

  type PlatformNotificationSeverity,

  type PlatformNotificationStatusFilter,

} from "@/lib/services/platform-notification.service";



function parseCategory(raw: string | undefined): PlatformNotificationCategory | undefined {

  if (

    raw === "subscription" ||

    raw === "usage" ||

    raw === "go_live" ||

    raw === "pipeline" ||

    raw === "all"

  ) {

    return raw === "all" ? undefined : raw;

  }

  return undefined;

}



function parseSeverity(raw: string | undefined): PlatformNotificationSeverity | undefined {

  if (raw === "high" || raw === "medium" || raw === "low") return raw;

  return undefined;

}



function parseStatus(raw: string | undefined): PlatformNotificationStatusFilter | undefined {

  const allowed = [

    "logged",

    "sent",

    "skipped",

    "failed",

    "reviewed",

    "dismissed",

    "open",

  ] as const;

  if (raw && (allowed as readonly string[]).includes(raw)) {

    return raw as PlatformNotificationStatusFilter;

  }

  return undefined;

}



function parseDate(raw: string | undefined): Date | undefined {

  if (!raw) return undefined;

  const d = new Date(raw);

  return Number.isNaN(d.getTime()) ? undefined : d;

}



function endOfDay(d: Date): Date {

  const end = new Date(d);

  end.setHours(23, 59, 59, 999);

  return end;

}



export default async function AdminNotificationsPage({

  searchParams,

}: {

  searchParams: Promise<{

    tenant?: string;

    category?: string;

    severity?: string;

    status?: string;

    from?: string;

    to?: string;

  }>;

}) {

  const params = await searchParams;

  const tenantSlug = params.tenant?.trim() || undefined;

  const category = parseCategory(params.category);

  const severity = parseSeverity(params.severity);

  const status = parseStatus(params.status);

  const createdFrom = parseDate(params.from);

  const createdToRaw = parseDate(params.to);

  const createdTo = createdToRaw ? endOfDay(createdToRaw) : undefined;

  const digestFilters = parseDigestFilterOverrides({
    tenant: tenantSlug,
    category: params.category,
    severity: params.severity,
  });

  const hasActiveFilters = Boolean(

    tenantSlug || category || severity || status || createdFrom || createdTo

  );



  let loadError: string | null = null;

  let summary = {

    recentAdvisoryCount: 0,

    highPriorityCount: 0,

    tenantsNeedingReview: 0,

    latest: [] as Awaited<ReturnType<typeof listPlatformNotificationInbox>>,

    lastUpdatedAt: new Date(),

  };

  let rows: Awaited<ReturnType<typeof listPlatformNotificationInbox>> = [];



  try {

    const [summaryResult, rowsResult] = await Promise.all([

      getPlatformNotificationInboxSummary(),

      listPlatformNotificationInbox({

        tenantSlug,

        category,

        severity,

        status,

        createdFrom,

        createdTo,

        limit: 100,

      }),

    ]);

    summary = summaryResult;

    rows = rowsResult;

  } catch {

    loadError = "Could not load notifications. Check database connectivity and retry.";

  }



  const base = routes.admin.notifications;

  const filterHref = (overrides: Record<string, string | undefined>) => {

    const next = new URLSearchParams();

    const merged = {

      tenant: tenantSlug,

      category: params.category,

      severity: params.severity,

      status: params.status,

      from: params.from,

      to: params.to,

      ...overrides,

    };

    for (const [k, v] of Object.entries(merged)) {

      if (v) next.set(k, v);

    }

    const q = next.toString();

    return q ? `${base}?${q}` : base;

  };



  const highInView = rows.filter((r) => r.parsed.severity === "high").length;

  const advisoryInView = rows.filter((r) => r.parsed.isAdvisory).length;



  return (

    <div className="space-y-8">

      <PageHeader

        badge="Platform Admin"

        title="Notification center"

        description="Subscription advisories, go-live signals, usage warnings, and pipeline email log. Advisory only — no billing enforcement or tenant blocking."

      />



      {loadError && (

        <section className="cc-alert-warning text-sm text-amber-100" role="alert">

          {loadError}

        </section>

      )}



      <section className="grid gap-3 sm:grid-cols-4">

        <StatCard label="In view" value={rows.length} accent="cyan" />

        <StatCard label="Advisory in view" value={advisoryInView} accent="teal" />

        <StatCard label="High priority in view" value={highInView} accent="star" />

        <StatCard label="Tenants needing review" value={summary.tenantsNeedingReview} accent="violet" />

      </section>



      <p className="text-xs text-slate-600">

        Summary refreshed {summary.lastUpdatedAt.toLocaleString()} · counts in view reflect active

        filters below.

      </p>

      <NotificationDigestPreview
        filters={digestFilters}
        windowFrom={createdFrom}
        windowTo={createdTo}
      />

      <nav className="flex flex-wrap gap-2" aria-label="Notification filters">

        <span className="w-full text-xs font-medium uppercase tracking-wider text-slate-500">

          Category

        </span>

        {(

          [

            { key: undefined, label: "All" },

            { key: "subscription" as const, label: "Subscription" },

            { key: "usage" as const, label: "Usage warnings" },

            { key: "go_live" as const, label: "Go-live" },

            { key: "pipeline" as const, label: "Pipeline email" },

          ] as const

        ).map((tab) => (

          <Link

            key={tab.label}

            href={filterHref({ category: tab.key })}

            className={`rounded-full px-3 py-1 text-xs font-medium ${

              (category ?? undefined) === tab.key || (!category && !tab.key)

                ? "bg-cyan-500/20 text-cyan-200"

                : "bg-white/5 text-slate-400 hover:text-slate-200"

            }`}

          >

            {tab.label}

          </Link>

        ))}



        <span className="mt-2 w-full text-xs font-medium uppercase tracking-wider text-slate-500">

          Severity

        </span>

        {(["high", "medium", "low"] as const).map((sev) => (

          <Link

            key={sev}

            href={filterHref({ severity: severity === sev ? undefined : sev })}

            className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${

              severity === sev

                ? "bg-amber-500/20 text-amber-200"

                : "bg-white/5 text-slate-400 hover:text-slate-200"

            }`}

          >

            {sev}

          </Link>

        ))}



        <span className="mt-2 w-full text-xs font-medium uppercase tracking-wider text-slate-500">

          Status

        </span>

        {(

          [

            { key: "open" as const, label: "Open" },

            { key: "logged" as const, label: "Logged" },

            { key: "reviewed" as const, label: "Reviewed" },

            { key: "dismissed" as const, label: "Dismissed" },

            { key: "sent" as const, label: "Sent" },

          ] as const

        ).map((tab) => (

          <Link

            key={tab.key}

            href={filterHref({ status: status === tab.key ? undefined : tab.key })}

            className={`rounded-full px-3 py-1 text-xs font-medium ${

              status === tab.key

                ? "bg-violet-500/20 text-violet-200"

                : "bg-white/5 text-slate-400 hover:text-slate-200"

            }`}

          >

            {tab.label}

          </Link>

        ))}



        <span className="mt-2 w-full text-xs font-medium uppercase tracking-wider text-slate-500">

          Tenant shortcuts

        </span>

        <Link

          href={filterHref({ tenant: MEEM_TENANT_SLUG })}

          className={`rounded-full px-3 py-1 text-xs font-medium ${

            tenantSlug === MEEM_TENANT_SLUG

              ? "bg-teal-500/20 text-teal-200"

              : "bg-white/5 text-slate-400 hover:text-slate-200"

          }`}

        >

          MEEM ({MEEM_TENANT_SLUG})

        </Link>

        {tenantSlug && (

          <Link

            href={filterHref({ tenant: undefined })}

            className="rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-slate-400 hover:text-slate-200"

          >

            Clear tenant filter

          </Link>

        )}



        <span className="mt-2 w-full text-xs font-medium uppercase tracking-wider text-slate-500">

          Date range

        </span>

        <NotificationInboxFilters

          baseHref={base}

          filters={{

            tenant: tenantSlug,

            category: params.category,

            severity: params.severity,

            status: params.status,

            from: params.from,

            to: params.to,

          }}

          hasActiveFilters={hasActiveFilters}

        />

      </nav>



      {tenantSlug && (

        <p className="text-sm text-slate-400">

          Filtered to tenant <span className="font-mono text-cyan-400">/{tenantSlug}</span>

          {(createdFrom || createdTo) && (

            <span className="text-slate-500">

              {" "}

              · dates{" "}

              {createdFrom ? createdFrom.toLocaleDateString() : "…"} —{" "}

              {createdTo ? createdTo.toLocaleDateString() : "…"}

            </span>

          )}

        </p>

      )}



      <section className="cc-glass-card">

        <h3 className="font-display text-sm font-semibold text-cyan-400">Notifications</h3>

        {rows.length === 0 ? (

          <div className="mt-3 space-y-2 text-sm text-slate-500">

            {hasActiveFilters ? (

              <>

                <p>No notifications match these filters.</p>

                <Link

                  href={routes.admin.notifications}

                  className="inline-block text-cyan-400 hover:text-cyan-300"

                >

                  Reset all filters →

                </Link>

              </>

            ) : (

              <p>

                Inbox is empty. Subscription advisories appear when admin overview or a tenant plan

                tab runs advisory evaluation (24h dedupe per tenant and event). Pipeline events log on

                request intake, discovery, blueprint approval, and go-live.

              </p>

            )}

          </div>

        ) : (

          <ul className="mt-4 space-y-3">

            {rows.map((row) => (

              <NotificationInboxRow key={row.id} row={row} />

            ))}

          </ul>

        )}

      </section>



      <p className="text-xs text-slate-600">

        Pipeline delivery statuses (sent / skipped / failed) reflect email transport only — not

        tenant access policy. Use Mark reviewed or Dismiss for inbox triage.

      </p>

    </div>

  );

}


