import { z } from "zod";
export const extractedDeadlineSchema = z.object({
  title: z.string().min(1),
  type: z.enum(["assignment", "quiz", "exam", "project", "presentation", "reading", "other"]),
  dueAt: z.string().datetime({ offset: true }).nullable(),
  confidence: z.number().min(0).max(1).nullable(),
  evidence: z.object({ fileId: z.string().uuid(), page: z.number().int().positive().nullable(), snippet: z.string().min(1) }),
  issue: z.string().nullable(),
});
export const extractionSchema = z.object({ deadlines: z.array(extractedDeadlineSchema) });

export type ExtractedDeadline = z.infer<typeof extractedDeadlineSchema>;
export type Extraction = z.infer<typeof extractionSchema>;
