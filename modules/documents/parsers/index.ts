/**
 * Parser adapters live here:
 * - PDF via pdf-parse (evaluate scanned PDFs separately)
 * - DOCX via mammoth
 * - Images/screenshots via Tesseract (install separately when needed)
 */
export type ParsedDocument = {
  text: string;
  pages: Array<{ pageNumber: number; text: string }>;
};
