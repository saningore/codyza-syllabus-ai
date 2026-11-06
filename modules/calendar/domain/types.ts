export type CalendarProvider = "ics" | "google";

export type CalendarExport = {
  id: string;
  userId: string;
  deadlineId: string;
  provider: CalendarProvider;
  externalEventId: string | null;
  exportedAt: string;
};
