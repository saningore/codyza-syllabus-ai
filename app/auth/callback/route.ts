import { NextResponse, type NextRequest } from "next/server";
import { getPublicSupabaseEnv } from "@/lib/supabase/env";
import { getServerSupabase } from "@/lib/supabase/server";
import { safeNextPath } from "@/shared/auth/paths";

/**
 * Completes the Supabase email confirmation redirect.
 * The hosted email template must send the browser back here with a `code`
 * (PKCE). The server client exchanges that code for a session cookie.
 */
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = safeNextPath(url.searchParams.get("next"));
  const signInUrl = new URL("/auth/sign-in", url.origin);
  signInUrl.searchParams.set("error", "confirmation");

  if (!code || !getPublicSupabaseEnv()) {
    return NextResponse.redirect(signInUrl);
  }

  const supabase = await getServerSupabase();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) return NextResponse.redirect(signInUrl);

  return NextResponse.redirect(new URL(next, url.origin));
}
