import { createServerClient, type SetAllCookies } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getPublicSupabaseEnv } from "@/lib/supabase/env";
import { PATHNAME_HEADER, sessionGate } from "@/shared/auth/paths";

function nextWithPath(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(PATHNAME_HEADER, request.nextUrl.pathname);
  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

function redirectTo(request: NextRequest, location: string) {
  const url = request.nextUrl.clone();
  const target = new URL(location, request.url);
  url.pathname = target.pathname;
  url.search = target.search;
  return NextResponse.redirect(url);
}

function withSessionCookies(response: NextResponse, sessionResponse: NextResponse) {
  sessionResponse.cookies.getAll().forEach((cookie) => {
    response.cookies.set(cookie.name, cookie.value);
  });
  return response;
}

export async function updateSession(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const env = getPublicSupabaseEnv();

  if (!env) {
    const decision = sessionGate({ pathname, search, signedIn: false });
    if (decision.type === "redirect") return redirectTo(request, decision.location);
    return nextWithPath(request);
  }

  let supabaseResponse = nextWithPath(request);
  const setAll: SetAllCookies = (cookiesToSet) => {
    cookiesToSet.forEach(({ name, value }) => {
      request.cookies.set(name, value);
    });
    supabaseResponse = nextWithPath(request);
    cookiesToSet.forEach(({ name, value, options }) => {
      supabaseResponse.cookies.set(name, value, options);
    });
  };
  const supabase = createServerClient(env.url, env.key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll,
    },
  });

  let signedIn = false;
  try {
    const { data, error } = await supabase.auth.getUser();
    signedIn = !error && Boolean(data.user);
  } catch {
    signedIn = false;
  }

  const decision = sessionGate({ pathname, search, signedIn });
  if (decision.type === "redirect") {
    return withSessionCookies(redirectTo(request, decision.location), supabaseResponse);
  }

  return supabaseResponse;
}
