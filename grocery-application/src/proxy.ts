import { NextResponse, type NextRequest } from "next/server";
import { AUTH_COOKIE_NAME, verifyAccessToken, type UserRole } from "@/utils/auth/auth";

type RoleConfig = {
  pathPrefix: string;
  allowedRoles: UserRole[];
};

const protectedRoutes: RoleConfig[] = [
  { pathPrefix: "/", allowedRoles: ["user", "admin"] },
  { pathPrefix: "/cart", allowedRoles: ["user", "admin"] },
  { pathPrefix: "/items", allowedRoles: ["user", "admin"] },
  { pathPrefix: "/admin", allowedRoles: ["admin"] },
];

function isProtectedPath(pathname: string): RoleConfig | null {
  if (pathname === "/") {
    return protectedRoutes[0];
  }

  return protectedRoutes.find((entry) => pathname.startsWith(entry.pathPrefix)) ?? null;
}

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const routeConfig = isProtectedPath(pathname);

  if (!routeConfig) {
    return NextResponse.next();
  }

  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  const payload = verifyAccessToken(token);
  if (!payload) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  if (!routeConfig.allowedRoles.includes(payload.role)) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/cart", "/items/:path*", "/admin/:path*"],
};
