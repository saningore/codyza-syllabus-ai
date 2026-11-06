import { describe, expect, it } from "vitest";
import { PROCESSING_TRANSITIONS } from "@/modules/documents";

describe("syllabus processing state machine", () => {
  it("allows queued to enter processing", () => {
    expect(PROCESSING_TRANSITIONS.queued).toContain("processing");
  });

  it("allows failed jobs to re-queue", () => {
    expect(PROCESSING_TRANSITIONS.failed).toEqual(["queued"]);
  });

  it("treats completed as terminal", () => {
    expect(PROCESSING_TRANSITIONS.completed).toEqual([]);
  });
});
