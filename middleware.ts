// middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const accessKeyCookie = request.cookies.get('accessKey')?.value;
  const correctKey = process.env.ACCESS_KEY || 'bluedotsyork';

  // Log the current pathname for debugging
  console.debug('Current pathname:', pathname);

  // Skip middleware for the exact /login route and static files (_next)
  if (pathname === '/login' || pathname.startsWith('/_next')) {
    console.log('Skipping middleware for /login or static files');
    return NextResponse.next();
  }

  // If the access key is missing or incorrect, redirect to the login page
  if (!accessKeyCookie || accessKeyCookie !== correctKey) {
    console.log('Redirecting to /login due to missing or incorrect access key');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Allow the request to proceed
  console.log('Access granted');
  return NextResponse.next();
}

// Apply middleware to all routes except the /login page, API routes, and static files (_next)
export const config = {
    matcher: ["/((?!login|api|_next|favicon.ico).*)"],
  };
