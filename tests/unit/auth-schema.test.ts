import { describe, expect, it } from "vitest";
import {
  AUTH_NOT_CONFIGURED,
  authFieldErrors,
  classifySignUp,
  mapSignInError,
  mapSignUpError,
  signInSchema,
  signUpSchema,
} from "@/modules/identity";

describe("auth schemas", () => {
  it("accepts a valid sign-in", () => {
    expect(signInSchema.safeParse({ email: "student@example.com", password: "correct-horse" }).success).toBe(
      true,
    );
  });

  it("reports an invalid email and a short password", () => {
    const parsed = signInSchema.safeParse({ email: "not-an-email", password: "short" });
    expect(parsed.success).toBe(false);
    if (parsed.success) return;
    expect(authFieldErrors(parsed.error)).toEqual({
      email: "Enter a valid email address.",
      password: "Password must be at least 8 characters.",
    });
  });

  it("reports a password confirmation mismatch", () => {
    const parsed = signUpSchema.safeParse({
      email: "student@example.com",
      password: "correct-horse",
      confirmPassword: "other-horse",
    });
    expect(parsed.success).toBe(false);
    if (parsed.success) return;
    expect(authFieldErrors(parsed.error).confirmPassword).toBe("Passwords do not match.");
  });
});

describe("auth error mapping", () => {
  it("asks unconfirmed users to confirm their email", () => {
    expect(mapSignInError("Email not confirmed")).toBe("Confirm your email before signing in.");
  });

  it("uses one message for a bad password", () => {
    expect(mapSignInError("Invalid login credentials")).toBe("Email or password is incorrect.");
  });

  it("maps duplicate accounts and weak passwords on sign-up", () => {
    expect(mapSignUpError("User already registered")).toBe(
      "An account with that email already exists. Sign in instead.",
    );
    expect(mapSignUpError("Password should be at least 6 characters")).toBe(
      "Password does not meet the account requirements.",
    );
    expect(mapSignUpError("upstream timeout")).toBe("Could not create the account. Try again.");
  });

  it("classifies confirmation, duplicate, and signed-in sign-up responses", () => {
    expect(classifySignUp({ user: { identities: [] }, session: null })).toBe("duplicate");
    expect(classifySignUp({ user: { identities: [{ id: "1" }] }, session: null })).toBe(
      "needs_confirmation",
    );
    expect(classifySignUp({ user: { identities: [{ id: "1" }] }, session: { access_token: "t" } })).toBe(
      "signed_in",
    );
  });

  it("names the missing-configuration error", () => {
    expect(AUTH_NOT_CONFIGURED).toBe("Authentication is not configured.");
  });
});
