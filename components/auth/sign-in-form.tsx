"use client";

import { useActionState, useState } from "react";
import { signInAction, type AuthActionState } from "@/app/(auth)/actions";
import { AuthField } from "@/components/auth/auth-field";
import { primaryButtonClass } from "@/components/auth/styles";

type SignInFormProps = {
  next: string;
  confirmationError?: string;
};

export function SignInForm({ next, confirmationError }: SignInFormProps) {
  const [state, action, pending] = useActionState(signInAction, {} as AuthActionState);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const formError = state.error ?? confirmationError;

  return (
    <form action={action} className="mt-8 grid gap-4">
      <input type="hidden" name="next" value={next} />
      {formError ? (
        <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {formError}
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
        autoComplete="current-password"
        value={password}
        onChange={setPassword}
        error={state.fieldErrors?.password}
      />
      <button type="submit" className={primaryButtonClass} disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
