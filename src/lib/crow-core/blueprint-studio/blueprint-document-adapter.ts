import { adaptEnterpriseBlueprintDetail } from "./blueprint-adapter";
import type { EnterpriseBlueprintDetail } from "@/lib/services/blueprint.service";

/** C2 runtime alias — maps persisted blueprint detail to studio document shape. */
export function adaptEnterpriseBlueprintDetailToDocument(
  detail: EnterpriseBlueprintDetail
) {
  return adaptEnterpriseBlueprintDetail(detail);
}
