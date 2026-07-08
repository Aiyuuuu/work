import { NextRequest, NextResponse } from "next/server";
// this file does not interact with the db

//import constants
import {
  AUTH_COOKIE_NAME,
  REFRESH_COOKIE_NAME,
  COOKIES_HTTP_ONLY,
  COOKIES_SAME_SITE,
  COOKIES_AUTH_COOKIE_MAX_AGE,
  COOKIES_REFRESH_COOKIE_MAX_AGE,
  COOKIES_SECURE,
} from "@/constants/authConstants";

//appends auth cookies to response
//set refresh and access token cookies on response
export function setAuthCookiesOnResponse(
  response: NextResponse,
  accessToken: string,
  refreshToken: string,
): void {
  response.cookies.set({
    //set access token cookie
    name: AUTH_COOKIE_NAME,
    value: accessToken,
    httpOnly: COOKIES_HTTP_ONLY,
    sameSite: COOKIES_SAME_SITE,
    path: "/",
    maxAge: COOKIES_AUTH_COOKIE_MAX_AGE,
    secure: COOKIES_SECURE, // true means cookies are sent over HTTPS only
  });

  response.cookies.set({
    //set refresh token cookie
    name: REFRESH_COOKIE_NAME,
    value: refreshToken,
    httpOnly: COOKIES_HTTP_ONLY,
    sameSite: COOKIES_SAME_SITE,
    path: "/",
    maxAge: COOKIES_REFRESH_COOKIE_MAX_AGE,
    secure: COOKIES_SECURE,
  });
}

export function clearAuthCookiesOnResponse(response: NextResponse): void {
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: "",
    httpOnly: COOKIES_HTTP_ONLY,
    sameSite: COOKIES_SAME_SITE,
    path: "/",
    maxAge: 0,
    secure: COOKIES_SECURE,
  });

  response.cookies.set({
    name: REFRESH_COOKIE_NAME,
    value: "",
    httpOnly: COOKIES_HTTP_ONLY,
    sameSite: COOKIES_SAME_SITE,
    path: "/",
    maxAge: 0,
    secure: COOKIES_SECURE,
  });
}

export function getAccessTokenFromRequest(request: NextRequest): string | null {
  return request.cookies.get(AUTH_COOKIE_NAME)?.value ?? null;
}

//only checks the PRESENCE of access token
export function isAccessTokenPresentOnRequest(request: NextRequest): boolean {
  return request.cookies.has(AUTH_COOKIE_NAME);
}

export function getRefreshTokenFromRequest(
  request: NextRequest,
): string | null {
  return request.cookies.get(REFRESH_COOKIE_NAME)?.value ?? null;
}

//only checks the PRESENCE of refresh token
export function isRefreshTokenPresentOnRequest(request: NextRequest): boolean {
  return request.cookies.has(REFRESH_COOKIE_NAME);
}

export function getRawCookieHeaderFromRequest(
  request: NextRequest,
): string | null {
  return request.headers.get("cookie") ?? null;
}

export function getRawSetCookieHeaderFromResponse(
  response: NextResponse,
): string[] | null {
  return response.headers.getSetCookie() ?? null;
}
