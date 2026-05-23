import { MeemModuleHub } from "@/components/tenant/meem-module-hub";

type MeemProcurementHubProps = {
  slug: string;
  organizationName: string;
  aiExtraKeys: string[];
};

export function MeemProcurementHub(props: MeemProcurementHubProps) {
  return <MeemModuleHub moduleKey="procurement" {...props} />;
}
