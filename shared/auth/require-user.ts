import { AppError } from "@/shared/errors";
import { getServerSupabase } from "@/lib/supabase/server";

export type AuthUser = {
  id: string;
  email?: string;
};

/**
 * Server-side session gate for route handlers and server actions.
 * Auth is not wired yet — this helper throws until Supabase Auth is configured.
 */
export async function requireUser(): Promise<AuthUser> {
  const supabase = await getServerSupabase();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    throw new AppError("UNAUTHENTICATED", "Sign in required.", 401);
  }

  return { id: data.user.id, email: data.user.email };
}
