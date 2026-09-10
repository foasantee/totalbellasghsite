import { NextResponse, type NextRequest } from "next/server";

const COOKIE_NAME = "tb_admin_session";

/**
 * Cheap early redirect for obviously-unauthenticated /admin/* requests.
 * This only checks the cookie's presence, not its cryptographic validity —
 * that full check happens server-side in app/admin/(protected)/layout.tsx
 * via requireAdmin(). This middleware is defense in depth, not the gate.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login" || !pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const hasCookie = request.cookies.has(COOKIE_NAME);
  if (!hasCookie) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
