import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {

    // THIS IS NOT SECURE!
 
    const sessionCookie = getSessionCookie(request, {
      cookiePrefix: "better-auth",
    });


	return NextResponse.next();
}

export const config = {
	matcher: ["/tournaments"], // Specify the routes the middleware applies to
};