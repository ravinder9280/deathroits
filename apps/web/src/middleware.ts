import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const PROTECTED_PREFIXES = ['/my-tournaments'];
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

  if (!isProtectedPath(pathname)) return NextResponse.next();
  if (pathname.startsWith(LOGIN_PATH)) return NextResponse.next();

  // Directly check for the better-auth session cookie
  const sessionCookie =
    req.cookies.get('__Secure-better-auth.session_token') ??
    req.cookies.get('better-auth.session_token'); // fallback for localhost (no __Secure- prefix)

  if (sessionCookie?.value) return NextResponse.next();

  return buildLoginRedirect(req);
}

export const config = {
  matcher: ['/my-tournaments'],
};