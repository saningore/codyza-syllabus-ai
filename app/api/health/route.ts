import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "syllabusai",
    architecture: "modular-monolith",
    implemented: ["health"],
  });
}
