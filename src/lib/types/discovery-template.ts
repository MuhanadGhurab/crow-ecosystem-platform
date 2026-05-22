import type { CemModuleKey } from "@/lib/constants/modules";
import type { SecurityPackageKey } from "@/lib/constants/security-packages";

export type DiscoveryTemplatePack = {
  key: string;
  label: string;
  organization: {
    operatingModel: string;
    employeeBand: string;
    goLiveTarget: string;
    discoveryNotes: string;
  };
  moduleKeys: CemModuleKey[];
  securityPackageKeys: SecurityPackageKey[];
  departments: { name: string; nameAr?: string; headcount?: number }[];
  branches: { name: string; city?: string; region?: string }[];
  roles: { name: string; level?: string }[];
  workflows: { name: string; description?: string }[];
  securityRequirements: { requirement: string; priority?: string }[];
  integrations: { providerKey: string; notes?: string }[];
  experienceRequirements: { personaKey: string; requirement: string }[];
  identity: {
    idpPreference: string;
    mfaRequired: string;
    ssoNotes: string;
  };
  security: {
    complianceNotes: string;
    ncaAlignment: string;
  };
};
