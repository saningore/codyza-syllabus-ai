import type { ConfirmationState, DeadlineItemType } from "@/shared/db/types";

export type Deadline = {
  id: string;
  userId: string;
  courseId: string;
  sourceFileId: string | null;
  title: string;
  itemType: DeadlineItemType;
  dueAt: string | null;
  confidence: number | null;
  confirmationState: ConfirmationState;
  sourcePage: number | null;
  sourceSnippet: string | null;
};
