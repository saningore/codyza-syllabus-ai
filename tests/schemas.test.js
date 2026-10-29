import { describe, expect, it } from "vitest";
import { extractionSchema } from "../lib/schemas";
describe("AI extraction validation", () => {
 it("accepts an empty extraction without inventing deadlines", () => { expect(extractionSchema.parse({ deadlines: [] })).toEqual({ deadlines: [] }); });
 it("rejects ungrounded deadlines", () => { expect(extractionSchema.safeParse({ deadlines: [{ title: "Exam", type: "exam", dueAt: null, confidence: 0.5, issue: null }] }).success).toBe(false); });
});
