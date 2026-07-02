import { NextRequest, NextResponse } from "next/server";
import {
  isAccessTokenPresentOnRequest,
  isUserObjectPresentOnRequest,
} from "@/lib/auth/cookies";
import {
  isAdminRoute,
  isProtectedRoute,
  isAuthRoute,
} from "@/utils/routes/routes";
import { PROTECTED_ROUTES, PUBLIC_ROUTES } from "./constants/routeConstants";

export default function proxy(request: NextRequest): NextResponse {
  const pathname = request.nextUrl.pathname; //extract the pathname from the request
  const url = request.nextUrl.clone(); //clone the url object from the nextUrl
  const isSessionPresent =
    isAccessTokenPresentOnRequest(request) &&
    isUserObjectPresentOnRequest(request);

  // Handle root path redirect based on access token and user object presence
  if (pathname === "/") {
    if (isSessionPresent) {
      url.pathname = PROTECTED_ROUTES[0];
      return NextResponse.redirect(url); //redirect to firt entry of protected routes (usually /home)
    }
    url.pathname = PUBLIC_ROUTES[0];
    return NextResponse.redirect(url); //redirect to first entry of public routes (usually /landing)
  }

  //redirect away from auth routes if access token and user object present
  if (isAuthRoute(pathname) && isSessionPresent) {
    url.pathname = PROTECTED_ROUTES[0];
    return NextResponse.redirect(url); //redirect to firt entry of protected routes (usually /home)
  }

  //redirect away from admin and protected routes if access token or user object absent
  if (
    (isProtectedRoute(pathname) || isAdminRoute(pathname)) &&
    !isSessionPresent
  ) {
    url.pathname = PUBLIC_ROUTES[0];
    return NextResponse.redirect(url); //redirect to first entry of public routes (usually /landing)
  }

  return NextResponse.next();
}


export const config = {
  matcher: [
    "/((?!api|_next/data|_next/static|_next/image|_next/fonts|_next/fallback|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)",
  ], //match all paths EXCEPT these
};
