import { NextRequest, NextResponse } from "next/server";
import {
  getRawCookieHeaderFromRequest,
  getAccessTokenFromResponse,
  setCookieOnRequest,
} from "@/lib/auth/cookies";
import { SUCCESS_STATUS } from "@/constants/apiConstants";
import { REFRESH_TOKEN_URL } from "@/constants/routeConstants";
import { verifyAccessToken } from "./lib/auth/signOrVerifyTokens";

/*
 * designed to work for router level access token expiry/missing. API level token refresh is out of scope of this file.
 * Attempts to silently refresh the tokens via an internal API loopback.
 * Context:
 * https://nextjs.org/docs/app/api-reference/functions/next-response
 * what is a NextResponse.next() object?: An object that contains two things:
 * 1) an empty response container that will be later filled by the application code with the requested resource and then
 *    sent back to the client.
 * 2) the "request" object(the request the user made) and its headers(that can be mutated using { request: { headers } } parameter)
 *    that are being forwarded to the application code.
 *
 * When the refresh succeeds:
 * The proxy returns this object, Next.js will allow the request to pass and then fill this container with the resource requested by the client
 * and then respond to the client this exact filled container with our Set-Cookies header still attached.
 *
 * When it fails: returns null, letting the proxy fall through to redirection.
 */

export async function handleSilentRefresh(
  request: NextRequest, // gets the rqeuest object as sent by the client
): Promise<NextResponse | null> {
  //returns the custom NextResponse with mutated NextResponse.next object if refresh succeeds else null
  try {
    // get the raw cookie header from the request
    const rawCookieHeader = getRawCookieHeaderFromRequest(request);

    // safety (will probably never trigger since proxy already checks this when getting tokens)
    if (!rawCookieHeader) return null;

    // Make the internal loopback fetch to the refresh API POST endpoint
    const refreshApiResponse = await fetch(
      new URL(REFRESH_TOKEN_URL, request.url), //creates a new URL using the base request.url and appends the refresh endpoint URL
      {
        method: "POST",
        headers: {
          Cookie: rawCookieHeader, //appends the original cookies that were taken from the client's request
        },
      },
    );

    //if unsuccessful, return null
    if (refreshApiResponse.status !== SUCCESS_STATUS.POST) {
      return null;
    }

    // if successful, we initialize the new NextResponse object using the response object from the refresh API call.
    // we do this so it's simpler to work with the cookies, headers etc.
    const nextRefreshResponse = new NextResponse( //new NextResponse(body, options) is the initialization syntax
      refreshApiResponse.body,
      refreshApiResponse,
    );

    // extract the new cookies containing the new refreshed tokens from the refresh API response.
    // the NextResponse.cookies.getAll() function: parses all the "Set-Cookie"
    // headers and stores them in a "cookies" object then returns all the cookies as objects in an array.
    const newCookies = nextRefreshResponse.cookies.getAll();

    //somehow if the API returnss success but still no Set-Cookie header (API error)
    if (newCookies.length === 0) return null;

    // get the access token from the response (from the Set-Cookie header)
    const accessTokenString = getAccessTokenFromResponse(nextRefreshResponse);

    // if access token absent from the API response's Set-Cookie headers
    if (!accessTokenString) return null;

    // now check if the new access token is valid
    const verifiedAccessTokenData = accessTokenString
      ? await verifyAccessToken(accessTokenString)
      : null;

    const isAccessTokenVerified = !!verifiedAccessTokenData;

    // return null if the new access token is invalid
    if (!isAccessTokenVerified) return null;

    // In the original client's request object: Replace the original cookies with the new cookies
    // so the server can immediately see the new cookies on the same request.
    for (const cookie of newCookies) {
      setCookieOnRequest(request, cookie);
    }

    // Create the NextResponse container with the new request headers containing new cookies explicitly passed
    // or else it will use the old headers from the request object (preferes unmutated request)
    const response = NextResponse.next({
      //when it takes the request along into the application, swap the original request headers with the new request headers (changed cookies).
      request: {
        headers: request.headers,
      },
    });

    // Inject new cookies into above created NextResponse container's cookies so the client saves them upon getting the response.
    // it adds Set-Cookie headers into the response object which will be sent back to the client.
    for (const cookie of newCookies) {
      response.cookies.set(cookie);
    }
    //return the NextResponse on success
    return response;
  } catch (err) {
    console.error("Silent token refresh failed:", err);
    return null;
  }
}
