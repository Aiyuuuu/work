const AUTH_ERRORS = {
  MISSING_CREDENTIALS: {
    status: 400,
    message: "Missing credentials",
  },
  INVALID_CREDENTIALS: {
    status: 401,
    message: "Invalid email or password",
  },
  ACCESS_TOKEN_EXPIRED: {
    status: 401,
    message: "Access token expired",
  },
  ACCESS_TOKEN_INVALID: {
    status: 401,
    message: "Invalid access token",
  },
  REFRESH_TOKEN_INVALID: {
    status: 401,
    message: "Refresh token invalid",
  },
  REFRESH_TOKEN_MISSING: {
    status: 400,
    message: "Refresh token missing",
  },
  USER_ALREADY_EXISTS: {
    status: 409,
    message: "User already exists"
  },
  UNAUTHORIZED: {
    status: 401,
    message: "Unauthorized",
  },
  FORBIDDEN: {
    status: 403,
    message: "Forbidden",
  },
  BAD_REQUEST: {
    status: 400,
    message: "Bad request"
  },
  INTERNAL_SERVER_ERROR: {
    status: 500,
    message: "Internal server error",
  },
} as const;

export type AuthErrorCode = keyof typeof AUTH_ERRORS;

export class AuthError extends Error {
  constructor(public readonly code: AuthErrorCode) {
    super(AUTH_ERRORS[code].message);
  }

  get status() {
    return AUTH_ERRORS[this.code].status;
  }
}
