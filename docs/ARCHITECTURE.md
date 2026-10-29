# Architecture decision record (initial proposal)

Browser → Next.js UI → authenticated Next.js route handlers → Supabase Postgres / private Storage.

Upload → validate MIME, signature and size → private object → queue/processing status → parse PDF/DOCX/image → page-indexed source chunks → Gemini (server only) → Zod validation → uncertainty/duplicate detection → unreviewed records → human confirmation → confirmed deadlines → dashboard, reminders, calendar export and grounded Q&A.

Do not put model keys in client code. Do not assume that model confidence is calibrated. Never convert a guessed date into a confirmed deadline. Use server-side authorization and private storage policies. For long-running jobs, evaluate a worker/queue; serverless request timeouts may prevent processing large files.

**Status:** Proposed architecture, not a deployed or verified implementation.
