"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { TENANT_WORKFORCE_SECTION_ID } from "@/lib/constants/tenant-command-center";
import { routes } from "@/lib/routes";

type TenantCommandCenterActionBarProps = {
  tenantId: string;
  tenantSlug: string;
  requestHref?: string;
};

export function TenantCommandCenterActionBar({
  tenantId,
  tenantSlug,
  requestHref,
}: TenantCommandCenterActionBarProps) {
  const router = useRouter();
  const base = routes.admin.tenant(tenantId);
  const workforceHref = `${base}?tab=workforce#${TENANT_WORKFORCE_SECTION_ID}`;

  function goToWorkforceInvite() {
    router.push(workforceHref);
    window.setTimeout(() => {
      const el = document.getElementById(TENANT_WORKFORCE_SECTION_ID);
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
      const email = document.getElementById("m4c-invite-email");
      if (email instanceof HTMLInputElement) {
        email.focus();
      }
    }, 150);
  }

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-cyan-500/25 bg-cyan-950/20 p-3 sm:p-4">
      <button type="button" onClick={goToWorkforceInvite} className="cc-btn-primary text-sm">
        Create Business Portal Invite
      </button>
      <Link href={routes.tenant(tenantSlug).dashboard} className="cc-btn-secondary text-sm">
        Open Business Portal
      </Link>
      <Link href={routes.access} className="cc-btn-secondary text-sm">
        View Access Gateway
      </Link>
      <Link href={routes.admin.goNoGo} className="cc-btn-secondary text-sm">
        Review Go/No-Go
      </Link>
      {requestHref && (
        <Link href={requestHref} className="cc-btn-secondary text-sm">
          View request / blueprint
        </Link>
      )}
    </div>
  );
}
