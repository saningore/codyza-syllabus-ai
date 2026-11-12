import { describe, expect, it } from "vitest";
import {
  isProtectedPath,
  safeNextPath,
  sessionGate,
  signInRedirect,
} from "@/shared/auth/paths";

describe("protected paths", () => {
  it("matches app routes and their children", () => {
    expect(isProtectedPath("/dashboard")).toBe(true);
    expect(isProtectedPath("/courses/course-1/upload")).toBe(true);
    expect(isProtectedPath("/settings")).toBe(true);
  });

  it("leaves public routes and lookalikes open", () => {
    expect(isProtectedPath("/")).toBe(false);
    expect(isProtectedPath("/auth/sign-in")).toBe(false);
    expect(isProtectedPath("/auth/callback")).toBe(false);
    expect(isProtectedPath("/api/health")).toBe(false);
    expect(isProtectedPath("/api/semesters")).toBe(false);
    expect(isProtectedPath("/dashboarding")).toBe(false);
  });
});

describe("safeNextPath", () => {
  it("keeps same-origin paths", () => {
    expect(safeNextPath("/settings")).toBe("/settings");
    expect(safeNextPath("/semesters/abc?tab=courses")).toBe("/semesters/abc?tab=courses");
  });

  it("rejects off-site and malformed targets", () => {
    expect(safeNextPath(null)).toBe("/dashboard");
    expect(safeNextPath("https://evil.test")).toBe("/dashboard");
    expect(safeNextPath("//evil.test")).toBe("/dashboard");
    expect(safeNextPath("/\\evil.test")).toBe("/dashboard");
    expect(safeNextPath("/%2F%2Fevil.test")).toBe("/dashboard");
    expect(safeNextPath("/dashboard/../../evil")).toBe("/dashboard");
    expect(safeNextPath("/settings%00")).toBe("/dashboard");
  });
});

describe("session gate", () => {
  it("sends anonymous visitors on protected pages to sign-in", () => {
    expect(sessionGate({ pathname: "/dashboard", search: "", signedIn: false })).toEqual({
      type: "redirect",
      location: "/auth/sign-in?next=%2Fdashboard",
    });
    expect(sessionGate({ pathname: "/settings", search: "?tab=profile", signedIn: false })).toEqual({
      type: "redirect",
      location: "/auth/sign-in?next=%2Fsettings%3Ftab%3Dprofile",
    });
  });

  it("allows anonymous visitors on public pages", () => {
    expect(sessionGate({ pathname: "/", search: "", signedIn: false })).toEqual({ type: "continue" });
    expect(sessionGate({ pathname: "/auth/sign-in", search: "", signedIn: false })).toEqual({
      type: "continue",
    });
    expect(sessionGate({ pathname: "/api/health", search: "", signedIn: false })).toEqual({
      type: "continue",
    });
  });

  it("sends a signed-in visitor away from the auth forms", () => {
    expect(sessionGate({ pathname: "/auth/sign-in", search: "?next=/settings", signedIn: true })).toEqual({
      type: "redirect",
      location: "/settings",
    });
    expect(sessionGate({ pathname: "/auth/sign-up", search: "", signedIn: true })).toEqual({
      type: "redirect",
      location: "/dashboard",
    });
    expect(
      sessionGate({ pathname: "/auth/sign-in", search: "?next=https://evil.test", signedIn: true }),
    ).toEqual({
      type: "redirect",
      location: "/dashboard",
    });
  });

  it("builds the sign-in return path for a protected route", () => {
    expect(signInRedirect("/review")).toBe("/auth/sign-in?next=%2Freview");
  });
});
