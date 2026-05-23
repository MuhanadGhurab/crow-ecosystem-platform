import { MeemModuleHub } from "@/components/tenant/meem-module-hub";

type MeemLogisticsHubProps = {
  slug: string;
  organizationName: string;
  aiExtraKeys: string[];
};

export function MeemLogisticsHub(props: MeemLogisticsHubProps) {
  return <MeemModuleHub moduleKey="logistics" {...props} />;
}
