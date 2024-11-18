// middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const searchParams = request.nextUrl.searchParams;
  const rtkn = searchParams.get('rtkn');
  const accessKeyCookie = request.cookies.get('accessKey')?.value;
  const correctKey = process.env.ACCESS_KEY || 'LNJsiCYBiLZwzjDYCg8FAk1IaS3IO9NT';

  console.debug('Current pathname:', pathname);

  // Skip middleware for /auth and static files (_next)
  if (pathname === '/auth' || pathname.startsWith('/_next')) {
    console.log('Skipping middleware for /auth or static files');
    return NextResponse.next();
  }

  // If a token is present in the query string, pass it along to the auth page
  if (rtkn) {
    console.log('Redirecting to /auth.');
    const authUrl = new URL('/auth', request.url);
    authUrl.searchParams.set('rtkn', rtkn);
    return NextResponse.redirect(authUrl);
  }

  // If the access key cookie is missing or incorrect, redirect to /auth with preserved token
  if (!accessKeyCookie || accessKeyCookie !== correctKey) {
    console.log('Redirecting to /auth due to missing or incorrect access key');
    const authUrl = new URL('/auth', request.url);

    // Preserve the token if it exists in the original query string
    if (rtkn) {
      authUrl.searchParams.set('rtkn', rtkn);
    }

    return NextResponse.redirect(authUrl);
  }

  // Allow the request to proceed
  console.log('Access granted');
  return NextResponse.next();
}

// Apply middleware to all routes except /auth, API routes, and static files (_next)
export const config = {
  matcher: ["/((?!auth|register|api|_next|favicon.ico).*)"],
};
