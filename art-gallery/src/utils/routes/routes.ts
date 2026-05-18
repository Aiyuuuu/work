export const UNAUTHENTICATED_ROUTES = ["/", "/login", "/signup", "/api/auth"];

export const ADMIN_ROUTES = ["/admin", "/api/admin"];

export function isUnauthenticatedRoute(pathname: string): boolean {
	return UNAUTHENTICATED_ROUTES.some(
		(route) => pathname === route || pathname.startsWith(`${route}/`)
	);
}

export function isAdminRoute(pathname: string): boolean {
	return ADMIN_ROUTES.some(
		(route) => pathname === route || pathname.startsWith(`${route}/`)
	);
}
