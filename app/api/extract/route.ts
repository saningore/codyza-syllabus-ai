import { extractSyllabus } from "@/modules/extraction";
import { requireUser } from "@/shared/auth/require-user";
import { jsonError, notImplemented } from "@/shared/errors/http";

export async function POST(request: Request) {
  try {
    // Auth gate will enforce session once Supabase Auth is configured.
    // Keep the stub honest until the pipeline is wired.
    void requireUser;
    void extractSyllabus;
    void request;
    return notImplemented("Authenticated syllabus extraction");
  } catch (error) {
    return jsonError(error);
  }
}
