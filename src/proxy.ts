/**
 * Next.js Proxy (formerly "Middleware")
 * Handles route protection and role-based access control.
 *
 * Next.js 16 renamed the middleware.ts convention to proxy.ts — same
 * mechanism, different file name and export name. Proxy always runs on
 * the Node.js runtime in Next.js 16 (it's no longer configurable), which
 * is actually what we need anyway to call auth.api.getSession().
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAuthRoute =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/forgot-password");

  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isAdminRoute = pathname.startsWith("/admin") && !pathname.startsWith("/admin/login");

  // Only hit the database when the route actually needs auth info.
  if (!isAuthRoute && !isDashboardRoute && !isAdminRoute) {
    return NextResponse.next();
  }

  const session = await auth.api.getSession({ headers: request.headers });

  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if ((isDashboardRoute || isAdminRoute) && !session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAdminRoute && session) {
    const role = (session.user as { role?: string }).role;
    const allowedRoles = ["SUPER_ADMIN", "ADMIN", "MANAGER", "STAFF"];
    if (!role || !allowedRoles.includes(role)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/login", "/register", "/forgot-password"],
};