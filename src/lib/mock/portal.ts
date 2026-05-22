import type { ImplementationRequestStatus } from "@/lib/types/platform";
import { MOCK_PIPELINE_REQUESTS } from "@/lib/mock/pipeline";
import { MOCK_PROPOSAL_TOKEN } from "@/lib/mock/blueprint";

export const MOCK_CLIENT_EMAIL = "client.demo@alnoor.test";

export type MockClientRequestRow = {
  id: string;
  referenceCode: string;
  organizationName: string;
  status: ImplementationRequestStatus;
  planKey: string;
  estimatedMonthlySar: number;
  proposalToken: string | null;
  updatedAt: string;
};

/** Demo client portal — linked to mock-req-001 */
export const MOCK_CLIENT_REQUESTS: MockClientRequestRow[] = [
  {
    id: "mock-req-001",
    referenceCode: MOCK_PIPELINE_REQUESTS[0].referenceCode,
    organizationName: MOCK_PIPELINE_REQUESTS[0].organizationName,
    status: MOCK_PIPELINE_REQUESTS[0].status,
    planKey: MOCK_PIPELINE_REQUESTS[0].planKey,
    estimatedMonthlySar: MOCK_PIPELINE_REQUESTS[0].estimatedMonthlySar,
    proposalToken: null,
    updatedAt: "2026-05-18T09:00:00.000Z",
  },
];

export function getMockClientRequest(id: string): MockClientRequestRow | undefined {
  return MOCK_CLIENT_REQUESTS.find((r) => r.id === id);
}

export function isMockClientRequestId(id: string): boolean {
  return id.startsWith("mock-req-");
}
