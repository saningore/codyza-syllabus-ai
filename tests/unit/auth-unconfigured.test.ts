import { afterEach, describe, expect, it } from "vitest";
import { signInWithEmail, signUpWithEmail } from "@/modules/identity";

const originalUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const originalKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

afterEach(() => {
  restore("NEXT_PUBLIC_SUPABASE_URL", originalUrl);
  restore("NEXT_PUBLIC_SUPABASE_ANON_KEY", originalKey);
});

describe("auth without Supabase config", () => {
  it("stops before calling Supabase when the public env is missing", async () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    await expect(
      signInWithEmail({ email: "student@example.com", password: "correct-horse" }),
    ).resolves.toEqual({
      ok: false,
      error: "Authentication is not configured.",
    });

    await expect(
      signUpWithEmail(
        {
          email: "student@example.com",
          password: "correct-horse",
          confirmPassword: "correct-horse",
        },
        "http://localhost:3000",
      ),
    ).resolves.toEqual({
      ok: false,
      error: "Authentication is not configured.",
    });
  });
});

function restore(name: "NEXT_PUBLIC_SUPABASE_URL" | "NEXT_PUBLIC_SUPABASE_ANON_KEY", value: string | undefined) {
  if (value === undefined) delete process.env[name];
  else process.env[name] = value;
}
