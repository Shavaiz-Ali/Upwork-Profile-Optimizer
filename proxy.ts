import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const { pathname } = req.nextUrl;

        // --- Allow static files and _next requests immediately (redundant with matcher but safe) ---
        if (
            pathname.startsWith("/_next") ||
            pathname.startsWith("/_next/image") ||
            pathname.includes(".") ||
            pathname === "/favicon.ico"
        ) {
            return NextResponse.next();
        }

        // --- User is logged in ---
        if (token) {
            if (pathname === "/login" || pathname === "/sign-up") {
                // Redirect logged-in users away from auth pages
                return NextResponse.redirect(new URL("/dashboard", req.url));
            }

            if (!token.onboardingCompleted && pathname !== "/onboarding") {
                // Redirect to onboarding if not completed
                return NextResponse.redirect(new URL("/onboarding", req.url));
            }

            if (token.onboardingCompleted && pathname === "/onboarding") {
                // Prevent access to onboarding if already completed
                return NextResponse.redirect(new URL("/dashboard", req.url));
            }

            // All other routes allowed
            return NextResponse.next();
        }

        // --- User is NOT logged in ---
        if (pathname === "/login" || pathname === "/sign-up" || pathname === "/") {
            // Allow access to login, sign-up, and landing page
            return NextResponse.next();
        }

        // Everything else requires authentication
        const loginUrl = new URL("/login", req.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
    },
    {
        callbacks: {
            authorized: () => true, // Let our middleware function handle redirects
        },
    }
);

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - .*\\..* (any file with an extension, e.g., image.png)
         */
        "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
    ],
};