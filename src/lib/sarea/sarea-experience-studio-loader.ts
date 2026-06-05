import "server-only";

/**
 * Studio-only entry for M2 mapping snapshots — keeps SAREA route imports on one loader
 * instead of spreading the full mapping service import across six studio pages.
 */
export { buildSareaExperienceMappingStudioSnapshot } from "@/lib/services/sarea-experience-mapping.service";
