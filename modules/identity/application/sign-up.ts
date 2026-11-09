import { getPublicSupabaseEnv } from "@/lib/supabase/env";
import { getServerSupabase } from "@/lib/supabase/server";
import { authFieldErrors, signUpSchema, type SignUpInput } from "../domain/auth-schema";
import { AUTH_NOT_CONFIGURED, classifySignUp, mapSignUpError } from "./auth-errors";

export type SignUpResult =
  | { ok: true; needsEmailConfirmation: boolean }
  | { ok: false; error: string };

export async function signUpWithEmail(input: SignUpInput, origin: string): Promise<SignUpResult> {
  const parsed = signUpSchema.safeParse(input);
  if (!parsed.success) {
    const fields = authFieldErrors(parsed.error);
    return {
      ok: false,
      error:
        fields.email ??
        fields.password ??
        fields.confirmPassword ??
        "Check the account details and try again.",
    };
  }

  if (!getPublicSupabaseEnv()) {
    return { ok: false, error: AUTH_NOT_CONFIGURED };
  }

  const supabase = await getServerSupabase();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) return { ok: false, error: mapSignUpError(error.message) };

  const outcome = classifySignUp({ user: data.user, session: data.session });
  if (outcome === "duplicate") {
    return {
      ok: false,
      error: "An account with that email already exists. Sign in instead.",
    };
  }

  return { ok: true, needsEmailConfirmation: outcome === "needs_confirmation" };
}
