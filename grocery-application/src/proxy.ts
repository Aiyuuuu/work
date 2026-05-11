import { NextResponse, type NextRequest } from "next/server";
import {
  AUTH_COOKIE_NAME,
  REFRESH_COOKIE_NAME,
  setAuthCookies,
  verifyAccessToken,
  type UserRole,
} from "@/utils/auth/auth";


type RoleConfig = {
  pathPrefix: string;
  allowedRoles: UserRole[];
};

const protectedRoutes: RoleConfig[] = [
  { pathPrefix: "/catalog", allowedRoles: ["user", "admin"] },
  { pathPrefix: "/cart", allowedRoles: ["user", "admin"] },
  { pathPrefix: "/items", allowedRoles: ["user", "admin"] },
  { pathPrefix: "/admin", allowedRoles: ["admin"] },
];

function isProtectedPath(pathname: string): RoleConfig | null {
  return protectedRoutes.find((entry) => pathname.startsWith(entry.pathPrefix)) ?? null;
}

type RefreshResponse = {
  data?: {
    accessToken?: string;
    refreshToken?: string;
    role?: UserRole;
  };
};

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const routeConfig = isProtectedPath(pathname);

  if (!routeConfig) {
    return NextResponse.next();
  }

  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const refreshToken = request.cookies.get(REFRESH_COOKIE_NAME)?.value;
  let payload = token ? verifyAccessToken(token) : null;

  // Silent refresh path: use existing refresh endpoint before redirecting to /auth.
  if (!payload && refreshToken) {
    try {
      const refreshUrl = new URL("/api/auth/RefreshToken", request.url);
      const refreshRes = await fetch(refreshUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          cookie: request.headers.get("cookie") ?? "",
        },
        body: JSON.stringify({
          refreshToken,
          accessToken: token ?? "",
        }),
        cache: "no-store",
      });

      if (refreshRes.ok) {
        const refreshJson = (await refreshRes.json()) as RefreshResponse;
        const newAccessToken = refreshJson.data?.accessToken;
        const newRefreshToken = refreshJson.data?.refreshToken;

        if (newAccessToken && newRefreshToken) {
          const refreshedPayload = verifyAccessToken(newAccessToken);
          if (refreshedPayload) {
            payload = refreshedPayload;
            const response = NextResponse.next();
            setAuthCookies(
              response,
              { email: refreshedPayload.email, role: refreshedPayload.role },
              newAccessToken,
              newRefreshToken
            );
            if (!routeConfig.allowedRoles.includes(refreshedPayload.role)) {
              return NextResponse.redirect(new URL("/auth", request.url));
            }
            return response;
          }
        }
      }
    } catch {
      // If refresh call fails, fall through to /auth redirect.
    }
  }

  if (!payload) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  if (!routeConfig.allowedRoles.includes(payload.role)) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/cart","/catalog", "/items/:path*", "/admin/:path*"],
};
