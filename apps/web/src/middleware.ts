import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const AUTH_PATHS = ['/sign-in', '/sign-up'];
const PROTECTED_PREFIXES = ['/my-tournaments', '/my-profile'];
const LOGIN_PATH = '/sign-in';

// Paths that need a session but are NOT role-gated
const SESSION_REQUIRED_PATHS = ['/organizer/apply'];

// Only routes under /organizer/dashboard are role-gated
const ORGANIZER_DASHBOARD_PREFIX = '/organizer/dashboard';

const AUTH_API_ORIGIN =
  process.env.NEXT_PUBLIC_API_ORIGIN ?? 'http://localhost:3001';

// ── Helpers ──────────────────────────────────────────────────────────────────

function isProtectedPath(pathname: string) {
  return PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
}

function isOrganizerDashboardPath(pathname: string) {
  return (
    pathname === ORGANIZER_DASHBOARD_PREFIX ||
    pathname.startsWith(`${ORGANIZER_DASHBOARD_PREFIX}/`)
  );
}

function isSessionRequiredPath(pathname: string) {
  return SESSION_REQUIRED_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
}

function buildLoginRedirect(req: NextRequest) {
  const url = req.nextUrl.clone();
  url.pathname = LOGIN_PATH;
  url.searchParams.set('redirect', req.nextUrl.pathname + req.nextUrl.search);
  return NextResponse.redirect(url);
}

/** Fetch the live session from the auth API — returns null if unauthenticated. */
async function getSession(req: NextRequest) {
  try {
    const res = await fetch(`${AUTH_API_ORIGIN}/api/auth/get-session`, {
      headers: {
        cookie: req.headers.get('cookie') ?? '',
      },
      // Don't follow redirects — a non-200 means no session
      redirect: 'error',
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.session ? data : null;
  } catch {
    return null;
  }
}

// ── Middleware ────────────────────────────────────────────────────────────────

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Fast "do we have a session cookie at all?" check — avoids a network call
  // on public routes where we only need to redirect already-authenticated users.
  const sessionCookie =
    req.cookies.get('__Secure-better-auth.session_token') ??
    req.cookies.get('better-auth.session_token');

  // 1. Redirect authenticated users away from auth pages (/sign-in, /sign-up)
  if (
    sessionCookie?.value &&
    AUTH_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))
  ) {
    const url = req.nextUrl.clone();
    url.pathname = '/tournaments';
    url.search = '';
    return NextResponse.redirect(url);
  }

  // 2. /organizer/dashboard/* — requires "organizer" role
  if (isOrganizerDashboardPath(pathname)) {
    if (!sessionCookie?.value) return buildLoginRedirect(req);

    // Verify role via the auth API (session cookie alone isn't enough)
    const session = await getSession(req);
    if (!session) return buildLoginRedirect(req);

    const role = session?.user?.role as string | undefined;
    if (role !== 'ORGANIZER' && role !== 'ADMIN') {
      const url = req.nextUrl.clone();
      url.pathname = '/organizer';
      url.search = '';
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  }

  // 3. /organizer/apply — requires a session; organizers are sent to their dashboard
  if (isSessionRequiredPath(pathname)) {
    if (!sessionCookie?.value) return buildLoginRedirect(req);

    // Already an organizer — no need to apply again
    const session = await getSession(req);
    if (!session) return buildLoginRedirect(req);

    const role = session?.user?.role as string | undefined;
    if (role === 'ORGANIZER' || role === 'ADMIN') {
      const url = req.nextUrl.clone();
      url.pathname = '/organizer/dashboard';
      url.search = '';
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  }

  // 4. /organizer (landing) — always public, no checks needed

  // 5. General protected paths (/my-tournaments, /my-profile)
  if (!isProtectedPath(pathname)) return NextResponse.next();
  if (!sessionCookie?.value) return buildLoginRedirect(req);

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/my-tournaments',
    '/my-profile',
    '/organizer/apply',
    '/organizer/dashboard',
    '/organizer/dashboard/:path*',
    '/sign-in',
    '/sign-up',
  ],
};
