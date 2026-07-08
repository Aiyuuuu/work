import {
  PROTECTED_ROUTES,
  API_ROUTE_PREFIX
} from "@/constants/routeConstants";



//check if route is in protected routes list
function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

function isApiRoute(pathname: string): boolean {
  return pathname.startsWith(API_ROUTE_PREFIX)}

export { 
	isProtectedRoute, 
  isApiRoute
};
