import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { signOutAction } from "@/app/(auth)/actions";
import { secondaryButtonClass } from "@/components/auth/styles";
import { getPublicSupabaseEnv } from "@/lib/supabase/env";
import { isProtectedPath, PATHNAME_HEADER, signInRedirect } from "@/shared/auth/paths";
import { requireUser } from "@/shared/auth/require-user";
import { AppError } from "@/shared/errors";

export const dynamic = "force-dynamic";

const nav = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/semesters", label: "Semesters" },
  { href: "/review", label: "Review" },
  { href: "/calendar", label: "Calendar" },
  { href: "/reminders", label: "Reminders" },
  { href: "/assistant", label: "Assistant" },
  { href: "/study-plan", label: "Study plan" },
  { href: "/settings", label: "Settings" },
] as const;

export default async function AppShellLayout({ children }: Readonly<{ children: ReactNode }>) {
  if (!getPublicSupabaseEnv()) {
    redirect("/auth/sign-in");
  }

  let user: Awaited<ReturnType<typeof requireUser>>;
  try {
    user = await requireUser();
  } catch (error) {
    if (error instanceof AppError && error.status === 401) {
      const headerStore = await headers();
      const pathname = headerStore.get(PATHNAME_HEADER) ?? "/dashboard";
      redirect(signInRedirect(isProtectedPath(pathname) ? pathname : "/dashboard"));
    }
    throw error;
  }

  return (
    <div>
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-4 px-6 py-4">
          <Link href="/" className="font-bold text-slate-900">
            SyllabusAI
          </Link>
          <nav className="flex flex-wrap gap-3 text-sm text-slate-600" aria-label="App">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-blue-700">
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex flex-wrap items-center gap-3">
            <p className="max-w-xs truncate text-sm text-slate-600">{user.email ?? "Signed in"}</p>
            <form action={signOutAction}>
              <button type="submit" className={`${secondaryButtonClass} px-3 py-2 text-sm`}>
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
