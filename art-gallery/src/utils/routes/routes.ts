export const UNAUTHENTICATED_ROUTES = ["/", "/auth", "/api/auth"];

export const ADMIN_ROUTES = ["/admin", "/api/admin"]; 



//check if route is is in unauthenticated routes list
export function isUnauthenticatedRoute(pathname: string): boolean {
	return UNAUTHENTICATED_ROUTES.some(
		(route) => pathname === route || pathname.startsWith(`${route}/`)
	);
}

//check if route is is in admin routes list
export function isAdminRoute(pathname: string): boolean {
	return ADMIN_ROUTES.some(
		(route) => pathname === route || pathname.startsWith(`${route}/`)
	);
}

//check if the route is an api route
export function isApiPath(pathname: string): boolean {
	return pathname.startsWith("/api");
}
