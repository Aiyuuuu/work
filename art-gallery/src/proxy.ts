import { NextRequest, NextResponse } from "next/server";
import { getAccessTokenFromRequest } from "@/lib/auth/cookies";
import { verifyAccessToken } from "@/lib/auth/signOrVerifyTokens";
import {
	isAdminRoute,
	isUnauthenticatedRoute,
	isApiPath,
} from "@/utils/routes/routes";

//send unauthorized error
function unauthorizedResponse(request: NextRequest): NextResponse {
	if (isApiPath(request.nextUrl.pathname)) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
	return NextResponse.redirect(new URL("/auth", request.url));
}

//send forbidden error
function forbiddenResponse(request: NextRequest): NextResponse {
	if (isApiPath(request.nextUrl.pathname)) {
		return NextResponse.json({ error: "Forbidden" }, { status: 403 });
	}
	return NextResponse.redirect(new URL("/", request.url));
}

// Verify token and return payload or null
async function verifyToken(request: NextRequest) {
	const token = getAccessTokenFromRequest(request);
	if (!token) return null;
	return await verifyAccessToken(token);
}

// Enforce auth and RBAC for protected routes.
export async function proxy(request: NextRequest): Promise<NextResponse> {
	const { pathname } = request.nextUrl;
	
	 if (pathname.includes(".")) {
    return NextResponse.next();
  }
  
	// Handle root path redirect based on token status
	if (pathname === "/") {
		const payload = await verifyToken(request);
		
		if (payload) {
			return NextResponse.redirect(new URL("/home", request.url));
		}
		return NextResponse.redirect(new URL("/landing", request.url));
	}

	// Redirect authenticated users away from /auth and /landing
	if (pathname === "/auth" || pathname === "/landing") {
		const payload = await verifyToken(request);
		if (payload) {
			return NextResponse.redirect(new URL("/home", request.url)); //redirect to /home
		}
		return NextResponse.next();
	}

	//allow unautheticated routes
	if (isUnauthenticatedRoute(pathname)) {
		return NextResponse.next();
	}

	//verify token for protected routes
	const payload = await verifyToken(request);
	if (!payload) {
		return unauthorizedResponse(request);
	}

	if (isAdminRoute(pathname) && payload.role !== "admin") {
		return forbiddenResponse(request);
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!_next/static|_next/image|_next/fonts|_next/fallback|favicon.ico|robots.txt|sitemap.xml).*)"], //match all paths EXCEPT these
};
