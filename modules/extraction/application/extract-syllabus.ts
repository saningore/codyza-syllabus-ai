import { AppError } from "@/shared/errors";
import type { ExtractionResult } from "../domain/types";

/**
 * Structured syllabus extraction use-case.
 * Not implemented — wire parsers + Gemini + Zod validation here.
 */
export async function extractSyllabus(_input: {
  userId: string;
  fileId: string;
  courseId: string;
}): Promise<ExtractionResult> {
  throw new AppError(
    "NOT_IMPLEMENTED",
    "Syllabus extraction is not implemented yet.",
    501,
  );
}
