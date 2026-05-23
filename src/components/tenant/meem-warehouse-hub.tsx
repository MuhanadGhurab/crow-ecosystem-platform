import { MeemModuleHub } from "@/components/tenant/meem-module-hub";

type MeemWarehouseHubProps = {
  slug: string;
  organizationName: string;
  aiExtraKeys: string[];
};

export function MeemWarehouseHub(props: MeemWarehouseHubProps) {
  return <MeemModuleHub moduleKey="warehouse" {...props} />;
}
