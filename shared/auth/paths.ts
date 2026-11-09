export const PATHNAME_HEADER = "x-pathname";

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/semesters",
  "/courses",
  "/review",
  "/calendar",
  "/reminders",
  "/assistant",
  "/study-plan",
  "/settings",
] as const;

const DEFAULT_NEXT = "/dashboard";

export type SessionDecision =
  | { type: "continue" }
  | { type: "redirect"; location: string };

export function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function safeNextPath(value: string | null | undefined): string {
  if (!value) return DEFAULT_NEXT;
  const candidate = value.trim();
  if (!candidate.startsWith("/")) return DEFAULT_NEXT;
  if (candidate.startsWith("//")) return DEFAULT_NEXT;
  if (candidate.includes("\\")) return DEFAULT_NEXT;
  if (candidate.includes("://")) return DEFAULT_NEXT;
  if (candidate.includes("..")) return DEFAULT_NEXT;
  if (/[\u0000-\u001F\u007F]/.test(candidate)) return DEFAULT_NEXT;

  let decoded = candidate;
  try {
    decoded = decodeURIComponent(candidate);
  } catch {
    return DEFAULT_NEXT;
  }

  if (!decoded.startsWith("/") || decoded.startsWith("//")) return DEFAULT_NEXT;
  if (decoded.includes("\\") || decoded.includes("://") || decoded.includes("..")) {
    return DEFAULT_NEXT;
  }
  if (/[\u0000-\u001F\u007F]/.test(decoded)) return DEFAULT_NEXT;

  return candidate;
}

export function sessionGate(input: {
  pathname: string;
  search: string;
  signedIn: boolean;
}): SessionDecision {
  const search = normalizeSearch(input.search);
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);

  if (!input.signedIn && isProtectedPath(input.pathname)) {
    const returnTo = `${input.pathname}${search}`;
    return {
      type: "redirect",
      location: `/auth/sign-in?next=${encodeURIComponent(returnTo)}`,
    };
  }

  if (
    input.signedIn &&
    (input.pathname === "/auth/sign-in" || input.pathname === "/auth/sign-up")
  ) {
    return { type: "redirect", location: safeNextPath(params.get("next")) };
  }

  return { type: "continue" };
}

export function signInRedirect(pathname: string): string {
  const decision = sessionGate({ pathname, search: "", signedIn: false });
  return decision.type === "redirect" ? decision.location : "/auth/sign-in";
}

function normalizeSearch(search: string): string {
  if (!search || search === "?") return "";
  return search.startsWith("?") ? search : `?${search}`;
}
