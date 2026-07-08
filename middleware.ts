import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const appRoutes = [
  "/dashboard",
  "/employees",
  "/departments",
  "/attendance",
  "/leave",
  "/documents",
  "/payroll",
  "/settings",
];

const authRoutes = ["/login", "/register"];

const authSecret =
  process.env.AUTH_SECRET ?? "development-auth-secret-change-before-production";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/") {
    return NextResponse.rewrite(new URL("/prototype.html", request.url));
  }

  const isAppRoute = appRoutes.some((route) => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  const token = await getToken({ req: request, secret: authSecret });

  if (isAppRoute && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (isAppRoute && token?.organizationId) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-organization-id", String(token.organizationId));

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/register",
    "/dashboard/:path*",
    "/employees/:path*",
    "/departments/:path*",
    "/attendance/:path*",
    "/leave/:path*",
    "/documents/:path*",
    "/payroll/:path*",
    "/settings/:path*",
  ],
};
