import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
const AUTH_PATHS = ['/sign-in', '/sign-up'];
const PROTECTED_PREFIXES = ['/my-tournaments', '/organizer'];
const LOGIN_PATH = '/sign-in';

function isProtectedPath(pathname: string) {
  return PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
}

function buildLoginRedirect(req: NextRequest) {
  const url = req.nextUrl.clone();
  url.pathname = LOGIN_PATH;
  url.searchParams.set('redirect', req.nextUrl.pathname + req.nextUrl.search);
  return NextResponse.redirect(url);
}


export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const sessionCookie =
    req.cookies.get('__Secure-better-auth.session_token') ??
    req.cookies.get('better-auth.session_token');

  if (sessionCookie?.value && AUTH_PATHS.some(p => pathname === p || pathname.startsWith(`${p}/`))) {
    const url = req.nextUrl.clone();
    url.pathname = '/tournaments';
    url.search = '';
    return NextResponse.redirect(url);
  }

  if (!isProtectedPath(pathname)) return NextResponse.next();
  if (sessionCookie?.value) return NextResponse.next();
  return buildLoginRedirect(req);
}

export const config = {
  matcher: ['/my-tournaments', '/organizer/:path*', '/sign-in', '/sign-up'],
};

