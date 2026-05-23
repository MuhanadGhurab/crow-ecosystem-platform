import { MeemModuleHub } from "@/components/tenant/meem-module-hub";

type MeemInventoryHubProps = {
  slug: string;
  organizationName: string;
  aiExtraKeys: string[];
};

export function MeemInventoryHub(props: MeemInventoryHubProps) {
  return <MeemModuleHub moduleKey="inventory" {...props} />;
}
