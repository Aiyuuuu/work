import { NextRequest, NextResponse } from "next/server";
// this file does not interact with the db

//import constants
import {
  AUTH_COOKIE_NAME,
  REFRESH_COOKIE_NAME,
  USER_OBJECT_COOKIE_NAME,
  COOKIES_HTTP_ONLY,
  COOKIES_SAME_SITE,
  COOKIES_AUTH_COOKIE_MAX_AGE,
  COOKIES_REFRESH_COOKIE_MAX_AGE,
  COOKIES_USER_OBJECT_MAX_AGE,
  COOKIES_SECURE
} from "@/constants/authConstants";

import type { UserObject } from "@/types/lib";

//appends auth cookies to response
export function setAuthCookiesOnResponse(
  response: NextResponse,
  userObject: UserObject,
  accessToken: string,
  refreshToken: string,
): void {
  setTokenCookiesOnResponse(response, accessToken, refreshToken);
  response.cookies.set({ // set user object cookie
    name: USER_OBJECT_COOKIE_NAME,
    value: JSON.stringify({
      sub: userObject.sub,
      username: userObject.username,
      email: userObject.email,
      role: userObject.role,
    }),
    httpOnly: false,
    sameSite: COOKIES_SAME_SITE,
    path: "/",
    maxAge: COOKIES_USER_OBJECT_MAX_AGE,
    secure: COOKIES_SECURE
  });
}




//set refresh and access token cookies on response
export function setTokenCookiesOnResponse(
  response: NextResponse,
  accessToken: string,
  refreshToken: string,
): void {
  response.cookies.set({ //set access token cookie
    name: AUTH_COOKIE_NAME,
    value: accessToken,
    httpOnly: COOKIES_HTTP_ONLY,
    sameSite: COOKIES_SAME_SITE,
    path: "/",
    maxAge: COOKIES_AUTH_COOKIE_MAX_AGE,
    secure: COOKIES_SECURE // true means cookies are sent over HTTPS only
  });

  response.cookies.set({ //set refresh token cookie
    name: REFRESH_COOKIE_NAME,
    value: refreshToken,
    httpOnly: COOKIES_HTTP_ONLY,
    sameSite: COOKIES_SAME_SITE,
    path: "/",
    maxAge: COOKIES_REFRESH_COOKIE_MAX_AGE,
    secure: COOKIES_SECURE
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
    secure: COOKIES_SECURE
  });

  response.cookies.set({
    name: REFRESH_COOKIE_NAME,
    value: "",
    httpOnly: COOKIES_HTTP_ONLY,
    sameSite: COOKIES_SAME_SITE,
    path: "/",
    maxAge: 0,
    secure: COOKIES_SECURE
  });

  response.cookies.set({
    name: USER_OBJECT_COOKIE_NAME,
    value: "",
    sameSite: COOKIES_SAME_SITE,
    httpOnly: COOKIES_HTTP_ONLY,
    path: "/",
    maxAge: 0,
    secure: COOKIES_SECURE
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

export function getUserObjectFromRequest(
  request: NextRequest,
): UserObject | null {
  const userObjStr = request.cookies.get(USER_OBJECT_COOKIE_NAME)?.value;

  if (!userObjStr) return null;

  try {
    return JSON.parse(userObjStr) as UserObject;
  } catch (err) {
    console.error("Failed to parse user object cookie into JSON", err);
    return null;
  }
}

// only checks the PRESENCE of user object
// commented out because we probably don't need this function
export function isUserObjectPresentOnRequest(request: NextRequest): boolean { 
  return request.cookies.has(USER_OBJECT_COOKIE_NAME);
}
