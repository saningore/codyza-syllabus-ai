import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "SyllabusAI | Powered by Codyza",
  description: "Academic deadlines, grounded in your syllabus",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
        <footer className="mx-auto max-w-5xl px-6 py-10 text-sm text-slate-500">
          Powered by Codyza · Starter scaffold
        </footer>
      </body>
    </html>
  );
}
