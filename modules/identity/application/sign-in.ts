import { getPublicSupabaseEnv } from "@/lib/supabase/env";
import { getServerSupabase } from "@/lib/supabase/server";
import { authFieldErrors, signInSchema, type SignInInput } from "../domain/auth-schema";
import { AUTH_NOT_CONFIGURED, mapSignInError } from "./auth-errors";

export type SignInResult = { ok: true } | { ok: false; error: string };

export async function signInWithEmail(input: SignInInput): Promise<SignInResult> {
  const parsed = signInSchema.safeParse(input);
  if (!parsed.success) {
    const fields = authFieldErrors(parsed.error);
    return {
      ok: false,
      error: fields.email ?? fields.password ?? "Check the email and password.",
    };
  }

  if (!getPublicSupabaseEnv()) {
    return { ok: false, error: AUTH_NOT_CONFIGURED };
  }

  const supabase = await getServerSupabase();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) return { ok: false, error: mapSignInError(error.message) };
  return { ok: true };
}
