const MEDIA_ERRORS = {
  ACCESS_TOKEN_EXPIRED: {
    status: 401,
    message: "Access token expired",
  },
  ACCESS_TOKEN_INVALID: {
    status: 401,
    message: "Invalid access token",
  },
  ALREADY_EXISTS: {
    status: 409,
    message: "Media already exists"
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
  NOT_FOUND: {
    status: 404,
    message: "The requested resource was not found"
  },
  INTERNAL_SERVER_ERROR: {
    status: 500,
    message: "Internal server error",
  },
} as const;

export type MediaErrorCode = keyof typeof MEDIA_ERRORS;

export class MediaError extends Error {
  constructor(public readonly code: MediaErrorCode) {
    super(MEDIA_ERRORS[code].message);
  }

  get status() {
    return MEDIA_ERRORS[this.code].status;
  }
}
