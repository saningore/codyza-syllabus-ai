import { AppError } from "@/shared/errors";
import type { AssistantAnswer } from "../domain/types";

/**
 * Syllabus-grounded Q&A. Missing facts must return found: false ("not found").
 */
export async function askSyllabusQuestion(_input: {
  userId: string;
  question: string;
  semesterId?: string;
}): Promise<AssistantAnswer> {
  throw new AppError("NOT_IMPLEMENTED", "Grounded assistant is not implemented yet.", 501);
}
