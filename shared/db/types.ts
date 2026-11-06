/** Shared processing states for syllabus_files.status */
export type ProcessingStatus =
  | "queued"
  | "processing"
  | "review_needed"
  | "completed"
  | "failed";

export type ConfirmationState = "unreviewed" | "confirmed" | "rejected";

export type DeadlineItemType =
  | "assignment"
  | "quiz"
  | "exam"
  | "project"
  | "presentation"
  | "reading"
  | "other";
