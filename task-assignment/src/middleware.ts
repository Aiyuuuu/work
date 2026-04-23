import { NextResponse } from "next/server";
import { NextRequest } from "next/server";


export function middleware(request: NextRequest) {
    const sessionCookie = request.cookies.get('auth_session')
    const { pathname } = request.nextUrl;

    if (!sessionCookie && (pathname.startsWith("/dashboard"))) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (sessionCookie) {
        const user = JSON.parse(sessionCookie.value)
        if (pathname.startsWith('/dashboard/manager') && user.role !== 'MANAGER') {
            return NextResponse.redirect(new URL('/dashboard/employee', request.url));
        }

        if (pathname.startsWith('/dashboard/employee') && user.role !== 'EMPLOYEE') {
            return NextResponse.redirect(new URL('/dashboard/manager', request.url));
        }
    }
    
    return NextResponse.next();
}