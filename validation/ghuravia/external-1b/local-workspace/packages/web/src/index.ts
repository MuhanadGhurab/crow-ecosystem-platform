/**
 * GHURAVIA IMPLEMENTATION-ENTRY VALIDATION HARNESS
 * NON-PRODUCT CODE
 * NOT APPROVED FOR RUNTIME OR PRODUCTION
 */

import type { ValidationContract } from "@ghv-val-1b/contracts";
import { acceptsContract } from "@ghv-val-1b/domain";

export function validateLayerDirection(contract: ValidationContract): string {
  return acceptsContract(contract);
}
