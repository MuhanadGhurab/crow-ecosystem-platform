import { MeemModuleHub } from "@/components/tenant/meem-module-hub";

type MeemReportsHubProps = {
  slug: string;
  organizationName: string;
  aiExtraKeys: string[];
};

export function MeemReportsHub(props: MeemReportsHubProps) {
  return <MeemModuleHub moduleKey="reports" {...props} />;
}
