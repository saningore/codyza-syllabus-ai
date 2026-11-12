import Link from "next/link";
import { redirect } from "next/navigation";
import { SignInForm } from "@/components/auth/sign-in-form";
import { textLinkClass } from "@/components/auth/styles";
import { safeNextPath } from "@/shared/auth/paths";
import { getOptionalUser } from "@/shared/auth/require-user";

export const dynamic = "force-dynamic";

type SignInPageProps = {
  searchParams: Promise<{ next?: string; error?: string }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const params = await searchParams;
  const next = safeNextPath(params.next);
  const user = await getOptionalUser();
  if (user) redirect(next);

  const confirmationError =
    params.error === "confirmation"
      ? "That confirmation link is invalid or expired. Sign in if you already confirmed the account."
      : undefined;

  return (
    <main className="mx-auto max-w-md px-6 py-16">
      <h1 className="text-3xl font-bold">Sign in</h1>
      <p className="mt-4 text-slate-600">Use the email and password for your SyllabusAI account.</p>
      <SignInForm next={next} confirmationError={confirmationError} />
      <p className="mt-6 text-sm text-slate-600">
        New here?{" "}
        <Link className={textLinkClass} href="/auth/sign-up">
          Create an account
        </Link>
      </p>
    </main>
  );
}
