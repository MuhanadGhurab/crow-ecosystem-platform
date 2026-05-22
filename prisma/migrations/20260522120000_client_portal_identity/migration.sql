-- Client portal: link implementation requests to Supabase Auth users
ALTER TABLE "implementation_requests" ADD COLUMN IF NOT EXISTS "submittedByUserId" TEXT;

CREATE INDEX IF NOT EXISTS "implementation_requests_submittedByUserId_idx"
  ON "implementation_requests"("submittedByUserId");
