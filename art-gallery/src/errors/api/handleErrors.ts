import { NextResponse } from "next/server";
import { AuthError } from "@/errors/services/authErrors";
import { MediaError } from "@/errors/services/mediaError";

export function handleApiError(err: unknown): NextResponse {
  if (err instanceof AuthError || err instanceof MediaError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: err.code,
          message: err.message,
        },
      },
      {
        status: err.status,
      },
    );
  }

  console.error(err);

  return NextResponse.json(
    {
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Internal server error",
      },
    },
    {
      status: 500,
    },
  );
}