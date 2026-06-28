import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const AUTH_PATHS = ['/sign-in', '/sign-up'];
const PROTECTED_PREFIXES = ['/my-tournaments', '/organizer', '/my-profile'];
const ORGANIZER_PREFIX = '/organizer';
const LOGIN_PATH = '/sign-in';

function isProtectedPath(pathname: string) {
  return PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
}

function isOrganizerPath(pathname: string) {
  return pathname === ORGANIZER_PREFIX || pathname.startsWith(`${ORGANIZER_PREFIX}/`);
}

function buildLoginRedirect(req: NextRequest) {
  const url = req.nextUrl.clone();
  url.pathname = LOGIN_PATH;
  url.searchParams.set('redirect', req.nextUrl.pathname + req.nextUrl.search);
  return NextResponse.redirect(url);
}

function buildHomeRedirect(req: NextRequest) {
  const url = req.nextUrl.clone();
  url.pathname = '/';
  url.search = '';
  return NextResponse.redirect(url);
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const sessionCookie =
    req.cookies.get('__Secure-better-auth.session_token') ??
    req.cookies.get('better-auth.session_token');

  // Redirect authenticated users away from auth pages
  if (sessionCookie?.value && AUTH_PATHS.some(p => pathname === p || pathname.startsWith(`${p}/`))) {
    const url = req.nextUrl.clone();
    url.pathname = '/tournaments';
    url.search = '';
    return NextResponse.redirect(url);
  }

  // Require session for protected routes
  if (!isProtectedPath(pathname)) return NextResponse.next();
  if (!sessionCookie?.value) return buildLoginRedirect(req);

  // Organizer-only guard — check the role stored in the session cookie payload
  // better-auth stores user data we can read from a separate cookie set during login
  if (isOrganizerPath(pathname)) {
    const roleCookie = req.cookies.get('user_role');
    const role = roleCookie?.value;
    // If we have a definitive non-organizer role, redirect home
    if (role && role !== 'ORGANIZER' && role !== 'ADMIN') {
      return buildHomeRedirect(req);
    }
    // If role cookie is absent we allow through — the page & API will enforce it client/server-side
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/my-tournaments', '/organizer/:path*', '/sign-in', '/sign-up', '/my-profile'],
};


