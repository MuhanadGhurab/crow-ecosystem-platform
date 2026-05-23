import type { ProposalStatus } from "@prisma/client";

export { formatSar } from "@/lib/services/pricing.service";

export function proposalStatusLabel(status: ProposalStatus): string {
  const labels: Record<ProposalStatus, string> = {
    DRAFT: "Draft",
    SENT: "Sent to client",
    CLIENT_APPROVED: "Client approved",
    DECLINED: "Declined",
  };
  return labels[status];
}
