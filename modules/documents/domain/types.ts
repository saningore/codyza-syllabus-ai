import type { ProcessingStatus } from "@/shared/db/types";

export type SyllabusFile = {
  id: string;
  userId: string;
  courseId: string;
  originalName: string;
  mimeType: string;
  storagePath: string;
  status: ProcessingStatus;
  uploadedAt: string;
};

export type SourceChunk = {
  id: string;
  fileId: string;
  pageNumber: number | null;
  chunkIndex: number;
  content: string;
};

export const ALLOWED_SYLLABUS_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/png",
  "image/jpeg",
] as const;
