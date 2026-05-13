import { NextRequest, NextResponse } from "next/server";

import {
    AUTH_COOKIE_NAME,
    REFRESH_COOKIE_NAME,
    USER_OBJECT_COOKIE_NAME,
    COOKIES_HTTP_ONLY,
    COOKIES_SAME_SITE,
    COOKIES_AUTH_COOKIE_MAX_AGE,
    COOKIES_REFRESH_COOKIE_MAX_AGE,
    COOKIES_USER_OBJECT_MAX_AGE,
} from "@/constants/authConstants";

import type { UserObject } from "@/types/auth/tokenAndUserSession";


export function setAuthCookies(
    response: NextResponse,
    userObject: UserObject,
    accessToken: string,
    refreshToken: string
): void {
        response.cookies.set({
            name: AUTH_COOKIE_NAME,
            value: accessToken,
            httpOnly: COOKIES_HTTP_ONLY,
            sameSite: COOKIES_SAME_SITE,
            path: "/",
            maxAge: COOKIES_AUTH_COOKIE_MAX_AGE,
        });

        response.cookies.set({
            name: REFRESH_COOKIE_NAME,
            value: refreshToken,
            httpOnly: COOKIES_HTTP_ONLY,
            sameSite: COOKIES_SAME_SITE,
            path: "/",
            maxAge: COOKIES_REFRESH_COOKIE_MAX_AGE,
        });

        response.cookies.set({
            name: USER_OBJECT_COOKIE_NAME,
            value: JSON.stringify({
                email: userObject.email,
                role: userObject.role,
            }),
            httpOnly: COOKIES_HTTP_ONLY,
            sameSite: COOKIES_SAME_SITE,
            path: "/",
            maxAge: COOKIES_USER_OBJECT_MAX_AGE,
        });
}



export function clearAuthCookies(response: NextResponse): void {
    response.cookies.set({
        name: AUTH_COOKIE_NAME,
        value: "",
        httpOnly: COOKIES_HTTP_ONLY,
        sameSite: COOKIES_SAME_SITE,
        path: "/",
        maxAge: 0,
    });

    response.cookies.set({
        name: REFRESH_COOKIE_NAME,
        value: "",
        httpOnly: COOKIES_HTTP_ONLY,
        sameSite: COOKIES_SAME_SITE,
        path: "/",
        maxAge: 0,
    });

    response.cookies.set({
        name: USER_OBJECT_COOKIE_NAME,
        value: "",
        sameSite: COOKIES_SAME_SITE,
        httpOnly: COOKIES_HTTP_ONLY,
        path: "/",
        maxAge: 0,
    });
}

export function getAccessTokenFromRequest(
  request: NextRequest
): string | null {
  return request.cookies.get(AUTH_COOKIE_NAME)?.value ?? null;
}

export function getRefreshTokenFromRequest(
    request: NextRequest
): string | null {
    return request.cookies.get(REFRESH_COOKIE_NAME)?.value ?? null;
}


export function getUserObjectFromRequest( request: NextRequest ): UserObject | null {
    const userObjStr = request.cookies.get(USER_OBJECT_COOKIE_NAME)?.value;

    if (!userObjStr) return null;

    try {
        return JSON.parse(userObjStr) as UserObject;
    } catch {
        return null;
    }
}