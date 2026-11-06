export type AssistantCitation = {
  fileId: string;
  page: number | null;
  snippet: string;
};

export type AssistantAnswer = {
  answer: string;
  found: boolean;
  citations: AssistantCitation[];
};
