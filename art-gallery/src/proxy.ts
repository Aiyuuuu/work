import { NextRequest, NextResponse } from "next/server";
import {
  getAccessTokenFromRequest,
  getRefreshTokenFromRequest,
} from "@/lib/auth/cookies";
import { isProtectedRoute, isApiRoute } from "@/utils/routes/routes";
import { verifyAccessToken } from "@/lib/auth/signOrVerifyTokens";
import {
  PROTECTED_ROUTES,
  PUBLIC_REDIRECT_ROUTE,
} from "./constants/routeConstants";
import { errorResponse } from "@/app/api/_response";
import { handleSilentRefresh } from "./_proxy_silentRefresh";

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const pathname = request.nextUrl.pathname; //extract the pathname from the request
  const url = request.nextUrl.clone(); //clone the url object from the nextUrl
  const isProtectedRouteBool = isProtectedRoute(pathname);
  const isApiRouteBool = isApiRoute(pathname);
  const accessTokenString = getAccessTokenFromRequest(request);
  const refreshTokenString = getRefreshTokenFromRequest(request);
  const isAccessTokenPresent = !!accessTokenString;
  const isRefreshTokenPresent = !!refreshTokenString;
  const verifiedAccessTokenData = accessTokenString
    ? await verifyAccessToken(accessTokenString)
    : null;
  const isAccessTokenVerified = !!verifiedAccessTokenData;

  // api route firewall .............................................................
  if (isApiRouteBool) {
    if (isProtectedRouteBool) {
      if (!isAccessTokenPresent) {
        return NextResponse.json(...errorResponse("ACCESS_TOKEN_MISSING"));
      }
      if (!isAccessTokenVerified) {
        return NextResponse.json(...errorResponse("ACCESS_TOKEN_INVALID"));
      }
      return NextResponse.next();
    } else {
      if (isAccessTokenVerified) {
        return NextResponse.json(...errorResponse("FORBIDDEN"));
      }
      return NextResponse.next();
    }
  }
  //...........................................................................

  // router checks...............................................................

  // try to refresh access token internally
  if (isRefreshTokenPresent && !isAccessTokenVerified && !isApiRouteBool) {
    const refreshResponse = await handleSilentRefresh(request);

    // If the internal refresh succeeded, return the response immediately
    if (refreshResponse) {
      return refreshResponse;
    }
  }

  // Handle root path redirect based on access token validity
  if (pathname === "/") {
    if (isAccessTokenVerified) {
      url.pathname = PROTECTED_ROUTES[0];
      return NextResponse.redirect(url); //redirect to firt entry of protected routes (usually /home)
    }
    url.pathname = PUBLIC_REDIRECT_ROUTE;
    return NextResponse.redirect(url); //redirect to first entry of public routes (usually /landing)
  }

  //redirect away from public routes if access token valid
  if (!isProtectedRouteBool && isAccessTokenVerified) {
    url.pathname = PROTECTED_ROUTES[0];
    return NextResponse.redirect(url);
  }

  //redirect away from protected routes if invalid session
  if (isProtectedRouteBool && !isAccessTokenVerified) {
    url.pathname = PUBLIC_REDIRECT_ROUTE;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// ...............................................................................

export const config = {
  matcher: [
    "/((?!_next/data|_next/static|_next/image|_next/fonts|_next/fallback|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)",
  ], //match all paths EXCEPT these
};
