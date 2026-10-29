import Link from "next/link";

export default function SignInPage() {
  return (
    <main className="mx-auto max-w-md px-6 py-24">
      <h1 className="text-3xl font-bold">Sign in</h1>
      <p className="mt-4 text-slate-600">
        Authentication is not wired yet. Connect Supabase Auth before protecting app routes.
      </p>
      <Link className="mt-8 inline-block text-sm font-semibold text-blue-700 underline" href="/">
        Back home
      </Link>
    </main>
  );
}
