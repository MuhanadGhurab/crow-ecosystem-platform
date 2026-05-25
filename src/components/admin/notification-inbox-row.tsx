import Link from "next/link";
import { NotificationStatusActions } from "@/components/admin/notification-status-actions";
import {
  resolveNotificationActionLinks,
  type PlatformNotificationRow,
} from "@/lib/services/platform-notification.service";

const SEVERITY_STYLES = {
  high: "text-amber-300 border-amber-500/30 bg-amber-500/10",
  medium: "text-cyan-200 border-cyan-500/30 bg-cyan-500/10",
  low: "text-slate-400 border-white/10 bg-white/5",
} as const;

const LINK_STYLES: Record<string, string> = {
  tenant_plan: "text-cyan-400 hover:text-cyan-300",
  tenant_plan_by_slug: "text-cyan-400 hover:text-cyan-300",
  blueprint: "text-violet-300 hover:text-violet-200",
  go_live: "text-teal-300 hover:text-teal-200",
  request: "text-cyan-400/80 hover:text-cyan-300",
  audit: "text-slate-400 hover:text-slate-300",
  meem_logistics: "text-teal-400/80 hover:text-teal-300",
};

export function NotificationInboxRow({
  row,
  compact = false,
  showActions = true,
}: {
  row: PlatformNotificationRow;
  compact?: boolean;
  showActions?: boolean;
}) {
  const actionLinks = resolveNotificationActionLinks(row);

  return (
    <li
      className={`cc-list-item flex-col !items-start gap-2 ${
        compact ? "!py-2" : ""
      }`}
    >
      <div className="flex w-full flex-wrap items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className={`font-medium text-white ${compact ? "text-sm" : ""}`}>
            {row.parsed.title}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span
              className={`rounded-full border px-2 py-0.5 capitalize ${SEVERITY_STYLES[row.parsed.severity]}`}
            >
              {row.parsed.severity}
            </span>
            <span className="capitalize text-slate-500">{row.parsed.category}</span>
            <span className="font-mono text-slate-600">{row.eventType}</span>
          </div>
        </div>
        {showActions && !compact && (
          <NotificationStatusActions notificationId={row.id} status={row.status} />
        )}
      </div>

      {!compact && (
        <p className="text-sm text-slate-400 line-clamp-2 whitespace-pre-line">{row.body}</p>
      )}

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
        <span title="Created at">
          {row.createdAt.toLocaleString()}
        </span>
        <span
          className={
            row.status === "sent"
              ? "text-teal-300"
              : row.status === "failed"
                ? "text-red-400"
                : row.status === "reviewed"
                  ? "text-cyan-300"
                  : row.status === "dismissed"
                    ? "text-slate-500"
                    : "text-slate-400"
          }
        >
          {row.status}
        </span>
        {row.parsed.tenantSlug && !actionLinks.some((l) => l.kind === "tenant_plan") && (
          <span className="font-mono text-slate-600">/{row.parsed.tenantSlug}</span>
        )}
        {actionLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={LINK_STYLES[link.kind] ?? "text-cyan-400 hover:text-cyan-300"}
          >
            {link.label} →
          </Link>
        ))}
      </div>

      {showActions && compact && (
        <NotificationStatusActions notificationId={row.id} status={row.status} />
      )}
    </li>
  );
}
