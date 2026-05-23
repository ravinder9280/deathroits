// middleware.ts
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_API_ORIGIN}/api/auth/get-session`, {
			headers: {
				cookie: request.headers.get("cookie") || "",
			},
		}
	);

	if (!response.ok) {
		return NextResponse.redirect(new URL("/sign-in", request.url));
	}

	const session = await response.json();

	if (!session) {
		return NextResponse.redirect(new URL("/sign-in", request.url));
	}

	return NextResponse.next();
}