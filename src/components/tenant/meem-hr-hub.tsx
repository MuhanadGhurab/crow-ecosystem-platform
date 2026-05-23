import { MeemModuleHub } from "@/components/tenant/meem-module-hub";

type MeemHrHubProps = {
  slug: string;
  organizationName: string;
  aiExtraKeys: string[];
};

export function MeemHrHub(props: MeemHrHubProps) {
  return <MeemModuleHub moduleKey="hr" {...props} />;
}
