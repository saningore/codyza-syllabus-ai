import { describe, expect, it } from "vitest";
import { extractionSchema } from "@/modules/extraction";

describe("AI extraction validation", () => {
  it("accepts an empty extraction without inventing deadlines", () => {
    expect(extractionSchema.parse({ deadlines: [] })).toEqual({ deadlines: [] });
  });

  it("rejects ungrounded deadlines", () => {
    expect(
      extractionSchema.safeParse({
        deadlines: [
          { title: "Exam", type: "exam", dueAt: null, confidence: 0.5, issue: null },
        ],
      }).success,
    ).toBe(false);
  });

  it("accepts a grounded deadline with evidence", () => {
    const result = extractionSchema.safeParse({
      deadlines: [
        {
          title: "Midterm",
          type: "exam",
          dueAt: "2026-10-12T15:00:00-07:00",
          confidence: 0.82,
          evidence: {
            fileId: "11111111-1111-4111-8111-111111111111",
            page: 2,
            snippet: "Midterm: Oct 12",
          },
          issue: null,
        },
      ],
    });
    expect(result.success).toBe(true);
  });
});
