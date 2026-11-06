/**
 * Background entrypoint for long-running syllabus processing.
 *
 * Keep this in-repo (modular monolith). If Vercel serverless timeouts block
 * OCR/Gemini work, run this as a separate worker process — same codebase,
 * not a microservice fleet.
 *
 * Flow: queued → processing → parse/OCR → extract → review_needed | failed
 */
export async function runProcessSyllabusJob(_fileId: string): Promise<void> {
  throw new Error("process-syllabus job is not implemented yet");
}
