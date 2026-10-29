import { AppError } from "@/shared/errors";
import type { ReviewAction } from "../domain/types";

/**
 * Human review gate — AI output stays provisional until confirm/edit/reject.
 */
export async function applyReviewAction(_input: {
  userId: string;
  deadlineId: string;
  action: ReviewAction;
  correctedTitle?: string;
  correctedDueAt?: string | null;
}): Promise<void> {
  throw new AppError("NOT_IMPLEMENTED", "Review workflow is not implemented yet.", 501);
}
