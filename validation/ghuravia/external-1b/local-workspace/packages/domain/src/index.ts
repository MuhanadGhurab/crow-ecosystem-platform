/**
 * GHURAVIA IMPLEMENTATION-ENTRY VALIDATION HARNESS
 * NON-PRODUCT CODE
 * NOT APPROVED FOR RUNTIME OR PRODUCTION
 */

import type { ValidationContract } from "@ghv-val-1b/contracts";

export function acceptsContract(contract: ValidationContract): string {
  return contract.marker;
}
