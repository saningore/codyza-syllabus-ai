import Link from "next/link";

type PlaceholderPageProps = {
  title: string;
  description: string;
  backHref?: string;
  backLabel?: string;
};

export function PlaceholderPage({
  title,
  description,
  backHref = "/dashboard",
  backLabel = "Back to dashboard",
}: PlaceholderPageProps) {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="mt-4 max-w-2xl text-slate-600">{description}</p>
      <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
        Scaffold placeholder — wire real auth, data, and actions before treating this as production UI.
      </p>
      <Link className="mt-8 inline-block text-sm font-semibold text-blue-700 underline" href={backHref}>
        {backLabel}
      </Link>
    </main>
  );
}
