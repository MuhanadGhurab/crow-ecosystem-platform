import Link from "next/link";
import { PermissionDenied } from "@/components/auth/permission-denied";
import { getCrowAuth, roleLabel } from "@/lib/auth/roles";
import { getSessionUser } from "@/lib/auth/session";
import { routes } from "@/lib/routes";

export default async function UnauthorizedPage({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string }>;
}) {
  const { reason } = await searchParams;
  const user = await getSessionUser();
  const { role } = getCrowAuth(user);

  const hints: Record<string, string> = {
    platform_staff: "This area requires Platform Admin or Implementation staff.",
    platform_console: "Sign in with a platform, sales, or auditor account.",
    permission: "Your role lacks the required permission for this action or route.",
    tenant: "You are not assigned to this tenant workspace.",
  };

  const back =
    role === "client"
      ? { href: routes.portal.requests, label: "Client portal" }
      : role === "tenant_admin" || role === "tenant_user" || role === "auditor_readonly"
        ? {
            href: routes.tenant(process.env.AUTH_DEV_TENANT_SLUG ?? "meem-global").dashboard,
            label: "Tenant dashboard",
          }
        : { href: routes.admin.requests, label: "Admin requests" };

  return (
    <div className="cc-starfield cc-noise flex min-h-[100dvh] flex-col items-center justify-center px-4">
      <PermissionDenied
        description={
          hints[reason ?? ""] ??
          (role
            ? `Signed in as ${roleLabel(role)} (${role}). Contact your platform administrator.`
            : "Sign in with an account that has access to this area.")
        }
        backHref={back.href}
        backLabel={back.label}
      />
      <p className="mt-6 text-center text-xs text-slate-600">
        <Link href="/login" className="text-cyan-500/80 hover:text-cyan-400">
          Switch account
        </Link>
      </p>
    </div>
  );
}
