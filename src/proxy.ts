import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("admin_token")?.value;

  // ✅ Allow public routes
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // ✅ Protected routes
  const protectedPaths = ["/", "/products", "/analytics"];

  const isProtected = protectedPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  // Not a protected route → allow
  if (!isProtected) return NextResponse.next();

  // No token → redirect to login
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Token exists → allow (NO verification here)
  return NextResponse.next();
}

/**
 * 🔥 VERY IMPORTANT: Limit where middleware runs
 */
export const config = {
  matcher: ["/", "/products/:path*", "/analytics/:path*"],
};
