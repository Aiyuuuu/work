import { NextRequest, NextResponse } from "next/server";
import { getRawCookieHeaderFromRequest } from "@/lib/auth/cookies";
import { SUCCESS_STATUS } from "@/constants/apiConstants";
import { REFRESH_TOKEN_URL } from "@/constants/routeConstants";

/**
 * Attempts to silently rotate access/refresh tokens via an internal API loopback.
 * If successful, returns a NextResponse that preserves the current request context.
 * If it fails, returns null, letting the proxy fall through to redirection.
 */
export async function handleSilentRefresh(
  request: NextRequest,
): Promise<NextResponse | null> {
  try {
    const rawCookieHeader = getRawCookieHeaderFromRequest(request);

    if (!rawCookieHeader) return null;

    // 1. Make the internal loopback fetch
    const refreshResponse = await fetch(
      new URL(REFRESH_TOKEN_URL, request.url),
      {
        method: "POST",
        headers: {
          Cookie: rawCookieHeader,
        },
      },
    );

    if (refreshResponse.status !== SUCCESS_STATUS.POST) {
      return null;
    }

    // 2. Wrap standard Response into a NextResponse
    const nextRefreshResponse = new NextResponse(
      refreshResponse.body,
      refreshResponse,
    );
    const newCookies = nextRefreshResponse.cookies.getAll();

    if (newCookies.length === 0) return null;

    // 3. Inject new tokens into request cookies so Server Components can read them instantly
    for (const cookie of newCookies) {
      request.cookies.set({
        name: cookie.name,
        value: cookie.value,
      });
    }

    // 4. Create the next response with cloned request headers
    const response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    // 5. Inject new tokens into response cookies so the browser saves them
    for (const cookie of newCookies) {
      response.cookies.set(cookie);
    }

    return response;
  } catch (err) {
    console.error("Silent token refresh failed:", err);
    return null;
  }
}
