import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const getUser = vi.fn();

vi.mock("@supabase/ssr", () => ({
  createServerClient: vi.fn(() => ({
    auth: { getUser },
  })),
}));

import { createServerClient } from "@supabase/ssr";
import { updateSession } from "@/lib/supabase/middleware";

const createServerClientMock = vi.mocked(createServerClient);

function request(path: string) {
  return new NextRequest(new URL(path, "http://localhost:3000"));
}

describe("updateSession", () => {
  beforeEach(() => {
    getUser.mockReset();
    createServerClientMock.mockClear();
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  });

  it("redirects protected pages when Supabase is not configured", async () => {
    const response = await updateSession(request("/dashboard"));
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "http://localhost:3000/auth/sign-in?next=%2Fdashboard",
    );
    expect(createServerClientMock).not.toHaveBeenCalled();
  });

  it("leaves the health check public when Supabase is not configured", async () => {
    const response = await updateSession(request("/api/health"));
    expect(response.status).toBe(200);
    expect(response.headers.get("location")).toBeNull();
  });

  it("redirects an anonymous session away from the dashboard", async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key";
    getUser.mockResolvedValue({ data: { user: null }, error: null });

    const response = await updateSession(request("/settings"));
    expect(response.headers.get("location")).toBe(
      "http://localhost:3000/auth/sign-in?next=%2Fsettings",
    );
  });

  it("allows an authenticated session onto the dashboard", async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key";
    getUser.mockResolvedValue({
      data: { user: { id: "user-b", email: "b@example.com" } },
      error: null,
    });

    const response = await updateSession(request("/dashboard"));
    expect(response.status).toBe(200);
    expect(response.headers.get("location")).toBeNull();
    expect(response.headers.get("x-middleware-request-x-pathname")).toBe("/dashboard");
  });

  it("sends an authenticated session from sign-in back to the requested page", async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key";
    getUser.mockResolvedValue({
      data: { user: { id: "user-b", email: "b@example.com" } },
      error: null,
    });

    const response = await updateSession(request("/auth/sign-in?next=/calendar"));
    expect(response.headers.get("location")).toBe("http://localhost:3000/calendar");
  });
});
