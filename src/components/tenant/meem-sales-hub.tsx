import { MeemModuleHub } from "@/components/tenant/meem-module-hub";

type MeemSalesHubProps = {
  slug: string;
  organizationName: string;
  aiExtraKeys: string[];
};

export function MeemSalesHub(props: MeemSalesHubProps) {
  return <MeemModuleHub moduleKey="sales" {...props} />;
}
