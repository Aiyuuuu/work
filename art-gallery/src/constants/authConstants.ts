export const SALT_ROUNDS: number = 10;

export const ACCESS_TOKEN_EXPIRY: string = "1m";
export const ACCESS_TOKEN_EXPIRY_MS: number = 1 * 60 * 1000; // 1m in milliseconds

export const REFRESH_TOKEN_EXPIRY_MS: number = 24 * 60 * 60 * 1000; //1 day in milliseconds
export const REFRESH_TOKEN_EXPIRY: string = "1d"

export const JWT_SIGNING_ALGORITHM: string = "HS256"

export const AUTH_COOKIE_NAME: string = "auth_token";

export const REFRESH_COOKIE_NAME: string = "refresh_token";

export const COOKIES_HTTP_ONLY: boolean = true;

export const COOKIES_SAME_SITE: "strict" | "lax" = "lax";

export const COOKIES_AUTH_COOKIE_MAX_AGE: number = 30*60; //30 minutes (deliberately more than auth token)

export const COOKIES_REFRESH_COOKIE_MAX_AGE: number = 60 * 60 * 24 * 7; //7 days (deliberately more than refresh token)


// export const COOKIES_SECURE:boolean = process.env.NODE_ENV === "production"; // only HTTPS in production
export const COOKIES_SECURE:boolean = false; // only HTTPS in production





