import { MeemModuleHub } from "@/components/tenant/meem-module-hub";

type MeemCrmHubProps = {
  slug: string;
  organizationName: string;
  aiExtraKeys: string[];
};

export function MeemCrmHub(props: MeemCrmHubProps) {
  return <MeemModuleHub moduleKey="crm" {...props} />;
}
