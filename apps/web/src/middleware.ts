// middleware.ts
import { betterFetch } from '@better-fetch/fetch';
import type { authClient } from "./lib/auth-client";
import { NextRequest, NextResponse } from "next/server";

type Session = typeof authClient.$Infer.Session;

export async function middleware(request: NextRequest) {
  const { data: session } = await betterFetch<Session>(
    "/api/auth/get-session",
    {
      baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // your backend URL
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    }
  );

  if (!session) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/tournaments"],
};