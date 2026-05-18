import { NextRequest, NextResponse } from "next/server";
import { getAccessTokenFromRequest } from "@/lib/auth/cookies";
import { verifyAccessToken } from "@/lib/auth/signOrVerifyTokens";
import {
	isAdminRoute,
	isUnauthenticatedRoute,
} from "@/utils/routes/routes";

function isApiPath(pathname: string): boolean {
	return pathname.startsWith("/api");
}

function unauthorizedResponse(request: NextRequest): NextResponse {
	if (isApiPath(request.nextUrl.pathname)) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
	return NextResponse.redirect(new URL("/login", request.url));
}

function forbiddenResponse(request: NextRequest): NextResponse {
	if (isApiPath(request.nextUrl.pathname)) {
		return NextResponse.json({ error: "Forbidden" }, { status: 403 });
	}
	return NextResponse.redirect(new URL("/", request.url));
}

// Enforce auth and RBAC for protected routes.
export async function proxy(request: NextRequest): Promise<NextResponse> {
	const { pathname } = request.nextUrl;

	if (isUnauthenticatedRoute(pathname)) {
		return NextResponse.next();
	}

	const token = getAccessTokenFromRequest(request);
	if (!token) {
		return unauthorizedResponse(request);
	}

	const payload = await verifyAccessToken(token);
	if (!payload) {
		return unauthorizedResponse(request);
	}

	if (isAdminRoute(pathname) && payload.role !== "admin") {
		return forbiddenResponse(request);
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/:path*"],
};
