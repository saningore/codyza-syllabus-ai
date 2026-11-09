import Link from "next/link";
import { redirect } from "next/navigation";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { textLinkClass } from "@/components/auth/styles";
import { getOptionalUser } from "@/shared/auth/require-user";

export const dynamic = "force-dynamic";

export default async function SignUpPage() {
  const user = await getOptionalUser();
  if (user) redirect("/dashboard");

  return (
    <main className="mx-auto max-w-md px-6 py-16">
      <h1 className="text-3xl font-bold">Sign up</h1>
      <p className="mt-4 text-slate-600">
        Create an account with your email. You will confirm it before the dashboard opens.
      </p>
      <SignUpForm />
      <p className="mt-6 text-sm text-slate-600">
        Already registered?{" "}
        <Link className={textLinkClass} href="/auth/sign-in">
          Sign in
        </Link>
      </p>
    </main>
  );
}
