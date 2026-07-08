//used by both services and APIs

export const ERRORS = {
  // ── GENERAL SYSTEM ERRORS ──
  INTERNAL_SERVER_ERROR: {
    status: 500,
    message: "An unexpected error occurred on the server.",
  },
  DATABASE_ERROR: {
    status: 500,
    message: "A database error occurred while processing your request.",
  },
  RATE_LIMIT_EXCEEDED: {
    status: 429,
    message: "Too many requests. Please slow down and try again later.",
  },
  METHOD_NOT_ALLOWED: {
    status: 405,
    message: "The requested HTTP method is not supported for this endpoint.",
  },
  SERVICE_UNAVAILABLE: {
    status: 503,
    message: "The server is temporarily offline or undergoing maintenance.",
  },

  // ── VALIDATION & INPUT ERRORS ──
  BAD_REQUEST: {
    status: 400,
    message: "The request payload was malformed or missing parameters.",
  },
  VALIDATION_ERROR: {
    status: 400,
    message: "One or more fields failed validation checks.",
  },
  INVALID_OBJECT_ID: {
    status: 400,
    message: "The provided identifier is not a valid database reference.",
  },
  PAYLOAD_TOO_LARGE: {
    status: 413,
    message: "The request payload exceeds the maximum allowed transfer size.",
  },
  UNSUPPORTED_MEDIA_TYPE: {
    status: 415,
    message: "The uploaded file format is not supported by this server.",
  },

  // ── AUTHENTICATION & SESSION ERRORS ──
  MISSING_CREDENTIALS: {
    status: 400,
    message: "Missing credentials.",
  },
  INVALID_CREDENTIALS: {
    status: 401,
    message: "Invalid email or password.",
  },
  UNAUTHORIZED: {
    status: 401,
    message: "Authentication is required to access this resource.",
  },
  ACCESS_TOKEN_MISSING: {
    status: 400,
    message: "Access token is missing from the request.",
  },
  ACCESS_TOKEN_EXPIRED: {
    status: 401,
    message: "Your access token has expired.",
  },
  ACCESS_TOKEN_INVALID: {
    status: 401,
    message: "Your access token is invalid.",
  },
  REFRESH_TOKEN_MISSING: {
    status: 400,
    message: "Refresh token is missing from the request.",
  },
  REFRESH_TOKEN_INVALID: {
    status: 401,
    message: "Your session is invalid or has expired. Please log in again.",
  },
  SESSION_EXPIRED: {
    status: 401,
    message: "Your session has timed out due to inactivity.",
  },
  EMAIL_NOT_VERIFIED: {
    status: 403,
    message: "Your email address must be verified before proceeding.",
  },
  ACCOUNT_LOCKED: {
    status: 423,
    message: "Your account is temporarily locked due to too many failed login attempts.",
  },

  // ── AUTHORIZATION & RBAC ERRORS ──
  FORBIDDEN: {
    status: 403,
    message: "You do not have the required permissions to access this resource.",
  },
  ADMIN_REQUIRED: {
    status: 403,
    message: "Administrative privileges are required to perform this action.",
  },
  NOT_OWNER: {
    status: 403,
    message: "You cannot modify or delete resources owned by other users.",
  },
  // ── USER & PROFILE ERRORS ──
  USER_NOT_FOUND: {
    status: 404,
    message: "The requested user profile does not exist.",
  },
  USER_ALREADY_EXISTS: {
    status: 409,
    message: "A user account with this email is already registered.",
  },
  USERNAME_TAKEN: {
    status: 409,
    message: "This username is already taken by another user.",
  },
  WEAK_PASSWORD: {
    status: 400,
    message: "Password is too weak. It must be at least 8 characters and include letters and numbers.",
  },
  INVALID_AVATAR_URL: {
    status: 400,
    message: "The provided avatar image URL is invalid or inaccessible.",
  },

  // ── MEDIA & ART GALLERY ERRORS ──
  MEDIA_NOT_FOUND: {
    status: 404,
    message: "The requested artwork could not be found.",
  },
  MEDIA_UPLOAD_FAILED: {
    status: 500,
    message: "An error occurred while uploading your file to our media servers.",
  },
  MAX_UPLOAD_SIZE_EXCEEDED: {
    status: 413,
    message: "The uploaded image file size exceeds the maximum limit.",
  },
  INVALID_MEDIA_DIMENSIONS: {
    status: 400,
    message: "The image dimensions or aspect ratio are not supported.",
  },
  PROMPT_REJECTED: {
    status: 422,
    message: "The generation prompt was flagged and rejected by safety filters.",
  },
  GENERATION_TIMEOUT: {
    status: 504,
    message: "The AI generation engine took too long to respond. Please try again.",
  },
  GENERATION_FAILED: {
    status: 500,
    message: "The AI generation engine failed to compile your request.",
  },

  // ── SOCIAL & ENGAGEMENT ERRORS ──
  COMMENT_NOT_FOUND: {
    status: 404,
    message: "The requested comment does not exist.",
  },
  COMMENT_TOO_LONG: {
    status: 400,
    message: "Your comment exceeds the maximum allowed character limit.",
  },
  ALREADY_LIKED: {
    status: 409,
    message: "You have already liked this artwork.",
  },
  NOT_LIKED_YET: {
    status: 400,
    message: "You cannot unlike an item you have not liked yet.",
  },
  INVALID_REACTION_TYPE: {
    status: 400,
    message: "The specified reaction type is not supported.",
  },
} as const;

