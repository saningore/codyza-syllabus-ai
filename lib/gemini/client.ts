/**
 * Server-only Gemini client wrapper.
 * Do not import this module from client components.
 */
export function getGeminiApiKey(): string {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error("Missing GEMINI_API_KEY (server-only)");
  }
  return key;
}

/** Placeholder — wire @google/genai in the extraction module. */
export async function createGeminiClient() {
  const apiKey = getGeminiApiKey();
  const { GoogleGenAI } = await import("@google/genai");
  return new GoogleGenAI({ apiKey });
}
