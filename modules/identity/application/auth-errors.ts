export const AUTH_NOT_CONFIGURED = "Authentication is not configured.";

export function mapSignInError(message: string): string {
  if (message.toLowerCase().includes("email not confirmed")) {
    return "Confirm your email before signing in.";
  }
  return "Email or password is incorrect.";
}

export function mapSignUpError(message: string): string {
  const normalized = message.toLowerCase();
  if (normalized.includes("already")) {
    return "An account with that email already exists. Sign in instead.";
  }
  if (normalized.includes("password")) {
    return "Password does not meet the account requirements.";
  }
  return "Could not create the account. Try again.";
}

export type SignUpUser = {
  identities?: { id: string }[] | null;
};

export function classifySignUp(input: {
  user: SignUpUser | null;
  session: unknown;
}): "duplicate" | "needs_confirmation" | "signed_in" {
  if (input.user && Array.isArray(input.user.identities) && input.user.identities.length === 0) {
    return "duplicate";
  }
  if (!input.session) return "needs_confirmation";
  return "signed_in";
}
