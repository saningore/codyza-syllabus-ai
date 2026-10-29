export type ReminderStatus = "scheduled" | "sent" | "cancelled";

export type Reminder = {
  id: string;
  userId: string;
  deadlineId: string;
  remindAt: string;
  status: ReminderStatus;
};

/** Spec defaults: 7d / 3d / 24h / 2h */
export const DEFAULT_REMINDER_OFFSETS_HOURS = [7 * 24, 3 * 24, 24, 2] as const;
