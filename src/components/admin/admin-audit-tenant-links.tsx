"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { LogisticsAuditFilter } from "@/lib/constants/cybercrow-audit-events";

const STORAGE_KEY = "crow_admin_audit_filters";

type StoredFilters = {
  category?: LogisticsAuditFilter;
  tenant?: string;
};

function readStored(): StoredFilters | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredFilters;
  } catch {
    return null;
  }
}

function writeStored(category: LogisticsAuditFilter, tenant?: string) {
  try {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ category, tenant: tenant || undefined })
    );
  } catch {
    /* ignore quota / private mode */
  }
}

/** Restore last platform audit filters when landing without query params. */
export function AdminAuditFilterPersistence({
  category,
  tenantSlug,
  hasQueryParams,
}: {
  category: LogisticsAuditFilter;
  tenantSlug?: string;
  hasQueryParams: boolean;
}) {
  const router = useRouter();

  useEffect(() => {
    writeStored(category, tenantSlug);
  }, [category, tenantSlug]);

  useEffect(() => {
    if (hasQueryParams) return;
    const stored = readStored();
    if (!stored?.category && !stored?.tenant) return;
    const params = new URLSearchParams();
    if (stored.category && stored.category !== "all") params.set("category", stored.category);
    if (stored.tenant) params.set("tenant", stored.tenant);
    const q = params.toString();
    if (q) router.replace(`/admin/audit?${q}`);
  }, [hasQueryParams, router]);

  return null;
}

export function AdminAuditTenantRow({
  slug,
  displayName,
  isLogistics,
}: {
  slug: string;
  displayName: string;
  isLogistics?: boolean;
}) {
  return (
    <span className="inline-flex flex-wrap items-center gap-2">
      {displayName} · /{slug}
      {isLogistics ? " · logistics" : null}
      <Link
        href={`/${slug}/cybercrow/audit-logs`}
        className="text-cyan-400 hover:text-cyan-300"
      >
        Tenant audit →
      </Link>
    </span>
  );
}
