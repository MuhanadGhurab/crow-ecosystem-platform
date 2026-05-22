import { getDiscoveryAnswer } from "@/lib/discovery-answers";
import { prisma } from "@/lib/db";

export type TenantSecuritySettings = {
  mfaRequired: boolean;
  mfaLabel: string;
  idpPreference: string;
  idpLabel: string;
  ssoNotes: string | null;
  source: "discovery" | "default";
};

const IDP_LABELS: Record<string, string> = {
  supabase_email: "Supabase email (default)",
  entra_id: "Microsoft Entra ID (SSO)",
  saml: "SAML enterprise IdP",
};

export async function getTenantSecuritySettings(tenantId: string): Promise<TenantSecuritySettings> {
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: {
      blueprint: {
        select: {
          discoveryProfile: {
            select: { answers: true },
          },
        },
      },
    },
  });

  const answers = tenant?.blueprint?.discoveryProfile?.answers ?? [];
  const mfaRaw = getDiscoveryAnswer<string>(answers, "identity", "mfaRequired");
  const idpRaw = getDiscoveryAnswer<string>(answers, "identity", "idpPreference");
  const ssoNotes = getDiscoveryAnswer<string>(answers, "identity", "ssoNotes");

  if (!mfaRaw && !idpRaw) {
    return {
      mfaRequired: true,
      mfaLabel: "Yes (platform default)",
      idpPreference: "supabase_email",
      idpLabel: IDP_LABELS.supabase_email,
      ssoNotes: null,
      source: "default",
    };
  }

  const mfaRequired = mfaRaw !== "no";
  const idpPreference = idpRaw || "supabase_email";

  return {
    mfaRequired,
    mfaLabel: mfaRequired ? "Required for admins" : "Not required",
    idpPreference,
    idpLabel: IDP_LABELS[idpPreference] ?? idpPreference,
    ssoNotes: ssoNotes || null,
    source: "discovery",
  };
}
