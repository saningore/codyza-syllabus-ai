"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { signUpAction, type AuthActionState } from "@/app/(auth)/actions";
import { AuthField } from "@/components/auth/auth-field";
import { primaryButtonClass, textLinkClass } from "@/components/auth/styles";

export function SignUpForm() {
  const [state, action, pending] = useActionState(signUpAction, {} as AuthActionState);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  if (state.needsEmailConfirmation) {
    return (
      <div className="mt-8 rounded-lg border border-slate-200 bg-white p-4" role="status">
        <h2 className="text-lg font-semibold">Check your email</h2>
        <p className="mt-2 text-sm text-slate-600">
          Confirm the account from the message we sent, then sign in.
        </p>
        <Link className={`mt-4 inline-block ${textLinkClass}`} href="/auth/sign-in">
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <form action={action} className="mt-8 grid gap-4">
      {state.error ? (
        <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {state.error}
        </p>
      ) : null}
      <AuthField
        id="email"
        name="email"
        label="Email"
        type="email"
        autoComplete="email"
        autoFocus
        value={email}
        onChange={setEmail}
        error={state.fieldErrors?.email}
      />
      <AuthField
        id="password"
        name="password"
        label="Password"
        type="password"
        autoComplete="new-password"
        value={password}
        onChange={setPassword}
        error={state.fieldErrors?.password}
      />
      <AuthField
        id="confirm-password"
        name="confirmPassword"
        label="Confirm password"
        type="password"
        autoComplete="new-password"
        value={confirmPassword}
        onChange={setConfirmPassword}
        error={state.fieldErrors?.confirmPassword}
      />
      <button type="submit" className={primaryButtonClass} disabled={pending}>
        {pending ? "Creating account…" : "Create account"}
      </button>
    </form>
  );
}
