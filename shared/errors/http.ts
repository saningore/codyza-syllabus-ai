import { NextResponse } from "next/server";
import { AppError, apiErrorBody } from "./index";

export function jsonError(error: unknown) {
  if (error instanceof AppError) {
    return NextResponse.json(apiErrorBody(error), { status: error.status });
  }

  console.error(error);
  return NextResponse.json(
    apiErrorBody({ code: "INTERNAL", message: "Unexpected server error." }),
    { status: 500 },
  );
}

export function notImplemented(feature: string) {
  return NextResponse.json(
    apiErrorBody({
      code: "NOT_IMPLEMENTED",
      message: `${feature} is not implemented yet.`,
    }),
    { status: 501 },
  );
}
