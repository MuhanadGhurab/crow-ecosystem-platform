import { notFound } from "next/navigation";
import { CybercrowMockConsole } from "@/components/tenant/cybercrow/cybercrow-mock-console";
import { routes } from "@/lib/routes";
import { getTenantBySlug } from "@/lib/services/tenant.service";

export default async function CybercrowIdentityPage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: slug } = await params;
  const tenant = await getTenantBySlug(slug);
  if (!tenant) notFound();

  return (
    <CybercrowMockConsole
      title="Identity"
      description="Identity governance, MFA posture, and IdP alignment."
      slug={slug}
      backHref={routes.tenant(slug).cybercrow.dashboard}
      variant="identity"
    />
  );
}
