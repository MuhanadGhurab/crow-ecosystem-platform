import Link from "next/link";
import { TENANT_MEMBERSHIP_DISCLAIMERS } from "@/lib/tenant/tenant-membership-contract";
import { routes } from "@/lib/routes";

type Props = {
  tenantSlug?: string;
  message?: string;
  operatorPreview?: boolean;
};

export function TenantAccessBlockedPanel({
  tenantSlug,
  message,
  operatorPreview = false,
}: Props) {
  const headline = operatorPreview
    ? "Operator preview mode"
    : "Business Portal access requires verified tenant membership";

  const body =
    message ??
    (operatorPreview
      ? "You are viewing tenant runtime as a platform operator. This does not grant tenant employee status."
      : "Your Client Portal account can request and review Crow, but it does not automatically grant access to this company runtime.");

  return (
    <section className="rounded-xl border border-amber-500/30 bg-amber-950/15 p-6 space-y-4">
      <h2 className="text-lg font-semibold text-amber-100">{headline}</h2>
      <p className="text-sm text-slate-300">{body}</p>
      {tenantSlug && (
        <p className="text-xs text-slate-500">
          Workspace: <span className="font-mono text-slate-400">/{tenantSlug}</span>
        </p>
      )}
      <p className="text-sm text-slate-400">
        Contact ProCrow or your tenant administrator for access.
      </p>
      <ul className="list-disc space-y-1 pl-5 text-xs text-slate-500">
        {TENANT_MEMBERSHIP_DISCLAIMERS.map((d) => (
          <li key={d}>{d}</li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-3 pt-2">
        <Link href={routes.access} className="cc-btn-secondary text-sm">
          Access gateway
        </Link>
        <Link href={routes.client.home} className="cc-btn-primary text-sm">
          Client Portal
        </Link>
      </div>
    </section>
  );
}
