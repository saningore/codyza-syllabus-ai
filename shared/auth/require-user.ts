import { getPublicSupabaseEnv } from "@/lib/supabase/env";
import { getServerSupabase } from "@/lib/supabase/server";
import { AppError } from "@/shared/errors";

export type AuthUser = {
  id: string;
  email?: string;
};

/**
 * Server-side session gate for route handlers, layouts, and server actions.
 * Validates the user with Supabase Auth (`getUser`), then returns the account id.
 */
export async function requireUser(): Promise<AuthUser> {
  const supabase = await getServerSupabase();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    throw new AppError("UNAUTHENTICATED", "Sign in required.", 401);
  }

  return { id: data.user.id, email: data.user.email };
}

/** Reads the current session when auth is configured. Missing config or session yields null. */
export async function getOptionalUser(): Promise<AuthUser | null> {
  if (!getPublicSupabaseEnv()) return null;
  try {
    return await requireUser();
  } catch (error) {
    if (error instanceof AppError && error.status === 401) return null;
    return null;
  }
}
