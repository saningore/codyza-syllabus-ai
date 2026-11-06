export type WorkloadLevel = "light" | "medium" | "heavy";

export type StudyPlanItem = {
  id: string;
  title: string;
  /** Suggestions must never be labeled as official instructor deadlines. */
  isSuggestion: boolean;
  relatedDeadlineId: string | null;
  plannedFor: string | null;
};

export type WeeklyPlan = {
  weekStart: string;
  workload: WorkloadLevel;
  items: StudyPlanItem[];
};
