-- C3 legal publication lifecycle — pre-publication review states (draft-only until authorized publish).
ALTER TYPE "LegalDocumentVersionStatus" ADD VALUE IF NOT EXISTS 'reviewed';
ALTER TYPE "LegalDocumentVersionStatus" ADD VALUE IF NOT EXISTS 'approved_for_publication';
