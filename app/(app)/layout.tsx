import Link from "next/link";
import type { ReactNode } from "react";

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

export default function AppShellLayout({ children }: Readonly<{ children: ReactNode }>) {
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
        </div>
      </header>
      {children}
    </div>
  );
}
