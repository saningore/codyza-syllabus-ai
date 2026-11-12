import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/supabase/server", () => ({
  getServerSupabase: vi.fn(),
}));

import { getServerSupabase } from "@/lib/supabase/server";
import { getOptionalUser, requireUser } from "@/shared/auth/require-user";

const getServerSupabaseMock = vi.mocked(getServerSupabase);

describe("requireUser", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key";
    getServerSupabaseMock.mockReset();
  });

  it("returns the authenticated account", async () => {
    getServerSupabaseMock.mockResolvedValue({
      auth: {
        getUser: async () => ({
          data: { user: { id: "user-a", email: "a@example.com" } },
          error: null,
        }),
      },
    } as never);

    await expect(requireUser()).resolves.toEqual({ id: "user-a", email: "a@example.com" });
  });

  it("throws 401 when the session is missing", async () => {
    getServerSupabaseMock.mockResolvedValue({
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
      },
    } as never);

    await expect(requireUser()).rejects.toMatchObject({
      code: "UNAUTHENTICATED",
      status: 401,
    });
  });

  it("returns null from getOptionalUser when the session is missing", async () => {
    getServerSupabaseMock.mockResolvedValue({
      auth: {
        getUser: async () => ({ data: { user: null }, error: { message: "no session" } }),
      },
    } as never);

    await expect(getOptionalUser()).resolves.toBeNull();
  });
});
