import type { Extraction } from "../schemas/extraction";

export type ExtractionResult = {
  extraction: Extraction;
  issues: Array<{
    issueType: string;
    description: string;
    deadlineIndex?: number;
  }>;
};
