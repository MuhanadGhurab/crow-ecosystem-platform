import type {
  ClientReviewNoteAuthorRole,
  ClientReviewNoteStatus,
  ClientReviewNoteSummary,
  ClientReviewNoteType,
} from "@/lib/client-portal/client-review-notes-contract";

export type MockClientReviewNoteRecord = {
  id: string;
  requestId: string;
  proposalId: string | null;
  blueprintId: string | null;
  type: ClientReviewNoteType;
  status: ClientReviewNoteStatus;
  message: string;
  submittedAt: string;
  authorEmail: string | null;
  authorRole: ClientReviewNoteAuthorRole;
};

const mockNotes: MockClientReviewNoteRecord[] = [];

let mockIdSeq = 1;

export function appendMockClientReviewNote(input: Omit<MockClientReviewNoteRecord, "id">): string {
  const id = `mock-client-note-${mockIdSeq++}`;
  mockNotes.push({ ...input, id });
  return id;
}

export function listMockClientReviewNotesForRequest(requestId: string): MockClientReviewNoteRecord[] {
  return mockNotes
    .filter((n) => n.requestId === requestId)
    .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
}

export function toMockClientReviewNoteSummary(row: MockClientReviewNoteRecord): ClientReviewNoteSummary {
  const preview =
    row.message.length > 160 ? `${row.message.slice(0, 157).trimEnd()}…` : row.message;
  return {
    id: row.id,
    requestId: row.requestId,
    proposalId: row.proposalId,
    blueprintId: row.blueprintId,
    type: row.type,
    status: row.status,
    messagePreview: preview,
    submittedAt: row.submittedAt,
    authorEmail: row.authorEmail,
    authorRole: row.authorRole,
    procrowNextAction:
      row.type === "request_changes"
        ? "ProCrow will review requested scope or blueprint changes before onboarding continues."
        : "ProCrow will review your note and respond through the request workflow.",
  };
}
