import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const headers = new Headers(request.headers)
  headers.set('x-pathname', request.nextUrl.pathname)
}

export const config = {
  matcher: ['/explorer/:path*'],
}
