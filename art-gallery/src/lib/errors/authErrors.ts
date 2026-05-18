export type AuthErrorCode =
  | "MISSING_CREDENTIALS"
  | "INVALID_CREDENTIALS"
  | "USER_EXISTS"
  | "MISSING_REFRESH_TOKEN"
  | "INVALID_REFRESH_TOKEN"
  | "MISSING_USER_ID"
  | "MISSING_ACCESS_TOKEN"
  | "INVALID_ACCESS_TOKEN"
  | "INVALID_USER";

export class AuthError extends Error {
  status: number;
  code: AuthErrorCode;

  constructor(code: AuthErrorCode, message: string, status: number) {
    super(message);
    this.name = "AuthError";
    this.code = code;
    this.status = status;
  }
}

export function getAuthErrorResponse(error: unknown): {
  status: number;
  body: { error: string; code?: AuthErrorCode };
} {
  if (error instanceof AuthError) {
    return {
      status: error.status,
      body: { error: error.message, code: error.code },
    };
  }

  const message = error instanceof Error ? error.message : "Unknown error";
  return {
    status: 500,
    body: { error: message },
  };
}
