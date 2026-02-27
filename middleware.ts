import { NextRequest, NextResponse } from "next/server";

// Routes that require authentication
const protectedRoutes = ["/admin", "/profile", "/library"];

// Routes that should redirect to home if already logged in
const authRoutes = ["/auth/signin", "/auth/signup"];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Get the session token from cookies (better-auth uses this cookie name)
    const sessionToken =
        request.cookies.get("better-auth.session_token")?.value ||
        request.cookies.get("__Secure-better-auth.session_token")?.value;

    const isAuthenticated = !!sessionToken;

    // Check if user is trying to access a protected route
    const isProtectedRoute = protectedRoutes.some(
        (route) => pathname === route || pathname.startsWith(route + "/")
    );

    // Check if user is trying to access auth routes
    const isAuthRoute = authRoutes.some(
        (route) => pathname === route || pathname.startsWith(route + "/")
    );

    // Redirect unauthenticated users from protected routes to sign in
    if (isProtectedRoute && !isAuthenticated) {
        const signInUrl = new URL("/auth/signin", request.url);
        signInUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(signInUrl);
    }

    // Redirect authenticated users away from auth pages
    if (isAuthRoute && isAuthenticated) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all routes except:
         * - api routes (they handle their own auth)
         * - _next (Next.js internals)
         * - static files (images, fonts, etc)
         */
        "/((?!api|_next|.*\\..*).*)",
    ],
};
