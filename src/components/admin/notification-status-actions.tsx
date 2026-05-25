"use client";

import { useTransition } from "react";
import {
  dismissPlatformNotification,
  markPlatformNotificationReviewed,
} from "@/lib/actions/platform-notifications";

export function NotificationStatusActions({
  notificationId,
  status,
}: {
  notificationId: string;
  status: string;
}) {
  const [pending, startTransition] = useTransition();
  const isTerminal = status === "reviewed" || status === "dismissed";

  if (isTerminal) {
    return (
      <span className="text-xs capitalize text-slate-500">
        {status === "reviewed" ? "Reviewed" : "Dismissed"}
      </span>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          startTransition(() => markPlatformNotificationReviewed(notificationId))
        }
        className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-medium text-cyan-200 hover:bg-cyan-500/20 disabled:opacity-50"
      >
        Mark reviewed
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          startTransition(() => dismissPlatformNotification(notificationId))
        }
        className="rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-[10px] font-medium text-slate-400 hover:text-slate-200 disabled:opacity-50"
      >
        Dismiss
      </button>
    </div>
  );
}
