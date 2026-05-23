import { MeemModuleHub } from "@/components/tenant/meem-module-hub";

type MeemFinanceHubProps = {
  slug: string;
  organizationName: string;
  aiExtraKeys: string[];
};

export function MeemFinanceHub(props: MeemFinanceHubProps) {
  return <MeemModuleHub moduleKey="finance" {...props} />;
}
