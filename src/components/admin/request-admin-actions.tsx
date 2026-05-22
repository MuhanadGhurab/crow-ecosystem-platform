"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  adminRejectRequest,
  adminStartDiscovery,
  type RequestAdminActionsState,
} from "@/lib/actions/admin-pipeline";
import { routes } from "@/lib/routes";

export function RequestAdminActions({
  requestId,
  status,
  blueprintId,
  tenantSlug,
}: RequestAdminActionsState) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [rejectReason, setRejectReason] = useState("");
  const [showReject, setShowReject] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleStartDiscovery() {
    setError(null);
    startTransition(async () => {
      try {
        await adminStartDiscovery(requestId);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to start discovery");
      }
    });
  }

  function handleReject() {
    setError(null);
    startTransition(async () => {
      try {
        await adminRejectRequest(requestId, rejectReason);
        setShowReject(false);
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to reject request");
      }
    });
  }

  if (status === "REJECTED" || status === "CANCELLED") {
    return (
      <p className="text-sm text-slate-500">This request is closed. No further actions.</p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        {status === "PENDING_REVIEW" && (
          <>
            <button
              type="button"
              onClick={handleStartDiscovery}
              disabled={pending}
              className="cc-btn-primary disabled:opacity-50"
            >
              {pending ? "Starting…" : "Start discovery"}
            </button>
            <button
              type="button"
              onClick={() => setShowReject((v) => !v)}
              disabled={pending}
              className="cc-btn-secondary disabled:opacity-50"
            >
              Reject
            </button>
          </>
        )}

        {status === "UNDER_DISCOVERY" && (
          <Link href={routes.discovery(requestId).organization} className="cc-btn-primary">
            Open discovery workspace →
          </Link>
        )}

        {status === "BLUEPRINT_BUILD" && blueprintId && (
          <Link href={routes.blueprint(blueprintId).overview} className="cc-btn-primary">
            Open blueprint →
          </Link>
        )}

        {(status === "TENANT_PROVISIONING" ||
          status === "SECURITY_INIT" ||
          status === "SAREA_INIT" ||
          status === "GO_LIVE" ||
          status === "APPROVED") &&
          (tenantSlug ? (
            <Link href={routes.tenant(tenantSlug).dashboard} className="cc-btn-primary">
              Open tenant workspace →
            </Link>
          ) : (
            <Link href={routes.admin.tenants} className="cc-btn-secondary">
              View all tenants
            </Link>
          ))}
      </div>

      {showReject && status === "PENDING_REVIEW" && (
        <div className="cc-glass-card space-y-3">
          <label className="block text-sm text-slate-400">
            Rejection reason (optional)
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
              className="input-cc mt-2"
              placeholder="Brief note for internal records"
            />
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleReject}
              disabled={pending}
              className="rounded-cc bg-red-600/80 px-4 py-2 text-sm text-white hover:bg-red-600 disabled:opacity-50"
            >
              Confirm reject
            </button>
            <button
              type="button"
              onClick={() => setShowReject(false)}
              className="cc-btn-secondary text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}


