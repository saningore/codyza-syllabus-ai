import { AppError } from "@/shared/errors";
import type { ProcessingStatus } from "@/shared/db/types";

export const PROCESSING_TRANSITIONS: Record<ProcessingStatus, ProcessingStatus[]> = {
  queued: ["processing", "failed"],
  processing: ["review_needed", "completed", "failed"],
  review_needed: ["completed", "failed"],
  completed: [],
  failed: ["queued"],
};

/**
 * Document processing entrypoint (parse PDF/DOCX/OCR → source chunks).
 * Prefer background jobs for large files — see /jobs/process-syllabus.ts.
 */
export async function processSyllabusFile(_input: {
  userId: string;
  fileId: string;
}): Promise<{ status: ProcessingStatus }> {
  throw new AppError("NOT_IMPLEMENTED", "Document processing is not implemented yet.", 501);
}
