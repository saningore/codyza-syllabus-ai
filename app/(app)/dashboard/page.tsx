export default function DashboardPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-3xl font-bold">Semester dashboard</h1>
      <p className="mt-4 text-slate-600">
        Confirmed deadlines will appear here after review. Unconfirmed extractions stay off this
        page.
      </p>
      <ul className="mt-8 grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
        <li className="rounded-lg border border-slate-200 bg-white p-4">Due today — not wired</li>
        <li className="rounded-lg border border-slate-200 bg-white p-4">Next 7 days — not wired</li>
        <li className="rounded-lg border border-slate-200 bg-white p-4">Overdue — not wired</li>
        <li className="rounded-lg border border-slate-200 bg-white p-4">Unresolved issues — not wired</li>
      </ul>
    </main>
  );
}
