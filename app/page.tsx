import Link from "next/link";
import { signOutAction } from "@/app/(auth)/actions";
import { primaryButtonClass, secondaryButtonClass } from "@/components/auth/styles";
import { getOptionalUser } from "@/shared/auth/require-user";

export const dynamic = "force-dynamic";

export default async function Home() {
  const user = await getOptionalUser();

  return (
    <main className="mx-auto max-w-5xl px-6 py-24">
      <span className="text-sm font-semibold tracking-widest text-blue-700">CODYZA TEAM 01</span>
      <h1 className="mt-4 text-5xl font-bold">SyllabusAI</h1>
      <p className="mt-5 max-w-xl text-lg text-slate-600">
        Turn course syllabuses into verified academic deadlines and organized study plans.
      </p>
      <p className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm">
        Sign in to open your semester workspace. Uploads, AI extraction, and calendar features are
        still in progress.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        {user ? (
          <>
            <Link className={primaryButtonClass} href="/dashboard">
              Go to dashboard
            </Link>
            <form action={signOutAction}>
              <button type="submit" className={secondaryButtonClass}>
                Sign out
              </button>
            </form>
          </>
        ) : (
          <>
            <Link className={primaryButtonClass} href="/auth/sign-in">
              Sign in
            </Link>
            <Link className={secondaryButtonClass} href="/auth/sign-up">
              Sign up
            </Link>
          </>
        )}
      </div>
    </main>
  );
}
