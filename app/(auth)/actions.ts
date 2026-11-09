"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  authFieldErrors,
  signInSchema,
  signInWithEmail,
  signOutCurrentUser,
  signUpSchema,
  signUpWithEmail,
  type AuthFieldErrors,
} from "@/modules/identity";
import { safeNextPath } from "@/shared/auth/paths";

export type AuthActionState = {
  error?: string;
  fieldErrors?: AuthFieldErrors;
  needsEmailConfirmation?: boolean;
};

export async function signInAction(
  _previous: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const next = safeNextPath(stringValue(formData.get("next")));
  const parsed = signInSchema.safeParse({
    email: stringValue(formData.get("email")),
    password: stringValue(formData.get("password")),
  });

  if (!parsed.success) {
    return { fieldErrors: authFieldErrors(parsed.error) };
  }

  const result = await signInWithEmail(parsed.data);
  if (!result.ok) return { error: result.error };
  redirect(next);
}

export async function signUpAction(
  _previous: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = signUpSchema.safeParse({
    email: stringValue(formData.get("email")),
    password: stringValue(formData.get("password")),
    confirmPassword: stringValue(formData.get("confirmPassword")),
  });

  if (!parsed.success) {
    return { fieldErrors: authFieldErrors(parsed.error) };
  }

  const result = await signUpWithEmail(parsed.data, await requestOrigin());
  if (!result.ok) return { error: result.error };
  if (result.needsEmailConfirmation) return { needsEmailConfirmation: true };
  redirect("/dashboard");
}

export async function signOutAction(): Promise<void> {
  await signOutCurrentUser();
  redirect("/");
}

function stringValue(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value : "";
}

async function requestOrigin(): Promise<string> {
  const headerStore = await headers();
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host");
  const proto = headerStore.get("x-forwarded-proto") ?? "http";
  if (!host) throw new Error("Missing host header");
  return `${proto}://${host}`;
}
