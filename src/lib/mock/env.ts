/** When true, pipeline list/detail and pricing fallbacks use demo data from `@/lib/mock/pipeline`. */
export function isUseMockData(): boolean {
  return process.env.USE_MOCK_DATA === "true";
}
