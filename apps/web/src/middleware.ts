import { getSessionCookie } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";


export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;


  const session = getSessionCookie(req);
  const onboarded = req.cookies.get("onboarded")?.value === "1";

  if (!session) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  if (pathname.startsWith("/onboarding")) {
    if (onboarded) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  if (!onboarded) {
    return NextResponse.redirect(new URL("/onboarding", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/contact"],
};
