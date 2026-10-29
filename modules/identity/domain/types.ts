export type UserProfile = {
  userId: string;
  displayName: string | null;
  timezone: string;
  preferredReminderOffsetsHours: number[];
};
