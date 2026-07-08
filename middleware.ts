import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const appRoutes = [
  '/dashboard',
  '/employees',
  '/departments',
  '/attendance',
  '/leave',
  '/documents',
  '/payroll',
  '/settings',
]

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === '/') {
    return NextResponse.rewrite(new URL('/prototype.html', request.url))
  }

  if (appRoutes.some((route) => request.nextUrl.pathname.startsWith(route))) {
    const requestHeaders = new Headers(request.headers)

    // Replace this placeholder with Auth.js or Clerk session lookup.
    // The organizationId should come from the authenticated membership, not user input.
    const organizationId =
      request.cookies.get('organizationId')?.value ??
      request.headers.get('x-organization-id')

    if (organizationId) {
      requestHeaders.set('x-organization-id', organizationId)
    }

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }
}

export const config = {
  matcher: [
    '/',
    '/dashboard/:path*',
    '/employees/:path*',
    '/departments/:path*',
    '/attendance/:path*',
    '/leave/:path*',
    '/documents/:path*',
    '/payroll/:path*',
    '/settings/:path*',
  ],
}
