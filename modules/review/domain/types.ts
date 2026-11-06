import type { ConfirmationState } from "@/shared/db/types";

export type ReviewAction = "confirm" | "edit" | "reject";

export type ReviewItem = {
  deadlineId: string;
  confirmationState: ConfirmationState;
  title: string;
  dueAt: string | null;
  issue: string | null;
  evidenceSnippet: string | null;
  sourcePage: number | null;
};
