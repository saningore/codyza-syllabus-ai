import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-24">
      <span className="text-sm font-semibold tracking-widest text-blue-700">CODYZA TEAM 01</span>
      <h1 className="mt-4 text-5xl font-bold">SyllabusAI</h1>
      <p className="mt-5 max-w-xl text-lg text-slate-600">
        Turn course syllabuses into verified academic deadlines and organized study plans.
      </p>
      <p className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm">
        Development scaffold only. Authentication, uploads, AI extraction, and calendar features are
        not implemented yet. Architecture: modular monolith.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          className="inline-block rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white"
          href="/dashboard"
        >
          View dashboard placeholder
        </Link>
        <Link
          className="inline-block rounded-lg border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-800"
          href="/auth/sign-in"
        >
          Sign in (stub)
        </Link>
      </div>
    </main>
  );
}
